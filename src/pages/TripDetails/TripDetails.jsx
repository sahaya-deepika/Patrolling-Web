import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Panel, Modal, Avatar, Dropdown } from 'rsuite'
import ReactECharts from 'echarts-for-react'

import PhoneIcon    from '@rsuite/icons/PhoneFill'
import EmailIcon    from '@rsuite/icons/Message'
import WarningIcon  from '@rsuite/icons/WarningRound'
import LocationIcon from '@rsuite/icons/Location'
import GlobeIcon    from '@rsuite/icons/Global'
import PlayIcon     from '@rsuite/icons/PlayOutline'
import ReloadIcon   from '@rsuite/icons/Reload'

import { BsMicFill, BsImage, BsPlayCircleFill, BsEnvelopeFill, BsFileTextFill } from 'react-icons/bs'

import FilterBar          from '../../components/FilterBar/FilterBar'
import MiniCalendar       from '../Schedule/components/MiniCalendar/MiniCalendar'
import EfficientEmployees from '../Schedule/components/EfficientEmployees/EfficientEmployees'

import { fetchEfficientEmployees, fetchTripDetailEmployees } from '../../api'
import { useFilter } from '../../components/FilterBar/FilterBar'
import { DUMMY_PATROLS } from './patrolDummyData'
import './TripDetails.css'

/* ── Fallback employees ──────────────────────────────────────── */
const FALLBACK_EMPLOYEES = [
  { empId: 'EMP-1001', name: 'Karthik', department: 'Security',    role: 'Guard' },
  { empId: 'EMP-1002', name: 'Nicolas', department: 'Security',    role: 'Guard' },
  { empId: 'EMP-1003', name: 'Praveen', department: 'HR',          role: 'Supervisor' },
  { empId: 'EMP-1004', name: 'Ananya',  department: 'Maintenance', role: 'Technician' },
  { empId: 'EMP-1005', name: 'Rajan',   department: 'Maintenance', role: 'Technician' },
  { empId: 'EMP-1006', name: 'Divya',   department: 'Operations',  role: 'HR Executive' },
  { empId: 'EMP-1007', name: 'Suresh',  department: 'Security',    role: 'Electrician' },
  { empId: 'EMP-1008', name: 'Meena',   department: 'HR',          role: 'HR Executive' },
  { empId: 'EMP-1009', name: 'Arun',    department: 'Maintenance', role: 'Technician' },
  { empId: 'EMP-1010', name: 'Fatima',  department: 'Operations',  role: 'Electrician' },
  { empId: 'EMP-1011', name: 'Rahul',   department: 'Security',    role: 'Guard' },
  { empId: 'EMP-1012', name: 'Pooja',   department: 'HR',          role: 'Supervisor' },
  { empId: 'EMP-1013', name: 'Vijay',   department: 'Security',    role: 'Guard' },
  { empId: 'EMP-1014', name: 'Swetha',  department: 'Maintenance', role: 'Technician' },
  { empId: 'EMP-1015', name: 'Kumar',   department: 'Operations',  role: 'Electrician' },
  { empId: 'EMP-1016', name: 'Nisha',   department: 'Security',    role: 'Guard' },
  { empId: 'EMP-1017', name: 'Deepak',  department: 'HR',          role: 'HR Executive' },
  { empId: 'EMP-1018', name: 'Priya',   department: 'Maintenance', role: 'Technician' },
  { empId: 'EMP-1019', name: 'Ashwin',  department: 'Security',    role: 'Guard' },
  { empId: 'EMP-1020', name: 'Lakshmi', department: 'Operations',  role: 'Supervisor' },
  { empId: 'EMP-1021', name: 'Sanjay',  department: 'Security',    role: 'Guard' },
  { empId: 'EMP-1022', name: 'Kavitha', department: 'HR',          role: 'HR Executive' },
  { empId: 'EMP-1023', name: 'Balaji',  department: 'Maintenance', role: 'Technician' },
  { empId: 'EMP-1024', name: 'Rani',    department: 'Security',    role: 'Guard' },
  { empId: 'EMP-1025', name: 'Mohan',   department: 'Operations',  role: 'Electrician' },
  { empId: 'EMP-1026', name: 'Saranya', department: 'HR',          role: 'Supervisor' },
  { empId: 'EMP-1027', name: 'Dinesh',  department: 'Security',    role: 'Guard' },
]

