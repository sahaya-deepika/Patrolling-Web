import { useState, useEffect } from 'react'
import { getSchedules, createSchedule, deleteSchedule, updateSchedule } from '../../../api'
import {
  MfInput, MfDatePicker, MfTimePicker, ToggleBtn, SaveBtn,
  SavedPanelHeader, Pill, SectionLabel, CrudMenu, Icons,
} from '../components/MasterFormUI'

const blank = {
  userName:'', tripName:'', tripType:'', maxRound:'', minRound:'',
  ordered:true, startDate:'', endDate:'', expDate:'', startTime:'', endTime:'',
}

export default function ScheduleForm() {
  const [form, setForm] = useState(blank)
  const [saved, setSaved] = useState([])
  const [busy, setBusy]   = useState(false)
  const [sel, setSel]     = useState(null)

  useEffect(() => { getSchedules().then(setSaved).catch(() => {}) }, [])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleApply = (item) => {
    setForm({ ...blank, ...item })
    setSel(item.id)
  }

  const handleCancelEdit = () => { setForm(blank); setSel(null) }

  const handleSave = async () => {
    if (!form.userName) return
    setBusy(true)
    try {
      if (sel) {
        const updated = typeof updateSchedule === 'function'
          ? await updateSchedule(sel, form)
          : { ...form, id: sel }
        setSaved(p => p.map(s => s.id === sel ? { ...s, ...updated } : s))
        setSel(null); setForm(blank)
      } else {
        const c = await createSchedule(form)
        setSaved(p => [c, ...p]); setForm(blank)
      }
    } catch (e) {
      if (sel) {
        setSaved(p => p.map(s => s.id === sel ? { ...s, ...form } : s))
        setSel(null); setForm(blank)
      }
    }
    setBusy(false)
  }

  const handleDelete = async (id) => {
    try { await deleteSchedule(id) } catch (e) {}
    setSaved(p => p.filter(s => s.id !== id))
    if (sel === id) { setForm(blank); setSel(null) }
  }

  return (
    <div className="mf-split">

      {/* ── Form ── */}
      <div className="mf-form-col">
        <div className="mf-form-inner">
          <p className="mf-form-title">{sel ? 'Edit Schedule' : 'Create Schedule'}</p>

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
                <div className="mf-field-box"><MfInput placeholder="Trip Name" value={form.tripName} onChange={v => set('tripName', v)} /></div>
                <div className="mf-field-box"><MfInput placeholder="Trip type" value={form.tripType} onChange={v => set('tripType', v)} /></div>
              </div>
              <div className="mf-field-row">
                <div className="mf-field-box"><MfInput placeholder="Maximum Round" value={form.maxRound} onChange={v => set('maxRound', v)} /></div>
                <div className="mf-field-box"><MfInput placeholder="Minimum Round" value={form.minRound} onChange={v => set('minRound', v)} /></div>
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
                <div className="mf-field-box"><MfDatePicker placeholder="Start date"  value={form.startDate} onChange={v => set('startDate', v)} /></div>
                <div className="mf-field-box"><MfDatePicker placeholder="End date"    value={form.endDate}   onChange={v => set('endDate', v)} /></div>
              </div>
              <MfDatePicker placeholder="Expired date" value={form.expDate} onChange={v => set('expDate', v)} />
              <div className="mf-field-row">
                <div className="mf-field-box"><MfTimePicker placeholder="Start time" value={form.startTime} onChange={v => set('startTime', v)} /></div>
                <div className="mf-field-box"><MfTimePicker placeholder="End time"   value={form.endTime}   onChange={v => set('endTime', v)} /></div>
              </div>
            </div>
          </div>

          <SaveBtn onClick={handleSave} loading={busy} isEditing={!!sel} onCancelEdit={handleCancelEdit} />
        </div>
      </div>

      {/* ── Saved panel ── */}
      <div className="mf-saved-col">
        <SavedPanelHeader title="Saved Schedule" />
        <div className="mf-saved-list">
          {saved.map(s => (
            <div key={s.id} className={`mf-saved-card${sel === s.id ? ' selected' : ''}`}>
              <div className="mf-card-time-row">
                {s.startTime && s.endTime
                  ? <span>{s.startTime} to {s.endTime}</span>
                  : <span>10:00am to 4:00pm</span>
                }
                <Pill color="blue">{s.tripType || 'Order or Unorder'}</Pill>
                <span style={{ marginLeft:'auto', marginRight:4, whiteSpace:'nowrap' }}>
                  Start at {s.startDate || '5.2.2025'}
                </span>
                <div className="mf-dot-menu">
                  <CrudMenu
                    onSelect={() => handleApply(s)}
                    onDelete={() => handleDelete(s.id)}
                    onApply={() => handleApply(s)}
                  />
                </div>
              </div>
              <div className="mf-saved-card-top">
                <span style={{ color:'#2563eb', fontSize:13 }}><Icons.People /></span>
                <span className="mf-saved-card-name">{s.userName || 'Karthick'}</span>
              </div>
              <div className="mf-saved-card-sub">{s.tripType || 'Trip type'}</div>
              <div className="mf-saved-card-meta">
                <span>{s.tripName || 'Trip name'}</span>
                <span>Rounds: {s.maxRound || 11}</span>
                <span>{s.ordered ? 'Order' : 'Unorder'}</span>
                <span>Exp {s.expDate || '12.2.2025'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}