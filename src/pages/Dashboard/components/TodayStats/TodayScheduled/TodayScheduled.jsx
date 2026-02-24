

import { useState, useCallback } from 'react'
import { Table, Tag, Loader, Progress } from 'rsuite'
import './TodayScheduled.css'

const { Column, HeaderCell, Cell } = Table

const STATUS_COLORS = {
  Ongoing:   'orange',
  Complete:  'green',
  Pending:   'blue',
  Cancelled: 'red',
}

const hStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: '#9aaec4',
  letterSpacing: '0.2px',
  padding: '0 6px',
}

/* ── Cells ───────────────────────────────────────────── */
function NameCell({ rowData, ...props }) {
  return (
    <Cell {...props}>
      <div style={{ minWidth: 0, overflow: 'hidden' }}>
        <div className="name-main">{rowData.name}</div>
        <div className="name-sub">{rowData.login}</div>
      </div>
    </Cell>
  )
}

function TripTypeCell({ rowData, ...props }) {
  return (
    <Cell {...props}>
      <Tag
        size="sm"
        style={{
          fontWeight: 700,
          fontSize: 10.5,
          background: '#4a6cf7',
          color: '#fff',
          border: 'none',
          borderRadius: 20,
          padding: '2px 8px',
          whiteSpace: 'nowrap',
          display: 'inline-block',
        }}
      >
        {rowData.tripType}
      </Tag>
    </Cell>
  )
}

function ProgressCell({ rowData, ...props }) {
  const pct = rowData.total > 0
    ? Math.round((rowData.done / rowData.total) * 100)
    : 0
  return (
    <Cell {...props}>
      <div className="prog-cell">
        <Progress.Line
          percent={pct}
          strokeWidth={4}
          showInfo={false}
          strokeColor="#3b7ff5"
          style={{ padding: 0 }}
        />
        <span className="prog-txt">{rowData.done}/{rowData.total}</span>
      </div>
    </Cell>
  )
}

function MissedCell({ rowData, ...props }) {
  return (
    <Cell {...props}>
      <span style={{ color: '#f05252', fontWeight: 700, fontSize: 13 }}>
        {rowData.missed}
      </span>
    </Cell>
  )
}

function StatusCell({ rowData, ...props }) {
  const color = STATUS_COLORS[rowData.status] || 'blue'
  return (
    <Cell {...props}>
      <Tag
        color={color}
        size="sm"
        style={{ fontWeight: 700, fontSize: 11, borderRadius: 20, padding: '3px 10px' }}
      >
        {rowData.status}
      </Tag>
    </Cell>
  )
}

/* ── Main Component ──────────────────────────────────── */
export default function TodayScheduled({ data, loading, error }) {
  const [colW, setColW] = useState(600)

  const measuredRef = useCallback(node => {
    if (!node) return
    setColW(node.offsetWidth)
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setColW(e.contentRect.width)
    })
    ro.observe(node)
  }, [])

  const tripStatusW = Math.max(100, Math.round(colW * 0.18))

  return (
    /* sched-card overrides .card's overflow:hidden → overflow-y:auto
       so the autoHeight table is never clipped vertically            */
    <div className="card sched-card">
      <div className="card-title">Today Scheduled</div>

      <div className="sched-table-wrap" ref={measuredRef}>

        {loading && (
          <div className="card-center">
            <Loader size="sm" content="Loading..." />
          </div>
        )}

        {error && !loading && (
          <div className="card-center error-txt">⚠ {error}</div>
        )}

        {!loading && !error && (
          <Table
            data={data || []}
            autoHeight          /* grows with rows — never needs a pixel height */
            rowHeight={52}
            headerHeight={36}
            bordered={false}
            cellBordered={false}
            style={{ width: '100%' }}
            wordWrap={false}
            shouldUpdateScroll={false}
          >
            <Column width={38} fixed>
              <HeaderCell style={hStyle}>ID</HeaderCell>
              <Cell dataKey="tripId" style={{ color: '#b0bec5', fontSize: 11 }} />
            </Column>

            <Column flexGrow={1} minWidth={80}>
              <HeaderCell style={hStyle}>Name</HeaderCell>
              <NameCell dataKey="name" />
            </Column>

            <Column width={40} align="center">
              <HeaderCell style={hStyle}>Task</HeaderCell>
              <Cell dataKey="task" style={{ fontSize: 13, color: '#3d4f6e' }} />
            </Column>

            <Column width={82}>
              <HeaderCell style={hStyle}>Trip Type</HeaderCell>
              <TripTypeCell dataKey="tripType" />
            </Column>

            <Column width={44} align="center">
              <HeaderCell style={hStyle}>Total</HeaderCell>
              <Cell dataKey="total" style={{ fontSize: 13, color: '#3d4f6e' }} />
            </Column>

            <Column width={tripStatusW}>
              <HeaderCell style={hStyle}>Trip Status</HeaderCell>
              <ProgressCell dataKey="done" />
            </Column>

            <Column width={56} align="center">
              <HeaderCell style={hStyle}>Missed</HeaderCell>
              <MissedCell dataKey="missed" />
            </Column>

            <Column width={82} fixed="right">
              <HeaderCell style={hStyle}>Status</HeaderCell>
              <StatusCell dataKey="status" />
            </Column>
          </Table>
        )}
      </div>
    </div>
  )
}