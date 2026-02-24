

// // import { useState } from 'react'
// // import { IconButton } from 'rsuite'
// // import ArrowLeftIcon  from '@rsuite/icons/ArrowLeft'
// // import ArrowRightIcon from '@rsuite/icons/ArrowRight'
// // import ArrowDownIcon  from '@rsuite/icons/ArrowDown'
// // import ArrowUpIcon    from '@rsuite/icons/ArrowUp'
// // import './MiniCalendar.css'

// // const DAYS   = ['Mo','Tu','We','Th','Fr','Sa','Su']
// // const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

// // function daysInMonth(y, m) { return new Date(y, m+1, 0).getDate() }
// // function firstDay(y, m)    { return new Date(y, m, 1).getDay() }

// // export default function MiniCalendar({ selectedDate, onDateSelect }) {
// //   const base = selectedDate ? new Date(selectedDate) : new Date()
// //   const [vy, setVy] = useState(base.getFullYear())
// //   const [vm, setVm] = useState(base.getMonth())
// //   const [expanded, setExpanded] = useState(false)

// //   const today = new Date()
// //   const dim  = daysInMonth(vy, vm)
// //   const fd   = (firstDay(vy, vm) + 6) % 7 // Monday start
// //   const prev = daysInMonth(vy, vm - 1)
// //   const sel  = selectedDate ? new Date(selectedDate) : null

// //   const cells = []
// //   for (let i = fd - 1; i >= 0; i--) cells.push({ day: prev - i, type: 'prev' })
// //   for (let d = 1; d <= dim; d++)     cells.push({ day: d, type: 'cur' })
// //   for (let d = 1; cells.length < 42; d++) cells.push({ day: d, type: 'next' })

// //   // Find today's week
// //   const todayIdx = cells.findIndex(c =>
// //     c.type === 'cur' &&
// //     c.day === today.getDate() &&
// //     vy === today.getFullYear() &&
// //     vm === today.getMonth()
// //   )
// //   const weekStart = todayIdx >= 0 ? Math.floor(todayIdx / 7) * 7 : 0
// //   const visibleCells = expanded ? cells : cells.slice(weekStart, weekStart + 7)

// //   const prevM = () => vm === 0 ? (setVm(11), setVy(y => y-1)) : setVm(m => m-1)
// //   const nextM = () => vm === 11 ? (setVm(0), setVy(y => y+1)) : setVm(m => m+1)

// //   const isSel = c => c.type==='cur' && sel && sel.getFullYear()===vy && sel.getMonth()===vm && sel.getDate()===c.day
// //   const isNow = c => c.type==='cur' && today.getFullYear()===vy && today.getMonth()===vm && today.getDate()===c.day

// //   return (
// //     <div className="mini-cal card">
// //       {/* Header */}
// //       <div className="mc-header">
// //         <div className="mc-left">
// //           <span className="mc-month">{MONTHS[vm]}</span>
// //           {expanded && <span className="mc-range">{MONTHS[vm].slice(0,3)} 1, {vy} to {MONTHS[vm].slice(0,3)} {dim}, {vy}</span>}
// //         </div>
// //         <div className="mc-nav">
// //           {expanded && <>
// //             <IconButton icon={<ArrowLeftIcon />}  size="xs" appearance="subtle" onClick={prevM} />
// //             <IconButton icon={<ArrowRightIcon />} size="xs" appearance="subtle" onClick={nextM} />
// //           </>}
// //           <IconButton
// //             icon={expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
// //             size="xs" appearance="subtle"
// //             onClick={() => setExpanded(e => !e)}
// //           />
// //         </div>
// //       </div>

// //       {/* Grid */}
// //       <div className="mc-grid">
// //         {DAYS.map(d => <div key={d} className="mc-dn">{d}</div>)}
// //         {visibleCells.map((c, i) => (
// //           <div key={i}
// //             className={['mc-cell', c.type!=='cur'?'mc-other':'', isNow(c)?'mc-today':'', isSel(c)?'mc-sel':''].join(' ')}
// //             onClick={() => c.type==='cur' && onDateSelect?.(new Date(vy, vm, c.day))}
// //           >{c.day}</div>
// //         ))}
// //       </div>
// //     </div>
// //   )
// // }
// import { useState } from 'react'
// import { IconButton } from 'rsuite'
// import ArrowLeftIcon  from '@rsuite/icons/ArrowLeft'
// import ArrowRightIcon from '@rsuite/icons/ArrowRight'
// import ArrowDownIcon  from '@rsuite/icons/ArrowDown'
// import ArrowUpIcon    from '@rsuite/icons/ArrowUp'
// import './MiniCalendar.css'

// const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// function getWeekDates(date) {
//   const d = new Date(date)
//   const day = d.getDay()
//   const diff = d.getDate() - day
//   const week = []
//   for (let i = 0; i < 7; i++) {
//     week.push(new Date(d.getFullYear(), d.getMonth(), diff + i))
//   }
//   return week
// }

// export default function MiniCalendar({ selectedDate, onDateSelect }) {
//   const [current, setCurrent] = useState(selectedDate ? new Date(selectedDate) : new Date())
//   const [expanded, setExpanded] = useState(false)

//   const today = new Date()
//   const weekDates = getWeekDates(current)

