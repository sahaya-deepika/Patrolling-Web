const BASE = 'http://194.238.18.68:5045/api/web/v1'
console.log('[api.js] ✅ LOADED — getZones uses zone/view directly')

// ── GLOBAL AUTH STORE ─────────────────────────────────────────────────────────
const _auth = {
  api_key: localStorage.getItem('api_key') || '',
  e_id: localStorage.getItem('e_id') || import.meta.env.VITE_E_ID || '',
}

export function setAuth({ api_key, e_id, ...rest }) {
  if (api_key) { _auth.api_key = api_key; localStorage.setItem('api_key', api_key) }
  if (e_id) { _auth.e_id = e_id; localStorage.setItem('e_id', e_id) }
  localStorage.setItem('authUser', JSON.stringify({ api_key, e_id, ...rest }))
}

export function getAuth() {
  let stored = {}
  try { stored = JSON.parse(localStorage.getItem('authUser') || '{}') } catch { }
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

export function notifyPatrolTypesUpdated() {
  if (typeof window !== 'undefined' && window?.dispatchEvent) {
    window.dispatchEvent(new Event('patroltypes-updated'))
  }
}

export function notifyLocationsUpdated() {
  if (typeof window !== 'undefined' && window?.dispatchEvent) {
    window.dispatchEvent(new Event('locations-updated'))
  }
}

export function notifyTripsUpdated() {
  if (typeof window !== 'undefined' && window?.dispatchEvent) {
    window.dispatchEvent(new Event('trips-updated'))
  }
}

export function notifyDesignationsUpdated() {
  if (typeof window !== 'undefined' && window?.dispatchEvent) {
    window.dispatchEvent(new Event('designations-updated'))
  }
}

export function notifyDepartmentsUpdated() {
  if (typeof window !== 'undefined' && window?.dispatchEvent) {
    window.dispatchEvent(new Event('departments-updated'))
  }
}

const str = v => (v == null ? '' : String(v))

// ── UNIVERSAL NUMERIC ID EXTRACTOR ───────────────────────────────────────────
// API schema requires dsg, dept, patroltype, zone as plain numbers (not strings).
// Handles { value, label }, { id, label }, plain string, or plain number.
// Returns a Number so the JSON payload satisfies the server schema validation.
function extractNum(field) {
  if (field == null) return 0
  if (typeof field === 'object') return Number(field.value ?? field.id ?? 0)
  const n = Number(field)
  return isNaN(n) ? 0 : n
}

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

// ── LOGOUT ────────────────────────────────────────────────────────────────────
export async function logout() {
  const { e_id } = getAuth()
  const stored = (() => { try { return JSON.parse(localStorage.getItem('authUser') || '{}') } catch { return {} } })()
  const user_id = stored.user_id || stored.userId || stored.username || stored.api_key || ''

  try {
    await fetch(`${BASE}/signin/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, e_id }),
    })
  } catch (err) {
    console.warn('[logout] API call failed, clearing local storage anyway:', err)
  }

  // Clear all auth data from localStorage
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('api_key')
  localStorage.removeItem('e_id')
  localStorage.removeItem('authUser')
}

// ── CHANGE PASSWORD ───────────────────────────────────────────────────────────
export async function changePassword({ old_pass, new_pass, confirm_pass }) {
  const { e_id } = getAuth()
  const res = await fetch(`${BASE}/signin/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ old_pass, new_pass, confirm_pass, e_id }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to change password')
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
    const unitMatch = row.unit === filters.unit
    const dateMatch = row.date === filters.date
    const shiftMatch = !filters.shift || row.shift === filters.shift
    return unitMatch && dateMatch && shiftMatch
  })
  if (!match) throw new Error(`No data for: ${filters.unit} | ${filters.shift || 'any'} | ${filters.date}`)
  return match
}

async function fetchMany(endpoint, filters) {
  const all = await getAll(endpoint)
  return all.filter(row => {
    const unitMatch = row.unit === filters.unit
    const dateMatch = row.date === filters.date
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
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Server error ${res.status} posting to ${endpoint}`)
  return res.json()
}

async function putOne(endpoint, id, body) {
  const res = await fetch(`${BASE}/${endpoint}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Server error ${res.status} updating ${endpoint}/${id}`)
  return res.json()
}

async function patchOne(endpoint, id, body) {
  const res = await fetch(`${BASE}/${endpoint}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
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
//
// Three real endpoints:
//   POST /dashboard/admin/all            → attendance + schedule (today)
//   POST /dashboard/admin/trip_statistics → trip stats (supports date / date range)
//   POST /dashboard/admin/statistics      → today stats per unit
//
// All three accept { e_id, api_key, date?, date_start?, date_end?, unit? }

async function dashPost(path, extra = {}) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/dashboard/admin/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ e_id: auth.e_id, api_key: auth.api_key, ...extra }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || `Dashboard API error: ${path}`)
  return data.data ?? data
}

// ── Trip Statistics ───────────────────────────────────────────────────────────
// Returns: { allTrips, completed, missed, ontime, late, efficiency, upcoming?, cancelled? }
export async function fetchTripStats(filters = {}) {
  const extra = {}
  if (filters.date)  extra.date = filters.date
  if (filters.unit && filters.unit !== 'All') extra.unit = filters.unit
  const raw = await dashPost('trip_statistics', extra)
  return normalizeTripStats(raw)
}

export async function fetchTripStatsRange(filters = {}) {
  const extra = {}
  if (filters.dateStart) extra.date_start = filters.dateStart
  if (filters.dateEnd)   extra.date_end   = filters.dateEnd
  if (filters.unit && filters.unit !== 'All') extra.unit = filters.unit
  const raw = await dashPost('trip_statistics', extra)
  return normalizeTripStats(raw)
}

function normalizeTripStats(raw) {
  // Handle array (sum all records) or single object
  const src = Array.isArray(raw) ? raw : [raw]
  const totals = src.reduce(
    (acc, r) => ({
      allTrips:  acc.allTrips  + (r.all_trips  ?? r.allTrips  ?? r.total_trips ?? 0),
      completed: acc.completed + (r.completed  ?? r.complete  ?? 0),
      missed:    acc.missed    + (r.missed     ?? r.miss      ?? 0),
      ontime:    acc.ontime    + (r.on_time    ?? r.ontime    ?? 0),
      late:      acc.late      + (r.late       ?? 0),
      upcoming:  acc.upcoming  + (r.upcoming   ?? 0),
      cancelled: acc.cancelled + (r.cancelled  ?? r.cancel   ?? 0),
      _effSum:   acc._effSum   + (r.efficiency ?? r.eff ?? 0) * (r.all_trips ?? r.allTrips ?? r.total_trips ?? 1),
    }),
    { allTrips: 0, completed: 0, missed: 0, ontime: 0, late: 0, upcoming: 0, cancelled: 0, _effSum: 0 }
  )
  const efficiency = totals.allTrips > 0 ? Math.round(totals._effSum / totals.allTrips) : 0
  return { ...totals, efficiency }
}

// ── Attendance Statistics ─────────────────────────────────────────────────────
// Returns: { present, absent, ontime, late }
export async function fetchAttendanceStats(filters = {}) {
  const extra = {}
  if (filters.date) extra.date = filters.date
  if (filters.unit && filters.unit !== 'All') extra.unit = filters.unit
  const raw = await dashPost('all', extra)
  // Server returns attendance nested or flat — handle both shapes
  const src = raw.attendance ?? raw.attendance_stats ?? raw
  const obj = Array.isArray(src) ? src[0] ?? {} : src
  return {
    present: obj.present  ?? obj.total_present ?? 0,
    absent:  obj.absent   ?? obj.total_absent  ?? 0,
    ontime:  obj.on_time  ?? obj.ontime        ?? 0,
    late:    obj.late     ?? obj.total_late    ?? 0,
  }
}


