
import { useState, useEffect } from 'react'
import { Avatar } from 'rsuite'
import { getTrips, createTrip, deleteTrip } from '../../../api'
import { MfInput, InputWithPlus, ToggleBtn, SaveBtn, SavedPanelHeader, Pill, SectionLabel, CrudMenu, Icons } from '../components/MasterFormUI'

const blank = { tripName:'', tripType:'', mobile:'', mail:'', mode:'Cycle', employeeRoll:'', zone:'', location:'' }

export default function TripForm() {
  const [form, setForm]   = useState(blank)
  const [saved, setSaved] = useState([])
  const [busy, setBusy]   = useState(false)
  const [sel,  setSel]    = useState(null)

  useEffect(() => { getTrips().then(setSaved).catch(() => {}) }, [])
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    if (!form.tripName) return
    setBusy(true)
    try { const c = await createTrip({ ...form, tags:['Fill','Yes/No','Option'] }); setSaved(p => [c,...p]); setForm(blank) } catch(e) {}
    setBusy(false)
  }
  const handleDelete = async id => { try { await deleteTrip(id); setSaved(p => p.filter(t => t.id !== id)) } catch(e) {} }

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
              <div className="mf-field-box"><MfInput placeholder="Mail"   value={form.mail}   onChange={v => set('mail', v)} /></div>
            </div>
            <div className="mf-toggle-group">
              <ToggleBtn label="Cycle" active={form.mode==='Cycle'} onClick={() => set('mode','Cycle')} />
              <ToggleBtn label="Round" active={form.mode==='Round'} onClick={() => set('mode','Round')} />
            </div>
            <div className="mf-field-row">
              <div className="mf-field-box"><InputWithPlus placeholder="Employee roll" value={form.employeeRoll} onChange={v => set('employeeRoll', v)} options={['Roll A','Roll B','Roll C']} /></div>
              <div className="mf-field-box"><InputWithPlus placeholder="Zone"          value={form.zone}         onChange={v => set('zone', v)}         options={['Zone 1','Zone 2','Zone 3']} /></div>
            </div>
            <InputWithPlus placeholder="Location" value={form.location} onChange={v => set('location', v)} options={['Location A','Location B','Location C']} />
          </div>
        </div>
        <SaveBtn onClick={handleSave} loading={busy} />
      </div>

      <div className="mf-saved-col">
        <SavedPanelHeader title="Saved Trip" />
        <div className="mf-saved-list">
          {saved.map(t => (
            <div key={t.id} className={`mf-saved-card${sel===t.id?' selected':''}`}>
              <div className="mf-saved-card-top">
                <span style={{ color:'#2563eb' }}><Icons.ArrowRight /></span>
                <span className="mf-saved-card-name">{t.tripName}</span>
                <CrudMenu onSelect={() => { setForm({...blank,...t}); setSel(t.id) }} onDelete={() => handleDelete(t.id)} onApply={() => setSel(t.id)} />
              </div>
              <div className="mf-saved-card-sub">Trip type: {t.tripType}</div>
              <div className="mf-saved-card-tags">
                {(t.tags||['Fill','Yes/No','Option']).map(tag => (
                  <Pill key={tag} color={tag==='Fill'?'gray':tag==='Yes/No'?'blue':'orange'}>{tag}</Pill>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}