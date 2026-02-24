import { useState, useEffect, useMemo } from 'react'
import { Loader, Tag } from 'rsuite'
import ReactECharts from 'echarts-for-react'

import PhoneIcon    from '@rsuite/icons/PhoneFill'
import EmailIcon    from '@rsuite/icons/Message'
import WarningIcon  from '@rsuite/icons/WarningRound'
import LocationIcon from '@rsuite/icons/Location'
import GlobeIcon    from '@rsuite/icons/Global'

import { BsMicFill, BsImage, BsPlayCircleFill, BsEnvelopeFill, BsFileTextFill } from 'react-icons/bs'

import FilterBar          from '../../components/FilterBar/FilterBar'
import MiniCalendar       from '../Schedule/components/MiniCalendar/MiniCalendar'
import EfficientEmployees from '../Schedule/components/EfficientEmployees/EfficientEmployees'
import MediaPopup         from './MediaPopup'

import { fetchEfficientEmployees } from '../../api'
import { DUMMY_PATROLS } from './patrolDummyData'
import './TripDetails.css'

/* ── Static employee info (replace with API when ready) ── */
const EMPLOYEE = {
  employeeName:       'Karthik',
  employeeId:         '1234',
  cycleDone:          10,
  cycleTotal:         11,
  checkpointsDone:    4,
  checkpointsTotal:   6,
  orderTrip:          'Order Trip →',
}