function seedStats(empId) {
  const n = parseInt(empId.replace('EMP-', ''), 10) || 1
  return {
    tripsDone:  (n * 3) % 11 + 1,
    tripsTotal: 11,
    tasksDone:  (n * 2) % 6  + 1,
    tasksTotal: 6,
  }
}

const FALLBACK_EMP_LIST = FALLBACK_EMPLOYEES.map(e => ({ ...e, ...seedStats(e.empId) }))

function seededInt(seed, max) {
  return ((seed * 1103515245 + 12345) & 0x7fffffff) % max
}

const LOGIN_OPTIONS = ['On-time', 'On-time', 'Late']

function getPatrolsForEmployee(empId, empList) {
  const list = empList?.length ? empList : FALLBACK_EMP_LIST
  const idx  = list.findIndex(e => e.empId === empId)
  const seed = idx >= 0 ? idx : 0

  const patrolStatuses = DUMMY_PATROLS.map((_, pi) => {
    if (pi <  seed % 3)  return 'Complete'
    if (pi === seed % 3) return seed % 2 === 0 ? 'Ongoing' : 'Upcoming'
    return 'Upcoming'
  })

  return DUMMY_PATROLS.map((p, pi) => {
    const pSeed        = seed * 31 + pi
    const patrolStatus = patrolStatuses[pi]

    const updatedTripPoints = p.tripPoints.map((tp, ti) => {
      const tpSeed = pSeed * 7 + ti
      let tpStatus
      if (patrolStatus === 'Complete') {
        tpStatus = 'Complete'
      } else if (patrolStatus === 'Upcoming' || patrolStatus === 'Missed') {
        tpStatus = 'Upcoming'
      } else {
        const cutoff = seed % (p.tripPoints.length + 1)
        if (ti < cutoff)        tpStatus = 'Complete'
        else if (ti === cutoff) tpStatus = 'Ongoing'
        else                    tpStatus = 'Upcoming'
      }
      const checkpoints = Math.max(1, tp.checkpoints + seededInt(tpSeed, 3) - 1)
      const minOffset   = seededInt(tpSeed + 1, 11) - 5
      const match       = tp.time.match(/^(\d+):(\d+)(am|pm)$/i)
      let newTime       = tp.time
      if (match) {
        let h = parseInt(match[1], 10)
        let m = parseInt(match[2], 10) + minOffset
        if (m >= 60) { m -= 60; h += 1 }
        if (m < 0)   { m += 60; h -= 1 }
        newTime = `${h}:${String(m).padStart(2, '0')}${match[3]}`
      }
      return {
        ...tp,
        status:      tpStatus,
        checkpoints: checkpoints,
        time:        newTime,
        stats: tp.stats.map((s, si) => Math.max(0, s + seededInt(tpSeed + si + 2, 3) - 1)),
      }
    })

    const tripDoneOf = updatedTripPoints.filter(tp => tp.status === 'Complete').length
    return {
      ...p,
      loginStatus: LOGIN_OPTIONS[(seed + pi) % LOGIN_OPTIONS.length],
      rounds:      Math.max(1, (p.rounds + seed) % (p.tripTotal + 1)),
      status:      patrolStatus,
      tripDoneOf:  tripDoneOf,
      tripPoints:  updatedTripPoints,
    }
  })
}

