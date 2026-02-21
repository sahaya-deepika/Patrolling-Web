
import ReactECharts from 'echarts-for-react'
import { Loader } from 'rsuite'
import './AttendanceStats.css'

function DonutChart({ data, centerVal, centerColor }) {
  const option = {
    animation: true,
    series: [{
      type: 'pie',
      radius: ['50%', '85%'],
      avoidLabelOverlap: false,
      label: { show: false },
      labelLine: { show: false },
      data,
      itemStyle: { borderRadius: 4, borderWidth: 2, borderColor: '#fff' },
      emphasis: { scale: false }
    }],
    backgroundColor: 'transparent'
  }
  return (
    <div className="donut-wrap">
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
      <div className="donut-center" style={{ color: centerColor }}>
        {centerVal}
      </div>
    </div>
  )
}

export default function AttendanceStats({ data, loading, error }) {
  if (loading) return (
    <div className="card att-card">
      <div className="card-title">Attendance Statistics</div>
      <div className="card-center"><Loader size="sm" content="Loading..." /></div>
    </div>
  )

  if (error || !data) return (
    <div className="card att-card">
      <div className="card-title">Attendance Statistics</div>
      <div className="card-center error-txt">⚠ {error || 'No data'}</div>
    </div>
  )

  const { present, absent, ontime, late } = data

  return (
    <div className="card att-card">
      <div className="card-title">Attendance Statistics</div>
      <div className="att-body">

        {/* ── Donut 1: Present vs Absent ── */}
        <div className="donut-panel">
          <DonutChart
            data={[
              { value: present, name: 'Present', itemStyle: { color: '#3b7ff5' } },
              { value: absent,  name: 'Absent',  itemStyle: { color: '#b8d9fd' } },
            ]}
            centerVal={present}
            centerColor="#3b7ff5"
          />
          <div className="donut-legend">
            <div className="leg-row">
              <span className="leg-dot" style={{ background: '#3b7ff5' }} />
              <span className="leg-name">Present</span>
              <span className="leg-val">{present}</span>
            </div>
            <div className="leg-row">
              <span className="leg-dot" style={{ background: '#b8d9fd' }} />
              <span className="leg-name">Absent</span>
              <span className="leg-val">{absent}</span>
            </div>
          </div>
        </div>

        {/* ── Donut 2: Ontime vs Late ── */}
        <div className="donut-panel">
          <DonutChart
            data={[
              { value: ontime, name: 'Ontime', itemStyle: { color: '#22c55e' } },
              { value: late,   name: 'Late',   itemStyle: { color: '#f05252' } },
            ]}
            centerVal={ontime}
            centerColor="#15803d"
          />
          <div className="donut-legend">
            <div className="leg-row">
              <span className="leg-dot" style={{ background: '#22c55e' }} />
              <span className="leg-name">Ontime</span>
              <span className="leg-val">{ontime}</span>
            </div>
            <div className="leg-row">
              <span className="leg-dot" style={{ background: '#f05252' }} />
              <span className="leg-name">Late</span>
              <span className="leg-val">{late}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}