import { useState } from 'react'
import ArrowLeftIcon  from '@rsuite/icons/ArrowLeft'
import ArrowRightIcon from '@rsuite/icons/ArrowRight'
import './MiniCalendar.css'

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay()
}

export default function MiniCalendar({ selectedDate, onDateSelect }) {
  const today = selectedDate ? new Date(selectedDate) : new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay    = getFirstDay(viewYear, viewMonth)
  const daysInPrev  = getDaysInMonth(viewYear, viewMonth - 1)

  const selected = selectedDate ? new Date(selectedDate) : null

  const cells = []
  // Prev month filler
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, type: 'prev' })
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: 'cur' })
  }
  // Next month filler
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, type: 'next' })
  }

  const handlePrev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const handleNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const handleClick = (cell) => {
    if (cell.type !== 'cur') return
    const d = new Date(viewYear, viewMonth, cell.day)
    onDateSelect?.(d)
  }

  const isSelected = (cell) => {
    if (cell.type !== 'cur' || !selected) return false
    return selected.getFullYear() === viewYear &&
           selected.getMonth()    === viewMonth &&
           selected.getDate()     === cell.day
  }

  const isToday = (cell) => {
    if (cell.type !== 'cur') return false
    const t = new Date()
    return t.getFullYear() === viewYear &&
           t.getMonth()    === viewMonth &&
           t.getDate()     === cell.day
  }

  // Range label — first and last of month
  const rangeStart = `${MONTHS[viewMonth].slice(0,3)} 1, ${viewYear}`
  const rangeEnd   = `${MONTHS[viewMonth].slice(0,3)} ${daysInMonth}, ${viewYear}`

  return (
    <div className="mini-cal">
      <div className="mc-header">
        <div className="mc-month-label">
          <span className="mc-month">{MONTHS[viewMonth]}</span>
          <span className="mc-range">{rangeStart} to {rangeEnd}</span>
        </div>
        <div className="mc-nav">
          <button className="mc-nav-btn" onClick={handlePrev}><ArrowLeftIcon /></button>
          <button className="mc-nav-btn" onClick={handleNext}><ArrowRightIcon /></button>
        </div>
      </div>

      <div className="mc-grid">
        {DAYS.map(d => (
          <div key={d} className="mc-day-name">{d}</div>
        ))}
        {cells.map((cell, i) => (
          <div
            key={i}
            className={[
              'mc-cell',
              cell.type !== 'cur' ? 'mc-other'    : '',
              isToday(cell)       ? 'mc-today'    : '',
              isSelected(cell)    ? 'mc-selected' : '',
            ].join(' ')}
            onClick={() => handleClick(cell)}
          >
            {cell.day}
          </div>
        ))}
      </div>
    </div>
  )
}