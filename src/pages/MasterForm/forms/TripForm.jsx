// // import { useState, useEffect, useRef } from 'react'
// // import { getTrips, createTrip, deleteTrip, updateTrip, getLocations, getTasks } from '../../../api'
// // import { ConfirmSaveModal } from '../components/MasterFormUI'

// // const blank = {
// //   tripType: '', tripName: '', zone: '',
// //   patrols: [
// //     { location: '', task: '' },
// //     { location: '', task: '' },
// //   ],
// // }

// // const fallbackNames  = ['Karthick', 'Arjun', 'Priya', 'Ravi', 'Meena', 'Suresh', 'Divya', 'Vikram']
// // const fallbackColors = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#1ae8d4', '#e81a8e', '#4a90d9']

// // /* ── Custom dropdown ── */
// // function FieldDropdown({ value, onChange, options, placeholder }) {
// //   const [open, setOpen] = useState(false)
// //   const ref = useRef(null)
// //   useEffect(() => {
// //     const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
// //     document.addEventListener('mousedown', h)
// //     return () => document.removeEventListener('mousedown', h)
// //   }, [])
// //   return (
// //     <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
// //       <div style={{ display: 'flex' }}>
// //         <input
// //           type="text" placeholder={placeholder} value={value}
// //           onChange={(e) => onChange(e.target.value)}
// //           style={{ flex: 1, minWidth: 0, padding: '10px 14px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }}
// //         />
// //         <button type="button" onClick={() => setOpen((o) => !o)}
// //           style={{ width: '38px', height: '42px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 8px 8px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
// //         >+</button>
// //       </div>
// //       {open && (
// //         <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto', overflowX: 'hidden' }}>
// //           {options.length === 0
// //             ? <div style={{ padding: '10px 14px', fontSize: '13px', color: '#9aa0a6' }}>No options</div>
// //             : options.map((opt) => (
// //               <div key={opt} onMouseDown={() => { onChange(opt); setOpen(false) }}
// //                 style={{ padding: '10px 14px', fontSize: '13px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' }}
// //                 onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
// //                 onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
// //               >{opt}</div>
// //             ))}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // /* ── 3-dot card menu ── */
// // function CardMenu({ onSelect, onClone, onEdit, onDelete }) {
// //   const [open, setOpen] = useState(false)
// //   const ref = useRef(null)
// //   useEffect(() => {
// //     const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
// //     document.addEventListener('mousedown', h)
// //     return () => document.removeEventListener('mousedown', h)
// //   }, [])
// //   const items = [
// //     { label: 'Select', icon: '☑', color: '#202124', action: onSelect },
// //     { label: 'Clone',  icon: '⧉', color: '#202124', action: onClone },
// //     { label: 'Edit',   icon: '✎', color: '#202124', action: onEdit },
// //     { label: 'Delete', icon: '🗑', color: '#d93025', action: onDelete },
// //   ]
// //   return (
// //     <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
// //       <button onClick={() => setOpen((o) => !o)}
// //         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '18px', color: '#5f6368', lineHeight: 1, borderRadius: '4px' }}
// //       >⋮</button>
// //       {open && (
// //         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
// //           {items.map(({ label, icon, color, action }) => (
// //             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
// //               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
// //               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
// //               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
// //             ><span style={{ fontSize: '14px' }}>{icon}</span>{label}</div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // export default function TripForm() {
// //   const [form, setForm]           = useState(blank)
// //   const [saved, setSaved]         = useState([])
// //   const [busy, setBusy]           = useState(false)
// //   const [sel, setSel]             = useState(null)
// //   const [confirm, setConfirm]     = useState(false)
// //   const [showSaved, setShowSaved] = useState(true)
// //   const [selectMode, setSelectMode] = useState(false)
// //   const [selectedIds, setSelectedIds] = useState([])

// //   const [zoneOpts, setZoneOpts] = useState(['Zone A', 'Zone B', 'Zone C'])
// //   const [locOpts,  setLocOpts]  = useState(['Location A', 'Building 1', 'Main Campus'])
// //   const [taskOpts, setTaskOpts] = useState(['Patrol', 'Inspection', 'Maintenance'])

// //   useEffect(() => {
// //     getTrips().then(setSaved).catch(() => {})
// //     getLocations().then((locs) => {
// //       const z = [...new Set(locs.map((l) => l.zone).filter(Boolean))].sort()
// //       const l = [...new Set(locs.map((l) => l.location).filter(Boolean))].sort()
// //       if (z.length) setZoneOpts(z)
// //       if (l.length) setLocOpts(l)
// //     }).catch(() => {})
// //     getTasks?.().then((tasks) => {
// //       const t = [...new Set(tasks.map((t) => t.employeeRoll).filter(Boolean))].sort()
// //       if (t.length) setTaskOpts(t)
// //     }).catch(() => {})
// //   }, [])

// //   const set       = (k, v) => setForm((p) => ({ ...p, [k]: v }))
// //   const setPatrol = (i, field, val) => {
// //     const updated = form.patrols.map((p, idx) => idx === i ? { ...p, [field]: val } : p)
// //     set('patrols', updated)
// //   }
// //   const addPatrol = () => set('patrols', [...form.patrols, { location: '', task: '' }])
// //   const removePatrol = (i) => set('patrols', form.patrols.filter((_, idx) => idx !== i))

// //   const handleEdit  = (item) => { setForm({ ...blank, ...item, patrols: item.patrols?.length ? item.patrols : blank.patrols }); setSel(item.id) }
// //   const handleClone = (item) => { const { id, ...rest } = item; setForm({ ...blank, ...rest, patrols: rest.patrols?.length ? rest.patrols : blank.patrols }); setSel(null) }
// //   const handleCancelEdit = () => { setForm(blank); setSel(null) }
// //   const handleSaveClick  = () => { if (!form.tripType && !form.tripName) return; setConfirm(true) }

// //   const handleConfirmed = async () => {
// //     setBusy(true)
// //     const payload = { tripType: form.tripType, tripName: form.tripName, zone: form.zone, patrols: form.patrols }
// //     try {
// //       if (sel) {
// //         const updated = await updateTrip(sel, payload)
// //         setSaved((p) => p.map((t) => (t.id === sel ? { ...t, ...updated } : t)))
// //         setSel(null); setForm(blank)
// //       } else {
// //         const created = await createTrip(payload)
// //         setSaved((p) => [created, ...p]); setForm(blank)
// //       }
// //     } catch {
// //       if (sel) { setSaved((p) => p.map((t) => (t.id === sel ? { ...t, ...payload } : t))); setSel(null); setForm(blank) }
// //     }
// //     setBusy(false); setConfirm(false)
// //   }

