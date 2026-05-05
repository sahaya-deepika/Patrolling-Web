

import { useState, useEffect, useRef } from 'react'
import {
  getUsers, createUser, deleteUser, updateUser,
  getZones,        createZone,
  getPatrolTypes,  createPatrolType, 
  getDesignations, createDesignation,
  getDepartments,  createDepartment,
  getAuth,
} from '../../../api'
import { ConfirmSaveModal } from '../components/MasterFormUI'

const blank = {
  userid: '', name: '', mobile: '', mail: '',
  image: null, zone: '', dsg: '', patroltype: '', dept: '',
  is_admin: false, role:"2"
}

const COLORS = ['#1a73e8','#e8371a','#1e8e3e','#8e1ae8','#e8a81a','#1ae8d4','#e81a8e','#4a90d9']
const fallbackNames = ['Karthick','Arjun','Priya','Ravi','Meena','Suresh','Divya','Vikram']

/* ══════════════════════════════════════════════════════
   INLINE CREATE MODAL — pops above the field to add a
   new master item (Zone / Designation / etc.) on the fly
══════════════════════════════════════════════════════ */
function InlineCreateModal({ open, label, fieldLabel, onConfirm, onCancel, busy }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) { setValue(''); setTimeout(() => inputRef.current?.focus(), 60) }
  }, [open])

  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '28px 28px 22px', minWidth: '340px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 600, color: '#202124' }}>Add {label}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{fieldLabel}</label>
          <input
            ref={inputRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && value.trim()) onConfirm(value.trim()) }}
            placeholder={`Enter ${label.toLowerCase()} name…`}
            style={{ padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onCancel} disabled={busy}
            style={{ padding: '9px 18px', border: '1px solid #dadce0', borderRadius: '6px', background: '#fff', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={() => value.trim() && onConfirm(value.trim())} disabled={busy || !value.trim()}
            style={{ padding: '9px 22px', border: 'none', borderRadius: '6px', background: value.trim() ? '#1e8e3e' : '#ccc', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: value.trim() ? 'pointer' : 'not-allowed' }}>
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   FIELD DROPDOWN — searchable, with + to inline-create
══════════════════════════════════════════════════════ */
function FieldDropdown({ value, onChange, options, placeholder, onCreateNew }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch('') } }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()))

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          placeholder={placeholder}
          value={open ? search : value}
          onChange={e => { setSearch(e.target.value); onChange(e.target.value); setOpen(true) }}
          onFocus={() => { setOpen(true); setSearch('') }}
          style={{ flex: 1, minWidth: 0, padding: '10px 14px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }}
        />
        <button
          type="button"
          title={`Add new ${placeholder}`}
          onClick={(e) => { e.stopPropagation(); setOpen(false); onCreateNew?.() }}
          style={{ width: '38px', height: '42px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 8px 8px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >+</button>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '200px', overflowY: 'auto', overflowX: 'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '10px 14px', fontSize: '13px', color: '#9aa0a6' }}>
              {search ? `No match — click + to create "${search}"` : 'No options yet. Click + to add.'}
            </div>
          ) : filtered.map(opt => (
            <div key={opt} onMouseDown={() => { onChange(opt); setOpen(false); setSearch('') }}
              style={{ padding: '10px 14px', fontSize: '13px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', background: opt === value ? '#f0f4ff' : '#fff' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
              onMouseLeave={e => e.currentTarget.style.background = opt === value ? '#f0f4ff' : '#fff'}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── 3-dot card menu ── */
function CardMenu({ onSelect, onClone, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const items = [
    { label: 'Select', icon: '☑', color: '#202124', action: onSelect },
    { label: 'Clone',  icon: '⧉', color: '#202124', action: onClone  },
    { label: 'Edit',   icon: '✎', color: '#202124', action: onEdit   },
    { label: 'Delete', icon: '🗑', color: '#d93025', action: onDelete },
  ]
  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '18px', color: '#5f6368', lineHeight: 1, borderRadius: '4px' }}>⋮</button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
          {items.map(({ label, icon, color, action }) => (
            <div key={label} onMouseDown={() => { action(); setOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            ><span style={{ fontSize: '14px' }}>{icon}</span>{label}</div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   MAIN UserForm
══════════════════════════════════════════════════════ */
export default function UserForm() {
  const [form, setForm]           = useState(blank)
  const [saved, setSaved]         = useState([])
  const [busy, setBusy]           = useState(false)
  const [sel, setSel]             = useState(null)
  const [confirm, setConfirm]     = useState(false)
  const [showSaved, setShowSaved] = useState(true)
  const [selectMode, setSelectMode]   = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [search, setSearch]           = useState('')

  /* master data options */
  const [zoneOptions,      setZoneOptions]      = useState([])
  const [desgOptions,      setDesgOptions]      = useState([])
  const [patrolTypeOptions,setPatrolTypeOptions] = useState([])
  const [deptOptions,      setDeptOptions]      = useState([])

  /* inline-create modal state */
  const [createModal, setCreateModal] = useState({ open: false, type: null })
  const [createBusy,  setCreateBusy]  = useState(false)

  const fileRef = useRef(null)

  /* ── Load all data on mount ── */
  useEffect(() => {
    getUsers().then(setSaved).catch(() => {})
    refreshMasters()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleZonesUpdated = () => refreshMasters()
    window.addEventListener('zones-updated', handleZonesUpdated)
    return () => window.removeEventListener('zones-updated', handleZonesUpdated)
  }, [])

  const refreshMasters = () => {
    getZones().then(z => setZoneOptions(z.map(x => x.zoneNameLong || x.zoneNameShort).filter(Boolean).sort())).catch(() => {})
    getPatrolTypes().then(p => setPatrolTypeOptions(p.map(x => x.patrolName).filter(Boolean).sort())).catch(() => {})
    getDesignations().then(d => setDesgOptions(d.map(x => x.designationName).filter(Boolean).sort())).catch(() => {})
    getDepartments().then(d => setDeptOptions(d.map(x => x.departmentName).filter(Boolean).sort())).catch(() => {})
  }

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleEdit   = item => { setForm({ ...blank, ...item, image: null, imagePreview: null }); setSel(item.id) }
  const handleClone  = item => { const { id, ...rest } = item; setForm({ ...blank, ...rest, image: null, imagePreview: null }); setSel(null) }
  const handleCancelEdit = () => { setForm(blank); setSel(null) }
  const handleSaveClick  = () => { 
    if (!form.name) return; 
    setConfirm(true) 
  }

  const handleConfirmed = async () => {
    const auth = getAuth();
    setBusy(true)
    const { image, imagePreview, ...payload } = form
    try {
      if (sel) {
        const updated = await updateUser(sel, payload)
        setSaved(p => p.map(u => u.id === sel ? { ...u, ...updated } : u))
        setSel(null); setForm(blank)
      } else {
        const created = await createUser({...payload, api_key: auth.api_key, e_id: "3", name: 'all', lat: "11.0271", lon: "76.9830",
    adrs1: '-', adrs2: '-', city: '-',
    district: '-', state: '-', country: 'india',
    zipcode: '000000', mail: 'a@a.com', mobile: '0000000000', limit: "10", offset: 0, id: "1", zone: [form.zone], is_admin: form.is_admin ? "1" : "0", role: "2", shift:"2"})
        // setSaved(p => [created, ...p]); 
        setForm(blank)
      }
    } catch {
      if (sel) { setSaved(p => p.map(u => u.id === sel ? { ...u, ...payload } : u)); setSel(null); setForm(blank) }
    }
    setBusy(false); setConfirm(false)
  }

  const handleDelete = async id => {
    try { await deleteUser(id) } catch {}
    setSaved(p => p.filter(u => u.id !== id))
    if (sel === id) { setForm(blank); setSel(null) }
  }

  const enterSelectMode = id => { setSelectMode(true); setSelectedIds([id]) }
  const toggleSelect    = id => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
  const deleteSelected  = async () => {
    for (const id of selectedIds) { try { await deleteUser(id) } catch {} }
    setSaved(p => p.filter(u => !selectedIds.includes(u.id)))
    if (selectedIds.includes(sel)) { setForm(blank); setSel(null) }
    setSelectMode(false); setSelectedIds([])
  }

  const handleImageChange = e => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => set('imagePreview', ev.target.result)
    reader.readAsDataURL(file)
    set('image', file)
  }

  /* ── Inline master create ── */
  const openCreate = type => setCreateModal({ open: true, type })
  const cancelCreate = () => setCreateModal({ open: false, type: null })

  const handleInlineCreate = async (value) => {
    setCreateBusy(true)
    try {
      const { type } = createModal
      if (type === 'zone') {
        await createZone({ zoneNameLong: value, zoneNameShort: value })
        await refreshMasters()
        set('zone', value)
      } else if (type === 'designation') {
        await createDesignation({ designationName: value })
        setDesgOptions(p => [...p, value].sort())
        set('designation', value)
      } else if (type === 'patroltype') {
        await createPatrolType({ patrolName: value })
        setPatrolTypeOptions(p => [...p, value].sort())
        set('patroltype', value)
      } else if (type === 'department') {
        await createDepartment({ departmentName: value })
        setDeptOptions(p => [...p, value].sort())
        set('department', value)
      }
    } catch {}
    setCreateBusy(false)
    setCreateModal({ open: false, type: null })
  }

  const MODAL_META = {
    zone:        { label: 'Zone',        fieldLabel: 'Zone Name' },
    designation: { label: 'Designation', fieldLabel: 'Designation Name' },
    patroltype:  { label: 'Patrol Type', fieldLabel: 'Patrol Type Name' },
    department:  { label: 'Department',  fieldLabel: 'Department Name' },
  }

  const summary = [
    { label: 'User ID',     value: form.userid },
    { label: 'User Name',   value: form.name },
    { label: 'Mobile',      value: form.mobile },
    { label: 'Mail',        value: form.mail },
    { label: 'Zone',        value: form.zone },
    { label: 'Designation', value: form.dsg },
    { label: 'Patrol Type', value: form.patroltype },
    { label: 'Department',  value: form.dept },
    { label: 'Is Admin',    value: form.is_admin ? 'Yes' : 'No' },
  ]

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #dadce0',
    borderRadius: '8px', fontSize: '13px', color: '#202124',
    outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff',
  }

  const filteredSaved = saved.filter(u => {
    const q = search.toLowerCase()
    return (u.userName||'').toLowerCase().includes(q)
      || (u.userid||'').toLowerCase().includes(q)
      || (u.mobile||'').includes(q)
      || (u.mail||'').toLowerCase().includes(q)
  })

  const meta = MODAL_META[createModal.type] || {}

  console.log(zoneOptions);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>

      {/* ── Inline create modal ── */}
      <InlineCreateModal
        open={createModal.open}
        label={meta.label || ''}
        fieldLabel={meta.fieldLabel || ''}
        onConfirm={handleInlineCreate}
        onCancel={cancelCreate}
        busy={createBusy}
      />

      <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

      {/* ═══ LEFT: FORM ═══ */}
      <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0 }}>
          {sel ? 'Edit User' : 'Create User'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Row 1: User ID & User Name */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <input placeholder="User ID"   value={form.userid}   onChange={e => set('userid',   e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <input placeholder="User Name" value={form.name} onChange={e => set('name', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
          </div>

          {/* Row 2: Mobile & Mail */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <input placeholder="Mobile" value={form.mobile} onChange={e => set('mobile', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <input placeholder="Mail"   value={form.mail}   onChange={e => set('mail',   e.target.value)} style={{ ...inputStyle, flex: 1 }} type="email" />
          </div>

          {/* Image upload */}
          <div onClick={() => fileRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', background: '#fff', height: '42px', boxSizing: 'border-box' }}>
            {form.imagePreview
              ? <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={form.imagePreview} alt="preview" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{ fontSize: '13px', color: '#202124' }}>Image selected</span>
                </div>
              : <span style={{ fontSize: '13px', color: '#9aa0a6' }}>Add image</span>}
            <span style={{ fontSize: '18px', color: '#5f6368' }}>📎</span>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
          </div>

          {/* Row 3: Zone & Designation — with inline-create */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <FieldDropdown placeholder="Zone"        value={form.zone}        onChange={v => set('zone', v)}        options={zoneOptions}      onCreateNew={() => openCreate('zone')} />
            <FieldDropdown placeholder="Designation" value={form.dsg} onChange={v => set('dsg', v)} options={desgOptions}       onCreateNew={() => openCreate('designation')} />
          </div>

          {/* Row 4: Patrol Type & Department — with inline-create */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <FieldDropdown placeholder="Patrol Type" value={form.patroltype}  onChange={v => set('patroltype', v)}  options={patrolTypeOptions} onCreateNew={() => openCreate('patroltype')} />
            <FieldDropdown placeholder="Department"  value={form.dept}  onChange={v => set('dept', v)}  options={deptOptions}       onCreateNew={() => openCreate('department')} />
          </div>

          {/* Is Admin toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', background: '#fff' }}>
            <span style={{ fontSize: '13px', color: '#202124' }}>Is Admin</span>
            <div onClick={() => set('is_admin', !form.is_admin)}
              style={{ width: '36px', height: '20px', borderRadius: '10px', background: form.is_admin ? '#1a73e8' : '#ccc', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', display: 'flex', alignItems: 'center', padding: '2px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#fff', position: 'absolute', left: form.is_admin ? '18px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </div>
          </div>

        </div>

        {/* Save / Cancel buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '20px', marginTop: 'auto' }}>
          {sel && <button onClick={handleCancelEdit} style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '6px', background: '#fff', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>}
          <button onClick={handleSaveClick} style={{ padding: '10px 32px', border: 'none', borderRadius: '6px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
            {sel ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      {/* ═══ RIGHT: SAVED USERS ═══ */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
          {selectMode ? (
            <>
              <div onClick={() => setSelectedIds(selectedIds.length === saved.length ? [] : saved.map(u => u.id))}
                style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                {selectedIds.length === saved.length ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
                  : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
              </div>
              <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
                {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Users'}
              </h2>
              <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                <button onClick={deleteSelected} disabled={selectedIds.length === 0}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: selectedIds.length > 0 ? '#fce8e6' : '#f5f5f5', border: 'none', color: selectedIds.length > 0 ? '#d93025' : '#bbb', fontSize: '12px', fontWeight: 600, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', padding: '5px 10px', borderRadius: '4px' }}>
                  🗑 Delete
                </button>
                <button onClick={cancelSelect}
                  style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: '12px', fontWeight: 500, cursor: 'pointer', padding: '5px 8px', borderRadius: '4px' }}>
                  ✕ Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {showSaved && <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0 }}>Saved Users <span style={{ fontSize: '12px', fontWeight: 400, color: '#9aa0a6', marginLeft: '4px' }}>({saved.length})</span></h2>}
              <button onClick={() => setShowSaved(s => !s)}
                style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
                {showSaved ? '⊏' : '⊐'}
              </button>
            </>
          )}
        </div>

        {/* Search bar */}
        {showSaved && !selectMode && (
          <div style={{ padding: '10px 12px 0', flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: '#9aa0a6' }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
                style={{ width: '100%', padding: '8px 10px 8px 30px', border: '1px solid #e8eaed', borderRadius: '6px', fontSize: '12px', color: '#202124', outline: 'none', boxSizing: 'border-box', background: '#fafbfc' }} />
            </div>
          </div>
        )}

        {/* Saved list */}
        {showSaved && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>
            {filteredSaved.map((u, idx) => {
              const displayName = u.userName || fallbackNames[idx % fallbackNames.length]
              const avatarColor = COLORS[idx % COLORS.length]
              const isChecked   = selectedIds.includes(u.id)
              return (
                <div key={u.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  {selectMode && (
                    <div onClick={() => toggleSelect(u.id)}
                      style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0, border: `1px solid ${selectMode && isChecked ? '#1a73e8' : '#e0e0e0'}`, borderRadius: '10px', padding: '10px 12px', background: selectMode && isChecked ? '#f0f4ff' : '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>

                    {/* Top: role badge + menu */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ background: u.is_admin ? '#1a73e8' : '#1e8e3e', color: '#fff', padding: '2px 7px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {u.is_admin ? 'ADMIN' : 'USER'}
                        </span>
                        {u.company && <span style={{ fontSize: '11px', color: '#5f6368', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>{u.company}</span>}
                      </div>
                      <CardMenu
                        onSelect={() => enterSelectMode(u.id)}
                        onClone={() => handleClone(u)}
                        onEdit={() => handleEdit(u)}
                        onDelete={() => handleDelete(u.id)}
                      />
                    </div>

                    {/* Avatar + Name + ID */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                        {u.imagePreview
                          ? <img src={u.imagePreview} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                          : displayName.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {displayName}{u.userid ? ` (${u.userid})` : ''}
                        </div>
                        <div style={{ fontSize: '11px', color: '#5f6368', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {u.mobile || '—'}{u.mail ? ` · ${u.mail}` : ''}
                        </div>
                      </div>
                    </div>

                    {/* Pill tags — Zone, Designation, Patrol Type, Department */}
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {[
                        u.zone        && { label: u.zone,        bg: '#e8f0fe', border: '#d2e3fc', color: '#1a73e8' },
                        u.designation && { label: u.designation, bg: '#fef7e0', border: '#fde293', color: '#856400' },
                        u.patroltype  && { label: u.patroltype,  bg: '#f3e8fd', border: '#e0c3fc', color: '#6a1a8e' },
                        u.department  && { label: u.department,  bg: '#e6f4ea', border: '#b7dfbf', color: '#1e6e3e' },
                      ].filter(Boolean).map(t => (
                        <span key={t.label} style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '2px 8px', fontSize: '11px', color: t.color, whiteSpace: 'nowrap' }}>
                          {t.label}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>
              )
            })}
            {filteredSaved.length === 0 && (
              <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>
                {saved.length === 0 ? 'No users saved yet.' : 'No users match your search.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}