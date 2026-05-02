// // // // import { useState, useRef, useEffect } from 'react'
// // // // import { IconButton, Calendar } from 'rsuite'
// // // // import ArrowLeftIcon  from '@rsuite/icons/ArrowLeft'
// // // // import ArrowRightIcon from '@rsuite/icons/ArrowRight'
// // // // import ArrowDownIcon  from '@rsuite/icons/ArrowDown'
// // // // import ArrowUpIcon    from '@rsuite/icons/ArrowUp'
// // // // import './MiniCalendar.css'

// // // // const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// // // // function getWeekDates(date) {
// // // //   const d = new Date(date)
// // // //   const diff = d.getDate() - d.getDay()
// // // //   return Array.from({ length: 7 }, (_, i) =>
// // // //     new Date(d.getFullYear(), d.getMonth(), diff + i)
// // // //   )
// // // // }

// // // // export default function MiniCalendar({ selectedDate, onDateSelect }) {
// // // //   const [current,  setCurrent]  = useState(selectedDate ? new Date(selectedDate) : new Date())
// // // //   const [expanded, setExpanded] = useState(false)
// // // //   const wrapRef = useRef(null)

// // // //   const today     = new Date()
// // // //   const weekDates = getWeekDates(current)

// // // //   // Close on outside click
// // // //   useEffect(() => {
// // // //     if (!expanded) return
// // // //     const handler = (e) => {
// // // //       if (wrapRef.current && !wrapRef.current.contains(e.target)) {
// // // //         setExpanded(false)
// // // //       }
// // // //     }
// // // //     document.addEventListener('mousedown', handler)
// // // //     return () => document.removeEventListener('mousedown', handler)
// // // //   }, [expanded])

// // // //   const prevWeek = () => { const d = new Date(current); d.setDate(d.getDate() - 7); setCurrent(d) }
// // // //   const nextWeek = () => { const d = new Date(current); d.setDate(d.getDate() + 7); setCurrent(d) }

// // // //   const isToday = d => d.toDateString() === today.toDateString()
// // // //   const isSel   = d => selectedDate && d.toDateString() === new Date(selectedDate).toDateString()

// // // //   const handleDatePick = (date) => {
// // // //     setCurrent(date)
// // // //     onDateSelect?.(date)
// // // //     setExpanded(false)   // ← auto-close on date pick
// // // //   }

// // // //   return (
// // // //     <div className="mini-cal" ref={wrapRef}>

// // // //       {/* Top row */}
// // // //       <div className="mc-top">
// // // //         <div className="mc-today-info">
// // // //           <span className="mc-today-label">Today</span>
// // // //           <span className="mc-today-date">
// // // //             {today.getDate()} {today.toLocaleString('default', { weekday: 'long' })}
// // // //           </span>
// // // //         </div>
// // // //         <div className="mc-nav-arrows">
// // // //           <IconButton icon={<ArrowLeftIcon />}  size="xs" appearance="subtle" onClick={prevWeek} />
// // // //           <IconButton icon={<ArrowRightIcon />} size="xs" appearance="subtle" onClick={nextWeek} />
// // // //           <IconButton
// // // //             icon={expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
// // // //             size="xs"
// // // //             appearance="subtle"
// // // //             onClick={() => setExpanded(e => !e)}
// // // //           />
// // // //         </div>
// // // //       </div>

// // // //       {/* Week strip */}
// // // //       <div className="mc-week-grid">
// // // //         {weekDates.map((date, i) => (
// // // //           <div
// // // //             key={i}
// // // //             className={['mc-week-cell', isToday(date) ? 'mc-today' : '', isSel(date) ? 'mc-sel' : ''].join(' ')}
// // // //             onClick={() => handleDatePick(date)}
// // // //           >
// // // //             <span className="mc-dn">{DAYS[date.getDay()]}</span>
// // // //             <span className="mc-day">{date.getDate()}</span>
// // // //           </div>
// // // //         ))}
// // // //       </div>

// // // //       {/* Expanded calendar — absolutely positioned so it floats over content below */}
// // // //       {expanded && (
// // // //         <div className="mc-full-calendar">
// // // //           <Calendar
// // // //             compact
// // // //             value={current}
// // // //             onChange={handleDatePick}
// // // //           />
// // // //         </div>
// // // //       )}

// // // //     </div>
// // // //   )
// // // // }

