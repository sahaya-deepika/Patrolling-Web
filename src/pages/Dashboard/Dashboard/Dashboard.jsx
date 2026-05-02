
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import FilterBar       from '../../../components/FilterBar/FilterBar'
import TripStats       from '../components/TripStats/TripStats'
import AttendanceStats from '../components/AttendanceStats/AttendanceStats'
import TodayStats      from '../components/TodayStats/TodayStats'
import TodayScheduled  from '../components/TodayScheduled/TodayScheduled'
import {
  fetchTripStats,
  fetchTripStatsRange,
  fetchAttendanceStats,
  fetchSchedule,
  fetchTodayStatsByDate,
} from '../../../api'
import { useFilter } from '../../../components/FilterBar/FilterBar'
import './Dashboard.css'

function toStr(d) {
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const EMPTY      = { data: null, loading: true, error: null }
const REFRESH_MS = 2000

const WORKER_UNITS = [
  { key: 'All',         label: 'All'         },
  { key: 'HR',          label: 'HR'          },
  { key: 'Guards',      label: 'Guards'      },
  { key: 'Electrician', label: 'Electrician' },
]

// ── component ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { unit, date } = useFilter()

  const [trip,        setTrip]        = useState(EMPTY)
  const [att,         setAtt]         = useState(EMPTY)
  const [today,       setToday]       = useState(EMPTY)
  const [sched,       setSched]       = useState(EMPTY)
  const [autoRefresh, setAutoRefresh] = useState(false)

  const [todayWorkerUnit, setTodayWorkerUnit] = useState('All')
  const [tableData,       setTableData]       = useState([])
  const [tripDateRange,   setTripDateRange]   = useState(null)

  const fetchId      = useRef(0)
  const fetchTodayId = useRef(0)
  const dateStr      = useMemo(() => toStr(date), [date])

  // ── aggregation helpers ──────────────────────────────────────────────────

  const aggregateRecords = useCallback(records =>
    (Array.isArray(records) ? records : []).reduce(
      (acc, r) => ({
        allTrips:  acc.allTrips  + (r.allTrips  ?? 0),
        complete:  acc.complete  + (r.complete  ?? 0),
        upcoming:  acc.upcoming  + (r.upcoming  ?? 0),
        missed:    acc.missed    + (r.missed    ?? 0),
        cancelled: acc.cancelled + (r.cancelled ?? 0),
      }),
      { allTrips: 0, complete: 0, upcoming: 0, missed: 0, cancelled: 0 }
    ),
  [])

  const buildTableData = useCallback(
    allRecords => WORKER_UNITS.map(({ key, label }) => ({
      unit: label,
      ...aggregateRecords(allRecords.filter(r => r.unit === key)),
    })),
    [aggregateRecords]
  )

  // ── trip fetch ───────────────────────────────────────────────────────────

  const loadTrip = useCallback((baseFilters, rangeValue) => {
    setTrip(EMPTY)
    const promise = (rangeValue && rangeValue[0] && rangeValue[1])
      ? fetchTripStatsRange({
          unit:      baseFilters.unit,
          dateStart: toStr(rangeValue[0]),
          dateEnd:   toStr(rangeValue[1]),
        })
      : fetchTripStats(baseFilters)

    promise
      .then(d => setTrip({ data: d, loading: false, error: null }))
      .catch(e => setTrip({ data: null, loading: false, error: e.message }))
  }, [])

  // ── main data fetch ──────────────────────────────────────────────────────

  const fetchMainData = useCallback((filters, id) => {
    const safe = s => d => { if (id !== fetchId.current) return; s({ data: d, loading: false, error: null }) }
    const fail = s => e => { if (id !== fetchId.current) return; s({ data: null, loading: false, error: e.message }) }
    fetchAttendanceStats(filters).then(safe(setAtt)).catch(fail(setAtt))
    fetchSchedule(filters).then(safe(setSched)).catch(fail(setSched))
  }, [])

  // ── today stats ──────────────────────────────────────────────────────────

  const fetchTodayData = useCallback((filters, workerUnit) => {
    const id = ++fetchTodayId.current
    setToday(EMPTY)
    fetchTodayStatsByDate(filters.date)
      .then(allRecords => {
        if (id !== fetchTodayId.current) return
        const unitRecords = workerUnit === 'All'
          ? allRecords
          : allRecords.filter(r => r.unit === workerUnit)
        setToday({ data: aggregateRecords(unitRecords), loading: false, error: null })
        setTableData(buildTableData(allRecords))
      })
      .catch(e => {
        if (id !== fetchTodayId.current) return
        setToday({ data: null, loading: false, error: e.message })
        setTableData([])
      })
  }, [aggregateRecords, buildTableData])

  // ── effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const id = ++fetchId.current
    const f  = { unit, date: dateStr }
    setAtt(EMPTY); setSched(EMPTY); setToday(EMPTY)
    fetchMainData(f, id)
    fetchTodayData(f, todayWorkerUnit)
    loadTrip(f, tripDateRange)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, dateStr])

  useEffect(() => {
    loadTrip({ unit, date: dateStr }, tripDateRange)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripDateRange])

  useEffect(() => {
    fetchTodayData({ unit, date: dateStr }, todayWorkerUnit)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayWorkerUnit])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      const id = ++fetchId.current
      const f  = { unit, date: dateStr }
      setAtt(EMPTY); setSched(EMPTY); setToday(EMPTY)
      fetchMainData(f, id)
      fetchTodayData(f, todayWorkerUnit)
      loadTrip(f, tripDateRange)
    }, REFRESH_MS)
    return () => clearInterval(interval)
  }, [autoRefresh, unit, dateStr, todayWorkerUnit, tripDateRange, fetchMainData, fetchTodayData, loadTrip])

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="dashboard">
      <FilterBar
        showDate={true}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        showAutoRefresh={true}
      />

      <div className="dash-grid">
        <div className="dash-row dash-row-top">
          <div className="dash-col dash-col-left">
            <TripStats
              data={trip.data}
              loading={trip.loading}
              error={trip.error}
              onDateRangeChange={setTripDateRange}
            />
          </div>
          <div className="dash-col dash-col-right">
            <AttendanceStats data={att.data} loading={att.loading} error={att.error} />
          </div>
        </div>

        <div className="dash-row dash-row-bot">
          <div className="dash-col dash-col-left">
            <TodayScheduled data={sched.data} loading={sched.loading} error={sched.error} />
          </div>
          <div className="dash-col dash-col-right">
            <TodayStats
              data={today.data}
              loading={today.loading}
              error={today.error}
              tableData={tableData}
              onUnitChange={setTodayWorkerUnit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}