

import { useState, useEffect, useMemo } from 'react'
import { Loader, Tag } from 'rsuite'
import ReactECharts from 'echarts-for-react'
import PhoneIcon    from '@rsuite/icons/PhoneFill'
import EmailIcon    from '@rsuite/icons/Message'
import WarningIcon  from '@rsuite/icons/WarningRound'
import LocationIcon from '@rsuite/icons/Location'
import GlobeIcon    from '@rsuite/icons/Global'
import VideoIcon    from '@rsuite/icons/Video'
import MicIcon      from '@rsuite/icons/RemindFill'
import CameraIcon   from '@rsuite/icons/Media'
import SettingIcon  from '@rsuite/icons/Setting'

import FilterBar          from '../../components/FilterBar/FilterBar'
import MiniCalendar       from '../Schedule/components/MiniCalendar/MiniCalendar'
import EfficientEmployees from '../Schedule/components/EfficientEmployees/EfficientEmployees'

import { fetchTripDetailByFilters, fetchEfficientEmployees } from '../../api'
import './TripDetails.css'

const EMPTY = { data: null, loading: true, error: null }
function toStr(d) {
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
const COLORS = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444']
const avatarColor = name => COLORS[name.charCodeAt(0) % COLORS.length]
const PATROL_ICONS = [VideoIcon, MicIcon, CameraIcon, SettingIcon]

function TripGauge({ done, total }) {
  const pct = total > 0 ? done / total : 0
  const option = {
    series: [{
      type: 'gauge', startAngle: 200, endAngle: -20,
      min: 0, max: total || 1, radius: '95%', center: ['50%','62%'],
      axisLine: { lineStyle: { width: 14,
        color: [[pct, { type:'linear', x:0, y:0, x2:1, y2:0,
          colorStops: [{ offset:0, color:'#f5c518' },{ offset:.5, color:'#3b7ff5' },{ offset:1, color:'#93c5fd' }]
        }], [1,'#e8edf6']],
      }},
      axisTick:{show:false}, splitLine:{show:false}, axisLabel:{show:false}, pointer:{show:false},
      detail: { valueAnimation:true, formatter: () => `{v|${done}/${total}}\n{l|Complete}`,
        rich: { v:{fontSize:20,fontWeight:700,color:'#1b2f4e',lineHeight:28}, l:{fontSize:12,color:'#8a9bbf',lineHeight:20} },
        offsetCenter:[0,'20%'],
      },
      data:[{ value: done }],
    }],
    backgroundColor: 'transparent',
  }
  return <ReactECharts option={option} style={{ height: 175, width: '100%' }} opts={{ renderer:'svg' }} />
}

function StatusBadge({ status }) {
  const colors = { Ongoing:'orange', Complete:'green', Missed:'red', Upcoming:'violet' }
  return <Tag color={colors[status]||'blue'} size="sm" style={{fontWeight:700,fontSize:11,borderRadius:5}}>{status}{status==='Ongoing'?' ↻':status==='Complete'?' ✓':''}</Tag>
}

export default function TripDetails() {
  const [unit,  setUnit]  = useState('All')
  const [shift, setShift] = useState('Shift 1')
  const [date,  setDate]  = useState(new Date(2025, 1, 20))
  const [detail, setDetail] = useState(EMPTY)
  const [eff,    setEff]    = useState(EMPTY)
  const [selectedPatrol, setSelectedPatrol] = useState(null)
  const dateStr = toStr(date)

  useEffect(() => {
    setDetail(EMPTY); setSelectedPatrol(null)
    fetchTripDetailByFilters({ unit, shift, date: dateStr })
      .then(d  => { setDetail({ data: d, loading: false, error: null }); setSelectedPatrol(d?.patrols?.[0] ?? null) })
      .catch(e => setDetail({ data: null, loading: false, error: e.message }))
  }, [unit, shift, dateStr])

  useEffect(() => {
    setEff(EMPTY)
    fetchEfficientEmployees({ unit, shift, date: dateStr })
      .then(d  => setEff({ data: d, loading: false, error: null }))
      .catch(e => setEff({ data: null, loading: false, error: e.message }))
  }, [unit, shift, dateStr])

  const d = detail.data

  // Derive middle-panel trip points from selected patrol
  const middlePatrol = selectedPatrol ?? d?.patrols?.[0]

  return (
    <div className="trip-details-page">
      <FilterBar unit={unit} setUnit={setUnit} shift={shift} setShift={setShift} date={date} setDate={setDate} />

      {detail.loading && <div className="td-full-center"><Loader size="md" content="Loading…" /></div>}
      {!detail.loading && detail.error && <div className="td-full-center error-txt">⚠ {detail.error}</div>}

      {d && (
        <div className="td-body">
          {/* LEFT — Scheduled List */}
          <div className="td-left card">
            <div className="card-title">Scheduled List</div>
            <div className="td-emp-header">
              <div className="td-emp-avatar" style={{ background: avatarColor(d.employeeName) }}>{d.employeeName.charAt(0)}</div>
              <div className="td-emp-info">
                <span className="td-emp-name">{d.employeeName}</span>
                <span className="td-emp-id">ID - {d.employeeId}</span>
              </div>
              <div className="td-emp-actions">
                <button className="td-action-btn contact"><PhoneIcon /> Contact</button>
                <button className="td-action-btn message"><EmailIcon /> Message</button>
                <button className="td-action-btn alert"><WarningIcon /> Alert</button>
              </div>
            </div>
            <div className="td-stats-row">
              <div className="td-stat-box">
                <span className="td-stat-label">Cycle</span>
                <span className="td-stat-value">{d.cycleDone}/{d.cycleTotal}</span>
                <div className="td-stat-bar"><div className="td-stat-fill" style={{ width:`${d.cycleTotal>0?Math.round(d.cycleDone/d.cycleTotal*100):0}%` }} /></div>
              </div>
              <div className="td-stat-box">
                <span className="td-stat-label">Checkpoints</span>
                <span className="td-stat-value">{d.checkpointsDone}/{d.checkpointsTotal}</span>
                <div className="td-stat-bar"><div className="td-stat-fill" style={{ width:`${d.checkpointsTotal>0?Math.round(d.checkpointsDone/d.checkpointsTotal*100):0}%` }} /></div>
              </div>
            </div>
            <div className="td-patrol-list">
              {d.patrols.map(p => (
                <div key={p.id} className={`td-patrol-card${selectedPatrol?.id===p.id?' td-patrol-card-sel':''}`} onClick={() => setSelectedPatrol(p)}>
                  <div className="td-patrol-top">
                    <div className="td-patrol-time">
                      <span className="td-patrol-range">{p.timeFrom} to {p.timeTo}</span>
                      <span className={`td-login-badge ${p.loginStatus==='On-time'?'ontime':'late'}`}>{p.loginStatus}</span>
                    </div>
                    <div className="td-patrol-icons">
                      {PATROL_ICONS.map((Ic, idx) => <span key={idx} className="td-icon-bubble"><Ic style={{fontSize:11}} /></span>)}
                    </div>
                  </div>
                  <div className="td-patrol-name"><LocationIcon style={{ color:'#3b7ff5', fontSize:12 }} /> {p.name}</div>
                  <div className="td-patrol-bottom">
                    <span className="td-patrol-meta">Cycle</span>
                    <span className="td-patrol-meta">Rounds: {p.rounds}</span>
                    <span className="td-patrol-meta">Checkpoints: {p.checkpoints}</span>
                    <span style={{ marginLeft:'auto' }}><StatusBadge status={p.status} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MIDDLE — Order Trip (updates when patrol card clicked) */}
          <div className="td-middle card">
            {middlePatrol && <>
              <div className="td-mid-header">
                <div>
                  <div className="td-patrol-name-lg"><LocationIcon style={{ color:'#3b7ff5' }} /> {middlePatrol.name}</div>
                  <div className="td-patrol-time-sm">
                    {middlePatrol.timeFrom} to {middlePatrol.timeTo}
                    <span className={`td-login-badge ${middlePatrol.loginStatus==='On-time'?'ontime':'late'}`} style={{ marginLeft:6 }}>{middlePatrol.loginStatus}</span>
                  </div>
                </div>
                <span className="td-order-trip">{d.orderTrip}</span>
              </div>
              <TripGauge done={d.tripDoneOf} total={d.tripTotal} />
              <div className="td-trip-pts-title">Trip Points <GlobeIcon style={{ marginLeft:6, color:'#3b7ff5' }} /></div>
              <div className="td-trip-pts">
                {d.tripPoints.map(tp => (
                  <div key={tp.id} className="td-tp-card">
                    <div className="td-tp-top">
                      <div className="td-tp-info">
                        <LocationIcon style={{ color:'#ef4444', fontSize:12 }} />
                        <span className="td-tp-name">{tp.name}</span>
                        <span className="td-tp-time">{tp.time}</span>
                      </div>
                      <div className="td-tp-icons">
                        {tp.stats.map((s, i) => <span key={i} className={`td-tp-icon-box${s>0?' active':''}`} style={{ fontSize:10 }}>{['📍','📷','🎤','⚙'][i]}</span>)}
                      </div>
                    </div>
                    <div className="td-tp-bottom">
                      <span className="td-tp-chk">Checkpoints: {tp.checkpoints}</span>
                      <StatusBadge status={tp.status} />
                    </div>
                  </div>
                ))}
              </div>
            </>}
          </div>

          {/* RIGHT */}
          <div className="td-right">
            <MiniCalendar selectedDate={date} onDateSelect={setDate} />
            <EfficientEmployees data={eff.data} loading={eff.loading} error={eff.error} />
          </div>
        </div>
      )}
    </div>
  )
}