import ReactECharts from 'echarts-for-react'
import { Loader } from 'rsuite'
import ArrowUpLineIcon from '@rsuite/icons/ArrowUpLine'
import './TripStats.css'

function EfficiencyBar({ value }) {
  const option = {
    animation: true,
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { show: false, type: 'value', max: 100 },
    yAxis: { show: false, type: 'category', data: ['eff'] },
    series: [{
      type: 'bar',
      data: [value],
      barWidth: '100%',
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#5a9ef5' },
            { offset: 1, color: '#2463d4' }
          ]
        },
        borderRadius: [4, 4, 4, 4]
      },
      label: {
        show: true,
        position: 'inside',
        formatter: `${value}%`,
        fontSize: 11,
        fontWeight: 700,
        color: '#fff'
      }
    }],
    backgroundColor: 'transparent'
  }
  return (
    <div className="eff-chart-wrap">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
      <div className="eff-sublabel">Efficiency</div>
    </div>
  )
}

export default function TripStats({ data, loading, error }) {
  if (loading) return (
    <div className="card trip-card">
      <div className="card-title">Trip Statistics</div>
      <div className="card-center"><Loader size="sm" content="Loading..." /></div>
    </div>
  )
  if (error || !data) return (
    <div className="card trip-card">
      <div className="card-title">Trip Statistics</div>
      <div className="card-center error-txt">⚠ {error || 'No data'}</div>
    </div>
  )

  const { allTrips, completed, missed, ontime, late, efficiency } = data

  return (
    <div className="card trip-card">
      <div className="card-title">Trip Statistics</div>
      <div className="trip-grid">

        <div className="stat-box">
          <div className="stat-lbl">
            <span className="stat-icon bus">🚌</span> All trips
          </div>
          <div className="stat-num">{allTrips}</div>
          <button className="arr-btn"><ArrowUpLineIcon style={{ fontSize: 13, color: '#fff', transform: 'rotate(45deg)' }} /></button>
        </div>

        <div className="stat-box">
          <div className="stat-lbl">
            <span className="stat-icon green">✓</span> Completed
          </div>
          <div className="stat-num">{completed}</div>
          <button className="arr-btn"><ArrowUpLineIcon style={{ fontSize: 13, color: '#fff', transform: 'rotate(45deg)' }} /></button>
        </div>

        <div className="eff-col">
          <EfficiencyBar value={efficiency} />
        </div>

        <div className="stat-box">
          <div className="stat-lbl">
            <span className="stat-icon red">✕</span> Missed
          </div>
          <div className="stat-num">{missed}</div>
          <button className="arr-btn"><ArrowUpLineIcon style={{ fontSize: 13, color: '#fff', transform: 'rotate(45deg)' }} /></button>
        </div>

        <div className="stat-box ontime-box">
          <div className="mini">
            <div className="mini-lbl">⏱ Ontime</div>
            <div className="mini-num">{ontime}</div>
          </div>
          <div className="mini-sep" />
          <div className="mini">
            <div className="mini-lbl">⚠ Late</div>
            <div className="mini-num red-txt">{late}</div>
          </div>
        </div>

      </div>
    </div>
  )
}