export async function fetchSchedule(filters = {}) {
  const extra = {}
  if (filters.date) extra.date = filters.date
  if (filters.unit && filters.unit !== 'All') extra.unit = filters.unit
  const raw = await dashPost('all', extra)
  const list = raw.schedule ?? raw.schedules ?? raw.today_schedule ?? raw
  return Array.isArray(list) ? list : []
}


export async function fetchTodayStatsByDate(date) {
  const extra = {}
  if (date) extra.date = date
  const raw = await dashPost('statistics', extra)
  // Normalize each unit record
  const list = Array.isArray(raw) ? raw : (raw.records ?? raw.units ?? [raw])
  return list.map(r => ({
    unit:      r.unit      ?? r.unit_name ?? 'All',
    allTrips:  r.all_trips ?? r.allTrips  ?? r.total_trips ?? 0,
    complete:  r.completed ?? r.complete  ?? 0,
    upcoming:  r.upcoming  ?? 0,
    missed:    r.missed    ?? r.miss      ?? 0,
    cancelled: r.cancelled ?? r.cancel   ?? 0,
  }))
}

// Legacy alias (used by older parts of the codebase)
export const fetchTodayStats = (filters) => fetchTodayStatsByDate(filters?.date)

// ── Schedule-based trip count for a given date ────────────────────────────────
// Counts how many trip_schedules are active on the given date.
// API confirmed fields: start_date, expired_at
export async function fetchScheduleCountByDate(date) {
  try {
    const records = await getSchedules()
    if (!date) return records.length
    return records.filter(r => {
      const start  = (r.start_date ?? r.start_date_time ?? '').slice(0, 10)
      const expiry = (r.expired_at ?? r.expired_date   ?? '').slice(0, 10)
      if (!start) return false
      return date >= start && (!expiry || date <= expiry)
    }).length
  } catch {
    return 0
  }
}

// ── SCHEDULE PAGE ─────────────────────────────────────────────────────────────
export const fetchScheduleList = f => fetchMany('schedule', f)
export const fetchTripDetails = id => fetchById('tripDetails', id)
export const fetchTripDetailByFilters = f => fetchOne('tripDetails', f)
export const fetchEfficientEmployees = f => fetchOne('efficientEmployees', f)

// ── ATTENDANCE PAGE ───────────────────────────────────────────────────────────
//
// All three functions call the real REST API (POST + auth), replacing the
// old json-server stubs (fetchOne / fetchById) that used GET with no auth.
//
// Expected response envelope from every endpoint:
//   { result: true, error: false, data: { ... } | [...] }
//
// fetchAttendanceList  → POST /attendance/all
//   payload  : { e_id, api_key, date?, unit?, shift?, department_id? }
//   data out : { employees: [{ empId, name, status, isLate, loginTime,
//                              phone, shift, department, deptId,
//                              zone, designation, role }] }
//
// fetchEmployeeAttendanceDetail → POST /attendance/detail
//   payload  : { e_id, api_key, emp_id }
//   data out : { timeline: [{ day, date, type, timeFrom, timeTo,
//                             activeHours, note, label?, punches: [] }] }
//
// fetchPunctualEmployees → derived from /attendance/all (no separate endpoint).
//   Returns present employees sorted by earliest loginTime so the
//   PunctualEmployees / AverageLogin widget always reflects real data.
//   data out : { employees: [{ empId, name, loginTime }] }   (sorted ASC)

// ── Helper: parse "HH:MM AM/PM" or "HH:MM" → total minutes from midnight ─────
function _parseLoginMinutes(timeStr) {
  if (!timeStr) return Infinity  // employees without loginTime sort last
  const m = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
  if (!m) return Infinity
  let h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  const mer = (m[3] || '').toUpperCase()
  if (mer === 'PM' && h !== 12) h += 12
  if (mer === 'AM' && h === 12) h = 0
  return h * 60 + min
}

// ── Helper: normalise raw attendance record → { employees: [...] } ────────────
function _normaliseAttendanceData(raw) {
  // Server may return the list directly or nested under various keys
  const src = raw?.employees ?? raw?.data?.employees
    ?? (Array.isArray(raw) ? raw : null)
    ?? []
  const employees = src.map(r => ({
    empId:       str(r.emp_id   ?? r.empId   ?? r.user_id ?? r.userid ?? ''),
    name:        str(r.name     ?? r.emp_name ?? ''),
    status:      str(r.status   ?? ''),                      // 'absent' | 'present' | ''
    isLate:      r.is_late === true || r.is_late === 1 || r.is_late === '1'
                   || r.isLate === true || r.late === true,
    loginTime:   str(r.login_time ?? r.loginTime ?? r.check_in ?? ''),
    phone:       str(r.mobile    ?? r.phone    ?? ''),
    shift:       str(r.shift     ?? ''),
    department:  str(r.dept_name ?? r.department ?? r.dept ?? ''),
    deptId:      r.dept_id ?? r.deptId ?? null,
    zone:        str(r.zone_name ?? r.zone ?? ''),
    designation: str(r.dsg_name  ?? r.designation ?? ''),
    role:        str(r.role      ?? ''),
  }))
  console.log('[_normaliseAttendanceData] employees count:', employees.length,
    '| sample:', JSON.stringify(employees[0] ?? null))
  return { employees }
}

// ── Helper: normalise raw detail record → { timeline: [...] } ─────────────────
function _normaliseDetailData(raw) {
  // Server may return the timeline directly or nested
  const src = raw?.timeline ?? raw?.data?.timeline
    ?? (Array.isArray(raw) ? raw : null)
    ?? []
  const timeline = src.map(r => ({
    day:         str(r.day   ?? ''),
    date:        str(r.date  ?? ''),
    type:        str(r.type  ?? 'active'),    // 'active' | 'holiday'
    label:       str(r.label ?? ''),
    timeFrom:    str(r.time_from  ?? r.timeFrom  ?? r.check_in  ?? ''),
    timeTo:      str(r.time_to    ?? r.timeTo    ?? r.check_out ?? ''),
    activeHours: str(r.active_hours ?? r.activeHours ?? r.duration ?? ''),
    note:        str(r.note  ?? r.remarks ?? ''),
    punches:     Array.isArray(r.punches) ? r.punches.map(p => ({
      label:         str(p.label ?? ''),
      punchTime:     str(p.punch_time  ?? p.punchTime  ?? ''),
      scheduledTime: str(p.sched_time  ?? p.scheduledTime ?? ''),
    })) : [],
  }))
  console.log('[_normaliseDetailData] timeline entries:', timeline.length,
    '| sample:', JSON.stringify(timeline[0] ?? null))
  return { timeline }
}

// ── fetchAttendanceList ────────────────────────────────────────────────────────
export async function fetchAttendanceList(filters = {}) {
  const auth = getAuth()
  const payload = {
    e_id:    auth.e_id,
    api_key: auth.api_key,
  }
  if (filters.date)                            payload.date          = filters.date
  if (filters.unit && filters.unit !== 'All')  payload.unit          = filters.unit
  if (filters.shift)                           payload.shift         = filters.shift
  if (filters.department_id)                   payload.department_id = filters.department_id

  console.log('[fetchAttendanceList] → POST /attendance/all | payload:', JSON.stringify(payload))

  const res  = await fetch(`${BASE}/attendance/all`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })
  const text = await res.text()
  console.log('[fetchAttendanceList] ← HTTP', res.status, '| raw (first 500):', text.slice(0, 500))

  let data
  try { data = JSON.parse(text) }
  catch { throw new Error(`[fetchAttendanceList] Server returned non-JSON: ${text.slice(0, 200)}`) }

  if (data.error || !data.result) {
    console.error('[fetchAttendanceList] API error:', data)
    throw new Error(data.message || 'Failed to fetch attendance list')
  }

  const result = _normaliseAttendanceData(data.data ?? data)
  console.log('[fetchAttendanceList] ✅ resolved employees:', result.employees.length)
  return result
}

