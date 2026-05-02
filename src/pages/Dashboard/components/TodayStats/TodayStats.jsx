
// import { useState, useCallback } from 'react'
// import ReactECharts from 'echarts-for-react'
// import { SelectPicker, Toggle, Loader, Table } from 'rsuite'
// import './TodayStats.css'

// const { Column, HeaderCell, Cell } = Table

// const UNIT_OPTIONS = [
//   { label: 'All',         value: 'All'         },
//   { label: 'HR',          value: 'HR'          },
//   { label: 'Guards',      value: 'Guards'      },
//   { label: 'Electrician', value: 'Electrician' },
// ]

// const BUBBLES = [
//   { key: 'allTrips', base: '#00c645', light: '#5ee89a', x: 26, y: 72, size: 110 },
//   { key: 'complete', base: '#3a8ef6', light: '#93c5fd', x: 78, y: 52, size: 88  },
//   { key: 'upcoming', base: '#4400b1', light: '#a78bfa', x: 35, y: 16, size: 74  },
//   { key: 'missed',   base: '#e41818', light: '#f88282', x: 78, y: 12, size: 58  },
// ]

// const LEGEND = [
//   { key: 'allTrips', label: 'All Trips', color: '#1db954' },
//   { key: 'complete', label: 'Complete',  color: '#3a8ef6' },
//   { key: 'upcoming', label: 'Upcoming',  color: '#5b21b6' },
//   { key: 'missed',   label: 'Missed',    color: '#fe2626' },
// ]

// const TBL_COLS = [
//   { key: 'allTrips', label: 'All'      },
//   { key: 'complete', label: 'Complete' },
//   { key: 'upcoming', label: 'Upcoming' },
//   { key: 'missed',   label: 'Missed'   },
// ]

// function darken(hex, amt) {
//   const n = parseInt(hex.slice(1), 16)
//   const r = Math.max(0, (n >> 16)         - Math.round(255 * amt))
//   const g = Math.max(0, ((n >> 8) & 0xff) - Math.round(255 * amt))
//   const b = Math.max(0, (n & 0xff)        - Math.round(255 * amt))
//   return `rgb(${r},${g},${b})`
// }

// function sphereGradient(base, light) {
//   return {
//     type: 'radial', x: 0.38, y: 0.35, r: 0.65,
//     colorStops: [
//       { offset: 0,    color: light              },
//       { offset: 0.45, color: base               },
//       { offset: 1,    color: darken(base, 0.28) },
//     ],
//     global: false,
//   }
// }

// function BubbleView({ data }) {
//   const option = {
//     animation: false,
//     grid: { left: 0, right: 0, top: 0, bottom: 0, containLabel: false },
//     xAxis: { show: false, type: 'value', min: -3, max: 103 },
//     yAxis: { show: false, type: 'value', min: -3, max: 103 },
//     series: BUBBLES.map((b, i) => ({
//       type: 'scatter',
//       data: [[b.x, b.y, data[b.key] ?? 0]],
//       symbolSize: b.size,
//       z: b.size,
//       itemStyle: {
//         color: sphereGradient(b.base, b.light),
//         shadowBlur: 18, shadowColor: b.base + '66',
//         shadowOffsetX: 2, shadowOffsetY: 4,
//         borderColor: 'rgba(255,255,255,0.22)', borderWidth: 1.5,
//       },
//       label: {
//         show: true,
//         formatter: p => `${p.data[2]}`,
//         fontWeight: 800, color: '#fff',
//         textShadowBlur: 4, textShadowColor: 'rgba(0,0,0,0.25)',
//         fontSize: b.size > 95 ? 18 : b.size > 75 ? 15 : b.size > 55 ? 13 : 11,
//         fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
//       },
//       emphasis: { scale: 1.05, itemStyle: { shadowBlur: 26, shadowColor: b.base + 'aa' } },
//     })),
//     tooltip: {
//       trigger: 'item',
//       formatter: p => `${LEGEND[p.seriesIndex]?.label}: <b>${p.data[2]}</b>`,
//     },
//     backgroundColor: 'transparent',
//   }

