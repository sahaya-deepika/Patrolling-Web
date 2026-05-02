import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Panel, Nav, Whisper, Popover, IconButton, Button } from 'rsuite'
import { BsDownload, BsFilePdf, BsFileEarmarkExcel } from 'react-icons/bs'

import FilterBar          from '../../components/FilterBar/FilterBar'
import MiniCalendar       from './components/MiniCalendar/MiniCalendar'
import EfficientEmployees from './components/EfficientEmployees/EfficientEmployees'
import TodayScheduled     from '../Dashboard/components/TodayScheduled/TodayScheduled'

import { fetchScheduleList, fetchEfficientEmployees } from '../../api'
import { useFilter } from '../../components/FilterBar/FilterBar'
import './Schedule.css'

const TABS = ['All', 'Upcoming', 'Ongoing', 'Missed', 'Complete']

function toStr(d) {
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const EMPTY = { data: null, loading: true, error: null }

// ── Shared helpers ────────────────────────────────────────────────────────────

function fmtDate(d) {
  if (!d) return '—'
  if (typeof d === 'string') return d
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function nowStr() {
  return new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function fileSlug(d) {
  return fmtDate(d).replace(/ /g, '-')
}

const C = {
  accent:  [74,  108, 247],
  dark:    [26,   37,  53],
  muted:   [120, 140, 170],
  white:   [255, 255, 255],
  lightBg: [240, 244, 255],
  rowAlt:  [248, 250, 255],
  barBg:   [220, 228, 245],
  green:   [22,  163,  74],
  orange:  [234,  88,  12],
  red:     [220,  38,  38],
  purple:  [109,  40, 217],
  gold:    [234, 179,   8],
  silver:  [148, 163, 184],
  bronze:  [180,  83,   9],
}

const STATUS_COL = {
  Complete: C.green,
  Ongoing:  C.orange,
  Missed:   C.red,
  Upcoming: C.purple,
}

// ── PDF helpers ───────────────────────────────────────────────────────────────

function pdfHeader(doc, title, metaParts) {
  const PW = doc.internal.pageSize.getWidth()

  doc.setFillColor(...C.accent)
  doc.rect(0, 0, PW, 50, 'F')
  doc.setFontSize(17)
  doc.setFont(undefined, 'bold')
  doc.setTextColor(...C.white)
  doc.text(title, 36, 32)
  doc.setFontSize(9)
  doc.setFont(undefined, 'normal')
  doc.text(`Generated: ${nowStr()}`, 36, 44)

  doc.setFillColor(...C.lightBg)
  doc.rect(0, 50, PW, 24, 'F')
  doc.setFontSize(8.5)
  doc.setFont(undefined, 'bold')
  doc.setTextColor(...C.dark)

  let mx = 36
  metaParts.forEach((p, i) => {
    doc.text(p, mx, 66)
    mx += doc.getTextWidth(p) + 22
    if (i < metaParts.length - 1) {
      doc.setTextColor(...C.muted)
      doc.text('|', mx - 12, 66)
      doc.setTextColor(...C.dark)
    }
  })
}

function pdfFooter(doc) {
  const PW = doc.internal.pageSize.getWidth()
  const PH = doc.internal.pageSize.getHeight()
  const n  = doc.getNumberOfPages()

  for (let i = 1; i <= n; i++) {
    doc.setPage(i)
    doc.setFillColor(...C.lightBg)
    doc.rect(0, PH - 22, PW, 22, 'F')
    doc.setFontSize(8)
    doc.setTextColor(...C.muted)
    doc.setFont(undefined, 'normal')
    doc.text('Patrol Management System  —  Confidential', 36, PH - 8)
    doc.text(`Page ${i} of ${n}`, PW - 36, PH - 8, { align: 'right' })
  }
}

// ── Schedule PDF export ───────────────────────────────────────────────────────

async function exportSchedulePDF(rows, meta) {
  const { default: jsPDF }     = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const PW  = doc.internal.pageSize.getWidth()

  pdfHeader(doc, 'SCHEDULED LIST REPORT', [
    `Date: ${fmtDate(meta.date)}`,
    `Unit: ${meta.unit || 'All'}`,
    `Filter: ${meta.tab || 'All'}`,
    `Records: ${rows.length}`,
  ])

  // Status count chips
  const counts = rows.reduce((a, r) => {
    a[r.status] = (a[r.status] || 0) + 1
    return a
  }, {})

  let cx = 36
  const cy = 92
  doc.setFontSize(8)

  Object.entries(counts).forEach(([s, c]) => {
    const col = STATUS_COL[s] || C.accent
    const lbl = `${s}: ${c}`
    const w   = doc.getTextWidth(lbl) + 18
    doc.setFillColor(col[0], col[1], col[2])
    doc.roundedRect(cx, cy - 11, w, 16, 4, 4, 'F')
    doc.setTextColor(...C.white)
    doc.setFont(undefined, 'bold')
    doc.text(lbl, cx + 9, cy)
    cx += w + 8
  })

  doc.setDrawColor(...C.accent)
  doc.setLineWidth(0.5)
  doc.line(36, 104, PW - 36, 104)

  autoTable(doc, {
    startY: 112,
    margin: { left: 36, right: 36 },
    head: [['#', 'Emp ID', 'Name', 'Login Time', 'Task', 'Round', 'Total', 'Done / Total', 'Missed', 'Status']],
    body: rows.map((r, i) => {
      const done  = r.tripDone  ?? 0
      const total = r.tripTotal ?? 0
      return [
        i + 1,
        r.id ?? r.empId ?? '—',
        r.name ?? '—',
        r.loginTime ?? '—',
        r.task ?? '—',
        r.round ?? '—',
        total || '—',
        `${done}/${total}`,
        r.missed ?? 0,
        r.status ?? '—',
      ]
    }),
    styles: {
      fontSize: 8,
      cellPadding: { top: 5, bottom: 5, left: 6, right: 6 },
      textColor: C.dark,
      lineColor: [230, 235, 245],
      lineWidth: 0.4,
    },
    headStyles: {
      fillColor: C.accent,
      textColor: C.white,
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: { top: 7, bottom: 7, left: 6, right: 6 },
    },
    alternateRowStyles: { fillColor: C.rowAlt },
    columnStyles: {
      0: { cellWidth: 24, halign: 'center' },
      1: { cellWidth: 58 },
      2: { cellWidth: 72 },
      3: { cellWidth: 52 },
      4: { cellWidth: 55 },
      5: { cellWidth: 38, halign: 'center' },
      6: { cellWidth: 36, halign: 'center' },
      7: { cellWidth: 70, halign: 'center' },
      8: { cellWidth: 38, halign: 'center' },
      9: { cellWidth: 62, halign: 'center' },
    },
    willDrawCell(data) {
      if (data.section !== 'body') return
      if (data.column.index === 7 || data.column.index === 9) data.cell.text = []
    },
    didDrawCell(data) {
      if (data.section !== 'body') return
      const { x, y, width, height } = data.cell

      if (data.column.index === 7) {
        const raw   = String(data.cell.raw)
        const parts = raw.split('/')
        const done  = parseInt(parts[0]) || 0
        const total = parseInt(parts[1]) || 0
        const pct   = total > 0 ? done / total : 0
        const bx = x + 6, by = y + height - 9, bw = width - 12, bh = 5
        doc.setFillColor(...C.barBg)
        doc.roundedRect(bx, by, bw, bh, 2, 2, 'F')
        if (pct > 0) {
          doc.setFillColor(...C.accent)
          doc.roundedRect(bx, by, bw * pct, bh, 2, 2, 'F')
        }
        doc.setTextColor(...C.dark)
        doc.setFontSize(8)
        doc.setFont(undefined, 'normal')
        doc.text(raw, x + width / 2, y + 9, { align: 'center' })
      }

      if (data.column.index === 9) {
        const s   = String(data.cell.raw)
        const col = STATUS_COL[s] || C.accent
        doc.setFillColor(col[0], col[1], col[2], 0.15)
        doc.roundedRect(x + 4, y + 4, width - 8, height - 8, 4, 4, 'F')
        doc.setTextColor(...col)
        doc.setFontSize(7.5)
        doc.setFont(undefined, 'bold')
        doc.text(s, x + width / 2, y + height / 2 + 2.5, { align: 'center' })
      }

      if (data.column.index === 8) {
        const v = parseInt(data.cell.raw) || 0
        if (v > 0) {
          data.cell.text = []
          doc.setTextColor(...C.red)
          doc.setFontSize(8.5)
          doc.setFont(undefined, 'bold')
          doc.text(String(v), x + width / 2, y + height / 2 + 2.5, { align: 'center' })
        }
      }
    },
  })

  pdfFooter(doc)
  doc.save(`schedule-report-${fileSlug(meta.date)}.pdf`)
}

// ── Schedule Excel export ─────────────────────────────────────────────────────

async function exportScheduleExcel(rows, meta) {
  const XLSX = await import('xlsx')
  const wb   = XLSX.utils.book_new()

  const counts = rows.reduce((a, r) => {
    a[r.status] = (a[r.status] || 0) + 1
    return a
  }, {})

  const wsSum = XLSX.utils.aoa_to_sheet([
    ['SCHEDULED LIST REPORT'],
    [],
    ['Generated',     nowStr()],
    ['Date',          fmtDate(meta.date)],
    ['Unit',          meta.unit || 'All'],
    ['Filter',        meta.tab  || 'All'],
    ['Total Records', rows.length],
    [],
    ['STATUS BREAKDOWN'],
    ['Status', 'Count'],
    ...Object.entries(counts),
  ])
  wsSum['!cols'] = [{ wch: 22 }, { wch: 28 }]
  XLSX.utils.book_append_sheet(wb, wsSum, 'Summary')

  const HDR = ['#', 'Employee ID', 'Name', 'Login Time', 'Task', 'Round',
               'Total Pts', 'Done', 'Remaining', 'Progress %', 'Missed', 'Status']

  const body = rows.map((r, i) => {
    const done  = r.tripDone  ?? 0
    const total = r.tripTotal ?? 0
    return [
      i + 1, r.id ?? r.empId ?? '', r.name ?? '', r.loginTime ?? '',
      r.task ?? '', r.round ?? '', total, done, total - done,
      total > 0 ? Math.round(done / total * 100) : 0,
      r.missed ?? 0, r.status ?? '',
    ]
  })

  const wsAll = XLSX.utils.aoa_to_sheet([HDR, ...body])
  wsAll['!cols'] = [
    { wch: 5 }, { wch: 14 }, { wch: 22 }, { wch: 12 }, { wch: 14 }, { wch: 8 },
    { wch: 12 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 14 },
  ]
  XLSX.utils.book_append_sheet(wb, wsAll, 'All Data')

  ;['Complete', 'Ongoing', 'Missed', 'Upcoming'].forEach(status => {
    const filtered = rows.filter(r => r.status === status)
    if (!filtered.length) return

    const ws = XLSX.utils.aoa_to_sheet([
      HDR,
      ...filtered.map((r, i) => {
        const done  = r.tripDone  ?? 0
        const total = r.tripTotal ?? 0
        return [
          i + 1, r.id ?? r.empId ?? '', r.name ?? '', r.loginTime ?? '',
          r.task ?? '', r.round ?? '', total, done, total - done,
          total > 0 ? Math.round(done / total * 100) : 0,
          r.missed ?? 0, r.status ?? '',
        ]
      }),
    ])
    ws['!cols'] = [
      { wch: 5 }, { wch: 14 }, { wch: 22 }, { wch: 12 }, { wch: 14 }, { wch: 8 },
      { wch: 12 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 14 },
    ]
    XLSX.utils.book_append_sheet(wb, ws, status)
  })

  XLSX.writeFile(wb, `schedule-report-${fileSlug(meta.date)}.xlsx`)
}

// ── Efficient Employees PDF export ────────────────────────────────────────────

async function exportEffPDF(employees, meta) {
  const { default: jsPDF }     = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc     = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const PW      = doc.internal.pageSize.getWidth()
  const podCols = [C.gold, C.silver, C.bronze]

  pdfHeader(doc, 'EFFICIENT EMPLOYEES REPORT', [
    `Date: ${fmtDate(meta.date)}`,
    `Unit: ${meta.unit || 'All'}`,
    `Employees: ${employees.length}`,
  ])

  // Top 3 podium cards
  const top3   = employees.slice(0, 3)
  const cards  = [
    { emp: top3[0], rank: '#1', x: 36  },
    { emp: top3[1], rank: '#2', x: 198 },
    { emp: top3[2], rank: '#3', x: 360 },
  ]
  const cardY = 88
  const cardH = 68

  cards.forEach(({ emp, rank, x }, i) => {
    if (!emp) return
    const col = podCols[i]
    const pct = Math.round((emp.score / emp.maxScore) * 100)

    doc.setFillColor(col[0], col[1], col[2], 0.08)
    doc.roundedRect(x, cardY, 152, cardH, 6, 6, 'F')
    doc.setDrawColor(...col)
    doc.setLineWidth(1.2)
    doc.roundedRect(x, cardY, 152, cardH, 6, 6, 'S')

    // Rank badge
    doc.setFillColor(...col)
    doc.roundedRect(x + 6, cardY + 8, 22, 22, 4, 4, 'F')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text(rank, x + 17, cardY + 22, { align: 'center' })

    // Name & ID
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(...C.dark)
    doc.text(emp.name, x + 36, cardY + 22)
    doc.setFontSize(8)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(...C.muted)
    doc.text(`ID: ${emp.empId}`, x + 36, cardY + 34)

    // Score
    doc.setFontSize(13)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(...col)
    doc.text(`${emp.score}/${emp.maxScore}`, x + 36, cardY + 50)
    doc.setFontSize(8)
    doc.setTextColor(...C.muted)
    doc.setFont(undefined, 'normal')
    doc.text(`${pct}%`, x + 112, cardY + 50)

    // Progress bar
    const bx = x + 36, by = cardY + 58, bw = 110, bh = 4
    doc.setFillColor(...C.barBg)
    doc.roundedRect(bx, by, bw, bh, 2, 2, 'F')
    doc.setFillColor(...col)
    doc.roundedRect(bx, by, bw * (pct / 100), bh, 2, 2, 'F')
  })

  doc.setDrawColor(...C.accent)
  doc.setLineWidth(0.5)
  doc.line(36, cardY + cardH + 10, PW - 36, cardY + cardH + 10)

  autoTable(doc, {
    startY: cardY + cardH + 20,
    margin: { left: 36, right: 36 },
    head: [['Rank', 'Employee ID', 'Employee Name', 'Score', 'Max', 'Efficiency', 'Grade', 'Performance']],
    body: employees.map((emp, i) => {
      const pct   = Math.round((emp.score / emp.maxScore) * 100)
      const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D'
      return [i + 1, emp.empId, emp.name, emp.score, emp.maxScore, `${pct}%`, grade, pct]
    }),
    styles: {
      fontSize: 8.5,
      cellPadding: { top: 5, bottom: 5, left: 7, right: 7 },
      textColor: C.dark,
      lineColor: [230, 235, 245],
      lineWidth: 0.4,
    },
    headStyles: {
      fillColor: C.accent,
      textColor: C.white,
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: { top: 7, bottom: 7, left: 7, right: 7 },
    },
    alternateRowStyles: { fillColor: C.rowAlt },
    columnStyles: {
      0: { cellWidth: 34, halign: 'center' },
      1: { cellWidth: 62 },
      2: { cellWidth: 82 },
      3: { cellWidth: 36, halign: 'center' },
      4: { cellWidth: 36, halign: 'center' },
      5: { cellWidth: 50, halign: 'center' },
      6: { cellWidth: 36, halign: 'center' },
      7: { cellWidth: 80 },
    },
    willDrawCell(data) {
      if (data.section === 'body' && data.column.index === 7) data.cell.text = []
    },
    didDrawCell(data) {
      if (data.section !== 'body') return
      const { x, y, width, height } = data.cell

      if (data.column.index === 0) {
        const rank = parseInt(data.cell.raw)
        if (rank <= 3) {
          const col = podCols[rank - 1]
          data.cell.text = []
          doc.setFillColor(col[0], col[1], col[2], 0.15)
          doc.roundedRect(x + 4, y + 3, width - 8, height - 6, 3, 3, 'F')
          doc.setTextColor(...col)
          doc.setFontSize(9)
          doc.setFont(undefined, 'bold')
          doc.text(String(rank), x + width / 2, y + height / 2 + 3, { align: 'center' })
        }
      }

      if (data.column.index === 5) {
        const pct = parseInt(data.cell.raw)
        const col = pct >= 80 ? C.green : pct >= 60 ? C.orange : C.red
        data.cell.text = []
        doc.setTextColor(...col)
        doc.setFontSize(8.5)
        doc.setFont(undefined, 'bold')
        doc.text(data.cell.raw, x + width / 2, y + height / 2 + 3, { align: 'center' })
      }

      if (data.column.index === 7) {
        const pct = parseInt(data.cell.raw) || 0
        const col = pct >= 80 ? C.green : pct >= 60 ? C.orange : C.red
        const bx = x + 4, by = y + height / 2 - 3, bw = width - 8, bh = 6
        doc.setFillColor(...C.barBg)
        doc.roundedRect(bx, by, bw, bh, 2, 2, 'F')
        if (pct > 0) {
          doc.setFillColor(...col)
          doc.roundedRect(bx, by, bw * (pct / 100), bh, 2, 2, 'F')
        }
      }
    },
  })

  pdfFooter(doc)
  doc.save(`efficient-employees-${fileSlug(meta.date)}.pdf`)
}

// ── Efficient Employees Excel export ─────────────────────────────────────────

async function exportEffExcel(employees, meta) {
  const XLSX = await import('xlsx')
  const wb   = XLSX.utils.book_new()

  const avg = employees.length
    ? Math.round(
        employees.reduce((s, e) => s + Math.round((e.score / e.maxScore) * 100), 0) / employees.length
      )
    : 0
  const top = employees[0]

  const wsSum = XLSX.utils.aoa_to_sheet([
    ['EFFICIENT EMPLOYEES REPORT'],
    [],
    ['Generated',        nowStr()],
    ['Date',             fmtDate(meta.date)],
    ['Unit',             meta.unit || 'All'],
    ['Total Employees',  employees.length],
    ['Avg Efficiency %', `${avg}%`],
    ['Top Performer',    top ? `${top.name} (${top.empId})` : '—'],
    ['Top Score',        top ? `${top.score}/${top.maxScore}` : '—'],
  ])
  wsSum['!cols'] = [{ wch: 22 }, { wch: 32 }]
  XLSX.utils.book_append_sheet(wb, wsSum, 'Summary')

  const HDR   = ['Rank', 'Employee ID', 'Name', 'Score', 'Max Score', 'Efficiency %', 'Grade']
  const toRow = (emp, i) => {
    const pct   = Math.round((emp.score / emp.maxScore) * 100)
    const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D'
    return [i + 1, emp.empId, emp.name, emp.score, emp.maxScore, pct, grade]
  }

  const wsRank = XLSX.utils.aoa_to_sheet([HDR, ...employees.map(toRow)])
  wsRank['!cols'] = [{ wch: 6 }, { wch: 14 }, { wch: 24 }, { wch: 8 }, { wch: 10 }, { wch: 14 }, { wch: 8 }]
  XLSX.utils.book_append_sheet(wb, wsRank, 'Rankings')

  const bands = [
    { name: 'Excellent (A+, A)', test: p => p >= 80 },
    { name: 'Average  (B, C)',   test: p => p >= 60 && p < 80 },
    { name: 'Needs Improvement', test: p => p < 60 },
  ]

  bands.forEach(({ name, test }) => {
    const filtered = employees.filter(e => test(Math.round((e.score / e.maxScore) * 100)))
    if (!filtered.length) return
    const ws = XLSX.utils.aoa_to_sheet([[name], [], HDR, ...filtered.map(toRow)])
    ws['!cols'] = [{ wch: 6 }, { wch: 14 }, { wch: 24 }, { wch: 8 }, { wch: 10 }, { wch: 14 }, { wch: 8 }]
    XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31))
  })

  XLSX.writeFile(wb, `efficient-employees-${fileSlug(meta.date)}.xlsx`)
}

// ── Download Dropdown ─────────────────────────────────────────────────────────

function DownloadDropdown({ onPDF, onExcel, disabled }) {
  const triggerRef = useRef(null)

  const speaker = (
    <Popover className="dl-popover" arrow={false}>
      <div className="dl-menu">
        <Button
          appearance="subtle"
          className="dl-item dl-item-pdf"
          startIcon={<BsFilePdf size={14} />}
          onClick={() => { triggerRef.current?.close(); onPDF?.() }}
        >
          Download PDF
        </Button>
        <Button
          appearance="subtle"
          className="dl-item dl-item-excel"
          startIcon={<BsFileEarmarkExcel size={14} />}
          onClick={() => { triggerRef.current?.close(); onExcel?.() }}
        >
          Download Excel
        </Button>
      </div>
    </Popover>
  )

  return (
    <Whisper ref={triggerRef} placement="bottomEnd" trigger="click" speaker={speaker}>
      <IconButton
        icon={<BsDownload size={13} />}
        size="xs"
        appearance="subtle"
        disabled={disabled}
        title="Download report"
        className="dl-trigger-btn"
      />
    </Whisper>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Schedule() {
  const navigate = useNavigate()
  const location = useLocation()

  const { unit } = useFilter()
  const [date, setDate] = useState(new Date(2025, 1, 20))

  const [tab,         setTab]         = useState(location.state?.initialTab ?? 'All')
  const [selectedRow, setSelectedRow] = useState(null)

  useEffect(() => {
    if (location.state?.initialTab) {
      setTab(location.state.initialTab)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state?.initialTab])

  const [list, setList] = useState(EMPTY)
  const [eff,  setEff]  = useState(EMPTY)
  const fetchId = useRef(0)
  const dateStr = useMemo(() => toStr(date), [date])

  useEffect(() => {
    const id = ++fetchId.current
    const f  = { unit, date: dateStr }
    setList(EMPTY); setEff(EMPTY); setSelectedRow(null)
    const safe = s => d => { if (id !== fetchId.current) return; s({ data: d, loading: false, error: null }) }
    const fail = s => e => { if (id !== fetchId.current) return; s({ data: null, loading: false, error: e.message }) }
    fetchScheduleList(f).then(safe(setList)).catch(fail(setList))
    fetchEfficientEmployees(f).then(safe(setEff)).catch(fail(setEff))
  }, [unit, dateStr])

  useEffect(() => {
    if (list.data?.length && !selectedRow) setSelectedRow(list.data[0])
  }, [list.data])

  const rows = useMemo(() => {
    if (!list.data) return []
    return tab === 'All' ? list.data : list.data.filter(r => r.status === tab)
  }, [list.data, tab])

  const dlMeta       = useMemo(() => ({ date, unit, tab }), [date, unit, tab])
  const effEmployees = eff.data?.employees ?? []

  return (
    <div className="schedule-page">
      <FilterBar />

      <div className="sched-body">
        <Panel
          className="sched-left-panel"
          header={
            <div className="sched-panel-header">
              <span className="sched-header-title">Scheduled List</span>
              <DownloadDropdown
                onPDF={()   => exportSchedulePDF(rows, dlMeta)}
                onExcel={() => exportScheduleExcel(rows, dlMeta)}
                disabled={list.loading || !rows.length}
              />
            </div>
          }
        >
          {/* marginTop: -8 removes RSuite Panel's default body top padding
              that was causing the gap between the header and tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden', marginTop: -8 }}>
            <Nav
              activeKey={tab}
              onSelect={setTab}
              appearance="subtle"
              className="sched-tabs-nav"
              style={{ padding: '0 6px', borderBottom: '2px solid var(--sched-tabs-border)', flexShrink: 0 }}
            >
              {TABS.map(t => (
                <Nav.Item
                  key={t}
                  eventKey={t}
                  className="sched-tab-item"
                  style={{
                    fontSize: 12.5,
                    fontWeight: tab === t ? 700 : 500,
                    color: tab === t ? 'var(--accent)' : 'var(--t3)',
                    padding: '4px 12px 6px',
                  }}
                >
                  {t}
                </Nav.Item>
              ))}
            </Nav>

            <div className="sched-ts-wrap">
              <TodayScheduled
                data={rows}
                loading={list.loading}
                error={list.error}
                showIndex
                showAction
                selectedRow={selectedRow}
                onRowSelect={setSelectedRow}
                onAction={row => navigate(`/schedule/trip/${row.tripId}`)}
              />
            </div>
          </div>
        </Panel>

        <div className="sched-right">
          <MiniCalendar
            selectedDate={date}
            onDateSelect={setDate}
            onMultiSelect={dates => { if (dates?.length) setDate(dates[0]) }}
          />
          <EfficientEmployees
            data={eff.data}
            loading={eff.loading}
            error={eff.error}
            onDownloadPDF={()   => exportEffPDF(effEmployees, dlMeta)}
            onDownloadExcel={() => exportEffExcel(effEmployees, dlMeta)}
          />
        </div>
      </div>
    </div>
  )
}