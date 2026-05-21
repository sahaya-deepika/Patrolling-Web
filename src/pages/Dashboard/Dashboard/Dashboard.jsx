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
  fetchScheduleCountByDate,
} from '../../../api'
import { useFilter } from '../../../components/FilterBar/FilterBar'
import './Dashboard.css'

function toStr(d) {
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const EMPTY = { data: null, loading: true, error: null }

const WORKER_UNITS = [
  { key: 'All',         label: 'All'         },
  { key: 'HR',          label: 'HR'          },
  { key: 'Guards',      label: 'Guards'      },
  { key: 'Electrician', label: 'Electrician' },
]

// ── component ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { unit, date } = useFilter()

  const [trip,  setTrip]  = useState(EMPTY)
  const [att,   setAtt]   = useState(EMPTY)
  const [today, setToday] = useState(EMPTY)
  const [sched, setSched] = useState(EMPTY)

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

    const isRange = rangeValue && rangeValue[0] && rangeValue[1]

    const statsPromise = isRange
      ? fetchTripStatsRange({
          unit:      baseFilters.unit,
          dateStart: toStr(rangeValue[0]),
          dateEnd:   toStr(rangeValue[1]),
        })
      : fetchTripStats(baseFilters)

    // Schedule count uses the FilterBar selected date (dateStr)
    Promise.all([statsPromise, fetchScheduleCountByDate(baseFilters.date || '')])
      .then(([d, scheduleCount]) => {
        setTrip({
          data: { ...d, allTrips: scheduleCount },
          loading: false,
          error: null,
        })
      })
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

    Promise.all([
      fetchTodayStatsByDate(filters.date),
      fetchScheduleCountByDate(filters.date),
    ])
      .then(([allRecords, scheduleCount]) => {
        if (id !== fetchTodayId.current) return
        const unitRecords = workerUnit === 'All'
          ? allRecords
          : allRecords.filter(r => r.unit === workerUnit)
        const agg = aggregateRecords(unitRecords)
        setToday({
          data: { ...agg, allTrips: scheduleCount },
          loading: false,
          error: null,
        })
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

  const handleManualRefresh = useCallback(() => {
    const id = ++fetchId.current
    const f  = { unit, date: dateStr }
    setAtt(EMPTY); setSched(EMPTY); setToday(EMPTY)
    fetchMainData(f, id)
    fetchTodayData(f, todayWorkerUnit)
    loadTrip(f, tripDateRange)
  }, [unit, dateStr, todayWorkerUnit, tripDateRange, fetchMainData, fetchTodayData, loadTrip])

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="dashboard">
      <FilterBar
        showDate={true}
        showAutoRefresh={true}
        onRefresh={handleManualRefresh}
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