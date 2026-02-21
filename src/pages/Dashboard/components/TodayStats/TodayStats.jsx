import ReactECharts from 'echarts-for-react'
import { Loader } from 'rsuite'
import './TodayStats.css'

const BUBBLE_CFG = [
  { key: 'allTrips',  color: '#22c55e', x: 20, y: 55, size: 90  },
  { key: 'complete',  color: '#3b7ff5', x: 55, y: 38, size: 74  },
  { key: 'missed',    color: '#22d3ee', x: 20, y: 82, size: 50  },
  { key: 'upcoming',  color: '#8b5cf6', x: 72, y: 72, size: 66  },
  { key: 'cancelled', color: '#f05252', x: 45, y: 82, size: 30  },
]

const LEGEND_CFG = [
  { key: 'allTrips',  label: 'All trips',  color: '#22c55e' },
  { key: 'complete',  label: 'Complete',   color: '#3b7ff5' },
  { key: 'upcoming',  label: 'Upcoming',   color: '#8b5cf6' },
  { key: 'missed',    label: 'Missed',     color: '#22d3ee' },
  { key: 'cancelled', label: 'Cancelled',  color: '#f05252' },
]

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
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { show: false, type: 'value', min: 0, max: 100 },
    yAxis: { show: false, type: 'value', min: 0, max: 100 },
    series: BUBBLE_CFG.map(b => ({
      type: 'scatter',
      data: [[b.x, b.y, data[b.key]]],
      symbolSize: b.size,
      itemStyle: { color: b.color, shadowBlur: 8, shadowColor: `${b.color}55` },
      label: {
        show: true,
        formatter: params => `${params.data[2]}`,
        fontSize: b.size > 60 ? 15 : b.size > 40 ? 13 : 11,
        fontWeight: 700,
        color: '#fff'
      },
      emphasis: { scale: 1.08 }
    })),
    tooltip: {
      trigger: 'item',
      formatter: params => {
        const cfg = BUBBLE_CFG[params.seriesIndex]
        const lbl = LEGEND_CFG.find(l => l.key === cfg.key)
        return `${lbl?.label}: ${params.data[2]}`
      }
    },
    backgroundColor: 'transparent'
  }

  return (
    <div className="card today-card">
      <div className="card-title">Today Statistics</div>
      <div className="today-body">
        <div className="today-chart">
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
        </div>
        <div className="today-legend">
          {LEGEND_CFG.map(l => (
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