// ── fetchEmployeeAttendanceDetail ─────────────────────────────────────────────
export async function fetchEmployeeAttendanceDetail(empId) {
  const auth = getAuth()
  const payload = {
    emp_id:  empId,
    e_id:    auth.e_id,
    api_key: auth.api_key,
  }

  console.log('[fetchEmployeeAttendanceDetail] → POST /attendance/detail | payload:', JSON.stringify(payload))

  const res  = await fetch(`${BASE}/attendance/detail`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })
  const text = await res.text()
  console.log('[fetchEmployeeAttendanceDetail] ← HTTP', res.status, '| raw (first 500):', text.slice(0, 500))

  let data
  try { data = JSON.parse(text) }
  catch { throw new Error(`[fetchEmployeeAttendanceDetail] Server returned non-JSON: ${text.slice(0, 200)}`) }

  if (data.error || !data.result) {
    console.error('[fetchEmployeeAttendanceDetail] API error:', data)
    throw new Error(data.message || 'Failed to fetch employee attendance detail')
  }

  const result = _normaliseDetailData(data.data ?? data)
  console.log('[fetchEmployeeAttendanceDetail] ✅ timeline entries:', result.timeline.length)
  return result
}

// ── fetchPunctualEmployees ────────────────────────────────────────────────────
// Derived from /attendance/all — reuses the same endpoint instead of a
// separate /punctualEmployees json-server route that no longer exists.
// Returns present employees sorted by earliest loginTime (most punctual first).
export async function fetchPunctualEmployees(filters = {}) {
  const auth = getAuth()
  const payload = {
    e_id:    auth.e_id,
    api_key: auth.api_key,
  }
  if (filters.date)                           payload.date = filters.date
  if (filters.unit && filters.unit !== 'All') payload.unit = filters.unit

  console.log('[fetchPunctualEmployees] → POST /attendance/all | payload:', JSON.stringify(payload))

  const res  = await fetch(`${BASE}/attendance/all`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })
  const text = await res.text()
  console.log('[fetchPunctualEmployees] ← HTTP', res.status, '| raw (first 500):', text.slice(0, 500))

  let data
  try { data = JSON.parse(text) }
  catch { throw new Error(`[fetchPunctualEmployees] Server returned non-JSON: ${text.slice(0, 200)}`) }

  if (data.error || !data.result) {
    console.error('[fetchPunctualEmployees] API error:', data)
    throw new Error(data.message || 'Failed to fetch punctual employees')
  }

  const { employees } = _normaliseAttendanceData(data.data ?? data)

  // Keep only present employees (with a loginTime), sort earliest first
  const sorted = employees
    .filter(e => e.status !== 'absent' && e.loginTime)
    .sort((a, b) => _parseLoginMinutes(a.loginTime) - _parseLoginMinutes(b.loginTime))

  console.log('[fetchPunctualEmployees] ✅ present+sorted:', sorted.length,
    '| top:', JSON.stringify(sorted[0] ?? null))

  return { employees: sorted }
}

// ── MASTER FORM — USERS ───────────────────────────────────────────────────────

function userFromRecord(r) {
  // zone may come back as an array [id] or a plain string/number
  const zoneRaw = Array.isArray(r.zone) ? r.zone[0] : r.zone

  // Safely extract a numeric id from any shape the server might return.
  // dsg / dept / patroltype must be sent as numbers to the API.
  // The server sometimes returns the label string instead of the id —
  // in that case we store 0 so the type stays correct (schema: must be a number).
  const rawNum = v => {
    if (v == null || v === '') return 0
    if (typeof v === 'object') return Number(v.value ?? v.id ?? 0)
    const n = Number(v)
    return isNaN(n) ? 0 : n
  }

  return {
    id:           r.id ?? r.user_id,
    userid:       str(r.userid      || r.user_id   || r.empId || ''),
    userName:     str(r.name        || r.userName  || r.user_name || ''),
    mobile:       str(r.mobile      || ''),
    mail:         str(r.mail        || r.email     || ''),
    // zone stays a string (API requires string); dsg/dept/patroltype must be numbers
    zone:         str(zoneRaw       || ''),
    dsg:          rawNum(r.dsg_id   ?? r.designation_id ?? r.dsg),
    patroltype:   rawNum(r.pt_id    ?? r.patrol_type_id ?? r.patroltype ?? r.patrol_type),
    dept:         rawNum(r.dept_id  ?? r.department_id  ?? r.dept ?? r.department),
    is_admin:     r.is_admin === '1' || r.is_admin === true || r.is_admin === 1,
    role:         str(r.role        || '2'),
    imagePreview: r.image_url || r.imagePreview || null,
  }
}

// Helper: extract zone id from form.zone which may be { id, label }, { value, label }, array, or string
function _zoneArray(zoneField) {
  if (!zoneField) return []
  if (Array.isArray(zoneField)) return zoneField.map(String)
  const id = zoneField?.id ?? zoneField?.value ?? zoneField
  return id ? [String(id)] : []
}