const EMPTY = { data: null, loading: true, error: null }
function toStr(d) {
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const AVATAR_COLORS = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444']
const avatarColor = name => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

const MEDIA_ICONS = [
  { type:'voice',   Icon: BsMicFill        },
  { type:'photo',   Icon: BsImage          },
  { type:'video',   Icon: BsPlayCircleFill },
  { type:'message', Icon: BsEnvelopeFill   },
  { type:'report',  Icon: BsFileTextFill   },
]

/* ── Gauge ────────────────────────────────────────────── */
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

/* ── Status badge ─────────────────────────────────────── */
function StatusBadge({ status }) {
  const colors = { Ongoing:'orange', Complete:'green', Missed:'red', Upcoming:'violet' }
  return (
    <Tag color={colors[status]||'blue'} size="sm"
      style={{ fontWeight:700, fontSize:11, borderRadius:5 }}>
      {status}{status==='Ongoing'?' ↻':status==='Complete'?' ✓':''}
    </Tag>
  )
}

/* ── Media icon button ────────────────────────────────── */
function MediaIconBtn({ Icon, count, onClick, active }) {
  return (
    <button
      className={`td-media-btn${active?' td-media-btn-active':''}${count===0?' td-media-btn-empty':''}`}
      onClick={count>0 ? onClick : undefined}
    >
      <Icon size={13} />
      <span className="td-media-count">{count}</span>
    </button>
  )
}

/* ══════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════ */
export default function TripDetails() {
  const [unit,  setUnit]  = useState('All')
  const [shift, setShift] = useState('Shift 1')
  const [date,  setDate]  = useState(new Date(2025, 1, 20))
  const [eff,   setEff]   = useState(EMPTY)

  // Selected patrol id — defaults to first patrol
  const [selectedId, setSelectedId] = useState(DUMMY_PATROLS[0].id)

  // Media popup
  const [popup, setPopup] = useState({ open:false, type:null, patrolId:null })

  const dateStr = toStr(date)

  useEffect(() => {
    setEff(EMPTY)
    fetchEfficientEmployees({ unit, shift, date: dateStr })
      .then(d  => setEff({ data:d, loading:false, error:null }))
      .catch(e => setEff({ data:null, loading:false, error:e.message }))
  }, [unit, shift, dateStr])

  // The currently selected patrol object — drives the MIDDLE card
  const selectedPatrol = useMemo(
    () => DUMMY_PATROLS.find(p => p.id === selectedId) ?? DUMMY_PATROLS[0],
    [selectedId]
  )

  const popupPatrol = useMemo(
    () => DUMMY_PATROLS.find(p => p.id === popup.patrolId) ?? null,
    [popup.patrolId]
  )

  return (
    <div className="trip-details-page">
      <FilterBar unit={unit} setUnit={setUnit} shift={shift} setShift={setShift} date={date} setDate={setDate} />

      <div className="td-body">

        {/* ══ LEFT ════════════════════════════════════════════ */}
        <div className="td-left card">
          <div className="card-title">Scheduled List</div>

          {/* Employee */}
          <div className="td-emp-header">
            <div className="td-emp-avatar" style={{ background: avatarColor(EMPLOYEE.employeeName) }}>
              {EMPLOYEE.employeeName.charAt(0)}
            </div>
            <div className="td-emp-info">
              <span className="td-emp-name">{EMPLOYEE.employeeName}</span>
              <span className="td-emp-id">ID - {EMPLOYEE.employeeId}</span>
            </div>
            <div className="td-emp-actions">
              <button className="td-action-btn contact"><PhoneIcon /> Contact</button>
              <button className="td-action-btn message"><EmailIcon /> Message</button>
              <button className="td-action-btn alert"><WarningIcon /> Alert</button>
            </div>
          </div>

          {/* Cycle / Checkpoints */}
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

          {/* Patrol cards list */}
          <div className="td-patrol-list">
            {DUMMY_PATROLS.map(p => (
              <div
                key={p.id}
                className={`td-patrol-card${selectedId===p.id?' td-patrol-card-sel':''}`}
                onClick={() => setSelectedId(p.id)}
              >
                {/* Top: time + login badge + media icons */}
                <div className="td-patrol-top">
                  <div className="td-patrol-time">
                    <span className="td-patrol-range">{p.timeFrom} to {p.timeTo}</span>
                    <span className={`td-login-badge ${p.loginStatus==='On-time'?'ontime':'late'}`}>
                      {p.loginStatus}
                    </span>
                  </div>
                  {/* Media icons — stop propagation so click doesn't select patrol */}
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
        </div>

        {/* ══ MIDDLE — driven by selectedPatrol ═══════════════ */}
        <div className="td-middle card">
          <div className="td-mid-header">
            <div>
              <div className="td-patrol-name-lg">
                <LocationIcon style={{ color:'#3b7ff5' }} /> {selectedPatrol.name}
              </div>
              <div className="td-patrol-time-sm">
                {selectedPatrol.timeFrom} to {selectedPatrol.timeTo}
                <span
                  className={`td-login-badge ${selectedPatrol.loginStatus==='On-time'?'ontime':'late'}`}
                  style={{ marginLeft:6 }}
                >
                  {selectedPatrol.loginStatus}
                </span>
              </div>
            </div>
            <span className="td-order-trip">{EMPLOYEE.orderTrip}</span>
          </div>

          {/* Gauge uses THIS patrol's done/total */}
          <TripGauge done={selectedPatrol.tripDoneOf} total={selectedPatrol.tripTotal} />

          <div className="td-trip-pts-title">
            Trip Points <GlobeIcon style={{ marginLeft:6, color:'#3b7ff5' }} />
          </div>

          {/* Trip points for THIS patrol */}
          <div className="td-trip-pts">
            {selectedPatrol.tripPoints.map(tp => (
              <div key={tp.id} className="td-tp-card">
                <div className="td-tp-top">
                  <div className="td-tp-info">
                    <LocationIcon style={{ color:'#ef4444', fontSize:12 }} />
                    <span className="td-tp-name">{tp.name}</span>
                    <span className="td-tp-time">{tp.time}</span>
                  </div>
                  <div className="td-tp-icons">
                    {tp.stats.map((s,i) => (
                      <span key={i} className={`td-tp-icon-box${s>0?' active':''}`} style={{ fontSize:10 }}>
                        {['📍','📷','🎤','⚙'][i]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="td-tp-bottom">
                  <span className="td-tp-chk">Checkpoints: {tp.checkpoints}</span>
                  <StatusBadge status={tp.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT ═══════════════════════════════════════════ */}
        <div className="td-right">
          <MiniCalendar selectedDate={date} onDateSelect={setDate} />
          <EfficientEmployees data={eff.data} loading={eff.loading} error={eff.error} />
        </div>

      </div>

      {/* Media popup */}
      <MediaPopup
        open={popup.open}
        onClose={() => setPopup({ open:false, type:null, patrolId:null })}
        type={popup.type}
        items={popupPatrol?.media?.[popup.type] ?? []}
        patrolName={popupPatrol?.name ?? ''}
      />
    </div>
  )
}