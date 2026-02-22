// import { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { Loader } from 'rsuite'
// import ReactECharts from 'echarts-for-react'
// import PhoneIcon    from '@rsuite/icons/Phone'
// import EmailIcon    from '@rsuite/icons/Email'
// import WarningIcon  from '@rsuite/icons/WarningRound'
// import LocationIcon from '@rsuite/icons/Location'
// import MapIcon      from '@rsuite/icons/Global'

// import FilterBar          from '../../components/FilterBar/FilterBar'
// import MiniCalendar       from '../Schedule/components/MiniCalendar/MiniCalendar'
// import EfficientEmployees from '../Schedule/components/EfficientEmployees/EfficientEmployees'

// import { fetchTripDetails, fetchEfficientEmployees } from '../../api'
// import './TripDetails.css'

// const EMPTY = { data: null, loading: true, error: null }

// function toStr(d) {
//   if (!d) return ''
//   return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
// }

// // Gauge chart for trip progress
// function TripGauge({ done, total, elapsed }) {
//   const pct = total > 0 ? done / total : 0

//   const option = {
//     series: [{
//       type: 'gauge',
//       startAngle: 200,
//       endAngle: -20,
//       min: 0,
//       max: total,
//       splitNumber: total,
//       radius: '95%',
//       center: ['50%', '60%'],
//       axisLine: {
//         lineStyle: {
//           width: 14,
//           color: [
//             [pct, { type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
//               colorStops: [
//                 { offset: 0,   color: '#f5c518' },
//                 { offset: 0.5, color: '#3b7ff5' },
//                 { offset: 1,   color: '#3b7ff5' },
//               ]
//             }],
//             [1, '#e8edf6']
//           ]
//         }
//       },
//       axisTick:    { show: false },
//       splitLine:   { show: false },
//       axisLabel:   { show: false },
//       pointer:     { show: false },
//       detail: {
//         valueAnimation: true,
//         formatter: () => `${done}/${total}\nComplete`,
//         color: '#1b2f4e',
//         fontSize: 16,
//         fontWeight: 700,
//         lineHeight: 22,
//         offsetCenter: [0, '15%'],
//       },
//       data: [{ value: done }]
//     }],
//     backgroundColor: 'transparent'
//   }

//   return (
//     <div className="td-gauge-wrap">
//       {elapsed && <span className="td-elapsed">{elapsed} ◎</span>}
//       <ReactECharts option={option} style={{ height: 160, width: '100%' }} opts={{ renderer: 'svg' }} />
//     </div>
//   )
// }

// export default function TripDetails() {
//   const { tripId } = useParams()
//   const navigate   = useNavigate()

//   const [unit,  setUnit]  = useState('All')
//   const [shift, setShift] = useState('Shift 1')
//   const [date,  setDate]  = useState(new Date(2025, 1, 20))

//   const [detail, setDetail] = useState(EMPTY)
//   const [eff,    setEff]    = useState(EMPTY)

//   const dateStr = toStr(date)

//   useEffect(() => {
//     setDetail(EMPTY)
//     fetchTripDetails(Number(tripId))
//       .then(d  => setDetail({ data: d,    loading: false, error: null }))
//       .catch(e => setDetail({ data: null, loading: false, error: e.message }))
//   }, [tripId])

//   useEffect(() => {
//     setEff(EMPTY)
//     fetchEfficientEmployees({ unit, shift, date: dateStr })
//       .then(d  => setEff({ data: d,    loading: false, error: null }))
//       .catch(e => setEff({ data: null, loading: false, error: e.message }))
//   }, [unit, shift, dateStr])

//   const d = detail.data

//   return (
//     <div className="trip-details-page">

//       <FilterBar
//         unit={unit}   setUnit={setUnit}
//         shift={shift} setShift={setShift}
//         date={date}   setDate={setDate}
//       />

//       {detail.loading && (
//         <div className="td-full-center"><Loader size="md" content="Loading trip details..." /></div>
//       )}
//       {detail.error && (
//         <div className="td-full-center error-txt">⚠ {detail.error}</div>
//       )}

//       {d && (
//         <div className="td-body">

//           {/* LEFT — Scheduled List + employee header */}
//           <div className="td-left card">
//             <div className="card-title">Scheduled List</div>

//             {/* Employee header */}
//             <div className="td-emp-header">
//               <div className="td-emp-avatar">{d.employeeName.charAt(0)}</div>
//               <div className="td-emp-info">
//                 <span className="td-emp-name">{d.employeeName}</span>
//                 <span className="td-emp-id">ID - {d.employeeId}</span>
//               </div>
//               <div className="td-emp-actions">
//                 <button className="td-action-btn contact">
//                   <PhoneIcon /> Contact
//                 </button>
//                 <button className="td-action-btn message">
//                   <EmailIcon /> Message
//                 </button>
//                 <button className="td-action-btn alert">
//                   <WarningIcon /> Alert
//                 </button>
//               </div>
//             </div>