// //   const handleDelete = async (id) => {
// //     try { await deleteTrip(id) } catch {}
// //     setSaved((p) => p.filter((t) => t.id !== id))
// //     if (sel === id) { setForm(blank); setSel(null) }
// //   }

// //   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
// //   const toggleSelect    = (id) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
// //   const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
// //   const deleteSelected  = async () => {
// //     for (const id of selectedIds) { try { await deleteTrip(id) } catch {} }
// //     setSaved((p) => p.filter((t) => !selectedIds.includes(t.id)))
// //     if (selectedIds.includes(sel)) { setForm(blank); setSel(null) }
// //     setSelectMode(false); setSelectedIds([])
// //   }

// //   const summary = [
// //     { label: 'Trip Type', value: form.tripType },
// //     { label: 'Trip Name', value: form.tripName },
// //     { label: 'Zone',      value: form.zone },
// //     ...form.patrols.map((p, i) => ({ label: `Stop ${i + 1}`, value: `${p.location} / ${p.task}` })),
// //   ]

// //   const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }

// //   return (
// //     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
// //       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

// //       {/* ═══ LEFT: FORM ═══ */}
// //       <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
// //         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, lineHeight: '28px' }}>
// //           {sel ? 'Edit Trip' : 'Create Trip'}
// //         </h2>

// //         <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

// //           {/* Trip type | Trip name */}
// //           <div style={{ display: 'flex', gap: '14px' }}>
// //             <input placeholder="Trip type" value={form.tripType} onChange={(e) => set('tripType', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
// //             <input placeholder="Trip name" value={form.tripName} onChange={(e) => set('tripName', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
// //           </div>

// //           {/* Zone */}
// //           <FieldDropdown placeholder="Zone" value={form.zone} onChange={(v) => set('zone', v)} options={zoneOpts} />

// //           {/* Location + Task stops */}
// //           <div style={{ border: '1px solid #dadce0', borderRadius: '10px', padding: '16px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '12px' }}>
// //             {form.patrols.map((patrol, i) => (
// //               <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
// //                 <FieldDropdown
// //                   placeholder="Location"
// //                   value={patrol.location}
// //                   onChange={(v) => setPatrol(i, 'location', v)}
// //                   options={locOpts}
// //                 />
// //                 <FieldDropdown
// //                   placeholder="Task"
// //                   value={patrol.task}
// //                   onChange={(v) => setPatrol(i, 'task', v)}
// //                   options={taskOpts}
// //                 />
// //                 {form.patrols.length > 1 && (
// //                   <button onClick={() => removePatrol(i)}
// //                     style={{ background: 'none', border: 'none', color: '#d93025', fontSize: '18px', cursor: 'pointer', flexShrink: 0, padding: '0 4px', lineHeight: 1 }}
// //                   >×</button>
// //                 )}
// //               </div>
// //             ))}

// //             {/* Add row button */}
// //             <button onClick={addPatrol}
// //               style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#1a73e8', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '4px 0', alignSelf: 'flex-start' }}
// //             >
// //               <span style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: 1 }}>+</span> Add
// //             </button>
// //           </div>

// //         </div>

// //         {/* Save / Cancel */}
// //         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '24px', marginTop: 'auto' }}>
// //           {sel && (
// //             <button onClick={handleCancelEdit} style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '6px', background: '#fff', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// //               Cancel
// //             </button>
// //           )}
// //           <button onClick={handleSaveClick} style={{ padding: '10px 32px', border: 'none', borderRadius: '6px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// //             {sel ? 'Update' : 'Save'}
// //           </button>
// //         </div>
// //       </div>

// //       {/* ═══ RIGHT: SAVED TRIPS ═══ */}
// //       <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

// //         {/* Header */}
// //         <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
// //           {selectMode ? (
// //             <>
// //               <div
// //                 onClick={() => setSelectedIds(selectedIds.length === saved.length ? [] : saved.map((t) => t.id))}
// //                 style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
// //               >
// //                 {selectedIds.length === saved.length
// //                   ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
// //                   : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
// //               </div>
// //               <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
// //                 {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Trip'}
// //               </h2>
// //               <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
// //                 <button onClick={deleteSelected} disabled={selectedIds.length === 0}
// //                   style={{ display: 'flex', alignItems: 'center', gap: '4px', background: selectedIds.length > 0 ? '#fce8e6' : '#f5f5f5', border: 'none', color: selectedIds.length > 0 ? '#d93025' : '#bbb', fontSize: '12px', fontWeight: 600, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', padding: '5px 10px', borderRadius: '4px' }}>
// //                   🗑 Delete
// //                 </button>
// //                 <button onClick={cancelSelect}
// //                   style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: '12px', fontWeight: 500, cursor: 'pointer', padding: '5px 8px', borderRadius: '4px' }}>
// //                   ✕ Cancel
// //                 </button>
// //               </div>
// //             </>
// //           ) : (
// //             <>
// //               {showSaved && <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0, lineHeight: '28px' }}>Saved Trip</h2>}
// //               <button onClick={() => setShowSaved(!showSaved)}
// //                 style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
// //                 {showSaved ? '⊏' : '⊐'}
// //               </button>
// //             </>
// //           )}
// //         </div>

// //         {/* Saved list */}
// //         {showSaved && (
// //           <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>
// //             {saved.map((t, idx) => {
// //               const displayName = t.tripName || fallbackNames[idx % fallbackNames.length]
// //               const avatarColor = fallbackColors[idx % fallbackColors.length]
// //               const isChecked   = selectedIds.includes(t.id)
// //               return (
// //                 <div key={t.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>

// //                   {/* Checkbox — only in selectMode */}
// //                   {selectMode && (
// //                     <div onClick={() => toggleSelect(t.id)}
// //                       style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
// //                       {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
// //                     </div>
// //                   )}

// //                   {/* Card */}
// //                   <div style={{ flex: 1, minWidth: 0, border: `1px solid ${selectMode && isChecked ? '#1a73e8' : '#e0e0e0'}`, borderRadius: '10px', padding: '10px 12px', background: selectMode && isChecked ? '#f0f4ff' : '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>

