

import { useState } from 'react'
import { Nav } from 'rsuite'
import CalendarIcon   from '@rsuite/icons/Calendar'
import PeopleFillIcon from '@rsuite/icons/Member'
import ArrowRightIcon from '@rsuite/icons/ArrowRight'
import TaskIcon       from '@rsuite/icons/Task'
import LocationIcon   from '@rsuite/icons/Location'

import ScheduleForm from './forms/ScheduleForm'
import UserForm     from './forms/UserForm'
import TripForm     from './forms/TripForm'
import TaskForm     from './forms/TaskForm'
import LocationForm from './forms/LocationForm'
import './MasterForm.css'

const TABS = [
  { key:'schedule', label:'Schedule', icon:<CalendarIcon />,  Component: ScheduleForm },
  { key:'user',     label:'User',     icon:<PeopleFillIcon />, Component: UserForm     },
  { key:'trip',     label:'Trip',     icon:<ArrowRightIcon />, Component: TripForm     },
  { key:'task',     label:'task',     icon:<TaskIcon />,       Component: TaskForm     },
  { key:'location', label:'Location', icon:<LocationIcon />,   Component: LocationForm },
]

export default function MasterForm() {
  const [active, setActive] = useState('schedule')
  const ActiveComp = TABS.find(t => t.key === active)?.Component ?? ScheduleForm

  return (
    <div className="mf-page">
      <div className="mf-card">
        <Nav appearance="tabs" activeKey={active} onSelect={setActive} className="mf-nav">
          {TABS.map(({ key, label, icon }) => (
            <Nav.Item key={key} eventKey={key} icon={icon}>{label}</Nav.Item>
          ))}
        </Nav>
        <div className="mf-panel-area">
          <ActiveComp />
        </div>
      </div>
    </div>
  )
}