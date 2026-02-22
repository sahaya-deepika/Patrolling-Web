// src/pages/MasterForm/forms/ScheduleForm.jsx
import React, { useState, useEffect } from 'react'
import { Icons, MfInput, NativeInput, ToggleBtn, SaveBtn, SavedPanelHeader, Pill, SectionLabel } from '../components/MasterFormUI'
import { getSchedules, createSchedule } from '../../../api'

export default function ScheduleForm() {
  const blank = {
    userName: '', tripName: '', tripType: '',
    maxRound: '', minRound: '', ordered: true,
    startDate: '', endDate: '', expDate: '',
    startTime: '', endTime: '',
  }
  const [form, setForm]   = useState(blank)
  const [saved, setSaved] = useState([])
  const [busy, setBusy]   = useState(false)

  useEffect(() => { getSchedules().then(setSaved) }, [])
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    if (!form.userName) return
    setBusy(true)
    const created = await createSchedule(form)
    setSaved(p => [created, ...p])
    setForm(blank)
    setBusy(false)
  }

  return (
    <div className="mf-split">
      <div className="mf-form-col">
        <p className="mf-form-title">Create Schedule</p>

        <div className="mf-section-row">
          <SectionLabel>Personal info</SectionLabel>
          <div className="mf-section-fields">
            <MfInput placeholder="User name" value={form.userName} onChange={v => set('userName', v)} />
          </div>
        </div>

        <div className="mf-section-row">
          <SectionLabel>Trip details</SectionLabel>
          <div className="mf-section-fields">
            <div className="mf-field-row">
              <div className="mf-field-box">
                <MfInput placeholder="Trip Name" value={form.tripName} onChange={v => set('tripName', v)} />
              </div>
              <div className="mf-field-box">
                <MfInput placeholder="Trip type" value={form.tripType} onChange={v => set('tripType', v)} />
              </div>
            </div>
            <div className="mf-field-row">
              <div className="mf-field-box">
                <MfInput placeholder="Maximum Round" value={form.maxRound} onChange={v => set('maxRound', v)} />
              </div>
              <div className="mf-field-box">
                <MfInput placeholder="Minimum Round" value={form.minRound} onChange={v => set('minRound', v)} />
              </div>
            </div>
            <div className="mf-toggle-group">
              <ToggleBtn label="Order"   active={form.ordered}  onClick={() => set('ordered', true)}  />
              <ToggleBtn label="Unorder" active={!form.ordered} onClick={() => set('ordered', false)} />
            </div>
          </div>
        </div>

        <div className="mf-section-row">
          <SectionLabel>Date &amp; Time</SectionLabel>
          <div className="mf-section-fields">
            <div className="mf-field-row">
              <div className="mf-field-box">
                <NativeInput type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
              </div>
              <div className="mf-field-box">
                <NativeInput type="date" value={form.endDate}   onChange={e => set('endDate',   e.target.value)} />
              </div>
            </div>
            <NativeInput type="date" placeholder="Expired date" value={form.expDate} onChange={e => set('expDate', e.target.value)} />
            <div className="mf-field-row">
              <div className="mf-field-box">
                <NativeInput type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} />
              </div>
              <div className="mf-field-box">
                <NativeInput type="time" value={form.endTime}   onChange={e => set('endTime',   e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <SaveBtn onClick={handleSave} loading={busy} />
      </div>

      <div className="mf-saved-col">
        <SavedPanelHeader title="Saved Schedule" />
        <div className="mf-saved-list">
          {saved.map((s, i) => (
            <div key={s.id || i} className="mf-saved-card">
              <div className="mf-sched-time-row">
                <span className="mf-sched-time">
                  {s.startTime || '10:00am'} to {s.endTime || '4:00pm'}&nbsp;
                  <Pill color="blue">{s.tripType || 'Order or Unorder'}</Pill>
                </span>
                <span className="mf-sched-time">Start at {s.startDate || '1.2.2025'}</span>
              </div>
              <div className="mf-saved-card-top">
                <span style={{ color: '#2563eb' }}><Icons.People /></span>
                <span className="mf-saved-card-name">{s.userName || 'Karthick'}</span>
              </div>
              <div className="mf-saved-card-sub">Trip type</div>
              <div className="mf-saved-card-meta">
                <span>{s.tripName || 'Trip name'}</span>
                <span>Rounds: {s.maxRound || 11}</span>
                <span>Order</span>
                <span>Exp {s.expDate || '12.2.2025'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}