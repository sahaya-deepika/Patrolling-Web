// src/pages/MasterForm/forms/UserForm.jsx
import React, { useState, useEffect } from 'react'
import { Icons, MfInput, InputWithPlus, SaveBtn, SavedPanelHeader, Pill, SectionLabel } from '../components/MasterFormUI'
import { getUsers, createUser } from '../../../api'

export default function UserForm() {
  const blank = {
    userId: '', userName: '', mobile: '', mail: '', image: null,
    company: '', zone: '', shift: '', designation: '',
    role: '', department: '', isAdmin: false,
  }
  const [form, setForm]   = useState(blank)
  const [saved, setSaved] = useState([])
  const [busy, setBusy]   = useState(false)

  useEffect(() => { getUsers().then(setSaved) }, [])
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    if (!form.userName) return
    setBusy(true)
    const created = await createUser(form)
    setSaved(p => [created, ...p])
    setForm(blank)
    setBusy(false)
  }

  return (
    <div className="mf-split">
      <div className="mf-form-col">
        <p className="mf-form-title">Create User</p>

        <div className="mf-section-row">
          <SectionLabel>Personal info</SectionLabel>
          <div className="mf-section-fields">
            <div className="mf-field-row">
              <div className="mf-field-box"><MfInput placeholder="User ID"   value={form.userId}   onChange={v => set('userId', v)}   /></div>
              <div className="mf-field-box"><MfInput placeholder="User name" value={form.userName} onChange={v => set('userName', v)} /></div>
            </div>
            <div className="mf-field-row">
              <div className="mf-field-box"><MfInput placeholder="Mobile" value={form.mobile} onChange={v => set('mobile', v)} /></div>
              <div className="mf-field-box"><MfInput placeholder="Mail"   value={form.mail}   onChange={v => set('mail', v)}   /></div>
            </div>
            <label className="mf-image-upload">
              <span>{form.image ? form.image.name : 'Add image'}</span>
              <Icons.Attachment />
              <input type="file" accept="image/*" hidden onChange={e => set('image', e.target.files[0])} />
            </label>
          </div>
        </div>

        <div className="mf-section-row">
          <SectionLabel>Job info</SectionLabel>
          <div className="mf-section-fields">
            <div className="mf-field-row">
              <div className="mf-field-box"><InputWithPlus placeholder="Company" value={form.company} onChange={v => set('company', v)} /></div>
              <div className="mf-field-box"><MfInput       placeholder="Zone"    value={form.zone}    onChange={v => set('zone', v)}    /></div>
            </div>
            <div className="mf-field-row">
              <div className="mf-field-box"><MfInput placeholder="Shift"       value={form.shift}       onChange={v => set('shift', v)}       /></div>
              <div className="mf-field-box"><MfInput placeholder="Designation" value={form.designation} onChange={v => set('designation', v)} /></div>
            </div>
            <div className="mf-field-row">
              <div className="mf-field-box"><MfInput placeholder="Role"       value={form.role}       onChange={v => set('role', v)}       /></div>
              <div className="mf-field-box"><MfInput placeholder="Department" value={form.department} onChange={v => set('department', v)} /></div>
            </div>
            <div className="mf-is-admin-row">
              <span className={`mf-is-admin-label ${form.isAdmin ? 'on' : ''}`}>Is Admin</span>
              <div className={`mf-admin-circle ${form.isAdmin ? 'on' : ''}`} onClick={() => set('isAdmin', !form.isAdmin)}>
                {form.isAdmin && <Icons.Check />}
              </div>
            </div>
          </div>
        </div>

        <SaveBtn onClick={handleSave} loading={busy} />
      </div>

      <div className="mf-saved-col">
        <SavedPanelHeader title="Saved User" />
        <div className="mf-saved-list">
          {saved.map((u, i) => (
            <div key={u.id || i} className="mf-saved-card">
              <div className="mf-saved-card-top">
                <span style={{ color: '#2563eb' }}><Icons.People /></span>
                <span className="mf-saved-card-name">{u.userName}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                  <Pill color="blue">Employee roll</Pill>
                  <Pill color="green">Zone</Pill>
                </div>
              </div>
              <div className="mf-saved-card-sub">Trip type</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}