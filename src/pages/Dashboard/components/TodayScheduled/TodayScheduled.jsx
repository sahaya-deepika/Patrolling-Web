// import { useState, useCallback } from 'react'
// import {
//   Table, Tag, Loader, Progress, Avatar,
//   IconButton, Stack, Text,
// } from 'rsuite'
// import { BsBoxArrowUpRight } from 'react-icons/bs'
// import './TodayScheduled.css'

// const { Column, HeaderCell, Cell } = Table

// const STATUS_COLORS = {
//   Ongoing:   'orange',
//   Complete:  'green',
//   Pending:   'blue',
//   Cancelled: 'red',
//   Missed:    'red',
//   Upcoming:  'violet',
// }

// const hStyle = {
//   fontSize: 11,
//   fontWeight: 500,
//   color: '#a0aec0',
//   letterSpacing: '0.1px',
//   padding: '0 6px',
// }

// /* ── Cells ───────────────────────────────────────────── */

// function IndexCell({ rowIndex, ...props }) {
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <Text size="sm" muted>{rowIndex + 1}.</Text>
//     </Cell>
//   )
// }

// function TripIdCell({ rowData, ...props }) {
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <Text size="sm" style={{ color: '#b0bec5', fontSize: 11 }}>
//         {rowData.tripId}
//       </Text>
//     </Cell>
//   )
// }

// function NameCell({ rowData, ...props }) {
//   return (
//     <Cell {...props} style={{ padding: '6px 6px' }}>
//       <Stack spacing={7} alignItems="center" style={{ minWidth: 0, overflow: 'hidden' }}>
//         <Avatar
//           circle size="xs"
//           style={{
//             background: 'var(--accent, #3b7ff5)',
//             color: '#fff', fontWeight: 700,
//             width: 26, height: 26, fontSize: 11, flexShrink: 0,
//           }}
//         >
//           {rowData.name?.charAt(0)}
//         </Avatar>
//         <Stack direction="column" spacing={1} style={{ minWidth: 0, overflow: 'hidden' }}>
//           <Text weight="bold" style={{
//             fontSize: 12.5, color: 'var(--name-main-color)',
//             whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
//           }}>
//             {rowData.name}
//           </Text>
//           <Text size="sm" muted style={{
//             fontSize: 10, whiteSpace: 'nowrap',
//             overflow: 'hidden', textOverflow: 'ellipsis',
//           }}>
//             {rowData.login}
//           </Text>
//         </Stack>
//       </Stack>
//     </Cell>
//   )
// }

// function TaskCell({ rowData, ...props }) {
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <Text style={{ fontSize: 13, color: 'var(--t2)' }}>
//         {rowData.task}
//       </Text>
//     </Cell>
//   )
// }

// function RoundCell({ rowData, ...props }) {
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <Tag
//         size="sm"
//         style={{
//           fontWeight: 700, fontSize: 10.5,
//           background: '#4a6cf7', color: '#fff',
//           border: 'none', borderRadius: 20,
//           padding: '2px 10px', whiteSpace: 'nowrap',
//           display: 'inline-block',
//         }}
//       >
//         Round: {rowData.tripId}
//       </Tag>
//     </Cell>
//   )
// }

// function TotalCell({ rowData, ...props }) {
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <Text style={{ fontSize: 13, color: 'var(--t2)' }}>
//         {rowData.total}
//       </Text>
//     </Cell>
//   )
// }

// function ProgressCell({ rowData, ...props }) {
//   const pct = rowData.total > 0 ? Math.round((rowData.done / rowData.total) * 100) : 0
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <Stack spacing={6} alignItems="center" style={{ width: '100%', minWidth: 0 }}>
//         <Progress.Line
//           percent={pct}
//           strokeWidth={4}
//           showInfo={false}
//           strokeColor="#3b7ff5"
//           style={{ padding: 0, flex: 1, minWidth: 30 }}
//         />
//         <Text size="sm" muted style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
//           {rowData.done}/{rowData.total}
//         </Text>
//       </Stack>
//     </Cell>
//   )
// }

