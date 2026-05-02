import { useRef, useState, useEffect } from 'react'
import { Avatar, Loader } from 'rsuite'
import FileDownloadIcon from '@rsuite/icons/FileDownload'
import ArrowDownIcon from '@rsuite/icons/ArrowDown'
import './PunctualEmployees.css'

const AVATAR_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']
const avatarColor = name => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

// ── Time helpers ──────────────────────────────────────────────────────────────
function parseLoginTime(timeStr) {
  if (!timeStr) return null
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
  if (!match) return null
  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const meridiem = match[3]?.toUpperCase()
  if (meridiem === 'PM' && hours !== 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0
  return hours * 60 + minutes
}

function minutesToTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  const meridiem = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 === 0 ? 12 : h % 12
  return `${displayH}:${String(m).padStart(2, '0')} ${meridiem}`
}

function calcAverageTime(employees) {
  const parsed = employees.map(e => parseLoginTime(e.loginTime)).filter(v => v !== null)
  if (!parsed.length) return null
  const avg = Math.round(parsed.reduce((a, b) => a + b, 0) / parsed.length)
  return minutesToTime(avg)
}

// ── Report export helpers ─────────────────────────────────────────────────────
function exportAvgToExcel(employees) {
  const rows = []
  rows.push(['Average Login Report'])
  rows.push([])
  rows.push(['Rank', 'Name', 'Employee ID', 'Login Time', 'Avg Login Time'])
  const overallAvg = calcAverageTime(employees)
  employees.forEach((emp, i) => {
    rows.push([i + 1, emp.name, emp.empId, emp.loginTime || '-', overallAvg || '-'])
  })
  rows.push([])
  rows.push(['Overall Average', '', '', overallAvg || '-', ''])

  const csv = rows.map(r =>
    r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')
  ).join('\r\n')

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'average_login_report.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function exportAvgToPDF(employees) {
  const overallAvg = calcAverageTime(employees)
  const rows = employees.map((emp, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${emp.name}</td>
      <td>${emp.empId}</td>
      <td>${emp.loginTime || '-'}</td>
    </tr>`).join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Average Login Report</title>
  <style>
    body{font-family:Arial,sans-serif;font-size:12px;color:#1e293b;padding:32px}
    h1{font-size:16px;margin-bottom:4px}
    .meta{color:#64748b;font-size:11px;margin-bottom:20px}
    .avg-badge{display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:3px 12px;font-size:12px;font-weight:700;color:#1d4ed8;margin-bottom:16px}
    table{width:100%;border-collapse:collapse;margin-top:8px}
    th{background:#f1f5f9;padding:8px 10px;text-align:left;font-size:11px;border:1px solid #e2e8f0}
    td{padding:7px 10px;border:1px solid #e2e8f0;font-size:11px}
    tr:nth-child(even) td{background:#f8fafc}
    .print-btn{display:inline-flex;align-items:center;gap:6px;margin-bottom:20px;padding:8px 18px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer}
    .print-btn:hover{background:#1d4ed8}
    @media print{.print-btn{display:none}}
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">&#128424; Print / Save as PDF</button>
  <h1>Average Login Report</h1>
  <div class="meta">Total Employees: ${employees.length}</div>
  ${overallAvg ? `<div class="avg-badge">Overall Avg Login: ${overallAvg}</div>` : ''}
  <table>
    <thead><tr><th>#</th><th>Name</th><th>Employee ID</th><th>Login Time</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`

  // Blob URL — independent tab, parent page never freezes
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

// ── Report dropdown ───────────────────────────────────────────────────────────
function AvgReportMenu({ onExcel, onPDF }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="punct-report-wrap" ref={ref}>
      <button className="punct-report-btn" onClick={() => setOpen(o => !o)} title="Export Report">
        <FileDownloadIcon style={{ fontSize: 11 }} />
        <span>Report</span>
        <ArrowDownIcon style={{ fontSize: 9, marginLeft: 2 }} />
      </button>
      {open && (
        <div className="punct-report-menu">
          <button className="punct-report-item" onClick={() => { onExcel(); setOpen(false) }}>
            📊 Export Excel (.csv)
          </button>
          <button className="punct-report-item" onClick={() => { onPDF(); setOpen(false) }}>
            📄 Export PDF
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AverageLogin({ data, loading, error }) {
  if (loading) return (
    <div className="punct-emp">
      <div className="punct-header"><span className="punct-title">Average Login</span></div>
      <div className="punct-loading"><Loader size="sm" content="Loading..." /></div>
    </div>
  )
  if (error || !data) return (
    <div className="punct-emp">
      <div className="punct-header"><span className="punct-title">Average Login</span></div>
      <div className="punct-loading" style={{ color: 'var(--red)' }}>No data</div>
    </div>
  )

  const list = data.employees || []
  const avgTime = calcAverageTime(list)

  return (
    <div className="punct-emp">
      <div className="punct-header">
        <span className="punct-title">Average Login</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {avgTime && (
            <span className="punct-avg-badge">
              <span className="punct-avg-label">Avg</span>
              <span className="punct-avg-value">{avgTime}</span>
            </span>
          )}
          <AvgReportMenu
            onExcel={() => exportAvgToExcel(list)}
            onPDF={() => exportAvgToPDF(list)}
          />
        </div>
      </div>

      <div className="punct-list">
        {list.map((emp, i) => (
          <div key={emp.empId} className="punct-row">
            <span className="punct-rank">{i + 1}.</span>
            <Avatar
              circle size="xs"
              style={{ background: avatarColor(emp.name), color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}
            >
              {emp.name.charAt(0)}
            </Avatar>
            <div className="punct-info">
              <span className="punct-name">{emp.name}</span>
              <span className="punct-id">ID : {emp.empId}</span>
            </div>
            <span className="punct-time">{emp.loginTime}</span>
          </div>
        ))}
      </div>
    </div>
  )
}