/** user/view — fetch all users */
export async function getUsers() {
  const auth = getAuth()
  const body = { limit: Number(10), offset: Number(0), e_id: auth.e_id, api_key: auth.api_key }
  try {
    const res = await fetch(`${BASE}/user/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!data.error && data.result) {
      const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
      if (records.length > 0) return records.map(userFromRecord)
    }
  } catch { /* fall through to filter */ }

  // fallback: user/filter
  const res2 = await fetch(`${BASE}/user/list`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data2 = await res2.json()
  if (data2.error || !data2.result) return []
  const records2 = Array.isArray(data2.data) ? data2.data : (data2.data?.records || [])
  return records2.map(userFromRecord)
}

export async function getUserById(id) {
  const all = await getUsers()
  const match = all.find(u => String(u.id) === String(id))
  if (!match) throw new Error(`User not found: ${id}`)
  return match
}

/** user/create — matches Postman contract exactly */
export async function createUser(form) {
  const auth = getAuth()
  console.log("[createUser] raw form:", form)
  const payload = {
    userid:     str(form.userid   || ''),
    name:       str(form.name     || form.userName),
    mobile:     str(form.mobile   || '0000000000'),
    mail:       str(form.mail     || 'a@a.com'),
    // zone → string; dsg/dept/patroltype/role → number (API schema requirement)
    zone:       String(extractNum(form.zone)),
    dsg:        extractNum(form.dsg),
    dept:       extractNum(form.dept),
    patroltype: extractNum(form.patroltype),
    //role:       extractNum(form.role) || 2,
    is_admin:   form.is_admin === true || form.is_admin === 1 ? '1' : '0',
    image:      form.imagePreview || '',
    e_id:       str(auth.e_id),
    api_key:    auth.api_key,
  }
  console.log("[createUser] payload being sent:", payload)
  const res = await fetch(`${BASE}/user/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { throw new Error('Server returned non-JSON on user/create') }
  if (data.error || !data.result) throw new Error(data.message || 'Failed to create user')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  return userFromRecord({ ...payload, ...r, id: r.id || Date.now() })
}

/** user/delete — uses userid (primary key) */
export async function deleteUser(id) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/user/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userid: String(id), e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to delete user')
  return true
}

/** user/clone — uses userid (primary key) */
export async function cloneUser(id) {
  const auth = getAuth()
  try {
    const res = await fetch(`${BASE}/user/clone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid: String(id), e_id: auth.e_id, api_key: auth.api_key }),
    })
    const data = await res.json()
    if (!data.error && data.result) {
      const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
      return userFromRecord({ ...r, id: r.id || Date.now() })
    }
  } catch {}
  // Fallback: read source then create copy
  const source = await getUserById(id)
  const { id: _id, ...rest } = source
  return createUser({ ...rest, name: `${rest.userName} (copy)`, userid: '' })
}

/** user/filter — search by name */
export async function filterUsers(query = 'all') {
  const auth = getAuth()
  const res = await fetch(`${BASE}/user/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ limit: '100', offset: '0', name: query || 'all', e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) return []
  const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
  return records.map(userFromRecord)
}

/** user/list — used by the employee dropdown in ScheduleForm */
export async function getUserList() {
  const auth = getAuth()
  const res = await fetch(`${BASE}/user/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ limit: 100, offset: 0, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) return []
  const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
  return records.map(userFromRecord)
}

/** user/update — matches Postman contract exactly */
export async function updateUser(id, form) {
  const auth = getAuth()
  console.log("update form", form)
  const payload = {
    userid:     str(form.userid   || ''),
    name:       str(form.name     || form.userName),
    mobile:     str(form.mobile   || '0000000000'),
    mail:       str(form.mail     || 'a@a.com'),
    // zone → string; dsg/dept/patroltype/role → number (API schema requirement)
    zone:       String(extractNum(form.zone)),
    dsg:        extractNum(form.dsg),
    dept:       extractNum(form.dept),
    patroltype: extractNum(form.patroltype),
    //role:       extractNum(form.role) || 2,
    // shift:      str(form.shift    || '1'),
    is_admin:   form.is_admin === true || form.is_admin === 1 ? '1' : '0',
    image:      form.imagePreview || '',
    e_id:       str(auth.e_id),
    api_key:    auth.api_key,
  }
  const res = await fetch(`${BASE}/user/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { throw new Error('Server returned non-JSON on user/update') }
  if (data.error || !data.result) throw new Error(data.message || 'Failed to update user')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  return userFromRecord({ ...payload, ...r, id })
}

export const patchUser = (id, b) => updateUser(id, b)

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
function locationFromRecord(r) {
  const name = str(r.name || r.l_name || r.label || r.location_name || r.locationName || '')
  const zone = str(r.zone_id != null ? r.zone_id : (r.zone ?? ''))
  return {
    id: r.id,
    name,
    zone,
    lat: str(r.lat || ''),
    lon: str(r.lon || ''),
    rfid: str(r.rfid || r.rfId || r.RFID || ''),
    qr: str(r.qr || r.qr_code || r.qrCode || r.barcode || ''),
    image: Array.isArray(r.image) ? r.image : [],
  }
}

export async function getLocations() {
  const auth = getAuth()

  // Try location/view first — returns full records with rfid, qr, lat, lon
  try {
    const res = await fetch(`${BASE}/location/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: 100, offset: 0, e_id: auth.e_id, api_key: auth.api_key }),
    })
    const data = await res.json()
    if (!data.error && data.result) {
      const records = Array.isArray(data.data?.records) ? data.data.records
        : Array.isArray(data.data) ? data.data : []
      if (records.length > 0) {
        console.log('[getLocations] view raw[0]:', JSON.stringify(records[0]))
        return records.map(locationFromRecord)
      }
    }
  } catch { /* fall through */ }

  // Fallback: location/filter (stubs — no rfid/qr)
  const res = await fetch(`${BASE}/location/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to fetch locations')
  const records = Array.isArray(data.data?.records) ? data.data.records
    : Array.isArray(data.data) ? data.data : []
  console.log('[getLocations] filter raw[0]:', records[0] ? JSON.stringify(records[0]) : 'empty')
  return records.map(locationFromRecord)
}

export async function getLocationById(id) {
  const all = await getLocations()
  const match = all.find(r => String(r.id) === String(id))
  if (!match) throw new Error(`Location not found: ${id}`)
  return match
}

export async function createLocation(form) {
  const auth = getAuth()
  if (!auth.api_key) throw new Error('Not authenticated — please log in first')
  const res = await fetch(`${BASE}/location/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: form.name,
      zone: str(form.zone || ''),
      lat: str(form.lat || ''),
      lon: str(form.lon || ''),
      rfid: str(form.rfid || ''),
      qr: str(form.qr || ''),
      image: Array.isArray(form.image) ? form.image : [],
      e_id: auth.e_id,
      api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to create location')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  notifyLocationsUpdated()
  return {
    id: r.id || Date.now(),
    name: str(r.name || r.l_name || form.name),
    zone: str(r.zone || form.zone || ''),
    lat: str(r.lat || form.lat || ''),
    lon: str(r.lon || form.lon || ''),
    rfid: str(r.rfid || form.rfid || ''),
    qr: str(r.qr || form.qr || ''),
    image: Array.isArray(r.image) ? r.image : (Array.isArray(form.image) ? form.image : []),
  }
}

export async function updateLocation(id, form) {
  const auth = getAuth()
  if (!auth.api_key) throw new Error('Not authenticated — please log in first')
  const res = await fetch(`${BASE}/location/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: str(id),
      name: form.name,
      zone: str(form.zone || ''),
      lat: str(form.lat || ''),
      lon: str(form.lon || ''),
      rfid: str(form.rfid || ''),
      qr: str(form.qr || ''),
      image: Array.isArray(form.image) ? form.image : [],
      e_id: auth.e_id,
      api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to update location')
  notifyLocationsUpdated()
  return { id, ...form }
}

export async function deleteLocation(id) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/location/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: str(id), e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to delete location')
  return true
}

export async function cloneLocation(id) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/location/clone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: str(id), e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to clone location')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  return {
    id: r.id || Date.now(),
    name: str(r.name || r.l_name || ''),
    zone: str(r.zone || ''),
    lat: str(r.lat || ''),
    lon: str(r.lon || ''),
    rfid: str(r.rfid || ''),
    qr: str(r.qr || ''),
    image: Array.isArray(r.image) ? r.image : [],
  }
}

export async function getLocationView({ limit = 10, offset = 0, name = '' } = {}) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/location/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ limit, offset, name, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to fetch locations')
  const records = Array.isArray(data.data?.records) ? data.data.records
    : Array.isArray(data.data) ? data.data : []
  return records.map(r => {
    const name = str(r.name || r.l_name || r.label || r.location_name || r.locationName || '')
    const zone = str(r.zone_id != null ? r.zone_id : (r.zone ?? ''))
    console.log('[getLocations] raw record:', JSON.stringify(r))
    return {
      id: r.id,
      name,
      zone,
      lat: str(r.lat || ''),
      lon: str(r.lon || ''),
      rfid: str(r.rfid || ''),
      qr: str(r.qr || ''),
      image: Array.isArray(r.image) ? r.image : [],
    }
  })
}

export const patchLocation = (id, b) => updateLocation(id, b)

/** location/filter — filter locations by zone_id or name */
export async function filterLocations({ zone_id = '', name = 'all', limit = 100, offset = 0 } = {}) {
  const auth = getAuth()
  const body = { limit, offset, name, e_id: auth.e_id, api_key: auth.api_key }
  if (zone_id) body.zone_id = zone_id
  const res = await fetch(`${BASE}/location/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (data.error || !data.result) return []
  const records = Array.isArray(data.data?.records) ? data.data.records
    : Array.isArray(data.data) ? data.data : []
  return records.map(locationFromRecord)
}

// ── MASTER FORM — SCHEDULES (trip_schedule/*) ─────────────────────────────────

function scheduleFromRecord(r) {
  return {
    id:              r.id,
    zone:            Array.isArray(r.zone)        ? r.zone.map(String)        : (r.zone        != null ? [String(r.zone)]        : []),
    user:            Array.isArray(r.user)        ? r.user.map(String)        : (r.user        != null ? [String(r.user)]        : []),
    patrol_type:     Array.isArray(r.patrol_type) ? r.patrol_type.map(String) : (r.patrol_type != null ? [String(r.patrol_type)] : []),
    trip:            r.trip        ?? r.trip_id   ?? null,
    start_date_time: str(r.start_date_time || ''),
    end_date_time:   str(r.end_date_time   || ''),
    expired_date:    str(r.expired_date    || ''),
    order:           r.order     != null ? Number(r.order)     : 1,
    is_round:        r.is_round  != null ? Number(r.is_round)  : 1,
    is_cyclic:       r.is_cyclic != null ? Number(r.is_cyclic) : 0,
    min_round:       r.min_round  != null ? Number(r.min_round)  : null,
    max_round:       r.max_round  != null ? Number(r.max_round)  : null,
    delay_mins:      r.delay_mins != null ? Number(r.delay_mins) : null,
  }
}

/** trip_schedule/view */
export async function getSchedules() {
  const auth = getAuth()
  const res = await fetch(`${BASE}/trip_schedule/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ limit: 1000, offset: 0, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) return []
  const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
  return records
}

/** trip_schedule/filter */
export async function filterSchedules() {
  const auth = getAuth()
  const res = await fetch(`${BASE}/trip_schedule/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ limit: 10, offset: 0, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) return []
  const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
  return records.map(scheduleFromRecord)
}

/** trip_schedule/create
 *  payload: { zone, user, patrol_type, trip, start_date_time, end_date_time,
 *             order, is_round, min_round, max_round, is_cyclic, delay_mins, expired_date }
 */
export async function createSchedule(form) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/trip_schedule/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { throw new Error('Server returned non-JSON on trip_schedule/create') }
  if (data.error || !data.result) throw new Error(data.message || 'Failed to create schedule')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  return scheduleFromRecord({ ...form, ...r, id: r.id || Date.now() })
}

/** trip_schedule/update
 *  payload: { id, zone, user, patrol_type, trip, start_date_time, end_date_time,
 *             order, is_round, min_round, max_round, is_cyclic, delay_mins, expired_date }
 */
export async function updateSchedule(id, form) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/trip_schedule/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...form, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { throw new Error('Server returned non-JSON on trip_schedule/update') }
  if (data.error || !data.result) throw new Error(data.message || 'Failed to update schedule')
  return scheduleFromRecord({ ...form, id })
}

/** trip_schedule/delete — payload: { id, e_id, api_key } */
export async function deleteSchedule(id) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/trip_schedule/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to delete schedule')
  return true
}

/** trip_schedule/clone — payload: { id, e_id, api_key } */
export async function cloneSchedule(id) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/trip_schedule/clone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to clone schedule')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  return scheduleFromRecord({ ...r, id: r.id || Date.now() })
}

export const getScheduleById = async (id) => { const all = await getSchedules(); return all.find(r => String(r.id) === String(id)) || null }
export const patchSchedule = (id, b) => updateSchedule(id, b)

// ── MASTER FORM — QUESTIONS ───────────────────────────────────────────────────

/** question/view — fetch all questions (limit, offset, e_id, api_key) */
export async function getQuestions() {
  const auth = getAuth()
  const res = await fetch(`${BASE}/question/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ limit: 10, offset: 0, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) return []
  const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
  return records.map(r => ({
    id: r.id,
    qus_id: r.qus_id,
    role: r.role,
    name: str(r.name || ''),
    type: str(r.type || ''),
    options: Array.isArray(r.options) ? r.options : [],
  }))
}

/** question/filter — filter questions (e_id, api_key) */
export async function filterQuestions() {
  const auth = getAuth()
  const res = await fetch(`${BASE}/question/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) return []
  const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
  return records.map(r => ({
    id: r.id,
    qus_id: r.qus_id,
    role: r.role,
    name: str(r.name || ''),
    type: str(r.type || ''),
    options: Array.isArray(r.options) ? r.options : [],
  }))
}

/** question/create — create a new question */
export async function createQuestion(form) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/question/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // role: Number(Array.isArray(form.patroltype) ? form.patroltype[0] : form.patroltype) || 0,
      role: form.role,
      name: form.name,
      type: form.type,
      options: form.options.map((option) => option.label),
      e_id: auth.e_id,
      api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to create question')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  return {
    id: r.id || Date.now(),
    qus_id: r.qus_id,
    role: r.role ?? form.role,
    name: r.name || form.name,
    type: r.type || form.type,
    options: Array.isArray(r.options) ? r.options : (form.options || []),
  }
}

/** question/update — update an existing question */
export async function updateQuestion(id, form) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/question/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      qus_id: form.qus_id,
      role: Number(Array.isArray(form.patroltype) ? form.patroltype[0] : form.patroltype) || 0,
      name: form.name,
      type: form.type,
      options: form.options,
      e_id: auth.e_id,
      api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to update question')
  return { id, ...form }
}

/** question/delete — delete a question by id */
export async function deleteQuestion(id) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/question/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to delete question')
  return true
}

/** question/clone — clone a question by id */
export async function cloneQuestion(id) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/question/clone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to clone question')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  return {
    id: r.id || Date.now(),
    qus_id: r.qus_id,
    role: r.role,
    name: str(r.name || ''),
    type: str(r.type || ''),
    options: Array.isArray(r.options) ? r.options : [],
  }
}

export const getQuestionById = async (id) => {
  const all = await getQuestions()
  const match = all.find(r => r.id === id)
  if (!match) throw new Error(`Question not found: ${id}`)
  return match
}

export const patchQuestion = (id, b) => updateQuestion(id, b)

// ── MASTER FORM — TRIPS ───────────────────────────────────────────────────────

/** Normalise a raw trip record from the server into a consistent shape */
function tripFromRecord(r) {
  // filter endpoint → { value, label }   (same pattern as zone/filter, patrol_type/filter, etc.)
  // view  endpoint  → full record with r.name / r.trip_name / r.id etc.
  const id       = r.id    ?? r.value ?? r.trip_id ?? r.t_id
  const tripName = str(
    r.label      ||   // filter endpoints return { value, label }
    r.trip_name  || r.tripName  || r.name  ||
    r.title      || r.trip_title || r.t_name ||
    r.tname      || r.description || ''
  )
  // patrol_type: filter → label string, view → array of ids
  const ptLabel   = r.patrol_type_name || r.patrolTypeName || r.patrol_type_label
  const patrolType = ptLabel != null
    ? (Array.isArray(ptLabel) ? ptLabel : [ptLabel])
    : (Array.isArray(r.patrol_type) ? r.patrol_type : (r.patrol_type != null ? [r.patrol_type] : []))
  // zone: same pattern
  const zLabel  = r.zone_name || r.zoneName || r.zone_label
  const zone    = zLabel != null
    ? (Array.isArray(zLabel) ? zLabel : [zLabel])
    : (Array.isArray(r.zone) ? r.zone : (r.zone != null ? [r.zone] : []))
  console.log('[tripFromRecord] keys:', Object.keys(r).join(', '), '| id:', id, '| tripName:', tripName)
  return {
    id,
    tripName,
    name:      tripName,
    patrolType,
    zone,
    location:  Array.isArray(r.location) ? r.location : [],
  }
} // this is the function which modifies our response data .

/** trip/list — fetch all trips for dropdowns (calls trip/filter internally) */
export async function listTrips() {
  const auth = getAuth()
  const res = await fetch(`${BASE}/trip/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({  e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  console.log('[listTrips] raw response:', JSON.stringify(data).slice(0, 500))
  if (data.error || !data.result) return []
  const records = Array.isArray(data.data?.records) ? data.data.records
    : Array.isArray(data.data) ? data.data : []
  console.log('[listTrips] first record:', JSON.stringify(records[0]))
  // return records as-is — { value, label } shape from trip/filter
  return records
}

/** trip/view — fetch all trips (with limit/offset/e_id/api_key) */
export async function getTrips() {
  const auth = getAuth()
  const res = await fetch(`${BASE}/trip/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 0, limit: 100, offset: 0, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  console.log('[getTrips] raw data:', JSON.stringify(data?.data).slice(0, 300))
  if (data.error || !data.result) return []
  const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
  return records //see here that tripfromrecord is a cb function which modifies our response data so iremoved it 
} // helloe ??mm ipo puruchuchu, see carefully now , understood ??yess now ok

//git la commit pannlaya nee ??noo da, yeppo lam code work aagutho for any form or any page then do commit 
/** trip/filter — filter trips (only e_id + api_key required) */
export async function filterTrips() {
  const auth = getAuth()
  const res = await fetch(`${BASE}/trip/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ limit: 100, offset: 0, name: 'all', e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  console.log('[filterTrips] raw data:', JSON.stringify(data?.data).slice(0, 300))
  if (data.error || !data.result) return []
  const records = Array.isArray(data.data) ? data.data
    : Array.isArray(data.data?.records) ? data.data.records : []
  return records.map(tripFromRecord)
}

/** trip/create
 *  payload: { name, patrol_type: [id,...], zone: [id,...], location: [{loc_id, qus_id:[...]},...] }
 */
export async function createTrip(form) {
  const auth = getAuth()
  const payload = {
    name:        str(form.tripName || form.name || ''),
    patrol_type: Array.isArray(form.patrolType) ? form.patrolType.map(Number) : [Number(form.patrolType)].filter(Boolean),
    zone:        Array.isArray(form.zone)       ? form.zone.map(Number)       : [Number(form.zone)].filter(Boolean),
    location:    Array.isArray(form.location)   ? form.location               : [],
    e_id:        auth.e_id,
    api_key:     auth.api_key,
  }
  const res = await fetch(`${BASE}/trip/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { throw new Error('Server returned non-JSON on trip/create') }
  if (data.error || !data.result) throw new Error(data.message || 'Failed to create trip')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  return tripFromRecord({ ...payload, ...r, id: r.id || Date.now() })
}

/** trip/update
 *  payload: { id, name, patrol_type: [id,...], zone: [id,...], location: [{loc_id, qus_id:[...]},...] }
 */
export async function updateTrip(id, form) {
  const auth = getAuth()
  const payload = {
    id,
    name:        str(form.tripName || form.name || ''),
    patrol_type: Array.isArray(form.patrolType) ? form.patrolType.map(Number) : [Number(form.patrolType)].filter(Boolean),
    zone:        Array.isArray(form.zone)       ? form.zone.map(Number)       : [Number(form.zone)].filter(Boolean),
    location:    Array.isArray(form.location)   ? form.location               : [],
    e_id:        auth.e_id,
    api_key:     auth.api_key,
  }
  const res = await fetch(`${BASE}/trip/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { throw new Error('Server returned non-JSON on trip/update') }
  if (data.error || !data.result) throw new Error(data.message || 'Failed to update trip')
  return tripFromRecord({ ...payload, id })
}

/** trip/delete — payload: { id, e_id, api_key } */
export async function deleteTrip(id) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/trip/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to delete trip')
  return true
}

/** trip/clone — payload: { id, e_id, api_key } */
export async function cloneTrip(id) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/trip/clone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to clone trip')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  return tripFromRecord({ ...r, id: r.id || Date.now() })
}

export const getTripById = async (id) => { const all = await getTrips(); return all.find(r => String(r.id) === String(id)) || null }
export const patchTrip = (id, b) => updateTrip(id, b)

// ── OTHERS — EMPLOYEES ────────────────────────────────────────────────────────
export const getEmployees = () => getMany('employees')
export const getEmployeeById = (id) => fetchById('employees', id)
export const createEmployee = (body) => postOne('employees', body)
export const updateEmployee = (id, b) => putOne('employees', id, b)
export const patchEmployee = (id, b) => patchOne('employees', id, b)
export const deleteEmployee = (id) => deleteOne('employees', id)

// ── MASTER FORM — DESIGNATIONS ────────────────────────────────────────────────
export async function getDesignations(limit = 10, offset = 0, form = null) {
  const auth = getAuth()
  const payload = {
    limit,
    offset,
    e_id: auth.e_id, api_key: auth.api_key,
  }
  const parseRecords = (data) => {
    const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
    return records.map(r => ({ id: r.value ?? r.id, designationName: str(r.label || r.designation_name || r.designationName || r.name) }))
  }
  const res = await fetch(`${BASE}/designation/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!data.error && data.result) {
    const rows = parseRecords(data)
    if (rows.length > 0) return rows
  }
  return []
}

export async function getDesignationById(id) {
  const all = await getDesignations()
  const match = all.find(r => r.id === id)
  if (!match) throw new Error(`Designation not found: ${id}`)
  return match
}

export async function createDesignation(form, isClone = false) {
  const auth = getAuth()
  console.log("desg name " + form.designationName)
  const res = await fetch(`${BASE}/designation/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: form.designationName,
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { throw new Error('Server returned non-JSON — check designation/create endpoint') }
  if (data.error || !data.result) throw new Error(data.message || 'Failed to create designation')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  notifyDesignationsUpdated()
  return { id: r.id || Date.now(), designationName: r.name || r.designation_name || r.designationName || form.designationName }
}

export async function updateDesignation(id, form) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/designation/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id, name: form.designationName,
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to update designation')
  notifyDesignationsUpdated()
  return { id, designationName: form.designationName }
}

export async function deleteDesignation(id) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/designation/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to delete designation')
  notifyDesignationsUpdated()
  return true
}

export async function cloneDesignation(id) {
  const auth = getAuth()
  try {
    const res = await fetch(`${BASE}/designation/clone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, e_id: auth.e_id, api_key: auth.api_key }),
    })
    const data = await res.json()
    if (!data.error && data.result) {
      const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
      return { id: r.id || Date.now(), designationName: str(r.name || r.designationName || r.designation_name) }
    }
  } catch {}
  // Fallback: fetch the source, create a copy
  const source = await getDesignationById(id)
  return createDesignation({ designationName: `${source.designationName} (copy)` })
}

export const patchDesignation = (id, b) => updateDesignation(id, b)

// ── MASTER FORM — DEPARTMENTS ─────────────────────────────────────────────────
export async function getDepartments(limit = 10, offset = 0) {
  const auth = getAuth()
  const parseRecords = (data) => {
    const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
    return records.map(r => ({ id: r.id ?? r.value, departmentName: str(r.name || r.label || r.department_name || r.departmentName) }))
  }
  // PRIMARY: department/view
  try {
    const res = await fetch(`${BASE}/department/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit, offset, e_id: auth.e_id, api_key: auth.api_key }),
    })
    const data = await res.json()
    if (!data.error && data.result) {
      const rows = parseRecords(data)
      if (rows.length > 0) return rows
    }
  } catch { /* fall through to filter */ }
  // FALLBACK: department/filter (only when view returns empty)
  const res = await fetch(`${BASE}/department/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to fetch departments')
  return parseRecords(data)
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
      name: form.departmentName,
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { throw new Error('Server returned non-JSON — check department/create endpoint') }
  if (data.error || !data.result) throw new Error(data.message || 'Failed to create department')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  notifyDepartmentsUpdated()
  return { id: r.id || Date.now(), departmentName: r.name || r.department_name || r.departmentName || form.departmentName }
}

export async function updateDepartment(id, form) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/department/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id, name: form.departmentName,
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to update department')
  notifyDepartmentsUpdated()
  return { id, departmentName: form.departmentName }
}

export async function deleteDepartment(id) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/department/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to delete department')
  notifyDepartmentsUpdated()
  return true
}

export async function cloneDepartment(id) {
  const auth = getAuth()
  try {
    const res = await fetch(`${BASE}/department/clone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, e_id: auth.e_id, api_key: auth.api_key }),
    })
    const data = await res.json()
    if (!data.error && data.result) {
      const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
      return { id: r.id || Date.now(), departmentName: str(r.name || r.departmentName || r.department_name) }
    }
  } catch {}
  const source = await getDepartmentById(id)
  return createDepartment({ departmentName: `${source.departmentName} (copy)` })
}

