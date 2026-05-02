import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Loader, IconButton } from 'rsuite'
import PhoneIcon from '@rsuite/icons/Phone'
import ArrowDownIcon from '@rsuite/icons/ArrowDown'
import ArrowUpIcon from '@rsuite/icons/ArrowUp'
import FileDownloadIcon from '@rsuite/icons/FileDownload'

import FilterBar from '../../components/FilterBar/FilterBar'
import MiniCalendar from '../Schedule/components/MiniCalendar/MiniCalendar'
import AverageLogin from './components/PunctualEmployees/PunctualEmployees'

import { fetchAttendanceList, fetchEmployeeAttendanceDetail, fetchPunctualEmployees } from '../../api'
import { useFilter } from '../../components/FilterBar/FilterBar'
import './Attendance.css'

// ── Helpers ──────────────────────────────────────────────────────────────────
function toStr(d) {
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const EMPTY = { data: null, loading: true, error: null }

// ── Report export helpers ─────────────────────────────────────────────────────

/** Build a simple CSV string and trigger Excel download */
function exportToExcel(employees, selectedEmployee, detail, dateStr) {
  const rows = []
  rows.push(['Employee Attendance Report', '', '', '', '', ''])
  rows.push(['Date:', dateStr || 'All', '', '', '', ''])
  rows.push([])
  rows.push(['Name', 'Employee ID', 'Phone', 'Department', 'Shift', 'Designation', 'Zone', 'Login Time', 'Status'])

  employees.forEach(emp => {
    // Use status/isLate from API — no frontend recalculation
    const status = emp.status === 'absent' ? 'Absent' : emp.isLate ? 'Late' : 'On Time'
    rows.push([
      emp.name,
      emp.empId,
      emp.phone || '',
      emp.department || '',
      emp.shift || '',
      emp.designation || '',
      emp.zone || '',
      emp.loginTime || '-',
      status
    ])
  })

  // If a specific employee is selected, append their timeline
  if (selectedEmployee && detail?.timeline?.length) {
    rows.push([])
    rows.push([`${selectedEmployee.name}'s Log`])
    rows.push(['Day', 'Date', 'Type', 'Time From', 'Time To', 'Active Hours', 'Note'])
    detail.timeline.forEach(entry => {
      rows.push([
        entry.day || '',
        entry.date || '',
        entry.type || '',
        entry.timeFrom || '',
        entry.timeTo || '',
        entry.activeHours || '',
        entry.note || (entry.label ? `${entry.label} - ${entry.note || ''}` : '')
      ])
    })
  }

  const csvContent = rows.map(r =>
    r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\r\n')

  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `attendance_report_${dateStr || 'all'}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/** Generate a minimal PDF-like HTML and print/save as PDF */
function exportToPDF(employees, selectedEmployee, detail, dateStr) {
  // Use status/isLate from API — no frontend recalculation
  const statusOf = emp => emp.status === 'absent' ? 'Absent' : emp.isLate ? 'Late' : 'On Time'

  const statusColor = s => s === 'On Time' ? '#16a34a' : s === 'Late' ? '#ea580c' : '#dc2626'

  const rows = employees.map(emp => {
    const s = statusOf(emp)
    return `
      <tr>
        <td>${emp.name}</td>
        <td>${emp.empId}</td>
        <td>${emp.department || '-'}</td>
        <td>${emp.shift || '-'}</td>
        <td>${emp.loginTime || '-'}</td>
        <td style="color:${statusColor(s)};font-weight:700">${s}</td>
      </tr>`
  }).join('')

  let timelineSection = ''
  if (selectedEmployee && detail?.timeline?.length) {
    const tlRows = detail.timeline.map(e => `
      <tr>
        <td>${e.day || ''} ${e.date || ''}</td>
        <td>${e.type === 'holiday' ? (e.label || 'Holiday') : `${e.timeFrom || ''} → ${e.timeTo || ''}`}</td>
        <td>${e.activeHours || (e.type === 'holiday' ? e.note || '' : '-')}</td>
        <td>${e.note || ''}</td>
      </tr>`).join('')

    timelineSection = `
      <h2 style="margin-top:32px;font-size:14px;color:#1e293b">${selectedEmployee.name}'s Timeline Log</h2>
      <table>
        <thead><tr><th>Date</th><th>Time</th><th>Active Hours</th><th>Note</th></tr></thead>
        <tbody>${tlRows}</tbody>
      </table>`
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Attendance Report</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; color: #1e293b; padding: 32px; }
    h1 { font-size: 18px; margin-bottom: 4px; }
    .meta { color: #64748b; font-size: 11px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th { background: #f1f5f9; padding: 8px 10px; text-align: left; font-size: 11px; border: 1px solid #e2e8f0; }
    td { padding: 7px 10px; border: 1px solid #e2e8f0; font-size: 11px; }
    tr:nth-child(even) td { background: #f8fafc; }
    .print-btn { display:inline-flex; align-items:center; gap:6px; margin-bottom:20px; padding:8px 18px; background:#2563eb; color:#fff; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; }
    .print-btn:hover { background:#1d4ed8; }
    @media print { .print-btn { display:none; } body { padding: 16px; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">&#128424; Print / Save as PDF</button>
  <h1>Employee Attendance Report</h1>
  <div class="meta">Date: ${dateStr || 'All'} &nbsp;|&nbsp; Total Employees: ${employees.length}</div>
  <table>
    <thead>
      <tr><th>Name</th><th>Employee ID</th><th>Department</th><th>Shift</th><th>Login Time</th><th>Status</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  ${timelineSection}
</body>
</html>`

  // Blob URL approach — completely independent tab, parent page never freezes
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

// ── Timeline Entry component ──────────────────────────────────────────────────
function TimelineEntry({ entry, idx, expanded, onToggle }) {
  const isHoliday = entry.type === 'holiday'
  return (
    <div className="att-tl-entry">
      <div
        className={`att-day-marker ${entry.type}`}
        onClick={() => !isHoliday && onToggle(idx)}
        style={{ cursor: isHoliday ? 'default' : 'pointer' }}
      >
        <span className="att-day-name">{entry.day}</span>
        <span className="att-day-num">{entry.date}</span>
      </div>

      <div className="att-tl-content">
        {isHoliday ? (
          <div className="att-holiday-card">
            <span className="att-holiday-label">{entry.label}</span>
            <span className="att-holiday-note">{entry.note}</span>
          </div>
        ) : (
          <div
            className={`att-active-card${expanded ? ' att-active-card-open' : ''}`}
            onClick={() => onToggle(idx)}
            style={{ cursor: 'pointer' }}
          >
            <div className="att-active-header">
              <div className="att-active-header-left">
                <span className="att-time-range">{entry.timeFrom} to {entry.timeTo}</span>
                <span className="att-active-hrs">Active {entry.activeHours}</span>
                <span className="att-note">{entry.note}</span>
              </div>
              <IconButton
                icon={expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
                appearance="subtle" size="xs" circle
                onClick={e => { e.stopPropagation(); onToggle(idx) }}
                className="att-expand-btn"
              />
            </div>

            {expanded && (
              <div className="att-punches">
                {entry.punches.map((p, pi) => (
                  <div key={pi} className="att-punch-row">
                    <div className="att-punch-dot" />
                    <div className="att-punch-info">
                      <span className="att-punch-label">{p.label}</span>
                      <span className="att-punch-sub">Punch time ({p.punchTime})</span>
                    </div>
                    <span className="att-punch-sched">{p.scheduledTime}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Report Dropdown Button ────────────────────────────────────────────────────
function ReportMenu({ onExcelAll, onPDFAll, onExcelLog, onPDFLog, hasSelected }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="att-report-wrap" ref={ref}>
      <button
        className="att-report-btn"
        onClick={() => setOpen(o => !o)}
        title="Export Report"
      >
        <FileDownloadIcon style={{ fontSize: 13 }} />
        <span>Report</span>
        <ArrowDownIcon style={{ fontSize: 10, marginLeft: 2 }} />
      </button>

      {open && (
        <div className="att-report-menu">
          {!hasSelected ? (
            // No employee selected → show All Employees exports only
            <>
              <div className="att-report-section-label">All Employees</div>
              <button className="att-report-item" onClick={() => { onExcelAll(); setOpen(false) }}>
                📊 Export Excel (.csv)
              </button>
              <button className="att-report-item" onClick={() => { onPDFAll(); setOpen(false) }}>
                📄 Export PDF
              </button>
            </>
          ) : (
            // Employee selected → show only that employee's log exports
            <>
              <div className="att-report-section-label">Selected Employee Log</div>
              <button className="att-report-item" onClick={() => { onExcelLog(); setOpen(false) }}>
                📊 Export Log (.csv)
              </button>
              <button className="att-report-item" onClick={() => { onPDFLog(); setOpen(false) }}>
                📄 Export Log PDF
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Attendance() {
  const { unit, shift, date, setDate } = useFilter()

  const [attList, setAttList] = useState(EMPTY)
  const [selected, setSelected] = useState(null)
  const [empDetail, setEmpDetail] = useState(EMPTY)
  const [punct, setPunct] = useState(EMPTY)
  const [expandedSet, setExpandedSet] = useState(new Set())
  const [mainFilter, setMainFilter] = useState('present')
  const [detailFilter, setDetailFilter] = useState('all')
  const [deptFilter, setDeptFilter] = useState('All')

  const fetchId = useRef(0)
  const dateStr = useMemo(() => toStr(date), [date])

  // Fetch attendance list & punctual employees
  useEffect(() => {
    const id = ++fetchId.current
    const filters = { unit, shift, date: dateStr }
    setAttList(EMPTY)
    setPunct(EMPTY)
    setSelected(null)
    setEmpDetail(EMPTY)
    setExpandedSet(new Set())
    const safe = s => d => { if (id !== fetchId.current) return; s({ data: d, loading: false, error: null }) }
    const fail = s => e => { if (id !== fetchId.current) return; s({ data: null, loading: false, error: e.message }) }
    fetchAttendanceList(filters).then(safe(setAttList)).catch(fail(setAttList))
    fetchPunctualEmployees(filters).then(safe(setPunct)).catch(fail(setPunct))
  }, [unit, shift, dateStr])

  // Auto-select first employee
  useEffect(() => {
    if (attList.data?.employees?.length && !selected)
      setSelected(attList.data.employees[0])
  }, [attList.data])

  // Fetch employee detail
  useEffect(() => {
    if (!selected) return
    setEmpDetail(EMPTY)
    setExpandedSet(new Set())
    fetchEmployeeAttendanceDetail(selected.empId)
      .then(d => {
        setEmpDetail({ data: d, loading: false, error: null })
        const first = d.timeline.findIndex(e => e.type !== 'holiday')
        if (first !== -1) setExpandedSet(new Set([first]))
      })
      .catch(e => setEmpDetail({ data: null, loading: false, error: e.message }))
  }, [selected])

  const handleToggle = (idx) => {
    setExpandedSet(prev => {
      const next = new Set(prev)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })
  }

  // Status helper — reads directly from API fields (emp.status, emp.isLate)
  // No frontend recalculation: status is authoritative from the backend
  const getEmployeeStatus = useCallback((emp) => {
    if (emp.status === 'absent') return 'absent'
    return emp.isLate ? 'late' : 'on-time'
  }, [])

  // Filter employees
  const employees = attList.data?.employees || []

  // Dept options derived from employees
  const deptOptions = useMemo(() => {
    const depts = [...new Set(employees.map(e => e.department).filter(Boolean))].sort()
    return ['All', ...depts]
  }, [employees])

  const filteredEmployees = employees.filter(emp => {
    const status = getEmployeeStatus(emp)
    if (deptFilter !== 'All' && emp.department !== deptFilter) return false
    if (mainFilter === 'absent') return status === 'absent'
    if (detailFilter === 'all') return status !== 'absent'
    if (detailFilter === 'on-time') return status === 'on-time'
    if (detailFilter === 'late') return status === 'late'
    return true
  })

  const detail = empDetail.data

  // ── Report handlers ────────────────────────────────────────────────────────
  const handleExcelAll = () => exportToExcel(employees, null, null, dateStr)
  const handlePDFAll   = () => exportToPDF(employees, null, null, dateStr)
  // Pass only [selected] — not full employees array — so log report contains only that employee
  const handleExcelLog = () => { if (selected && detail) exportToExcel([selected], selected, detail, dateStr) }
  const handlePDFLog   = () => { if (selected && detail) exportToPDF([selected], selected, detail, dateStr) }

  // Middle panel title: "[Name]'s Log"
  const middleTitle = selected ? `${selected.name.split(' ')[0]}'s Log` : 'Employee Log'

  return (
    <div className="attendance-page">
      <FilterBar />

      <div className="att-body">
        {/* ══ PANEL 1 – LEFT ════════════════════════════════════════════ */}
        <div className="att-left card">
          <div className="att-filter-section">
            {/* ── Top row: title + Department dropdown ── */}
            <div className="att-top-header-row">
              <span className="card-title" style={{ marginBottom: 0 }}>Employee attendance</span>
              <div className="att-dept-wrap">
                <select
                  className="att-dept-select"
                  value={deptFilter}
                  onChange={e => { setDeptFilter(e.target.value); setSelected(null) }}
                >
                  {deptOptions.map(d => (
                    <option key={d} value={d}>{d === 'All' ? 'Department' : d}</option>
                  ))}
                </select>
                <span className="att-dept-arrow">▾</span>
              </div>
            </div>

            {/* ── Main Filter Tabs: Present / Absent ── */}
            <div className="att-filter-tabs">
              <button
                className={`att-filter-tab ${mainFilter === 'present' ? 'active' : ''}`}
                onClick={() => { setMainFilter('present'); setDetailFilter('all'); setSelected(null) }}
              >
                Present
              </button>
              <button
                className={`att-filter-tab ${mainFilter === 'absent' ? 'active' : ''}`}
                onClick={() => { setMainFilter('absent'); setDetailFilter('all'); setSelected(null) }}
              >
                Absent
              </button>
            </div>

            {/* ── Detail chip filters: All / On time / Late ── */}
            {mainFilter === 'present' && (
              <div className="att-detail-chips">
                <button
                  className={`att-chip ${detailFilter === 'all' ? 'active' : ''}`}
                  onClick={() => { setDetailFilter('all'); setSelected(null) }}
                >
                  All
                </button>
                <button
                  className={`att-chip ${detailFilter === 'on-time' ? 'active' : ''}`}
                  onClick={() => { setDetailFilter('on-time'); setSelected(null) }}
                >
                  On time
                </button>
                <button
                  className={`att-chip ${detailFilter === 'late' ? 'active' : ''}`}
                  onClick={() => { setDetailFilter('late'); setSelected(null) }}
                >
                  Late
                </button>
              </div>
            )}
          </div>

          {/* Employee cards */}
          <div className="att-list">
            {attList.loading && <div className="att-center"><Loader size="sm" content="Loading..." /></div>}
            {attList.error && <div className="att-center error-txt">⚠ {attList.error}</div>}
            {!attList.loading && !attList.error && filteredEmployees.length === 0 && (
              <div className="att-center" style={{ color: 'var(--t3)', fontSize: 12 }}>
                No {mainFilter === 'absent' ? 'absent' : detailFilter === 'all' ? 'present' : detailFilter} employees
              </div>
            )}

            {filteredEmployees.map(emp => {
              const empStatus = getEmployeeStatus(emp)
              return (
                <div
                  key={emp.empId}
                  className={`att-emp-card${selected?.empId === emp.empId ? ' selected' : ''}`}
                  onClick={() => setSelected(emp)}
                >
                  <div className="att-emp-top">
                    <div className="att-emp-left-info">
                      <div className={`att-emp-av att-emp-av--${empStatus}`}>
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="att-role-badge">Role <span>{emp.role}</span></div>
                        <div className={`att-emp-name att-emp-name--${empStatus}`}>
                          {emp.name} ({emp.empId})
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      {empStatus !== 'absent' && (
                        <span className="att-login-time">Login : {emp.loginTime}</span>
                      )}
                      <span className={`att-status-badge ${empStatus}`}>
                        {empStatus === 'on-time' ? '✓ On Time'
                          : empStatus === 'late' ? '⏱ Late'
                          : '✗ Absent'}
                      </span>
                    </div>
                  </div>
                  <div className="att-emp-tags">
                    {emp.phone && <span className="att-tag phone"><PhoneIcon /> {emp.phone}</span>}
                    {emp.shift && <span className="att-tag">{emp.shift}</span>}
                    {emp.department && <span className="att-tag">{emp.department}</span>}
                    {emp.zone && <span className="att-tag">{emp.zone}</span>}
                    {emp.designation && <span className="att-tag">{emp.designation}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ══ PANEL 2 – MIDDLE ════════════════════════════════════════ */}
        <div className="att-middle card">
          {/* Header: "[Name]'s Log" + Report button */}
          <div className="att-middle-header">
            <div className="att-middle-title-row">
              {selected && (
                <div className={`att-emp-av att-emp-av--${getEmployeeStatus(selected)} att-emp-av--sm`}>
                  {selected.name.charAt(0)}
                </div>
              )}
              <div>
                {selected && (
                  <div className="att-role-badge" style={{ marginBottom: 2 }}>
                    Role <span>{selected.role}</span>
                  </div>
                )}
                <span className="card-title" style={{ marginBottom: 0 }}>{middleTitle}</span>
              </div>
            </div>

            <div className="att-middle-header-right">
              {selected?.loginTime && (
                <span className="att-detail-chip att-detail-chip--login">
                  <span className="att-chip-label">Login</span>
                  <span className="att-chip-value">{selected.loginTime}</span>
                </span>
              )}
              <ReportMenu
                onExcelAll={handleExcelAll}
                onPDFAll={handlePDFAll}
                onExcelLog={handleExcelLog}
                onPDFLog={handlePDFLog}
                hasSelected={!!selected && !!detail}
              />
            </div>
          </div>

          {!selected && (
            <div className="att-center" style={{ color: 'var(--t3)', fontSize: 13 }}>
              Select an employee from the list
            </div>
          )}

          {selected && (
            <>
              {empDetail.loading && <div className="att-center"><Loader size="sm" content="Loading..." /></div>}
              {empDetail.error && <div className="att-center error-txt">⚠ {empDetail.error}</div>}

              {detail && (
                <div className="att-timeline">
                  {detail.timeline.length === 0 ? (
                    <div className="att-center" style={{ color: 'var(--t3)', fontSize: 12, marginTop: 20 }}>
                      No records found
                    </div>
                  ) : (
                    detail.timeline.map((entry, idx) => (
                      <TimelineEntry
                        key={idx}
                        entry={entry}
                        idx={idx}
                        expanded={expandedSet.has(idx)}
                        onToggle={handleToggle}
                      />
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ══ RIGHT SIDEBAR ══════════════════════════════════════════ */}
        <div className="att-right">
          <MiniCalendar selectedDate={date} onDateSelect={setDate} />
          {/* AverageLogin = renamed PunctualEmployees component */}
          <AverageLogin data={punct.data} loading={punct.loading} error={punct.error} />
        </div>
      </div>
    </div>
  )
}