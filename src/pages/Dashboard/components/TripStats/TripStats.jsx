
// // // // // import { useState } from 'react'
// // // // // import { useNavigate } from 'react-router-dom'
// // // // // import { Loader, ButtonGroup, Button, DateRangePicker } from 'rsuite'
// // // // // import { BsArrowRight, BsBusFront, BsCheckCircle, BsXCircle, BsClock, BsExclamationTriangle } from 'react-icons/bs'
// // // // // import CalendarIcon from '@rsuite/icons/Calendar'
// // // // // import './TripStats.css'

// // // // // export default function TripStats({ data, loading, error }) {
// // // // //   const navigate = useNavigate()
// // // // //   const [viewMode, setViewMode] = useState('week')
// // // // //   const [dateRange, setDateRange] = useState(null)

// // // // //   const go = tab => navigate('/schedule', { state: { initialTab: tab } })

// // // // //   if (loading) return (
// // // // //     <div className="card trip-card">
// // // // //       <div className="card-title">Trip Statistics</div>
// // // // //       <div className="card-center"><Loader size="sm" content="Loading..." /></div>
// // // // //     </div>
// // // // //   )
// // // // //   if (error || !data) return (
// // // // //     <div className="card trip-card">
// // // // //       <div className="card-title">Trip Statistics</div>
// // // // //       <div className="card-center error-txt">⚠ {error || 'No data'}</div>
// // // // //     </div>
// // // // //   )

// // // // //   const { allTrips, completed, missed, ontime, late, efficiency } = data
// // // // //   const eff = Math.min(100, Math.max(0, efficiency || 0))

// // // // //   return (
// // // // //     <div className="card trip-card">
// // // // //       {/* Top Header */}
// // // // //       <div className="trip-header">
// // // // //         <div className="card-title">Trip Statistics</div>

// // // // //         <div className="trip-header-controls">
// // // // //           {/* Week/Month Toggle */}


// // // // //           {/* Calendar Filter */}
// // // // //           <DateRangePicker
// // // // //             size="sm"
// // // // //             value={dateRange}
// // // // //             onChange={setDateRange}
// // // // //             format="dd MMM"
// // // // //             placement="bottomEnd"
// // // // //             cleanable
// // // // //             caretAs={CalendarIcon}
// // // // //             style={{ minWidth: 180 }}
// // // // //           />
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Grid */}
// // // // //       <div className="trip-grid">

// // // // //         {/* Col 1 Row 1 — All trips */}
// // // // //         <div className="stat-box">
// // // // //           <div className="stat-lbl">
// // // // //             <BsBusFront className="stat-icon-ri" /> All trips
// // // // //           </div>
// // // // //           <div className="stat-num">{allTrips}</div>
// // // // //           <button className="arr-btn" onClick={() => go('All')}>
// // // // //             <BsArrowRight size={13} color="#fff" />
// // // // //           </button>
// // // // //         </div>

// // // // //         {/* Col 2 spans both rows — Completed top, Ontime+Late bottom */}
// // // // //         <div className="stat-box completed-group">
// // // // //           <div className="cg-top">
// // // // //             <div className="stat-lbl">
// // // // //               <BsCheckCircle className="stat-icon-ri green" /> Completed
// // // // //             </div>
// // // // //             <div className="stat-num">{completed}</div>
// // // // //             <button className="arr-btn" onClick={() => go('Complete')}>
// // // // //               <BsArrowRight size={13} color="#fff" />
// // // // //             </button>
// // // // //           </div>
// // // // //           <div className="cg-divider" />
// // // // //           <div className="cg-bot">
// // // // //             <div className="mini">
// // // // //               <div className="mini-lbl">
// // // // //                 <BsClock size={11} style={{ marginRight: 3 }} /> Ontime
// // // // //               </div>
// // // // //               <div className="mini-num teal-txt">{ontime}</div>
// // // // //             </div>
// // // // //             <div className="mini-sep" />
// // // // //             <div className="mini">
// // // // //               <div className="mini-lbl">
// // // // //                 <BsExclamationTriangle size={11} style={{ marginRight: 3 }} /> Late
// // // // //               </div>
// // // // //               <div className="mini-num red-txt">{late}</div>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Col 1 Row 2 — Missed */}
// // // // //         <div className="stat-box">
// // // // //           <div className="stat-lbl">
// // // // //             <BsXCircle className="stat-icon-ri red" /> Missed
// // // // //           </div>
// // // // //           <div className="stat-num">{missed}</div>
// // // // //           <button className="arr-btn" onClick={() => go('Missed')}>
// // // // //             <BsArrowRight size={13} color="#fff" />
// // // // //           </button>
// // // // //         </div>