// //                     {/* Top: avatar + name + menu */}
// //                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
// //                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
// //                         <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
// //                           👤
// //                         </div>
// //                         <span style={{ fontSize: '13px', fontWeight: 600, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //                           {displayName}
// //                         </span>
// //                       </div>
// //                       <CardMenu
// //                         onSelect={() => enterSelectMode(t.id)}
// //                         onClone={() => handleClone(t)}
// //                         onEdit={() => handleEdit(t)}
// //                         onDelete={() => handleDelete(t.id)}
// //                       />
// //                     </div>

// //                     {/* Pill tags */}
// //                     <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
// //                       {[
// //                         t.tripType || 'Trip type',
// //                         t.tripName || 'Trip name',
// //                         t.zone     || 'Zone',
// //                         t.patrols?.[0]?.location || 'Location 2',
// //                       ].map((tag) => (
// //                         <span key={tag} style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#333' }}>{tag}</span>
// //                       ))}
// //                     </div>

// //                   </div>
// //                 </div>
// //               )
// //             })}

// //             {saved.length === 0 && (
// //               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No trips saved yet.</div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// import { useState, useEffect, useRef } from 'react'
// import { getTrips, createTrip, deleteTrip, updateTrip, getZones, getLocations, getTasks, getTripTypes } from '../../../api'
// import { ConfirmSaveModal } from '../components/MasterFormUI'

// const blank = {
//   tripType: '', tripName: '', zone: '',
//   patrols: [
//     { location: '', task: '' },
//     { location: '', task: '' },
//   ],
// }

// const fallbackNames  = ['Karthick', 'Arjun', 'Priya', 'Ravi', 'Meena', 'Suresh', 'Divya', 'Vikram']
// const fallbackColors = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#1ae8d4', '#e81a8e', '#4a90d9']

// /* ── Custom dropdown ── */
// function FieldDropdown({ value, onChange, options, placeholder }) {
//   const [open, setOpen] = useState(false)
//   const ref = useRef(null)
//   useEffect(() => {
//     const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
//     document.addEventListener('mousedown', h)
//     return () => document.removeEventListener('mousedown', h)
//   }, [])
//   return (
//     <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
//       <div style={{ display: 'flex' }}>
//         <input
//           type="text" placeholder={placeholder} value={value}
//           onChange={(e) => onChange(e.target.value)}
//           style={{ flex: 1, minWidth: 0, padding: '10px 14px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }}
//         />
//         <button type="button" onClick={() => setOpen((o) => !o)}
//           style={{ width: '38px', height: '42px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 8px 8px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//         >+</button>
//       </div>
//       {open && (
//         <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto', overflowX: 'hidden' }}>
//           {options.length === 0
//             ? <div style={{ padding: '10px 14px', fontSize: '13px', color: '#9aa0a6' }}>No options</div>
//             : options.map((opt) => (
//               <div key={opt} onMouseDown={() => { onChange(opt); setOpen(false) }}
//                 style={{ padding: '10px 14px', fontSize: '13px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' }}
//                 onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
//                 onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
//               >{opt}</div>
//             ))}
//         </div>
//       )}
//     </div>
//   )
// }

// /* ── 3-dot card menu ── */
// function CardMenu({ onSelect, onClone, onEdit, onDelete }) {
//   const [open, setOpen] = useState(false)
//   const ref = useRef(null)
//   useEffect(() => {
//     const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
//     document.addEventListener('mousedown', h)
//     return () => document.removeEventListener('mousedown', h)
//   }, [])
//   const items = [
//     { label: 'Select', icon: '☑', color: '#202124', action: onSelect },
//     { label: 'Clone',  icon: '⧉', color: '#202124', action: onClone },
//     { label: 'Edit',   icon: '✎', color: '#202124', action: onEdit },
//     { label: 'Delete', icon: '🗑', color: '#d93025', action: onDelete },
//   ]
//   return (
//     <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
//       <button onClick={() => setOpen((o) => !o)}
//         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '18px', color: '#5f6368', lineHeight: 1, borderRadius: '4px' }}
//       >⋮</button>
//       {open && (
//         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
//           {items.map(({ label, icon, color, action }) => (
//             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
//               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
//               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
//               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
//             ><span style={{ fontSize: '14px' }}>{icon}</span>{label}</div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default function TripForm() {
//   const [form, setForm]           = useState(blank)
//   const [saved, setSaved]         = useState([])
//   const [busy, setBusy]           = useState(false)
//   const [sel, setSel]             = useState(null)
//   const [confirm, setConfirm]     = useState(false)
//   const [showSaved, setShowSaved] = useState(true)
//   const [selectMode, setSelectMode] = useState(false)
//   const [selectedIds, setSelectedIds] = useState([])

//   const [zoneOpts, setZoneOpts]         = useState(['Zone A', 'Zone B', 'Zone C'])
//   const [tripTypeOpts, setTripTypeOpts] = useState([])
//   const [locOpts,  setLocOpts]          = useState(['Location A', 'Building 1', 'Main Campus'])
//   const [taskOpts, setTaskOpts]         = useState(['Patrol', 'Inspection', 'Maintenance'])

//   useEffect(() => {
//     getTrips().then(setSaved).catch(() => {})

//     // Zone options — from Zones master (Others › Zone)
//     getZones().then((zones) => {
//       const z = zones.map((z) => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
//       if (z.length) setZoneOpts(z)
//     }).catch(() => {})

//     // Trip Type options — from Patrol Types master (Others › Patrol Type)
//     getTripTypes().then((types) => {
//       const t = types.map((t) => t.patrolName || t.typeName).filter(Boolean).sort()
//       if (t.length) setTripTypeOpts(t)
//     }).catch(() => {})

//     // Location options — still from locations master
//     getLocations().then((locs) => {
//       const l = [...new Set(locs.map((l) => l.location).filter(Boolean))].sort()
//       if (l.length) setLocOpts(l)
//     }).catch(() => {})

//     getTasks?.().then((tasks) => {
//       const t = [...new Set(tasks.map((t) => t.employeeRoll).filter(Boolean))].sort()
//       if (t.length) setTaskOpts(t)
//     }).catch(() => {})
//   }, [])

//   const set       = (k, v) => setForm((p) => ({ ...p, [k]: v }))
//   const setPatrol = (i, field, val) => {
//     const updated = form.patrols.map((p, idx) => idx === i ? { ...p, [field]: val } : p)
//     set('patrols', updated)
//   }
//   const addPatrol = () => set('patrols', [...form.patrols, { location: '', task: '' }])
//   const removePatrol = (i) => set('patrols', form.patrols.filter((_, idx) => idx !== i))