//             {/* Cycle & Checkpoints */}
//             <div className="td-stats-row">
//               <div className="td-stat-box">
//                 <span className="td-stat-label">Cycle</span>
//                 <span className="td-stat-value">{d.cycleDone}/{d.cycleTotal}</span>
//                 <div className="td-stat-bar">
//                   <div className="td-stat-fill" style={{width:`${Math.round((d.cycleDone/d.cycleTotal)*100)}%`}} />
//                 </div>
//               </div>
//               <div className="td-stat-box">
//                 <span className="td-stat-label">Checkpoints</span>
//                 <span className="td-stat-value">{d.checkpointsDone}/{d.checkpointsTotal}</span>
//                 <div className="td-stat-bar">
//                   <div className="td-stat-fill" style={{width:`${Math.round((d.checkpointsDone/d.checkpointsTotal)*100)}%`}} />
//                 </div>
//               </div>
//             </div>

//             {/* Patrol list */}
//             <div className="td-patrol-list">
//               {d.patrols.map(p => (
//                 <div key={p.id} className="td-patrol-card">
//                   <div className="td-patrol-top">
//                     <div className="td-patrol-time">
//                       <span className="td-patrol-range">{p.timeFrom} to {p.timeTo}</span>
//                       <span className={`td-login-badge ${p.loginStatus === 'On-time' ? 'ontime' : 'late'}`}>
//                         {p.loginStatus}
//                       </span>
//                     </div>
//                     <div className="td-patrol-icons">
//                       {p.icons.map((ic, idx) => (
//                         <span key={idx} className="td-icon-bubble">{ic}</span>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="td-patrol-name">
//                     <LocationIcon style={{ color: '#3b7ff5', fontSize: 12 }} /> {p.name}
//                   </div>
//                   <div className="td-patrol-bottom">
//                     <span className="td-patrol-meta">Cycle</span>
//                     <span className="td-patrol-meta">Rounds: {p.rounds}</span>
//                     <span className="td-patrol-meta">Checkpoints: {p.checkpoints}</span>
//                     <span className={`st-badge ${p.status.toLowerCase()}`} style={{ marginLeft: 'auto' }}>
//                       {p.status} {p.status === 'Ongoing' ? '↻' : '✓'}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* MIDDLE — Trip gauge + trip points */}
//           <div className="td-middle card">
//             <div className="td-mid-header">
//               <div>
//                 <div className="td-patrol-name-lg">
//                   <LocationIcon style={{ color: '#3b7ff5' }} /> {d.patrolName}
//                 </div>
//                 <div className="td-patrol-time-sm">{d.timeFrom} to {d.timeTo}
//                   <span className="td-login-badge ontime" style={{ marginLeft: 6 }}>{d.loginStatus}</span>
//                 </div>
//               </div>
//               <span className="td-order-trip">{d.orderTrip}</span>
//             </div>

//             {/* Gauge */}
//             <TripGauge done={d.tripDoneOf} total={d.tripTotal} elapsed={d.tripElapsed} />

//             {/* Trip Points */}
//             <div className="td-trip-pts-title">
//               Trip Points
//               <MapIcon style={{ marginLeft: 6, color: '#3b7ff5' }} />
//             </div>
//             <div className="td-trip-pts">
//               {d.tripPoints.map(tp => (
//                 <div key={tp.id} className="td-tp-card">
//                   <div className="td-tp-top">
//                     <div className="td-tp-info">
//                       <LocationIcon style={{ color: '#ef4444', fontSize: 12 }} />
//                       <span className="td-tp-name">{tp.name}</span>
//                       <span className="td-tp-time">{tp.time}</span>
//                     </div>
//                     <div className="td-tp-icons">
//                       {tp.stats.map((s, idx) => (
//                         <span key={idx} className="td-tp-icon-box">{s}</span>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="td-tp-bottom">
//                     <span className="td-tp-chk">Checkpoints: {tp.checkpoints}</span>
//                     <span className={`st-badge ${tp.status.toLowerCase()}`}>
//                       {tp.status} {tp.status === 'Ongoing' ? '↻' : '✓'}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT — Sidebar */}
//           <div className="td-right">
//             <MiniCalendar selectedDate={date} onDateSelect={setDate} />
//             <EfficientEmployees data={eff.data} loading={eff.loading} error={eff.error} />
//           </div>

//         </div>
//       )}
//     </div>
//   )
// }
import { useState, useEffect } from 'react'
import { Loader } from 'rsuite'
import ReactECharts from 'echarts-for-react'
import PhoneIcon    from '@rsuite/icons/Phone'
import EmailIcon    from '@rsuite/icons/Email'
import WarningIcon  from '@rsuite/icons/WarningRound'
import LocationIcon from '@rsuite/icons/Location'
import MapIcon      from '@rsuite/icons/Global'

