



import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Loader, Tag, Progress, Avatar } from 'rsuite'
import ExitIcon from '@rsuite/icons/Exit'

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

const STATUS_COLOR = { Ongoing: 'orange', Complete: 'green', Missed: 'red', Upcoming: 'violet' }

export default function Schedule() {
  const navigate = useNavigate()
  const location = useLocation()

  const [unit,  setUnit]  = useState('All')
  const [shift, setShift] = useState('Shift 1')
  const [date,  setDate]  = useState(new Date(2025, 1, 20))
  const [tab,   setTab]   = useState(location.state?.initialTab ?? 'All')
  const [selectedRow, setSelectedRow] = useState(null)

  useEffect(() => {
    if (location.state?.initialTab) {
      setTab(location.state.initialTab)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state?.initialTab])

  const [list, setList] = useState(EMPTY)
  const [eff,  setEff]  = useState(EMPTY)
  const fetchId = useRef(0)
  const dateStr = useMemo(() => toStr(date), [date])

  useEffect(() => {
    const id = ++fetchId.current
    const f = { unit, shift, date: dateStr }
    setList(EMPTY); setEff(EMPTY); setSelectedRow(null)
    const safe = s => d => { if (id !== fetchId.current) return; s({ data: d, loading: false, error: null }) }
    const fail = s => e => { if (id !== fetchId.current) return; s({ data: null, loading: false, error: e.message }) }
    fetchScheduleList(f).then(safe(setList)).catch(fail(setList))
    fetchEfficientEmployees(f).then(safe(setEff)).catch(fail(setEff))
  }, [unit, shift, dateStr])

  // Auto-select first row
  useEffect(() => {
    if (list.data?.length && !selectedRow) setSelectedRow(list.data[0])
  }, [list.data])

  const rows = useMemo(() => {
    if (!list.data) return []
    return tab === 'All' ? list.data : list.data.filter(r => r.status === tab)
  }, [list.data, tab])

  const hStyle = { fontSize: 11, fontWeight: 600, color: '#9aaec4', letterSpacing: '0.2px', padding: '0 6px' }

  return (
    <div className="schedule-page">
      <FilterBar unit={unit} setUnit={setUnit} shift={shift} setShift={setShift} date={date} setDate={setDate} />

      <div className="sched-body">
        <div className="sched-left card">
          <div className="card-title">Scheduled List</div>

          {/* Tabs */}
          <div className="sched-tabs">
            {TABS.map(t => (
              <button key={t} className={`sched-tab${tab===t?' active':''}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>

          {/* Table header */}
          <div className="sched-table-head">
            <span style={hStyle}>#</span>
            <span style={hStyle}>Name</span>
            <span style={hStyle}>ID</span>
            <span style={hStyle}>Task</span>
            <span style={hStyle}>Trip Type</span>
            <span style={hStyle}>Total</span>
            <span style={hStyle}>Trip Status</span>
            <span style={hStyle}>Missed</span>
            <span style={hStyle}>Status</span>
            <span style={hStyle}></span>
          </div>

          <div className="sched-table-body">
            {list.loading && <div className="sched-center"><Loader size="sm" content="Loading..." /></div>}
            {list.error   && <div className="sched-center error-txt">⚠ {list.error}</div>}
            {!list.loading && !list.error && rows.length === 0 && <div className="sched-center" style={{color:'var(--t3)',fontSize:13}}>No records</div>}

            {rows.map((row, i) => {
              const pct = row.total > 0 ? Math.round((row.done/row.total)*100) : 0
              const isSel = selectedRow?.id === row.id
              return (
                <div key={row.id} className={`sched-row${isSel?' sched-row-sel':''}`} onClick={() => setSelectedRow(row)}>
                  <span className="sc-num">{i+1}.</span>
                  <div className="sc-name">
                    <Avatar circle size="xs" style={{ background:'var(--accent)', color:'#fff', fontWeight:700, width:28, height:28, fontSize:12 }}>{row.name.charAt(0)}</Avatar>
                    <div className="emp-info">
                      <span className="emp-name">{row.name}</span>
                      <span className="emp-login">{row.login}</span>
                    </div>
                  </div>
                  <span className="sc-id">{row.tripId}</span>
                  <span className="sc-task">{row.task}</span>
                  <div className="sc-type">
                    <Tag style={{ background:'#4a6cf7', color:'#fff', fontWeight:700, fontSize:10.5, borderRadius:20, border:'none' }}>{row.tripType}</Tag>
                  </div>
                  <span className="sc-total">{row.total}</span>
                  <div className="sc-bar">
                    <div className="trip-track"><div className="trip-fill" style={{ width:`${pct}%` }} /></div>
                    <span className="trip-lbl">{row.done}/{row.total}</span>
                  </div>
                  <span className="sc-missed">{row.missed}</span>
                  <div className="sc-badge">
                    <Tag color={STATUS_COLOR[row.status]||'blue'} size="sm" style={{ fontWeight:700, fontSize:11, borderRadius:20 }}>
                      {row.status}{row.status==='Ongoing'?' ↻':row.status==='Complete'?' ✓':''}
                    </Tag>
                  </div>
                  <div className="sc-act">
                    <button className="open-btn" onClick={e => { e.stopPropagation(); navigate(`/schedule/trip/${row.tripId}`) }} title="View Trip Details">
                      <ExitIcon />
                    </button>
                  </div>
                </div>
              )
            })}
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