function toStr(d) {
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const AVATAR_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#84CC16']
const avatarColor   = name => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

const MEDIA_ICONS = [
  { type: 'voice',   Icon: BsMicFill },
  { type: 'photo',   Icon: BsImage },
  { type: 'video',   Icon: BsPlayCircleFill },
  { type: 'message', Icon: BsEnvelopeFill },
  { type: 'report',  Icon: BsFileTextFill },
]

const EMPTY = { data: null, loading: true, error: null }

/* ── Gauge Chart ─────────────────────────────────────────────── */
function TripGauge({ done, total, timeLabel }) {
  const pct = total > 0 ? done / total : 0
  const option = {
    series: [{
      type:       'gauge',
      startAngle: 200,
      endAngle:   -20,
      min:        0,
      max:        total || 1,
      radius:     '92%',
      center:     ['50%', '64%'],
      axisLine: {
        lineStyle: {
          width: 16,
          color: [
            [pct, {
              type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0,   color: '#f5c518' },
                { offset: 0.5, color: '#3b7ff5' },
                { offset: 1,   color: '#93c5fd' },
              ],
            }],
            [1, '#e8edf6'],
          ],
        },
      },
      axisTick:  { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      pointer:   { show: false },
      detail: {
        valueAnimation: true,
        formatter: () => `{v|${done}/${total}}\n{l|Complete}`,
        rich: {
          v: { fontSize: 22, fontWeight: 700, color: '#1b2f4e', lineHeight: 30 },
          l: { fontSize: 12, color: '#8a9bbf', lineHeight: 20 },
        },
        offsetCenter: [0, '18%'],
      },
      data: [{ value: done }],
    }],
    backgroundColor: 'transparent',
  }
  return (
    <div className="td-gauge-wrap">
      {timeLabel && <span className="td-gauge-time">{timeLabel} ↻</span>}
      <ReactECharts option={option} style={{ height: 180, width: '100%' }} opts={{ renderer: 'svg' }} />
    </div>
  )
}