// // // // //         {/* Col 3 spans both rows — Efficiency bar */}
// // // // //         <div className="eff-col">
// // // // //           <div className="eff-inner">
// // // // //             <div className="eff-bar-wrap">
// // // // //               <div className="eff-bar-fill" style={{ height: `${eff}%` }} />
// // // // //             </div>
// // // // //             <div className="eff-pct">{eff}%</div>
// // // // //             <div className="eff-label">Efficiency</div>
// // // // //           </div>
// // // // //         </div>

// // // // //       </div>
// // // // //     </div>
// // // // //   )
// // // // // }



// // // // import { useState, useEffect } from 'react'
// // // // import { useNavigate } from 'react-router-dom'
// // // // import { Loader, DateRangePicker } from 'rsuite'
// // // // import { BsArrowRight, BsBusFront, BsCheckCircle, BsXCircle, BsClock, BsExclamationTriangle } from 'react-icons/bs'
// // // // import CalendarIcon from '@rsuite/icons/Calendar'
// // // // import './TripStats.css'

// // // // export default function TripStats({ data, loading, error, onDateChange }) {

// // // //   const navigate = useNavigate()
// // // //   const [dateRange, setDateRange] = useState(null)

// // // //   const go = tab =>
// // // //     navigate('/schedule', { state: { initialTab: tab } })

// // // //   // 🔥 Notify parent when date changes
// // // //   useEffect(() => {
// // // //     if (onDateChange) {
// // // //       onDateChange(dateRange)
// // // //     }
// // // //   }, [dateRange])

// // // //   if (loading)
// // // //     return (
// // // //       <div className="card trip-card">
// // // //         <div className="card-title">Trip Statistics</div>
// // // //         <div className="card-center">
// // // //           <Loader size="sm" content="Loading..." />
// // // //         </div>
// // // //       </div>
// // // //     )

// // // //   if (error || !data)
// // // //     return (
// // // //       <div className="card trip-card">
// // // //         <div className="card-title">Trip Statistics</div>
// // // //         <div className="card-center error-txt">
// // // //           ⚠ {error || 'No data'}
// // // //         </div>
// // // //       </div>
// // // //     )

// // // //   const { allTrips, completed, missed, ontime, late, efficiency } = data

// // // //   const eff = Math.min(100, Math.max(0, efficiency || 0))

// // // //   return (
// // // //     <div className="card trip-card">

// // // //       {/* Header */}
// // // //       <div className="trip-header">
// // // //         <div className="card-title">Trip Statistics</div>

// // // //         <div className="trip-header-controls">
// // // //           <DateRangePicker
// // // //             size="sm"
// // // //             value={dateRange}
// // // //             onChange={setDateRange}
// // // //             format="dd MMM"
// // // //             placement="bottomEnd"
// // // //             cleanable
// // // //             caretAs={CalendarIcon}
// // // //             style={{ minWidth: 180 }}
// // // //           />
// // // //         </div>
// // // //       </div>

// // // //       {/* Grid */}
// // // //       <div className="trip-grid">

// // // //         {/* All Trips */}
// // // //         <div className="stat-box">
// // // //           <div className="stat-lbl">
// // // //             <BsBusFront className="stat-icon-ri" /> All trips
// // // //           </div>
// // // //           <div className="stat-num">{allTrips}</div>
// // // //           <button className="arr-btn" onClick={() => go('All')}>
// // // //             <BsArrowRight size={13} color="#fff" />
// // // //           </button>
// // // //         </div>

// // // //         {/* Completed Group */}
// // // //         <div className="stat-box completed-group">
// // // //           <div className="cg-top">
// // // //             <div className="stat-lbl">
// // // //               <BsCheckCircle className="stat-icon-ri green" /> Completed
// // // //             </div>
// // // //             <div className="stat-num">{completed}</div>
// // // //             <button className="arr-btn" onClick={() => go('Complete')}>
// // // //               <BsArrowRight size={13} color="#fff" />
// // // //             </button>
// // // //           </div>

// // // //           <div className="cg-divider" />