// function MissedCell({ rowData, ...props }) {
//   const hasMissed = rowData.missed > 0
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <Text weight="bold" style={{ fontSize: 13, color: hasMissed ? '#f05252' : 'var(--t3, #b0bec5)' }}>
//         {rowData.missed}
//       </Text>
//     </Cell>
//   )
// }

// function StatusCell({ rowData, ...props }) {
//   const color  = STATUS_COLORS[rowData.status] || 'blue'
//   const suffix = rowData.status === 'Ongoing'  ? ' ↻'
//                : rowData.status === 'Complete' ? ' ✓'
//                : ''
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <Tag
//         color={color}
//         size="sm"
//         style={{
//           fontWeight: 700, fontSize: 11,
//           borderRadius: 20, padding: '3px 12px', whiteSpace: 'nowrap',
//         }}
//       >
//         {rowData.status}{suffix}
//       </Tag>
//     </Cell>
//   )
// }

// function ActionCell({ rowData, onAction, ...props }) {
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <IconButton
//         icon={<BsBoxArrowUpRight />}
//         circle size="sm"
//         className="open-btn"
//         onClick={e => { e.stopPropagation(); onAction?.(rowData) }}
//         title="View Trip Details"
//       />
//     </Cell>
//   )
// }

// /* ══════════════════════════════════════════════════════
//    Dashboard:  <TodayScheduled data={sched.data} loading={...} error={...} />
//    Schedule:   <TodayScheduled data={rows} loading={...} error={...}
//                  showIndex showAction selectedRow={sel}
//                  onRowSelect={setSel} onAction={row => navigate(...)} />
//    ══════════════════════════════════════════════════════ */
// export default function TodayScheduled({
//   data,
//   loading,
//   error,
//   showIndex   = false,
//   showAction  = false,
//   selectedRow = null,
//   onRowSelect,
//   onAction,
// }) {
//   const [tableH, setTableH] = useState(300)

//   const measuredRef = useCallback(node => {
//     if (!node) return
//     const update = () => setTableH(node.offsetHeight || 300)
//     update()
//     const ro = new ResizeObserver(update)
//     ro.observe(node)
//   }, [])

//   const rowClassName = rowData => {
//     if (!selectedRow || !rowData) return ''
//     return selectedRow.id === rowData.id ? 'sched-table-row-selected' : ''
//   }

//   return (
//     <div className="card sched-card">
//       <div className="card-title">Today Scheduled</div>

//       <div className="sched-table-wrap" ref={measuredRef}>

//         {loading && (
//           <Stack justifyContent="center" alignItems="center" style={{ height: 80 }}>
//             <Loader size="sm" content="Loading..." />
//           </Stack>
//         )}

//         {error && !loading && (
//           <Stack justifyContent="center" alignItems="center" style={{ height: 80 }}>
//             <Text style={{ color: 'var(--red, #f05252)' }}>⚠ {error}</Text>
//           </Stack>
//         )}

//         {!loading && !error && (
//           <Table
//             data={data || []}
//             height={tableH}
//             rowHeight={52}
//             headerHeight={36}
//             bordered={false}
//             cellBordered={false}
//             style={{ width: '100%' }}
//             wordWrap={false}
//             shouldUpdateScroll={false}
//             rowClassName={rowClassName}
//             onRowClick={row => onRowSelect?.(row)}
//           >
//             {showIndex && (
//               <Column width={32}>
//                 <HeaderCell style={hStyle}>#</HeaderCell>
//                 <IndexCell />
//               </Column>
//             )}

//             <Column width={52} fixed>
//               <HeaderCell style={hStyle}>ID</HeaderCell>
//               <TripIdCell />
//             </Column>

//             <Column flexGrow={1} minWidth={90}>
//               <HeaderCell style={hStyle}>Name</HeaderCell>
//               <NameCell />
//             </Column>

