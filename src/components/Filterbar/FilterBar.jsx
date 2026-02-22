import { DatePicker } from 'rsuite'
import CalendarIcon from '@rsuite/icons/Calendar'
import "./FilterBar.css"

const UNITS  = ['All', 'Unit 1', 'Unit 2', 'Unit 3']
const SHIFTS = ['Shift 1', 'Shift 2']

export default function FilterBar({ unit, setUnit, shift, setShift, date, setDate }) {

  const handleDateChange = (val) => {
    if (!val) return
    const picked = new Date(val)
    setDate(new Date(picked.getFullYear(), picked.getMonth(), picked.getDate()))
  }

  const dateStr = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    : ''

  return (
    <div className="filter-bar">
      {/* LEFT — Unit + filter pill */}
      <div className="fb-left">
        <div className="unit-group">
          {UNITS.map(u => (
            <button
              key={u}
              className={`unit-btn${unit === u ? ' active' : ''}`}
              onClick={() => setUnit(u)}
            >
              {u}
            </button>
          ))}
        </div>

        <span className="filter-pill">
          {unit} · {shift} · {dateStr}
        </span>
      </div>

      {/* RIGHT — Shift + Date */}
      <div className="fb-right">
        <div className="shift-group">
          {SHIFTS.map(s => (
            <button
              key={s}
              className={`shift-btn${shift === s ? ' active' : ''}`}
              onClick={() => setShift(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <DatePicker
          value={date}
          onChange={handleDateChange}
          format="dd MMM yyyy"
          placement="bottomEnd"
          cleanable={false}
          caretAs={CalendarIcon}
          size="sm"
          className="dash-date-picker"
          oneTap
        />
      </div>
    </div>
  )
}