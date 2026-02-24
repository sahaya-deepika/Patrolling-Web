import { useNavigate } from 'react-router-dom'
import { Loader } from 'rsuite'
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine'
import './TripStats.css'

export default function TripStats({ data, loading, error }) {
  const navigate = useNavigate()
  const go = tab => navigate('/schedule', { state: { initialTab: tab } })

  if (loading) return <div className="card trip-card"><div className="card-title">Trip Statistics</div><div className="card-center"><Loader size="sm" content="Loading..." /></div></div>
  if (error || !data) return <div className="card trip-card"><div className="card-title">Trip Statistics</div><div className="card-center error-txt">⚠ {error||'No data'}</div></div>

  const { allTrips, completed, missed, ontime, late, efficiency } = data
  const eff = Math.min(100, Math.max(0, efficiency || 0))

  return (
    <div className="card trip-card">
      <div className="card-title">Trip Statistics</div>
      <div className="trip-grid">

        {/* Col 1 Row 1 — All trips */}
        <div className="stat-box">
          <div className="stat-lbl"><span className="stat-bus">🚌</span> All trips</div>
          <div className="stat-num">{allTrips}</div>
          <button className="arr-btn" onClick={() => go('All')}>
            <ArrowRightLineIcon style={{ fontSize: 13, color: '#fff' }} />
          </button>
        </div>

        {/* Col 2 spans both rows — Completed top, Ontime+Late bottom */}
        <div className="stat-box completed-group">
          <div className="cg-top">
            <div className="stat-lbl"><span className="stat-icon green">✓</span> Completed</div>
            <div className="stat-num">{completed}</div>
            <button className="arr-btn" onClick={() => go('Complete')}>
              <ArrowRightLineIcon style={{ fontSize: 13, color: '#fff' }} />
            </button>
          </div>
          <div className="cg-divider" />
          <div className="cg-bot">
            <div className="mini">
              <div className="mini-lbl">⏱ Ontime</div>
              <div className="mini-num teal-txt">{ontime}</div>
            </div>
            <div className="mini-sep" />
            <div className="mini">
              <div className="mini-lbl">⚠ Late</div>
              <div className="mini-num red-txt">{late}</div>
            </div>
          </div>
        </div>

        {/* Col 1 Row 2 — Missed */}
        <div className="stat-box">
          <div className="stat-lbl"><span className="stat-icon red">✕</span> Missed</div>
          <div className="stat-num">{missed}</div>
          <button className="arr-btn" onClick={() => go('Missed')}>
            <ArrowRightLineIcon style={{ fontSize: 13, color: '#fff' }} />
          </button>
        </div>

        {/* Col 3 spans both rows — Efficiency bar */}
        <div className="eff-col">
          <div className="eff-inner">
            <div className="eff-bar-wrap">
              <div className="eff-bar-fill" style={{ height: `${eff}%` }} />
            </div>
            <div className="eff-pct">{eff}%</div>
            <div className="eff-label">Efficiency</div>
          </div>
        </div>

      </div>
    </div>
  )
}