// // // import { useState, useRef, useEffect } from 'react'
// // // import { IconButton, Calendar } from 'rsuite'
// // // import ArrowLeftIcon  from '@rsuite/icons/ArrowLeft'
// // // import ArrowRightIcon from '@rsuite/icons/ArrowRight'
// // // import ArrowDownIcon  from '@rsuite/icons/ArrowDown'
// // // import ArrowUpIcon    from '@rsuite/icons/ArrowUp'
// // // import './MiniCalendar.css'

// // // const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// // // function toKey(d) {
// // //   return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
// // // }

// // // function getWeekDates(date) {
// // //   const d    = new Date(date)
// // //   const diff = d.getDate() - d.getDay()
// // //   return Array.from({ length: 7 }, (_, i) =>
// // //     new Date(d.getFullYear(), d.getMonth(), diff + i)
// // //   )
// // // }

// // // export default function MiniCalendar({ selectedDate, onDateSelect, onMultiSelect }) {
// // //   const [current,      setCurrent]      = useState(selectedDate ? new Date(selectedDate) : new Date())
// // //   const [expanded,     setExpanded]     = useState(false)
// // //   const [selectedDays, setSelectedDays] = useState(() =>
// // //     selectedDate ? new Set([toKey(new Date(selectedDate))]) : new Set()
// // //   )
// // //   const wrapRef = useRef(null)

// // //   const today     = new Date()
// // //   const weekDates = getWeekDates(current)

// // //   /* close on outside click */
// // //   useEffect(() => {
// // //     if (!expanded) return
// // //     const handler = e => {
// // //       if (wrapRef.current && !wrapRef.current.contains(e.target))
// // //         setExpanded(false)
// // //     }
// // //     document.addEventListener('mousedown', handler)
// // //     return () => document.removeEventListener('mousedown', handler)
// // //   }, [expanded])

// // //   const prevWeek = () => { const d = new Date(current); d.setDate(d.getDate() - 7); setCurrent(d) }
// // //   const nextWeek = () => { const d = new Date(current); d.setDate(d.getDate() + 7); setCurrent(d) }

// // //   const isToday = d => d.toDateString() === today.toDateString()
// // //   const isSel   = d => selectedDays.has(toKey(d))

// // //   /* toggle a date in/out of selection */
// // //   const toggleDate = (date) => {
// // //     const key = toKey(date)
// // //     setSelectedDays(prev => {
// // //       const next = new Set(prev)
// // //       if (next.has(key)) next.delete(key)
// // //       else               next.add(key)
// // //       const dates = [...next].map(k => {
// // //         const [y, m, day] = k.split('-').map(Number)
// // //         return new Date(y, m, day)
// // //       })
// // //       onMultiSelect?.(dates)
// // //       onDateSelect?.(date)
// // //       return next
// // //     })
// // //     setCurrent(date)
// // //   }

// // //   const clearAll = () => {
// // //     setSelectedDays(new Set())
// // //     onMultiSelect?.([])
// // //   }

// // //   /* dot indicator on expanded calendar cells */
// // //   const renderCell = (date) =>
// // //     isSel(date) ? <div className="mc-cal-dot" /> : null

// // //   const count = selectedDays.size

// // //   return (
// // //     <div className="mini-cal" ref={wrapRef}>

// // //       {/* Top row */}
// // //       <div className="mc-top">
// // //         <div className="mc-today-info">
// // //           <span className="mc-today-label">Today</span>
// // //           <span className="mc-today-date">
// // //             {today.getDate()} {today.toLocaleString('default', { weekday: 'long' })}
// // //           </span>
// // //         </div>

// // //         <div className="mc-nav-arrows">
// // //           {count > 0 && (
// // //             <span className="mc-count-badge" onClick={clearAll} title="Clear selection">
// // //               {count}✕
// // //             </span>
// // //           )}
// // //           <IconButton icon={<ArrowLeftIcon />}  size="xs" appearance="subtle" onClick={prevWeek} />
// // //           <IconButton icon={<ArrowRightIcon />} size="xs" appearance="subtle" onClick={nextWeek} />
// // //           <IconButton
// // //             icon={expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
// // //             size="xs"
// // //             appearance="subtle"
// // //             onClick={() => setExpanded(e => !e)}
// // //           />
// // //         </div>
// // //       </div>