// // // //           <div className="cg-bot">
// // // //             <div className="mini">
// // // //               <div className="mini-lbl">
// // // //                 <BsClock size={11} style={{ marginRight: 3 }} /> Ontime
// // // //               </div>
// // // //               <div className="mini-num teal-txt">{ontime}</div>
// // // //             </div>

// // // //             <div className="mini-sep" />

// // // //             <div className="mini">
// // // //               <div className="mini-lbl">
// // // //                 <BsExclamationTriangle size={11} style={{ marginRight: 3 }} /> Late
// // // //               </div>
// // // //               <div className="mini-num red-txt">{late}</div>
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* Missed */}
// // // //         <div className="stat-box">
// // // //           <div className="stat-lbl">
// // // //             <BsXCircle className="stat-icon-ri red" /> Missed
// // // //           </div>
// // // //           <div className="stat-num">{missed}</div>
// // // //           <button className="arr-btn" onClick={() => go('Missed')}>
// // // //             <BsArrowRight size={13} color="#fff" />
// // // //           </button>
// // // //         </div>

// // // //         {/* Efficiency */}
// // // //         <div className="eff-col">
// // // //           <div className="eff-inner">
// // // //             <div className="eff-bar-wrap">
// // // //               <div
// // // //                 className="eff-bar-fill"
// // // //                 style={{ height: `${eff}%` }}
// // // //               />
// // // //             </div>
// // // //             <div className="eff-pct">{eff}%</div>
// // // //             <div className="eff-label">Efficiency</div>
// // // //           </div>
// // // //         </div>

// // // //       </div>

// // // //     </div>
// // // //   )
// // // // }

// // // // import { useState } from 'react'
// // // // import { useNavigate } from 'react-router-dom'
// // // // import { Loader, ButtonGroup, Button, DateRangePicker } from 'rsuite'
// // // // import { BsArrowRight, BsBusFront, BsCheckCircle, BsXCircle, BsClock, BsExclamationTriangle } from 'react-icons/bs'
// // // // import CalendarIcon from '@rsuite/icons/Calendar'
// // // // import './TripStats.css'

// // // // export default function TripStats({ data, loading, error }) {
// // // //   const navigate = useNavigate()
// // // //   const [viewMode, setViewMode] = useState('week')
// // // //   const [dateRange, setDateRange] = useState(null)

// // // //   const go = tab => navigate('/schedule', { state: { initialTab: tab } })

// // // //   if (loading) return (
// // // //     <div className="card trip-card">
// // // //       <div className="card-title">Trip Statistics</div>
// // // //       <div className="card-center"><Loader size="sm" content="Loading..." /></div>
// // // //     </div>
// // // //   )
// // // //   if (error || !data) return (
// // // //     <div className="card trip-card">
// // // //       <div className="card-title">Trip Statistics</div>
// // // //       <div className="card-center error-txt">⚠ {error || 'No data'}</div>
// // // //     </div>
// // // //   )

// // // //   const { allTrips, completed, missed, ontime, late, efficiency } = data
// // // //   const eff = Math.min(100, Math.max(0, efficiency || 0))

// // // //   return (
// // // //     <div className="card trip-card">
// // // //       {/* Top Header */}
// // // //       <div className="trip-header">
// // // //         <div className="card-title">Trip Statistics</div>

// // // //         <div className="trip-header-controls">
// // // //           {/* Week/Month Toggle */}


// // // //           {/* Calendar Filter */}
// // // //           <DateRangePicker
// // // //             size="sm"
// // // //             value={dateRange}
// // // //             onChange={setDateRange}
// // // //             format="dd MMM"
// // // //             placement="bottomEnd"
// // // //             cleanable
// // // //             caretAs={CalendarIcon}
// // // //             style={{ minWidth: 180 }}
// // // //           />
// // // //         </div>
// // // //       </div>

// // // //       {/* Grid */}
// // // //       <div className="trip-grid">

// // // //         {/* Col 1 Row 1 — All trips */}
// // // //         <div className="stat-box">
// // // //           <div className="stat-lbl">
// // // //             <BsBusFront className="stat-icon-ri" /> All trips
// // // //           </div>
// // // //           <div className="stat-num">{allTrips}</div>
// // // //           <button className="arr-btn" onClick={() => go('All')}>
// // // //             <BsArrowRight size={13} color="#fff" />
// // // //           </button>
// // // //         </div>

