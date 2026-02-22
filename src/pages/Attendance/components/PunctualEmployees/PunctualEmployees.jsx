import './PunctualEmployees.css'

export default function PunctualEmployees({ data, loading, error }) {
  if (loading) return (
    <div className="punct-emp">
      <div className="punct-header"><span className="punct-title">Punctual Employees</span></div>
      <div className="punct-loading">Loading…</div>
    </div>
  )
  if (error || !data) return (
    <div className="punct-emp">
      <div className="punct-header"><span className="punct-title">Punctual Employees</span></div>
      <div className="punct-loading" style={{ color: 'var(--red)' }}>No data</div>
    </div>
  )

  const list = data.employees || []

  return (
    <div className="punct-emp">
      <div className="punct-header">
        <span className="punct-title">Punctual Employees</span>
        <button className="punct-more">See more</button>
      </div>
      <div className="punct-list">
        {list.map((emp, i) => (
          <div key={emp.empId} className="punct-row">
            <span className="punct-rank">{i + 1}.</span>
            <div className="punct-avatar">{emp.name.charAt(0)}</div>
            <div className="punct-info">
              <span className="punct-name">{emp.name}</span>
              <span className="punct-id">ID: {emp.empId}</span>
            </div>
            <span className="punct-time">{emp.loginTime}</span>
          </div>
        ))}
      </div>
    </div>
  )
}