import { NavLink } from 'react-router-dom'
import DashboardIcon  from '@rsuite/icons/Dashboard'
import LocationIcon   from '@rsuite/icons/Location'
import DetailIcon     from '@rsuite/icons/Detail'
import CalendarIcon   from '@rsuite/icons/Calendar'
import SettingIcon    from '@rsuite/icons/Setting'
import './Sidebar.css'

const NAV = [
  { to: '/dashboard', label: 'Dashboard',    Icon: DashboardIcon },
   { to: '/schedule',  label: 'Schedule',      Icon: CalendarIcon  },
  { to: '/attendance',      label: 'Live Tracking', Icon: LocationIcon  },
  { to: '/reports',   label: 'Reports',       Icon: DetailIcon    },

]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <div className="sb-logo-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="14" y2="18"/>
          </svg>
        </div>
      </div>
      <nav className="sb-nav">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sb-item${isActive ? ' active' : ''}`}
          >
            <Icon className="sb-icon" />
            <span className="sb-tip">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}