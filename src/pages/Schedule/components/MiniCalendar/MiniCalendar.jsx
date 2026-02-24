import { useState, useRef, useEffect } from 'react'
import { IconButton, Calendar } from 'rsuite'
import ArrowLeftIcon  from '@rsuite/icons/ArrowLeft'
import ArrowRightIcon from '@rsuite/icons/ArrowRight'
import ArrowDownIcon  from '@rsuite/icons/ArrowDown'
import ArrowUpIcon    from '@rsuite/icons/ArrowUp'
import './MiniCalendar.css'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeekDates(date) {
  const d = new Date(date)
  const diff = d.getDate() - d.getDay()
  return Array.from({ length: 7 }, (_, i) =>
    new Date(d.getFullYear(), d.getMonth(), diff + i)
  )
}

export default function MiniCalendar({ selectedDate, onDateSelect }) {
  const [current,  setCurrent]  = useState(selectedDate ? new Date(selectedDate) : new Date())
  const [expanded, setExpanded] = useState(false)
  const wrapRef = useRef(null)

  const today     = new Date()
  const weekDates = getWeekDates(current)

  // Close on outside click
  useEffect(() => {
    if (!expanded) return
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setExpanded(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [expanded])

  const prevWeek = () => { const d = new Date(current); d.setDate(d.getDate() - 7); setCurrent(d) }
  const nextWeek = () => { const d = new Date(current); d.setDate(d.getDate() + 7); setCurrent(d) }

  const isToday = d => d.toDateString() === today.toDateString()
  const isSel   = d => selectedDate && d.toDateString() === new Date(selectedDate).toDateString()

  const handleDatePick = (date) => {
    setCurrent(date)
    onDateSelect?.(date)
    setExpanded(false)   // ← auto-close on date pick
  }

  return (
    <div className="mini-cal" ref={wrapRef}>

      {/* Top row */}
      <div className="mc-top">
        <div className="mc-today-info">
          <span className="mc-today-label">Today</span>
          <span className="mc-today-date">
            {today.getDate()} {today.toLocaleString('default', { weekday: 'long' })}
          </span>
        </div>
        <div className="mc-nav-arrows">
          <IconButton icon={<ArrowLeftIcon />}  size="xs" appearance="subtle" onClick={prevWeek} />
          <IconButton icon={<ArrowRightIcon />} size="xs" appearance="subtle" onClick={nextWeek} />
          <IconButton
            icon={expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
            size="xs"
            appearance="subtle"
            onClick={() => setExpanded(e => !e)}
          />
        </div>
      </div>

      {/* Week strip */}
      <div className="mc-week-grid">
        {weekDates.map((date, i) => (
          <div
            key={i}
            className={['mc-week-cell', isToday(date) ? 'mc-today' : '', isSel(date) ? 'mc-sel' : ''].join(' ')}
            onClick={() => handleDatePick(date)}
          >
            <span className="mc-dn">{DAYS[date.getDay()]}</span>
            <span className="mc-day">{date.getDate()}</span>
          </div>
        ))}
      </div>

      {/* Expanded calendar — absolutely positioned so it floats over content below */}
      {expanded && (
        <div className="mc-full-calendar">
          <Calendar
            compact
            value={current}
            onChange={handleDatePick}
          />
        </div>
      )}

    </div>
  )
}