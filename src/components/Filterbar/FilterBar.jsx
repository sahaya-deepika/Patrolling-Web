// import { createContext, useContext, useState } from 'react'
// import { ButtonGroup, Button, DatePicker, IconButton } from 'rsuite'
// import CalendarIcon from '@rsuite/icons/Calendar'
// import RefreshIcon from '@rsuite/icons/Reload'
// import './FilterBar.css'

// const UNITS = ['All', 'Unit 1', 'Unit 2', 'Unit 3']
// const SHIFTS = ['Shift 1', 'Shift 2']

// // ── Context ────────────────────────────────────────────────────────────────
// const FilterContext = createContext(null)

// export function FilterProvider({ children }) {
//   const [unit, setUnit] = useState('All')
//   const [shift, setShift] = useState('Shift 1')
//   const [date, setDate] = useState(new Date(2025, 1, 20))

//   return (
//     <FilterContext.Provider value={{ unit, setUnit, shift, setShift, date, setDate }}>
//       {children}
//     </FilterContext.Provider>
//   )
// }

// export function useFilter() {
//   const ctx = useContext(FilterContext)
//   if (!ctx) throw new Error('useFilter must be used inside FilterProvider')
//   return ctx
// }

// // ── Component ──────────────────────────────────────────────────────────────
// export default function FilterBar({
//   autoRefresh = false,
//   setAutoRefresh = () => { },
//   showAutoRefresh = false,
// }) {
//   const { unit, setUnit, shift, setShift, date, setDate } = useFilter()

//   return (
//     <div className="filter-bar">
//       <div className="fb-left">
//         <ButtonGroup>
//           {UNITS.map(u => (
//             <Button
//               key={u}
//               size="sm"
//               appearance={unit === u ? 'primary' : 'subtle'}
//               style={
//                 unit === u
//                   ? { background: 'var(--accent)', color: '#fff', borderRadius: 16, fontWeight: 600 }
//                   : { borderRadius: 16 }
//               }
//               onClick={() => setUnit(u)}
//             >
//               {u}
//             </Button>
//           ))}
//         </ButtonGroup>
//       </div>

//       <div className="fb-right">
//         <ButtonGroup>
//           {SHIFTS.map(s => (
//             <Button
//               key={s}
//               size="sm"
//               style={
//                 shift === s
//                   ? { background: '#1b2f4e', color: '#fff', borderRadius: 16, fontWeight: 600, border: 'none' }
//                   : { borderRadius: 16, color: 'var(--t2)' }
//               }
//               onClick={() => setShift(s)}
//             >
//               {s}
//             </Button>
//           ))}
//         </ButtonGroup>

//         {showAutoRefresh && (
//           <IconButton
//             icon={<RefreshIcon />}
//             circle
//             size="sm"
//             className={`refresh-btn ${autoRefresh ? 'active' : ''}`}
//             title={autoRefresh ? 'Auto-Refresh: ON (2s)' : 'Auto-Refresh: OFF'}
//             onClick={() => setAutoRefresh(!autoRefresh)}
//           />
//         )}

//         <DatePicker
//           value={date}
//           onChange={v => v && setDate(new Date(v.getFullYear(), v.getMonth(), v.getDate()))}
//           format="dd MMM yyyy"
//           placement="bottomEnd"
//           cleanable={false}
//           caretAs={CalendarIcon}
//           size="sm"
//           oneTap
//           style={{ minWidth: 135 }}
//         />
//       </div>
//     </div>
//   )
// }



import { createContext, useContext, useState } from 'react'
import { ButtonGroup, Button, DatePicker, IconButton } from 'rsuite'
import CalendarIcon from '@rsuite/icons/Calendar'
import RefreshIcon from '@rsuite/icons/Reload'
import './FilterBar.css'

const UNITS = ['All', 'Unit 1', 'Unit 2', 'Unit 3']

// ── Context ────────────────────────────────────────────────────────────────
const FilterContext = createContext(null)

export function FilterProvider({ children }) {
  const [unit, setUnit] = useState('All')
  const [date, setDate] = useState(new Date(2025, 1, 20))   // global date — Dashboard only

  return (
    <FilterContext.Provider value={{ unit, setUnit, date, setDate }}>

      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilter must be used inside FilterProvider')
  return ctx
}

// ── Component ──────────────────────────────────────────────────────────────
/**
 * Props
 *  showDate        – show the date picker (default: false)
 *                    Pass `true` ONLY on the Dashboard page.
 *  showAutoRefresh – show the auto-refresh toggle (default: false)
 *  autoRefresh     – current auto-refresh state
 *  setAutoRefresh  – setter for auto-refresh state
 */
export default function FilterBar({
  showDate        = false,
  autoRefresh     = false,
  setAutoRefresh  = () => {},
  showAutoRefresh = false,
}) {
  const { unit, setUnit, date, setDate } = useFilter()

  return (
    <div className="filter-bar">
      <div className="fb-left">
        <ButtonGroup>
          {UNITS.map(u => (
            <Button
              key={u}
              size="sm"
              appearance={unit === u ? 'primary' : 'subtle'}
              style={
                unit === u
                  ? { background: 'var(--accent)', color: '#fff', borderRadius: 16, fontWeight: 600 }
                  : { borderRadius: 16 }
              }
              onClick={() => setUnit(u)}
            >
              {u}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div className="fb-right">
        {showAutoRefresh && (
          <IconButton
            icon={<RefreshIcon />}
            circle
            size="sm"
            className={`refresh-btn ${autoRefresh ? 'active' : ''}`}
            title={autoRefresh ? 'Auto-Refresh: ON (2s)' : 'Auto-Refresh: OFF'}
            onClick={() => setAutoRefresh(!autoRefresh)}
          />
        )}

        {showDate && (
          <DatePicker
            value={date}
            onChange={v => v && setDate(new Date(v.getFullYear(), v.getMonth(), v.getDate()))}
            format="dd MMM yyyy"
            placement="bottomEnd"
            cleanable={false}
            caretAs={CalendarIcon}
            size="sm"
            oneTap
            style={{ minWidth: 135 }}
          />
        )}
      </div>
    </div>
  )
}