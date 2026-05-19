import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { CustomProvider } from 'rsuite'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { FilterProvider } from './components/FilterBar/FilterBar'
import Sidebar     from './components/Sidebar/Sidebar'
import Header      from './components/Header/Header'
import Dashboard   from './pages/Dashboard/Dashboard/Dashboard'
import Schedule    from './pages/Schedule/Schedule'
import TripDetails from './pages/TripDetails/TripDetails'
import Attendance  from './pages/Attendance/Attendance'
import MasterForm  from './pages/MasterForm/MasterForm'
import Login       from './pages/Login/Login'
import './App.css'

// ── Single source of truth for the token key ──
const TOKEN_KEY = 'accessToken'

// ── Validate token: exists + not expired (handles both JWT and plain API keys) ──
function isTokenValid() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token || !token.trim()) return false

  // Only attempt JWT decode if it looks like a JWT (3 dot-separated parts)
  const isJwt = token.split('.').length === 3
  if (!isJwt) {
    // Plain API key — just check it exists (non-empty)
    return true
  }

  // JWT path — check expiry if present
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      localStorage.removeItem(TOKEN_KEY)
      return false
    }
    return true
  } catch {
    // Malformed JWT — clear it
    localStorage.removeItem(TOKEN_KEY)
    return false
  }
}

function AppShell() {
  const { theme } = useTheme()
  const [sbOpen, setSbOpen] = useState(false)

  const [isAuthenticated, setIsAuthenticated] = useState(() => isTokenValid())

  const handleLoginSuccess = () => setIsAuthenticated(true)

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <CustomProvider theme={theme}>
      <FilterProvider>
        <div className={`app-shell${sbOpen ? ' sb-open' : ''}`} data-theme={theme}>
          <Sidebar open={sbOpen} onToggle={() => setSbOpen(o => !o)} />
          <div className="app-main">
            <Header onLogout={handleLogout} />
            <div className="app-body">
              <Routes>
                <Route path="/"                      element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard"             element={<Dashboard />} />
                <Route path="/schedule"              element={<Schedule />} />
                <Route path="/schedule/trip/:tripId" element={<TripDetails />} />
                <Route path="/attendance"            element={<Attendance />} />
                <Route path="/master"                element={<MasterForm />} />
                <Route path="/reports"               element={<MasterForm />} />
                <Route path="/settings"              element={<div className="placeholder">Settings — Coming Soon</div>} />
              </Routes>
            </div>
          </div>
        </div>
      </FilterProvider>
    </CustomProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}