//             <Column width={80} align="center">
//               <HeaderCell style={hStyle}>Task</HeaderCell>
//               <TaskCell />
//             </Column>

//             <Column width={90} align="center">
//               <HeaderCell style={hStyle}>Round</HeaderCell>
//               <RoundCell />
//             </Column>

//             <Column width={46} align="center">
//               <HeaderCell style={hStyle}>Total</HeaderCell>
//               <TotalCell />
//             </Column>

//             <Column flexGrow={1} minWidth={110}>
//               <HeaderCell style={hStyle}>Trip Status</HeaderCell>
//               <ProgressCell />
//             </Column>

//             <Column width={60} align="center">
//               <HeaderCell style={hStyle}>Missed</HeaderCell>
//               <MissedCell />
//             </Column>

//             <Column width={showAction ? 100 : 96} fixed="right" align="center">
//               <HeaderCell style={hStyle}>Status</HeaderCell>
//               <StatusCell />
//             </Column>

//             {showAction && (
//               <Column width={44} fixed="right" align="center">
//                 <HeaderCell style={hStyle}> </HeaderCell>
//                 <ActionCell onAction={onAction} />
//               </Column>
//             )}
//           </Table>
//         )}
//       </div>
//     </div>
//   )
// }

// import { useState, useCallback } from 'react'
// import {
//   Table, Tag, Loader, Progress, Avatar,
//   IconButton, Stack, Text, Badge,
// } from 'rsuite'
// import { BsBoxArrowUpRight } from 'react-icons/bs'
// import './TodayScheduled.css'

// const { Column, HeaderCell, Cell } = Table

// const STATUS_COLORS = {
//   Ongoing:   'orange',
//   Complete:  'green',
//   Pending:   'blue',
//   Cancelled: 'red',
//   Missed:    'red',
//   Upcoming:  'violet',
// }

// const hStyle = {
//   fontSize: 11,
//   fontWeight: 500,
//   color: '#a0aec0',
//   letterSpacing: '0.1px',
//   padding: '0 6px',
// }

// /* ── Cells ───────────────────────────────────────────── */

// function IndexCell({ rowIndex, ...props }) {
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <Text size="sm" muted>{rowIndex + 1}.</Text>
//     </Cell>
//   )
// }

// function TripIdCell({ rowData, ...props }) {
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <Text size="sm" style={{ color: '#b0bec5', fontSize: 11 }}>
//         {rowData.tripId}
//       </Text>
//     </Cell>
//   )
// }

// function NameCell({ rowData, ...props }) {
//   return (
//     <Cell {...props} style={{ padding: '6px 6px' }}>
//       <Stack spacing={7} alignItems="center" style={{ minWidth: 0, overflow: 'hidden' }}>
//         <Avatar
//           circle size="xs"
//           style={{
//             background: 'var(--accent, #3b7ff5)',
//             color: '#fff', fontWeight: 700,
//             width: 26, height: 26, fontSize: 11, flexShrink: 0,
//           }}
//         >
//           {rowData.name?.charAt(0)}
//         </Avatar>
//         <Stack direction="column" spacing={1} style={{ minWidth: 0, overflow: 'hidden' }}>
//           <Text weight="bold" style={{
//             fontSize: 12.5, color: 'var(--name-main-color)',
//             whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
//           }}>
//             {rowData.name}
//           </Text>
//           <Text size="sm" muted style={{
//             fontSize: 10, whiteSpace: 'nowrap',
//             overflow: 'hidden', textOverflow: 'ellipsis',
//           }}>
//             {rowData.login}
//           </Text>
//         </Stack>
//       </Stack>
//     </Cell>
//   )
// }

// function TaskCell({ rowData, ...props }) {
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <Text style={{ fontSize: 13, color: 'var(--t2)' }}>
//         {rowData.task}
//       </Text>
//     </Cell>
//   )
// }