/* ── Status Button ───────────────────────────────────────────── */
function StatusBtn({ status }) {
  const map = {
    Ongoing:  { color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
    Complete: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
    Upcoming: { color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
    Missed:   { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  }
  const s = map[status] || map.Upcoming
  return (
    <span className="td-status-btn" style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      {status}
      {status === 'Ongoing'  && <ReloadIcon style={{ fontSize: 9, marginLeft: 3 }} />}
      {status === 'Complete' && <span style={{ marginLeft: 3 }}>✓</span>}
    </span>
  )
}

/* ── Media Icon Button — patrol card ────────────────────────── */
function MediaIconBtn({ Icon, count, onClick, active }) {
  const isEmpty = count === 0
  return (
    <button
      className={`td-media-btn${active ? ' td-media-btn-active' : ''}${isEmpty ? ' td-media-btn-empty' : ''}`}
      onClick={!isEmpty ? onClick : undefined}
      disabled={isEmpty}
      title={`${count}`}
    >
      <Icon size={12} />
      <span className="td-media-count">{count}</span>
    </button>
  )
}

/* ── Media Icon Button — trip point ─────────────────────────── */
function TpMediaIconBtn({ Icon, count, onClick, active }) {
  const isEmpty = count === 0
  return (
    <div className="td-tp-icon-item">
      <button
        className={`td-tp-media-btn${active ? ' td-tp-media-btn-active' : ''}${isEmpty ? ' td-tp-media-btn-empty' : ''}`}
        onClick={e => { e.stopPropagation(); if (!isEmpty) onClick() }}
        disabled={isEmpty}
      >
        <Icon size={11} />
      </button>
      <span className="td-tp-media-count">{count}</span>
    </div>
  )
}

/* ── Media Popup Modal ───────────────────────────────────────── */
function MediaPopup({ open, onClose, type, items = [], patrolName }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = items[activeIdx]
  const TITLES = {
    voice:   '🎤 Voice Messages',
    photo:   '📷 Photos',
    video:   '🎥 Videos',
    message: '✉️ Messages',
    report:  '📋 Reports',
  }
  return (
    <Modal open={open} onClose={onClose} size="sm" className="media-modal">
      <Modal.Header>
        <Modal.Title style={{ fontSize: 14, fontWeight: 700 }}>
          {TITLES[type]} — <span style={{ color: '#3b7ff5', fontWeight: 500 }}>{patrolName}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: 0 }}>
        {items.length === 0 ? (
          <div className="mp-empty">No {type} files for this patrol.</div>
        ) : (
          <div className="mp-body">
            <div className="mp-list">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className={`mp-list-item${i === activeIdx ? ' mp-list-item-sel' : ''}`}
                  onClick={() => setActiveIdx(i)}
                >
                  {(type === 'photo' || type === 'video') && (
                    <div className="mp-thumb-wrap">
                      <img src={item.thumb} alt={item.label} className="mp-thumb" />
                      {type === 'video' && <span className="mp-play-overlay"><PlayIcon /></span>}
                    </div>
                  )}
                  <div className="mp-item-info">
                    <span className="mp-item-label">{item.label}</span>
                    {item.duration && <span className="mp-item-meta">{item.duration}</span>}
                    {item.time     && <span className="mp-item-meta">{item.time}</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mp-preview">
              {!active && <div className="mp-empty">Select an item</div>}
              {active && type === 'voice'   && (<div className="mp-voice"><div className="mp-voice-icon">🎤</div><div className="mp-voice-label">{active.label}</div><div className="mp-voice-dur">{active.duration}</div><audio controls src={active.url} className="mp-audio" /></div>)}
              {active && type === 'photo'   && (<div className="mp-photo"><img src={active.url} alt={active.label} className="mp-photo-img" /><div className="mp-caption">{active.label}</div></div>)}
              {active && type === 'video'   && (<div className="mp-video"><video controls src={active.url} className="mp-video-el" key={active.url} /><div className="mp-caption">{active.label}</div></div>)}
              {active && type === 'message' && (<div className="mp-msg"><div className="mp-msg-time">{active.time}</div><div className="mp-msg-bubble">{active.text}</div></div>)}
              {active && type === 'report'  && (<div className="mp-report"><div className="mp-report-title">{active.label}</div><div className="mp-report-time">{active.time}</div><div className="mp-report-body">{active.text}</div></div>)}
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function TripDetails() {
  const navigate = useNavigate()
  const { unit } = useFilter()
  const [date, setDate] = useState(new Date(2025, 10, 25))

  const [eff,         setEff]         = useState(EMPTY)
  const [employees,   setEmployees]   = useState(FALLBACK_EMP_LIST)
  const [empLoading,  setEmpLoading]  = useState(false)
  const [showAllEmps, setShowAllEmps] = useState(false)

  const [selectedDept,  setSelectedDept]  = useState('All')
  const [selectedEmpId, setSelectedEmpId] = useState(FALLBACK_EMP_LIST[0].empId)
  const [selectedId,    setSelectedId]    = useState(DUMMY_PATROLS[0].id)
  const [selectedTpId,  setSelectedTpId]  = useState(null)
  const [popup,         setPopup]         = useState({ open: false, type: null, patrolId: null })
  const [tpPopup,       setTpPopup]       = useState({ open: false, type: null, tripPointId: null })

  const dateStr = toStr(date)

  /* ── Fetch employees ── */
  useEffect(() => {
    setEmpLoading(true)
    fetchTripDetailEmployees({ unit, date: dateStr })
      .then(list => {
        if (!list?.length) return
        const enriched = list.map(e => ({ ...e, ...seedStats(e.empId) }))
        setEmployees(enriched)
        const first = selectedDept === 'All'
          ? enriched[0]
          : enriched.find(e => e.department === selectedDept) ?? enriched[0]
        if (first) setSelectedEmpId(first.empId)
      })
      .catch(() => {})
      .finally(() => setEmpLoading(false))
  }, [unit, dateStr]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Fetch efficient employees ── */
  useEffect(() => {
    setEff(EMPTY)
    fetchEfficientEmployees({ unit, date: dateStr })
      .then(d  => setEff({ data: d,    loading: false, error: null }))
      .catch(e => setEff({ data: null, loading: false, error: e.message }))
  }, [unit, dateStr])

  /* ── Reset selection when patrol changes ── */
  useEffect(() => { setSelectedTpId(null) }, [selectedId])

  /* ── Reset patrol list when employee changes ── */
  useEffect(() => {
    if (!currentPatrols.length) return
    setSelectedId(currentPatrols[0].id)
    setSelectedTpId(null)
    setPopup({ open: false, type: null, patrolId: null })
    setTpPopup({ open: false, type: null, tripPointId: null })
  }, [selectedEmpId]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Reset selected employee when dept changes ── */
  useEffect(() => {
    if (!employees.length) return
    const first = selectedDept === 'All'
      ? employees[0]
      : employees.find(e => e.department === selectedDept) ?? employees[0]
    setSelectedEmpId(first?.empId ?? null)
  }, [selectedDept]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Derived: dept options ── */
  const deptOptions = useMemo(() => {
    const depts = [...new Set(employees.map(e => e.department))].sort()
    return ['All', ...depts]
  }, [employees])

  /* ── Derived: filtered employees by dept ── */
  const filteredEmps = useMemo(
    () => selectedDept === 'All' ? employees : employees.filter(e => e.department === selectedDept),
    [selectedDept, employees]
  )

  /* ── Derived: current employee ── */
  const currentEmp = useMemo(
    () => employees.find(e => e.empId === selectedEmpId) ?? employees[0] ?? null,
    [selectedEmpId, employees]
  )

  /* ── Derived: patrols for current employee ── */
  const currentPatrols = useMemo(
    () => selectedEmpId ? getPatrolsForEmployee(selectedEmpId, employees) : DUMMY_PATROLS,
    [selectedEmpId, employees]
  )

  /* ── Derived: selected patrol ── */
  const selectedPatrol = useMemo(
    () => currentPatrols.find(p => p.id === selectedId) ?? currentPatrols[0],
    [selectedId, currentPatrols]
  )

  /* ── Derived: popup patrol ── */
  const popupPatrol = useMemo(
    () => currentPatrols.find(p => p.id === popup.patrolId) ?? null,
    [popup.patrolId, currentPatrols]
  )

  /* ── Derived: trip-point popup ── */
  const tpPopupPoint = useMemo(() => {
    if (!selectedPatrol || !tpPopup.tripPointId) return null
    return selectedPatrol?.tripPoints?.find(tp => tp.id === tpPopup.tripPointId) ?? null
  }, [selectedPatrol, tpPopup.tripPointId])

  /* ── Gauge time label ── */
  const gaugeTimeLabel = useMemo(() => {
    if (!selectedPatrol) return ''
    const parseHour = t => {
      const m = t?.match(/^(\d+):(\d+)(am|pm)/i)
      if (!m) return 0
      let h = parseInt(m[1])
      if (m[3].toLowerCase() === 'pm' && h !== 12) h += 12
      if (m[3].toLowerCase() === 'am' && h === 12) h = 0
      return h + parseInt(m[2]) / 60
    }
    const diff = parseHour(selectedPatrol.timeTo) - parseHour(selectedPatrol.timeFrom)
    return diff > 0 ? `${diff.toFixed(2)}hr` : ''
  }, [selectedPatrol])

  const handleContact = () => alert(`Calling ${currentEmp?.name ?? ''}...`)
  const handleMessage = () => alert(`Opening message with ${currentEmp?.name ?? ''}...`)
  const handleAlert   = () => alert(`Sending alert to ${currentEmp?.name ?? ''}...`)

  if (!currentEmp) return null

  /* avatar row: first 10 + "More" pill */

  return (
    <div className="trip-details-page">
      <FilterBar />

      <div className="td-body">

        {/* ══ LEFT PANEL ══════════════════════════════════════════════ */}
        <Panel
          className="td-left-panel"
          header={
            <div className="td-panel-header">
              <span className="td-panel-title">Scheduled List</span>
              <Dropdown
                title={
                  <span className="td-dept-label">
                    {selectedDept === 'All' ? 'Department' : selectedDept} ▾
                  </span>
                }
                appearance="subtle"
                size="xs"
                className="td-dept-dropdown"
                placement="bottomEnd"
                menuStyle={{ zIndex: 1200 }}
              >
                {deptOptions.map(d => (
                  <Dropdown.Item
                    key={d}
                    active={selectedDept === d}
                    onSelect={() => {
                      setSelectedDept(d)
                      const first = d === 'All'
                        ? employees[0]
                        : employees.find(e => e.department === d) ?? employees[0]
                      if (first) setSelectedEmpId(first.empId)
                    }}
                    style={{ fontSize: 12 }}
                  >
                    {d === 'All' ? 'All Departments' : d}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
          }
        >

          {/* ── Avatar section ── */}
          {empLoading ? (
            <span style={{ fontSize: 11, color: '#9aaec4', padding: '8px 2px' }}>Loading…</span>
          ) : showAllEmps ? (
            /* ── EXPANDED: grid with name + ID below each avatar ── */
            <div className="td-avatar-expanded-wrap">
              <div className="td-avatar-grid-expanded">
                {filteredEmps.map(emp => (
                  <div
                    key={emp.empId}
                    className={`td-avatar-grid-item${selectedEmpId === emp.empId ? ' td-avatar-item-sel' : ''}`}
                    onClick={() => setSelectedEmpId(emp.empId)}
                    title={emp.empId}
                  >
                    <Avatar
                      circle size="sm"
                      style={{ background: avatarColor(emp.name), color: '#fff', fontWeight: 700, fontSize: 13 }}
                    >
                      {emp.name.charAt(0)}
                    </Avatar>
                    <span className="td-avatar-grid-name">{emp.name}</span>
                    <span className="td-avatar-grid-id">ID: {emp.empId.replace('EMP-', '')}</span>
                  </div>
                ))}
              </div>
              <div className="td-avatar-show-less" onClick={() => setShowAllEmps(false)}>
                Show less
              </div>
            </div>
          ) : (
            /* ── COLLAPSED: horizontal row of 10 + More ── */
            <div className="td-avatar-row-wrap">
              {filteredEmps.slice(0, 10).map(emp => (
                <div
                  key={emp.empId}
                  className={`td-avatar-item${selectedEmpId === emp.empId ? ' td-avatar-item-sel' : ''}`}
                  onClick={() => setSelectedEmpId(emp.empId)}
                  title={emp.empId}
                >
                  <Avatar
                    circle size="sm"
                    style={{ background: avatarColor(emp.name), color: '#fff', fontWeight: 700, fontSize: 13 }}
                  >
                    {emp.name.charAt(0)}
                  </Avatar>
                  <span className="td-avatar-name">{emp.name}</span>
                </div>
              ))}
              {filteredEmps.length > 10 && (
                <div className="td-avatar-more-cell" onClick={() => setShowAllEmps(true)}>
                  More
                </div>
              )}
            </div>
          )}

          {/* ── Employee card ── */}
          <div className="td-emp-card">
            <div className="td-emp-header">
              <Avatar
                circle size="md"
                style={{ background: avatarColor(currentEmp.name), color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0, width: 44, height: 44 }}
              >
                {currentEmp.name.charAt(0)}
              </Avatar>
              <div className="td-emp-info">
                <span className="td-emp-name">{currentEmp.name}</span>
                <span className="td-emp-id">ID : {currentEmp.empId.replace('EMP-', '')}</span>
              </div>
              <div className="td-emp-actions">
                <button className="td-action-btn contact" onClick={handleContact}>
                  <PhoneIcon style={{ fontSize: 11 }} /> Contact
                </button>
                <button className="td-action-btn message" onClick={handleMessage}>
                  <EmailIcon style={{ fontSize: 11 }} /> Message
                </button>
                <button className="td-action-btn alert-btn" onClick={handleAlert}>
                  <WarningIcon style={{ fontSize: 11 }} /> Alert
                </button>
              </div>
            </div>

            <div className="td-emp-divider" />

            <div className="td-stats-row">
              <div className="td-stat-box">
                <span className="td-stat-label">Trips</span>
                <span className="td-stat-value">{currentEmp.tripsDone}/{currentEmp.tripsTotal}</span>
                <div className="td-stat-bar">
                  <div className="td-stat-fill" style={{ width: `${Math.round(currentEmp.tripsDone / currentEmp.tripsTotal * 100)}%` }} />
                </div>
              </div>
              <div className="td-stat-box">
                <span className="td-stat-label">Tasks Completions</span>
                <span className="td-stat-value">{currentEmp.tasksDone}/{currentEmp.tasksTotal}</span>
                <div className="td-stat-bar">
                  <div className="td-stat-fill" style={{ width: `${Math.round(currentEmp.tasksDone / currentEmp.tasksTotal * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Patrol cards ── */}
          <div className="td-patrol-list">
            {currentPatrols.map(p => (
              <div
                key={p.id}
                className={`td-patrol-card${selectedId === p.id ? ' td-patrol-card-sel' : ''}`}
                onClick={() => setSelectedId(p.id)}
              >
                <div className="td-patrol-top">
                  <div className="td-patrol-time-row">
                    <span className="td-patrol-range">{p.timeFrom} to {p.timeTo}</span>
                    <span className={`td-login-badge ${p.loginStatus === 'On-time' ? 'ontime' : 'late'}`}>
                      {p.loginStatus}
                    </span>
                  </div>
                  <div className="td-patrol-media-icons" onClick={e => e.stopPropagation()}>
                    {MEDIA_ICONS.map(({ type, Icon }) => {
                      const count = p.media?.[type]?.length ?? 0
                      return (
                        <MediaIconBtn
                          key={type} Icon={Icon} count={count}
                          active={popup.open && popup.type === type && popup.patrolId === p.id}
                          onClick={() => setPopup({ open: true, type, patrolId: p.id })}
                        />
                      )
                    })}
                  </div>
                </div>

                <div className="td-patrol-name">
                  <LocationIcon style={{ color: '#3b7ff5', fontSize: 12 }} />
                  <span>{p.name}</span>
                </div>

                <div className="td-patrol-bottom">
                  <span className="td-patrol-meta">Cycle</span>
                  <span className="td-patrol-meta">Rounds: {p.rounds}/{p.tripTotal}</span>
                  <span className="td-patrol-meta">Checkpoints: {p.checkpoints}</span>
                  <span style={{ marginLeft: 'auto' }}>
                    <StatusBtn status={p.status} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* ══ MIDDLE PANEL ════════════════════════════════════════════ */}
        <Panel className="td-middle-panel">
          <div className="td-mid-header">
            <div className="td-mid-patrol-info">
              <div className="td-mid-patrol-name">
                <LocationIcon style={{ color: '#3b7ff5', fontSize: 14 }} />
                <span>{selectedPatrol.name.split('—')[0].trim()}</span>
              </div>
              <div className="td-mid-patrol-time">
                <span>{selectedPatrol.timeFrom} to {selectedPatrol.timeTo}</span>
                <span className={`td-login-badge ${selectedPatrol.loginStatus === 'On-time' ? 'ontime' : 'late'}`}>
                  {selectedPatrol.loginStatus}
                </span>
              </div>
            </div>
            <button className="td-order-trip-btn" onClick={() => navigate('/schedule')}>
              Order Trip →
            </button>
          </div>

          <TripGauge
            done={selectedPatrol.tripDoneOf}
            total={selectedPatrol.tripTotal}
            timeLabel={gaugeTimeLabel}
          />

          <div className="td-trip-pts-title">
            <span>Trip Points</span>
            <GlobeIcon style={{ marginLeft: 6, color: '#3b7ff5', fontSize: 14 }} />
          </div>

          <div className="td-trip-pts">
            {(selectedPatrol.tripPoints ?? []).map(tp => (
              <div
                key={tp.id}
                className={`td-tp-card${selectedTpId === tp.id ? ' td-tp-card-sel' : ''}`}
                onClick={() => setSelectedTpId(tp.id === selectedTpId ? null : tp.id)}
              >
                <div className="td-tp-header">
                  <div className="td-tp-info">
                    <LocationIcon style={{ color: '#ef4444', fontSize: 14, flexShrink: 0 }} />
                    <div className="td-tp-details">
                      <span className="td-tp-name">{tp.name}</span>
                      <span className="td-tp-time">{tp.time}</span>
                    </div>
                  </div>
                  <div className="td-tp-media-icons" onClick={e => e.stopPropagation()}>
                    {MEDIA_ICONS.map(({ type, Icon }) => {
                      const count = tp.media?.[type]?.length ?? 0
                      return (
                        <TpMediaIconBtn
                          key={type} Icon={Icon} count={count}
                          active={tpPopup.open && tpPopup.type === type && tpPopup.tripPointId === tp.id}
                          onClick={() => setTpPopup({ open: true, type, tripPointId: tp.id })}
                        />
                      )
                    })}
                  </div>
                </div>
                <div className="td-tp-bottom">
                  <span className="td-tp-chk">Checkpoints: {tp.checkpoints}</span>
                  <StatusBtn status={tp.status} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* ══ RIGHT SIDEBAR ═══════════════════════════════════════════ */}
        <div className="td-right">
          <MiniCalendar selectedDate={date} onDateSelect={setDate} />
          <EfficientEmployees data={eff.data} loading={eff.loading} error={eff.error} />
        </div>

      </div>

      <MediaPopup
        open={popup.open}
        onClose={() => setPopup({ open: false, type: null, patrolId: null })}
        type={popup.type}
        items={popupPatrol?.media?.[popup.type] ?? []}
        patrolName={popupPatrol?.name ?? ''}
      />
      <MediaPopup
        open={tpPopup.open}
        onClose={() => setTpPopup({ open: false, type: null, tripPointId: null })}
        type={tpPopup.type}
        items={tpPopupPoint?.media?.[tpPopup.type] ?? []}
        patrolName={`${selectedPatrol?.name ?? ''} — ${tpPopupPoint?.name ?? ''}`}
      />
    </div>
  )
}