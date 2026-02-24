
import { useState, useEffect } from 'react'
import { Toggle, Avatar } from 'rsuite'
import { getUsers, createUser, deleteUser } from '../../../api'
import { MfInput, InputWithPlus, SaveBtn, SavedPanelHeader, Pill, SectionLabel, CrudMenu, Icons } from '../components/MasterFormUI'

const blank = { userId:'', userName:'', mobile:'', mail:'', image:null, company:'', zone:'', shift:'', designation:'', role:'', department:'', isAdmin:false }

export default function UserForm() {
  const [form, setForm]   = useState(blank)
  const [saved, setSaved] = useState([])
  const [busy, setBusy]   = useState(false)
  const [sel,  setSel]    = useState(null)

  useEffect(() => { getUsers().then(setSaved).catch(() => {}) }, [])
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    if (!form.userName) return
    setBusy(true)
    try { const c = await createUser(form); setSaved(p => [c, ...p]); setForm(blank) } catch(e) {}
    setBusy(false)
  }
  const handleDelete = async id => { try { await deleteUser(id); setSaved(p => p.filter(u => u.id !== id)) } catch(e) {} }

  return (
    <div className="mf-split">
      <div className="mf-form-col">
        <p className="mf-form-title">Create User</p>
        <div className="mf-section-row">
          <SectionLabel>Personal info</SectionLabel>
          <div className="mf-section-fields">
            <div className="mf-field-row">
              <div className="mf-field-box"><MfInput placeholder="User ID"   value={form.userId}   onChange={v => set('userId', v)} /></div>
              <div className="mf-field-box"><MfInput placeholder="User name" value={form.userName} onChange={v => set('userName', v)} /></div>
            </div>
            <div className="mf-field-row">
              <div className="mf-field-box"><MfInput placeholder="Mobile" value={form.mobile} onChange={v => set('mobile', v)} /></div>
              <div className="mf-field-box"><MfInput placeholder="Mail"   value={form.mail}   onChange={v => set('mail', v)} /></div>
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
              <div className="mf-field-box"><InputWithPlus placeholder="Company" value={form.company} onChange={v => set('company', v)} options={['Company A','Company B','Company C']} /></div>
              <div className="mf-field-box"><MfInput placeholder="Zone" value={form.zone} onChange={v => set('zone', v)} /></div>
            </div>
            <div className="mf-field-row">
              <div className="mf-field-box"><MfInput placeholder="Shift"       value={form.shift}       onChange={v => set('shift', v)} /></div>
              <div className="mf-field-box"><MfInput placeholder="Designation" value={form.designation} onChange={v => set('designation', v)} /></div>
            </div>
            <div className="mf-field-row">
              <div className="mf-field-box"><MfInput placeholder="Role"       value={form.role}       onChange={v => set('role', v)} /></div>
              <div className="mf-field-box"><MfInput placeholder="Department" value={form.department} onChange={v => set('department', v)} /></div>
            </div>
            <div className="mf-is-admin-row">
              <span style={{ color: form.isAdmin ? '#111827' : '#9ca3af', fontSize: 13 }}>Is Admin</span>
              <Toggle size="sm" checked={form.isAdmin} onChange={v => set('isAdmin', v)} />
            </div>
          </div>
        </div>
        <SaveBtn onClick={handleSave} loading={busy} />
      </div>

      <div className="mf-saved-col">
        <SavedPanelHeader title="Saved User" />
        <div className="mf-saved-list">
          {saved.map(u => (
            <div key={u.id} className={`mf-saved-card${sel===u.id?' selected':''}`}>
              <div className="mf-saved-card-top">
                <Avatar circle size="xs" style={{ background:'var(--accent)', color:'#fff', fontWeight:700 }}>{(u.userName||'K').charAt(0)}</Avatar>
                <span className="mf-saved-card-name">{u.userName} ({u.userId})</span>
                <CrudMenu onSelect={() => { setForm({...blank,...u}); setSel(u.id) }} onDelete={() => handleDelete(u.id)} onApply={() => setSel(u.id)} />
              </div>
              <div className="mf-saved-card-sub">{u.mobile}</div>
              <div className="mf-saved-card-tags">
                {u.shift       && <Pill color="gray">{u.shift}</Pill>}
                {u.department  && <Pill color="blue">{u.department}</Pill>}
                {u.zone        && <Pill color="green">{u.zone}</Pill>}
                {u.designation && <Pill color="yellow">{u.designation}</Pill>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}