//   const handleEdit  = (item) => { setForm({ ...blank, ...item, patrols: item.patrols?.length ? item.patrols : blank.patrols }); setSel(item.id) }
//   const handleClone = (item) => { const { id, ...rest } = item; setForm({ ...blank, ...rest, patrols: rest.patrols?.length ? rest.patrols : blank.patrols }); setSel(null) }
//   const handleCancelEdit = () => { setForm(blank); setSel(null) }
//   const handleSaveClick  = () => { if (!form.tripType && !form.tripName) return; setConfirm(true) }

//   const handleConfirmed = async () => {
//     setBusy(true)
//     const payload = { tripType: form.tripType, tripName: form.tripName, zone: form.zone, patrols: form.patrols }
//     try {
//       if (sel) {
//         const updated = await updateTrip(sel, payload)
//         setSaved((p) => p.map((t) => (t.id === sel ? { ...t, ...updated } : t)))
//         setSel(null); setForm(blank)
//       } else {
//         const created = await createTrip(payload)
//         setSaved((p) => [created, ...p]); setForm(blank)
//       }
//     } catch {
//       if (sel) { setSaved((p) => p.map((t) => (t.id === sel ? { ...t, ...payload } : t))); setSel(null); setForm(blank) }
//     }
//     setBusy(false); setConfirm(false)
//   }

//   const handleDelete = async (id) => {
//     try { await deleteTrip(id) } catch {}
//     setSaved((p) => p.filter((t) => t.id !== id))
//     if (sel === id) { setForm(blank); setSel(null) }
//   }

//   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
//   const toggleSelect    = (id) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
//   const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
//   const deleteSelected  = async () => {
//     for (const id of selectedIds) { try { await deleteTrip(id) } catch {} }
//     setSaved((p) => p.filter((t) => !selectedIds.includes(t.id)))
//     if (selectedIds.includes(sel)) { setForm(blank); setSel(null) }
//     setSelectMode(false); setSelectedIds([])
//   }

//   const summary = [
//     { label: 'Trip Type', value: form.tripType },
//     { label: 'Trip Name', value: form.tripName },
//     { label: 'Zone',      value: form.zone },
//     ...form.patrols.map((p, i) => ({ label: `Stop ${i + 1}`, value: `${p.location} / ${p.task}` })),
//   ]

//   const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }

//   return (
//     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
//       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

//       {/* ═══ LEFT: FORM ═══ */}
//       <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
//         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, lineHeight: '28px' }}>
//           {sel ? 'Edit Trip' : 'Create Trip'}
//         </h2>

//         <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

//           {/* Trip type | Trip name */}
//           <div style={{ display: 'flex', gap: '14px' }}>
//             <FieldDropdown placeholder="Trip type" value={form.tripType} onChange={(v) => set('tripType', v)} options={tripTypeOpts} />
//             <input placeholder="Trip name" value={form.tripName} onChange={(e) => set('tripName', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
//           </div>

//           {/* Zone */}
//           <FieldDropdown placeholder="Zone" value={form.zone} onChange={(v) => set('zone', v)} options={zoneOpts} />

//           {/* Location + Task stops */}
//           <div style={{ border: '1px solid #dadce0', borderRadius: '10px', padding: '16px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '12px' }}>
//             {form.patrols.map((patrol, i) => (
//               <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
//                 <FieldDropdown
//                   placeholder="Location"
//                   value={patrol.location}
//                   onChange={(v) => setPatrol(i, 'location', v)}
//                   options={locOpts}
//                 />
//                 <FieldDropdown
//                   placeholder="Task"
//                   value={patrol.task}
//                   onChange={(v) => setPatrol(i, 'task', v)}
//                   options={taskOpts}
//                 />
//                 {form.patrols.length > 1 && (
//                   <button onClick={() => removePatrol(i)}
//                     style={{ background: 'none', border: 'none', color: '#d93025', fontSize: '18px', cursor: 'pointer', flexShrink: 0, padding: '0 4px', lineHeight: 1 }}
//                   >×</button>
//                 )}
//               </div>
//             ))}

//             {/* Add row button */}
//             <button onClick={addPatrol}
//               style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#1a73e8', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '4px 0', alignSelf: 'flex-start' }}
//             >
//               <span style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: 1 }}>+</span> Add
//             </button>
//           </div>

//         </div>

//         {/* Save / Cancel */}
//         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '24px', marginTop: 'auto' }}>
//           {sel && (
//             <button onClick={handleCancelEdit} style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '6px', background: '#fff', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
//               Cancel
//             </button>
//           )}
//           <button onClick={handleSaveClick} style={{ padding: '10px 32px', border: 'none', borderRadius: '6px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
//             {sel ? 'Update' : 'Save'}
//           </button>
//         </div>
//       </div>

//       {/* ═══ RIGHT: SAVED TRIPS ═══ */}
//       <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

//         {/* Header */}
//         <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
//           {selectMode ? (
//             <>
//               <div
//                 onClick={() => setSelectedIds(selectedIds.length === saved.length ? [] : saved.map((t) => t.id))}
//                 style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
//               >
//                 {selectedIds.length === saved.length
//                   ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
//                   : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
//               </div>
//               <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
//                 {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Trip'}
//               </h2>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
//                 <button onClick={deleteSelected} disabled={selectedIds.length === 0}
//                   style={{ display: 'flex', alignItems: 'center', gap: '4px', background: selectedIds.length > 0 ? '#fce8e6' : '#f5f5f5', border: 'none', color: selectedIds.length > 0 ? '#d93025' : '#bbb', fontSize: '12px', fontWeight: 600, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', padding: '5px 10px', borderRadius: '4px' }}>
//                   🗑 Delete
//                 </button>
//                 <button onClick={cancelSelect}
//                   style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: '12px', fontWeight: 500, cursor: 'pointer', padding: '5px 8px', borderRadius: '4px' }}>
//                   ✕ Cancel
//                 </button>
//               </div>
//             </>
//           ) : (
//             <>
//               {showSaved && <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0, lineHeight: '28px' }}>Saved Trip</h2>}
//               <button onClick={() => setShowSaved(!showSaved)}
//                 style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
//                 {showSaved ? '⊏' : '⊐'}
//               </button>
//             </>
//           )}
//         </div>

