import './EfficientEmployees.css'

export default function EfficientEmployees({ data, loading, error }) {
  if (loading) return (
    <div className="eff-emp">
      <div className="eff-header"><span className="eff-title">Efficient employee's</span></div>
      <div className="eff-loading">Loading…</div>
    </div>
  )

  if (error || !data) return (
    <div className="eff-emp">
      <div className="eff-header"><span className="eff-title">Efficient employee's</span></div>
      <div className="eff-loading" style={{ color: 'var(--red)' }}>No data</div>
    </div>
  )

  const list = data.employees || []

  return (
    <div className="eff-emp">
      <div className="eff-header">
        <span className="eff-title">Efficient employee's</span>
        <button className="eff-more">See more</button>
      </div>

      <div className="eff-list">
        {list.map((emp, i) => {
          const pct = Math.round((emp.score / emp.maxScore) * 100)
          return (
            <div key={emp.empId} className="eff-row">
              <span className="eff-rank">{i + 1}.</span>
              <div className="eff-avatar">
                {emp.name.charAt(0)}
              </div>
              <div className="eff-info">
                <span className="eff-name">{emp.name}</span>
                <span className="eff-id">ID: {emp.empId}</span>
              </div>
              <div className="eff-bar-wrap">
                <div className="eff-bar-track">
                  <div className="eff-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <span className="eff-score">{emp.score}/{emp.maxScore}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}