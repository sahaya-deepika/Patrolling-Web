// import { useState, useEffect } from 'react'
// import CalendarIcon   from '@rsuite/icons/Calendar'
// import PeopleFillIcon from '@rsuite/icons/Member'
// import ArrowRightIcon from '@rsuite/icons/ArrowRight'
// import TaskIcon       from '@rsuite/icons/Task'
// import LocationIcon   from '@rsuite/icons/Location'
// import MoreIcon       from '@rsuite/icons/More'

// import ScheduleForm from './forms/ScheduleForm'
// import UserForm     from './forms/UserForm'
// import TripForm     from './forms/TripForm'
// import TaskForm     from './forms/TaskForm'
// import LocationForm from './forms/LocationForm'
// import OthersForm   from './forms/OthersForm'
// import './MasterForm.css'

// const TABS = [
//   { key: 'schedule', label: 'Schedule', icon: <CalendarIcon />,   Component: ScheduleForm },
//   { key: 'user',     label: 'User',     icon: <PeopleFillIcon />, Component: UserForm     },
//   { key: 'trip',     label: 'Trip',     icon: <ArrowRightIcon />, Component: TripForm     },
//   { key: 'task',     label: 'Task',     icon: <TaskIcon />,       Component: TaskForm     },
//   { key: 'location', label: 'Location', icon: <LocationIcon />,   Component: LocationForm },
//   { key: 'others',   label: 'Others',   icon: <MoreIcon />,       Component: OthersForm   },
// ]

// export default function MasterForm() {
//   const [active, setActive] = useState('schedule')
//   const [othersSubTab, setOthersSubTab] = useState('zone')

//   useEffect(() => {
//     const handler = (event) => {
//       const detail = event.detail || {}
//       if (!detail.tab) return
//       setActive(detail.tab)
//       if (detail.tab === 'others' && detail.section) {
//         setOthersSubTab(detail.section)
//       }
//     }

//     window.addEventListener('openMasterFormTab', handler)
//     return () => window.removeEventListener('openMasterFormTab', handler)
//   }, [])

//   const ActiveComp = TABS.find((t) => t.key === active)?.Component ?? ScheduleForm

//   return (
//     <div className="gf-page">
//       <div className="gf-card">
        
//         {/* ═══ SINGLE NAVIGATION ROW - Pill/Button Style ═══ */}
//         <div className="gf-nav">
//           {TABS.map(({ key, label, icon }) => (
//             <button
//               key={key}
//               className={`gf-nav-item ${active === key ? 'active' : ''}`}
//               onClick={() => setActive(key)}
//             >
//               <span className="gf-nav-icon">{icon}</span>
//               <span className="gf-nav-label">{label}</span>
//             </button>
//           ))}
//         </div>

//         {/* ═══ FORM CONTENT AREA ═══ */}
//         <div className="gf-panel-area">
//           <ActiveComp initialActive={active === 'others' ? othersSubTab : undefined} />
//         </div>
//       </div>
//     </div>
//   )
// }

import { useState, useEffect } from 'react'
import CalendarIcon   from '@rsuite/icons/Calendar'
import PeopleFillIcon from '@rsuite/icons/Member'
import ArrowRightIcon from '@rsuite/icons/ArrowRight'
import TaskIcon       from '@rsuite/icons/Task'
import LocationIcon   from '@rsuite/icons/Location'
import MoreIcon       from '@rsuite/icons/More'

import ScheduleForm from './forms/ScheduleForm'
import UserForm     from './forms/UserForm'
import TripForm     from './forms/TripForm'
import TaskForm     from './forms/TaskForm'
import LocationForm from './forms/LocationForm'
import OthersForm   from './forms/OthersForm'
import './MasterForm.css'

