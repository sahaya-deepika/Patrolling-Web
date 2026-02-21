import { Table, Tag, Loader, Progress } from 'rsuite'
import './TodayScheduled.css'

const { Column, HeaderCell, Cell } = Table

const STATUS_TAG = {
  Ongoing:   { color: 'orange' },
  Complete:  { color: 'green'  },
  Pending:   { color: 'blue'   },
  Cancelled: { color: 'red'    },
}

function ProgressCell({ rowData, dataKey, ...props }) {
  const pct = Math.round((rowData.done / rowData.total) * 100)
  return (
    <Cell {...props}>
      <div className="prog-cell">
        <Progress.Line
          percent={pct}
          strokeWidth={4}
          showInfo={false}
          strokeColor="#3b7ff5"
          style={{ width: 50, padding: 0 }}
        />
        <span className="prog-txt">{rowData.done}/{rowData.total}</span>
      </div>
    </Cell>
  )
}

function StatusCell({ rowData, ...props }) {
  const cfg = STATUS_TAG[rowData.status] || { color: 'blue' }
  return (
    <Cell {...props}>
      <Tag color={cfg.color} size="sm" style={{ fontWeight: 600, fontSize: 11 }}>
        {rowData.status}
      </Tag>
    </Cell>
  )
}

function NameCell({ rowData, ...props }) {
  return (
    <Cell {...props}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 12.5, color: '#1a2535' }}>{rowData.name}</div>
        <div style={{ fontSize: 10.5, color: '#9aaec4' }}>{rowData.login}</div>
      </div>
    </Cell>
  )
}

function TripTypeCell({ rowData, ...props }) {
  return (
    <Cell {...props}>
      <Tag color="blue" size="sm" style={{ fontWeight: 600, fontSize: 10.5, background: '#e0eaff', color: '#2463d4', border: 'none' }}>
        {rowData.tripType}
      </Tag>
    </Cell>
  )
}

function MissedCell({ rowData, ...props }) {
  return (
    <Cell {...props}>
      <span style={{ color: '#f05252', fontWeight: 700 }}>{rowData.missed}</span>
    </Cell>
  )
}

export default function TodayScheduled({ data, loading, error }) {
  return (
    <div className="card sched-card">
      <div className="card-title">Today Scheduled</div>
      <div className="sched-table-wrap">
        {loading && (
          <div className="card-center">
            <Loader size="sm" content="Loading..." />
          </div>
        )}
        {error && (
          <div className="card-center error-txt">⚠ {error}</div>
        )}
        {!loading && !error && (
          <Table
            data={data || []}
            height={data && data.length > 0 ? undefined : 80}
            autoHeight={false}
            fillHeight
            rowHeight={46}
            headerHeight={36}
            bordered={false}
            cellBordered={false}
            style={{ fontSize: 12 }}
          >
            <Column width={52} fixed>
              <HeaderCell style={hStyle}>ID</HeaderCell>
              <Cell dataKey="tripId" style={{ color: '#9aaec4', fontSize: 11 }} />
            </Column>

            <Column flexGrow={1.4} minWidth={100}>
              <HeaderCell style={hStyle}>Name</HeaderCell>
              <NameCell dataKey="name" />
            </Column>

            <Column width={46}>
              <HeaderCell style={hStyle}>Task</HeaderCell>
              <Cell dataKey="task" />
            </Column>

            <Column width={90}>
              <HeaderCell style={hStyle}>Trip Type</HeaderCell>
              <TripTypeCell dataKey="tripType" />
            </Column>

            <Column width={46}>
              <HeaderCell style={hStyle}>Total</HeaderCell>
              <Cell dataKey="total" />
            </Column>

            <Column width={110}>
              <HeaderCell style={hStyle}>Trip Status</HeaderCell>
              <ProgressCell dataKey="done" />
            </Column>

            <Column width={60}>
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

const hStyle = {
  fontSize: 10,
  fontWeight: 600,
  color: '#9aaec4',
  textTransform: 'uppercase',
  letterSpacing: '.5px',
  padding: '0 8px'
}