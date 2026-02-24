
import { Avatar, Progress } from 'rsuite'
import './EfficientEmployees.css'

export default function EfficientEmployees({ data, loading, error }) {
  if (loading) return (
    <div className="eff-emp card">
      <div className="eff-header"><span className="eff-title">Efficient employee's</span></div>
      <div className="eff-loading">Loading…</div>
    </div>
  )
  if (error || !data) return (
    <div className="eff-emp card">
      <div className="eff-header"><span className="eff-title">Efficient employee's</span></div>
      <div className="eff-loading">No data</div>
    </div>
  )

  const list = data.employees || []
  return (
    <div className="eff-emp card">
      <div className="eff-header">
        <span className="eff-title">Efficient employee's</span>
        <button className="eff-more">See more</button>
      </div>
      <div className="eff-list">
        {list.map((emp, i) => {
          const pct = Math.round((emp.score / emp.maxScore) * 100)
          return (
            <div key={emp.empId} className="eff-row">
              <span className="eff-rank">{i+1}.</span>
              <Avatar
                circle size="sm"
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.empId}`}
                style={{ flexShrink: 0 }}
              />
              <div className="eff-info">
                <span className="eff-name">{emp.name}</span>
                <span className="eff-id">ID: {emp.empId}</span>
              </div>
              <div className="eff-bar-wrap">
                <Progress.Line
                  percent={pct}
                  strokeWidth={5}
                  showInfo={false}
                  strokeColor="var(--accent)"
                  style={{ padding: 0 }}
                />
              </div>
              <span className="eff-score">{emp.score}/{emp.maxScore}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}