//   return (
//     <div className="today-body">
//       <div className="today-chart">
//         <ReactECharts
//           option={option}
//           style={{ width: '210px', height: '210px' }}
//           opts={{ renderer: 'svg', width: 210, height: 210 }}
//           notMerge
//         />
//       </div>
//       <div className="today-legend">
//         {LEGEND.map(l => (
//           <div key={l.key} className="leg-row">
//             <span className="leg-dot" style={{ background: l.color }} />
//             <span className="leg-name">{l.label}</span>
//             <span className="leg-val">{data[l.key] ?? 0}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// const hStyle = {
//   fontSize: 11, fontWeight: 700,
//   color: '#1a2535', padding: '0 8px',
// }

// const numStyle = {
//   fontSize: 13, fontWeight: 700,
//   color: '#1a2535', textAlign: 'center',
// }

// function TableView({ tableData }) {
//   return (
//     <div className="today-table-wrap">
//       <Table
//         data={tableData}
//         autoHeight
//         bordered
//         cellBordered
//         rowHeight={36}
//         headerHeight={36}
//         style={{ width: '100%' }}
//         wordWrap={false}
//       >
//         <Column flexGrow={2} minWidth={80}>
//           <HeaderCell style={{ ...hStyle, textAlign: 'left' }}>Unit</HeaderCell>
//           <Cell style={{ fontSize: 12, fontWeight: 600, color: '#1a2535', padding: '0 8px' }} dataKey="unit" />
//         </Column>
//         {TBL_COLS.map(col => (
//           <Column key={col.key} flexGrow={1} minWidth={52} align="center">
//             <HeaderCell style={hStyle}>{col.label}</HeaderCell>
//             <Cell style={numStyle} dataKey={col.key} />
//           </Column>
//         ))}
//       </Table>
//     </div>
//   )
// }

// export default function TodayStats({ data, loading, error, tableData = [], onUnitChange }) {
//   const [workerUnit, setWorkerUnit] = useState('All')
//   const [tableView,  setTableView]  = useState(false)

//   const handleUnitChange = useCallback(val => {
//     const next = val ?? 'All'
//     setWorkerUnit(next)
//     onUnitChange?.(next)
//   }, [onUnitChange])

//   const handleToggle = useCallback(val => {
//     setTableView(val)
//   }, [])

//   const showContent = !loading && !error

//   return (
//     <div className="card today-card">

//       {/* Header */}
//       <div className="today-header">
//         <span className="card-title" style={{ margin: 0 }}>Today Statistics</span>

//         <div className="today-header-actions">

//           {/* Unit picker — always mounted */}
//           <SelectPicker
//             data={UNIT_OPTIONS}
//             value={workerUnit}
//             onChange={handleUnitChange}
//             searchable={false}
//             cleanable={false}
//             size="xs"
//             style={{ width: 110 }}
//             className="unit-picker"
//           />

//           {/*
//             Table toggle — always mounted (never conditionally removed from DOM).
//             Using visibility + pointerEvents instead of {condition && <...>}
//             to prevent RSuite Whisper/Toggle from blinking on unit change.
//           */}
//           <div
//             className="today-toggle"
//             style={{
//               visibility:    showContent ? 'visible' : 'hidden',
//               pointerEvents: showContent ? 'auto'    : 'none',
//             }}
//             title={tableView ? 'Switch to Bubble view' : 'Switch to Table view'}
//           >
//             <span className="toggle-label">Table</span>
//             <Toggle size="sm" checked={tableView} onChange={handleToggle} />
//           </div>

//         </div>
//       </div>

//       {/* Content */}
//       {loading ? (
//         <div className="card-center"><Loader size="sm" content="Loading..." /></div>
//       ) : error ? (
//         <div className="card-center error-txt">⚠ {error}</div>
//       ) : tableView ? (
//         <TableView tableData={tableData} />
//       ) : (
//         data && <BubbleView data={data} />
//       )}

//     </div>
//   )
// }

import { useState, useCallback } from 'react'
import ReactECharts from 'echarts-for-react'
import { SelectPicker, Toggle, Loader, Table } from 'rsuite'
import './TodayStats.css'

const { Column, HeaderCell, Cell } = Table

const UNIT_OPTIONS = [
  { label: 'All',         value: 'All'         },
  { label: 'HR',          value: 'HR'          },
  { label: 'Guards',      value: 'Guards'      },
  { label: 'Electrician', value: 'Electrician' },
]

