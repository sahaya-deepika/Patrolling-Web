
import { Loader } from 'rsuite'
import ReactECharts from 'echarts-for-react'
import './AttendanceStats.css'

function DonutPanel({ chartData, centerVal, centerColor, legend }) {
  const option = {
    animation: true,
    series: [{ type: 'pie', radius: ['50%','82%'], center: ['50%','50%'],
      avoidLabelOverlap: false, label: { show: false }, labelLine: { show: false },
      data: chartData, itemStyle: { borderRadius: 3, borderWidth: 2, borderColor: 'transparent' },
      emphasis: { scale: false },
    }],
    backgroundColor: 'transparent',
  }
  return (
    <div className="atts-panel">
      <div className="atts-donut-wrap">
        <ReactECharts option={option} style={{ width: '100%', height: '100%' }} opts={{ renderer: 'svg' }} />
        <span className="atts-center-num" style={{ color: centerColor }}>{centerVal}</span>
      </div>
      <div className="atts-legend">
        {legend.map(l => (
          <div key={l.label} className="atts-leg-row">
            <span className="atts-dot" style={{ background: l.color }} />
            <span className="atts-leg-name">{l.label}</span>
            <span className="atts-leg-val">{l.val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AttendanceStats({ data, loading, error }) {
  if (loading) return <div className="card"><div className="card-title">Attendance Statistics</div><div className="card-center"><Loader size="sm" content="Loading..." /></div></div>
  if (error || !data) return <div className="card"><div className="card-title">Attendance Statistics</div><div className="card-center error-txt">⚠ {error||'No data'}</div></div>

  const { present, absent, ontime, late } = data
  return (
    <div className="card">
      <div className="card-title">Attendance Statistics</div>
      <div className="atts-body">
        <DonutPanel
          chartData={[
            { value: present, name: 'Present', itemStyle: { color: '#3b7ff5' } },
            { value: absent,  name: 'Absent',  itemStyle: { color: '#bfdbfe' } },
          ]}
          centerVal={present} centerColor="#3b7ff5"
          legend={[{ label:'Present', color:'#3b7ff5', val:present }, { label:'Absent', color:'#bfdbfe', val:absent }]}
        />
        <DonutPanel
          chartData={[
            { value: ontime, name: 'Ontime', itemStyle: { color: '#22c55e' } },
            { value: late,   name: 'Late',   itemStyle: { color: '#f05252' } },
          ]}
          centerVal={ontime} centerColor="#15803d"
          legend={[{ label:'Ontime', color:'#22c55e', val:ontime }, { label:'Late', color:'#f05252', val:late }]}
        />
      </div>
    </div>
  )
}