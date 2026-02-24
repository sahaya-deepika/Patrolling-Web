import ReactECharts from 'echarts-for-react'
import { Loader } from 'rsuite'
import './TodayStats.css'

// Positions verified — no overlaps, no clipping
// Top row: allTrips(110px) + complete(88px)
// Bottom row: cancelled(32px) + upcoming(74px) + missed(58px)
const BUBBLES = [
  { key:'allTrips',  base:'#1db954', light:'#5ee89a', x:33.7, y:70.0, size:110 },
  { key:'complete',  base:'#3a8ef6', light:'#93c5fd', x:70.7, y:70.0, size:88  },
  { key:'cancelled', base:'#dc2626', light:'#fca5a5', x:24.0, y:20.0, size:32  },
  { key:'upcoming',  base:'#5b21b6', light:'#a78bfa', x:45.7, y:20.0, size:74  },
  { key:'missed',    base:'#0d9488', light:'#5eead4', x:71.7, y:20.0, size:58  },
]

const LEGEND = [
  { key:'allTrips',  label:'All trips',  color:'#1db954' },
  { key:'complete',  label:'Complete',   color:'#3a8ef6' },
  { key:'upcoming',  label:'Upcoming',   color:'#5b21b6' },
  { key:'missed',    label:'Missed',     color:'#0d9488' },
  { key:'cancelled', label:'Cancelled',  color:'#dc2626' },
]

function darken(hex, amount) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, (n >> 16) - Math.round(255 * amount))
  const g = Math.max(0, ((n >> 8) & 0xff) - Math.round(255 * amount))
  const b = Math.max(0, (n & 0xff) - Math.round(255 * amount))
  return `rgb(${r},${g},${b})`
}

function sphereGradient(base, light) {
  return {
    type: 'radial',
    x: 0.38, y: 0.35, r: 0.65,
    colorStops: [
      { offset: 0,    color: light },
      { offset: 0.45, color: base  },
      { offset: 1,    color: darken(base, 0.28) },
    ],
    global: false,
  }
}

export default function TodayStats({ data, loading, error }) {
  if (loading) return (
    <div className="card today-card">
      <div className="card-title">Today Statistics</div>
      <div className="card-center"><Loader size="sm" content="Loading..." /></div>
    </div>
  )
  if (error || !data) return (
    <div className="card today-card">
      <div className="card-title">Today Statistics</div>
      <div className="card-center error-txt">⚠ {error || 'No data'}</div>
    </div>
  )

  const option = {
    animation: true,
    grid: { left: '0%', right: '0%', top: '0%', bottom: '0%', containLabel: false },
    xAxis: { show: false, type: 'value', min: 0,  max: 100 },
    // min:-8 & max:105 gives breathing room so bubbles at edges aren't clipped
    yAxis: { show: false, type: 'value', min: -8, max: 105 },
    series: BUBBLES.map((b, i) => ({
      type: 'scatter',
      data: [[b.x, b.y, data[b.key]]],
      symbolSize: b.size,
      z: b.size,
      itemStyle: {
        color: sphereGradient(b.base, b.light),
        shadowBlur: 20,
        shadowColor: b.base + '77',
        shadowOffsetX: 2,
        shadowOffsetY: 5,
        borderColor: 'rgba(255,255,255,0.22)',
        borderWidth: 1.5,
      },
      label: {
        show: true,
        formatter: p => `${p.data[2]}`,
        fontWeight: 800,
        color: '#fff',
        textShadowBlur: 4,
        textShadowColor: 'rgba(0,0,0,0.22)',
        fontSize: b.size > 95 ? 18 : b.size > 75 ? 15 : b.size > 55 ? 13 : b.size > 35 ? 11 : 9,
        fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
      },
      emphasis: {
        scale: 1.06,
        itemStyle: { shadowBlur: 30, shadowColor: b.base + 'bb' },
      },
    })),
    tooltip: {
      trigger: 'item',
      formatter: p => `${LEGEND[p.seriesIndex]?.label}: <b>${p.data[2]}</b>`,
    },
    backgroundColor: 'transparent',
  }

  return (
    <div className="card today-card">
      <div className="card-title">Today Statistics</div>
      <div className="today-body">
        <div className="today-chart">
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>
        <div className="today-legend">
          {LEGEND.map(l => (
            <div key={l.key} className="leg-row">
              <span className="leg-dot" style={{ background: l.color }} />
              <span className="leg-name">{l.label}</span>
              <span className="leg-val">{data[l.key]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}