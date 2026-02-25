import { useState, useEffect } from 'react'
import { getLocations, createLocation, deleteLocation, updateLocation } from '../../../api'
import {
  MfInput, InputWithPlus, ImageUpload, SaveBtn, SavedPanelHeader,
  Pill, SectionLabel, CrudMenu, Icons,
} from '../components/MasterFormUI'

const blank = {
  companyLongName:'', companyShortName:'', companyCode:'',
  zone:'', shift:'', location:'', qrCode:'', rfid:'', image:null,
}

export default function LocationForm() {
  const [form, setForm] = useState(blank)
  const [saved, setSaved] = useState([])
  const [busy, setBusy]   = useState(false)
  const [sel, setSel]     = useState(null)

  useEffect(() => { getLocations().then(setSaved).catch(() => {}) }, [])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const handleApply = (item) => { setForm({ ...blank, ...item, image:null }); setSel(item.id) }
  const handleCancelEdit = () => { setForm(blank); setSel(null) }

  const handleSave = async () => {
    if (!form.companyLongName) return
    setBusy(true)
    try {
      if (sel) {
        const updated = typeof updateLocation === 'function' ? await updateLocation(sel, form) : { ...form, id:sel }
        setSaved(p => p.map(l => l.id === sel ? { ...l, ...updated } : l))
        setSel(null); setForm(blank)
      } else {
        const c = await createLocation(form)
        setSaved(p => [c, ...p]); setForm(blank)
      }
    } catch (e) {
      if (sel) { setSaved(p => p.map(l => l.id === sel ? { ...l, ...form } : l)); setSel(null); setForm(blank) }
    }
    setBusy(false)
  }

  const handleDelete = async (id) => {
    try { await deleteLocation(id) } catch (e) {}
    setSaved(p => p.filter(l => l.id !== id))
    if (sel === id) { setForm(blank); setSel(null) }
  }

  return (
    <div className="mf-split">

      {/* ── Form ── */}
      <div className="mf-form-col">
        <div className="mf-form-inner">
          <p className="mf-form-title">{sel ? 'Edit Location' : 'Create Location'}</p>

          <div className="mf-section-row">
            <SectionLabel>Company info</SectionLabel>
            <div className="mf-section-fields">
              <div className="mf-field-row">
                <div className="mf-field-box"><InputWithPlus placeholder="Company (Long name)"  value={form.companyLongName}  onChange={v => set('companyLongName', v)}  options={['OrbidX','Obx Corp','OrbidX Ltd']} /></div>
                <div className="mf-field-box"><InputWithPlus placeholder="Company (Short name)" value={form.companyShortName} onChange={v => set('companyShortName', v)} options={['OBX','ORB','OX']} /></div>
              </div>
              <InputWithPlus placeholder="Company code" value={form.companyCode} onChange={v => set('companyCode', v)} options={['C001','C002','C003']} />
            </div>
          </div>

          <div className="mf-section-row">
            <SectionLabel>Location info</SectionLabel>
            <div className="mf-section-fields">
              <div className="mf-field-row">
                <div className="mf-field-box"><InputWithPlus placeholder="Zone"  value={form.zone}  onChange={v => set('zone', v)}  options={['Zone 1','Zone 2','Zone 3']} /></div>
                <div className="mf-field-box"><InputWithPlus placeholder="Shift" value={form.shift} onChange={v => set('shift', v)} options={['Shift 1','Shift 2','Shift 3']} /></div>
              </div>
              <InputWithPlus placeholder="Location" value={form.location} onChange={v => set('location', v)} options={['Location A','Location B','Location C']} />
              <div className="mf-qr-row">
                <div className="mf-qr-field"><MfInput placeholder="QR code" value={form.qrCode} onChange={v => set('qrCode', v)} /></div>
                <span className="mf-qr-or">or</span>
                <div className="mf-qr-field"><MfInput placeholder="RFID" value={form.rfid} onChange={v => set('rfid', v)} /></div>
              </div>
              <ImageUpload value={form.image} onChange={v => set('image', v)} />
            </div>
          </div>

          <SaveBtn onClick={handleSave} loading={busy} isEditing={!!sel} onCancelEdit={handleCancelEdit} />
        </div>
      </div>

      {/* ── Saved panel ── */}
      <div className="mf-saved-col">
        <SavedPanelHeader title="Saved Location" />
        <div className="mf-saved-list">
          {saved.map(l => (
            <div key={l.id} className={`mf-saved-card${sel === l.id ? ' selected' : ''}`}>
              <div className="mf-card-time-row">
                <div style={{ width:18, height:18, borderRadius:4, background:'#dbeafe', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icons.Location style={{ fontSize:10, color:'#2563eb' }} />
                </div>
                <span style={{ fontWeight:600, fontSize:12, color:'#374151', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {l.companyLongName || 'OrbidX(Obx)'}
                </span>
                <div className="mf-dot-menu">
                  <CrudMenu onSelect={() => handleApply(l)} onDelete={() => handleDelete(l.id)} onApply={() => handleApply(l)} />
                </div>
              </div>
              <div className="mf-saved-card-sub">{l.companyCode || 'Company code'}</div>
              <div className="mf-saved-card-meta">
                {l.zone     && <span>{l.zone}</span>}
                {l.shift    && <span>{l.shift}</span>}
                {l.qrCode   && <span>QR: {l.qrCode}</span>}
                {l.location && <span>{l.location}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}