// // //       {/* Week strip */}
// // //       <div className="mc-week-grid">
// // //         {weekDates.map((date, i) => (
// // //           <div
// // //             key={i}
// // //             className={[
// // //               'mc-week-cell',
// // //               isToday(date) && !isSel(date) ? 'mc-today' : '',
// // //               isSel(date)                   ? 'mc-sel'   : '',
// // //             ].filter(Boolean).join(' ')}
// // //             onClick={() => toggleDate(date)}
// // //           >
// // //             <span className="mc-dn">{DAYS[date.getDay()]}</span>
// // //             <span className="mc-day">{date.getDate()}</span>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       {/* Expanded calendar — absolutely positioned, floats over content */}
// // //       {expanded && (
// // //         <div className="mc-full-calendar">
// // //           <Calendar
// // //             compact
// // //             value={current}
// // //             onSelect={toggleDate}
// // //             renderCell={renderCell}
// // //           />
// // //           {count > 0 && (
// // //             <div className="mc-cal-footer">
// // //               <span className="mc-sel-info">
// // //                 {count} date{count > 1 ? 's' : ''} selected
// // //               </span>
// // //               <button className="mc-clear-btn" onClick={clearAll}>
// // //                 Clear all
// // //               </button>
// // //             </div>
// // //           )}
// // //         </div>
// // //       )}

// // //     </div>
// // //   )
// // // }

// // import { useState, useRef, useEffect, useCallback } from 'react'
// // import { IconButton, Button, Tag, Calendar, Divider } from 'rsuite'
// // import { BsChevronLeft, BsChevronRight, BsChevronDown, BsChevronUp, BsX } from 'react-icons/bs'
// // import './MiniCalendar.css'

// // const DAYS_STRIP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
// // const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
// //   'July', 'August', 'September', 'October', 'November', 'December']

// // const toKey = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
// // const sameKey = (a, b) => toKey(a) === toKey(b)
// // const startOf = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }

// // function getWeekDates(anchor) {
// //   const d = new Date(anchor)
// //   const diff = d.getDate() - d.getDay()
// //   return Array.from({ length: 7 }, (_, i) =>
// //     new Date(d.getFullYear(), d.getMonth(), diff + i)
// //   )
// // }

// // export default function MiniCalendar({
// //   selectedDate,
// //   onDateSelect,
// //   onMultiSelect,
// //   onFilterChange,
// // }) {
// //   const today = new Date()

// //   const [anchor, setAnchor] = useState(selectedDate ? new Date(selectedDate) : new Date())
// //   const [expanded, setExpanded] = useState(false)
// //   const [selectedKeys, setSelectedKeys] = useState(() =>
// //     selectedDate ? new Set([toKey(new Date(selectedDate))]) : new Set()
// //   )
// //   const [calValue, setCalValue] = useState(selectedDate ? new Date(selectedDate) : new Date())
// //   const wrapRef = useRef(null)

// //   /* close on outside click */
// //   useEffect(() => {
// //     if (!expanded) return
// //     const fn = e => {
// //       if (wrapRef.current && !wrapRef.current.contains(e.target))
// //         setExpanded(false)
// //     }
// //     document.addEventListener('mousedown', fn)
// //     return () => document.removeEventListener('mousedown', fn)
// //   }, [expanded])

// //   const prevWeek = () => { const d = new Date(anchor); d.setDate(d.getDate() - 7); setAnchor(d) }
// //   const nextWeek = () => { const d = new Date(anchor); d.setDate(d.getDate() + 7); setAnchor(d) }

// //   const isToday = d => sameKey(d, today)
// //   const isSel = d => selectedKeys.has(toKey(d))

// //   const emitDates = useCallback((keys, type = 'custom') => {
// //     const dates = [...keys].map(k => { const [y, m, day] = k.split('-').map(Number); return new Date(y, m, day) })
// //     onMultiSelect?.(dates)
// //     onFilterChange?.({ dates, type })
// //     if (dates[0]) onDateSelect?.(startOf(dates[0]))
// //   }, [onMultiSelect, onFilterChange, onDateSelect])

// //   const toggleDate = useCallback(date => {
// //     const key = toKey(date)
// //     setSelectedKeys(prev => {
// //       const next = new Set(prev)
// //       if (next.has(key)) next.delete(key); else next.add(key)
// //       emitDates(next, 'custom')
// //       return next
// //     })
// //     setAnchor(date)
// //     setCalValue(date)
// //   }, [emitDates])

