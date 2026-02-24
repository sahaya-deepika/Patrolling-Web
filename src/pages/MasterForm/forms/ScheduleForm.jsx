import { useState, useEffect } from 'react'
import { getSchedules, createSchedule, deleteSchedule } from '../../../api'
import { MfInput, NativeInput, ToggleBtn, SaveBtn, SavedPanelHeader, Pill, SectionLabel, CrudMenu, Icons } from '../components/MasterFormUI'

const blank = { userName:'', tripName:'', tripType:'', maxRound:'', minRound:'', ordered:true, startDate:'', endDate:'', expDate:'', startTime:'', endTime:'' }

export default function ScheduleForm() {
  const [form, setForm]   = useState(blank)
  const [saved, setSaved] = useState([])
  const [busy, setBusy]   = useState(false)
  const [sel,  setSel]    = useState(null)

  useEffect(() => { getSchedules().then(setSaved).catch(() => {}) }, [])
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    if (!form.userName) return
    setBusy(true)
    try { const c = await createSchedule(form); setSaved(p => [c, ...p]); setForm(blank) } catch (e) {}
    setBusy(false)
  }

  const handleDelete = async (id) => {
    try { await deleteSchedule(id); setSaved(p => p.filter(s => s.id !== id)) } catch (e) {}
  }

  const handleSelect = (item) => { setForm({ ...blank, ...item }); setSel(item.id) }

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
              <div className="mf-field-box"><NativeInput type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} /></div>
              <div className="mf-field-box"><NativeInput type="date" value={form.endDate}   onChange={e => set('endDate',   e.target.value)} /></div>
            </div>
            <NativeInput type="date" placeholder="Expired date" value={form.expDate} onChange={e => set('expDate', e.target.value)} />
            <div className="mf-field-row">
              <div className="mf-field-box"><NativeInput type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} /></div>
              <div className="mf-field-box"><NativeInput type="time" value={form.endTime}   onChange={e => set('endTime',   e.target.value)} /></div>
            </div>
          </div>
        </div>
        <SaveBtn onClick={handleSave} loading={busy} />
      </div>

      <div className="mf-saved-col">
        <SavedPanelHeader title="Saved Schedule" />
        <div className="mf-saved-list">
          {saved.map((s) => (
            <div key={s.id} className={`mf-saved-card${sel===s.id?' selected':''}`}>
              <div className="mf-saved-card-top">
                <span style={{ color:'#2563eb' }}><Icons.People /></span>
                <span className="mf-saved-card-name">{s.userName || 'Karthick'}</span>
                <CrudMenu onSelect={() => handleSelect(s)} onDelete={() => handleDelete(s.id)} onApply={() => setSel(s.id)} />
              </div>
              <div className="mf-saved-card-sub">Trip type</div>
              <div className="mf-saved-card-meta">
                <span>{s.tripName||'Trip name'}</span>
                <span>Rounds: {s.maxRound||11}</span>
                <span>{s.ordered?'Order':'Unorder'}</span>
                <span>Exp {s.expDate||'12.2.2025'}</span>
              </div>
              <div className="mf-saved-card-tags">
                <Pill color="blue">{s.tripType||'Order or Unorder'}</Pill>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}