import FilterBar          from '../../components/FilterBar/FilterBar'
import MiniCalendar       from '../Schedule/components/MiniCalendar/MiniCalendar'
import EfficientEmployees from '../Schedule/components/EfficientEmployees/EfficientEmployees'

import { fetchTripDetailByFilters, fetchEfficientEmployees } from '../../api'
import './TripDetails.css'

// ── helpers ───────────────────────────────────────────────────────────────────
const EMPTY = { data: null, loading: true, error: null }

function toStr(d) {
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const AVATAR_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899']
function avatarColor(name = '') { return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] }
function initial(name = '')     { return name.charAt(0).toUpperCase() }

// ── Icons for patrol bubbles ──────────────────────────────────────────────────
const ICON_MAP = {
  1: <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11"><path d="M2 6a2 2 0 012-2h7a2 2 0 012 2v2l3-2v8l-3-2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>,
  2: <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"/></svg>,
  3: <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>,
  4: <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>,
}

// ── Icons for trip-point stat boxes ──────────────────────────────────────────
const TP_ICONS = [
  <svg key="0" viewBox="0 0 20 20" fill="currentColor" width="10" height="10"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>,
  <svg key="1" viewBox="0 0 20 20" fill="currentColor" width="10" height="10"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>,
  <svg key="2" viewBox="0 0 20 20" fill="currentColor" width="10" height="10"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"/></svg>,
  <svg key="3" viewBox="0 0 20 20" fill="currentColor" width="10" height="10"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>,
]

// ── ECharts Gauge ─────────────────────────────────────────────────────────────
function TripGauge({ done, total, elapsed }) {
  const pct = total > 0 ? done / total : 0
  const option = {
    series: [{
      type: 'gauge', startAngle: 200, endAngle: -20,
      min: 0, max: total || 1, radius: '95%', center: ['50%', '62%'],
      axisLine: {
        lineStyle: {
          width: 14,
          color: [
            [pct, { type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0,   color: '#f5c518' },
                { offset: 0.5, color: '#3b7ff5' },
                { offset: 1,   color: '#93c5fd' },
              ]}],
            [1, '#e8edf6'],
          ],
        },
      },
      axisTick: { show: false }, splitLine: { show: false },
      axisLabel: { show: false }, pointer: { show: false },
      detail: {
        valueAnimation: true,
        formatter: () => `{v|${done}/${total}}\n{l|Complete}`,
        rich: {
          v: { fontSize: 20, fontWeight: 700, color: '#1b2f4e', lineHeight: 28 },
          l: { fontSize: 12, color: '#8a9bbf', lineHeight: 20 },
        },
        offsetCenter: [0, '20%'],
      },
      data: [{ value: done }],
    }],
    backgroundColor: 'transparent',
  }
  return (
    <div className="td-gauge-wrap">
      {elapsed && <span className="td-elapsed">{elapsed} ◎</span>}
      <ReactECharts option={option} style={{ height: 175, width: '100%' }} opts={{ renderer: 'svg' }} />
    </div>
  )
}