// // // //         {/* Col 2 spans both rows — Completed top, Ontime+Late bottom */}
// // // //         <div className="stat-box completed-group">
// // // //           <div className="cg-top">
// // // //             <div className="stat-lbl">
// // // //               <BsCheckCircle className="stat-icon-ri green" /> Completed
// // // //             </div>
// // // //             <div className="stat-num">{completed}</div>
// // // //             <button className="arr-btn" onClick={() => go('Complete')}>
// // // //               <BsArrowRight size={13} color="#fff" />
// // // //             </button>
// // // //           </div>
// // // //           <div className="cg-divider" />
// // // //           <div className="cg-bot">
// // // //             <div className="mini">
// // // //               <div className="mini-lbl">
// // // //                 <BsClock size={11} style={{ marginRight: 3 }} /> Ontime
// // // //               </div>
// // // //               <div className="mini-num teal-txt">{ontime}</div>
// // // //             </div>
// // // //             <div className="mini-sep" />
// // // //             <div className="mini">
// // // //               <div className="mini-lbl">
// // // //                 <BsExclamationTriangle size={11} style={{ marginRight: 3 }} /> Late
// // // //               </div>
// // // //               <div className="mini-num red-txt">{late}</div>
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* Col 1 Row 2 — Missed */}
// // // //         <div className="stat-box">
// // // //           <div className="stat-lbl">
// // // //             <BsXCircle className="stat-icon-ri red" /> Missed
// // // //           </div>
// // // //           <div className="stat-num">{missed}</div>
// // // //           <button className="arr-btn" onClick={() => go('Missed')}>
// // // //             <BsArrowRight size={13} color="#fff" />
// // // //           </button>
// // // //         </div>

// // // //         {/* Col 3 spans both rows — Efficiency bar */}
// // // //         <div className="eff-col">
// // // //           <div className="eff-inner">
// // // //             <div className="eff-bar-wrap">
// // // //               <div className="eff-bar-fill" style={{ height: `${eff}%` }} />
// // // //             </div>
// // // //             <div className="eff-pct">{eff}%</div>
// // // //             <div className="eff-label">Efficiency</div>
// // // //           </div>
// // // //         </div>

// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }



// // // import { useState, useEffect } from 'react'
// // // import { useNavigate } from 'react-router-dom'
// // // import { Loader, DateRangePicker } from 'rsuite'
// // // import { BsArrowRight, BsBusFront, BsCheckCircle, BsXCircle, BsClock, BsExclamationTriangle } from 'react-icons/bs'
// // // import CalendarIcon from '@rsuite/icons/Calendar'
// // // import './TripStats.css'

// // // export default function TripStats({ data, loading, error, onDateChange }) {

// // //   const navigate = useNavigate()
// // //   const [dateRange, setDateRange] = useState(null)

// // //   const go = tab =>
// // //     navigate('/schedule', { state: { initialTab: tab } })

// // //   // 🔥 Notify parent when date changes
// // //   useEffect(() => {
// // //     if (onDateChange) {
// // //       onDateChange(dateRange)
// // //     }
// // //   }, [dateRange])

// // //   if (loading)
// // //     return (
// // //       <div className="card trip-card">
// // //         <div className="card-title">Trip Statistics</div>
// // //         <div className="card-center">
// // //           <Loader size="sm" content="Loading..." />
// // //         </div>
// // //       </div>
// // //     )

// // //   if (error || !data)
// // //     return (
// // //       <div className="card trip-card">
// // //         <div className="card-title">Trip Statistics</div>
// // //         <div className="card-center error-txt">
// // //           ⚠ {error || 'No data'}
// // //         </div>
// // //       </div>
// // //     )

// // //   const { allTrips, completed, missed, ontime, late, efficiency } = data

// // //   const eff = Math.min(100, Math.max(0, efficiency || 0))

// // //   return (
// // //     <div className="card trip-card">

// // //       {/* Header */}
// // //       <div className="trip-header">
// // //         <div className="card-title">Trip Statistics</div>

// // //         <div className="trip-header-controls">
// // //           <DateRangePicker
// // //             size="sm"
// // //             value={dateRange}
// // //             onChange={setDateRange}
// // //             format="dd MMM"
// // //             placement="bottomEnd"
// // //             cleanable
// // //             caretAs={CalendarIcon}
// // //             style={{ minWidth: 180 }}
// // //           />
// // //         </div>
// // //       </div>

// // //       {/* Grid */}
// // //       <div className="trip-grid">