//         {/* Saved list */}
//         {showSaved && (
//           <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>
//             {saved.map((t, idx) => {
//               const displayName = t.tripName || fallbackNames[idx % fallbackNames.length]
//               const avatarColor = fallbackColors[idx % fallbackColors.length]
//               const isChecked   = selectedIds.includes(t.id)
//               return (
//                 <div key={t.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>

//                   {/* Checkbox — only in selectMode */}
//                   {selectMode && (
//                     <div onClick={() => toggleSelect(t.id)}
//                       style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
//                       {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
//                     </div>
//                   )}

//                   {/* Card */}
//                   <div style={{ flex: 1, minWidth: 0, border: `1px solid ${selectMode && isChecked ? '#1a73e8' : '#e0e0e0'}`, borderRadius: '10px', padding: '10px 12px', background: selectMode && isChecked ? '#f0f4ff' : '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>

//                     {/* Top: avatar + name + menu */}
//                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
//                         <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
//                           👤
//                         </div>
//                         <span style={{ fontSize: '13px', fontWeight: 600, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                           {displayName}
//                         </span>
//                       </div>
//                       <CardMenu
//                         onSelect={() => enterSelectMode(t.id)}
//                         onClone={() => handleClone(t)}
//                         onEdit={() => handleEdit(t)}
//                         onDelete={() => handleDelete(t.id)}
//                       />
//                     </div>

//                     {/* Pill tags */}
//                     <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
//                       {[
//                         t.tripType || 'Trip type',
//                         t.tripName || 'Trip name',
//                         t.zone     || 'Zone',
//                         t.patrols?.[0]?.location || 'Location 2',
//                       ].map((tag) => (
//                         <span key={tag} style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#333' }}>{tag}</span>
//                       ))}
//                     </div>

//                   </div>
//                 </div>
//               )
//             })}

//             {saved.length === 0 && (
//               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No trips saved yet.</div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// import { useState, useEffect, useRef } from 'react'
// import { getTrips, createTrip, deleteTrip, updateTrip, getLocations, getTasks } from '../../../api'
// import { ConfirmSaveModal } from '../components/MasterFormUI'

// const blank = {
//   tripType: '', tripName: '', zone: '',
//   patrols: [
//     { location: '', task: '' },
//     { location: '', task: '' },
//   ],
// }

// const fallbackNames  = ['Karthick', 'Arjun', 'Priya', 'Ravi', 'Meena', 'Suresh', 'Divya', 'Vikram']
// const fallbackColors = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#1ae8d4', '#e81a8e', '#4a90d9']

// /* ── Custom dropdown ── */
// function FieldDropdown({ value, onChange, options, placeholder }) {
//   const [open, setOpen] = useState(false)
//   const ref = useRef(null)
//   useEffect(() => {
//     const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
//     document.addEventListener('mousedown', h)
//     return () => document.removeEventListener('mousedown', h)
//   }, [])
//   return (
//     <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
//       <div style={{ display: 'flex' }}>
//         <input
//           type="text" placeholder={placeholder} value={value}
//           onChange={(e) => onChange(e.target.value)}
//           style={{ flex: 1, minWidth: 0, padding: '10px 14px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }}
//         />
//         <button type="button" onClick={() => setOpen((o) => !o)}
//           style={{ width: '38px', height: '42px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 8px 8px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//         >+</button>
//       </div>
//       {open && (
//         <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto', overflowX: 'hidden' }}>
//           {options.length === 0
//             ? <div style={{ padding: '10px 14px', fontSize: '13px', color: '#9aa0a6' }}>No options</div>
//             : options.map((opt) => (
//               <div key={opt} onMouseDown={() => { onChange(opt); setOpen(false) }}
//                 style={{ padding: '10px 14px', fontSize: '13px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' }}
//                 onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
//                 onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
//               >{opt}</div>
//             ))}
//         </div>
//       )}
//     </div>
//   )
// }

// /* ── 3-dot card menu ── */
// function CardMenu({ onSelect, onClone, onEdit, onDelete }) {
//   const [open, setOpen] = useState(false)
//   const ref = useRef(null)
//   useEffect(() => {
//     const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
//     document.addEventListener('mousedown', h)
//     return () => document.removeEventListener('mousedown', h)
//   }, [])
//   const items = [
//     { label: 'Select', icon: '☑', color: '#202124', action: onSelect },
//     { label: 'Clone',  icon: '⧉', color: '#202124', action: onClone },
//     { label: 'Edit',   icon: '✎', color: '#202124', action: onEdit },
//     { label: 'Delete', icon: '🗑', color: '#d93025', action: onDelete },
//   ]
//   return (
//     <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
//       <button onClick={() => setOpen((o) => !o)}
//         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '18px', color: '#5f6368', lineHeight: 1, borderRadius: '4px' }}
//       >⋮</button>
//       {open && (
//         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
//           {items.map(({ label, icon, color, action }) => (
//             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
//               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
//               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
//               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
//             ><span style={{ fontSize: '14px' }}>{icon}</span>{label}</div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default function TripForm() {
//   const [form, setForm]           = useState(blank)
//   const [saved, setSaved]         = useState([])
//   const [busy, setBusy]           = useState(false)
//   const [sel, setSel]             = useState(null)
//   const [confirm, setConfirm]     = useState(false)
//   const [showSaved, setShowSaved] = useState(true)
//   const [selectMode, setSelectMode] = useState(false)
//   const [selectedIds, setSelectedIds] = useState([])

//   const [zoneOpts, setZoneOpts] = useState(['Zone A', 'Zone B', 'Zone C'])
//   const [locOpts,  setLocOpts]  = useState(['Location A', 'Building 1', 'Main Campus'])
//   const [taskOpts, setTaskOpts] = useState(['Patrol', 'Inspection', 'Maintenance'])

//   useEffect(() => {
//     getTrips().then(setSaved).catch(() => {})
//     getLocations().then((locs) => {
//       const z = [...new Set(locs.map((l) => l.zone).filter(Boolean))].sort()
//       const l = [...new Set(locs.map((l) => l.location).filter(Boolean))].sort()
//       if (z.length) setZoneOpts(z)
//       if (l.length) setLocOpts(l)
//     }).catch(() => {})
//     getTasks?.().then((tasks) => {
//       const t = [...new Set(tasks.map((t) => t.employeeRoll).filter(Boolean))].sort()
//       if (t.length) setTaskOpts(t)
//     }).catch(() => {})
//   }, [])

