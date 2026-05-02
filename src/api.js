const BASE =  'http://194.238.18.68:5045/api/web/v1'
console.log('[api.js] ✅ LOADED — getZones uses zone/view directly')

// ── GLOBAL AUTH STORE ─────────────────────────────────────────────────────────
const _auth = {
  api_key: localStorage.getItem('api_key') || '',
  e_id:    localStorage.getItem('e_id')    || import.meta.env.VITE_E_ID || '',
}

export function setAuth({ api_key, e_id, ...rest }) {
  if (api_key) { _auth.api_key = api_key; localStorage.setItem('api_key', api_key) }
  if (e_id)    { _auth.e_id    = e_id;    localStorage.setItem('e_id',    e_id)    }
  localStorage.setItem('authUser', JSON.stringify({ api_key, e_id, ...rest }))
}

function getAuth() {
  let stored = {}
  try { stored = JSON.parse(localStorage.getItem('authUser') || '{}') } catch {}
  const api_key =
    _auth.api_key ||
    localStorage.getItem('api_key') ||
    stored.api_key || stored.token || stored.accessToken || stored.key || ''
  const e_id =
    _auth.e_id ||
    localStorage.getItem('e_id') ||
    stored.e_id || stored.enterprise_id || stored.eid ||
    import.meta.env.VITE_E_ID || ''
  if (!api_key) console.warn('[getAuth] api_key is empty — check login response field names')
  return { api_key, e_id: String(e_id) }
}

export function getAuthHeader() {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('api_key')
  if (!token) return {}
  const isJwt = token.split('.').length === 3
  return isJwt
    ? { Authorization: `Bearer ${token}` }
    : { 'X-API-Key': token }
}

export function notifyZonesUpdated() {
  if (typeof window !== 'undefined' && window?.dispatchEvent) {
    window.dispatchEvent(new Event('zones-updated'))
  }
}

const str = v => (v == null ? '' : String(v))

// ── AUTHENTICATION ────────────────────────────────────────────────────────────
export async function login(credentials) {
  const res = await fetch(`${BASE}/signin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  const contentType = res.headers.get('Content-Type') || ''
  const data = contentType.includes('application/json') ? await res.json() : null
  if (!res.ok) {
    const msg = data?.message || data?.error || `Login failed: ${res.status}`
    throw new Error(msg)
  }
  if (data) setAuth(data)
  return data
}

// ── LEGACY JSON-SERVER HELPERS ────────────────────────────────────────────────
async function getAll(endpoint) {
  const res = await fetch(`${BASE}/${endpoint}`)
  if (!res.ok) throw new Error(`Server error ${res.status} — is json-server running on port 3001?`)
  return res.json()
}

async function fetchOne(endpoint, filters) {
  const all = await getAll(endpoint)
  const match = all.find(row => {
    const unitMatch  = row.unit === filters.unit
    const dateMatch  = row.date === filters.date
    const shiftMatch = !filters.shift || row.shift === filters.shift
    return unitMatch && dateMatch && shiftMatch
  })
  if (!match) throw new Error(`No data for: ${filters.unit} | ${filters.shift || 'any'} | ${filters.date}`)
  return match
}

async function fetchMany(endpoint, filters) {
  const all = await getAll(endpoint)
  return all.filter(row => {
    const unitMatch  = row.unit === filters.unit
    const dateMatch  = row.date === filters.date
    const shiftMatch = !filters.shift || row.shift === filters.shift
    return unitMatch && dateMatch && shiftMatch
  })
}

async function fetchById(endpoint, id) {
  const all = await getAll(endpoint)
  const match = all.find(row => row.id === id || row.empId === id)
  if (!match) throw new Error(`Not found: ${endpoint} / ${id}`)
  return match
}

async function getMany(endpoint) {
  const res = await fetch(`${BASE}/${endpoint}`)
  if (!res.ok) throw new Error(`Server error ${res.status} fetching ${endpoint}`)
  return res.json()
}

async function postOne(endpoint, body) {
  const res = await fetch(`${BASE}/${endpoint}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Server error ${res.status} posting to ${endpoint}`)
  return res.json()
}

async function putOne(endpoint, id, body) {
  const res = await fetch(`${BASE}/${endpoint}/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Server error ${res.status} updating ${endpoint}/${id}`)
  return res.json()
}

async function patchOne(endpoint, id, body) {
  const res = await fetch(`${BASE}/${endpoint}/${id}`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Server error ${res.status} patching ${endpoint}/${id}`)
  return res.json()
}

