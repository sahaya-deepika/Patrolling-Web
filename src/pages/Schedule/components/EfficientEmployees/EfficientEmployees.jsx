import { useState } from 'react'
import { Avatar, Progress, Loader, Panel, Button } from 'rsuite'
import './EfficientEmployees.css'

export default function EfficientEmployees({ data, loading, error }) {
  const [showAll, setShowAll] = useState(false)
  const INITIAL_DISPLAY = 5

  // Create header content function so it updates with showAll state
  const createHeaderContent = () => (
    <div className="eff-header-container">
      <span className="eff-title">Efficient employee's</span>
      {data?.employees?.length > INITIAL_DISPLAY && (
        <Button 
          appearance="link"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="eff-see-more-btn"
        >
          {showAll ? 'Show less' : 'See more'}
        </Button>
      )}
    </div>
  )

  if (loading) return (
    <Panel header={createHeaderContent()} className="eff-emp-panel">
      <div className="eff-loading"><Loader size="sm" content="Loading..." /></div>
    </Panel>
  )
  
  if (error || !data) return (
    <Panel header={createHeaderContent()} className="eff-emp-panel">
      <div className="eff-loading">No data</div>
    </Panel>
  )

  const list = data.employees || []
  const displayedList = showAll ? list : list.slice(0, INITIAL_DISPLAY)

  return (
    <Panel header={createHeaderContent()} className="eff-emp-panel">
      <div className={`eff-list-wrapper${showAll ? ' eff-list-expanded' : ''}`}>
        <div className="eff-list">
          {displayedList.length > 0 ? (
            displayedList.map((emp, i) => {
              const pct = Math.round((emp.score / emp.maxScore) * 100)
              return (
                <div key={emp.empId} className="eff-row">
                  <span className="eff-rank">{i+1}.</span>
                  <Avatar
                    circle
                    size="sm"
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
            })
          ) : (
            <div className="eff-loading">No employees</div>
          )}
        </div>
      </div>
    </Panel>
  )
}