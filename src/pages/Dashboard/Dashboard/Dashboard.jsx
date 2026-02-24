
import { useState, useEffect, useRef, useMemo } from 'react'
import FilterBar       from '../../../components/FilterBar/FilterBar'
import TripStats       from '../components/TripStats/TripStats'
import AttendanceStats from '../components/AttendanceStats/AttendanceStats'
import TodayStats      from '../components/TodayStats/TodayStats'
import TodayScheduled  from '../components/TodayScheduled/TodayScheduled'
import { fetchTripStats, fetchAttendanceStats, fetchTodayStats, fetchSchedule } from '../../../api'
import './Dashboard.css'

function toStr(d) {
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
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
    const f = { unit, shift, date: dateStr }
    setTrip(EMPTY); setAtt(EMPTY); setToday(EMPTY); setSched(EMPTY)
    const safe = s => d => { if (id !== fetchId.current) return; s({ data: d, loading: false, error: null }) }
    const fail = s => e => { if (id !== fetchId.current) return; s({ data: null, loading: false, error: e.message }) }
    fetchTripStats(f).then(safe(setTrip)).catch(fail(setTrip))
    fetchAttendanceStats(f).then(safe(setAtt)).catch(fail(setAtt))
    fetchTodayStats(f).then(safe(setToday)).catch(fail(setToday))
    fetchSchedule(f).then(safe(setSched)).catch(fail(setSched))
  }, [unit, shift, dateStr])

  return (
    <div className="dashboard">
      <FilterBar unit={unit} setUnit={setUnit} shift={shift} setShift={setShift} date={date} setDate={setDate} />
      <div className="dash-grid">
        <div className="dash-row dash-row-top">
          <div className="dash-col dash-col-left">
            <TripStats data={trip.data} loading={trip.loading} error={trip.error} />
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
            <TodayStats data={today.data} loading={today.loading} error={today.error} />
          </div>
        </div>
      </div>
    </div>
  )
}