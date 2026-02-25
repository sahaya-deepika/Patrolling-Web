import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Panel, Loader, Tag, Button, IconButton, Modal, Avatar } from 'rsuite'
import ReactECharts from 'echarts-for-react'

import PhoneIcon    from '@rsuite/icons/PhoneFill'
import EmailIcon    from '@rsuite/icons/Message'
import WarningIcon  from '@rsuite/icons/WarningRound'
import LocationIcon from '@rsuite/icons/Location'
import GlobeIcon    from '@rsuite/icons/Global'
import CloseIcon    from '@rsuite/icons/Close'
import PlayIcon     from '@rsuite/icons/PlayOutline'

import { BsMicFill, BsImage, BsPlayCircleFill, BsEnvelopeFill, BsFileTextFill } from 'react-icons/bs'

import FilterBar          from '../../components/FilterBar/FilterBar'
import MiniCalendar       from '../Schedule/components/MiniCalendar/MiniCalendar'
import EfficientEmployees from '../Schedule/components/EfficientEmployees/EfficientEmployees'

import { fetchEfficientEmployees } from '../../api'
import { DUMMY_PATROLS } from './patrolDummyData'
import './TripDetails.css'

const EMPLOYEE = {
  employeeName:       'Karthik',
  employeeId:         '1234',
  cycleDone:          10,
  cycleTotal:         11,
  checkpointsDone:    4,
  checkpointsTotal:   6,
}

const EMPTY = { data: null, loading: true, error: null }