// // //         {/* All Trips */}
// // //         <div className="stat-box">
// // //           <div className="stat-lbl">
// // //             <BsBusFront className="stat-icon-ri" /> All trips
// // //           </div>
// // //           <div className="stat-num">{allTrips}</div>
// // //           <button className="arr-btn" onClick={() => go('All')}>
// // //             <BsArrowRight size={13} color="#fff" />
// // //           </button>
// // //         </div>

// // //         {/* Completed Group */}
// // //         <div className="stat-box completed-group">
// // //           <div className="cg-top">
// // //             <div className="stat-lbl">
// // //               <BsCheckCircle className="stat-icon-ri green" /> Completed
// // //             </div>
// // //             <div className="stat-num">{completed}</div>
// // //             <button className="arr-btn" onClick={() => go('Complete')}>
// // //               <BsArrowRight size={13} color="#fff" />
// // //             </button>
// // //           </div>

// // //           <div className="cg-divider" />

// // //           <div className="cg-bot">
// // //             <div className="mini">
// // //               <div className="mini-lbl">
// // //                 <BsClock size={11} style={{ marginRight: 3 }} /> Ontime
// // //               </div>
// // //               <div className="mini-num teal-txt">{ontime}</div>
// // //             </div>

// // //             <div className="mini-sep" />

// // //             <div className="mini">
// // //               <div className="mini-lbl">
// // //                 <BsExclamationTriangle size={11} style={{ marginRight: 3 }} /> Late
// // //               </div>
// // //               <div className="mini-num red-txt">{late}</div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Missed */}
// // //         <div className="stat-box">
// // //           <div className="stat-lbl">
// // //             <BsXCircle className="stat-icon-ri red" /> Missed
// // //           </div>
// // //           <div className="stat-num">{missed}</div>
// // //           <button className="arr-btn" onClick={() => go('Missed')}>
// // //             <BsArrowRight size={13} color="#fff" />
// // //           </button>
// // //         </div>

// // //         {/* Efficiency */}
// // //         <div className="eff-col">
// // //           <div className="eff-inner">
// // //             <div className="eff-bar-wrap">
// // //               <div
// // //                 className="eff-bar-fill"
// // //                 style={{ height: `${eff}%` }}
// // //               />
// // //             </div>
// // //             <div className="eff-pct">{eff}%</div>
// // //             <div className="eff-label">Efficiency</div>
// // //           </div>
// // //         </div>

// // //       </div>

// // //     </div>
// // //   )
// // // }
// // import { useState, useEffect } from 'react'
// // import { useNavigate } from 'react-router-dom'
// // import { Loader, DateRangePicker } from 'rsuite'
// // import {
// //   BsArrowRight, BsBusFront, BsCheckCircle,
// //   BsXCircle, BsClock, BsExclamationTriangle,
// // } from 'react-icons/bs'
// // import './TripStats.css'

// // export default function TripStats({ data, loading, error, onDateRangeChange }) {
// //   const navigate   = useNavigate()
// //   const [dateRange, setDateRange] = useState(null)

// //   // Notify Dashboard whenever the range changes or is cleared
// //   useEffect(() => {
// //     onDateRangeChange?.(dateRange)
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [dateRange])

// //   const go = tab => navigate('/schedule', { state: { initialTab: tab } })

// //   return (
// //     <div className="card trip-card">

// //       {/* ── Header ─────────────────────────────────────── */}
// //       <div className="trip-header">
// //         <div className="card-title">Trip Statistics</div>

// //         <div className="trip-header-controls">
// //           <DateRangePicker
// //             size="sm"
// //             value={dateRange}
// //             onChange={val => setDateRange(val ?? null)}
// //             onClean={() => setDateRange(null)}
// //             format="dd MMM yyyy"
// //             placement="bottomEnd"
// //             cleanable
// //             style={{ minWidth: 200 }}
// //             placeholder="Select date range"
// //           />
// //         </div>
// //       </div>

// //       {/* ── Content ────────────────────────────────────── */}
// //       {loading ? (
// //         <div className="card-center">
// //           <Loader size="sm" content="Loading..." />
// //         </div>
// //       ) : error || !data ? (
// //         <div className="card-center error-txt">⚠ {error || 'No data'}</div>
// //       ) : (
// //         <TripGrid data={data} go={go} />
// //       )}

// //     </div>
// //   )
// // }

// // function TripGrid({ data, go }) {
// //   const { allTrips, completed, missed, ontime, late, efficiency } = data
// //   const eff = Math.min(100, Math.max(0, efficiency || 0))

// //   return (
// //     <div className="trip-grid">