// /* ✅ Round column — shows "Round: N" from tripId */
// function RoundCell({ rowData, ...props }) {
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <Tag
//         size="sm"
//         style={{
//           fontWeight: 700, fontSize: 10.5,
//           background: '#4a6cf7', color: '#fff',
//           border: 'none', borderRadius: 20,
//           padding: '2px 10px', whiteSpace: 'nowrap',
//           display: 'inline-block',
//         }}
//       >
//         Round: {rowData.tripId}
//       </Tag>
//     </Cell>
//   )
// }

// function TotalCell({ rowData, ...props }) {
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <Text style={{ fontSize: 13, color: 'var(--t2)' }}>
//         {rowData.total}
//       </Text>
//     </Cell>
//   )
// }

// function ProgressCell({ rowData, ...props }) {
//   const pct = rowData.total > 0 ? Math.round((rowData.done / rowData.total) * 100) : 0
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <Stack spacing={6} alignItems="center" style={{ width: '100%', minWidth: 0 }}>
//         <Progress.Line
//           percent={pct}
//           strokeWidth={4}
//           showInfo={false}
//           strokeColor="#3b7ff5"
//           style={{ padding: 0, flex: 1, minWidth: 30 }}
//         />
//         <Text size="sm" muted style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
//           {rowData.done}/{rowData.total}
//         </Text>
//       </Stack>
//     </Cell>
//   )
// }