function toStr(d) {
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const AVATAR_COLORS = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444']
const avatarColor = name => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

const MEDIA_ICONS = [
  { type:'voice',   Icon: BsMicFill,        label:'Voices' },
  { type:'photo',   Icon: BsImage,          label:'Photos' },
  { type:'video',   Icon: BsPlayCircleFill, label:'Videos' },
  { type:'message', Icon: BsEnvelopeFill,   label:'Messages' },
  { type:'report',  Icon: BsFileTextFill,   label:'Reports' },
]

/* ── Gauge Chart ────────────────────────────────────────────── */
function TripGauge({ done, total }) {
  const pct = total > 0 ? done / total : 0
  const option = {
    series: [{
      type: 'gauge', startAngle: 200, endAngle: -20,
      min: 0, max: total || 1, radius: '95%', center: ['50%','62%'],
      axisLine: { lineStyle: { width: 14,
        color: [[pct, { type:'linear', x:0, y:0, x2:1, y2:0,
          colorStops:[{offset:0,color:'#f5c518'},{offset:.5,color:'#3b7ff5'},{offset:1,color:'#93c5fd'}]
        }],[1,'#e8edf6']],
      }},
      axisTick:{show:false}, splitLine:{show:false}, axisLabel:{show:false}, pointer:{show:false},
      detail:{
        valueAnimation:true,
        formatter: () => `{v|${done}/${total}}\n{l|Complete}`,
        rich:{ v:{fontSize:20,fontWeight:700,color:'#1b2f4e',lineHeight:28}, l:{fontSize:12,color:'#8a9bbf',lineHeight:20} },
        offsetCenter:[0,'20%'],
      },
      data:[{ value: done }],
    }],
    backgroundColor:'transparent',
  }
  return <ReactECharts option={option} style={{ height:175, width:'100%' }} opts={{ renderer:'svg' }} />
}

/* ── Status Badge (rsuite Tag) ────────────────────────────────────────── */
function StatusBadge({ status }) {
  const colors = { Ongoing:'orange', Complete:'green', Missed:'red', Upcoming:'violet' }
  const symbols = { Ongoing:'↻', Complete:'✓', Missed:'', Upcoming:'' }
  return (
    <Tag color={colors[status]||'blue'} size="sm"
      style={{ fontWeight:700, fontSize:11, borderRadius:5 }}>
      {status} {symbols[status]||''}
    </Tag>
  )
}

/* ── Media Icon Button ────────────────────────────────────────── */
function MediaIconBtn({ Icon, count, onClick, active }) {
  return (
    <IconButton
      icon={<Icon size={13} />}
      appearance="subtle"
      size="xs"
      disabled={count === 0}
      onClick={count > 0 ? onClick : undefined}
      title={`${count} ${count === 1 ? 'item' : 'items'}`}
      className={`td-media-btn${active ? ' td-media-btn-active' : ''}${count === 0 ? ' td-media-btn-empty' : ''}`}
    >
      <span className="td-media-count">{count}</span>
    </IconButton>
  )
}

/* ── Media Popup Modal ────────────────────────────────────────── */
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
        <IconButton 
          icon={<CloseIcon />} 
          onClick={onClose}
          appearance="subtle"
          size="sm"
          style={{ position: 'absolute', right: 10, top: 10 }}
        />
      </Modal.Header>
      <Modal.Body style={{ padding: 0 }}>
        {items.length === 0 ? (
          <div className="mp-empty">No {type} files for this patrol.</div>
        ) : (
          <div className="mp-body">

            {/* ── AREA A: Left List ── */}
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

            {/* ── AREA B: Right Preview ── */}
            <div className="mp-preview">
              {!active && <div className="mp-empty">Select an item</div>}

              {active && type === 'voice' && (
                <div className="mp-voice">
                  <div className="mp-voice-icon">🎤</div>
                  <div className="mp-voice-label">{active.label}</div>
                  <div className="mp-voice-dur">{active.duration}</div>
                  <audio controls src={active.url} className="mp-audio" />
                </div>
              )}

              {active && type === 'photo' && (
                <div className="mp-photo">
                  <img src={active.url} alt={active.label} className="mp-photo-img" />
                  <div className="mp-caption">{active.label}</div>
                </div>
              )}

              {active && type === 'video' && (
                <div className="mp-video">
                  <video controls src={active.url} className="mp-video-el" key={active.url} />
                  <div className="mp-caption">{active.label}</div>
                </div>
              )}

              {active && type === 'message' && (
                <div className="mp-msg">
                  <div className="mp-msg-time">{active.time}</div>
                  <div className="mp-msg-bubble">{active.text}</div>
                </div>
              )}

              {active && type === 'report' && (
                <div className="mp-report">
                  <div className="mp-report-title">{active.label}</div>
                  <div className="mp-report-time">{active.time}</div>
                  <div className="mp-report-body">{active.text}</div>
                </div>
              )}
            </div>

          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN TRIP DETAILS COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function TripDetails() {
  const navigate = useNavigate()
  const [unit,  setUnit]  = useState('All')
  const [shift, setShift] = useState('Shift 1')
  const [date,  setDate]  = useState(new Date(2025, 1, 20))
  const [eff,   setEff]   = useState(EMPTY)

  const [selectedId, setSelectedId] = useState(DUMMY_PATROLS[0].id)
  const [selectedTpId, setSelectedTpId] = useState(null)  // ← ADDED: selected trip point
  const [popup, setPopup] = useState({ open:false, type:null, patrolId:null })
  const [tpPopup, setTpPopup] = useState({ open:false, type:null, tripPointId:null })

  const dateStr = toStr(date)

  useEffect(() => {
    setEff(EMPTY)
    fetchEfficientEmployees({ unit, shift, date: dateStr })
      .then(d  => setEff({ data:d, loading:false, error:null }))
      .catch(e => setEff({ data:null, loading:false, error:e.message }))
  }, [unit, shift, dateStr])

  // ← ADDED: reset trip point selection when patrol changes
  useEffect(() => { setSelectedTpId(null) }, [selectedId])

  const selectedPatrol = useMemo(
    () => DUMMY_PATROLS.find(p => p.id === selectedId) ?? DUMMY_PATROLS[0],
    [selectedId]
  )

  const popupPatrol = useMemo(
    () => DUMMY_PATROLS.find(p => p.id === popup.patrolId) ?? null,
    [popup.patrolId]
  )

  const tpPopupPoint = useMemo(
    () => {
      const patrol = selectedPatrol
      if (!patrol) return null
      return patrol.tripPoints.find(tp => tp.id === tpPopup.tripPointId) ?? null
    },
    [selectedPatrol, tpPopup.tripPointId]
  )

  const handleContact = () => alert(`Calling ${EMPLOYEE.employeeName}...`)
  const handleMessage = () => alert(`Opening message with ${EMPLOYEE.employeeName}...`)
  const handleAlert = () => alert(`Sending alert to ${EMPLOYEE.employeeName}...`)
  const handleSchedule = () => navigate('/schedule')

  return (
    <div className="trip-details-page">
      <FilterBar unit={unit} setUnit={setUnit} shift={shift} setShift={setShift} date={date} setDate={setDate} />

      <div className="td-body">

        {/* ══ LEFT PANEL — SCHEDULED LIST ════════════════════════════════════════ */}
        <Panel className="td-left-panel" header={<div style={{ fontSize: 13, fontWeight: 700 }}>Scheduled List</div>}>
          
          {/* Employee Header */}
          <div className="td-emp-header">
            <Avatar circle size="md" style={{ background: avatarColor(EMPLOYEE.employeeName), color:'#fff', fontWeight:700, fontSize:16 }}>
              {EMPLOYEE.employeeName.charAt(0)}
            </Avatar>
            <div className="td-emp-info">
              <span className="td-emp-name">{EMPLOYEE.employeeName}</span>
              <span className="td-emp-id">ID - {EMPLOYEE.employeeId}</span>
            </div>
            <div className="td-emp-actions">
              <Button size="sm" onClick={handleContact} className="td-action-btn contact">
                <PhoneIcon /> Contact
              </Button>
              <Button size="sm" onClick={handleMessage} className="td-action-btn message">
                <EmailIcon /> Message
              </Button>
              <Button size="sm" onClick={handleAlert} className="td-action-btn alert">
                <WarningIcon /> Alert
              </Button>
            </div>
          </div>

          {/* Cycle / Checkpoints Stats */}
          <div className="td-stats-row">
            <div className="td-stat-box">
              <span className="td-stat-label">Cycle</span>
              <span className="td-stat-value">{EMPLOYEE.cycleDone}/{EMPLOYEE.cycleTotal}</span>
              <div className="td-stat-bar">
                <div className="td-stat-fill" style={{ width:`${Math.round(EMPLOYEE.cycleDone/EMPLOYEE.cycleTotal*100)}%` }} />
              </div>
            </div>
            <div className="td-stat-box">
              <span className="td-stat-label">Checkpoints</span>
              <span className="td-stat-value">{EMPLOYEE.checkpointsDone}/{EMPLOYEE.checkpointsTotal}</span>
              <div className="td-stat-bar">
                <div className="td-stat-fill" style={{ width:`${Math.round(EMPLOYEE.checkpointsDone/EMPLOYEE.checkpointsTotal*100)}%` }} />
              </div>
            </div>
          </div>

          {/* Patrol List — Scrollable */}
          <div className="td-patrol-list">
            {DUMMY_PATROLS.map(p => (
              <div
                key={p.id}
                className={`td-patrol-card${selectedId===p.id?' td-patrol-card-sel':''}`}
                onClick={() => setSelectedId(p.id)}
              >
                {/* Top: time + badge + media icons */}
                <div className="td-patrol-top">
                  <div className="td-patrol-time">
                    <span className="td-patrol-range">{p.timeFrom} to {p.timeTo}</span>
                    <span className={`td-login-badge ${p.loginStatus==='On-time'?'ontime':'late'}`}>
                      {p.loginStatus}
                    </span>
                  </div>
                  <div className="td-patrol-media-icons" onClick={e => e.stopPropagation()}>
                    {MEDIA_ICONS.map(({ type, Icon }) => {
                      const count = p.media?.[type]?.length ?? 0
                      return (
                        <MediaIconBtn
                          key={type}
                          Icon={Icon}
                          count={count}
                          active={popup.open && popup.type===type && popup.patrolId===p.id}
                          onClick={() => setPopup({ open:true, type, patrolId:p.id })}
                        />
                      )
                    })}
                  </div>
                </div>

                {/* Patrol name */}
                <div className="td-patrol-name">
                  <LocationIcon style={{ color:'#3b7ff5', fontSize:12 }} /> {p.name}
                </div>

                {/* Bottom: meta + status */}
                <div className="td-patrol-bottom">
                  <span className="td-patrol-meta">Cycle</span>
                  <span className="td-patrol-meta">Rounds: {p.rounds}/{p.tripTotal}</span>
                  <span className="td-patrol-meta">Checkpoints: {p.checkpoints}</span>
                  <span style={{ marginLeft:'auto' }}><StatusBadge status={p.status} /></span>
                </div>
              </div>
            ))}
          </div>

        </Panel>

        {/* ══ MIDDLE PANEL — GAUGE + TRIP POINTS ════════════════════════════════ */}
        <Panel className="td-middle-panel">
          <div className="td-mid-header">
            <div>
              <div className="td-patrol-name-lg">
                <LocationIcon style={{ color:'#3b7ff5' }} /> {selectedPatrol.name}
              </div>
              <div className="td-patrol-time-sm">
                {selectedPatrol.timeFrom} to {selectedPatrol.timeTo}
                <span className={`td-login-badge ${selectedPatrol.loginStatus==='On-time'?'ontime':'late'}`} style={{ marginLeft:6 }}>
                  {selectedPatrol.loginStatus}
                </span>
              </div>
            </div>
            <Button 
              appearance="primary"
              onClick={handleSchedule}
              className="td-schedule-btn"
            >
              Schedule
            </Button>
          </div>

          {/* Gauge */}
          <TripGauge done={selectedPatrol.tripDoneOf} total={selectedPatrol.tripTotal} />

          <div className="td-trip-pts-title">
            Trip Points <GlobeIcon style={{ marginLeft:6, color:'#3b7ff5' }} />
          </div>

          {/* Trip Points List */}
          <div className="td-trip-pts">
            {selectedPatrol.tripPoints.map(tp => (
              <div
                key={tp.id}
                className={`td-tp-card${selectedTpId === tp.id ? ' td-tp-card-sel' : ''}`}
                onClick={() => setSelectedTpId(tp.id === selectedTpId ? null : tp.id)}
              >
                {/* Top: name + time on left, icons with counts on right */}
                <div className="td-tp-header">
                  <div className="td-tp-info">
                    <LocationIcon style={{ color:'#ef4444', fontSize:14 }} />
                    <div className="td-tp-details">
                      <span className="td-tp-name">{tp.name}</span>
                      <span className="td-tp-time">{tp.time}</span>
                    </div>
                  </div>
                  <div className="td-tp-media-icons">
                    {MEDIA_ICONS.map(({ type, Icon }) => {
                      const count = tp.media?.[type]?.length ?? 0
                      return (
                        <div key={type} className="td-tp-icon-item">
                          <button 
                            className={`td-tp-media-btn${count === 0 ? ' td-tp-media-btn-empty' : ''}`}
                            onClick={e => {
                              e.stopPropagation()
                              if (count > 0) {
                                setTpPopup({ open: true, type, tripPointId: tp.id })
                              }
                            }}
                            title={`${count} ${count===1?'item':'items'}`}
                          >
                            <Icon size={13} />
                          </button>
                          <span className="td-tp-media-count">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Bottom: checkpoints + status */}
                <div className="td-tp-bottom">
                  <span className="td-tp-chk">Checkpoints: {tp.checkpoints}</span>
                  <StatusBadge status={tp.status} />
                </div>
              </div>
            ))}
          </div>

        </Panel>

        {/* ══ RIGHT SIDEBAR ══════════════════════════════════════════════════════ */}
        <div className="td-right">
          <MiniCalendar selectedDate={date} onDateSelect={setDate} />
          <EfficientEmployees data={eff.data} loading={eff.loading} error={eff.error} />
        </div>

      </div>

      {/* Media Popup Modal */}
      <MediaPopup
        open={popup.open}
        onClose={() => setPopup({ open:false, type:null, patrolId:null })}
        type={popup.type}
        items={popupPatrol?.media?.[popup.type] ?? []}
        patrolName={popupPatrol?.name ?? ''}
      />

      {/* Trip Point Media Popup Modal */}
      <MediaPopup
        open={tpPopup.open}
        onClose={() => setTpPopup({ open:false, type:null, tripPointId:null })}
        type={tpPopup.type}
        items={tpPopupPoint?.media?.[tpPopup.type] ?? []}
        patrolName={`${selectedPatrol.name} — ${tpPopupPoint?.name ?? ''}`}
      />
    </div>
  )
}