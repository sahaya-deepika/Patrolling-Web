
import { useState, useEffect, useRef } from 'react'
import { Radio } from 'rsuite'
import { getSchedules, createSchedule, deleteSchedule, updateSchedule, getZones, getUsers, getTrips, getTripTypes } from '../../../api'
import { ConfirmSaveModal } from '../components/MasterFormUI'

/* ── Custom 3-dot menu with Select / Clone / Edit / Delete ── */
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
    { label: 'Clone',  icon: '⧉', color: '#202124', action: onClone },
    { label: 'Edit',   icon: '✎', color: '#202124', action: onEdit },
    { label: 'Delete', icon: '🗑', color: '#d93025', action: onDelete },
  ]

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '18px', color: '#5f6368', lineHeight: 1, borderRadius: '4px' }}
      >⋮</button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0,
          background: '#fff', border: '1px solid #e0e0e0',
          borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          zIndex: 9999, minWidth: '130px', overflow: 'hidden',
        }}>
          {items.map(({ label, icon, color, action }) => (
            <div
              key={label}
              onMouseDown={() => { action(); setOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              <span style={{ fontSize: '14px' }}>{icon}</span> {label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const blank = {
  zone: '', employee: '', tripType: '', trip: '',
  startDate: '', startTime: '', endDate: '', endTime: '',
  ordered: true, roundType: 'round',
  minRound: '', maxRound: '', restartTime: '', expiredDate: '',
}

/* ── Custom dropdown: opens downward, same width as field, no overflow ── */
function FieldDropdown({ label, value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {label && (
        <label style={{ fontSize: '11px', fontWeight: 500, color: '#5f6368' }}>{label}</label>
      )}
      <div ref={ref} style={{ position: 'relative' }}>
        <div style={{ display: 'flex' }}>
          <input
            type="text"
            placeholder={placeholder || label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              flex: 1, minWidth: 0,
              padding: '8px 12px',
              border: '1px solid #dadce0',
              borderRight: 'none',
              borderRadius: '4px 0 0 4px',
              fontSize: '13px', color: '#202124',
              outline: 'none', height: '38px', boxSizing: 'border-box',
            }}
          />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            style={{
              width: '38px', height: '38px', flexShrink: 0,
              background: '#1a73e8', border: '1px solid #1a73e8',
              borderRadius: '0 4px 4px 0',
              color: '#fff', fontSize: '22px', fontWeight: 'bold',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', lineHeight: 1,
            }}
          >+</button>
        </div>

        {/* Dropdown list — right: 0 keeps it inside the field width */}
        {open && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 2px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #dadce0',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            zIndex: 9999,
            maxHeight: '180px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}>
            {options.length === 0 ? (
              <div style={{ padding: '8px 12px', fontSize: '13px', color: '#9aa0a6' }}>No options</div>
            ) : options.map((opt) => (
              <div
                key={opt}
                onMouseDown={() => { onChange(opt); setOpen(false) }}
                style={{
                  padding: '8px 12px', fontSize: '13px', color: '#202124',
                  cursor: 'pointer', borderBottom: '1px solid #f5f5f5',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >{opt}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ScheduleForm() {
  const [form, setForm] = useState(blank)
  const [saved, setSaved] = useState([])
  const [busy, setBusy] = useState(false)
  const [sel, setSel] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const [showSaved, setShowSaved] = useState(true)
  const [selectMode, setSelectMode] = useState(false)   // only true after "Select" from menu
  const [selectedIds, setSelectedIds] = useState([])

  const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
  const toggleSelect = (id) => setSelectedIds((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  )
  const cancelSelect = () => { setSelectMode(false); setSelectedIds([]) }
  const deleteSelected = async () => {
    for (const id of selectedIds) { try { await deleteSchedule(id) } catch {} }
    setSaved((p) => p.filter((s) => !selectedIds.includes(s.id)))
    setSelectMode(false); setSelectedIds([])
  }
  const [zones, setZones] = useState([])
  const [employees, setEmployees] = useState([])
  const [tripTypes, setTripTypes] = useState([])
  const [trips, setTrips] = useState([])

  useEffect(() => {
    getSchedules().then(setSaved).catch(() => {})

    // Zone options — from Zones master (Others › Zone)
    getZones().then((zones) => {
      const z = zones.map((z) => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
      setZones(z)
    }).catch(() => {})

    // Employee options — from users created in UserForm
    getUsers().then((users) => {
      const u = [...new Set(users.map((u) => u.userName).filter(Boolean))].sort()
      if (u.length > 0) setEmployees(u)
    }).catch(() => {})

    // Trip Type options — from Trip Types master (Others › Trip Types)
    getTripTypes().then((types) => {
      const t = types.map((t) => t.typeName).filter(Boolean).sort()
      if (t.length > 0) setTripTypes(t)
    }).catch(() => {})

    // Trip options — from trips created in TripForm
    getTrips().then((tripsList) => {
      const names = [...new Set(tripsList.map((t) => t.tripName).filter(Boolean))].sort()
      if (names.length > 0) setTrips(names)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleZonesUpdated = () => {
      getZones().then((zones) => {
        const z = zones.map((z) => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
        setZones(z)
      }).catch(() => {})
    }
    window.addEventListener('zones-updated', handleZonesUpdated)
    return () => window.removeEventListener('zones-updated', handleZonesUpdated)
  }, [])

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))
  const handleClone = (item) => { setForm({ ...blank, ...item }); setSel(null) }
  const handleEdit  = (item) => { setForm({ ...blank, ...item }); setSel(item.id) }
  const handleSaveClick = () => setConfirm(true)

  const handleConfirmed = async () => {
    setBusy(true)
    const payload = { ...form }
    try {
      if (sel) {
        const updated = typeof updateSchedule === 'function'
          ? await updateSchedule(sel, payload) : { ...payload, id: sel }
        setSaved((p) => p.map((s) => (s.id === sel ? { ...s, ...updated } : s)))
        setSel(null); setForm(blank)
      } else {
        const c = await createSchedule(payload)
        setSaved((p) => [c, ...p]); setForm(blank)
      }
    } catch {
      if (sel) { setSaved((p) => p.map((s) => (s.id === sel ? { ...s, ...form } : s))); setSel(null); setForm(blank) }
    }
    setBusy(false); setConfirm(false)
  }

  const handleDelete = async (id) => {
    try { await deleteSchedule(id) } catch {}
    setSaved((p) => p.filter((s) => s.id !== id))
    if (sel === id) { setForm(blank); setSel(null) }
  }

  const summary = [
    { label: 'Zone', value: form.zone },
    { label: 'Employee', value: form.employee },
    { label: 'Trip Type', value: form.tripType },
    { label: 'Trip', value: form.trip },
    { label: 'Start', value: `${form.startDate} ${form.startTime}` },
    { label: 'End', value: `${form.endDate} ${form.endTime}` },
    { label: 'Status', value: form.ordered ? 'ORDER' : 'UNORDER' },
  ]

  const fallbackNames  = ['Karthick','Arjun','Priya','Ravi','Meena','Suresh','Divya','Vikram']
  const fallbackColors = ['#1a73e8','#e8371a','#1e8e3e','#8e1ae8','#e8a81a','#1ae8d4','#e81a8e','#4a90d9']

  return (
    <div style={{
      display: 'flex', width: '100%', height: '100%',
      background: '#ffffff', borderRadius: '8px',
      overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)',
      alignItems: 'stretch',
    }}>
      <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

      {/* ═══ LEFT PANEL ═══ */}
      <div style={{
        flex: '0 0 55%', width: '55%', maxWidth: '55%',
        display: 'flex', flexDirection: 'column',
        borderRight: '2px solid #e8eaed',
        padding: '20px', overflowY: 'auto', overflowX: 'hidden',
        boxSizing: 'border-box', alignSelf: 'stretch',
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, lineHeight: '28px' }}>
          Create Schedule
        </h2>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>

          {/* Zone & Employee */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <FieldDropdown label="Zone"     value={form.zone}     onChange={(v) => set('zone', v)}     options={zones} />
            <FieldDropdown label="Employee" value={form.employee} onChange={(v) => set('employee', v)} options={employees} />
          </div>

          {/* Trip type & Trip */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <FieldDropdown label="Trip type" value={form.tripType} onChange={(v) => set('tripType', v)} options={tripTypes} />
            <FieldDropdown label="Trip"      value={form.trip}     onChange={(v) => set('trip', v)}     options={trips} />
          </div>

          {/* Dates & Times */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)}
              style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', color: '#202124', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
            <input type="time" value={form.startTime} onChange={(e) => set('startTime', e.target.value)}
              style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', color: '#202124', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
            <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
            <input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)}
              style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', color: '#202124', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
            <input type="time" value={form.endTime} onChange={(e) => set('endTime', e.target.value)}
              style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', color: '#202124', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
            <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
          </div>

          {/* Order / Unorder */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => set('ordered', true)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '4px', background: form.ordered ? '#1a73e8' : '#f8f9fa', color: form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Order</button>
            <button onClick={() => set('ordered', false)} style={{ flex: 1, padding: '10px', border: '1px solid #dadce0', borderRadius: '4px', background: !form.ordered ? '#1a73e8' : 'transparent', color: !form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Unorder</button>
          </div>

          {/* Round */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #e8eaed', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', flexShrink: 0 }}>
              <Radio checked={form.roundType === 'round'} onChange={() => set('roundType', 'round')} /><span>Round</span>
            </label>
            <input type="text" placeholder="Minimum Round" value={form.minRound} onChange={(e) => set('minRound', e.target.value)}
              style={{ flex: 1, minWidth: '120px', padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '12px', color: '#202124', outline: 'none' }} />
            <input type="text" placeholder="Maximum Round" value={form.maxRound} onChange={(e) => set('maxRound', e.target.value)}
              style={{ flex: 1, minWidth: '120px', padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '12px', color: '#202124', outline: 'none' }} />
          </div>

          {/* Cyclic */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', flexShrink: 0 }}>
              <Radio checked={form.roundType === 'cyclic'} onChange={() => set('roundType', 'cyclic')} /><span>Cyclic</span>
            </label>
            <input type="time" placeholder="Restart time" value={form.restartTime} onChange={(e) => set('restartTime', e.target.value)}
              style={{ flex: 1, minWidth: '120px', padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '12px', color: '#202124', outline: 'none' }} />
            <input type="date" placeholder="Expired date" value={form.expiredDate} onChange={(e) => set('expiredDate', e.target.value)}
              style={{ flex: 1, minWidth: '120px', padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '12px', color: '#202124', outline: 'none' }} />
          </div>
        </div>

        {/* Save */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
          <button onClick={handleSaveClick} style={{ padding: '10px 32px', border: 'none', borderRadius: '4px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Save</button>
        </div>
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
          {selectMode ? (
            <>
              {/* Select-all checkbox */}
              <div
                onClick={() => {
                  if (selectedIds.length === saved.length) setSelectedIds([])
                  else setSelectedIds(saved.map((s) => s.id))
                }}
                style={{
                  width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                  border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc',
                  background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {selectedIds.length === saved.length
                  ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
                  : selectedIds.length > 0
                    ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700, lineHeight: 1 }}>−</span>
                    : null}
              </div>

              <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
                {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Schedule'}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                <button
                  onClick={deleteSelected}
                  disabled={selectedIds.length === 0}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: selectedIds.length > 0 ? '#fce8e6' : '#f5f5f5', border: 'none', color: selectedIds.length > 0 ? '#d93025' : '#bbb', fontSize: '12px', fontWeight: 600, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', padding: '5px 10px', borderRadius: '4px' }}
                >
                  🗑 Delete
                </button>
                <button
                  onClick={cancelSelect}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#5f6368', fontSize: '12px', fontWeight: 500, cursor: 'pointer', padding: '5px 8px', borderRadius: '4px' }}
                >
                  ✕ Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {showSaved && <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0, lineHeight: '28px' }}>Saved Schedule</h2>}
              <button onClick={() => setShowSaved(!showSaved)} style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
                {showSaved ? '⊏' : '⊐'}
              </button>
            </>
          )}
        </div>

        {showSaved && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>
            {saved.map((s, idx) => {
              const displayName = s.employee || fallbackNames[idx % fallbackNames.length]
              const avatarColor = fallbackColors[idx % fallbackColors.length]
              const isChecked = selectedIds.includes(s.id)
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>

                  {/* Checkbox — only visible in selectMode */}
                  {selectMode && (
                    <div
                      onClick={() => toggleSelect(s.id)}
                      style={{
                        width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '12px',
                        border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc',
                        background: isChecked ? '#1a73e8' : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700, lineHeight: 1 }}>✓</span>}
                    </div>
                  )}

                  {/* Card */}
                  <div style={{ flex: 1, minWidth: 0, border: `1px solid ${selectMode && isChecked ? '#1a73e8' : '#e0e0e0'}`, borderRadius: '8px', padding: '10px 12px', background: selectMode && isChecked ? '#f0f4ff' : '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#202124', whiteSpace: 'nowrap' }}>
                          {s.startTime && s.endTime ? `${s.startTime} to ${s.endTime}` : '10:00am to 4:00pm'}
                        </span>
                        <span style={{ background: s.ordered !== false ? '#1e8e3e' : '#e65100', color: '#fff', padding: '2px 7px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                          {s.ordered !== false ? 'ORDER' : 'UNORDER'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        <span style={{ fontSize: '10px', color: '#5f6368', whiteSpace: 'nowrap' }}>Start at {s.startDate || '5.2.2025'}</span>
                        <CardMenu onSelect={() => enterSelectMode(s.id)} onClone={() => handleClone(s)} onEdit={() => handleEdit(s)} onDelete={() => handleDelete(s.id)} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#202124' }}>{displayName}</span>
                    </div>

                    <div style={{ fontSize: '10px', color: '#5f6368', marginBottom: '5px' }}>Trip type</div>

                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {[s.trip || 'Trip name', `Rounds: ${s.maxRound || '11'}`, `Exp: ${s.expiredDate || '12.2.2025'}`].map((tag) => (
                        <span key={tag} style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '2px 8px', fontSize: '10px', color: '#333' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
            {saved.length === 0 && (
              <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No schedules saved yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}