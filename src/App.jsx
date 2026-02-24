
import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar     from './components/Sidebar/Sidebar'
import Header      from './components/Header/Header'
import Dashboard from './pages/Dashboard/Dashboard/Dashboard'
import Schedule    from './pages/Schedule/Schedule'
import TripDetails from './pages/TripDetails/TripDetails'
import Attendance  from './pages/Attendance/Attendance'
import MasterForm  from './pages/MasterForm/MasterForm'
import './App.css'

export default function App() {
  const [sbOpen, setSbOpen] = useState(false)
  return (
    <div className={`app-shell${sbOpen ? ' sb-open' : ''}`}>
      <Sidebar open={sbOpen} onToggle={() => setSbOpen(o => !o)} />
      <div className="app-main">
        <Header />
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
  )
}