export const patchDepartment = (id, b) => updateDepartment(id, b)

export async function filterDepartments(name = 'all') {
  const auth = getAuth()
  const res = await fetch(`${BASE}/department/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
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
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to filter designations')
  const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
  return records.map(r => ({ id: (r.id || r.value), designationName: str(r.name || r.designation_name || r.designationName || r.label) }))
}

// ✅ uses patrol_type/filter — confirmed correct path from Postman
export async function filterPatrolTypes(name = 'all') {
  const auth = getAuth()
  const res = await fetch(`${BASE}/patrol_type/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
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
  const id = r.id ?? r.value ?? null
  const zoneFull = str(r.label || r.name || r.zone || r.l_name || r.s_name || '').trim()

  const district = str(r.dist_name || r.district || '')
  const state = str(r.state_name || r.state || '')
  const country = str(r.country_name || r.country || '')
  const pincode = str(r.zipcode || r.zip_code || '')

  // Server returns adrs1/adrs2 (Postman confirmed) — also handle address_l1/l2
  const adrs1 = str(r.adrs1 || r.address_l1 || '')
  const adrs2 = str(r.adrs2 || r.address_l2 || '')
  const city = str(r.city || '')

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
    zoneNameLong: zoneFull,
    zoneNameShort: str(r.s_name || r.code || ''),
    zoneName: zoneFull,
    code: str(r.code || ''),
    lat,
    lng,
    liveAddress,
    addressLine1: adrs1,
    addressLine2: adrs2,
    city,
    district,
    state,
    country,
    pincode,
    email: str(r.mail || r.email || ''),
    mobile: str(r.mobile || ''),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
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
  const lat = cleanCoord(form.lat || '0')
  const lon = cleanCoord(form.lng || form.lon || '0')

  return {
    id,
    name,
    lat,
    lon,
    adrs1: str(form.addressLine1) || '-',
    adrs2: str(form.addressLine2) || '-',
    city: str(form.city) || '-',
    district: str(form.district) || '-',
    state: str(form.state) || '-',
    country: str(form.country).toLowerCase() || 'india',
    zipcode: str(form.pincode) || '000000',
    mail: str(form.email) || 'a@a.com',
    mobile: str(form.mobile) || '0000000000',
    e_id: auth.e_id,
    api_key: auth.api_key,
  }
}

// ── ZONE LOCAL CACHE ──────────────────────────────────────────────────────────
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
    const id = stub.value ?? stub.id
    const cached = cache[String(id)]
    if (cached) {
      const zone = zoneFromRecord({
        ...cached,
        value: id,
        label: stub.label ?? stub.name ?? cached.zoneName ?? '',
      })
      return zone
    }
    return zoneFromRecord(stub)
  })
}