// Positions calculated so every adjacent pair has an equal 5 px edge-to-edge gap.
// Chart canvas = 210×210 px, ECharts axis: x & y ∈ [−3, 103] (range = 106 units).
// Conversion: x_unit = px_x * 106/210 − 3 ;  y_unit = 103 − px_y * 106/210
//
// Radii (px): allTrips=55  complete=44  upcoming=37  missed=29   gap=5 px
//
// Left-col x  = margin + r_max_left  = 10.5 + 55  = 65.5 → unit ≈ 24
// Right-col x = left_x + 55+5+44    = 65.5 + 104 = 169.5 → unit ≈ 76 (clamped to chart edge)
//   → right-col pixel centred at 53 + 104 = 157 px → unit = 157*106/210−3 ≈ 76
// Top-left  y (allTrips):  margin+r = 10.5+55 = 65.5 px  → unit = 103−65.5*106/210 ≈ 70
// Bot-left  y (upcoming):  65.5+97  = 162.5 px            → unit = 103−162.5*106/210 ≈ 21
// Top-right y (complete):  centred  = 73.5 px             → unit = 103−73.5*106/210  ≈ 66
// Bot-right y (missed):    73.5+78  = 151.5 px            → unit = 103−151.5*106/210 ≈ 27
// Axis [-15,115] range=130. px=(unit+15)/130*210
// Radii: allTrips=55 complete=44 upcoming=37 missed=29, gap=4px
// Left col centre: 12+55=67px → unit=26; Right: 67+55+4+44=170px → unit=70
// Top row centre: 12+55=67px → unit=74; Bottom: 67+55+4+37=163px → unit=18
// Canvas 230×230px, axis [-15,115]=130 units (1.769 px/unit).
// All adjacent pairs have ~5px edge-to-edge gap.
// Left col  x-centre = 65px → unit 22 | Right col = 169px → unit 81
// Top row   y-centre = 65px → unit 78 | Purple bottom = 162px → unit 23
// Blue↔Red  y gap: blue(65)+44+5+29=143px → unit 34
const BUBBLES = [
  { key: 'allTrips', base: '#00c645', light: '#5ee89a', x: 22, y: 78, size: 110 },
  { key: 'complete', base: '#3a8ef6', light: '#93c5fd', x: 81, y: 78, size: 88  },
  { key: 'upcoming', base: '#4400b1', light: '#a78bfa', x: 22, y: 23, size: 74  },
  { key: 'missed',   base: '#e41818', light: '#f88282', x: 81, y: 34, size: 58  },
]

const LEGEND = [
  { key: 'allTrips', label: 'All Trips', color: '#1db954' },
  { key: 'complete', label: 'Complete',  color: '#3a8ef6' },
  { key: 'upcoming', label: 'Upcoming',  color: '#5b21b6' },
  { key: 'missed',   label: 'Missed',    color: '#fe2626' },
]

const TBL_COLS = [
  { key: 'allTrips', label: 'All'      },
  { key: 'complete', label: 'Complete' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'missed',   label: 'Missed'   },
]

function darken(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, (n >> 16)         - Math.round(255 * amt))
  const g = Math.max(0, ((n >> 8) & 0xff) - Math.round(255 * amt))
  const b = Math.max(0, (n & 0xff)        - Math.round(255 * amt))
  return `rgb(${r},${g},${b})`
}

function sphereGradient(base, light) {
  return {
    type: 'radial', x: 0.38, y: 0.35, r: 0.65,
    colorStops: [
      { offset: 0,    color: light              },
      { offset: 0.45, color: base               },
      { offset: 1,    color: darken(base, 0.28) },
    ],
    global: false,
  }
}