//   const prevWeek = () => {
//     const d = new Date(current)
//     d.setDate(d.getDate() - 7)
//     setCurrent(d)
//   }

//   const nextWeek = () => {
//     const d = new Date(current)
//     d.setDate(d.getDate() + 7)
//     setCurrent(d)
//   }

//   const isToday = (date) =>
//     date.getDate() === today.getDate() &&
//     date.getMonth() === today.getMonth() &&
//     date.getFullYear() === today.getFullYear()

//   const isSel = (date) =>
//     selectedDate &&
//     date.getDate() === new Date(selectedDate).getDate() &&
//     date.getMonth() === new Date(selectedDate).getMonth() &&
//     date.getFullYear() === new Date(selectedDate).getFullYear()

//   return (
//     <div className="mini-cal card">
//       {/* Top Row */}
//       <div className="mc-top">
//         <div className="mc-today-info">
//           <span className="mc-today-label">Today</span>
//           <span className="mc-today-date">
//             {today.getDate()} {today.toLocaleString('default', { weekday: 'long' })}
//           </span>
//         </div>
//         <div className="mc-nav-arrows">
//           <IconButton icon={<ArrowLeftIcon />}  size="xs" appearance="subtle" onClick={prevWeek} />
//           <IconButton icon={<ArrowRightIcon />} size="xs" appearance="subtle" onClick={nextWeek} />
//           <IconButton
//             icon={expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
//             size="xs" appearance="subtle"
//             onClick={() => setExpanded(e => !e)}
//           />
//         </div>
//       </div>

//       {/* Week Row */}
//       <div className="mc-week-grid">
//         {weekDates.map((date, i) => (
//           <div
//             key={i}
//             className={[
//               'mc-week-cell',
//               isToday(date) ? 'mc-today' : '',
//               isSel(date) ? 'mc-sel' : ''
//             ].join(' ')}
//             onClick={() => { setCurrent(date); onDateSelect?.(date) }}
//           >
//             <span className="mc-dn">{DAYS[date.getDay()]}</span>
//             <span className="mc-day">{date.getDate()}</span>
//           </div>
//         ))}
//       </div>

//       {/* Expanded Month Label */}
//       {expanded && (
//         <div className="mc-full-nav">
//           <span className="mc-month-label">
//             {current.toLocaleString('default', { month: 'long', year: 'numeric' })}
//           </span>
//         </div>
//       )}
//     </div>
//   )
// }

import { useState } from 'react'
import { IconButton, Calendar } from 'rsuite'
import ArrowLeftIcon from '@rsuite/icons/ArrowLeft'
import ArrowRightIcon from '@rsuite/icons/ArrowRight'
import ArrowDownIcon from '@rsuite/icons/ArrowDown'
import ArrowUpIcon from '@rsuite/icons/ArrowUp'
import './MiniCalendar.css'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeekDates(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  const week = []
  for (let i = 0; i < 7; i++) {
    week.push(new Date(d.getFullYear(), d.getMonth(), diff + i))
  }
  return week
}

export default function MiniCalendar({ selectedDate, onDateSelect }) {
  const [current, setCurrent] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  )
  const [expanded, setExpanded] = useState(false)

  const today = new Date()
  const weekDates = getWeekDates(current)

  const prevWeek = () => {
    const d = new Date(current)
    d.setDate(d.getDate() - 7)
    setCurrent(d)
  }

  const nextWeek = () => {
    const d = new Date(current)
    d.setDate(d.getDate() + 7)
    setCurrent(d)
  }

  const isToday = (date) =>
    date.toDateString() === today.toDateString()

  const isSel = (date) =>
    selectedDate &&
    date.toDateString() === new Date(selectedDate).toDateString()

  return (
    <div className="mini-cal">
      {/* Top Section */}
      <div className="mc-top">
        <div className="mc-today-info">
          <span className="mc-today-label">Today</span>
          <span className="mc-today-date">
            {today.getDate()} {today.toLocaleString('default', { weekday: 'long' })}
          </span>
        </div>

        <div className="mc-nav-arrows">
          <IconButton
            icon={<ArrowLeftIcon />}
            size="xs"
            appearance="subtle"
            onClick={prevWeek}
          />
          <IconButton
            icon={<ArrowRightIcon />}
            size="xs"
            appearance="subtle"
            onClick={nextWeek}
          />
          <IconButton
            icon={expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
            size="xs"
            appearance="subtle"
            onClick={() => setExpanded(e => !e)}
          />
        </div>
      </div>

      {/* Week Row */}
      <div className="mc-week-grid">
        {weekDates.map((date, i) => (
          <div
            key={i}
            className={[
              'mc-week-cell',
              isToday(date) ? 'mc-today' : '',
              isSel(date) ? 'mc-sel' : ''
            ].join(' ')}
            onClick={() => {
              setCurrent(date)
              onDateSelect?.(date)
            }}
          >
            <span className="mc-dn">{DAYS[date.getDay()]}</span>
            <span className="mc-day">{date.getDate()}</span>
          </div>
        ))}
      </div>

      {/* Expanded Full Calendar */}
      {expanded && (
        <div className="mc-full-calendar">
          <Calendar
            value={current}
            onChange={(date) => {
              setCurrent(date)
              onDateSelect?.(date)
            }}
          />
        </div>
      )}
    </div>
  )
}