// /* ✅ Fixed: Badge wraps empty span — number shown ONLY inside Badge, no double display */
// function MissedCell({ rowData, ...props }) {
//   const hasMissed = rowData.missed > 0
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       {hasMissed ? (
//         <Badge content={rowData.missed} color="red">
//           <span style={{ display: 'inline-block', width: 10, height: 10 }} />
//         </Badge>
//       ) : (
//         <Text weight="bold" style={{ color: 'var(--t3, #b0bec5)', fontSize: 13 }}>
//           0
//         </Text>
//       )}
//     </Cell>
//   )
// }

// function StatusCell({ rowData, ...props }) {
//   const color  = STATUS_COLORS[rowData.status] || 'blue'
//   const suffix = rowData.status === 'Ongoing'  ? ' ↻'
//                : rowData.status === 'Complete' ? ' ✓'
//                : ''
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <Tag
//         color={color}
//         size="sm"
//         style={{
//           fontWeight: 700, fontSize: 11,
//           borderRadius: 20, padding: '3px 12px', whiteSpace: 'nowrap',
//         }}
//       >
//         {rowData.status}{suffix}
//       </Tag>
//     </Cell>
//   )
// }

// function ActionCell({ rowData, onAction, ...props }) {
//   return (
//     <Cell {...props} style={{ padding: '0 6px' }}>
//       <IconButton
//         icon={<BsBoxArrowUpRight />}
//         circle size="sm"
//         className="open-btn"
//         onClick={e => { e.stopPropagation(); onAction?.(rowData) }}
//         title="View Trip Details"
//       />
//     </Cell>
//   )
// }

// /* ══════════════════════════════════════════════════════
//    Dashboard:  <TodayScheduled data={sched.data} loading={...} error={...} />
//    Schedule:   <TodayScheduled data={rows} loading={...} error={...}
//                  showIndex showAction selectedRow={sel}
//                  onRowSelect={setSel} onAction={row => navigate(...)} />
//    ══════════════════════════════════════════════════════ */
// export default function TodayScheduled({
//   data,
//   loading,
//   error,
//   showIndex   = false,
//   showAction  = false,
//   selectedRow = null,
//   onRowSelect,
//   onAction,
// }) {
//   const [tableH, setTableH] = useState(300)

//   const measuredRef = useCallback(node => {
//     if (!node) return
//     const update = () => setTableH(node.offsetHeight || 300)
//     update()
//     const ro = new ResizeObserver(update)
//     ro.observe(node)
//   }, [])

//   const tripStatusW = 120

//   const rowClassName = rowData => {
//     if (!selectedRow || !rowData) return ''
//     return selectedRow.id === rowData.id ? 'sched-table-row-selected' : ''
//   }

//   return (
//     <div className="card sched-card">
//       <div className="card-title">Today Scheduled</div>

//       <div className="sched-table-wrap" ref={measuredRef}>

//         {loading && (
//           <Stack justifyContent="center" alignItems="center" style={{ height: 80 }}>
//             <Loader size="sm" content="Loading..." />
//           </Stack>
//         )}

//         {error && !loading && (
//           <Stack justifyContent="center" alignItems="center" style={{ height: 80 }}>
//             <Text style={{ color: 'var(--red, #f05252)' }}>⚠ {error}</Text>
//           </Stack>
//         )}

//         {!loading && !error && (
//           <Table
//             data={data || []}
//             height={tableH}
//             rowHeight={52}
//             headerHeight={36}
//             bordered={false}
//             cellBordered={false}
//             style={{ width: '100%' }}
//             wordWrap={false}
//             shouldUpdateScroll={false}
//             rowClassName={rowClassName}
//             onRowClick={row => onRowSelect?.(row)}
//           >
//             {showIndex && (
//               <Column width={32}>
//                 <HeaderCell style={hStyle}>#</HeaderCell>
//                 <IndexCell />
//               </Column>
//             )}

//             <Column width={52} fixed>
//               <HeaderCell style={hStyle}>ID</HeaderCell>
//               <TripIdCell />
//             </Column>

//             <Column flexGrow={1} minWidth={90}>
//               <HeaderCell style={hStyle}>Name</HeaderCell>
//               <NameCell />
//             </Column>

//             <Column width={80} align="center">
//               <HeaderCell style={hStyle}>Task</HeaderCell>
//               <TaskCell />
//             </Column>

//             {/* ✅ Header: Round | Value: Round: N */}
//             <Column width={90} align="center">
//               <HeaderCell style={hStyle}>Round</HeaderCell>
//               <RoundCell />
//             </Column>

//             <Column width={46} align="center">
//               <HeaderCell style={hStyle}>Total</HeaderCell>
//               <TotalCell />
//             </Column>

//             <Column width={tripStatusW}>
//               <HeaderCell style={hStyle}>Trip Status</HeaderCell>
//               <ProgressCell />
//             </Column>

//             {/* ✅ Wider so badge doesn't overflow */}
//             <Column width={66} align="center">
//               <HeaderCell style={hStyle}>Missed</HeaderCell>
//               <MissedCell />
//             </Column>

//             <Column width={showAction ? 100 : 96} fixed="right" align="center">
//               <HeaderCell style={hStyle}>Status</HeaderCell>
//               <StatusCell />
//             </Column>

//             {showAction && (
//               <Column width={44} fixed="right" align="center">
//                 <HeaderCell style={hStyle}> </HeaderCell>
//                 <ActionCell onAction={onAction} />
//               </Column>
//             )}
//           </Table>
//         )}
//       </div>
//     </div>
//   )
// }

import { useState, useCallback } from 'react'
import {
  Table, Tag, Loader, Progress, Avatar,
  IconButton, Stack, Text,
} from 'rsuite'
import { BsBoxArrowUpRight } from 'react-icons/bs'
import './TodayScheduled.css'

const { Column, HeaderCell, Cell } = Table

const STATUS_COLORS = {
  Ongoing:   'orange',
  Complete:  'green',
  Pending:   'blue',
  Cancelled: 'red',
  Missed:    'red',
  Upcoming:  'violet',
}

const hStyle = {
  fontSize: 11,
  fontWeight: 500,
  color: '#a0aec0',
  letterSpacing: '0.1px',
  padding: '0 6px',
}

/* ── Cells ───────────────────────────────────────────── */

function IndexCell({ rowIndex, ...props }) {
  return (
    <Cell {...props} style={{ padding: '0 6px' }}>
      <Text size="sm" muted>{rowIndex + 1}.</Text>
    </Cell>
  )
}

function TripIdCell({ rowData, ...props }) {
  return (
    <Cell {...props} style={{ padding: '0 6px' }}>
      <Text size="sm" style={{ color: '#b0bec5', fontSize: 11 }}>
        {rowData.tripId}
      </Text>
    </Cell>
  )
}

function NameCell({ rowData, ...props }) {
  return (
    <Cell {...props} style={{ padding: '6px 6px' }}>
      <Stack spacing={7} alignItems="center" style={{ minWidth: 0, overflow: 'hidden' }}>
        <Avatar
          circle size="xs"
          style={{
            background: 'var(--accent, #3b7ff5)',
            color: '#fff', fontWeight: 700,
            width: 26, height: 26, fontSize: 11, flexShrink: 0,
          }}
        >
          {rowData.name?.charAt(0)}
        </Avatar>
        <Stack direction="column" spacing={1} style={{ minWidth: 0, overflow: 'hidden' }}>
          <Text weight="bold" style={{
            fontSize: 12.5, color: 'var(--name-main-color)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {rowData.name}
          </Text>
          <Text size="sm" muted style={{
            fontSize: 10, whiteSpace: 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {rowData.login}
          </Text>
        </Stack>
      </Stack>
    </Cell>
  )
}

function TaskCell({ rowData, ...props }) {
  return (
    <Cell {...props} style={{ padding: '0 6px' }}>
      <Text style={{ fontSize: 13, color: 'var(--t2)' }}>
        {rowData.task}
      </Text>
    </Cell>
  )
}

function RoundCell({ rowData, ...props }) {
  return (
    <Cell {...props} style={{ padding: '0 6px' }}>
      <Tag
        size="sm"
        style={{
          fontWeight: 700, fontSize: 10.5,
          background: '#4a6cf7', color: '#fff',
          border: 'none', borderRadius: 20,
          padding: '2px 10px', whiteSpace: 'nowrap',
          display: 'inline-block',
        }}
      >
        Round: {rowData.tripId}
      </Tag>
    </Cell>
  )
}

function TotalCell({ rowData, ...props }) {
  return (
    <Cell {...props} style={{ padding: '0 6px' }}>
      <Text style={{ fontSize: 13, color: 'var(--t2)' }}>
        {rowData.total}
      </Text>
    </Cell>
  )
}

function ProgressCell({ rowData, ...props }) {
  const pct = rowData.total > 0 ? Math.round((rowData.done / rowData.total) * 100) : 0
  return (
    <Cell {...props} style={{ padding: '0 6px' }}>
      <Stack spacing={6} alignItems="center" style={{ width: '100%', minWidth: 0 }}>
        <Progress.Line
          percent={pct}
          strokeWidth={4}
          showInfo={false}
          strokeColor="#3b7ff5"
          style={{ padding: 0, flex: 1, minWidth: 30 }}
        />
        <Text size="sm" muted style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
          {rowData.done}/{rowData.total}
        </Text>
      </Stack>
    </Cell>
  )
}

function MissedCell({ rowData, ...props }) {
  const hasMissed = rowData.missed > 0
  return (
    <Cell {...props} style={{ padding: '0 6px' }}>
      <Text weight="bold" style={{ fontSize: 13, color: hasMissed ? '#f05252' : 'var(--t3, #b0bec5)' }}>
        {rowData.missed}
      </Text>
    </Cell>
  )
}

function StatusCell({ rowData, ...props }) {
  const color  = STATUS_COLORS[rowData.status] || 'blue'
  const suffix = rowData.status === 'Ongoing'  ? ' ↻'
               : rowData.status === 'Complete' ? ' ✓'
               : ''
  return (
    <Cell {...props} style={{ padding: '0 6px' }}>
      <Tag
        color={color}
        size="sm"
        style={{
          fontWeight: 700, fontSize: 11,
          borderRadius: 20, padding: '3px 12px', whiteSpace: 'nowrap',
        }}
      >
        {rowData.status}{suffix}
      </Tag>
    </Cell>
  )
}

function ActionCell({ rowData, onAction, ...props }) {
  return (
    <Cell {...props} style={{ padding: '0 6px' }}>
      <IconButton
        icon={<BsBoxArrowUpRight />}
        circle size="sm"
        className="open-btn"
        onClick={e => { e.stopPropagation(); onAction?.(rowData) }}
        title="View Trip Details"
      />
    </Cell>
  )
}

/* ══════════════════════════════════════════════════════
   Dashboard:  <TodayScheduled data={sched.data} loading={...} error={...} />
   Schedule:   <TodayScheduled data={rows} loading={...} error={...}
                 showIndex showAction selectedRow={sel}
                 onRowSelect={setSel} onAction={row => navigate(...)} />
   ══════════════════════════════════════════════════════ */
export default function TodayScheduled({
  data,
  loading,
  error,
  showIndex   = false,
  showAction  = false,
  selectedRow = null,
  onRowSelect,
  onAction,
}) {
  const [tableH, setTableH] = useState(300)

  const measuredRef = useCallback(node => {
    if (!node) return
    const update = () => setTableH(node.offsetHeight || 300)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(node)
  }, [])

  const rowClassName = rowData => {
    if (!selectedRow || !rowData) return ''
    return selectedRow.id === rowData.id ? 'sched-table-row-selected' : ''
  }

  return (
    <div className="card sched-card">
      <div className="card-title">Today Scheduled</div>

      <div className="sched-table-wrap" ref={measuredRef}>

        {loading && (
          <Stack justifyContent="center" alignItems="center" style={{ height: 80 }}>
            <Loader size="sm" content="Loading..." />
          </Stack>
        )}

        {error && !loading && (
          <Stack justifyContent="center" alignItems="center" style={{ height: 80 }}>
            <Text style={{ color: 'var(--red, #f05252)' }}>⚠ {error}</Text>
          </Stack>
        )}

        {!loading && !error && (
          <Table
            data={data || []}
            height={tableH}
            rowHeight={52}
            headerHeight={36}
            bordered={false}
            cellBordered={false}
            style={{ width: '100%' }}
            wordWrap={false}
            shouldUpdateScroll={false}
            rowClassName={rowClassName}
            onRowClick={row => onRowSelect?.(row)}
          >
            {showIndex && (
              <Column width={32}>
                <HeaderCell style={hStyle}>#</HeaderCell>
                <IndexCell />
              </Column>
            )}

            <Column width={40}>
              <HeaderCell style={hStyle}>ID</HeaderCell>
              <TripIdCell />
            </Column>

            <Column flexGrow={2} minWidth={90}>
              <HeaderCell style={hStyle}>Name</HeaderCell>
              <NameCell />
            </Column>

            <Column width={46} align="center">
              <HeaderCell style={hStyle}>Task</HeaderCell>
              <TaskCell />
            </Column>

            <Column width={82} align="center">
              <HeaderCell style={hStyle}>Round</HeaderCell>
              <RoundCell />
            </Column>

            <Column width={44} align="center">
              <HeaderCell style={hStyle}>Total</HeaderCell>
              <TotalCell />
            </Column>

            <Column flexGrow={3} minWidth={100} align="center">
              <HeaderCell style={hStyle}>Trip Status</HeaderCell>
              <ProgressCell />
            </Column>

            <Column width={52} align="center">
              <HeaderCell style={hStyle}>Miss</HeaderCell>
              <MissedCell />
            </Column>

            <Column width={88} align="center">
              <HeaderCell style={hStyle}>Status</HeaderCell>
              <StatusCell />
            </Column>

            {showAction && (
              <Column width={40} align="center">
                <HeaderCell style={hStyle}> </HeaderCell>
                <ActionCell onAction={onAction} />
              </Column>
            )}
          </Table>
        )}
      </div>
    </div>
  )
}