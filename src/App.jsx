// // import { Routes, Route, Navigate } from 'react-router-dom'
// // import Sidebar from './components/Sidebar/Sidebar'
// // import Header from './components/Header/Header'
// // import Dashboard from './pages/Dashboard/Dashboardmaster/Dashboard'
// // import './App.css'

// // function Placeholder({ title }) {
// //   return (
// //     <div className="placeholder">
// //       <span>{title} — Coming Soon</span>
// //     </div>
// //   )
// // }

// // export default function App() {
// //   return (
// //     <div className="app-shell">
// //       <Sidebar />
// //       <div className="app-main">
// //         <Header />
// //         <div className="app-body">
// //           <Routes>
// //             <Route path="/"          element={<Navigate to="/dashboard" replace />} />
// //             <Route path="/dashboard" element={<Dashboard />} />
// //             <Route path="/live"      element={<Placeholder title="Live Tracking" />} />
// //             <Route path="/reports"   element={<Placeholder title="Reports" />} />
// //             <Route path="/schedule"  element={<Placeholder title="Schedule" />} />
// //             <Route path="/settings"  element={<Placeholder title="Settings" />} />
// //           </Routes>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// import { Routes, Route, Navigate } from 'react-router-dom'
// import Sidebar   from './components/Sidebar/Sidebar'
// import Header    from './components/Header/Header'
// import Dashboard from './pages/Dashboard/Dashboardmaster/Dashboard'
// import Schedule    from './pages/Schedule/Schedule'
// import TripDetails from './pages/TripDetails/TripDetails'
// import './App.css'

// function Placeholder({ title }) {
//   return (
//     <div className="placeholder">
//       <span>{title} — Coming Soon</span>
//     </div>
//   )
// }

// export default function App() {
//   return (
//     <div className="app-shell">
//       <Sidebar />
//       <div className="app-main">
//         <Header />
//         <div className="app-body">
//           <Routes>
//             <Route path="/"          element={<Navigate to="/dashboard" replace />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/live"      element={<Placeholder title="Live Tracking" />} />
//             <Route path="/reports"   element={<Placeholder title="Reports" />} />
//             <Route path="/schedule"            element={<Schedule />} />
//             <Route path="/schedule/trip/:tripId" element={<TripDetails />} />
//             <Route path="/settings"  element={<Placeholder title="Settings" />} />
//           </Routes>
//         </div>
//       </div>
//     </div>
//   )
// }

import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar     from './components/Sidebar/Sidebar'
import Header      from './components/Header/Header'
import Dashboard   from './pages/Dashboard/Dashboardmaster/Dashboard'
import Schedule    from './pages/Schedule/Schedule'
import TripDetails from './pages/TripDetails/TripDetails'
import Attendance  from './pages/Attendance/Attendance'
import './App.css'

function Placeholder({ title }) {
  return (
    <div className="placeholder">
      <span>{title} — Coming Soon</span>
    </div>
  )
}

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Header />
        <div className="app-body">
          <Routes>
            <Route path="/"                      element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"             element={<Dashboard />} />
            <Route path="/live"                  element={<Placeholder title="Live Tracking" />} />
            <Route path="/reports"               element={<Placeholder title="Reports" />} />
            <Route path="/schedule"              element={<Schedule />} />
            <Route path="/schedule/trip/:tripId" element={<TripDetails />} />
            <Route path="/attendance"            element={<Attendance />} />
            <Route path="/settings"              element={<Placeholder title="Settings" />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}