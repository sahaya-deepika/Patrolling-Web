

import { NavLink } from 'react-router-dom'
import DashboardIcon  from '@rsuite/icons/Dashboard'
import CalendarIcon   from '@rsuite/icons/Calendar'
import LocationIcon   from '@rsuite/icons/Location'
import DetailIcon     from '@rsuite/icons/Detail'
import SettingIcon    from '@rsuite/icons/Setting'
import MenuIcon       from '@rsuite/icons/Menu'
import CloseIcon      from '@rsuite/icons/Close'
import './Sidebar.css'

const NAV = [
  { to: '/dashboard',  label: 'Dashboard',   Icon: DashboardIcon },
  { to: '/schedule',   label: 'Schedule',    Icon: CalendarIcon  },
  { to: '/attendance', label: 'Attendance',  Icon: LocationIcon  },
  { to: '/reports',    label: 'Master Form', Icon: DetailIcon    },
  { to: '/settings',   label: 'Settings',    Icon: SettingIcon   },
]

export default function Sidebar({ open, onToggle }) {
  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sb-top">
        
        <button className="sb-toggle" onClick={onToggle}>
          {open
            ? <CloseIcon style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />
            : <MenuIcon  style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />}
        </button>
      </div>
      <nav className="sb-nav">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sb-item${isActive ? ' active' : ''}`}
          >
            <Icon className="sb-icon" />
            {open && <span className="sb-label">{label}</span>}
            {!open && <span className="sb-tip">{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}