//   const set       = (k, v) => setForm((p) => ({ ...p, [k]: v }))
//   const setPatrol = (i, field, val) => {
//     const updated = form.patrols.map((p, idx) => idx === i ? { ...p, [field]: val } : p)
//     set('patrols', updated)
//   }
//   const addPatrol = () => set('patrols', [...form.patrols, { location: '', task: '' }])
//   const removePatrol = (i) => set('patrols', form.patrols.filter((_, idx) => idx !== i))

//   const handleEdit  = (item) => { setForm({ ...blank, ...item, patrols: item.patrols?.length ? item.patrols : blank.patrols }); setSel(item.id) }
//   const handleClone = (item) => { const { id, ...rest } = item; setForm({ ...blank, ...rest, patrols: rest.patrols?.length ? rest.patrols : blank.patrols }); setSel(null) }
//   const handleCancelEdit = () => { setForm(blank); setSel(null) }
//   const handleSaveClick  = () => { if (!form.tripType && !form.tripName) return; setConfirm(true) }

//   const handleConfirmed = async () => {
//     setBusy(true)
//     const payload = { tripType: form.tripType, tripName: form.tripName, zone: form.zone, patrols: form.patrols }
//     try {
//       if (sel) {
//         const updated = await updateTrip(sel, payload)
//         setSaved((p) => p.map((t) => (t.id === sel ? { ...t, ...updated } : t)))
//         setSel(null); setForm(blank)
//       } else {
//         const created = await createTrip(payload)
//         setSaved((p) => [created, ...p]); setForm(blank)
//       }
//     } catch {
//       if (sel) { setSaved((p) => p.map((t) => (t.id === sel ? { ...t, ...payload } : t))); setSel(null); setForm(blank) }
//     }
//     setBusy(false); setConfirm(false)
//   }

//   const handleDelete = async (id) => {
//     try { await deleteTrip(id) } catch {}
//     setSaved((p) => p.filter((t) => t.id !== id))
//     if (sel === id) { setForm(blank); setSel(null) }
//   }

//   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
//   const toggleSelect    = (id) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
//   const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
//   const deleteSelected  = async () => {
//     for (const id of selectedIds) { try { await deleteTrip(id) } catch {} }
//     setSaved((p) => p.filter((t) => !selectedIds.includes(t.id)))
//     if (selectedIds.includes(sel)) { setForm(blank); setSel(null) }
//     setSelectMode(false); setSelectedIds([])
//   }

//   const summary = [
//     { label: 'Trip Type', value: form.tripType },
//     { label: 'Trip Name', value: form.tripName },
//     { label: 'Zone',      value: form.zone },
//     ...form.patrols.map((p, i) => ({ label: `Stop ${i + 1}`, value: `${p.location} / ${p.task}` })),
//   ]

//   const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }

//   return (
//     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
//       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

//       {/* ═══ LEFT: FORM ═══ */}
//       <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
//         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, lineHeight: '28px' }}>
//           {sel ? 'Edit Trip' : 'Create Trip'}
//         </h2>

//         <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

//           {/* Trip type | Trip name */}
//           <div style={{ display: 'flex', gap: '14px' }}>
//             <input placeholder="Trip type" value={form.tripType} onChange={(e) => set('tripType', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
//             <input placeholder="Trip name" value={form.tripName} onChange={(e) => set('tripName', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
//           </div>

//           {/* Zone */}
//           <FieldDropdown placeholder="Zone" value={form.zone} onChange={(v) => set('zone', v)} options={zoneOpts} />

//           {/* Location + Task stops */}
//           <div style={{ border: '1px solid #dadce0', borderRadius: '10px', padding: '16px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '12px' }}>
//             {form.patrols.map((patrol, i) => (
//               <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
//                 <FieldDropdown
//                   placeholder="Location"
//                   value={patrol.location}
//                   onChange={(v) => setPatrol(i, 'location', v)}
//                   options={locOpts}
//                 />
//                 <FieldDropdown
//                   placeholder="Task"
//                   value={patrol.task}
//                   onChange={(v) => setPatrol(i, 'task', v)}
//                   options={taskOpts}
//                 />
//                 {form.patrols.length > 1 && (
//                   <button onClick={() => removePatrol(i)}
//                     style={{ background: 'none', border: 'none', color: '#d93025', fontSize: '18px', cursor: 'pointer', flexShrink: 0, padding: '0 4px', lineHeight: 1 }}
//                   >×</button>
//                 )}
//               </div>
//             ))}

//             {/* Add row button */}
//             <button onClick={addPatrol}
//               style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#1a73e8', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '4px 0', alignSelf: 'flex-start' }}
//             >
//               <span style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: 1 }}>+</span> Add
//             </button>
//           </div>

//         </div>

//         {/* Save / Cancel */}
//         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '24px', marginTop: 'auto' }}>
//           {sel && (
//             <button onClick={handleCancelEdit} style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '6px', background: '#fff', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
//               Cancel
//             </button>
//           )}
//           <button onClick={handleSaveClick} style={{ padding: '10px 32px', border: 'none', borderRadius: '6px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
//             {sel ? 'Update' : 'Save'}
//           </button>
//         </div>
//       </div>

//       {/* ═══ RIGHT: SAVED TRIPS ═══ */}
//       <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

//         {/* Header */}
//         <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
//           {selectMode ? (
//             <>
//               <div
//                 onClick={() => setSelectedIds(selectedIds.length === saved.length ? [] : saved.map((t) => t.id))}
//                 style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
//               >
//                 {selectedIds.length === saved.length
//                   ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
//                   : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
//               </div>
//               <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
//                 {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Trip'}
//               </h2>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
//                 <button onClick={deleteSelected} disabled={selectedIds.length === 0}
//                   style={{ display: 'flex', alignItems: 'center', gap: '4px', background: selectedIds.length > 0 ? '#fce8e6' : '#f5f5f5', border: 'none', color: selectedIds.length > 0 ? '#d93025' : '#bbb', fontSize: '12px', fontWeight: 600, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', padding: '5px 10px', borderRadius: '4px' }}>
//                   🗑 Delete
//                 </button>
//                 <button onClick={cancelSelect}
//                   style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: '12px', fontWeight: 500, cursor: 'pointer', padding: '5px 8px', borderRadius: '4px' }}>
//                   ✕ Cancel
//                 </button>
//               </div>
//             </>
//           ) : (
//             <>
//               {showSaved && <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0, lineHeight: '28px' }}>Saved Trip</h2>}
//               <button onClick={() => setShowSaved(!showSaved)}
//                 style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
//                 {showSaved ? '⊏' : '⊐'}
//               </button>
//             </>
//           )}
//         </div>

