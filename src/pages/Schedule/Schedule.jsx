import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate }   from 'react-router-dom'
import { Loader }        from 'rsuite'
import ExitIcon          from '@rsuite/icons/Exit'

import FilterBar          from '../../components/FilterBar/FilterBar'
import MiniCalendar       from './components/MiniCalendar/MiniCalendar'
import EfficientEmployees from './components/EfficientEmployees/EfficientEmployees'

import { fetchScheduleList, fetchEfficientEmployees } from '../../api'
import './Schedule.css'

const TABS = ['All', 'Upcoming', 'Ongoing', 'Missed', 'Complete']

function toStr(d) {
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const EMPTY = { data: null, loading: true, error: null }

export default function Schedule() {
  const navigate = useNavigate()

  const [unit,  setUnit]  = useState('All')
  const [shift, setShift] = useState('Shift 1')
  const [date,  setDate]  = useState(new Date(2025, 1, 20))
  const [tab,   setTab]   = useState('All')

  const [list, setList] = useState(EMPTY)
  const [eff,  setEff]  = useState(EMPTY)

  const fetchId = useRef(0)
  const dateStr = useMemo(() => toStr(date), [date])

  useEffect(() => {
    const id = ++fetchId.current
    const filters = { unit, shift, date: dateStr }
    setList(EMPTY); setEff(EMPTY)

    const safe = s => d => { if (id !== fetchId.current) return; s({ data: d, loading: false, error: null }) }
    const fail = s => e => { if (id !== fetchId.current) return; s({ data: null, loading: false, error: e.message }) }

    fetchScheduleList(filters)      .then(safe(setList)).catch(fail(setList))
    fetchEfficientEmployees(filters).then(safe(setEff)) .catch(fail(setEff))
  }, [unit, shift, dateStr])

  const rows = useMemo(() => {
    if (!list.data) return []
    if (tab === 'All') return list.data
    return list.data.filter(r => r.status === tab)
  }, [list.data, tab])

  return (
    <div className="schedule-page">

      <FilterBar
        unit={unit}   setUnit={setUnit}
        shift={shift} setShift={setShift}
        date={date}   setDate={setDate}
      />

      <div className="sched-body">

        {/* LEFT — list */}
        <div className="sched-left card">
          <div className="card-title">Scheduled List</div>

          <div className="sched-tabs">
            {TABS.map(t => (
              <button key={t} className={`sched-tab${tab===t?' active':''}`} onClick={() => setTab(t)}>{t}</button>
            ))}
            <div className="sched-tab-line" />
          </div>

          <div className="sched-table-head">
            <span className="sc-num">#</span>
            <span className="sc-name">Name</span>
            <span className="sc-id">ID</span>
            <span className="sc-task">Task</span>
            <span className="sc-type">Trip Type</span>
            <span className="sc-total">Total</span>
            <span className="sc-bar">Trip Status</span>
            <span className="sc-missed">Missed</span>
            <span className="sc-badge">Status</span>
            <span className="sc-act"></span>
          </div>

          <div className="sched-table-body">
            {list.loading && <div className="sched-center"><Loader size="sm" content="Loading..." /></div>}
            {list.error   && <div className="sched-center error-txt">⚠ {list.error}</div>}
            {!list.loading && !list.error && rows.length === 0 &&
              <div className="sched-center" style={{color:'var(--t3)',fontSize:13}}>No records found</div>}

            {rows.map((row, i) => (
              <div key={row.id} className="sched-row">
                <span className="sc-num">{i+1}.</span>

                <div className="sc-name">
                  <div className="emp-av">{row.name.charAt(0)}</div>
                  <div className="emp-info">
                    <span className="emp-name">{row.name}</span>
                    <span className="emp-login">{row.login}</span>
                  </div>
                </div>

                <span className="sc-id">{row.tripId}</span>
                <span className="sc-task">{row.task}</span>
                <span className="sc-type"><span className="type-pill">{row.tripType}</span></span>
                <span className="sc-total">{row.total}</span>

                <div className="sc-bar">
                  <div className="trip-track">
                    <div className="trip-fill" style={{width:`${Math.round((row.done/row.total)*100)}%`}} />
                  </div>
                  <span className="trip-lbl">{row.done}/{row.total}</span>
                </div>

                <span className="sc-missed">{row.missed}</span>

                <span className="sc-badge">
                  <span className={`st-badge ${row.status.toLowerCase()}`}>
                    {row.status}{row.status==='Ongoing'?' ↻':row.status==='Complete'?' ✓':''}
                  </span>
                </span>

                <div className="sc-act">
                  <button className="open-btn" onClick={() => navigate(`/schedule/trip/${row.tripId}`)} title="View Trip Details">
                    <ExitIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — sidebar */}
        <div className="sched-right">
          <MiniCalendar selectedDate={date} onDateSelect={setDate} />
          <EfficientEmployees data={eff.data} loading={eff.loading} error={eff.error} />
        </div>

      </div>
    </div>
  )
}