function BubbleView({ data }) {
  const option = {
    animation: false,
    grid: { left: 0, right: 0, top: 0, bottom: 0, containLabel: false },
    xAxis: { show: false, type: 'value', min: -15, max: 115 },
    yAxis: { show: false, type: 'value', min: -15, max: 115 },
    series: BUBBLES.map((b, i) => ({
      type: 'scatter',
      data: [[b.x, b.y, data[b.key] ?? 0]],
      symbolSize: b.size,
      z: b.size,
      itemStyle: {
        color: sphereGradient(b.base, b.light),
        shadowBlur: 18, shadowColor: b.base + '66',
        shadowOffsetX: 2, shadowOffsetY: 4,
        borderColor: 'rgba(255,255,255,0.22)', borderWidth: 1.5,
      },
      label: {
        show: true,
        formatter: p => `${p.data[2]}`,
        fontWeight: 800, color: '#fff',
        textShadowBlur: 4, textShadowColor: 'rgba(0,0,0,0.25)',
        fontSize: b.size > 95 ? 18 : b.size > 75 ? 15 : b.size > 55 ? 13 : 11,
        fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
      },
      emphasis: { scale: 1.05, itemStyle: { shadowBlur: 26, shadowColor: b.base + 'aa' } },
    })),
    tooltip: {
      trigger: 'item',
      formatter: p => `${LEGEND[p.seriesIndex]?.label}: <b>${p.data[2]}</b>`,
    },
    backgroundColor: 'transparent',
  }

  return (
    <div className="today-body">
      <div className="today-chart">
        <ReactECharts
          option={option}
          style={{ width: '230px', height: '230px' }}
          opts={{ renderer: 'svg', width: 230, height: 230 }}
          notMerge
        />
      </div>
      <div className="today-legend">
        {LEGEND.map(l => (
          <div key={l.key} className="leg-row">
            <span className="leg-dot" style={{ background: l.color }} />
            <span className="leg-name">{l.label}</span>
            <span className="leg-val">{data[l.key] ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const hStyle = {
  fontSize: 11, fontWeight: 700,
  color: '#1a2535', padding: '0 8px',
}

const numStyle = {
  fontSize: 13, fontWeight: 700,
  color: '#1a2535', textAlign: 'center',
}

function TableView({ tableData }) {
  return (
    <div className="today-table-wrap">
      <Table
        data={tableData}
        autoHeight
        bordered
        cellBordered
        rowHeight={36}
        headerHeight={36}
        style={{ width: '100%' }}
        wordWrap={false}
      >
        <Column flexGrow={2} minWidth={80}>
          <HeaderCell style={{ ...hStyle, textAlign: 'left' }}>Unit</HeaderCell>
          <Cell style={{ fontSize: 12, fontWeight: 600, color: '#1a2535', padding: '0 8px' }} dataKey="unit" />
        </Column>
        {TBL_COLS.map(col => (
          <Column key={col.key} flexGrow={1} minWidth={52} align="center">
            <HeaderCell style={hStyle}>{col.label}</HeaderCell>
            <Cell style={numStyle} dataKey={col.key} />
          </Column>
        ))}
      </Table>
    </div>
  )
}

export default function TodayStats({ data, loading, error, tableData = [], onUnitChange }) {
  const [workerUnit, setWorkerUnit] = useState('All')
  const [tableView,  setTableView]  = useState(false)

  const handleUnitChange = useCallback(val => {
    const next = val ?? 'All'
    setWorkerUnit(next)
    onUnitChange?.(next)
  }, [onUnitChange])

  const handleToggle = useCallback(val => {
    setTableView(val)
  }, [])

  const showContent = !loading && !error

  return (
    <div className="card today-card">

      {/* Header */}
      <div className="today-header">
        <span className="card-title" style={{ margin: 0 }}>Today Statistics</span>

        <div className="today-header-actions">

          {/* Unit picker — always mounted */}
          <SelectPicker
            data={UNIT_OPTIONS}
            value={workerUnit}
            onChange={handleUnitChange}
            searchable={false}
            cleanable={false}
            size="xs"
            style={{ width: 110 }}
            className="unit-picker"
          />

          {/*
            Table toggle — always mounted (never conditionally removed from DOM).
            Using visibility + pointerEvents instead of {condition && <...>}
            to prevent RSuite Whisper/Toggle from blinking on unit change.
          */}
          <div
            className="today-toggle"
            style={{
              visibility:    showContent ? 'visible' : 'hidden',
              pointerEvents: showContent ? 'auto'    : 'none',
            }}
            title={tableView ? 'Switch to Bubble view' : 'Switch to Table view'}
          >
            <span className="toggle-label">Table</span>
            <Toggle size="sm" checked={tableView} onChange={handleToggle} />
          </div>

        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="card-center"><Loader size="sm" content="Loading..." /></div>
      ) : error ? (
        <div className="card-center error-txt">⚠ {error}</div>
      ) : tableView ? (
        <TableView tableData={tableData} />
      ) : (
        data && <BubbleView data={data} />
      )}

    </div>
  )
}