async function deleteOne(endpoint, id) {
  const res = await fetch(`${BASE}/${endpoint}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Server error ${res.status} deleting ${endpoint}/${id}`)
  return true
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function toDateStr(d) {
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(d)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function datesBetween(start, end) {
  const dates = []
  const cur = new Date(start)
  cur.setHours(0, 0, 0, 0)
  const last = new Date(end)
  last.setHours(0, 0, 0, 0)
  while (cur <= last) {
    dates.push(toDateStr(new Date(cur)))
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
export const fetchTripStats        = f => fetchOne('tripStats',       f)
export const fetchAttendanceStats  = f => fetchOne('attendanceStats', f)
export const fetchTodayStats       = f => fetchOne('todayStats',      f)
export const fetchTodayStatsByDate = async (date) => {
  const all = await getAll('todayStats')
  return all.filter(row => row.date === date)
}
export const fetchSchedule = f => fetchMany('schedule', f)

export async function fetchTripStatsRange(filters) {
  const { unit, dateStart, dateEnd } = filters
  const all = await getAll('tripStats')
  const dates = datesBetween(dateStart, dateEnd)
  const rows = all.filter(row => row.unit === unit && dates.includes(row.date))
  if (rows.length === 0)
    throw new Error(`No data found for ${unit} between ${dateStart} and ${dateEnd}`)
  const totals = rows.reduce(
    (acc, r) => ({
      allTrips:  acc.allTrips  + (r.allTrips  ?? 0),
      completed: acc.completed + (r.completed ?? 0),
      missed:    acc.missed    + (r.missed    ?? 0),
      ontime:    acc.ontime    + (r.ontime    ?? 0),
      late:      acc.late      + (r.late      ?? 0),
      _effSum:   acc._effSum   + (r.efficiency ?? 0) * (r.allTrips ?? 0),
    }),
    { allTrips: 0, completed: 0, missed: 0, ontime: 0, late: 0, _effSum: 0 }
  )
  const efficiency = totals.allTrips > 0 ? Math.round(totals._effSum / totals.allTrips) : 0
  return { allTrips: totals.allTrips, completed: totals.completed, missed: totals.missed, ontime: totals.ontime, late: totals.late, efficiency }
}

// ── SCHEDULE PAGE ─────────────────────────────────────────────────────────────
export const fetchScheduleList        = f  => fetchMany('schedule',          f)
export const fetchTripDetails         = id => fetchById('tripDetails',        id)
export const fetchTripDetailByFilters = f  => fetchOne ('tripDetails',        f)
export const fetchEfficientEmployees  = f  => fetchOne ('efficientEmployees', f)

// ── ATTENDANCE PAGE ───────────────────────────────────────────────────────────
export const fetchAttendanceList           = f  => fetchOne ('attendanceList',           f)
export const fetchEmployeeAttendanceDetail = id => fetchById('employeeAttendanceDetail', id)
export const fetchPunctualEmployees        = f  => fetchOne ('punctualEmployees',        f)

// ── MASTER FORM — USERS ───────────────────────────────────────────────────────
export const getUsers    = ()      => getMany('users')
export const getUserById = (id)    => fetchById('users', id)
export const createUser  = (body)  => postOne('users', body)
export const updateUser  = (id, b) => putOne('users', id, b)
export const patchUser   = (id, b) => patchOne('users', id, b)
export const deleteUser  = (id)    => deleteOne('users', id)

export async function getEmployeeNames() {
  const all = await getAll('attendanceList')
  const seen = new Set()
  for (const row of all) {
    for (const emp of (row.employees ?? [])) {
      if (emp.name) seen.add(emp.name)
    }
  }
  return [...seen].sort()
}

// ── MASTER FORM — LOCATIONS ───────────────────────────────────────────────────
export const getLocations    = ()      => getMany('locations')
export const getLocationById = (id)    => fetchById('locations', id)
export const createLocation  = (body)  => postOne('locations', body)
export const updateLocation  = (id, b) => putOne('locations', id, b)
export const patchLocation   = (id, b) => patchOne('locations', id, b)
export const deleteLocation  = (id)    => deleteOne('locations', id)

// ── MASTER FORM — SCHEDULES ───────────────────────────────────────────────────
export const getSchedules    = ()      => getMany('masterSchedules')
export const getScheduleById = (id)    => fetchById('masterSchedules', id)
export const createSchedule  = (body)  => postOne('masterSchedules', body)
export const updateSchedule  = (id, b) => putOne('masterSchedules', id, b)
export const patchSchedule   = (id, b) => patchOne('masterSchedules', id, b)
export const deleteSchedule  = (id)    => deleteOne('masterSchedules', id)

// ── MASTER FORM — TASKS ───────────────────────────────────────────────────────
export const getTasks    = ()      => getMany('tasks')
export const getTaskById = (id)    => fetchById('tasks', id)
export const createTask  = (body)  => postOne('tasks', body)
export const updateTask  = (id, b) => putOne('tasks', id, b)
export const patchTask   = (id, b) => patchOne('tasks', id, b)
export const deleteTask  = (id)    => deleteOne('tasks', id)

// ── MASTER FORM — TRIPS ───────────────────────────────────────────────────────
export const getTrips    = ()      => getMany('masterTrips')
export const getTripById = (id)    => fetchById('masterTrips', id)
export const createTrip  = (body)  => postOne('masterTrips', body)
export const updateTrip  = (id, b) => putOne('masterTrips', id, b)
export const patchTrip   = (id, b) => patchOne('masterTrips', id, b)
export const deleteTrip  = (id)    => deleteOne('masterTrips', id)

// ── OTHERS — EMPLOYEES ────────────────────────────────────────────────────────
export const getEmployees    = ()      => getMany('employees')
export const getEmployeeById = (id)    => fetchById('employees', id)
export const createEmployee  = (body)  => postOne('employees', body)
export const updateEmployee  = (id, b) => putOne('employees', id, b)
export const patchEmployee   = (id, b) => patchOne('employees', id, b)
export const deleteEmployee  = (id)    => deleteOne('employees', id)

// ── MASTER FORM — DESIGNATIONS ────────────────────────────────────────────────
export async function getDesignations() {
  const auth = getAuth()
  // designation/view returns empty on this server — use filter instead
  const res = await fetch(`${BASE}/designation/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 0, name: 'all',
      limit: 100, offset: 0,
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to fetch designations')
  const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
  return records.map(r => ({ id: r.id, designationName: str(r.name || r.designation_name || r.designationName) }))
}

export async function getDesignationById(id) {
  const all = await getDesignations()
  const match = all.find(r => r.id === id)
  if (!match) throw new Error(`Designation not found: ${id}`)
  return match
}

export async function createDesignation(form) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/designation/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 0, name: form.designationName, zone_id: form.zone_id || 0,
      limit: '10', offset: '0',
      lat: '0', lon: '0', adrs1: '-', adrs2: '-', city: '-',
      district: '-', state: '-', country: 'india',
      zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { throw new Error('Server returned non-JSON — check designation/create endpoint') }
  if (data.error || !data.result) throw new Error(data.message || 'Failed to create designation')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  return { id: r.id || Date.now(), designationName: r.name || r.designation_name || r.designationName || form.designationName }
}

export async function updateDesignation(id, form) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/designation/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id, name: form.designationName, zone_id: form.zone_id || 0,
      limit: '10', offset: '0',
      lat: '0', lon: '0', adrs1: '-', adrs2: '-', city: '-',
      district: '-', state: '-', country: 'india',
      zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to update designation')
  return { id, designationName: form.designationName }
}

export async function deleteDesignation(id) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/designation/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      limit: '10', offset: '0',
      lat: '0', lon: '0', adrs1: '-', adrs2: '-', city: '-',
      district: '-', state: '-', country: 'india',
      zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to delete designation')
  return true
}

// ── MASTER FORM — DEPARTMENTS ─────────────────────────────────────────────────
export async function getDepartments() {
  const auth = getAuth()
  // department/view returns empty on this server — use filter instead
  const res = await fetch(`${BASE}/department/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 0, name: 'all',
      limit: 100, offset: 0,
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to fetch departments')
  const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
  return records.map(r => ({ id: r.id, departmentName: str(r.name || r.department_name || r.departmentName) }))
}

export async function getDepartmentById(id) {
  const all = await getDepartments()
  const match = all.find(r => r.id === id)
  if (!match) throw new Error(`Department not found: ${id}`)
  return match
}

export async function createDepartment(form) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/department/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 0, name: form.departmentName, zone_id: form.zone_id || 0,
      limit: '10', offset: '0',
      lat: '0', lon: '0', adrs1: '-', adrs2: '-', city: '-',
      district: '-', state: '-', country: 'india',
      zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { throw new Error('Server returned non-JSON — check department/create endpoint') }
  if (data.error || !data.result) throw new Error(data.message || 'Failed to create department')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  return { id: r.id || Date.now(), departmentName: r.name || r.department_name || r.departmentName || form.departmentName }
}

export async function updateDepartment(id, form) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/department/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id, name: form.departmentName, zone_id: form.zone_id || 0,
      limit: '10', offset: '0',
      lat: '0', lon: '0', adrs1: '-', adrs2: '-', city: '-',
      district: '-', state: '-', country: 'india',
      zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to update department')
  return { id, departmentName: form.departmentName }
}

export async function deleteDepartment(id) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/department/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      limit: '10', offset: '0',
      lat: '0', lon: '0', adrs1: '-', adrs2: '-', city: '-',
      district: '-', state: '-', country: 'india',
      zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to delete department')
  return true
}

export async function filterDepartments(name = 'all') {
  const auth = getAuth()
  const res = await fetch(`${BASE}/department/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 0, name: name || 'all',
      limit: 100, offset: 0,
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to filter departments')
  const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
  return records.map(r => ({ id: r.id, departmentName: str(r.name || r.department_name || r.departmentName) }))
}

export async function filterDesignations(name = 'all') {
  const auth = getAuth()
  const res = await fetch(`${BASE}/designation/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 0, name: name || 'all',
      limit: 100, offset: 0,
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to filter designations')
  const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
  return records.map(r => ({ id: r.id, designationName: str(r.name || r.designation_name || r.designationName) }))
}

// ✅ uses patrol_type/filter — confirmed correct path from Postman
export async function filterPatrolTypes(name = 'all') {
  const auth = getAuth()
  const res = await fetch(`${BASE}/patrol_type/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 0, name: name || 'all',
      limit: 100, offset: 0,
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to filter patrol types')
  const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
  return records.map(r => ({ id: r.id ?? r.value, patrolName: str(r.name || r.patrol_name || r.patrolName || r.label) }))
}

// ── OTHERS — ZONES ────────────────────────────────────────────────────────────
function zoneFromRecord(r) {
  // zone/filter returns { value: id, label: name }
  // zone/view / zone/create / zone/update returns full shape
  const id       = r.id      ?? r.value ?? null
  const zoneFull = str(r.label || r.name || r.zone || r.l_name || r.s_name || '').trim()

  const district = str(r.dist_name    || r.district || '')
  const state    = str(r.state_name   || r.state    || '')
  const country  = str(r.country_name || r.country  || '')
  const pincode  = str(r.zipcode      || r.zip_code || '')

  // Server returns adrs1/adrs2 (Postman confirmed) — also handle address_l1/l2
  const adrs1 = str(r.adrs1 || r.address_l1 || '')
  const adrs2 = str(r.adrs2 || r.address_l2 || '')
  const city  = str(r.city  || '')

  // Clean coord: strip degree symbols/direction letters the server may echo back
  const cleanCoord = v => {
    const n = parseFloat(str(v).replace(/[°NSEW\s]/gi, ''))
    return isNaN(n) ? 0 : n
  }

  const lat = cleanCoord(r.lat)
  const lng = cleanCoord(r.lon ?? r.lng)

  // Compute liveAddress from parts
  const liveAddress = str(r.live_address || r.liveAddress || '')
    || [adrs1, adrs2, city, district, state, country, pincode].filter(Boolean).join(', ')

  return {
    id,
    zoneNameLong : zoneFull,
    zoneNameShort: str(r.s_name || r.code || ''),
    zoneName     : zoneFull,
    code         : str(r.code   || ''),
    lat,
    lng,
    liveAddress,
    addressLine1 : adrs1,
    addressLine2 : adrs2,
    city,
    district,
    state,
    country,
    pincode,
    email        : str(r.mail    || r.email  || ''),
    mobile       : str(r.mobile  || ''),
    createdAt    : r.created_at,
    updatedAt    : r.updated_at,
  }
}

function zoneToBody(form, auth, id = 0) {
  const name = (
    str(form.zoneName).trim() ||
    str(form.zoneNameLong).trim() ||
    str(form.name).trim() ||
    'zone'
  )
  // Clean lat/lon: strip degree symbols, directional letters, extra whitespace
  // Backend accepts plain decimal strings like "11.0271" not "11.0271° N"
  const cleanCoord = v => {
    const s = str(v).replace(/[°NSEW\s]/gi, '').trim()
    return s || '0'
  }
  const lat = cleanCoord(form.lat  || '0')
  const lon = cleanCoord(form.lng  || form.lon || '0')

  return {
    id,
    limit   : '10',   // Postman sends as string
    offset  : '0',    // Postman sends as string
    name,
    lat,
    lon,
    adrs1   : str(form.addressLine1) || '-',
    adrs2   : str(form.addressLine2) || '-',
    city    : str(form.city)         || '-',
    district: str(form.district)     || '-',
    state   : str(form.state)        || '-',
    country : str(form.country).toLowerCase() || 'india',
    zipcode : str(form.pincode)      || '000000',
    mail    : str(form.email)        || 'a@a.com',
    mobile  : str(form.mobile)       || '0000000000',
    e_id    : auth.e_id,
    api_key : auth.api_key,
  }
}

// ── ZONE LOCAL CACHE ──────────────────────────────────────────────────────────
// zone/view returns full details (adrs1, adrs2, city, district, state, country, mail, mobile, zipcode)
// We also cache full zone data in localStorage after every create/update/clone
// so detail modal is instant even without a network call.

const ZONE_CACHE_KEY = 'zone_cache_v1'

function zoneCache_read() {
  try { return JSON.parse(localStorage.getItem(ZONE_CACHE_KEY) || '{}') } catch { return {} }
}
function zoneCache_save(id, zone) {
  const cache = zoneCache_read()
  cache[String(id)] = { ...zone, _cachedAt: Date.now() }
  localStorage.setItem(ZONE_CACHE_KEY, JSON.stringify(cache))
}
function zoneCache_delete(id) {
  const cache = zoneCache_read()
  delete cache[String(id)]
  localStorage.setItem(ZONE_CACHE_KEY, JSON.stringify(cache))
}
function zoneCache_merge(stubs) {
  const cache = zoneCache_read()
  return stubs.map(stub => {
    const id     = stub.value ?? stub.id
    const cached = cache[String(id)]
    // Prefer cached (has full address/contact details from form save)
    // Always use the freshest name label from the stub
    if (cached) {
      const zone = zoneFromRecord({
        ...cached,
        value : id,
        label : stub.label ?? stub.name ?? cached.zoneName ?? '',
      })
      return zone
    }
    // No cache — just the stub (name only)
    return zoneFromRecord(stub)
  })
}

// getZones:
//   Step 1 — Try zone/view (minimal body: id+auth only) → full details if server supports it
//   Step 2 — Try zone/view (full body with all fields)  → alternate format
//   Step 3 — Fall back to zone/filter stubs merged with localStorage cache
//
// NOTE: zone/filter only returns {value, label} — no address/contact data.
// Full details come from: zone/view API OR localStorage cache (populated on create/update).
export async function getZones() {
  const auth = getAuth()
  // ── Step 1: zone/view minimal body (just id + auth) ──
  const tryView = async (extraFields = {}) => {
    try {
      const res = await fetch(`${BASE}/zone/view`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          id: 0, limit: '100', offset: '0',
          e_id: auth.e_id, api_key: auth.api_key,
          ...extraFields,
        }),
      })
      const data = await res.json()
      console.log(data);
      if (!data.error && data.result) {
        let records = []
        if      (Array.isArray(data.data?.records)) records = data.data.records
        else if (Array.isArray(data.data))           records = data.data
        else if (Array.isArray(data.records))        records = data.records
        if (records.length > 0) {
          const zones = records.map(r => zoneFromRecord(r))
          // Cache each zone so future loads are instant
          zones.forEach(z => { if (z.id) zoneCache_save(z.id, { ...z }) })
          return zones
        }
      }
    } catch {}
    return null
  }

  // Try minimal body first
  const viewResult = await tryView()
  if (viewResult) return viewResult

  // Try with full required fields (server may need them for auth schema)
  const viewResult2 = await tryView({
    name: 'all', lat: '0', lon: '0',
    adrs1: '-', adrs2: '-', city: '-',
    district: '-', state: '-', country: 'india',
    zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
  })
  if (viewResult2) return viewResult2

  // ── Step 3: zone/filter stubs + localStorage cache ──
  const filterBody = {
    id: 0, limit: '100', offset: '0', name: 'all',
    lat: '0', lon: '0', adrs1: '-', adrs2: '-', city: '-',
    district: '-', state: '-', country: 'india',
    zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
    e_id: auth.e_id, api_key: auth.api_key,
  }
  const res  = await fetch(`${BASE}/zone/filter`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(filterBody),
  })
  const data = await res.json()

  if (data.error || !data.result) throw new Error(data.message || 'Failed to fetch zones')

  let stubs = []
  if      (Array.isArray(data.data?.records)) stubs = data.data.records
  else if (Array.isArray(data.data))          stubs = data.data
  else if (Array.isArray(data.records))       stubs = data.records

  // Merge with localStorage cache — full details available for recently created/edited zones
  return zoneCache_merge(stubs)
}

// getZoneFilter — returns dropdown-style list via zone/filter
// Uses '%' wildcard to match all zone names for this e_id
export async function getZoneFilter() {
  const auth = getAuth()
  const body = {
    id      : 0,
    limit   : '100',
    offset  : '0',
    name    : 'all',   // ✅ confirmed working value
    lat     : '0',
    lon     : '0',
    adrs1   : '-',
    adrs2   : '-',
    city    : '-',
    district: '-',
    state   : '-',
    country : 'india',
    zipcode : '000000',
    mail    : 'a@a.com',
    mobile  : '0000000000',
    e_id    : auth.e_id,
    api_key : auth.api_key,
  }
  const res = await fetch(`${BASE}/zone/filter`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(body),
  })
  const data = await res.json()
  if (data.error || !data.result) return []
  const records = Array.isArray(data.data?.records) ? data.data.records
                : Array.isArray(data.data)           ? data.data : []
  return records
}

export async function createZone(form) {
  const auth = getAuth()
  if (!auth.api_key) throw new Error('Not authenticated — please log in first')
  const body = zoneToBody(form, auth)
  const res  = await fetch(`${BASE}/zone/create`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(body),
  })
  const data = await res.json()
  if (data.error || !data.result) {
    console.error('createZone failed', { body, data })
    throw new Error(data.message || 'Failed to create zone')
  }

  // Server returns {"error":false,"result":true,"message":"Successfully Created"} with no id/data.
  // Find the newly created zone by re-fetching the full filter list and matching by name.
  const zoneName = str(form.zoneName || form.zoneNameLong || '').trim()
  let resolvedId = null
  try {
    const filterBody = {
      id: 0, limit: '100', offset: '0', name: 'all',
      lat: '0', lon: '0', adrs1: '-', adrs2: '-', city: '-',
      district: '-', state: '-', country: 'india',
      zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
      e_id: auth.e_id, api_key: auth.api_key,
    }
    const fr   = await fetch(`${BASE}/zone/filter`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(filterBody) })
    const fd   = await fr.json()
    let list   = []
    if      (Array.isArray(fd.data?.records)) list = fd.data.records
    else if (Array.isArray(fd.data))          list = fd.data
    else if (Array.isArray(fd.records))       list = fd.records
    // Match by zone name (label), take the highest id as the newest
    const matches = list.filter(s => str(s.label || s.name || '').trim().toLowerCase() === zoneName.toLowerCase())
    if (matches.length > 0) {
      resolvedId = matches.reduce((max, s) => ((s.id ?? s.value) > max ? (s.id ?? s.value) : max), 0)
    }
    // Fallback: just take the highest id overall (newest record)
    if (!resolvedId && list.length > 0) {
      resolvedId = list.reduce((max, s) => ((s.id ?? s.value) > max ? (s.id ?? s.value) : max), 0)
    }
  } catch {}

  const finalId = resolvedId || Date.now()
  // ✅ Cache full form data keyed by resolved id so it shows in the list with all details
  const cacheEntry = { ...form, id: finalId, zoneName }
  zoneCache_save(finalId, cacheEntry)
  notifyZonesUpdated()
  return zoneFromRecord({ ...cacheEntry, lon: form.lng })
}

export async function updateZone(id, form) {
  const auth = getAuth()
  if (!auth.api_key) throw new Error('Not authenticated — please log in first')
  const body = zoneToBody(form, auth, id)
  const res  = await fetch(`${BASE}/zone/update`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(body),
  })
  const data = await res.json()
  if (data.error || !data.result) {
    console.error('updateZone failed', { body, data })
    throw new Error(data.message || 'Failed to update zone')
  }
  // ✅ Update cache with new form data including zoneName
  zoneCache_save(id, { ...form, id, zoneName: form.zoneName || form.zoneNameLong || '' })
  notifyZonesUpdated()
  return { ...form, id }
}

export async function cloneZone(id) {
  const auth = getAuth()
  const res  = await fetch(`${BASE}/zone/clone`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ id, limit: '10', offset: '0', e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to clone zone')
  notifyZonesUpdated()
  const r        = (data.data || [])[0] || {}
  const zoneName = str(r.l_name || r.zone || r.name).trim()
  const cleanCoord = v => {
    const n = parseFloat(str(v).replace(/[°NSEW\s]/gi, ''))
    return isNaN(n) ? 0 : n
  }
  const cloned   = {
    id           : r.id,
    zoneName,
    zoneNameLong : zoneName,
    zoneNameShort: str(r.s_name),
    code         : str(r.code),
    lat          : cleanCoord(r.lat) || 20.5937,
    lng          : cleanCoord(r.lon ?? r.lng) || 78.9629,
    liveAddress  : '',
    addressLine1 : str(r.adrs1 || r.address_l1),
    addressLine2 : str(r.adrs2 || r.address_l2),
    city         : str(r.city),
    district     : str(r.dist_name  || r.district  || ''),
    state        : str(r.state_name || r.state     || ''),
    country      : str(r.country_name || r.country || ''),
    pincode      : str(r.zipcode || r.zip_code || ''),
    email        : str(r.mail || r.email || ''),
    mobile       : str(r.mobile),
  }
  // ✅ Cache the cloned zone so it shows full details in the list
  if (cloned.id) zoneCache_save(cloned.id, cloned)
  return cloned
}

export async function deleteZone(id, zoneOrName = '') {
  const auth = getAuth()
  if (!auth.api_key) throw new Error('Not authenticated — please log in first')
  const isObj = zoneOrName && typeof zoneOrName === 'object'
  const form  = isObj ? zoneOrName : {}
  const name  = isObj
    ? (str(form.zoneName || form.zoneNameLong || form.name).trim() || 'zone')
    : (String(zoneOrName).trim() || 'zone')

  // Clean coords — strip degree symbols
  const cleanCoord = v => str(v).replace(/[°NSEW\s]/gi, '').trim() || '0'

  const res = await fetch(`${BASE}/zone/delete`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({
      id,
      limit   : '10',
      offset  : '0',
      name,
      lat     : cleanCoord(form.lat || '0'),
      lon     : cleanCoord(form.lng || form.lon || '0'),
      adrs1   : str(form.addressLine1) || '-',
      adrs2   : str(form.addressLine2) || '-',
      city    : str(form.city)         || '-',
      district: str(form.district)     || '-',
      state   : str(form.state)        || '-',
      country : str(form.country).toLowerCase() || 'india',
      zipcode : str(form.pincode)      || '000000',
      mail    : str(form.email)        || 'a@a.com',
      mobile  : str(form.mobile)       || '0000000000',
      e_id    : auth.e_id,
      api_key : auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to delete zone')
  // ✅ Remove from cache so it doesn't show stale data
  zoneCache_delete(id)
  notifyZonesUpdated()
  return true
}

export const getZoneById = (_id) => Promise.resolve(null)
export const patchZone   = (id, b) => updateZone(id, b)

// ── Fetch full zone details by id ────────────────────────────────────────────
// Tries zone/view (minimal + full body), then localStorage cache, then filter stub.
export async function getZoneDetails(id) {
  const auth = getAuth()

  // 1. zone/view — minimal body
  const tryView = async (extraFields = {}) => {
    try {
      const res = await fetch(`${BASE}/zone/view`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          id, limit: '10', offset: '0',
          e_id: auth.e_id, api_key: auth.api_key,
          ...extraFields,
        }),
      })
      const data = await res.json()
      if (!data.error && data.result) {
        const records = Array.isArray(data.data?.records) ? data.data.records
                      : Array.isArray(data.data)           ? data.data
                      : data.data                          ? [data.data] : []
        const r = records.find(x => (x.id ?? x.value) === id) || records[0]
        if (r && (r.adrs1 || r.city || r.mail || r.mobile)) {
          const zone = zoneFromRecord({ ...r, value: id })
          zoneCache_save(id, { ...zone, id })
          return zone
        }
      }
    } catch {}
    return null
  }

  const v1 = await tryView()
  if (v1) return v1

  const v2 = await tryView({
    name: 'all', lat: '0', lon: '0',
    adrs1: '-', adrs2: '-', city: '-',
    district: '-', state: '-', country: 'india',
    zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
  })
  if (v2) return v2

  // 2. localStorage cache
  const cache = zoneCache_read()
  if (cache[String(id)]) {
    return zoneFromRecord({ ...cache[String(id)], value: id })
  }

  // 3. zone/filter stub (name only — no address data)
  try {
    const body = {
      id, limit: '10', offset: '0', name: 'all',
      lat: '0', lon: '0', adrs1: '-', adrs2: '-', city: '-',
      district: '-', state: '-', country: 'india',
      zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
      e_id: auth.e_id, api_key: auth.api_key,
    }
    const res  = await fetch(`${BASE}/zone/filter`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(body),
    })
    const data = await res.json()
    if (!data.error && data.result) {
      const records = Array.isArray(data.data?.records) ? data.data.records
                    : Array.isArray(data.data)           ? data.data : []
      const r = records.find(x => (x.id ?? x.value) === id) || records[0]
      if (r) return zoneFromRecord({ ...r, value: id })
    }
  } catch {}

  return null
}

// ── OTHERS — TRIP TYPES ───────────────────────────────────────────────────────
export async function getTripTypes() {
  const auth = getAuth()
  // triptype/view does not exist on this server — use triptype/filter
  const res = await fetch(`${BASE}/triptype/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ limit: 100, offset: 0, name: 'all', e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to fetch trip types')
  const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
  return records.map(r => ({ id: r.id ?? r.value, typeName: str(r.name || r.type_name || r.typeName || r.label) }))
}

export async function getTripTypeById(id) {
  const all = await getTripTypes()
  const match = all.find(r => r.id === id)
  if (!match) throw new Error(`TripType not found: ${id}`)
  return match
}

export async function createTripType(form) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/triptype/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: form.typeName, limit: 10, offset: 0, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to create trip type')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  return { id: r.id || Date.now(), typeName: r.name || r.type_name || r.typeName || form.typeName }
}

export async function updateTripType(id, form) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/triptype/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name: form.typeName, limit: 10, offset: 0, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to update trip type')
  return { id, typeName: form.typeName }
}

export async function deleteTripType(id) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/triptype/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, limit: 10, offset: 0, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to delete trip type')
  return true
}

export const patchTripType = (id, b) => updateTripType(id, b)

// ── OTHERS — PATROL TYPES ─────────────────────────────────────────────────────
export async function getPatrolTypes() {
  const auth = getAuth()
  // Try patrol_type/filter — confirmed correct path from Postman
  const res = await fetch(`${BASE}/patrol_type/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 0, name: 'all',
      limit: 100, offset: 0,
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to fetch patrol types')
  const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
  return records.map(r => ({ id: r.id ?? r.value, patrolName: str(r.name || r.patrol_name || r.patrolName || r.label) }))
}

export async function getPatrolTypeById(id) {
  const all = await getPatrolTypes()
  const match = all.find(r => r.id === id)
  if (!match) throw new Error(`PatrolType not found: ${id}`)
  return match
}

export async function createPatrolType(form) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/patrol_type/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 0, name: form.patrolName, zone_id: form.zone_id || 0,
      limit: '10', offset: '0',
      lat: '0', lon: '0', adrs1: '-', adrs2: '-', city: '-',
      district: '-', state: '-', country: 'india',
      zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { throw new Error('Server returned non-JSON — check patrol_type/create endpoint') }
  if (data.error || !data.result) throw new Error(data.message || 'Failed to create patrol type')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  return { id: r.id || Date.now(), patrolName: r.name || r.patrol_name || r.patrolName || form.patrolName }
}

export async function updatePatrolType(id, form) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/patrol_type/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id, name: form.patrolName, zone_id: form.zone_id || 0,
      limit: '10', offset: '0',
      lat: '0', lon: '0', adrs1: '-', adrs2: '-', city: '-',
      district: '-', state: '-', country: 'india',
      zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to update patrol type')
  return { id, patrolName: form.patrolName }
}

export async function deletePatrolType(id) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/patrol_type/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      limit: '10', offset: '0',
      lat: '0', lon: '0', adrs1: '-', adrs2: '-', city: '-',
      district: '-', state: '-', country: 'india',
      zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to delete patrol type')
  return true
}

export const patchPatrolType = (id, b) => updatePatrolType(id, b)

// ── OTHERS — MASTER TRIPS ─────────────────────────────────────────────────────
export const getMasterTrips    = ()      => getMany('masterTripsList')
export const getMasterTripById = (id)    => fetchById('masterTripsList', id)
export const createMasterTrip  = (body)  => postOne('masterTripsList', body)
export const updateMasterTrip  = (id, b) => putOne('masterTripsList', id, b)
export const patchMasterTrip   = (id, b) => patchOne('masterTripsList', id, b)
export const deleteMasterTrip  = (id)    => deleteOne('masterTripsList', id)

// ── TRIP DETAILS PAGE — Employee list ─────────────────────────────────────────
export async function fetchTripDetailEmployees(filters) {
  const all = await getAll('attendanceList')
  const rows = all.filter(
    row =>
      (filters.unit === 'All' || row.unit === filters.unit) &&
      row.date === filters.date
  )
  const seen = new Set()
  const employees = []
  for (const row of rows) {
    for (const emp of (row.employees ?? [])) {
      if (!seen.has(emp.empId)) {
        seen.add(emp.empId)
        employees.push({
          empId      : emp.empId,
          name       : emp.name,
          department : emp.department  ?? 'General',
          role       : emp.role        ?? '',
          loginTime  : emp.loginTime   ?? '',
          phone      : emp.phone       ?? '',
          zone       : emp.zone        ?? '',
          designation: emp.designation ?? '',
        })
      }
    }
  }
  return employees
}