//         {/* Saved list */}
//         {showSaved && (
//           <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>
//             {saved.map((t, idx) => {
//               const displayName = t.tripName || fallbackNames[idx % fallbackNames.length]
//               const avatarColor = fallbackColors[idx % fallbackColors.length]
//               const isChecked   = selectedIds.includes(t.id)
//               return (
//                 <div key={t.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>

//                   {/* Checkbox — only in selectMode */}
//                   {selectMode && (
//                     <div onClick={() => toggleSelect(t.id)}
//                       style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
//                       {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
//                     </div>
//                   )}

//                   {/* Card */}
//                   <div style={{ flex: 1, minWidth: 0, border: `1px solid ${selectMode && isChecked ? '#1a73e8' : '#e0e0e0'}`, borderRadius: '10px', padding: '10px 12px', background: selectMode && isChecked ? '#f0f4ff' : '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>

//                     {/* Top: avatar + name + menu */}
//                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
//                         <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
//                           👤
//                         </div>
//                         <span style={{ fontSize: '13px', fontWeight: 600, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                           {displayName}
//                         </span>
//                       </div>
//                       <CardMenu
//                         onSelect={() => enterSelectMode(t.id)}
//                         onClone={() => handleClone(t)}
//                         onEdit={() => handleEdit(t)}
//                         onDelete={() => handleDelete(t.id)}
//                       />
//                     </div>

//                     {/* Pill tags */}
//                     <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
//                       {[
//                         t.tripType || 'Trip type',
//                         t.tripName || 'Trip name',
//                         t.zone     || 'Zone',
//                         t.patrols?.[0]?.location || 'Location 2',
//                       ].map((tag) => (
//                         <span key={tag} style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#333' }}>{tag}</span>
//                       ))}
//                     </div>

//                   </div>
//                 </div>
//               )
//             })}

//             {saved.length === 0 && (
//               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No trips saved yet.</div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

import { useState, useEffect, useRef } from 'react'
import { getTrips, createTrip, deleteTrip, updateTrip, getZones, getLocations, getTasks, getTripTypes } from '../../../api'
import { ConfirmSaveModal } from '../components/MasterFormUI'

const blank = {
  tripType: '', tripName: '', zone: '',
  patrols: [
    { location: '', task: '' },
    { location: '', task: '' },
  ],
}

const fallbackNames  = ['Karthick', 'Arjun', 'Priya', 'Ravi', 'Meena', 'Suresh', 'Divya', 'Vikram']
const fallbackColors = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#1ae8d4', '#e81a8e', '#4a90d9']

