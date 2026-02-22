import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader } from 'rsuite'
import ReactECharts from 'echarts-for-react'
import PhoneIcon    from '@rsuite/icons/Phone'
import EmailIcon    from '@rsuite/icons/Email'
import WarningIcon  from '@rsuite/icons/WarningRound'
import LocationIcon from '@rsuite/icons/Location'
import MapIcon      from '@rsuite/icons/Global'

import FilterBar          from '../../components/FilterBar/FilterBar'
import MiniCalendar       from '../Schedule/components/MiniCalendar/MiniCalendar'
import EfficientEmployees from '../Schedule/components/EfficientEmployees/EfficientEmployees'

import { fetchTripDetails, fetchEfficientEmployees } from '../../api'
import './TripDetails.css'

const EMPTY = { data: null, loading: true, error: null }

function toStr(d) {
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

// Gauge chart for trip progress
function TripGauge({ done, total, elapsed }) {
  const pct = total > 0 ? done / total : 0

  const option = {
    series: [{
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: total,
      splitNumber: total,
      radius: '95%',
      center: ['50%', '60%'],
      axisLine: {
        lineStyle: {
          width: 14,
          color: [
            [pct, { type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0,   color: '#f5c518' },
                { offset: 0.5, color: '#3b7ff5' },
                { offset: 1,   color: '#3b7ff5' },
              ]
            }],
            [1, '#e8edf6']
          ]
        }
      },
      axisTick:    { show: false },
      splitLine:   { show: false },
      axisLabel:   { show: false },
      pointer:     { show: false },
      detail: {
        valueAnimation: true,
        formatter: () => `${done}/${total}\nComplete`,
        color: '#1b2f4e',
        fontSize: 16,
        fontWeight: 700,
        lineHeight: 22,
        offsetCenter: [0, '15%'],
      },
      data: [{ value: done }]
    }],
    backgroundColor: 'transparent'
  }

  return (
    <div className="td-gauge-wrap">
      {elapsed && <span className="td-elapsed">{elapsed} ◎</span>}
      <ReactECharts option={option} style={{ height: 160, width: '100%' }} opts={{ renderer: 'svg' }} />
    </div>
  )
}

