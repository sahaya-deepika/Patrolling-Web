// src/pages/MasterForm/forms/LocationForm.jsx
import React, { useState, useEffect } from 'react'
import { Icons, NativeInput, InputWithPlus, SaveBtn, SavedPanelHeader, SectionLabel } from '../components/MasterFormUI'
import { getLocations, createLocation } from '../../../api'

export default function LocationForm() {
  const blank = { companyLongName: '', companyShortName: '', companyCode: '', zone: '', shift: '', location: '', qrCode: '', rfid: '', image: null }
  const [form, setForm]   = useState(blank)
  const [saved, setSaved] = useState([])
  const [busy, setBusy]   = useState(false)

  useEffect(() => { getLocations().then(setSaved) }, [])
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    if (!form.companyLongName) return
    setBusy(true)
    const created = await createLocation(form)
    setSaved(p => [created, ...p])
    setForm(blank)
    setBusy(false)
  }

  return (
    <div className="mf-split">
      <div className="mf-form-col">
        <p className="mf-form-title">Create Location</p>

        <div className="mf-section-row">
          <SectionLabel>Company info</SectionLabel>
          <div className="mf-section-fields">
            <div className="mf-field-row">
              <div className="mf-field-box"><InputWithPlus placeholder="Company (Long name)"  value={form.companyLongName}  onChange={v => set('companyLongName', v)}  /></div>
              <div className="mf-field-box"><InputWithPlus placeholder="Company (Short name)" value={form.companyShortName} onChange={v => set('companyShortName', v)} /></div>
            </div>
            <InputWithPlus placeholder="Company code" value={form.companyCode} onChange={v => set('companyCode', v)} />
          </div>
        </div>

        <div className="mf-section-row">
          <SectionLabel>Trip info</SectionLabel>
          <div className="mf-section-fields">
            <div className="mf-field-row">
              <div className="mf-field-box"><InputWithPlus placeholder="Zone"  value={form.zone}  onChange={v => set('zone', v)}  /></div>
              <div className="mf-field-box"><InputWithPlus placeholder="Shift" value={form.shift} onChange={v => set('shift', v)} /></div>
            </div>
            <InputWithPlus placeholder="Location" value={form.location} onChange={v => set('location', v)} />
            <div className="mf-qr-row">
              <div className="mf-qr-field">
                <NativeInput placeholder="QR code" value={form.qrCode} onChange={e => set('qrCode', e.target.value)} />
                <span className="mf-qr-icon"><Icons.Attachment /></span>
              </div>
              <span className="mf-qr-or">or</span>
              <div className="mf-qr-field">
                <NativeInput placeholder="RFID" value={form.rfid} onChange={e => set('rfid', e.target.value)} />
                <span className="mf-qr-icon"><Icons.Attachment /></span>
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
          {saved.map((l, i) => (
            <div key={l.id || i} className="mf-saved-card">
              <div className="mf-saved-card-top">
                <div className="mf-icon-square">
                  <Icons.Location />
                </div>
                <span className="mf-saved-card-name">{l.companyLongName || 'OrbidX(Obx)'}</span>
              </div>
              <div className="mf-saved-card-sub">{l.companyCode || 'Company code'}</div>
              <div className="mf-loc-tags">
                {['Zone', 'Shift', 'QR/Barcode', 'Attached', 'Location'].map(tag => (
                  <span key={tag} className="mf-loc-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}