// //       {/* All Trips */}
// //       <div className="stat-box">
// //         <div className="stat-lbl">
// //           <BsBusFront className="stat-icon-ri" /> All trips
// //         </div>
// //         <div className="stat-num">{allTrips}</div>
// //         <button className="arr-btn" onClick={() => go('All')}>
// //           <BsArrowRight size={13} color="#fff" />
// //         </button>
// //       </div>

// //       {/* Completed + Ontime/Late */}
// //       <div className="stat-box completed-group">
// //         <div className="cg-top">
// //           <div className="stat-lbl">
// //             <BsCheckCircle className="stat-icon-ri green" /> Completed
// //           </div>
// //           <div className="stat-num">{completed}</div>
// //           <button className="arr-btn" onClick={() => go('Complete')}>
// //             <BsArrowRight size={13} color="#fff" />
// //           </button>
// //         </div>
// //         <div className="cg-divider" />
// //         <div className="cg-bot">
// //           <div className="mini">
// //             <div className="mini-lbl">
// //               <BsClock size={11} style={{ marginRight: 3 }} /> Ontime
// //             </div>
// //             <div className="mini-num teal-txt">{ontime}</div>
// //           </div>
// //           <div className="mini-sep" />
// //           <div className="mini">
// //             <div className="mini-lbl">
// //               <BsExclamationTriangle size={11} style={{ marginRight: 3 }} /> Late
// //             </div>
// //             <div className="mini-num red-txt">{late}</div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Missed */}
// //       <div className="stat-box">
// //         <div className="stat-lbl">
// //           <BsXCircle className="stat-icon-ri red" /> Missed
// //         </div>
// //         <div className="stat-num">{missed}</div>
// //         <button className="arr-btn" onClick={() => go('Missed')}>
// //           <BsArrowRight size={13} color="#fff" />
// //         </button>
// //       </div>

// //       {/* Efficiency */}
// //       <div className="eff-col">
// //         <div className="eff-inner">
// //           <div className="eff-bar-wrap">
// //             <div className="eff-bar-fill" style={{ height: `${eff}%` }} />
// //           </div>
// //           <div className="eff-pct">{eff}%</div>
// //           <div className="eff-label">Efficiency</div>
// //         </div>
// //       </div>

// //     </div>
// //   )
// // }

// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Loader, DateRangePicker, IconButton } from 'rsuite'
// import {
//   BsArrowRight, BsBusFront, BsCheckCircle,
//   BsXCircle, BsClock, BsExclamationTriangle,
// } from 'react-icons/bs'
// import './TripStats.css'

// export default function TripStats({ data, loading, error, onDateRangeChange }) {
//   const navigate   = useNavigate()
//   const [dateRange, setDateRange] = useState(null)

//   // Notify Dashboard whenever the range changes or is cleared
//   useEffect(() => {
//     onDateRangeChange?.(dateRange)
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dateRange])

//   // navigate logic kept exactly as original
//   const go = tab => navigate('/schedule', { state: { initialTab: tab } })

//   return (
//     <div className="card trip-card">

//       {/* ── Header ─────────────────────────────────────── */}
//       <div className="trip-header">
//         <div className="card-title">Trip Statistics</div>

//         <div className="trip-header-controls">
//           <DateRangePicker
//             size="xs"
//             value={dateRange}
//             onChange={val => setDateRange(val ?? null)}
//             onClean={() => setDateRange(null)}
//             format="dd MMM"
//             placement="bottomEnd"
//             cleanable
//             style={{ width: 150 }}
//             placeholder="Date range"
//           />
//         </div>
//       </div>

//       {/* ── Content ────────────────────────────────────── */}
//       {loading ? (
//         <div className="card-center">
//           <Loader size="sm" content="Loading..." />
//         </div>
//       ) : error || !data ? (
//         <div className="card-center error-txt">⚠ {error || 'No data'}</div>
//       ) : (
//         <TripGrid data={data} go={go} />
//       )}

//     </div>
//   )
// }

// function TripGrid({ data, go }) {
//   const { allTrips, completed, missed, ontime, late, efficiency } = data
//   const eff = Math.min(100, Math.max(0, efficiency || 0))

//   return (
//     <div className="trip-grid">

