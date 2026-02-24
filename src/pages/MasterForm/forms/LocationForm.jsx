import { useState, useEffect } from 'react'
import { getLocations, createLocation, deleteLocation } from '../../../api'
import { NativeInput, InputWithPlus, SaveBtn, SavedPanelHeader, Pill, SectionLabel, CrudMenu, Icons } from '../components/MasterFormUI'

const blank = { companyLongName:'', companyShortName:'', companyCode:'', zone:'', shift:'', location:'', qrCode:'', rfid:'', image:null }

export default function LocationForm() {
  const [form, setForm]   = useState(blank)
  const [saved, setSaved] = useState([])
  const [busy, setBusy]   = useState(false)
  const [sel,  setSel]    = useState(null)

  useEffect(() => { getLocations().then(setSaved).catch(() => {}) }, [])
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    if (!form.companyLongName) return
    setBusy(true)
    try { const c = await createLocation(form); setSaved(p=>[c,...p]); setForm(blank) } catch(e) {}
    setBusy(false)
  }
  const handleDelete = async id => { try { await deleteLocation(id); setSaved(p => p.filter(l => l.id !== id)) } catch(e) {} }

  return (
    <div className="mf-split">
      <div className="mf-form-col">
        <p className="mf-form-title">Create Location</p>
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
          <SectionLabel>Trip info</SectionLabel>
          <div className="mf-section-fields">
            <div className="mf-field-row">
              <div className="mf-field-box"><InputWithPlus placeholder="Zone"  value={form.zone}  onChange={v => set('zone', v)}  options={['Zone 1','Zone 2','Zone 3']} /></div>
              <div className="mf-field-box"><InputWithPlus placeholder="Shift" value={form.shift} onChange={v => set('shift', v)} options={['Shift 1','Shift 2','Shift 3']} /></div>
            </div>
            <InputWithPlus placeholder="Location" value={form.location} onChange={v => set('location', v)} options={['Location A','Location B','Location C']} />
            <div className="mf-qr-row">
              <div className="mf-qr-field">
                <NativeInput placeholder="QR code" value={form.qrCode} onChange={e => set('qrCode', e.target.value)} />
              </div>
              <span className="mf-qr-or">or</span>
              <div className="mf-qr-field">
                <NativeInput placeholder="RFID" value={form.rfid} onChange={e => set('rfid', e.target.value)} />
              </div>
            </div>
            <label className="mf-image-upload">
              <span>{form.image ? form.image.name : 'Add image'}</span>
              <Icons.Attachment />
              <input type="file" accept="image/*" hidden onChange={e => set('image', e.target.files[0])} />
            </label>
          </div>
        </div>
        <SaveBtn onClick={handleSave} loading={busy} />
      </div>

      <div className="mf-saved-col">
        <SavedPanelHeader title="Create Location" />
        <div className="mf-saved-list">
          {saved.map(l => (
            <div key={l.id} className={`mf-saved-card${sel===l.id?' selected':''}`}>
              <div className="mf-saved-card-top">
                <div style={{ width:20, height:20, borderRadius:4, background:'#dbeafe', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icons.Location style={{ fontSize:10, color:'#2563eb' }} />
                </div>
                <span className="mf-saved-card-name">{l.companyLongName||'OrbidX(Obx)'}</span>
                <CrudMenu onSelect={() => { setForm({...blank,...l}); setSel(l.id) }} onDelete={() => handleDelete(l.id)} onApply={() => setSel(l.id)} />
              </div>
              <div className="mf-saved-card-sub">{l.companyCode||'Company code'}</div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {['Zone','Shift','QR/Barcode','Attached','Location'].map(tag => (
                  <span key={tag} style={{ fontSize:10, color:'#6b7280' }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}