export async function getZones(limit = 10, offset = 0) {
  const auth = getAuth()
  console.log("Fetching zones with auth", { e_id: auth.e_id, api_key: auth.api_key ? '***' : null })

  // ── PRIMARY: zone/view ────────────────────────────────────────────────────────
  try {
    const res = await fetch(`${BASE}/zone/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        limit, offset,
        name: 'all', lat: '0', lon: '0',
        adrs1: '-', adrs2: '-', city: '-',
        district: '-', state: '-', country: 'india',
        zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
        e_id: auth.e_id, api_key: auth.api_key,
      }),
    })
    const data = await res.json()
    if (!data.error && data.result) {
      let records = []
      if (Array.isArray(data.data?.records)) records = data.data.records
      else if (Array.isArray(data.data)) records = data.data
      if (records.length > 0) return zoneCache_merge(records)
    }
  } catch { /* fall through to filter */ }

  // ── FALLBACK: zone/filter (only when view returns empty) ──────────────────────
  const res = await fetch(`${BASE}/zone/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to fetch zones')

  let stubs = []
  if (Array.isArray(data.data?.records)) stubs = data.data.records
  else if (Array.isArray(data.data)) stubs = data.data
  else if (Array.isArray(data.records)) stubs = data.records

  return zoneCache_merge(stubs)
}

export async function getZoneFilter() {
  const auth = getAuth()
  const body = {
    e_id: auth.e_id,
    api_key: auth.api_key,
  }
  const res = await fetch(`${BASE}/zone/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  console.log("data", data)
  if (data.error || !data.result) return []
  const records = Array.isArray(data.data?.records) ? data.data.records
    : Array.isArray(data.data) ? data.data : []
  return records
}

export async function createZone(form) {
  const auth = getAuth()
  if (!auth.api_key) throw new Error('Not authenticated — please log in first')
  const body = zoneToBody(form, auth)
  const res = await fetch(`${BASE}/zone/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (data.error || !data.result) {
    console.error('createZone failed', { body, data })
    throw new Error(data.message || 'Failed to create zone')
  }

  const zoneName = str(form.zoneName || form.zoneNameLong || '').trim()
  let resolvedId = null
  try {
    const filterBody = { e_id: auth.e_id, api_key: auth.api_key }
    const fr = await fetch(`${BASE}/zone/filter`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(filterBody) })
    const fd = await fr.json()
    let list = []
    if (Array.isArray(fd.data?.records)) list = fd.data.records
    else if (Array.isArray(fd.data)) list = fd.data
    else if (Array.isArray(fd.records)) list = fd.records
    const matches = list.filter(s => str(s.label || s.name || '').trim().toLowerCase() === zoneName.toLowerCase())
    if (matches.length > 0) {
      resolvedId = matches.reduce((max, s) => ((s.id ?? s.value) > max ? (s.id ?? s.value) : max), 0)
    }
    if (!resolvedId && list.length > 0) {
      resolvedId = list.reduce((max, s) => ((s.id ?? s.value) > max ? (s.id ?? s.value) : max), 0)
    }
  } catch { }

  const finalId = resolvedId || Date.now()
  const cacheEntry = { ...form, id: finalId, zoneName }
  zoneCache_save(finalId, cacheEntry)
  notifyZonesUpdated()
  return zoneFromRecord({ ...cacheEntry, lon: form.lng })
}

export async function updateZone(id, form) {
  const auth = getAuth()
  if (!auth.api_key) throw new Error('Not authenticated — please log in first')
  const body = zoneToBody(form, auth, id)
  const res = await fetch(`${BASE}/zone/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (data.error || !data.result) {
    console.error('updateZone failed', { body, data })
    throw new Error(data.message || 'Failed to update zone')
  }
  zoneCache_save(id, { ...form, id, zoneName: form.zoneName || form.zoneNameLong || '' })
  notifyZonesUpdated()
  return { ...form, id }
}

export async function cloneZone(id) {
  const auth = getAuth()
  console.log("Cloning zone", { id, e_id: auth.e_id, api_key: auth.api_key ? '***' : null })
  const res = await fetch(`${BASE}/zone/clone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to clone zone')
  notifyZonesUpdated()
  const r = (data.data || [])[0] || {}
  const zoneName = str(r.l_name || r.zone || r.name).trim()
  const cleanCoord = v => {
    const n = parseFloat(str(v).replace(/[°NSEW\s]/gi, ''))
    return isNaN(n) ? 0 : n
  }
  const cloned = {
    id: r.id,
    zoneName,
    zoneNameLong: zoneName,
    zoneNameShort: str(r.s_name),
    code: str(r.code),
    lat: cleanCoord(r.lat) || 20.5937,
    lng: cleanCoord(r.lon ?? r.lng) || 78.9629,
    liveAddress: '',
    addressLine1: str(r.adrs1 || r.address_l1),
    addressLine2: str(r.adrs2 || r.address_l2),
    city: str(r.city),
    district: str(r.dist_name || r.district || ''),
    state: str(r.state_name || r.state || ''),
    country: str(r.country_name || r.country || ''),
    pincode: str(r.zipcode || r.zip_code || ''),
    email: str(r.mail || r.email || ''),
    mobile: str(r.mobile),
  }
  if (cloned.id) zoneCache_save(cloned.id, cloned)
  return cloned
}

export async function deleteZone(id) {
  const auth = getAuth()
  if (!auth.api_key) throw new Error('Not authenticated — please log in first')
  const body = { id, e_id: auth.e_id, api_key: auth.api_key }
  const res = await fetch(`${BASE}/zone/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to delete zone')
  zoneCache_delete(id)
  notifyZonesUpdated()
  return true
}

export const getZoneById = (_id) => Promise.resolve(null)
export const patchZone = (id, b) => updateZone(id, b)

export async function getZoneDetails(id) {
  const auth = getAuth()

  const tryView = async () => {
    try {
      const res = await fetch(`${BASE}/zone/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: 'all', lat: '0', lon: '0',
          adrs1: '-', adrs2: '-', city: '-',
          district: '-', state: '-', country: 'india',
          zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
          limit: '10', offset: '0',
          e_id: auth.e_id, api_key: auth.api_key,
        }),
      })
      const data = await res.json()
      if (!data.error && data.result) {
        const records = Array.isArray(data.data?.records) ? data.data.records
          : Array.isArray(data.data) ? data.data
            : data.data ? [data.data] : []
        const r = records.find(x => (x.id ?? x.value) === id) || records[0]
        if (r && (r.adrs1 || r.city || r.mail || r.mobile)) {
          const zone = zoneFromRecord({ ...r, value: id })
          zoneCache_save(id, { ...zone, id })
          return zone
        }
      }
    } catch { }
    return null
  }

  const v1 = await tryView()
  if (v1) return v1

  const cache = zoneCache_read()
  if (cache[String(id)]) {
    return zoneFromRecord({ ...cache[String(id)], value: id })
  }

  try {
    const body = { e_id: auth.e_id, api_key: auth.api_key }
    const res = await fetch(`${BASE}/zone/filter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!data.error && data.result) {
      const records = Array.isArray(data.data?.records) ? data.data.records
        : Array.isArray(data.data) ? data.data : []
      const r = records.find(x => (x.id ?? x.value) === id) || records[0]
      if (r) return zoneFromRecord({ ...r, value: id })
    }
  } catch { }

  return null
}

// ── OTHERS — TRIP TYPES ───────────────────────────────────────────────────────
export async function getTripTypes() {
  const auth = getAuth()
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
  const parseRecords = (data) => {
    const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
    return records.map(r => ({ id: r.id ?? r.value, patrolName: str(r.name || r.patrol_name || r.patrolName || r.label) }))
  }
  try {
    const res = await fetch(`${BASE}/patrol_type/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        limit: 10, offset: 0,
        e_id: auth.e_id, api_key: auth.api_key,
      }),
    })
    const data = await res.json()
    if (!data.error && data.result) {
      const rows = parseRecords(data)
      if (rows.length > 0) return rows
    }
  } catch { /* fall through */ }
  const res = await fetch(`${BASE}/patrol_type/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ e_id: auth.e_id, api_key: auth.api_key }),
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
  console.log("form", form)
  const res = await fetch(`${BASE}/patrol_type/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: form.patrolName,
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { throw new Error('Server returned non-JSON — check patrol_type/create endpoint') }
  if (data.error || !data.result) throw new Error(data.message || 'Failed to create patrol type')
  const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
  notifyPatrolTypesUpdated()
  return { id: r.id || Date.now(), patrolName: r.name || r.patrol_name || r.patrolName || form.patrolName }
}