//       {/* All Trips */}
//       <div className="stat-box">
//         <div className="stat-lbl">
//           <BsBusFront className="stat-icon-ri" /> All trips
//         </div>
//         <div className="stat-num">{allTrips}</div>
//         {/* ✅ RSuite IconButton — navigate logic unchanged */}
//         <IconButton
//           className="arr-btn"
//           icon={<BsArrowRight size={13} color="#fff" />}
//           onClick={() => go('All')}
//           size="xs"
//           appearance="primary"
//         />
//       </div>

//       {/* Completed + Ontime/Late */}
//       <div className="stat-box completed-group">
//         <div className="cg-top">
//           <div className="stat-lbl">
//             <BsCheckCircle className="stat-icon-ri green" /> Completed
//           </div>
//           <div className="stat-num">{completed}</div>
//           {/* ✅ RSuite IconButton — navigate logic unchanged */}
//           <IconButton
//             className="arr-btn"
//             icon={<BsArrowRight size={13} color="#fff" />}
//             onClick={() => go('Complete')}
//             size="xs"
//             appearance="primary"
//           />
//         </div>
//         <div className="cg-divider" />
//         <div className="cg-bot">
//           <div className="mini">
//             <div className="mini-lbl">
//               <BsClock size={11} style={{ marginRight: 3 }} /> Ontime
//             </div>
//             <div className="mini-num teal-txt">{ontime}</div>
//           </div>
//           <div className="mini-sep" />
//           <div className="mini">
//             <div className="mini-lbl">
//               <BsExclamationTriangle size={11} style={{ marginRight: 3 }} /> Late
//             </div>
//             <div className="mini-num red-txt">{late}</div>
//           </div>
//         </div>
//       </div>

//       {/* Missed */}
//       <div className="stat-box">
//         <div className="stat-lbl">
//           <BsXCircle className="stat-icon-ri red" /> Missed
//         </div>
//         <div className="stat-num">{missed}</div>
//         {/* ✅ RSuite IconButton — navigate logic unchanged */}
//         <IconButton
//           className="arr-btn"
//           icon={<BsArrowRight size={13} color="#fff" />}
//           onClick={() => go('Missed')}
//           size="xs"
//           appearance="primary"
//         />
//       </div>

//       {/* Efficiency */}
//       <div className="eff-col">
//         <div className="eff-inner">
//           <div className="eff-bar-wrap">
//             <div className="eff-bar-fill" style={{ height: `${eff}%` }} />
//           </div>
//           <div className="eff-pct">{eff}%</div>
//           <div className="eff-label">Efficiency</div>
//         </div>
//       </div>

//     </div>
//   )
// }

import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader, IconButton, Whisper, Popover, Button, Calendar } from 'rsuite'
import {
  BsArrowRight, BsBusFront, BsCheckCircle,
  BsXCircle, BsClock, BsExclamationTriangle,
} from 'react-icons/bs'
import CalendarIcon from '@rsuite/icons/Calendar'
import './TripStats.css'

/* ── helpers ── */
const toKey   = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
const sameDay = (a, b) => toKey(a) === toKey(b)
const startOf = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
const fmt     = d => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })

/* ── Multi-Date Picker using RSuite Calendar ── */
function MultiDatePicker({ selectedDates, onChange }) {
  const [pending, setPending] = useState(selectedDates ?? [])
  const [calVal,  setCalVal]  = useState(new Date())

  const handleSelect = useCallback(date => {
    setPending(prev => {
      const exists = prev.some(d => sameDay(d, date))
      return exists
        ? prev.filter(d => !sameDay(d, date))
        : [...prev, startOf(date)]
    })
  }, [])

  const applyShortcut = useCallback(type => {
    if (type === 'today') {
      setPending([startOf(new Date())])
    } else if (type === 'yesterday') {
      const y = new Date(); y.setDate(y.getDate() - 1)
      setPending([startOf(y)])
    } else if (type === 'last7') {
      const arr = []
      for (let i = 0; i < 7; i++) {
        const d = new Date(); d.setDate(d.getDate() - i)
        arr.push(startOf(d))
      }
      setPending(arr)
    }
  }, [])

  /* Highlight selected cells via renderCell */
  const renderCell = date => {
    if (pending.some(d => sameDay(d, date))) {
      return <div className="mdc-sel-dot" />
    }
    return null
  }

  return (
    <div className="mdc-wrap">
      <Calendar
        compact
        isoWeek
        value={calVal}
        onChange={setCalVal}
        onSelect={handleSelect}
        renderCell={renderCell}
        style={{ width: 320 }}
      />
      <div className="mdc-footer">
        <div className="mdc-shortcuts">
          <button className="mdc-sh-btn" onClick={() => applyShortcut('today')}>Today</button>
          <button className="mdc-sh-btn" onClick={() => applyShortcut('yesterday')}>Yesterday</button>
          <button className="mdc-sh-btn" onClick={() => applyShortcut('last7')}>Last 7 Days</button>
        </div>
        <Button
          appearance="primary"
          size="xs"
          onClick={() => onChange(pending)}
          style={{ borderRadius: 8, fontWeight: 700, fontSize: 12, minWidth: 46 }}
        >
          OK
        </Button>
      </div>
    </div>
  )
}