function StatusBadge({ status }) {
  return (
    <span className={`st-badge ${(status ?? '').toLowerCase()}`}>
      {status}{status === 'Ongoing' ? ' ↻' : status === 'Complete' ? ' ✓' : ''}
    </span>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function TripDetails() {
  // ── These 3 states are the single source of truth for ALL 3 panels ─────────
  const [unit,  setUnit]  = useState('All')
  const [shift, setShift] = useState('Shift 1')
  const [date,  setDate]  = useState(new Date(2025, 1, 20))

  const [detail, setDetail] = useState(EMPTY)  // LEFT card + MIDDLE card
  const [eff,    setEff]    = useState(EMPTY)  // RIGHT sidebar

  const dateStr = toStr(date)

  // ✅ KEY: Both LEFT (Scheduled List) and MIDDLE (Order Trip) cards
  // re-fetch from tripDetails whenever unit, shift, or date changes —
  // exactly like Efficient Employees does in the sidebar.
  useEffect(() => {
    setDetail(EMPTY)
    fetchTripDetailByFilters({ unit, shift, date: dateStr })
      .then(d  => setDetail({ data: d,    loading: false, error: null }))
      .catch(e => setDetail({ data: null, loading: false, error: e.message }))
  }, [unit, shift, dateStr])

  // ✅ Efficient Employees sidebar also re-fetches on same filter change
  useEffect(() => {
    setEff(EMPTY)
    fetchEfficientEmployees({ unit, shift, date: dateStr })
      .then(d  => setEff({ data: d,    loading: false, error: null }))
      .catch(e => setEff({ data: null, loading: false, error: e.message }))
  }, [unit, shift, dateStr])

  const d = detail.data

  return (
    <div className="trip-details-page">

      {/* FilterBar — any change triggers re-fetch of ALL 3 panels */}
      <FilterBar
        unit={unit}   setUnit={setUnit}
        shift={shift} setShift={setShift}
        date={date}   setDate={setDate}
      />

      {detail.loading && (
        <div className="td-full-center"><Loader size="md" content="Loading…" /></div>
      )}
      {!detail.loading && detail.error && (
        <div className="td-full-center error-txt">⚠ {detail.error}</div>
      )}

      {d && (
        <div className="td-body">

          {/* ════════════════════════════
              LEFT — Scheduled List card
              Re-renders on filter change
          ════════════════════════════ */}
          <div className="td-left card">
            <div className="card-title">Scheduled List</div>

            <div className="td-emp-header">
              <div className="td-emp-avatar" style={{ background: avatarColor(d.employeeName) }}>
                {initial(d.employeeName)}
              </div>
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
                <div className="td-stat-bar">
                  <div className="td-stat-fill" style={{ width: `${d.cycleTotal > 0 ? Math.round((d.cycleDone/d.cycleTotal)*100) : 0}%` }} />
                </div>
              </div>
              <div className="td-stat-box">
                <span className="td-stat-label">Checkpoints</span>
                <span className="td-stat-value">{d.checkpointsDone}/{d.checkpointsTotal}</span>
                <div className="td-stat-bar">
                  <div className="td-stat-fill" style={{ width: `${d.checkpointsTotal > 0 ? Math.round((d.checkpointsDone/d.checkpointsTotal)*100) : 0}%` }} />
                </div>
              </div>
            </div>

            <div className="td-patrol-list">
              {d.patrols.map(p => (
                <div key={p.id} className="td-patrol-card">
                  <div className="td-patrol-top">
                    <div className="td-patrol-time">
                      <span className="td-patrol-range">{p.timeFrom} to {p.timeTo}</span>
                      <span className={`td-login-badge ${p.loginStatus === 'On-time' ? 'ontime' : 'late'}`}>{p.loginStatus}</span>
                    </div>
                    <div className="td-patrol-icons">
                      {p.icons.map((ic, i) => <span key={i} className="td-icon-bubble">{ICON_MAP[ic] ?? ic}</span>)}
                    </div>
                  </div>
                  <div className="td-patrol-name">
                    <LocationIcon style={{ color: '#3b7ff5', fontSize: 12 }} /> {p.name}
                  </div>
                  <div className="td-patrol-bottom">
                    <span className="td-patrol-meta">Cycle</span>
                    <span className="td-patrol-meta">Rounds: {p.rounds}</span>
                    <span className="td-patrol-meta">Checkpoints: {p.checkpoints}</span>
                    <span style={{ marginLeft: 'auto' }}><StatusBadge status={p.status} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ════════════════════════════
              MIDDLE — Order Trip card
              Re-renders on filter change
          ════════════════════════════ */}
          <div className="td-middle card">
            <div className="td-mid-header">
              <div>
                <div className="td-patrol-name-lg">
                  <LocationIcon style={{ color: '#3b7ff5' }} /> {d.patrolName}
                </div>
                <div className="td-patrol-time-sm">
                  {d.timeFrom} to {d.timeTo}
                  <span className={`td-login-badge ${d.loginStatus === 'On-time' ? 'ontime' : 'late'}`} style={{ marginLeft: 6 }}>
                    {d.loginStatus}
                  </span>
                </div>
              </div>
              <span className="td-order-trip">{d.orderTrip}</span>
            </div>

            <TripGauge done={d.tripDoneOf} total={d.tripTotal} elapsed={d.tripElapsed} />

            <div className="td-trip-pts-title">
              Trip Points <MapIcon style={{ marginLeft: 6, color: '#3b7ff5' }} />
            </div>
            <div className="td-trip-pts">
              {d.tripPoints.map(tp => (
                <div key={tp.id} className="td-tp-card">
                  <div className="td-tp-top">
                    <div className="td-tp-info">
                      <LocationIcon style={{ color: '#ef4444', fontSize: 12 }} />
                      <span className="td-tp-name">{tp.name}</span>
                      <span className="td-tp-time">{tp.time}</span>
                    </div>
                    <div className="td-tp-icons">
                      {tp.stats.map((s, i) => (
                        <span key={i} className={`td-tp-icon-box ${s > 0 ? 'active' : ''}`}>{TP_ICONS[i]}</span>
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

          {/* ════════════════════════════
              RIGHT — Calendar + Efficient Employees
          ════════════════════════════ */}
          <div className="td-right">
            <MiniCalendar selectedDate={date} onDateSelect={setDate} />
            <EfficientEmployees data={eff.data} loading={eff.loading} error={eff.error} />
          </div>

        </div>
      )}
    </div>
  )
}