// //   const clearAll = () => {
// //     setSelectedKeys(new Set())
// //     onMultiSelect?.([])
// //     onFilterChange?.({ dates: [], type: 'all' })
// //   }

// //   const applyShortcut = useCallback(type => {
// //     let dates = []
// //     if (type === 'today') {
// //       dates = [startOf(new Date())]
// //     } else if (type === 'tomorrow') {
// //       const t = new Date(); t.setDate(t.getDate() + 1); dates = [startOf(t)]
// //     } else if (type === 'last7') {
// //       for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(d.getDate() - i); dates.push(startOf(d)) }
// //     }
// //     const keys = new Set(dates.map(toKey))
// //     setSelectedKeys(keys)
// //     onMultiSelect?.(dates)
// //     onFilterChange?.({ dates, type })
// //     onDateSelect?.(dates[0])
// //     setAnchor(dates[0])
// //     setCalValue(dates[0])
// //   }, [onMultiSelect, onFilterChange, onDateSelect])

// //   /* renderCell — shows a dot on selected dates inside RSuite Calendar */
// //   const renderCell = date => {
// //     if (isSel(date)) return <div className="mc-cal-sel-dot" />
// //     return null
// //   }

// //   const count = selectedKeys.size
// //   const dayLabel = count === 1 ? '1 day' : `${count} days`
// //   const weekDates = getWeekDates(anchor)

// //   return (
// //     <div className="mini-cal" ref={wrapRef}>

// //       {/* ── Top row ── */}
// //       <div className="mc-top">
// //         <div className="mc-today-info">
// //           <span className="mc-today-label">Today</span>
// //           <span className="mc-today-date">
// //             {today.getDate()} {today.toLocaleString('default', { weekday: 'long' })}
// //           </span>
// //         </div>

// //         <div className="mc-nav-arrows">

// //           <IconButton icon={<BsChevronLeft />} size="xs" appearance="subtle" onClick={prevWeek} />
// //           <IconButton icon={<BsChevronRight />} size="xs" appearance="subtle" onClick={nextWeek} />
// //           <IconButton
// //             icon={expanded ? <BsChevronUp /> : <BsChevronDown />}
// //             size="xs" appearance="subtle"
// //             onClick={() => setExpanded(e => !e)}
// //           />
// //         </div>
// //       </div>

// //       {/* ── Week strip ── */}
// //       <div className="mc-week-grid">
// //         {weekDates.map((date, i) => (
// //           <div
// //             key={i}
// //             className={[
// //               'mc-week-cell',
// //               isToday(date) && !isSel(date) ? 'mc-today' : '',
// //               isSel(date) ? 'mc-sel' : '',
// //             ].filter(Boolean).join(' ')}
// //             onClick={() => toggleDate(date)}
// //           >
// //             <span className="mc-dn">{DAYS_STRIP[date.getDay()]}</span>
// //             <span className="mc-day">{date.getDate()}</span>
// //           </div>
// //         ))}
// //       </div>

// //       {/* ── Expanded calendar — RSuite Calendar ── */}
// //       {expanded && (
// //         <div className="mc-full-calendar">

// //           {/* RSuite compact Calendar — multi-select via renderCell dot + CSS :has() */}
// //           <div className="mc-rs-cal-wrap">
// //             <Calendar
// //               compact
// //               value={calValue}
// //               onSelect={date => toggleDate(date)}
// //               renderCell={renderCell}
// //             />
// //           </div>

// //           <Divider style={{ margin: '0' }} />

// //           {/* Footer: shortcut Buttons + count Tag + clear Button */}
// //           <div className="mc-cal-footer">
// //             <div className="mc-shortcuts">
// //               <Button size="xs" appearance="subtle" className="mc-sh-btn" onClick={() => applyShortcut('today')}>Today</Button>
// //               <Button size="xs" appearance="subtle" className="mc-sh-btn" onClick={() => applyShortcut('tomorrow')}>Tomorrow</Button>
// //               <Button size="xs" appearance="subtle" className="mc-sh-btn" onClick={() => applyShortcut('last7')}>Last 7 Days</Button>
// //             </div>

// //             {count > 0 && (
// //               <div className="mc-footer-right">
// //                 <Tag color="blue" style={{ fontSize: 10, fontWeight: 700 }}>{dayLabel} selected</Tag>
// //                 <IconButton
// //                   icon={<BsX />}
// //                   size="xs"
// //                   appearance="subtle"
// //                   onClick={clearAll}
// //                   style={{ color: '#e53e3e' }}
// //                 />
// //               </div>
// //             )}
// //           </div>

// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// import { useState, useRef, useEffect, useCallback } from 'react'
// import { IconButton, Button, Tag, Calendar, Divider } from 'rsuite'
// import { BsChevronLeft, BsChevronRight, BsChevronDown, BsChevronUp, BsX } from 'react-icons/bs'
// import './MiniCalendar.css'

// const DAYS_STRIP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// const toKey = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
// const sameKey = (a, b) => toKey(a) === toKey(b)
// const startOf = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }

// function getWeekDates(anchor) {
//   const d = new Date(anchor)
//   const diff = d.getDate() - d.getDay()
//   return Array.from({ length: 7 }, (_, i) =>
//     new Date(d.getFullYear(), d.getMonth(), diff + i)
//   )
// }

// export default function MiniCalendar({
//   selectedDate,
//   onDateSelect,
//   onMultiSelect,
//   onFilterChange,
// }) {
//   const today = new Date()

//   const [anchor, setAnchor] = useState(selectedDate ? new Date(selectedDate) : new Date())
//   const [expanded, setExpanded] = useState(false)
  
//   // Confirmed selections (what the parent sees)
//   const [confirmedKeys, setConfirmedKeys] = useState(() =>
//     selectedDate ? new Set([toKey(new Date(selectedDate))]) : new Set()
//   )
  
//   // Temporary selections (only visible in the calendar UI)
//   const [tempKeys, setTempKeys] = useState(() =>
//     selectedDate ? new Set([toKey(new Date(selectedDate))]) : new Set()
//   )
  
//   const [calValue, setCalValue] = useState(selectedDate ? new Date(selectedDate) : new Date())
//   const wrapRef = useRef(null)

//   /* close on outside click - cancel temp selection */
//   useEffect(() => {
//     if (!expanded) return
//     const fn = e => {
//       if (wrapRef.current && !wrapRef.current.contains(e.target)) {
//         setExpanded(false)
//         setTempKeys(confirmedKeys) // Reset to confirmed selection
//       }
//     }
//     document.addEventListener('mousedown', fn)
//     return () => document.removeEventListener('mousedown', fn)
//   }, [expanded, confirmedKeys])

//   const prevWeek = () => { const d = new Date(anchor); d.setDate(d.getDate() - 7); setAnchor(d) }
//   const nextWeek = () => { const d = new Date(anchor); d.setDate(d.getDate() + 7); setAnchor(d) }

//   const isToday = d => sameKey(d, today)
//   const isSel = d => tempKeys.has(toKey(d))

//   // Toggle date in temporary selection
//   const toggleDate = useCallback(date => {
//     const key = toKey(date)
//     setTempKeys(prev => {
//       const next = new Set(prev)
//       if (next.has(key)) next.delete(key)
//       else next.add(key)
//       return next
//     })
//     setAnchor(date)
//     setCalValue(date)
//   }, [])

//   // Clear temporary selection
//   const clearTemp = () => {
//     setTempKeys(new Set())
//   }

//   // Apply shortcuts (set temporary selection)
//   const applyShortcut = useCallback(type => {
//     let dates = []
//     if (type === 'today') {
//       dates = [startOf(new Date())]
//     } else if (type === 'tomorrow') {
//       const t = new Date()
//       t.setDate(t.getDate() + 1)
//       dates = [startOf(t)]
//     } else if (type === 'last7') {
//       for (let i = 0; i < 7; i++) {
//         const d = new Date()
//         d.setDate(d.getDate() - i)
//         dates.push(startOf(d))
//       }
//     }
//     const keys = new Set(dates.map(toKey))
//     setTempKeys(keys)
//     setAnchor(dates[0])
//     setCalValue(dates[0])
//   }, [])

//   // Confirm selection - apply to parent
//   const handleOK = () => {
//     const dates = [...tempKeys].map(k => {
//       const [y, m, day] = k.split('-').map(Number)
//       return new Date(y, m, day)
//     })
    
//     setConfirmedKeys(new Set(tempKeys))
    
