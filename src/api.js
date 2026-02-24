
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function getAll(endpoint) {
  const res = await fetch(`${BASE}/${endpoint}`)
  if (!res.ok) throw new Error(`Server error ${res.status} — is json-server running on port 3001?`)
  return res.json()
}

async function fetchOne(endpoint, filters) {
  const all = await getAll(endpoint)
  const match = all.find(
    row =>
      row.unit  === filters.unit  &&
      row.shift === filters.shift &&
      row.date  === filters.date
  )
  if (!match) throw new Error(`No data for: ${filters.unit} | ${filters.shift} | ${filters.date}`)
  return match
}

async function fetchMany(endpoint, filters) {
  const all = await getAll(endpoint)
  return all.filter(
    row =>
      row.unit  === filters.unit  &&
      row.shift === filters.shift &&
      row.date  === filters.date
  )
}

async function fetchById(endpoint, id) {
  const all = await getAll(endpoint)
  const match = all.find(row => row.id === id || row.empId === id)
  if (!match) throw new Error(`Not found: ${endpoint} / ${id}`)
  return match
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
export const fetchTripStats           = f  => fetchOne ('tripStats',       f)
export const fetchAttendanceStats     = f  => fetchOne ('attendanceStats', f)
export const fetchTodayStats          = f  => fetchOne ('todayStats',      f)
export const fetchSchedule            = f  => fetchMany('schedule',        f)

// ── SCHEDULE PAGE ─────────────────────────────────────────────────────────────
export const fetchScheduleList        = f  => fetchMany('schedule',          f)
// fetch by numeric tripId (used when coming from Schedule list arrow click)
export const fetchTripDetails         = id => fetchById('tripDetails',        id)
// ✅ fetch by unit+shift+date — used by TripDetails page for real-time updates
export const fetchTripDetailByFilters = f  => fetchOne ('tripDetails',        f)
export const fetchEfficientEmployees  = f  => fetchOne ('efficientEmployees', f)

// ── ATTENDANCE PAGE ───────────────────────────────────────────────────────────
export const fetchAttendanceList           = f  => fetchOne ('attendanceList',           f)
export const fetchEmployeeAttendanceDetail = id => fetchById('employeeAttendanceDetail', id)
export const fetchPunctualEmployees        = f  => fetchOne ('punctualEmployees',        f)

// ── MASTER FORM — generic helpers ─────────────────────────────────────────────
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

// ── MASTER FORM — USERS ───────────────────────────────────────────────────────
export const getUsers    = ()       => getMany('users')
export const getUserById = (id)     => fetchById('users', id)
export const createUser  = (body)   => postOne('users', body)
export const updateUser  = (id, b)  => putOne('users', id, b)
export const patchUser   = (id, b)  => patchOne('users', id, b)
export const deleteUser  = (id)     => deleteOne('users', id)

// ── MASTER FORM — LOCATIONS ───────────────────────────────────────────────────
export const getLocations    = ()      => getMany('locations')
export const getLocationById = (id)    => fetchById('locations', id)
export const createLocation  = (body)  => postOne('locations', body)
export const updateLocation  = (id, b) => putOne('locations', id, b)
export const patchLocation   = (id, b) => patchOne('locations', id, b)
export const deleteLocation  = (id)    => deleteOne('locations', id)

// ── MASTER FORM — SCHEDULES ───────────────────────────────────────────────────
// Note: uses 'masterSchedules' collection to avoid collision with dashboard 'schedule'
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
// Note: uses 'masterTrips' collection to avoid collision with dashboard 'tripDetails'
export const getTrips    = ()      => getMany('masterTrips')
export const getTripById = (id)    => fetchById('masterTrips', id)
export const createTrip  = (body)  => postOne('masterTrips', body)
export const updateTrip  = (id, b) => putOne('masterTrips', id, b)
export const patchTrip   = (id, b) => patchOne('masterTrips', id, b)
export const deleteTrip  = (id)    => deleteOne('masterTrips', id)