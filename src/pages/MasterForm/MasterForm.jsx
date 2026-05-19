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

const TABS = [
  { key: 'schedule', label: 'Schedule', icon: <CalendarIcon />,   Component: ScheduleForm },
  { key: 'user',     label: 'User',     icon: <PeopleFillIcon />, Component: UserForm     },
  { key: 'trip',     label: 'Trip',     icon: <ArrowRightIcon />, Component: TripForm     },
  { key: 'task',     label: 'Task',     icon: <TaskIcon />,       Component: TaskForm     },
  { key: 'location', label: 'Location', icon: <LocationIcon />,   Component: LocationForm },
  { key: 'others',   label: 'Others',   icon: <MoreIcon />,       Component: OthersForm   },
]

export default function MasterForm() {
  const [active, setActive] = useState('schedule')
  const [othersSubTab, setOthersSubTab] = useState('zone')

  useEffect(() => {
    const handler = (event) => {
      const detail = event.detail || {}
      if (!detail.tab) return
      setActive(detail.tab)
      if (detail.tab === 'others' && detail.section) {
        setOthersSubTab(detail.section)
      }
    }

    window.addEventListener('openMasterFormTab', handler)
    return () => window.removeEventListener('openMasterFormTab', handler)
  }, [])

  const ActiveComp = TABS.find((t) => t.key === active)?.Component ?? ScheduleForm

  return (
    <div className="gf-page">
      <div className="gf-card">
        
        {/* ═══ SINGLE NAVIGATION ROW - Pill/Button Style ═══ */}
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
        <div className="gf-panel-area">
          <ActiveComp initialActive={active === 'others' ? othersSubTab : undefined} />
        </div>
      </div>
    </div>
  )
}