export async function updatePatrolType(id, form) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/patrol_type/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      name: form.patrolName,
      mail: form.mail || '',
      e_id: auth.e_id, api_key: auth.api_key,
    }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to update patrol type')
  notifyPatrolTypesUpdated()
  return { id, patrolName: form.patrolName }
}

export async function deletePatrolType(id) {
  const auth = getAuth()
  const res = await fetch(`${BASE}/patrol_type/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, e_id: auth.e_id, api_key: auth.api_key }),
  })
  const data = await res.json()
  if (data.error || !data.result) throw new Error(data.message || 'Failed to delete patrol type')
  notifyPatrolTypesUpdated()
  return true
}

export const patchPatrolType = (id, b) => updatePatrolType(id, b)

export async function clonePatrolType(id) {
  const auth = getAuth()
  try {
    const res = await fetch(`${BASE}/patrol_type/clone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, e_id: auth.e_id, api_key: auth.api_key }),
    })
    const data = await res.json()
    if (!data.error && data.result) {
      const r = (Array.isArray(data.data) ? data.data[0] : data.data) || {}
      return { id: r.id || Date.now(), patrolName: str(r.name || r.patrolName || r.patrol_name) }
    }
  } catch {}
  const source = await getPatrolTypeById(id)
  return createPatrolType({ patrolName: `${source.patrolName} (copy)` })
}

// ── OTHERS — MASTER TRIPS ─────────────────────────────────────────────────────
export const getMasterTrips = () => getMany('masterTripsList')
export const getMasterTripById = (id) => fetchById('masterTripsList', id)
export const createMasterTrip = (body) => postOne('masterTripsList', body)
export const updateMasterTrip = (id, b) => putOne('masterTripsList', id, b)
export const patchMasterTrip = (id, b) => patchOne('masterTripsList', id, b)
export const deleteMasterTrip = (id) => deleteOne('masterTripsList', id)

// ── TRIP DETAILS PAGE — Employee list ──────────────────────────────────────
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
          empId: emp.empId,
          name: emp.name,
          department: emp.department ?? 'General',
          role: emp.role ?? '',
          loginTime: emp.loginTime ?? '',
          phone: emp.phone ?? '',
          zone: emp.zone ?? '',
          designation: emp.designation ?? '',
        })
      }
    }
  }
  return employees
}