//     // Determine filter type
//     let type = 'custom'
//     if (tempKeys.size === 1) {
//       const singleDate = dates[0]
//       if (sameKey(singleDate, today)) type = 'today'
//       else if (sameKey(singleDate, new Date(today.getTime() + 86400000))) type = 'tomorrow'
//     } else if (tempKeys.size === 7) {
//       // Check if it's last 7 days
//       const sortedDates = dates.sort((a, b) => b - a)
//       const isLast7 = sortedDates.every((d, i) => {
//         const expected = new Date()
//         expected.setDate(expected.getDate() - i)
//         return sameKey(d, expected)
//       })
//       if (isLast7) type = 'last7'
//     }
    
//     onMultiSelect?.(dates)
//     onFilterChange?.({ dates, type })
//     if (dates[0]) onDateSelect?.(startOf(dates[0]))
    
//     setExpanded(false)
//   }

//   // Cancel - revert to confirmed selection
//   const handleCancel = () => {
//     setTempKeys(new Set(confirmedKeys))
//     setExpanded(false)
//   }

//   /* renderCell — shows indicator on selected dates */
//   const renderCell = date => {
//     if (isSel(date)) return <div className="mc-cal-sel-dot" />
//     return null
//   }

//   const count = tempKeys.size
//   const confirmedCount = confirmedKeys.size
//   const dayLabel = count === 1 ? '1 day' : `${count} days`
//   const weekDates = getWeekDates(anchor)

//   return (
//     <div className="mini-cal" ref={wrapRef}>

//       {/* ── Top row ── */}
//       <div className="mc-top">
//         <div className="mc-today-info">
//           <span className="mc-today-label">Today</span>
//           <span className="mc-today-date">
//             {today.getDate()} {today.toLocaleString('default', { weekday: 'long' })}
//           </span>
//         </div>

//         <div className="mc-nav-arrows">
//           {confirmedCount > 0 && !expanded && (
//             <Tag color="blue" size="sm" style={{ fontSize: 10, fontWeight: 600, marginRight: 4 }}>
//               {confirmedCount} {confirmedCount === 1 ? 'day' : 'days'}
//             </Tag>
//           )}
//           <IconButton icon={<BsChevronLeft />} size="xs" appearance="subtle" onClick={prevWeek} />
//           <IconButton icon={<BsChevronRight />} size="xs" appearance="subtle" onClick={nextWeek} />
//           <IconButton
//             icon={expanded ? <BsChevronUp /> : <BsChevronDown />}
//             size="xs" appearance="subtle"
//             onClick={() => setExpanded(e => !e)}
//           />
//         </div>
//       </div>

//       {/* ── Week strip ── */}
//       <div className="mc-week-grid">
//         {weekDates.map((date, i) => {
//           const isConfirmed = confirmedKeys.has(toKey(date))
//           return (
//             <div
//               key={i}
//               className={[
//                 'mc-week-cell',
//                 isToday(date) && !isConfirmed ? 'mc-today' : '',
//                 isConfirmed ? 'mc-sel' : '',
//               ].filter(Boolean).join(' ')}
//               onClick={() => {
//                 setExpanded(true)
//                 toggleDate(date)
//               }}
//             >
//               <span className="mc-dn">{DAYS_STRIP[date.getDay()]}</span>
//               <span className="mc-day">{date.getDate()}</span>
//             </div>
//           )
//         })}
//       </div>

//       {/* ── Expanded calendar ── */}
//       {expanded && (
//         <div className="mc-full-calendar">

//           {/* RSuite compact Calendar */}
//           <div className="mc-rs-cal-wrap">
//             <Calendar
//               compact
//               value={calValue}
//               onSelect={date => toggleDate(date)}
//               renderCell={renderCell}
//             />
//           </div>

//           <Divider style={{ margin: '0' }} />

//           {/* Footer: shortcuts + count + clear */}
//           <div className="mc-cal-footer">
//             <div className="mc-shortcuts">
//               <Button size="xs" appearance="subtle" className="mc-sh-btn" onClick={() => applyShortcut('today')}>
//                 Today
//               </Button>
//               <Button size="xs" appearance="subtle" className="mc-sh-btn" onClick={() => applyShortcut('tomorrow')}>
//                 Tomorrow
//               </Button>
//               <Button size="xs" appearance="subtle" className="mc-sh-btn" onClick={() => applyShortcut('last7')}>
//                 Last 7 Days
//               </Button>
//             </div>

//             {count > 0 && (
//               <div className="mc-footer-right">
//                 <Tag color="blue" style={{ fontSize: 10, fontWeight: 700 }}>
//                   {dayLabel} selected
//                 </Tag>
//                 <IconButton
//                   icon={<BsX />}
//                   size="xs"
//                   appearance="subtle"
//                   onClick={clearTemp}
//                   style={{ color: '#e53e3e' }}
//                 />
//               </div>
//             )}
//           </div>