export default function TripDetails() {
  const { tripId } = useParams()
  const navigate   = useNavigate()

  const [unit,  setUnit]  = useState('All')
  const [shift, setShift] = useState('Shift 1')
  const [date,  setDate]  = useState(new Date(2025, 1, 20))

  const [detail, setDetail] = useState(EMPTY)
  const [eff,    setEff]    = useState(EMPTY)

  const dateStr = toStr(date)

  useEffect(() => {
    setDetail(EMPTY)
    fetchTripDetails(Number(tripId))
      .then(d  => setDetail({ data: d,    loading: false, error: null }))
      .catch(e => setDetail({ data: null, loading: false, error: e.message }))
  }, [tripId])

  useEffect(() => {
    setEff(EMPTY)
    fetchEfficientEmployees({ unit, shift, date: dateStr })
      .then(d  => setEff({ data: d,    loading: false, error: null }))
      .catch(e => setEff({ data: null, loading: false, error: e.message }))
  }, [unit, shift, dateStr])

  const d = detail.data

  return (
    <div className="trip-details-page">

      <FilterBar
        unit={unit}   setUnit={setUnit}
        shift={shift} setShift={setShift}
        date={date}   setDate={setDate}
      />

      {detail.loading && (
        <div className="td-full-center"><Loader size="md" content="Loading trip details..." /></div>
      )}
      {detail.error && (
        <div className="td-full-center error-txt">⚠ {detail.error}</div>
      )}

      {d && (
        <div className="td-body">

          {/* LEFT — Scheduled List + employee header */}
          <div className="td-left card">
            <div className="card-title">Scheduled List</div>

            {/* Employee header */}
            <div className="td-emp-header">
              <div className="td-emp-avatar">{d.employeeName.charAt(0)}</div>
              <div className="td-emp-info">
                <span className="td-emp-name">{d.employeeName}</span>
                <span className="td-emp-id">ID - {d.employeeId}</span>
              </div>
              <div className="td-emp-actions">
                <button className="td-action-btn contact">
                  <PhoneIcon /> Contact
                </button>
                <button className="td-action-btn message">
                  <EmailIcon /> Message
                </button>
                <button className="td-action-btn alert">
                  <WarningIcon /> Alert
                </button>
              </div>
            </div>

            {/* Cycle & Checkpoints */}
            <div className="td-stats-row">
              <div className="td-stat-box">
                <span className="td-stat-label">Cycle</span>
                <span className="td-stat-value">{d.cycleDone}/{d.cycleTotal}</span>
                <div className="td-stat-bar">
                  <div className="td-stat-fill" style={{width:`${Math.round((d.cycleDone/d.cycleTotal)*100)}%`}} />
                </div>
              </div>
              <div className="td-stat-box">
                <span className="td-stat-label">Checkpoints</span>
                <span className="td-stat-value">{d.checkpointsDone}/{d.checkpointsTotal}</span>
                <div className="td-stat-bar">
                  <div className="td-stat-fill" style={{width:`${Math.round((d.checkpointsDone/d.checkpointsTotal)*100)}%`}} />
                </div>
              </div>
            </div>

            {/* Patrol list */}
            <div className="td-patrol-list">
              {d.patrols.map(p => (
                <div key={p.id} className="td-patrol-card">
                  <div className="td-patrol-top">
                    <div className="td-patrol-time">
                      <span className="td-patrol-range">{p.timeFrom} to {p.timeTo}</span>
                      <span className={`td-login-badge ${p.loginStatus === 'On-time' ? 'ontime' : 'late'}`}>
                        {p.loginStatus}
                      </span>
                    </div>
                    <div className="td-patrol-icons">
                      {p.icons.map((ic, idx) => (
                        <span key={idx} className="td-icon-bubble">{ic}</span>
                      ))}
                    </div>
                  </div>
                  <div className="td-patrol-name">
                    <LocationIcon style={{ color: '#3b7ff5', fontSize: 12 }} /> {p.name}
                  </div>
                  <div className="td-patrol-bottom">
                    <span className="td-patrol-meta">Cycle</span>
                    <span className="td-patrol-meta">Rounds: {p.rounds}</span>
                    <span className="td-patrol-meta">Checkpoints: {p.checkpoints}</span>
                    <span className={`st-badge ${p.status.toLowerCase()}`} style={{ marginLeft: 'auto' }}>
                      {p.status} {p.status === 'Ongoing' ? '↻' : '✓'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MIDDLE — Trip gauge + trip points */}
          <div className="td-middle card">
            <div className="td-mid-header">
              <div>
                <div className="td-patrol-name-lg">
                  <LocationIcon style={{ color: '#3b7ff5' }} /> {d.patrolName}
                </div>
                <div className="td-patrol-time-sm">{d.timeFrom} to {d.timeTo}
                  <span className="td-login-badge ontime" style={{ marginLeft: 6 }}>{d.loginStatus}</span>
                </div>
              </div>
              <span className="td-order-trip">{d.orderTrip}</span>
            </div>

            {/* Gauge */}
            <TripGauge done={d.tripDoneOf} total={d.tripTotal} elapsed={d.tripElapsed} />

            {/* Trip Points */}
            <div className="td-trip-pts-title">
              Trip Points
              <MapIcon style={{ marginLeft: 6, color: '#3b7ff5' }} />
            </div>
            <div className="td-trip-pts">
              {d.tripPoints.map(tp => (
                <div key={tp.id} className="td-tp-card">
                  <div className="td-tp-top">
                    <div className="td-tp-info">
                      <LocationIcon style={{ color: '#ef4444', fontSize: 12 }} />
                      <span className="td-tp-name">{tp.name}</span>
                      <span className="td-tp-time">{tp.time}</span>
                    </div>
                    <div className="td-tp-icons">
                      {tp.stats.map((s, idx) => (
                        <span key={idx} className="td-tp-icon-box">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="td-tp-bottom">
                    <span className="td-tp-chk">Checkpoints: {tp.checkpoints}</span>
                    <span className={`st-badge ${tp.status.toLowerCase()}`}>
                      {tp.status} {tp.status === 'Ongoing' ? '↻' : '✓'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Sidebar */}
          <div className="td-right">
            <MiniCalendar selectedDate={date} onDateSelect={setDate} />
            <EfficientEmployees data={eff.data} loading={eff.loading} error={eff.error} />
          </div>

        </div>
      )}
    </div>
  )
}