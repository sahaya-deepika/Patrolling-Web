// // ─────────────────────────────────────────────────────────────────
// //  API SERVICE
// //  Dev:     json-server  →  npm run server  (port 3001)
// //  Future:  just change BASE to your real backend URL
// //
// //  Start json-server:
// //    npm run server
// //    (or)  npx json-server --watch db.json --port 3001
// // ─────────────────────────────────────────────────────────────────

// const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// // ── Generic fetch ────────────────────────────────────────────────
// async function getAll(endpoint) {
//   const res = await fetch(`${BASE}/${endpoint}`)
//   if (!res.ok) throw new Error(`Server error ${res.status} — is json-server running on port 3001?`)
//   return res.json()
// }

// // ── Find ONE matching row ────────────────────────────────────────
// async function fetchOne(endpoint, filters) {
//   const all = await getAll(endpoint)
//   const match = all.find(
//     row =>
//       row.unit  === filters.unit  &&
//       row.shift === filters.shift &&
//       row.date  === filters.date
//   )
//   if (!match) throw new Error(`No data found for: ${filters.unit} | ${filters.shift} | ${filters.date}`)
//   return match
// }

// // ── Find ALL matching rows ───────────────────────────────────────
// async function fetchMany(endpoint, filters) {
//   const all = await getAll(endpoint)
//   return all.filter(
//     row =>
//       row.unit  === filters.unit  &&
//       row.shift === filters.shift &&
//       row.date  === filters.date
//   )
// }

// // ── Fetch by ID ──────────────────────────────────────────────────
// async function fetchById(endpoint, id) {
//   const res = await fetch(`${BASE}/${endpoint}/${id}`)
//   if (!res.ok) throw new Error(`Not found: ${endpoint}/${id}`)
//   return res.json()
// }

// // ── Dashboard exports ────────────────────────────────────────────
// export const fetchTripStats       = f => fetchOne ('tripStats',       f)
// export const fetchAttendanceStats = f => fetchOne ('attendanceStats', f)
// export const fetchTodayStats      = f => fetchOne ('todayStats',      f)
// export const fetchSchedule        = f => fetchMany('schedule',        f)

// // ── Schedule page exports ────────────────────────────────────────
// // fetchScheduleList — same as fetchSchedule, aliased for clarity
// export const fetchScheduleList    = f => fetchMany('schedule',        f)

// // fetchTripDetails — fetch full trip detail by tripId (numeric ID)
// export const fetchTripDetails     = id => fetchById('tripDetails',    id)

// // fetchEfficientEmployees — fetch ranked employees for sidebar
// export const fetchEfficientEmployees = f => fetchOne('efficientEmployees', f)

// ─────────────────────────────────────────────────────────────────
//  API SERVICE
//  Dev:     json-server  →  npm run server  (port 3001)
//  Future:  just change BASE to your real backend URL
//
//  Start json-server:
//    npm run server
//    (or)  npx json-server --watch db.json --port 3001
// ─────────────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// ── Generic fetch all ────────────────────────────────────────────
async function getAll(endpoint) {
  const res = await fetch(`${BASE}/${endpoint}`)
  if (!res.ok) throw new Error(`Server error ${res.status} — is json-server running on port 3001?`)
  return res.json()
}

// ── Find ONE matching row by unit + shift + date ─────────────────
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

// ── Find ALL matching rows by unit + shift + date ────────────────
async function fetchMany(endpoint, filters) {
  const all = await getAll(endpoint)
  return all.filter(
    row =>
      row.unit  === filters.unit  &&
      row.shift === filters.shift &&
      row.date  === filters.date
  )
}

// ── Find by numeric id OR string empId ───────────────────────────
async function fetchById(endpoint, id) {
  const all = await getAll(endpoint)
  const match = all.find(row => row.id === id || row.empId === id)
  if (!match) throw new Error(`Not found: ${endpoint} / ${id}`)
  return match
}

// ────────────────────────────────────────────────────────────────
//  DASHBOARD
// ────────────────────────────────────────────────────────────────
export const fetchTripStats           = f  => fetchOne ('tripStats',       f)
export const fetchAttendanceStats     = f  => fetchOne ('attendanceStats', f)
export const fetchTodayStats          = f  => fetchOne ('todayStats',      f)
export const fetchSchedule            = f  => fetchMany('schedule',        f)

// ────────────────────────────────────────────────────────────────
//  SCHEDULE PAGE
// ────────────────────────────────────────────────────────────────
export const fetchScheduleList        = f  => fetchMany('schedule',             f)
export const fetchTripDetails         = id => fetchById('tripDetails',          id)
export const fetchEfficientEmployees  = f  => fetchOne ('efficientEmployees',   f)

// ────────────────────────────────────────────────────────────────
//  ATTENDANCE PAGE
// ────────────────────────────────────────────────────────────────
export const fetchAttendanceList           = f  => fetchOne ('attendanceList',           f)
export const fetchEmployeeAttendanceDetail = id => fetchById('employeeAttendanceDetail', id)
export const fetchPunctualEmployees        = f  => fetchOne ('punctualEmployees',        f)