//           <Divider style={{ margin: '0' }} />

//           {/* OK / Cancel buttons */}
//           <div className="mc-action-buttons">
//             <Button size="sm" appearance="subtle" onClick={handleCancel}>
//               Cancel
//             </Button>
//             <Button size="sm" appearance="primary" onClick={handleOK} disabled={count === 0}>
//               OK
//             </Button>
//           </div>

//         </div>
//       )}
//     </div>
//   )
// }

import { useState, useRef, useEffect, useCallback } from 'react'
import { IconButton, Button, Tag, Calendar, Divider } from 'rsuite'
import { BsChevronLeft, BsChevronRight, BsChevronDown, BsChevronUp, BsX } from 'react-icons/bs'
import './MiniCalendar.css'

const DAYS_STRIP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const toKey = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
const sameKey = (a, b) => toKey(a) === toKey(b)
const startOf = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }

function getWeekDates(anchor) {
  const d = new Date(anchor)
  const diff = d.getDate() - d.getDay()
  return Array.from({ length: 7 }, (_, i) =>
    new Date(d.getFullYear(), d.getMonth(), diff + i)
  )
}

export default function MiniCalendar({
  selectedDate,
  onDateSelect,
  onMultiSelect,
  onFilterChange,
}) {
  const today = new Date()

  const [anchor, setAnchor] = useState(selectedDate ? new Date(selectedDate) : new Date())
  const [expanded, setExpanded] = useState(false)
  
  // Confirmed selections (what the parent sees)
  const [confirmedKeys, setConfirmedKeys] = useState(() =>
    selectedDate ? new Set([toKey(new Date(selectedDate))]) : new Set()
  )
  
  // Temporary selections (only visible in the calendar UI)
  const [tempKeys, setTempKeys] = useState(() =>
    selectedDate ? new Set([toKey(new Date(selectedDate))]) : new Set()
  )
  
  const [calValue, setCalValue] = useState(selectedDate ? new Date(selectedDate) : new Date())
  const wrapRef = useRef(null)

  /* close on outside click - cancel temp selection */
  useEffect(() => {
    if (!expanded) return
    const fn = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setExpanded(false)
        setTempKeys(confirmedKeys) // Reset to confirmed selection
      }
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [expanded, confirmedKeys])

  const prevWeek = () => { const d = new Date(anchor); d.setDate(d.getDate() - 7); setAnchor(d) }
  const nextWeek = () => { const d = new Date(anchor); d.setDate(d.getDate() + 7); setAnchor(d) }

  const isToday = d => sameKey(d, today)
  const isSel = d => tempKeys.has(toKey(d))

  // Toggle date in temporary selection
  const toggleDate = useCallback(date => {
    const key = toKey(date)
    setTempKeys(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
    setAnchor(date)
    setCalValue(date)
  }, [])

  // Clear temporary selection
  const clearTemp = () => {
    setTempKeys(new Set())
  }

  // Apply shortcuts (set temporary selection)
  const applyShortcut = useCallback(type => {
    let dates = []
    if (type === 'today') {
      dates = [startOf(new Date())]
    } else if (type === 'tomorrow') {
      const t = new Date()
      t.setDate(t.getDate() + 1)
      dates = [startOf(t)]
    } else if (type === 'last7') {
      for (let i = 0; i < 7; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        dates.push(startOf(d))
      }
    }
    const keys = new Set(dates.map(toKey))
    setTempKeys(keys)
    setAnchor(dates[0])
    setCalValue(dates[0])
  }, [])

  // Confirm selection - apply to parent
  const handleOK = () => {
    const dates = [...tempKeys].map(k => {
      const [y, m, day] = k.split('-').map(Number)
      return new Date(y, m, day)
    })
    
    setConfirmedKeys(new Set(tempKeys))
    
    // Determine filter type
    let type = 'custom'
    if (tempKeys.size === 1) {
      const singleDate = dates[0]
      if (sameKey(singleDate, today)) type = 'today'
      else if (sameKey(singleDate, new Date(today.getTime() + 86400000))) type = 'tomorrow'
    } else if (tempKeys.size === 7) {
      // Check if it's last 7 days
      const sortedDates = dates.sort((a, b) => b - a)
      const isLast7 = sortedDates.every((d, i) => {
        const expected = new Date()
        expected.setDate(expected.getDate() - i)
        return sameKey(d, expected)
      })
      if (isLast7) type = 'last7'
    }
    
    onMultiSelect?.(dates)
    onFilterChange?.({ dates, type })
    if (dates[0]) onDateSelect?.(startOf(dates[0]))
    
    setExpanded(false)
  }

  // Cancel - revert to confirmed selection
  const handleCancel = () => {
    setTempKeys(new Set(confirmedKeys))
    setExpanded(false)
  }

  /* renderCell — shows indicator on selected dates */
  const renderCell = date => {
    if (isSel(date)) return <div className="mc-cal-sel-dot" />
    return null
  }

  const count = tempKeys.size
  const confirmedCount = confirmedKeys.size
  const dayLabel = count === 1 ? '1 day' : `${count} days`
  const weekDates = getWeekDates(anchor)

  return (
    <div className="mini-cal" ref={wrapRef}>

      {/* ── Top row ── */}
      <div className="mc-top">
        <div className="mc-today-info">
          <span className="mc-today-label">Today</span>
          <span className="mc-today-date">
            {today.getDate()} {today.toLocaleString('default', { weekday: 'long' })}
          </span>
        </div>

        <div className="mc-nav-arrows">
          {confirmedCount > 0 && !expanded && (
            <Tag color="blue" size="sm" style={{ fontSize: 10, fontWeight: 600, marginRight: 4 }}>
              {confirmedCount} {confirmedCount === 1 ? 'day' : 'days'}
            </Tag>
          )}
          <IconButton icon={<BsChevronLeft />} size="xs" appearance="subtle" onClick={prevWeek} />
          <IconButton icon={<BsChevronRight />} size="xs" appearance="subtle" onClick={nextWeek} />
          <IconButton
            icon={expanded ? <BsChevronUp /> : <BsChevronDown />}
            size="xs" appearance="subtle"
            onClick={() => setExpanded(e => !e)}
          />
        </div>
      </div>

      {/* ── Week strip ── */}
      <div className="mc-week-grid">
        {weekDates.map((date, i) => {
          const isConfirmed = confirmedKeys.has(toKey(date))
          return (
            <div
              key={i}
              className={[
                'mc-week-cell',
                isToday(date) && !isConfirmed ? 'mc-today' : '',
                isConfirmed ? 'mc-sel' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => {
                setExpanded(true)
                toggleDate(date)
              }}
            >
              <span className="mc-dn">{DAYS_STRIP[date.getDay()]}</span>
              <span className="mc-day">{date.getDate()}</span>
            </div>
          )
        })}
      </div>

      {/* ── Expanded calendar ── */}
      {expanded && (
        <div className="mc-full-calendar">

          {/* RSuite compact Calendar */}
          <div className="mc-rs-cal-wrap">
            <Calendar
              compact
              value={calValue}
              onSelect={date => toggleDate(date)}
              renderCell={renderCell}
            />
          </div>

          <Divider style={{ margin: '0' }} />

          {/* Footer: shortcuts + count + clear */}
          <div className="mc-cal-footer">
            <div className="mc-shortcuts">
              <Button size="xs" appearance="subtle" className="mc-sh-btn" onClick={() => applyShortcut('today')}>
                Today
              </Button>
              <Button size="xs" appearance="subtle" className="mc-sh-btn" onClick={() => applyShortcut('tomorrow')}>
                Tomorrow
              </Button>
              <Button size="xs" appearance="subtle" className="mc-sh-btn" onClick={() => applyShortcut('last7')}>
                Last 7 Days
              </Button>
            </div>

            {count > 0 && (
              <div className="mc-footer-right">
                <Tag color="blue" style={{ fontSize: 10, fontWeight: 700 }}>
                  {dayLabel} selected
                </Tag>
                <IconButton
                  icon={<BsX />}
                  size="xs"
                  appearance="subtle"
                  onClick={clearTemp}
                  style={{ color: '#e53e3e' }}
                />
              </div>
            )}
          </div>

          <Divider style={{ margin: '0' }} />

          {/* OK / Cancel buttons */}
          <div className="mc-action-buttons">
            <Button size="sm" appearance="subtle" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" appearance="primary" onClick={handleOK} disabled={count === 0}>
              OK
            </Button>
          </div>

        </div>
      )}
    </div>
  )
}