
import { ButtonGroup, Button, DatePicker } from 'rsuite'
import CalendarIcon from '@rsuite/icons/Calendar'
import './FilterBar.css'

const UNITS  = ['All', 'Unit 1', 'Unit 2', 'Unit 3']
const SHIFTS = ['Shift 1', 'Shift 2']

export default function FilterBar({ unit, setUnit, shift, setShift, date, setDate }) {
  return (
    <div className="filter-bar">
      <div className="fb-left">
        <ButtonGroup>
          {UNITS.map(u => (
            <Button key={u} size="sm"
              appearance={unit === u ? 'primary' : 'subtle'}
              style={unit === u ? { background: 'var(--accent)', color: '#fff', borderRadius: 16, fontWeight: 600 } : { borderRadius: 16 }}
              onClick={() => setUnit(u)}>{u}</Button>
          ))}
        </ButtonGroup>
      </div>
      <div className="fb-right">
        <ButtonGroup>
          {SHIFTS.map(s => (
            <Button key={s} size="sm"
              style={shift === s
                ? { background: '#1b2f4e', color: '#fff', borderRadius: 16, fontWeight: 600, border: 'none' }
                : { borderRadius: 16, color: 'var(--t2)' }}
              onClick={() => setShift(s)}>{s}</Button>
          ))}
        </ButtonGroup>
        <DatePicker
          value={date} onChange={v => v && setDate(new Date(v.getFullYear(), v.getMonth(), v.getDate()))}
          format="dd MMM yyyy" placement="bottomEnd" cleanable={false}
          caretAs={CalendarIcon} size="sm" oneTap
          style={{ minWidth: 135 }}
        />
      </div>
    </div>
  )
}