/* ── Custom dropdown ── */
function FieldDropdown({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex' }}>
        <input
          type="text" placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, minWidth: 0, padding: '10px 14px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }}
        />
        <button type="button" onClick={() => setOpen((o) => !o)}
          style={{ width: '38px', height: '42px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 8px 8px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >+</button>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto', overflowX: 'hidden' }}>
          {options.length === 0
            ? <div style={{ padding: '10px 14px', fontSize: '13px', color: '#9aa0a6' }}>No options</div>
            : options.map((opt) => (
              <div key={opt} onMouseDown={() => { onChange(opt); setOpen(false) }}
                style={{ padding: '10px 14px', fontSize: '13px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
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
    { label: 'Clone',  icon: '⧉', color: '#202124', action: onClone },
    { label: 'Edit',   icon: '✎', color: '#202124', action: onEdit },
    { label: 'Delete', icon: '🗑', color: '#d93025', action: onDelete },
  ]
  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button onClick={() => setOpen((o) => !o)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '18px', color: '#5f6368', lineHeight: 1, borderRadius: '4px' }}
      >⋮</button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
          {items.map(({ label, icon, color, action }) => (
            <div key={label} onMouseDown={() => { action(); setOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            ><span style={{ fontSize: '14px' }}>{icon}</span>{label}</div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TripForm() {
  const [form, setForm]           = useState(blank)
  const [saved, setSaved]         = useState([])
  const [busy, setBusy]           = useState(false)
  const [sel, setSel]             = useState(null)
  const [confirm, setConfirm]     = useState(false)
  const [showSaved, setShowSaved] = useState(true)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])

  const [zoneOpts, setZoneOpts]         = useState([])
  const [tripTypeOpts, setTripTypeOpts] = useState([])
  const [locOpts,  setLocOpts]          = useState([])
  const [taskOpts, setTaskOpts]         = useState([])

  useEffect(() => {
    getTrips().then(setSaved).catch(() => {})

    // Zone options — from Zones master (Others › Zone)
    getZones().then((zones) => {
      const z = zones.map((z) => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
      setZoneOpts(z)
    }).catch(() => {})

    // Trip Type options — from Trip Types master (Others › Trip Types)
    getTripTypes().then((types) => {
      const t = types.map((t) => t.typeName).filter(Boolean).sort()
      if (t.length) setTripTypeOpts(t)
    }).catch(() => {})

    // Location options — from locations created in LocationForm
    getLocations().then((locs) => {
      const l = [...new Set(locs.map((l) => l.location).filter(Boolean))].sort()
      if (l.length) setLocOpts(l)
    }).catch(() => {})

    // Task options — from tasks created in TaskForm (task name = question field)
    getTasks?.().then((tasks) => {
      const t = [...new Set(tasks.map((t) => t.question).filter(Boolean))].sort()
      if (t.length) setTaskOpts(t)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleZonesUpdated = () => {
      getZones().then((zones) => {
        const z = zones.map((z) => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
        setZoneOpts(z)
      }).catch(() => {})
    }
    window.addEventListener('zones-updated', handleZonesUpdated)
    return () => window.removeEventListener('zones-updated', handleZonesUpdated)
  }, [])

  const set       = (k, v) => setForm((p) => ({ ...p, [k]: v }))
  const setPatrol = (i, field, val) => {
    const updated = form.patrols.map((p, idx) => idx === i ? { ...p, [field]: val } : p)
    set('patrols', updated)
  }
  const addPatrol = () => set('patrols', [...form.patrols, { location: '', task: '' }])
  const removePatrol = (i) => set('patrols', form.patrols.filter((_, idx) => idx !== i))

  const handleEdit  = (item) => { setForm({ ...blank, ...item, patrols: item.patrols?.length ? item.patrols : blank.patrols }); setSel(item.id) }
  const handleClone = (item) => { const { id, ...rest } = item; setForm({ ...blank, ...rest, patrols: rest.patrols?.length ? rest.patrols : blank.patrols }); setSel(null) }
  const handleCancelEdit = () => { setForm(blank); setSel(null) }
  const handleSaveClick  = () => { if (!form.tripType && !form.tripName) return; setConfirm(true) }

  const handleConfirmed = async () => {
    setBusy(true)
    const payload = { tripType: form.tripType, tripName: form.tripName, zone: form.zone, patrols: form.patrols }
    try {
      if (sel) {
        const updated = await updateTrip(sel, payload)
        setSaved((p) => p.map((t) => (t.id === sel ? { ...t, ...updated } : t)))
        setSel(null); setForm(blank)
      } else {
        const created = await createTrip(payload)
        setSaved((p) => [created, ...p]); setForm(blank)
      }
    } catch {
      if (sel) { setSaved((p) => p.map((t) => (t.id === sel ? { ...t, ...payload } : t))); setSel(null); setForm(blank) }
    }
    setBusy(false); setConfirm(false)
  }

  const handleDelete = async (id) => {
    try { await deleteTrip(id) } catch {}
    setSaved((p) => p.filter((t) => t.id !== id))
    if (sel === id) { setForm(blank); setSel(null) }
  }

  const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
  const toggleSelect    = (id) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
  const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
  const deleteSelected  = async () => {
    for (const id of selectedIds) { try { await deleteTrip(id) } catch {} }
    setSaved((p) => p.filter((t) => !selectedIds.includes(t.id)))
    if (selectedIds.includes(sel)) { setForm(blank); setSel(null) }
    setSelectMode(false); setSelectedIds([])
  }

  const summary = [
    { label: 'Trip Type', value: form.tripType },
    { label: 'Trip Name', value: form.tripName },
    { label: 'Zone',      value: form.zone },
    ...form.patrols.map((p, i) => ({ label: `Stop ${i + 1}`, value: `${p.location} / ${p.task}` })),
  ]

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
      <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

      {/* ═══ LEFT: FORM ═══ */}
      <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, lineHeight: '28px' }}>
          {sel ? 'Edit Trip' : 'Create Trip'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Trip type | Trip name */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <FieldDropdown placeholder="Trip type" value={form.tripType} onChange={(v) => set('tripType', v)} options={tripTypeOpts} />
            <input placeholder="Trip name" value={form.tripName} onChange={(e) => set('tripName', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
          </div>

          {/* Zone */}
          <FieldDropdown placeholder="Zone" value={form.zone} onChange={(v) => set('zone', v)} options={zoneOpts} />

          {/* Location + Task stops */}
          <div style={{ border: '1px solid #dadce0', borderRadius: '10px', padding: '16px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {form.patrols.map((patrol, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <FieldDropdown
                  placeholder="Location"
                  value={patrol.location}
                  onChange={(v) => setPatrol(i, 'location', v)}
                  options={locOpts}
                />
                <FieldDropdown
                  placeholder="Task"
                  value={patrol.task}
                  onChange={(v) => setPatrol(i, 'task', v)}
                  options={taskOpts}
                />
                {form.patrols.length > 1 && (
                  <button onClick={() => removePatrol(i)}
                    style={{ background: 'none', border: 'none', color: '#d93025', fontSize: '18px', cursor: 'pointer', flexShrink: 0, padding: '0 4px', lineHeight: 1 }}
                  >×</button>
                )}
              </div>
            ))}

            {/* Add row button */}
            <button onClick={addPatrol}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#1a73e8', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '4px 0', alignSelf: 'flex-start' }}
            >
              <span style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: 1 }}>+</span> Add
            </button>
          </div>

        </div>

        {/* Save / Cancel */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '24px', marginTop: 'auto' }}>
          {sel && (
            <button onClick={handleCancelEdit} style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '6px', background: '#fff', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              Cancel
            </button>
          )}
          <button onClick={handleSaveClick} style={{ padding: '10px 32px', border: 'none', borderRadius: '6px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
            {sel ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      {/* ═══ RIGHT: SAVED TRIPS ═══ */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
          {selectMode ? (
            <>
              <div
                onClick={() => setSelectedIds(selectedIds.length === saved.length ? [] : saved.map((t) => t.id))}
                style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                {selectedIds.length === saved.length
                  ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
                  : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
              </div>
              <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
                {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Trip'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
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
              {showSaved && <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0, lineHeight: '28px' }}>Saved Trip</h2>}
              <button onClick={() => setShowSaved(!showSaved)}
                style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
                {showSaved ? '⊏' : '⊐'}
              </button>
            </>
          )}
        </div>

        {/* Saved list */}
        {showSaved && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>
            {saved.map((t, idx) => {
              const displayName = t.tripName || fallbackNames[idx % fallbackNames.length]
              const avatarColor = fallbackColors[idx % fallbackColors.length]
              const isChecked   = selectedIds.includes(t.id)
              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>

                  {/* Checkbox — only in selectMode */}
                  {selectMode && (
                    <div onClick={() => toggleSelect(t.id)}
                      style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
                      {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                    </div>
                  )}

                  {/* Card */}
                  <div style={{ flex: 1, minWidth: 0, border: `1px solid ${selectMode && isChecked ? '#1a73e8' : '#e0e0e0'}`, borderRadius: '10px', padding: '10px 12px', background: selectMode && isChecked ? '#f0f4ff' : '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>

                    {/* Top: avatar + name + menu */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                          👤
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {displayName}
                        </span>
                      </div>
                      <CardMenu
                        onSelect={() => enterSelectMode(t.id)}
                        onClone={() => handleClone(t)}
                        onEdit={() => handleEdit(t)}
                        onDelete={() => handleDelete(t.id)}
                      />
                    </div>

                    {/* Pill tags */}
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {[
                        t.tripType || 'Trip type',
                        t.tripName || 'Trip name',
                        t.zone     || 'Zone',
                        t.patrols?.[0]?.location || 'Location 2',
                      ].map((tag) => (
                        <span key={tag} style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#333' }}>{tag}</span>
                      ))}
                    </div>

                  </div>
                </div>
              )
            })}

            {saved.length === 0 && (
              <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No trips saved yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}