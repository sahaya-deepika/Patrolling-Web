// src/pages/MasterForm/forms/TripForm.jsx
import React, { useState, useEffect } from 'react'
import { Button } from 'rsuite'
import { Icons, MfInput, InputWithPlus, ToggleBtn, SaveBtn, SavedPanelHeader, Pill, IconCircle, SectionLabel } from '../components/MasterFormUI'
import { getTrips, createTrip } from '../../../api'

export default function TripForm() {
  const blank = { tripName: '', tripType: '', mobile: '', mail: '', mode: 'Cycle', employeeRoll: '', zone: '', location: '' }
  const [form, setForm]      = useState(blank)
  const [saved, setSaved]    = useState([])
  const [busy, setBusy]      = useState(false)
  const [highlighted, setHL] = useState(1)

  useEffect(() => { getTrips().then(setSaved) }, [])
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    if (!form.tripName) return
    setBusy(true)
    const created = await createTrip({ ...form, tags: ['Fill', 'Yes/No', 'Option'] })
    setSaved(p => [created, ...p])
    setHL(0)
    setForm(blank)
    setBusy(false)
  }

  return (
    <div className="mf-split">
      <div className="mf-form-col">
        <p className="mf-form-title">Create Trip</p>
        <div className="mf-section-row">
          <SectionLabel>Trip info</SectionLabel>
          <div className="mf-section-fields">
            <div className="mf-field-row">
              <div className="mf-field-box"><MfInput placeholder="Trip name" value={form.tripName} onChange={v => set('tripName', v)} /></div>
              <div className="mf-field-box"><MfInput placeholder="Trip type" value={form.tripType} onChange={v => set('tripType', v)} /></div>
            </div>
            <div className="mf-field-row">
              <div className="mf-field-box"><MfInput placeholder="Mobile" value={form.mobile} onChange={v => set('mobile', v)} /></div>
              <div className="mf-field-box"><MfInput placeholder="Mail"   value={form.mail}   onChange={v => set('mail', v)}   /></div>
            </div>
            <div className="mf-toggle-group">
              <ToggleBtn label="Cycle" active={form.mode === 'Cycle'} onClick={() => set('mode', 'Cycle')} />
              <ToggleBtn label="Round" active={form.mode === 'Round'} onClick={() => set('mode', 'Round')} />
              <Button className="mf-cal-btn">
                <Icons.Calendar />
              </Button>
            </div>
            <div className="mf-field-row">
              <div className="mf-field-box"><InputWithPlus placeholder="Employee roll" value={form.employeeRoll} onChange={v => set('employeeRoll', v)} /></div>
              <div className="mf-field-box"><InputWithPlus placeholder="Zone"          value={form.zone}         onChange={v => set('zone', v)}         /></div>
            </div>
            <InputWithPlus placeholder="Location" value={form.location} onChange={v => set('location', v)} />
          </div>
        </div>
        <SaveBtn onClick={handleSave} loading={busy} />
      </div>

      <div className="mf-saved-col">
        <SavedPanelHeader title="Saved Trip" />
        <div className="mf-saved-list">
          {saved.map((t, i) => (
            <div key={t.id || i} className={`mf-saved-card ${highlighted === i ? 'highlighted' : ''}`} onClick={() => setHL(i)}>
              <div className="mf-saved-card-top">
                <IconCircle color="blue"><Icons.ArrowRight /></IconCircle>
                <span className="mf-saved-card-name">{t.tripName}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                  <Pill color="blue">Employee roll</Pill>
                  <Pill color="green">Zone</Pill>
                </div>
              </div>
              <div className="mf-saved-card-tags">
                {(t.tags || ['Fill', 'Yes/No', 'Option']).map(tag => (
                  <Pill key={tag} color={tag === 'Fill' ? 'gray' : tag === 'Yes/No' ? 'blue' : 'orange'}>{tag}</Pill>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}