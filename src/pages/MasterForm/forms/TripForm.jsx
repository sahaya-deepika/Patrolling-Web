import { useState, useEffect } from 'react'
import { getTrips, createTrip, deleteTrip, updateTrip } from '../../../api'
import {
  MfInput, InputWithPlus, ToggleBtn, SaveBtn, SavedPanelHeader,
  Pill, SectionLabel, CrudMenu, Icons,
} from '../components/MasterFormUI'

const blank = { tripName:'', tripType:'', mobile:'', mail:'', mode:'Cycle', employeeRoll:'', zone:'', location:'' }

export default function TripForm() {
  const [form, setForm] = useState(blank)
  const [saved, setSaved] = useState([])
  const [busy, setBusy]   = useState(false)
  const [sel, setSel]     = useState(null)

  useEffect(() => { getTrips().then(setSaved).catch(() => {}) }, [])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const handleApply = (item) => { setForm({ ...blank, ...item }); setSel(item.id) }
  const handleCancelEdit = () => { setForm(blank); setSel(null) }

  const handleSave = async () => {
    if (!form.tripName) return
    setBusy(true)
    try {
      if (sel) {
        const updated = typeof updateTrip === 'function' ? await updateTrip(sel, form) : { ...form, id:sel }
        setSaved(p => p.map(t => t.id === sel ? { ...t, ...updated } : t))
        setSel(null); setForm(blank)
      } else {
        const c = await createTrip({ ...form, tags:['Fill','Yes/No','Option'] })
        setSaved(p => [c, ...p]); setForm(blank)
      }
    } catch (e) {
      if (sel) { setSaved(p => p.map(t => t.id === sel ? { ...t, ...form } : t)); setSel(null); setForm(blank) }
    }
    setBusy(false)
  }

  const handleDelete = async (id) => {
    try { await deleteTrip(id) } catch (e) {}
    setSaved(p => p.filter(t => t.id !== id))
    if (sel === id) { setForm(blank); setSel(null) }
  }

  return (
    <div className="mf-split">

      {/* ── Form ── */}
      <div className="mf-form-col">
        <div className="mf-form-inner">
          <p className="mf-form-title">{sel ? 'Edit Trip' : 'Create Trip'}</p>

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
                <ToggleBtn label="Cycle" active={form.mode === 'Cycle'} onClick={() => set('mode','Cycle')} />
                <ToggleBtn label="Round" active={form.mode === 'Round'} onClick={() => set('mode','Round')} />
              </div>
              <div className="mf-field-row">
                <div className="mf-field-box"><InputWithPlus placeholder="Employee roll" value={form.employeeRoll} onChange={v => set('employeeRoll', v)} options={['Roll A','Roll B','Roll C']} /></div>
                <div className="mf-field-box"><InputWithPlus placeholder="Zone"          value={form.zone}         onChange={v => set('zone', v)}         options={['Zone 1','Zone 2','Zone 3']} /></div>
              </div>
              <InputWithPlus placeholder="Location" value={form.location} onChange={v => set('location', v)} options={['Location A','Location B','Location C']} />
            </div>
          </div>

          <SaveBtn onClick={handleSave} loading={busy} isEditing={!!sel} onCancelEdit={handleCancelEdit} />
        </div>
      </div>

      {/* ── Saved panel ── */}
      <div className="mf-saved-col">
        <SavedPanelHeader title="Saved Trip" />
        <div className="mf-saved-list">
          {saved.map(t => (
            <div key={t.id} className={`mf-saved-card${sel === t.id ? ' selected' : ''}`}>
              <div className="mf-card-time-row">
                <span style={{ color:'#2563eb', display:'flex', alignItems:'center', gap:4 }}>
                  <Icons.ArrowRight style={{ fontSize:11 }} />
                  <span style={{ fontWeight:600, color:'#374151', fontSize:12 }}>{t.tripName}</span>
                </span>
                <Pill color={t.mode === 'Cycle' ? 'blue' : 'green'}>{t.mode || 'Cycle'}</Pill>
                <div className="mf-dot-menu" style={{ marginLeft:'auto' }}>
                  <CrudMenu onSelect={() => handleApply(t)} onDelete={() => handleDelete(t.id)} onApply={() => handleApply(t)} />
                </div>
              </div>
              <div className="mf-saved-card-sub">{t.tripType ? `Trip type: ${t.tripType}` : 'Trip type'}</div>
              <div className="mf-saved-card-meta">
                {t.zone         && <span>{t.zone}</span>}
                {t.employeeRoll && <span>{t.employeeRoll}</span>}
                {t.location     && <span>{t.location}</span>}
              </div>
              {t.tags && (
                <div className="mf-saved-card-tags">
                  {t.tags.map(tag => (
                    <Pill key={tag} color={tag==='Fill'?'gray':tag==='Yes/No'?'blue':'orange'}>{tag}</Pill>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}