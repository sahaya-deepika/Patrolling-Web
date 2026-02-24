

import { Loader } from 'rsuite'
import './AttendanceStats.css'

function Donut({ value, total, color, track }) {
  const size = 76, stroke = 10
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = total > 0 ? Math.min(value / total, 1) : 0
  const filled = pct * circ
  return (
    <svg width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeDashoffset={circ / 4} />
    </svg>
  )
}

export default function AttendanceStats({ data, loading, error }) {
  if (loading) return (
    <div className="atts-card">
      <div className="atts-title">Attendance Statistics</div>
      <div className="atts-loader"><Loader size="sm" content="Loading..." /></div>
    </div>
  )
  if (error || !data) return (
    <div className="atts-card">
      <div className="atts-title">Attendance Statistics</div>
      <div className="atts-loader" style={{color:'#f05252'}}>⚠ {error || 'No data'}</div>
    </div>
  )

  const { present, absent, ontime, late } = data
  const t1 = (present + absent) || 1
  const t2 = (ontime  + late)   || 1

  return (
    <div className="atts-card">
      <div className="atts-title">Attendance Statistics</div>
      <div className="atts-row">

        <div className="atts-panel">
          <div className="atts-donut">
            <Donut value={present} total={t1} color="#3b7ff5" track="#bfdbfe" />
            <span className="atts-num" style={{color:'#3b7ff5'}}>{present}</span>
          </div>
          <div className="atts-legend">
            <div className="atts-leg"><i className="atts-dot" style={{background:'#3b7ff5'}}/>
              <span className="atts-lname">Present</span><span className="atts-lval">{present}</span></div>
            <div className="atts-leg"><i className="atts-dot" style={{background:'#bfdbfe'}}/>
              <span className="atts-lname">Absent</span><span className="atts-lval">{absent}</span></div>
          </div>
        </div>

        <div className="atts-panel">
          <div className="atts-donut">
            <Donut value={ontime} total={t2} color="#22c55e" track="#fca5a5" />
            <span className="atts-num" style={{color:'#15803d'}}>{ontime}</span>
          </div>
          <div className="atts-legend">
            <div className="atts-leg"><i className="atts-dot" style={{background:'#22c55e'}}/>
              <span className="atts-lname">Ontime</span><span className="atts-lval">{ontime}</span></div>
            <div className="atts-leg"><i className="atts-dot" style={{background:'#f05252'}}/>
              <span className="atts-lname">Late</span><span className="atts-lval">{late}</span></div>
          </div>
        </div>

      </div>
    </div>
  )
}