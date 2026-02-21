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

// ── Generic fetch ────────────────────────────────────────────────
async function getAll(endpoint) {
  const res = await fetch(`${BASE}/${endpoint}`)
  if (!res.ok) throw new Error(`Server error ${res.status} — is json-server running on port 3001?`)
  return res.json()
}

// ── Find ONE matching row ────────────────────────────────────────
async function fetchOne(endpoint, filters) {
  const all = await getAll(endpoint)

  const match = all.find(
    row =>
      row.unit  === filters.unit  &&
      row.shift === filters.shift &&
      row.date  === filters.date
  )

  if (!match) {
    throw new Error(`No data found for: ${filters.unit} | ${filters.shift} | ${filters.date}`)
  }

  return match
}

// ── Find ALL matching rows (schedule has multiple rows per filter) ─
async function fetchMany(endpoint, filters) {
  const all = await getAll(endpoint)

  return all.filter(
    row =>
      row.unit  === filters.unit  &&
      row.shift === filters.shift &&
      row.date  === filters.date
  )
}

// ── Exports ──────────────────────────────────────────────────────
// When you move to a real backend, just update BASE above (or set
// VITE_API_URL in your .env file) — no other changes needed.
export const fetchTripStats       = f => fetchOne ('tripStats',       f)
export const fetchAttendanceStats = f => fetchOne ('attendanceStats', f)
export const fetchTodayStats      = f => fetchOne ('todayStats',      f)
export const fetchSchedule        = f => fetchMany('schedule',        f)