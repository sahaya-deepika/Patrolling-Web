import { NavLink } from 'react-router-dom'
import { FiMenu, FiGrid, FiClock, FiClipboard, FiMapPin, FiSettings } from 'react-icons/fi'
import './Sidebar.css'

const NAV = [
  { to: '/dashboard',  label: 'Dashboard',  Icon: FiGrid      },
  { to: '/schedule',   label: 'Schedule',   Icon: FiClock     },
  { to: '/attendance', label: 'Attendance', Icon: FiClipboard },
  { to: '/reports',    label: 'Forms',Icon: FiMapPin    },
  { to: '/settings',   label: 'Settings',   Icon: FiSettings  },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Hamburger */}
      <div className="sb-top">
        <button className="sb-toggle">
          <FiMenu style={{ fontSize: 20 }} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="sb-nav">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            style={{ textDecoration: 'none' }}
            className={({ isActive }) => `sb-item${isActive ? ' active' : ''}`}
          >
            <Icon className="sb-icon" size={20} />
            <span className="sb-label">{label}</span>
          </NavLink>
        ))}
      </nav>

    </aside>
  )
}