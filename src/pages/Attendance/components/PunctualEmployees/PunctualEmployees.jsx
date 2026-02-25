import { useState } from 'react'
import { Avatar, Button, Loader } from 'rsuite'
import './PunctualEmployees.css'

const AVATAR_COLORS = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444']
const avatarColor = name => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

const DEFAULT_SHOW = 5

export default function PunctualEmployees({ data, loading, error }) {
  const [expanded, setExpanded] = useState(false)

  if (loading) return (
    <div className="punct-emp">
      <div className="punct-header"><span className="punct-title">Punctual Employees</span></div>
      <div className="punct-loading"><Loader size="sm" content="Loading..." /></div>
    </div>
  )
  if (error || !data) return (
    <div className="punct-emp">
      <div className="punct-header"><span className="punct-title">Punctual Employees</span></div>
      <div className="punct-loading" style={{ color: 'var(--red)' }}>No data</div>
    </div>
  )

  const list    = data.employees || []
  const hasMore = list.length > DEFAULT_SHOW
  const visible = expanded ? list : list.slice(0, DEFAULT_SHOW)

  return (
    <div className="punct-emp">
      <div className="punct-header">
        <span className="punct-title">Punctual Employees</span>
        {hasMore && (
          <Button
            appearance="link"
            size="xs"
            className="punct-more"
            onClick={() => setExpanded(prev => !prev)}
          >
            {expanded ? 'See less' : 'See more'}
          </Button>
        )}
      </div>

      <div className={`punct-list${expanded ? ' punct-list-expanded' : ''}`}>
        {visible.map((emp, i) => (
          <div key={emp.empId} className="punct-row">
            <span className="punct-rank">{i + 1}.</span>
            <Avatar
              circle
              size="xs"
              style={{ background: avatarColor(emp.name), color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}
            >
              {emp.name.charAt(0)}
            </Avatar>
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