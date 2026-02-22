// src/pages/MasterForm/MasterForm.jsx
import React, { useState } from 'react'
import { Icons } from './components/MasterFormUI'

import ScheduleForm from './forms/ScheduleForm'
import UserForm     from './forms/UserForm'
import TripForm     from './forms/TripForm'
import TaskForm     from './forms/TaskForm'
import LocationForm from './forms/LocationForm'

import './MasterForm.css'

const TABS = [
  { key: 'schedule', label: 'Schedule', icon: 'Schedule',  Component: ScheduleForm },
  { key: 'user',     label: 'User',     icon: 'People',    Component: UserForm     },
  { key: 'trip',     label: 'Trip',     icon: 'ArrowRight', Component: TripForm    },
  { key: 'task',     label: 'task',     icon: 'Task',      Component: TaskForm     },
  { key: 'location', label: 'Location', icon: 'Location',  Component: LocationForm },
]

export default function MasterForm() {
  const [activeTab, setActiveTab] = useState('schedule')
  const ActiveComponent = TABS.find(t => t.key === activeTab)?.Component ?? ScheduleForm

  return (
    <div className="mf-page">
      <div className="mf-title-bar">
        <h2>trip details</h2>
      </div>

      <div className="mf-card">
        {/* Top Bar */}
        <div className="mf-topbar">
          <div className="mf-company-badge">Company</div>
          <div className="mf-topbar-actions">
            <div className="mf-bell-wrap">
              <Icons.Bell />
              <span className="mf-bell-dot" />
            </div>
            <div className="mf-avatar">K</div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="mf-tabbar">
          {TABS.map(({ key, label, icon }) => {
            const IconComp = Icons[icon]
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`mf-tab-btn ${activeTab === key ? 'active' : ''}`}
              >
                {IconComp && <IconComp />}
                {label}
              </button>
            )
          })}
        </div>

        {/* Active Form */}
        <div className="mf-panel-area">
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}