/* ── Main component ── */
export default function TripStats({ data, loading, error, onDateRangeChange }) {
  const navigate   = useNavigate()
  const whisperRef = useRef()
  const [selectedDates, setSelectedDates] = useState([])

  const handleOk = useCallback(dates => {
    setSelectedDates(dates)
    onDateRangeChange?.(dates)
    whisperRef.current?.close()
  }, [onDateRangeChange])

  const go = tab => navigate('/schedule', { state: { initialTab: tab } })

  let triggerLabel = 'Date'
  if (selectedDates.length === 1) triggerLabel = fmt(selectedDates[0])
  else if (selectedDates.length > 1) triggerLabel = `${selectedDates.length} dates`

  const speaker = (
    <Popover arrow={false} className="mdc-popover">
      <MultiDatePicker selectedDates={selectedDates} onChange={handleOk} />
    </Popover>
  )

  return (
    <div className="card trip-card">
      <div className="trip-header">
        <div className="card-title">Trip Statistics</div>
        <div className="trip-header-controls">
          <Whisper
            ref={whisperRef}
            trigger="click"
            placement="bottomEnd"
            speaker={speaker}
          >
            <button className="mdc-trigger">
              {triggerLabel}
              <CalendarIcon style={{ fontSize: 13, color: '#6b7c99' }} />
            </button>
          </Whisper>
        </div>
      </div>

      {loading ? (
        <div className="card-center"><Loader size="sm" content="Loading..." /></div>
      ) : error || !data ? (
        <div className="card-center error-txt">⚠ {error || 'No data'}</div>
      ) : (
        <TripGrid data={data} go={go} />
      )}
    </div>
  )
}

function TripGrid({ data, go }) {
  const { allTrips, completed, missed, ontime, late, efficiency } = data
  const eff = Math.min(100, Math.max(0, efficiency || 0))

  return (
    <div className="trip-grid">
      <div className="stat-box">
        <div className="stat-lbl"><BsBusFront className="stat-icon-ri" /> All trips</div>
        <div className="stat-num">{allTrips}</div>
        <IconButton className="arr-btn" icon={<BsArrowRight size={13} color="#fff" />} onClick={() => go('All')} size="xs" appearance="primary" />
      </div>

      <div className="stat-box completed-group">
        <div className="cg-top">
          <div className="stat-lbl"><BsCheckCircle className="stat-icon-ri green" /> Completed</div>
          <div className="stat-num">{completed}</div>
          <IconButton className="arr-btn" icon={<BsArrowRight size={13} color="#fff" />} onClick={() => go('Complete')} size="xs" appearance="primary" />
        </div>
        <div className="cg-divider" />
        <div className="cg-bot">
          <div className="mini">
            <div className="mini-lbl"><BsClock size={11} style={{ marginRight: 3 }} /> Ontime</div>
            <div className="mini-num teal-txt">{ontime}</div>
          </div>
          <div className="mini-sep" />
          <div className="mini">
            <div className="mini-lbl"><BsExclamationTriangle size={11} style={{ marginRight: 3 }} /> Late</div>
            <div className="mini-num red-txt">{late}</div>
          </div>
        </div>
      </div>

      <div className="stat-box">
        <div className="stat-lbl"><BsXCircle className="stat-icon-ri red" /> Missed</div>
        <div className="stat-num">{missed}</div>
        <IconButton className="arr-btn" icon={<BsArrowRight size={13} color="#fff" />} onClick={() => go('Missed')} size="xs" appearance="primary" />
      </div>

      <div className="eff-col">
        <div className="eff-inner">
          <div className="eff-bar-wrap">
            <div className="eff-bar-fill" style={{ height: `${eff}%` }} />
          </div>
          <div className="eff-pct">{eff}%</div>
          <div className="eff-label">Efficiency</div>
        </div>
      </div>
    </div>
  )
}