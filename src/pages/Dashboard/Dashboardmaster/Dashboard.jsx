import { useState, useEffect, useRef, useMemo } from 'react'

import FilterBar       from "../../../components/FilterBar/FilterBar"
import TripStats       from "../components/TripStats/TripStats"
import AttendanceStats from "../components/AttendanceStats/AttendanceStats"
import TodayStats      from "../components/TodayStats/TodayStats"
import TodayScheduled  from "../components/TodayScheduled/TodayScheduled"

import {
  fetchTripStats,
  fetchAttendanceStats,
  fetchTodayStats,
  fetchSchedule
} from "../../../api"

import "./Dashboard.css"

function toStr(d) {
  if (!d) return ''
  const y  = d.getFullYear()
  const m  = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

const EMPTY = { data: null, loading: true, error: null }

export default function Dashboard() {
  const [unit,  setUnit]  = useState('All')
  const [shift, setShift] = useState('Shift 1')
  const [date,  setDate]  = useState(new Date(2025, 1, 20))

  const [trip,  setTrip]  = useState(EMPTY)
  const [att,   setAtt]   = useState(EMPTY)
  const [today, setToday] = useState(EMPTY)
  const [sched, setSched] = useState(EMPTY)

  const fetchId = useRef(0)
  const dateStr = useMemo(() => toStr(date), [date])

  useEffect(() => {
    const id = ++fetchId.current
    const filters = { unit, shift, date: dateStr }

    console.log('🔄 Fetching:', filters)

    setTrip (EMPTY)
    setAtt  (EMPTY)
    setToday(EMPTY)
    setSched(EMPTY)

    const safe = (setter) => (data) => {
      if (id !== fetchId.current) return
      setter({ data, loading: false, error: null })
    }

    const fail = (setter) => (e) => {
      if (id !== fetchId.current) return
      setter({ data: null, loading: false, error: e.message })
    }

    fetchTripStats(filters)      .then(safe(setTrip )).catch(fail(setTrip ))
    fetchAttendanceStats(filters).then(safe(setAtt  )).catch(fail(setAtt  ))
    fetchTodayStats(filters)     .then(safe(setToday)).catch(fail(setToday))
    fetchSchedule(filters)       .then(safe(setSched)).catch(fail(setSched))

  }, [unit, shift, dateStr])

  return (
    <div className="dashboard">

      {/* FILTER BAR — reusable component from src/components/FilterBar */}
      <FilterBar
        unit={unit}   setUnit={setUnit}
        shift={shift} setShift={setShift}
        date={date}   setDate={setDate}
      />

      {/* ROW 1 */}
      <div className="dash-row row1">
        <TripStats       data={trip.data}  loading={trip.loading}  error={trip.error}  />
        <AttendanceStats data={att.data}   loading={att.loading}   error={att.error}   />
      </div>

      {/* ROW 2 */}
      <div className="dash-row row2">
        <TodayStats     data={today.data} loading={today.loading} error={today.error} />
        <TodayScheduled data={sched.data} loading={sched.loading} error={sched.error} />
      </div>

    </div>
  )
}