/* ═══════════════════════════════════════════════════════════
   SUB-TAB DEFINITIONS per main tab
   Each entry: { key, label, icon, Component, subTabs[] }
   subTabs: array of { key, label, icon }
   If only one subTab → no sub-tab bar rendered (single section)
═══════════════════════════════════════════════════════════ */
const TABS = [
  {
    key: 'schedule',
    label: 'Schedule',
    icon: <CalendarIcon />,
    Component: ScheduleForm,
    subTabs: [
      { key: 'schedule', label: 'Schedule', icon: '📅' },
    ],
  },
  {
    key: 'user',
    label: 'User',
    icon: <PeopleFillIcon />,
    Component: UserForm,
    subTabs: [
      { key: 'user', label: 'Users', icon: '👤' },
    ],
  },
  {
    key: 'trip',
    label: 'Trip',
    icon: <ArrowRightIcon />,
    Component: TripForm,
    subTabs: [
      { key: 'trip', label: 'Trips', icon: '🛣️' },
    ],
  },
  {
    key: 'task',
    label: 'Task',
    icon: <TaskIcon />,
    Component: TaskForm,
    subTabs: [
      { key: 'task', label: 'Tasks', icon: '✅' },
    ],
  },
  {
    key: 'location',
    label: 'Location',
    icon: <LocationIcon />,
    Component: LocationForm,
    subTabs: [
      { key: 'location', label: 'Locations', icon: '📍' },
    ],
  },
  {
    key: 'others',
    label: 'Others',
    icon: <MoreIcon />,
    Component: OthersForm,
    subTabs: [
      { key: 'zone',        label: 'Zones',        icon: '🗺' },
      { key: 'patroltype',  label: 'Patrol Types',  icon: '🔖' },
      { key: 'designation', label: 'Designations',  icon: '🏷' },
      { key: 'department',  label: 'Departments',   icon: '🏢' },
    ],
  },
]

/* ═══════════════════════════════════════════════════════════
   Sub-tab bar — same visual style as OthersForm's internal bar
═══════════════════════════════════════════════════════════ */
function SubTabBar({ subTabs, activeSubTab, onSelect }) {
  if (!subTabs || subTabs.length <= 1) return null

  return (
    <div style={{
      display: 'flex',
      gap: '6px',
      padding: '10px 16px',
      borderBottom: '1px solid #e8eaed',
      background: '#fafbfc',
      flexShrink: 0,
      flexWrap: 'wrap',
    }}>
      {subTabs.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            borderRadius: '6px',
            border: activeSubTab === key ? 'none' : '1px solid #dadce0',
            background: activeSubTab === key ? '#1a73e8' : '#fff',
            color: activeSubTab === key ? '#fff' : '#5f6368',
            fontSize: '12px',
            fontWeight: activeSubTab === key ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <span style={{ fontSize: '13px' }}>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MASTER FORM
═══════════════════════════════════════════════════════════ */
export default function MasterForm() {
  const [active, setActive]         = useState('schedule')
  const [subTabMap, setSubTabMap]   = useState(() =>
    Object.fromEntries(TABS.map(t => [t.key, t.subTabs[0]?.key]))
  )

  /* Listen for external tab-jump events (same as before) */
  useEffect(() => {
    const handler = (event) => {
      const detail = event.detail || {}
      if (!detail.tab) return
      setActive(detail.tab)
      if (detail.section) {
        setSubTabMap(prev => ({ ...prev, [detail.tab]: detail.section }))
      }
    }
    window.addEventListener('openMasterFormTab', handler)
    return () => window.removeEventListener('openMasterFormTab', handler)
  }, [])

  const activeTab    = TABS.find(t => t.key === active) ?? TABS[0]
  const activeSubTab = subTabMap[active] ?? activeTab.subTabs[0]?.key

  const setSubTab = (tabKey, subKey) =>
    setSubTabMap(prev => ({ ...prev, [tabKey]: subKey }))

  const ActiveComp = activeTab.Component

  return (
    <div className="gf-page">
      <div className="gf-card">

        {/* ═══ MAIN NAVIGATION ROW ═══ */}
        <div className="gf-nav">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`gf-nav-item ${active === key ? 'active' : ''}`}
              onClick={() => setActive(key)}
            >
              <span className="gf-nav-icon">{icon}</span>
              <span className="gf-nav-label">{label}</span>
            </button>
          ))}
        </div>

        {/* ═══ FORM CONTENT AREA ═══ */}
        <div className="gf-panel-area" style={{ flexDirection: 'column' }}>

          {/* Sub-tab bar — only shown when a tab has multiple sub-tabs */}
          <SubTabBar
            subTabs={activeTab.subTabs}
            activeSubTab={activeSubTab}
            onSelect={(subKey) => setSubTab(active, subKey)}
          />

          {/* Active form — passes initialActive for OthersForm compatibility */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <ActiveComp
              initialActive={
                active === 'others' ? activeSubTab : undefined
              }
            />
          </div>
        </div>

      </div>
    </div>
  )
}