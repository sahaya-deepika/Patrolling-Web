import { useState, useEffect, useRef, useMemo } from 'react'
import { Loader } from 'rsuite'
import PhoneIcon from '@rsuite/icons/Phone'

import FilterBar         from '../../components/FilterBar/FilterBar'
import MiniCalendar      from '../Schedule/components/MiniCalendar/MiniCalendar'
import PunctualEmployees from './components/PunctualEmployees/PunctualEmployees'

import {
  fetchAttendanceList,
  fetchEmployeeAttendanceDetail,
  fetchPunctualEmployees
} from '../../api'

import './Attendance.css'

function toStr(d) {
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const EMPTY = { data: null, loading: true, error: null }

export default function Attendance() {
  const [unit,  setUnit]  = useState('All')
  const [shift, setShift] = useState('Shift 1')
  const [date,  setDate]  = useState(new Date(2025, 1, 20))

  const [attList,   setAttList]   = useState(EMPTY)
  const [selected,  setSelected]  = useState(null)
  const [empDetail, setEmpDetail] = useState(EMPTY)
  const [punct,     setPunct]     = useState(EMPTY)

  const fetchId = useRef(0)
  const dateStr = useMemo(() => toStr(date), [date])

  // Fetch list + punctual when filters change
  useEffect(() => {
    const id = ++fetchId.current
    const filters = { unit, shift, date: dateStr }

    setAttList(EMPTY); setPunct(EMPTY)
    setSelected(null); setEmpDetail(EMPTY)

    const safe = s => d => { if (id !== fetchId.current) return; s({ data: d,    loading: false, error: null       }) }
    const fail = s => e => { if (id !== fetchId.current) return; s({ data: null, loading: false, error: e.message }) }

    fetchAttendanceList(filters)   .then(safe(setAttList)).catch(fail(setAttList))
    fetchPunctualEmployees(filters).then(safe(setPunct))  .catch(fail(setPunct))
  }, [unit, shift, dateStr])

  // Auto-select first employee
  useEffect(() => {
    if (attList.data?.employees?.length && !selected) {
      setSelected(attList.data.employees[0])
    }
  }, [attList.data])

  // Fetch detail when selected changes
  useEffect(() => {
    if (!selected) return
    setEmpDetail(EMPTY)
    fetchEmployeeAttendanceDetail(selected.empId)
      .then(d  => setEmpDetail({ data: d,    loading: false, error: null       }))
      .catch(e => setEmpDetail({ data: null, loading: false, error: e.message }))
  }, [selected])

  const employees = attList.data?.employees || []
  const detail    = empDetail.data

  return (
    <div className="attendance-page">

      <FilterBar
        unit={unit}   setUnit={setUnit}
        shift={shift} setShift={setShift}
        date={date}   setDate={setDate}
      />

      <div className="att-body">

        {/* LEFT — Employee list */}
        <div className="att-left card">
          <div className="card-title">Employee attendance</div>
          <div className="att-list">
            {attList.loading && <div className="att-center"><Loader size="sm" content="Loading..." /></div>}
            {attList.error   && <div className="att-center error-txt">⚠ {attList.error}</div>}

            {employees.map(emp => (
              <div
                key={emp.empId}
                className={`att-emp-card${selected?.empId === emp.empId ? ' selected' : ''}`}
                onClick={() => setSelected(emp)}
              >
                <div className="att-emp-top">
                  <div className="att-emp-left-info">
                    <div className="att-emp-av">{emp.name.charAt(0)}</div>
                    <div>
                      <div className="att-role-badge">Role <span>{emp.role}</span></div>
                      <div className="att-emp-name">{emp.name} ({emp.empId})</div>
                    </div>
                  </div>
                  <span className="att-login-time">Login : {emp.loginTime}</span>
                </div>
                <div className="att-emp-tags">
                  <span className="att-tag phone"><PhoneIcon /> {emp.phone}</span>
                  <span className="att-tag">{emp.shift}</span>
                  <span className="att-tag">{emp.department}</span>
                  <span className="att-tag">{emp.zone}</span>
                  <span className="att-tag">{emp.designation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE — Selected employee timeline */}
        <div className="att-middle card">
          <div className="card-title">Selected employee</div>

          {!selected && (
            <div className="att-center" style={{ color: 'var(--t3)', fontSize: 13 }}>
              Select an employee
            </div>
          )}

          {selected && (
            <>
              <div className="att-sel-header">
                <div className="att-emp-av">{selected.name.charAt(0)}</div>
                <div>
                  <div className="att-role-badge">Role <span>{selected.role}</span></div>
                  <div className="att-emp-name">{selected.name} ({selected.empId})</div>
                </div>
                <span className="att-login-time" style={{ marginLeft: 'auto' }}>
                  Login : {selected.loginTime}
                </span>
              </div>

              {empDetail.loading && <div className="att-center"><Loader size="sm" content="Loading..." /></div>}
              {empDetail.error   && <div className="att-center error-txt">⚠ {empDetail.error}</div>}

              {detail && (
                <div className="att-timeline">
                  {detail.timeline.map((entry, idx) => (
                    <div key={idx} className="att-tl-entry">
                      <div className={`att-day-marker ${entry.type}`}>
                        <span className="att-day-name">{entry.day}</span>
                        <span className="att-day-num">{entry.date}</span>
                      </div>
                      <div className="att-tl-content">
                        {entry.type === 'holiday' ? (
                          <div className="att-holiday-card">
                            <span className="att-holiday-label">{entry.label}</span>
                            <span className="att-holiday-note">{entry.note}</span>
                          </div>
                        ) : (
                          <div className="att-active-card">
                            <div className="att-active-header">
                              <span className="att-time-range">{entry.timeFrom} to {entry.timeTo}</span>
                              <span className="att-active-hrs">Active {entry.activeHours}</span>
                              <span className="att-note">{entry.note}</span>
                            </div>
                            <div className="att-punches">
                              {entry.punches.map((p, pi) => (
                                <div key={pi} className="att-punch-row">
                                  <div className="att-punch-dot" />
                                  <div className="att-punch-info">
                                    <span className="att-punch-label">{p.label}</span>
                                    <span className="att-punch-sub">Punch time ({p.punchTime})</span>
                                  </div>
                                  <span className="att-punch-sched">{p.scheduledTime}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT — Sidebar */}
        <div className="att-right">
          <MiniCalendar selectedDate={date} onDateSelect={setDate} />
          <PunctualEmployees data={punct.data} loading={punct.loading} error={punct.error} />
        </div>

      </div>
    </div>
  )
}