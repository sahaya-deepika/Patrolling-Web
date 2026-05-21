// // // import { useState, useEffect, useRef } from 'react'
// // // import {
// // //   getSchedules,
// // //   createSchedule,
// // //   deleteSchedule,
// // //   updateSchedule,
// // //   getZoneFilter,
// // //   getUserList,
// // //   listTrips,
// // //   filterPatrolTypes,
// // // } from '../../../api'
// // // import { ConfirmSaveModal } from '../components/MasterFormUI'

// // // /* ── Custom 3-dot menu ── */
// // // function CardMenu({ onSelect, onClone, onEdit, onDelete }) {
// // //   const [open, setOpen] = useState(false)
// // //   const ref = useRef(null)
// // //   useEffect(() => {
// // //     const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
// // //     document.addEventListener('mousedown', h)
// // //     return () => document.removeEventListener('mousedown', h)
// // //   }, [])

// // //   const items = [
// // //     { label: 'Select', icon: '☑', color: '#202124', action: onSelect },
// // //     { label: 'Clone',  icon: '⧉', color: '#202124', action: onClone },
// // //     { label: 'Edit',   icon: '✎', color: '#202124', action: onEdit },
// // //     { label: 'Delete', icon: '🗑', color: '#d93025', action: onDelete },
// // //   ]

// // //   return (
// // //     <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
// // //       <button
// // //         onClick={() => setOpen((o) => !o)}
// // //         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontSize: '20px', color: '#5f6368', lineHeight: 1, borderRadius: '4px' }}
// // //       >⋮</button>
// // //       {open && (
// // //         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
// // //           {items.map(({ label, icon, color, action }) => (
// // //             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
// // //               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
// // //               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
// // //               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
// // //             >
// // //               <span style={{ fontSize: '14px' }}>{icon}</span> {label}
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}
// // //     </div>
// // //   )
// // // }

// // // /* ── blank form ── */
// // // const blank = {
// // //   zoneId: '', zoneName: '',
// // //   userId: '', employeeName: '',
// // //   patrolTypeId: '', patrolTypeName: '',
// // //   tripId: '', tripName: '',
// // //   startDate: '', startTime: '',
// // //   endDate: '', endTime: '',
// // //   ordered: true,
// // //   minRound: '', maxRound: '',
// // //   delay_mins: '', expiredDate: '',
// // // }

// // // /* ── Custom searchable dropdown ── */
// // // function FieldDropdown({ label, displayValue, onSelect, options }) {
// // //   const [open, setOpen] = useState(false)
// // //   const [search, setSearch] = useState('')
// // //   const ref = useRef(null)
// // //   useEffect(() => {
// // //     const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
// // //     document.addEventListener('mousedown', handler)
// // //     return () => document.removeEventListener('mousedown', handler)
// // //   }, [])
// // //   const filtered = options.filter(opt => (opt.label || '').toLowerCase().includes(search.toLowerCase()))
// // //   return (
// // //     <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
// // //       {label && <label style={{ fontSize: '11px', fontWeight: 500, color: '#5f6368' }}>{label}</label>}
// // //       <div ref={ref} style={{ position: 'relative' }}>
// // //         <div style={{ display: 'flex' }}>
// // //           <input type="text" placeholder={label}
// // //             value={open ? search : (displayValue || '')}
// // //             onChange={(e) => { setSearch(e.target.value); setOpen(true) }}
// // //             onFocus={() => { setSearch(''); setOpen(true) }}
// // //             style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '4px 0 0 4px', fontSize: '13px', color: '#202124', outline: 'none', height: '38px', boxSizing: 'border-box' }}
// // //           />
// // //           <button type="button" onClick={() => { setSearch(''); setOpen((o) => !o) }}
// // //             style={{ width: '38px', height: '38px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 4px 4px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
// // //           >+</button>
// // //         </div>
// // //         {open && (
// // //           <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
// // //             {filtered.length === 0
// // //               ? <div style={{ padding: '8px 12px', fontSize: '13px', color: '#9aa0a6' }}>No options</div>
// // //               : filtered.map((opt) => (
// // //                 <div key={opt.value} onMouseDown={() => { onSelect(opt); setSearch(''); setOpen(false) }}
// // //                   style={{ padding: '8px 12px', fontSize: '13px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
// // //                   onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
// // //                   onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
// // //                 >{opt.label}</div>
// // //               ))}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // /* ── helpers ── */
// // // function formatDateTime(date, time) {
// // //   if (!date) return ''
// // //   return `${date} ${time ? time + ':00' : '00:00:00'}`
// // // }
// // // function naVal(v) {
// // //   if (v == null || v === 'N/A' || v === '') return null
// // //   return v
// // // }
// // // function safeStr(v, fallback = '') {
// // //   if (v == null || v === 'N/A') return fallback
// // //   return String(v)
// // // }
// // // function extractRecords(raw) {
// // //   if (Array.isArray(raw?.data?.records)) return raw.data.records
// // //   if (Array.isArray(raw?.records))       return raw.records
// // //   if (Array.isArray(raw))                return raw
// // //   return []
// // // }

// // // /* ── Avatar color palette ── */
// // // const avatarColors = [
// // //   { bg: '#e8f0fe', text: '#1a73e8' },
// // //   { bg: '#fce8e6', text: '#d93025' },
// // //   { bg: '#e6f4ea', text: '#1e8e3e' },
// // //   { bg: '#fef7e0', text: '#f29900' },
// // //   { bg: '#f3e8fd', text: '#9334e6' },
// // //   { bg: '#e8f5e9', text: '#388e3c' },
// // //   { bg: '#fff3e0', text: '#e65100' },
// // //   { bg: '#e3f2fd', text: '#1565c0' },
// // // ]

// // // /* ── Schedule Card ── */
// // // function ScheduleCard({ s, idx, isChecked, selectMode, onToggleSelect, onSelect, onClone, onEdit, onDelete }) {
// // //   const isOrdered  = Number(s.is_order) === 1
// // //   const isRound    = Number(s.is_round) === 1
// // //   const isCyclic   = naVal(s.delay_mins) != null
// // //   const avatarClr  = avatarColors[idx % avatarColors.length]
// // //   const userName   = safeStr(s.user, '—')
// // //   const tripName   = safeStr(s.trip_name) || `Trip #${s.trip_id ?? ''}`
// // //   const tripType   = naVal(s.trip_type) ? safeStr(s.trip_type) : null
// // //   const minRound   = naVal(s.min_round)
// // //   const maxRound   = naVal(s.max_round)
// // //   const delayMins  = naVal(s.delay_mins)
// // //   const expiredAt  = naVal(s.expired_at)
// // //   const startDate  = safeStr(s.start_date)
// // //   const startTime  = safeStr(s.start_time)
// // //   const endTime    = safeStr(s.end_time)
// // //   const avatarChar = userName.charAt(0).toUpperCase() || '?'
// // //   const zone       = (() => {
// // //     if (Array.isArray(s.zone)) return s.zone.filter(Boolean).join(', ') || null
// // //     return naVal(s.zone) ? String(s.zone) : null
// // //   })()

// // //   /* Format "10:00 AM to 4:00 PM" style time range */
// // //   const timeRange = (startTime && endTime) ? `${startTime} — ${endTime}` : (startTime || endTime || '')

// // //   return (
// // //     <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
// // //       {selectMode && (
// // //         <div onClick={() => onToggleSelect(s.id)}
// // //           style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
// // //           {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
// // //         </div>
// // //       )}

// // //       <div style={{
// // //         flex: 1, minWidth: 0,
// // //         border: `1.5px solid ${isChecked ? '#1a73e8' : '#e8eaed'}`,
// // //         borderRadius: '14px',
// // //         background: '#fff',
// // //         boxShadow: '0 1px 4px rgba(60,64,67,0.08)',
// // //         overflow: 'hidden',
// // //       }}>

// // //         {/* ── Top time/order bar ── */}
// // //         <div style={{
// // //           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
// // //           padding: '8px 14px',
// // //           background: isOrdered ? '#f0faf4' : '#fff8f0',
// // //           borderBottom: `1px solid ${isOrdered ? '#d4edda' : '#ffe0b2'}`,
// // //           flexWrap: 'wrap', gap: '6px',
// // //         }}>
// // //           {/* Left: time range + date */}
// // //           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minWidth: 0 }}>
// // //             {timeRange && (
// // //               <span style={{ fontSize: '12px', fontWeight: 600, color: '#3c4043' }}>{timeRange}</span>
// // //             )}
// // //             <span style={{
// // //               display: 'inline-flex', alignItems: 'center', gap: '3px',
// // //               background: isOrdered ? '#1e8e3e' : '#e65100',
// // //               color: '#fff', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 700,
// // //             }}>
// // //               {isOrdered ? 'Order' : 'Unorder'}
// // //             </span>
// // //             {isRound && (
// // //               <span style={{ background: '#e8f0fe', color: '#1a73e8', borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, border: '1px solid #c5d8fa' }}>
// // //                 🔁 Round
// // //               </span>
// // //             )}
// // //             {isCyclic && (
// // //               <span style={{ background: '#f3e8fd', color: '#9334e6', borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, border: '1px solid #e1c4fa' }}>
// // //                 🔄 Cyclic
// // //               </span>
// // //             )}
// // //           </div>

// // //           {/* Right: start date + menu */}
// // //           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
// // //             <CardMenu
// // //               onSelect={() => onSelect(s.id)}
// // //               onClone={() => onClone(s)}
// // //               onEdit={() => onEdit(s)}
// // //               onDelete={() => onDelete(s.id)}
// // //             />
// // //           </div>
// // //         </div>

// // //         {/* ── User row ── */}
// // //         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px 6px' }}>
// // //           <div style={{
// // //             width: '34px', height: '34px', borderRadius: '50%',
// // //             background: avatarClr.bg, color: avatarClr.text,
// // //             display: 'flex', alignItems: 'center', justifyContent: 'center',
// // //             fontSize: '13px', fontWeight: 700, flexShrink: 0,
// // //           }}>
// // //             {avatarChar}
// // //           </div>
// // //           <div style={{ minWidth: 0 }}>
// // //             <div style={{ fontSize: '14px', fontWeight: 700, color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
// // //             {tripType && <div style={{ fontSize: '11px', color: '#5f6368' }}>{tripType}</div>}
// // //           </div>
// // //         </div>

// // //         {/* ── Trip name ── */}
// // //         <div style={{ padding: '2px 14px 8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
// // //           <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a73e8' }}>🗺 {tripName}</span>
// // //         </div>

// // //         {/* ── Pills row: rounds, expiry, delay ── */}
// // //         <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
// // //           {(minRound != null || maxRound != null) && (
// // //             <span style={{ background: '#f0f4ff', border: '1px solid #c5d8fa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#1a73e8', fontWeight: 600 }}>
// // //               Rounds: {minRound ?? '—'}
// // //               {maxRound != null ? ` – ${maxRound}` : ''}
// // //             </span>
// // //           )}
// // //           {expiredAt && (
// // //             <span style={{ background: '#fff8f0', border: '1px solid #ffcc80', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#e65100', fontWeight: 600 }}>
// // //               Exp: {expiredAt}
// // //             </span>
// // //           )}
// // //           {delayMins != null && (
// // //             <span style={{ background: '#f3e8fd', border: '1px solid #e1c4fa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#9334e6', fontWeight: 600 }}>
// // //               ⏱ Restart: {delayMins} min
// // //             </span>
// // //           )}
// // //           {zone && (
// // //             <span style={{ background: '#e6f4ea', border: '1px solid #b7e1c8', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#1e8e3e', fontWeight: 600 }}>
// // //               📍 {zone}
// // //             </span>
// // //           )}
// // //         </div>

// // //         {/* ── Footer: created / updated ── */}
// // //         {(s.created_at || naVal(s.updated_at)) && (
// // //           <div style={{ padding: '6px 14px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
// // //             {s.created_at && (
// // //               <span style={{ fontSize: '10px', color: '#9aa0a6' }}>Created: {safeStr(s.created_at)}</span>
// // //             )}
// // //             {naVal(s.updated_at) && (
// // //               <span style={{ fontSize: '10px', color: '#9aa0a6' }}>Updated: {safeStr(s.updated_at)}</span>
// // //             )}
// // //             {startDate && (
// // //               <span style={{ fontSize: '11px', color: '#5f6368' }}>Start {startDate}</span>
// // //             )}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default function ScheduleForm() {
// // //   const [form, setForm]               = useState(blank)
// // //   const [saved, setSaved]             = useState([])
// // //   const [busy, setBusy]               = useState(false)
// // //   const [sel, setSel]                 = useState(null)
// // //   const [confirm, setConfirm]         = useState(false)
// // //   const [showSaved, setShowSaved]     = useState(true)
// // //   const [selectMode, setSelectMode]   = useState(false)
// // //   const [selectedIds, setSelectedIds] = useState([])
// // //   const [loadingPanel, setLoadingPanel] = useState(false)
// // //   const [formError, setFormError]     = useState('')

// // //   const [zoneOptions, setZoneOptions]             = useState([])
// // //   const [userOptions, setUserOptions]             = useState([])
// // //   const [patrolTypeOptions, setPatrolTypeOptions] = useState([])
// // //   const [tripOptions, setTripOptions]             = useState([])

// // //   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
// // //   const toggleSelect    = (id) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
// // //   const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
// // //   const deleteSelected  = async () => {
// // //     for (const id of selectedIds) { try { await deleteSchedule(id) } catch {} }
// // //     setSaved(p => p.filter(s => !selectedIds.includes(s.id)))
// // //     setSelectMode(false); setSelectedIds([])
// // //   }

// // //   const loadSaved = async () => {
// // //     setLoadingPanel(true)
// // //     try {
// // //       const raw = await getSchedules()
// // //       setSaved(Array.isArray(raw) ? raw: [])
// // //     } catch {
// // //       setSaved([])
// // //     } finally {
// // //       setLoadingPanel(false)
// // //     }
// // //   }

// // //   useEffect(() => {
// // //     loadSaved()

// // //     getZoneFilter().then(records => {
// // //       setZoneOptions(records.map(r => ({
// // //         value: String(r.value ?? r.id ?? ''),
// // //         label: String(r.label || r.name || r.zoneName || r.zoneNameLong || r.l_name || ''),
// // //       })).filter(o => o.value && o.label))
// // //     }).catch(() => {})

// // //     getUserList().then(users => {
// // //       const opts = users.map(u => ({
// // //         value: String(u.id ?? ''),
// // //         label: String(u.userName || u.userid || ''),
// // //       })).filter(o => o.value && o.label)
// // //       setUserOptions([{ value: 'all', label: 'All' }, ...opts])
// // //     }).catch(() => {})

// // //     filterPatrolTypes('all').then(types => {
// // //       setPatrolTypeOptions(types.map(t => ({
// // //         value: String(t.id ?? ''),
// // //         label: String(t.patrolName || ''),
// // //       })).filter(o => o.value && o.label))
// // //     }).catch(() => {})

// // //     listTrips().then(list => {
// // //       setTripOptions(list.map(t => ({
// // //         value: String(t.id ?? t.value ?? ''),
// // //         label: String(t.lable || t.label || t.tripName || t.name || t.trip_name || ''),
// // //       })).filter(o => o.value && o.label))
// // //     }).catch(() => {})
// // //   }, [])

// // //   useEffect(() => {
// // //     if (typeof window === 'undefined') return
// // //     const onZones = () => getZoneFilter().then(records => {
// // //       setZoneOptions(records.map(r => ({ value: String(r.value ?? r.id ?? ''), label: String(r.label || r.name || r.zoneName || '') })).filter(o => o.value && o.label))
// // //     }).catch(() => {})
// // //     const onTrips = () => listTrips().then(list => {
// // //       setTripOptions(list.map(t => ({ value: String(t.id ?? t.value ?? ''), label: String(t.lable || t.label || t.tripName || t.name || '') })).filter(o => o.value && o.label))
// // //     }).catch(() => {})
// // //     window.addEventListener('zones-updated', onZones)
// // //     window.addEventListener('trips-updated', onTrips)
// // //     return () => { window.removeEventListener('zones-updated', onZones); window.removeEventListener('trips-updated', onTrips) }
// // //   }, [])

// // //   const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

// // //   function buildPayload(f) {
// // //     const roundUsed  = !!f.minRound
// // //     const cyclicUsed = !!f.delay_mins
// // //     const payload = {
// // //       zone:            f.zoneId       ? [String(f.zoneId)]       : [],
// // //       user:            (!f.userId || f.userId === 'all') ? ['all'] : [String(f.userId)],
// // //       patrol_type:     f.patrolTypeId ? [String(f.patrolTypeId)] : [],
// // //       trip:            Number(f.tripId) || 0,
// // //       start_date_time: formatDateTime(f.startDate, f.startTime),
// // //       end_date_time:   formatDateTime(f.endDate,   f.endTime),
// // //       order:           f.ordered ? 1 : 0,
// // //     }
// // //     if (roundUsed) {
// // //       payload.is_round  = 1
// // //       payload.min_round = Number(f.minRound)
// // //       payload.max_round = f.maxRound ? Number(f.maxRound) : null
// // //     }
// // //     if (cyclicUsed) {
// // //       payload.is_cyclic    = 1
// // //       payload.delay_mins   = Number(f.delay_mins)
// // //       payload.expired_date = f.expiredDate
// // //         ? `${f.expiredDate} 00:00:00`
// // //         : formatDateTime(f.endDate, f.endTime)
// // //     }
// // //     return payload
// // //   }

// // //   function apiRecordToForm(s) {
// // //     const userId  = s.user_id != null ? String(s.user_id) : ''
// // //     const userOpt = userOptions.find(o => String(o.value) === userId)
// // //     const tripOpt = tripOptions.find(o => String(o.value) === String(s.trip_id ?? ''))
// // //     const zoneId  = Array.isArray(s.zone) ? (s.zone[0] || '') : (s.zone ? String(s.zone) : '')
// // //     const zoneOpt = zoneOptions.find(o => String(o.value) === String(zoneId))
// // //     const ptId    = s.patrol_type_id ? String(s.patrol_type_id) : ''
// // //     const ptOpt   = patrolTypeOptions.find(o => String(o.value) === ptId)
// // //     return {
// // //       zoneId,         zoneName:       zoneOpt?.label        || zoneId,
// // //       userId,         employeeName:   userOpt?.label        || safeStr(s.user),
// // //       patrolTypeId:   ptId,
// // //       patrolTypeName: ptOpt?.label   || safeStr(s.trip_type),
// // //       tripId:         s.trip_id != null ? String(s.trip_id) : '',
// // //       tripName:       tripOpt?.label || safeStr(s.trip_name),
// // //       startDate:      safeStr(s.start_date),
// // //       startTime:      safeStr(s.start_time).replace(/ (AM|PM)$/i, ''),
// // //       endDate:        safeStr(s.start_date),
// // //       endTime:        safeStr(s.end_time).replace(/ (AM|PM)$/i, ''),
// // //       ordered:        Number(s.is_order) !== 0,
// // //       minRound:       naVal(s.min_round)  != null ? String(s.min_round)  : '',
// // //       maxRound:       naVal(s.max_round)  != null ? String(s.max_round)  : '',
// // //       delay_mins:     naVal(s.delay_mins) != null ? String(s.delay_mins) : '',
// // //       expiredDate:    safeStr(s.expired_at),
// // //     }
// // //   }

// // //   const handleClone = (item) => { setForm(apiRecordToForm(item)); setSel(null) }
// // //   const handleEdit  = (item) => { setForm(apiRecordToForm(item)); setSel(item.id) }

// // //   const handleSaveClick = () => {
// // //     setFormError('')
// // //     const f = form
// // //     if (!f.tripId)    return setFormError('Please select a Trip.')
// // //     if (!f.startDate) return setFormError('Please set a Start Date.')
// // //     if (!f.startTime) return setFormError('Please set a Start Time.')
// // //     if (!f.endDate)   return setFormError('Please set an End Date.')
// // //     if (!f.endTime)   return setFormError('Please set an End Time.')
// // //     const roundTouched  = !!(f.minRound  || f.maxRound)
// // //     const cyclicTouched = !!(f.delay_mins || f.expiredDate)
// // //     if (!roundTouched && !cyclicTouched) {
// // //       return setFormError('Please fill in Round or Cyclic details (or both) before saving.')
// // //     }
// // //     if (f.maxRound && !f.minRound) {
// // //       return setFormError('You entered a Maximum Round — please also enter Minimum Round.')
// // //     }
// // //     if (f.delay_mins && !f.expiredDate) {
// // //       return setFormError('You entered a Restart Time — please also enter the Expiry Date.')
// // //     }
// // //     if (f.expiredDate && !f.delay_mins) {
// // //       return setFormError('You entered an Expiry Date — please also enter the Restart Time.')
// // //     }
// // //     setConfirm(true)
// // //   }

// // //   const handleConfirmed = async () => {
// // //     setBusy(true)
// // //     const payload = buildPayload(form)
// // //     try {
// // //       if (sel) {
// // //         await updateSchedule(sel, payload)
// // //         await loadSaved()
// // //         setSel(null); setForm(blank)
// // //       } else {
// // //         await createSchedule(payload)
// // //         await loadSaved()
// // //         setForm(blank)
// // //       }
// // //     } catch (err) {
// // //       console.error('[ScheduleForm] save error:', err)
// // //       if (sel) { setSaved(p => p.map(s => s.id === sel ? { ...s, ...payload, id: sel } : s)); setSel(null); setForm(blank) }
// // //     }
// // //     setBusy(false); setConfirm(false)
// // //   }

// // //   const handleDelete = async (id) => {
// // //     try { await deleteSchedule(id) } catch {}
// // //     setSaved(p => p.filter(s => s.id !== id))
// // //     if (sel === id) { setForm(blank); setSel(null) }
// // //   }

// // //   const summary = [
// // //     { label: 'Zone',         value: form.zoneName       },
// // //     { label: 'Employee',     value: form.employeeName   },
// // //     { label: 'Patrol Type',  value: form.patrolTypeName },
// // //     { label: 'Trip',         value: form.tripName       },
// // //     { label: 'Start',        value: `${form.startDate} ${form.startTime}` },
// // //     { label: 'End',          value: `${form.endDate} ${form.endTime}`     },
// // //     { label: 'Order',        value: form.ordered ? 'ORDER' : 'UNORDER'   },
// // //     ...(form.minRound    ? [{ label: 'Min Round',    value: form.minRound }]             : []),
// // //     ...(form.maxRound    ? [{ label: 'Max Round',    value: form.maxRound }]             : []),
// // //     ...(form.delay_mins  ? [{ label: 'Restart Time', value: `${form.delay_mins} mins` }] : []),
// // //     ...(form.expiredDate ? [{ label: 'Expiry Date',  value: form.expiredDate }]          : []),
// // //   ]

// // //   const inp = {
// // //     padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px',
// // //     fontSize: '12px', outline: 'none', flex: 1, minWidth: '120px', boxSizing: 'border-box',
// // //   }

// // //   return (
// // //     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
// // //       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

// // //       {/* ═══ LEFT PANEL ═══ */}
// // //       <div style={{ flex: '0 0 55%', width: '55%', maxWidth: '55%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '20px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
// // //         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0 }}>
// // //           {sel ? 'Edit Schedule' : 'Create Schedule'}
// // //         </h2>

// // //         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>

// // //           <div style={{ display: 'flex', gap: '12px' }}>
// // //             <FieldDropdown label="Zone" displayValue={form.zoneName}
// // //               onSelect={opt => setForm(p => ({ ...p, zoneId: opt.value, zoneName: opt.label }))} options={zoneOptions} />
// // //             <FieldDropdown label="Employee" displayValue={form.employeeName}
// // //               onSelect={opt => setForm(p => ({ ...p, userId: opt.value, employeeName: opt.label }))} options={userOptions} />
// // //           </div>

// // //           <div style={{ display: 'flex', gap: '12px' }}>
// // //             <FieldDropdown label="Patrol Type" displayValue={form.patrolTypeName}
// // //               onSelect={opt => setForm(p => ({ ...p, patrolTypeId: opt.value, patrolTypeName: opt.label }))} options={patrolTypeOptions} />
// // //             <FieldDropdown label="Trip" displayValue={form.tripName}
// // //               onSelect={opt => setForm(p => ({ ...p, tripId: opt.value, tripName: opt.label }))} options={tripOptions} />
// // //           </div>

// // //           <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
// // //             <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}
// // //               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
// // //             <input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)}
// // //               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
// // //             <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
// // //             <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)}
// // //               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
// // //             <input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)}
// // //               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
// // //             <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
// // //           </div>

// // //           <div style={{ display: 'flex', gap: '12px' }}>
// // //             <button onClick={() => set('ordered', true)}
// // //               style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '4px', background: form.ordered ? '#1a73e8' : '#f8f9fa', color: form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// // //               Order
// // //             </button>
// // //             <button onClick={() => set('ordered', false)}
// // //               style={{ flex: 1, padding: '10px', border: '1px solid #dadce0', borderRadius: '4px', background: !form.ordered ? '#1a73e8' : 'transparent', color: !form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// // //               Unorder
// // //             </button>
// // //           </div>

// // //           <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #e8eaed', flexWrap: 'wrap' }}>
// // //             <span style={{ fontSize: '13px', fontWeight: 500, color: '#202124', flexShrink: 0, minWidth: '48px' }}>Round</span>
// // //             <input type="number" min="0" placeholder="Minimum Round"
// // //               value={form.minRound} onChange={e => set('minRound', e.target.value)}
// // //               style={inp} />
// // //             <input type="number" min="0" placeholder="Maximum Round"
// // //               value={form.maxRound} onChange={e => set('maxRound', e.target.value)}
// // //               style={inp} />
// // //           </div>

// // //           <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
// // //             <span style={{ fontSize: '13px', fontWeight: 500, color: '#202124', flexShrink: 0, minWidth: '48px' }}>Cyclic</span>
// // //             <input type="number" min="0" placeholder="Restart Time (mins)"
// // //               value={form.delay_mins} onChange={e => set('delay_mins', e.target.value)}
// // //               style={inp} />
// // //             <input type="date" placeholder="Expiry Date"
// // //               value={form.expiredDate} onChange={e => set('expiredDate', e.target.value)}
// // //               style={inp} />
// // //           </div>
// // //         </div>

// // //         {formError && (
// // //           <div style={{ color: '#d93025', fontSize: '12px', paddingTop: '8px' }}>⚠ {formError}</div>
// // //         )}

// // //         <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', gap: '8px' }}>
// // //           {sel && (
// // //             <button onClick={() => { setForm(blank); setSel(null) }}
// // //               style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '4px', background: '#f8f9fa', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// // //               Cancel
// // //             </button>
// // //           )}
// // //           <button onClick={handleSaveClick}
// // //             style={{ padding: '10px 32px', border: 'none', borderRadius: '4px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// // //             Save
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* ═══ RIGHT PANEL ═══ */}
// // //       <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

// // //         {/* Right header */}
// // //         <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
// // //           {selectMode ? (
// // //             <>
// // //               <div onClick={() => {
// // //                 if (selectedIds.length === saved.length) setSelectedIds([])
// // //                 else setSelectedIds(saved.map(s => s.id))
// // //               }}
// // //                 style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
// // //                 {selectedIds.length === saved.length
// // //                   ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
// // //                   : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
// // //               </div>
// // //               <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
// // //                 {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Schedule'}
// // //               </h2>
// // //               <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
// // //                 <button onClick={deleteSelected} disabled={selectedIds.length === 0}
// // //                   style={{ display: 'flex', alignItems: 'center', gap: '4px', background: selectedIds.length > 0 ? '#fce8e6' : '#f5f5f5', border: 'none', color: selectedIds.length > 0 ? '#d93025' : '#bbb', fontSize: '12px', fontWeight: 600, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', padding: '5px 10px', borderRadius: '4px' }}>
// // //                   🗑 Delete
// // //                 </button>
// // //                 <button onClick={cancelSelect} style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: '12px', cursor: 'pointer', padding: '5px 8px' }}>✕ Cancel</button>
// // //               </div>
// // //             </>
// // //           ) : (
// // //             <>
// // //               {showSaved && (
// // //                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
// // //                   <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0 }}>Saved Schedule</h2>
// // //                   {saved.length > 0 && (
// // //                     <span style={{ background: '#e8f0fe', color: '#1a73e8', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>{saved.length}</span>
// // //                   )}
// // //                 </div>
// // //               )}
// // //               <button onClick={() => setShowSaved(v => !v)}
// // //                 style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
// // //                 {showSaved ? '⊏' : '⊐'}
// // //               </button>
// // //             </>
// // //           )}
// // //         </div>

// // //         {showSaved && (
// // //           <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
// // //             {loadingPanel && (
// // //               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '24px' }}>Loading…</div>
// // //             )}

// // //             {!loadingPanel && saved.map((s, idx) => (
// // //               <ScheduleCard
// // //                 key={s.id}
// // //                 s={s}
// // //                 idx={idx}
// // //                 isChecked={selectedIds.includes(s.id)}
// // //                 selectMode={selectMode}
// // //                 onToggleSelect={toggleSelect}
// // //                 onSelect={enterSelectMode}
// // //                 onClone={handleClone}
// // //                 onEdit={handleEdit}
// // //                 onDelete={handleDelete}
// // //               />
// // //             ))}

// // //             {!loadingPanel && saved.length === 0 && (
// // //               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No schedules saved yet.</div>
// // //             )}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // import { useState, useEffect, useRef } from 'react'
// // import {
// //   getSchedules,
// //   createSchedule,
// //   deleteSchedule,
// //   updateSchedule,
// //   getZoneFilter,
// //   getUserList,
// //   listTrips,
// //   filterPatrolTypes,
// // } from '../../../api'
// // import { ConfirmSaveModal } from '../components/MasterFormUI'

// // /* ── Custom 3-dot menu ── */
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
// //       <button
// //         onClick={() => setOpen((o) => !o)}
// //         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontSize: '20px', color: '#5f6368', lineHeight: 1, borderRadius: '4px' }}
// //       >⋮</button>
// //       {open && (
// //         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
// //           {items.map(({ label, icon, color, action }) => (
// //             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
// //               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
// //               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
// //               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
// //             >
// //               <span style={{ fontSize: '14px' }}>{icon}</span> {label}
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // /* ── blank form ── */
// // const blank = {
// //   zoneId: '', zoneName: '',
// //   userId: '', employeeName: '',
// //   patrolTypeId: '', patrolTypeName: '',
// //   tripId: '', tripName: '',
// //   startDate: '', startTime: '',
// //   endDate: '', endTime: '',
// //   ordered: true,
// //   minRound: '', maxRound: '',
// //   delay_mins: '', expiredDate: '',
// // }

// // /* ── Custom searchable dropdown ── */
// // function FieldDropdown({ label, displayValue, onSelect, options }) {
// //   const [open, setOpen] = useState(false)
// //   const [search, setSearch] = useState('')
// //   const ref = useRef(null)
// //   useEffect(() => {
// //     const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
// //     document.addEventListener('mousedown', handler)
// //     return () => document.removeEventListener('mousedown', handler)
// //   }, [])
// //   const filtered = options.filter(opt => (opt.label || '').toLowerCase().includes(search.toLowerCase()))
// //   return (
// //     <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
// //       {label && <label style={{ fontSize: '11px', fontWeight: 500, color: '#5f6368' }}>{label}</label>}
// //       <div ref={ref} style={{ position: 'relative' }}>
// //         <div style={{ display: 'flex' }}>
// //           <input type="text" placeholder={label}
// //             value={open ? search : (displayValue || '')}
// //             onChange={(e) => { setSearch(e.target.value); setOpen(true) }}
// //             onFocus={() => { setSearch(''); setOpen(true) }}
// //             style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '4px 0 0 4px', fontSize: '13px', color: '#202124', outline: 'none', height: '38px', boxSizing: 'border-box' }}
// //           />
// //           <button type="button" onClick={() => { setSearch(''); setOpen((o) => !o) }}
// //             style={{ width: '38px', height: '38px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 4px 4px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
// //           >+</button>
// //         </div>
// //         {open && (
// //           <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
// //             {filtered.length === 0
// //               ? <div style={{ padding: '8px 12px', fontSize: '13px', color: '#9aa0a6' }}>No options</div>
// //               : filtered.map((opt) => (
// //                 <div key={opt.value} onMouseDown={() => { onSelect(opt); setSearch(''); setOpen(false) }}
// //                   style={{ padding: '8px 12px', fontSize: '13px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
// //                   onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
// //                   onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
// //                 >{opt.label}</div>
// //               ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // /* ── helpers ── */
// // function formatDateTime(date, time) {
// //   if (!date) return ''
// //   return `${date} ${time ? time + ':00' : '00:00:00'}`
// // }
// // function naVal(v) {
// //   if (v == null || v === 'N/A' || v === '') return null
// //   return v
// // }
// // function safeStr(v, fallback = '') {
// //   if (v == null || v === 'N/A') return fallback
// //   return String(v)
// // }
// // function extractRecords(raw) {
// //   if (Array.isArray(raw?.data?.records)) return raw.data.records
// //   if (Array.isArray(raw?.records))       return raw.records
// //   if (Array.isArray(raw))                return raw
// //   return []
// // }

// // /* ── Avatar color palette ── */
// // const avatarColors = [
// //   { bg: '#e8f0fe', text: '#1a73e8' },
// //   { bg: '#fce8e6', text: '#d93025' },
// //   { bg: '#e6f4ea', text: '#1e8e3e' },
// //   { bg: '#fef7e0', text: '#f29900' },
// //   { bg: '#f3e8fd', text: '#9334e6' },
// //   { bg: '#e8f5e9', text: '#388e3c' },
// //   { bg: '#fff3e0', text: '#e65100' },
// //   { bg: '#e3f2fd', text: '#1565c0' },
// // ]

// // /* ── Schedule Card ── */
// // function ScheduleCard({ s, idx, isChecked, selectMode, onToggleSelect, onSelect, onClone, onEdit, onDelete }) {
// //   const isOrdered  = Number(s.is_order) === 1
// //   const isRound    = Number(s.is_round) === 1
// //   const isCyclic   = naVal(s.delay_mins) != null
// //   const avatarClr  = avatarColors[idx % avatarColors.length]
// //   const userName   = safeStr(s.user, '—')
// //   const tripName   = safeStr(s.trip_name) || `Trip #${s.trip_id ?? ''}`
// //   const tripType   = naVal(s.trip_type) ? safeStr(s.trip_type) : null
// //   const minRound   = naVal(s.min_round)
// //   const maxRound   = naVal(s.max_round)
// //   const delayMins  = naVal(s.delay_mins)
// //   const expiredAt  = naVal(s.expired_at)
// //   const startDate  = safeStr(s.start_date)
// //   const startTime  = safeStr(s.start_time)
// //   const endTime    = safeStr(s.end_time)
// //   const avatarChar = userName.charAt(0).toUpperCase() || '?'
// //   const zone       = (() => {
// //     if (Array.isArray(s.zone)) return s.zone.filter(Boolean).join(', ') || null
// //     return naVal(s.zone) ? String(s.zone) : null
// //   })()

// //   /* Format "10:00 AM to 4:00 PM" style time range */
// //   const timeRange = (startTime && endTime) ? `${startTime} — ${endTime}` : (startTime || endTime || '')

// //   return (
// //     <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
// //       {selectMode && (
// //         <div onClick={() => onToggleSelect(s.id)}
// //           style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
// //           {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
// //         </div>
// //       )}

// //       <div style={{
// //         flex: 1, minWidth: 0,
// //         border: `1.5px solid ${isChecked ? '#1a73e8' : '#e8eaed'}`,
// //         borderRadius: '14px',
// //         background: '#fff',
// //         boxShadow: '0 1px 4px rgba(60,64,67,0.08)',
// //         overflow: 'hidden',
// //       }}>

// //         {/* ── Top time/order bar ── */}
// //         <div style={{
// //           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
// //           padding: '8px 14px',
// //           background: '#fff',
// //           borderBottom: '1px solid #e8eaed',
// //           gap: '6px',
// //         }}>
// //           {/* Left: time range + Order/Unorder badge */}
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minWidth: 0, flex: 1 }}>
// //             {timeRange && (
// //               <span style={{ fontSize: '12px', fontWeight: 600, color: '#3c4043' }}>{timeRange}</span>
// //             )}
// //             <span style={{
// //               display: 'inline-flex', alignItems: 'center',
// //               background: '#1e8e3e',
// //               color: '#fff', borderRadius: '5px', padding: '2px 9px', fontSize: '10px', fontWeight: 700,
// //               whiteSpace: 'nowrap',
// //             }}>
// //               {isOrdered ? 'Order' : 'Unorder'}
// //             </span>
// //             {isRound && (
// //               <span style={{ background: '#e8f0fe', color: '#1a73e8', borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, border: '1px solid #c5d8fa', whiteSpace: 'nowrap' }}>
// //                 🔁 Round
// //               </span>
// //             )}
// //             {isCyclic && (
// //               <span style={{ background: '#f3e8fd', color: '#9334e6', borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, border: '1px solid #e1c4fa', whiteSpace: 'nowrap' }}>
// //                 🔄 Cyclic
// //               </span>
// //             )}
// //           </div>

// //           {/* Right: start date text + 3-dot menu */}
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
// //             {startDate && (
// //               <span style={{ fontSize: '11px', color: '#5f6368', whiteSpace: 'nowrap' }}>
// //                 Start at {startDate}
// //               </span>
// //             )}
// //             <CardMenu
// //               onSelect={() => onSelect(s.id)}
// //               onClone={() => onClone(s)}
// //               onEdit={() => onEdit(s)}
// //               onDelete={() => onDelete(s.id)}
// //             />
// //           </div>
// //         </div>

// //         {/* ── User row ── */}
// //         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px 6px' }}>
// //           <div style={{
// //             width: '34px', height: '34px', borderRadius: '50%',
// //             background: avatarClr.bg, color: avatarClr.text,
// //             display: 'flex', alignItems: 'center', justifyContent: 'center',
// //             fontSize: '13px', fontWeight: 700, flexShrink: 0,
// //           }}>
// //             {avatarChar}
// //           </div>
// //           <div style={{ minWidth: 0 }}>
// //             <div style={{ fontSize: '14px', fontWeight: 700, color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
// //             <div style={{ fontSize: '11px', color: '#5f6368' }}>{tripType || 'Trip type'}</div>
// //           </div>
// //         </div>

// //         {/* ── Pills row: trip name, rounds, expiry, delay, zone ── */}
// //         <div style={{ padding: '4px 14px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
// //           {/* Trip name pill */}
// //           <span style={{ background: '#f8f9fa', border: '1px solid #dadce0', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#3c4043', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
// //             {tripName}
// //           </span>
// //           {(minRound != null || maxRound != null) && (
// //             <span style={{ background: '#f0f4ff', border: '1px solid #c5d8fa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#1a73e8', fontWeight: 600, whiteSpace: 'nowrap' }}>
// //               Rounds: {minRound ?? '—'}{maxRound != null ? ` – ${maxRound}` : ''}
// //             </span>
// //           )}
// //           {expiredAt && (
// //             <span style={{ background: '#fff8f0', border: '1px solid #ffcc80', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#e65100', fontWeight: 600, whiteSpace: 'nowrap' }}>
// //               Exp: {expiredAt}
// //             </span>
// //           )}
// //           {delayMins != null && (
// //             <span style={{ background: '#f3e8fd', border: '1px solid #e1c4fa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#9334e6', fontWeight: 600, whiteSpace: 'nowrap' }}>
// //               ⏱ {delayMins} min
// //             </span>
// //           )}
// //           {zone && (
// //             <span style={{ background: '#e6f4ea', border: '1px solid #b7e1c8', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#1e8e3e', fontWeight: 600, whiteSpace: 'nowrap' }}>
// //               📍 {zone}
// //             </span>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default function ScheduleForm() {
// //   const [form, setForm]               = useState(blank)
// //   const [saved, setSaved]             = useState([])
// //   const [busy, setBusy]               = useState(false)
// //   const [sel, setSel]                 = useState(null)
// //   const [confirm, setConfirm]         = useState(false)
// //   const [showSaved, setShowSaved]     = useState(true)
// //   const [selectMode, setSelectMode]   = useState(false)
// //   const [selectedIds, setSelectedIds] = useState([])
// //   const [loadingPanel, setLoadingPanel] = useState(false)
// //   const [formError, setFormError]     = useState('')

// //   const [zoneOptions, setZoneOptions]             = useState([])
// //   const [userOptions, setUserOptions]             = useState([])
// //   const [patrolTypeOptions, setPatrolTypeOptions] = useState([])
// //   const [tripOptions, setTripOptions]             = useState([])

// //   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
// //   const toggleSelect    = (id) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
// //   const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
// //   const deleteSelected  = async () => {
// //     for (const id of selectedIds) { try { await deleteSchedule(id) } catch {} }
// //     setSaved(p => p.filter(s => !selectedIds.includes(s.id)))
// //     setSelectMode(false); setSelectedIds([])
// //   }

// //   const loadSaved = async () => {
// //     setLoadingPanel(true)
// //     try {
// //       const raw = await getSchedules()
// //       setSaved(Array.isArray(raw) ? raw: [])
// //     } catch {
// //       setSaved([])
// //     } finally {
// //       setLoadingPanel(false)
// //     }
// //   }

// //   useEffect(() => {
// //     loadSaved()

// //     getZoneFilter().then(records => {
// //       setZoneOptions(records.map(r => ({
// //         value: String(r.value ?? r.id ?? ''),
// //         label: String(r.label || r.name || r.zoneName || r.zoneNameLong || r.l_name || ''),
// //       })).filter(o => o.value && o.label))
// //     }).catch(() => {})

// //     getUserList().then(users => {
// //       const opts = users.map(u => ({
// //         value: String(u.id ?? ''),
// //         label: String(u.userName || u.userid || ''),
// //       })).filter(o => o.value && o.label)
// //       setUserOptions([{ value: 'all', label: 'All' }, ...opts])
// //     }).catch(() => {})

// //     filterPatrolTypes('all').then(types => {
// //       setPatrolTypeOptions(types.map(t => ({
// //         value: String(t.id ?? ''),
// //         label: String(t.patrolName || ''),
// //       })).filter(o => o.value && o.label))
// //     }).catch(() => {})

// //     listTrips().then(list => {
// //       setTripOptions(list.map(t => ({
// //         value: String(t.id ?? t.value ?? ''),
// //         label: String(t.lable || t.label || t.tripName || t.name || t.trip_name || ''),
// //       })).filter(o => o.value && o.label))
// //     }).catch(() => {})
// //   }, [])

// //   useEffect(() => {
// //     if (typeof window === 'undefined') return
// //     const onZones = () => getZoneFilter().then(records => {
// //       setZoneOptions(records.map(r => ({ value: String(r.value ?? r.id ?? ''), label: String(r.label || r.name || r.zoneName || '') })).filter(o => o.value && o.label))
// //     }).catch(() => {})
// //     const onTrips = () => listTrips().then(list => {
// //       setTripOptions(list.map(t => ({ value: String(t.id ?? t.value ?? ''), label: String(t.lable || t.label || t.tripName || t.name || '') })).filter(o => o.value && o.label))
// //     }).catch(() => {})
// //     window.addEventListener('zones-updated', onZones)
// //     window.addEventListener('trips-updated', onTrips)
// //     return () => { window.removeEventListener('zones-updated', onZones); window.removeEventListener('trips-updated', onTrips) }
// //   }, [])

// //   const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

// //   function buildPayload(f) {
// //     const roundUsed  = !!f.minRound
// //     const cyclicUsed = !!f.delay_mins
// //     const payload = {
// //       zone:            f.zoneId       ? [String(f.zoneId)]       : [],
// //       user:            (!f.userId || f.userId === 'all') ? ['all'] : [String(f.userId)],
// //       patrol_type:     f.patrolTypeId ? [String(f.patrolTypeId)] : [],
// //       trip:            Number(f.tripId) || 0,
// //       start_date_time: formatDateTime(f.startDate, f.startTime),
// //       end_date_time:   formatDateTime(f.endDate,   f.endTime),
// //       order:           f.ordered ? 1 : 0,
// //     }
// //     if (roundUsed) {
// //       payload.is_round  = 1
// //       payload.min_round = Number(f.minRound)
// //       payload.max_round = f.maxRound ? Number(f.maxRound) : null
// //     }
// //     if (cyclicUsed) {
// //       payload.is_cyclic    = 1
// //       payload.delay_mins   = Number(f.delay_mins)
// //       payload.expired_date = f.expiredDate
// //         ? `${f.expiredDate} 00:00:00`
// //         : formatDateTime(f.endDate, f.endTime)
// //     }
// //     return payload
// //   }

// //   function apiRecordToForm(s) {
// //     const userId  = s.user_id != null ? String(s.user_id) : ''
// //     const userOpt = userOptions.find(o => String(o.value) === userId)
// //     const tripOpt = tripOptions.find(o => String(o.value) === String(s.trip_id ?? ''))
// //     const zoneId  = Array.isArray(s.zone) ? (s.zone[0] || '') : (s.zone ? String(s.zone) : '')
// //     const zoneOpt = zoneOptions.find(o => String(o.value) === String(zoneId))
// //     const ptId    = s.patrol_type_id ? String(s.patrol_type_id) : ''
// //     const ptOpt   = patrolTypeOptions.find(o => String(o.value) === ptId)
// //     return {
// //       zoneId,         zoneName:       zoneOpt?.label        || zoneId,
// //       userId,         employeeName:   userOpt?.label        || safeStr(s.user),
// //       patrolTypeId:   ptId,
// //       patrolTypeName: ptOpt?.label   || safeStr(s.trip_type),
// //       tripId:         s.trip_id != null ? String(s.trip_id) : '',
// //       tripName:       tripOpt?.label || safeStr(s.trip_name),
// //       startDate:      safeStr(s.start_date),
// //       startTime:      safeStr(s.start_time).replace(/ (AM|PM)$/i, ''),
// //       endDate:        safeStr(s.start_date),
// //       endTime:        safeStr(s.end_time).replace(/ (AM|PM)$/i, ''),
// //       ordered:        Number(s.is_order) !== 0,
// //       minRound:       naVal(s.min_round)  != null ? String(s.min_round)  : '',
// //       maxRound:       naVal(s.max_round)  != null ? String(s.max_round)  : '',
// //       delay_mins:     naVal(s.delay_mins) != null ? String(s.delay_mins) : '',
// //       expiredDate:    safeStr(s.expired_at),
// //     }
// //   }

// //   const handleClone = (item) => { setForm(apiRecordToForm(item)); setSel(null) }
// //   const handleEdit  = (item) => { setForm(apiRecordToForm(item)); setSel(item.id) }

// //   const handleSaveClick = () => {
// //     setFormError('')
// //     const f = form
// //     if (!f.tripId)    return setFormError('Please select a Trip.')
// //     if (!f.startDate) return setFormError('Please set a Start Date.')
// //     if (!f.startTime) return setFormError('Please set a Start Time.')
// //     if (!f.endDate)   return setFormError('Please set an End Date.')
// //     if (!f.endTime)   return setFormError('Please set an End Time.')
// //     const roundTouched  = !!(f.minRound  || f.maxRound)
// //     const cyclicTouched = !!(f.delay_mins || f.expiredDate)
// //     if (!roundTouched && !cyclicTouched) {
// //       return setFormError('Please fill in Round or Cyclic details (or both) before saving.')
// //     }
// //     if (f.maxRound && !f.minRound) {
// //       return setFormError('You entered a Maximum Round — please also enter Minimum Round.')
// //     }
// //     if (f.delay_mins && !f.expiredDate) {
// //       return setFormError('You entered a Restart Time — please also enter the Expiry Date.')
// //     }
// //     if (f.expiredDate && !f.delay_mins) {
// //       return setFormError('You entered an Expiry Date — please also enter the Restart Time.')
// //     }
// //     setConfirm(true)
// //   }

// //   const handleConfirmed = async () => {
// //     setBusy(true)
// //     const payload = buildPayload(form)
// //     try {
// //       if (sel) {
// //         await updateSchedule(sel, payload)
// //         await loadSaved()
// //         setSel(null); setForm(blank)
// //       } else {
// //         await createSchedule(payload)
// //         await loadSaved()
// //         setForm(blank)
// //       }
// //     } catch (err) {
// //       console.error('[ScheduleForm] save error:', err)
// //       if (sel) { setSaved(p => p.map(s => s.id === sel ? { ...s, ...payload, id: sel } : s)); setSel(null); setForm(blank) }
// //     }
// //     setBusy(false); setConfirm(false)
// //   }

// //   const handleDelete = async (id) => {
// //     try { await deleteSchedule(id) } catch {}
// //     setSaved(p => p.filter(s => s.id !== id))
// //     if (sel === id) { setForm(blank); setSel(null) }
// //   }

// //   const summary = [
// //     { label: 'Zone',         value: form.zoneName       },
// //     { label: 'Employee',     value: form.employeeName   },
// //     { label: 'Patrol Type',  value: form.patrolTypeName },
// //     { label: 'Trip',         value: form.tripName       },
// //     { label: 'Start',        value: `${form.startDate} ${form.startTime}` },
// //     { label: 'End',          value: `${form.endDate} ${form.endTime}`     },
// //     { label: 'Order',        value: form.ordered ? 'ORDER' : 'UNORDER'   },
// //     ...(form.minRound    ? [{ label: 'Min Round',    value: form.minRound }]             : []),
// //     ...(form.maxRound    ? [{ label: 'Max Round',    value: form.maxRound }]             : []),
// //     ...(form.delay_mins  ? [{ label: 'Restart Time', value: `${form.delay_mins} mins` }] : []),
// //     ...(form.expiredDate ? [{ label: 'Expiry Date',  value: form.expiredDate }]          : []),
// //   ]

// //   const inp = {
// //     padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px',
// //     fontSize: '12px', outline: 'none', flex: 1, minWidth: '120px', boxSizing: 'border-box',
// //   }

// //   return (
// //     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
// //       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

// //       {/* ═══ LEFT PANEL ═══ */}
// //       <div style={{ flex: '0 0 55%', width: '55%', maxWidth: '55%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '20px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
// //         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0 }}>
// //           {sel ? 'Edit Schedule' : 'Create Schedule'}
// //         </h2>

// //         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>

// //           <div style={{ display: 'flex', gap: '12px' }}>
// //             <FieldDropdown label="Zone" displayValue={form.zoneName}
// //               onSelect={opt => setForm(p => ({ ...p, zoneId: opt.value, zoneName: opt.label }))} options={zoneOptions} />
// //             <FieldDropdown label="Employee" displayValue={form.employeeName}
// //               onSelect={opt => setForm(p => ({ ...p, userId: opt.value, employeeName: opt.label }))} options={userOptions} />
// //           </div>

// //           <div style={{ display: 'flex', gap: '12px' }}>
// //             <FieldDropdown label="Patrol Type" displayValue={form.patrolTypeName}
// //               onSelect={opt => setForm(p => ({ ...p, patrolTypeId: opt.value, patrolTypeName: opt.label }))} options={patrolTypeOptions} />
// //             <FieldDropdown label="Trip" displayValue={form.tripName}
// //               onSelect={opt => setForm(p => ({ ...p, tripId: opt.value, tripName: opt.label }))} options={tripOptions} />
// //           </div>

// //           <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
// //             <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}
// //               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
// //             <input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)}
// //               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
// //             <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
// //             <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)}
// //               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
// //             <input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)}
// //               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
// //             <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
// //           </div>

// //           <div style={{ display: 'flex', gap: '12px' }}>
// //             <button onClick={() => set('ordered', true)}
// //               style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '4px', background: form.ordered ? '#1a73e8' : '#f8f9fa', color: form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// //               Order
// //             </button>
// //             <button onClick={() => set('ordered', false)}
// //               style={{ flex: 1, padding: '10px', border: '1px solid #dadce0', borderRadius: '4px', background: !form.ordered ? '#1a73e8' : 'transparent', color: !form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// //               Unorder
// //             </button>
// //           </div>

// //           <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #e8eaed', flexWrap: 'wrap' }}>
// //             <span style={{ fontSize: '13px', fontWeight: 500, color: '#202124', flexShrink: 0, minWidth: '48px' }}>Round</span>
// //             <input type="number" min="0" placeholder="Minimum Round"
// //               value={form.minRound} onChange={e => set('minRound', e.target.value)}
// //               style={inp} />
// //             <input type="number" min="0" placeholder="Maximum Round"
// //               value={form.maxRound} onChange={e => set('maxRound', e.target.value)}
// //               style={inp} />
// //           </div>

// //           <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
// //             <span style={{ fontSize: '13px', fontWeight: 500, color: '#202124', flexShrink: 0, minWidth: '48px' }}>Cyclic</span>
// //             <input type="number" min="0" placeholder="Restart Time (mins)"
// //               value={form.delay_mins} onChange={e => set('delay_mins', e.target.value)}
// //               style={inp} />
// //             <input type="date" placeholder="Expiry Date"
// //               value={form.expiredDate} onChange={e => set('expiredDate', e.target.value)}
// //               style={inp} />
// //           </div>
// //         </div>

// //         {formError && (
// //           <div style={{ color: '#d93025', fontSize: '12px', paddingTop: '8px' }}>⚠ {formError}</div>
// //         )}

// //         <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', gap: '8px' }}>
// //           {sel && (
// //             <button onClick={() => { setForm(blank); setSel(null) }}
// //               style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '4px', background: '#f8f9fa', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// //               Cancel
// //             </button>
// //           )}
// //           <button onClick={handleSaveClick}
// //             style={{ padding: '10px 32px', border: 'none', borderRadius: '4px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// //             Save
// //           </button>
// //         </div>
// //       </div>

// //       {/* ═══ RIGHT PANEL ═══ */}
// //       <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

// //         {/* Right header */}
// //         <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
// //           {selectMode ? (
// //             <>
// //               <div onClick={() => {
// //                 if (selectedIds.length === saved.length) setSelectedIds([])
// //                 else setSelectedIds(saved.map(s => s.id))
// //               }}
// //                 style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
// //                 {selectedIds.length === saved.length
// //                   ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
// //                   : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
// //               </div>
// //               <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
// //                 {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Schedule'}
// //               </h2>
// //               <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
// //                 <button onClick={deleteSelected} disabled={selectedIds.length === 0}
// //                   style={{ display: 'flex', alignItems: 'center', gap: '4px', background: selectedIds.length > 0 ? '#fce8e6' : '#f5f5f5', border: 'none', color: selectedIds.length > 0 ? '#d93025' : '#bbb', fontSize: '12px', fontWeight: 600, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', padding: '5px 10px', borderRadius: '4px' }}>
// //                   🗑 Delete
// //                 </button>
// //                 <button onClick={cancelSelect} style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: '12px', cursor: 'pointer', padding: '5px 8px' }}>✕ Cancel</button>
// //               </div>
// //             </>
// //           ) : (
// //             <>
// //               {showSaved && (
// //                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
// //                   <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0 }}>Saved Schedule</h2>
// //                   {saved.length > 0 && (
// //                     <span style={{ background: '#e8f0fe', color: '#1a73e8', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>{saved.length}</span>
// //                   )}
// //                 </div>
// //               )}
// //               <button onClick={() => setShowSaved(v => !v)}
// //                 style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
// //                 {showSaved ? '⊏' : '⊐'}
// //               </button>
// //             </>
// //           )}
// //         </div>

// //         {showSaved && (
// //           <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
// //             {loadingPanel && (
// //               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '24px' }}>Loading…</div>
// //             )}

// //             {!loadingPanel && saved.map((s, idx) => (
// //               <ScheduleCard
// //                 key={s.id}
// //                 s={s}
// //                 idx={idx}
// //                 isChecked={selectedIds.includes(s.id)}
// //                 selectMode={selectMode}
// //                 onToggleSelect={toggleSelect}
// //                 onSelect={enterSelectMode}
// //                 onClone={handleClone}
// //                 onEdit={handleEdit}
// //                 onDelete={handleDelete}
// //               />
// //             ))}

// //             {!loadingPanel && saved.length === 0 && (
// //               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No schedules saved yet.</div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // import { useState, useEffect, useRef } from 'react'
// // import {
// //   getSchedules,
// //   createSchedule,
// //   deleteSchedule,
// //   updateSchedule,
// //   getZoneFilter,
// //   getUserList,
// //   listTrips,
// //   filterPatrolTypes,
// // } from '../../../api'
// // import { ConfirmSaveModal } from '../components/MasterFormUI'

// // /* ── Custom 3-dot menu ── */
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
// //       <button
// //         onClick={() => setOpen((o) => !o)}
// //         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontSize: '20px', color: '#5f6368', lineHeight: 1, borderRadius: '4px' }}
// //       >⋮</button>
// //       {open && (
// //         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
// //           {items.map(({ label, icon, color, action }) => (
// //             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
// //               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
// //               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
// //               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
// //             >
// //               <span style={{ fontSize: '14px' }}>{icon}</span> {label}
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // /* ── blank form ── */
// // const blank = {
// //   zoneId: '', zoneName: '',
// //   userId: '', employeeName: '',
// //   patrolTypeId: '', patrolTypeName: '',
// //   tripId: '', tripName: '',
// //   startDate: '', startTime: '',
// //   endDate: '', endTime: '',
// //   ordered: true,
// //   minRound: '', maxRound: '',
// //   delay_mins: '', expiredDate: '',
// // }

// // /* ── Custom searchable dropdown ── */
// // function FieldDropdown({ label, displayValue, onSelect, options }) {
// //   const [open, setOpen] = useState(false)
// //   const [search, setSearch] = useState('')
// //   const ref = useRef(null)
// //   useEffect(() => {
// //     const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
// //     document.addEventListener('mousedown', handler)
// //     return () => document.removeEventListener('mousedown', handler)
// //   }, [])
// //   const filtered = options.filter(opt => (opt.label || '').toLowerCase().includes(search.toLowerCase()))
// //   return (
// //     <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
// //       {label && <label style={{ fontSize: '11px', fontWeight: 500, color: '#5f6368' }}>{label}</label>}
// //       <div ref={ref} style={{ position: 'relative' }}>
// //         <div style={{ display: 'flex' }}>
// //           <input type="text" placeholder={label}
// //             value={open ? search : (displayValue || '')}
// //             onChange={(e) => { setSearch(e.target.value); setOpen(true) }}
// //             onFocus={() => { setSearch(''); setOpen(true) }}
// //             style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '4px 0 0 4px', fontSize: '13px', color: '#202124', outline: 'none', height: '38px', boxSizing: 'border-box' }}
// //           />
// //           <button type="button" onClick={() => { setSearch(''); setOpen((o) => !o) }}
// //             style={{ width: '38px', height: '38px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 4px 4px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
// //           >+</button>
// //         </div>
// //         {open && (
// //           <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
// //             {filtered.length === 0
// //               ? <div style={{ padding: '8px 12px', fontSize: '13px', color: '#9aa0a6' }}>No options</div>
// //               : filtered.map((opt) => (
// //                 <div key={opt.value} onMouseDown={() => { onSelect(opt); setSearch(''); setOpen(false) }}
// //                   style={{ padding: '8px 12px', fontSize: '13px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
// //                   onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
// //                   onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
// //                 >{opt.label}</div>
// //               ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // /* ── helpers ── */
// // function formatDateTime(date, time) {
// //   if (!date) return ''
// //   return `${date} ${time ? time + ':00' : '00:00:00'}`
// // }
// // function naVal(v) {
// //   if (v == null || v === 'N/A' || v === '') return null
// //   return v
// // }
// // function safeStr(v, fallback = '') {
// //   if (v == null || v === 'N/A') return fallback
// //   return String(v)
// // }
// // function extractRecords(raw) {
// //   if (Array.isArray(raw?.data?.records)) return raw.data.records
// //   if (Array.isArray(raw?.records))       return raw.records
// //   if (Array.isArray(raw))                return raw
// //   return []
// // }

// // /* ── Avatar color palette ── */
// // const avatarColors = [
// //   { bg: '#e8f0fe', text: '#1a73e8' },
// //   { bg: '#fce8e6', text: '#d93025' },
// //   { bg: '#e6f4ea', text: '#1e8e3e' },
// //   { bg: '#fef7e0', text: '#f29900' },
// //   { bg: '#f3e8fd', text: '#9334e6' },
// //   { bg: '#e8f5e9', text: '#388e3c' },
// //   { bg: '#fff3e0', text: '#e65100' },
// //   { bg: '#e3f2fd', text: '#1565c0' },
// // ]

// // /* ── Schedule Card ── */
// // function ScheduleCard({ s, idx, isChecked, selectMode, onToggleSelect, onSelect, onClone, onEdit, onDelete }) {
// //   const isOrdered  = Number(s.is_order) === 1
// //   const isRound    = Number(s.is_round) === 1
// //   const isCyclic   = naVal(s.delay_mins) != null
// //   const avatarClr  = avatarColors[idx % avatarColors.length]
// //   const userName   = safeStr(s.user, '—')
// //   const tripName   = safeStr(s.trip_name) || `Trip #${s.trip_id ?? ''}`
// //   const tripType   = naVal(s.trip_type) ? safeStr(s.trip_type) : null
// //   const minRound   = naVal(s.min_round)
// //   const maxRound   = naVal(s.max_round)
// //   const delayMins  = naVal(s.delay_mins)
// //   const expiredAt  = naVal(s.expired_at)
// //   const startDate  = safeStr(s.start_date)
// //   const startTime  = safeStr(s.start_time)
// //   const endTime    = safeStr(s.end_time)
// //   const avatarChar = userName.charAt(0).toUpperCase() || '?'
// //   const zone       = (() => {
// //     if (Array.isArray(s.zone)) return s.zone.filter(Boolean).join(', ') || null
// //     return naVal(s.zone) ? String(s.zone) : null
// //   })()

// //   /* Format "10:00 AM to 4:00 PM" style time range */
// //   const timeRange = (startTime && endTime) ? `${startTime} — ${endTime}` : (startTime || endTime || '')

// //   return (
// //     <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
// //       {selectMode && (
// //         <div onClick={() => onToggleSelect(s.id)}
// //           style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
// //           {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
// //         </div>
// //       )}

// //       <div style={{
// //         flex: 1, minWidth: 0,
// //         border: `1.5px solid ${isChecked ? '#1a73e8' : '#e8eaed'}`,
// //         borderRadius: '14px',
// //         background: '#fff',
// //         boxShadow: '0 1px 4px rgba(60,64,67,0.08)',
// //         overflow: 'hidden',
// //       }}>

// //         {/* ── Top time/order bar ── */}
// //         <div style={{
// //           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
// //           padding: '8px 14px',
// //           background: isOrdered ? '#f0faf4' : '#fff8f0',
// //           borderBottom: `1px solid ${isOrdered ? '#d4edda' : '#ffe0b2'}`,
// //           flexWrap: 'wrap', gap: '6px',
// //         }}>
// //           {/* Left: time range + date */}
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minWidth: 0 }}>
// //             {timeRange && (
// //               <span style={{ fontSize: '12px', fontWeight: 600, color: '#3c4043' }}>{timeRange}</span>
// //             )}
// //             <span style={{
// //               display: 'inline-flex', alignItems: 'center', gap: '3px',
// //               background: isOrdered ? '#1e8e3e' : '#e65100',
// //               color: '#fff', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 700,
// //             }}>
// //               {isOrdered ? 'Order' : 'Unorder'}
// //             </span>
// //             {isRound && (
// //               <span style={{ background: '#e8f0fe', color: '#1a73e8', borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, border: '1px solid #c5d8fa' }}>
// //                 🔁 Round
// //               </span>
// //             )}
// //             {isCyclic && (
// //               <span style={{ background: '#f3e8fd', color: '#9334e6', borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, border: '1px solid #e1c4fa' }}>
// //                 🔄 Cyclic
// //               </span>
// //             )}
// //           </div>

// //           {/* Right: start date + menu */}
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
// //             <CardMenu
// //               onSelect={() => onSelect(s.id)}
// //               onClone={() => onClone(s)}
// //               onEdit={() => onEdit(s)}
// //               onDelete={() => onDelete(s.id)}
// //             />
// //           </div>
// //         </div>

// //         {/* ── User row ── */}
// //         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px 6px' }}>
// //           <div style={{
// //             width: '34px', height: '34px', borderRadius: '50%',
// //             background: avatarClr.bg, color: avatarClr.text,
// //             display: 'flex', alignItems: 'center', justifyContent: 'center',
// //             fontSize: '13px', fontWeight: 700, flexShrink: 0,
// //           }}>
// //             {avatarChar}
// //           </div>
// //           <div style={{ minWidth: 0 }}>
// //             <div style={{ fontSize: '14px', fontWeight: 700, color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
// //             {tripType && <div style={{ fontSize: '11px', color: '#5f6368' }}>{tripType}</div>}
// //           </div>
// //         </div>

// //         {/* ── Trip name ── */}
// //         <div style={{ padding: '2px 14px 8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
// //           <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a73e8' }}>🗺 {tripName}</span>
// //         </div>

// //         {/* ── Pills row: rounds, expiry, delay ── */}
// //         <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
// //           {(minRound != null || maxRound != null) && (
// //             <span style={{ background: '#f0f4ff', border: '1px solid #c5d8fa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#1a73e8', fontWeight: 600 }}>
// //               Rounds: {minRound ?? '—'}
// //               {maxRound != null ? ` – ${maxRound}` : ''}
// //             </span>
// //           )}
// //           {expiredAt && (
// //             <span style={{ background: '#fff8f0', border: '1px solid #ffcc80', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#e65100', fontWeight: 600 }}>
// //               Exp: {expiredAt}
// //             </span>
// //           )}
// //           {delayMins != null && (
// //             <span style={{ background: '#f3e8fd', border: '1px solid #e1c4fa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#9334e6', fontWeight: 600 }}>
// //               ⏱ Restart: {delayMins} min
// //             </span>
// //           )}
// //           {zone && (
// //             <span style={{ background: '#e6f4ea', border: '1px solid #b7e1c8', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#1e8e3e', fontWeight: 600 }}>
// //               📍 {zone}
// //             </span>
// //           )}
// //         </div>

// //         {/* ── Footer: created / updated ── */}
// //         {(s.created_at || naVal(s.updated_at)) && (
// //           <div style={{ padding: '6px 14px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
// //             {s.created_at && (
// //               <span style={{ fontSize: '10px', color: '#9aa0a6' }}>Created: {safeStr(s.created_at)}</span>
// //             )}
// //             {naVal(s.updated_at) && (
// //               <span style={{ fontSize: '10px', color: '#9aa0a6' }}>Updated: {safeStr(s.updated_at)}</span>
// //             )}
// //             {startDate && (
// //               <span style={{ fontSize: '11px', color: '#5f6368' }}>Start {startDate}</span>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // export default function ScheduleForm() {
// //   const [form, setForm]               = useState(blank)
// //   const [saved, setSaved]             = useState([])
// //   const [busy, setBusy]               = useState(false)
// //   const [sel, setSel]                 = useState(null)
// //   const [confirm, setConfirm]         = useState(false)
// //   const [showSaved, setShowSaved]     = useState(true)
// //   const [selectMode, setSelectMode]   = useState(false)
// //   const [selectedIds, setSelectedIds] = useState([])
// //   const [loadingPanel, setLoadingPanel] = useState(false)
// //   const [formError, setFormError]     = useState('')

// //   const [zoneOptions, setZoneOptions]             = useState([])
// //   const [userOptions, setUserOptions]             = useState([])
// //   const [patrolTypeOptions, setPatrolTypeOptions] = useState([])
// //   const [tripOptions, setTripOptions]             = useState([])

// //   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
// //   const toggleSelect    = (id) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
// //   const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
// //   const deleteSelected  = async () => {
// //     for (const id of selectedIds) { try { await deleteSchedule(id) } catch {} }
// //     setSaved(p => p.filter(s => !selectedIds.includes(s.id)))
// //     setSelectMode(false); setSelectedIds([])
// //   }

// //   const loadSaved = async () => {
// //     setLoadingPanel(true)
// //     try {
// //       const raw = await getSchedules()
// //       setSaved(Array.isArray(raw) ? raw: [])
// //     } catch {
// //       setSaved([])
// //     } finally {
// //       setLoadingPanel(false)
// //     }
// //   }

// //   useEffect(() => {
// //     loadSaved()

// //     getZoneFilter().then(records => {
// //       setZoneOptions(records.map(r => ({
// //         value: String(r.value ?? r.id ?? ''),
// //         label: String(r.label || r.name || r.zoneName || r.zoneNameLong || r.l_name || ''),
// //       })).filter(o => o.value && o.label))
// //     }).catch(() => {})

// //     getUserList().then(users => {
// //       const opts = users.map(u => ({
// //         value: String(u.id ?? ''),
// //         label: String(u.userName || u.userid || ''),
// //       })).filter(o => o.value && o.label)
// //       setUserOptions([{ value: 'all', label: 'All' }, ...opts])
// //     }).catch(() => {})

// //     filterPatrolTypes('all').then(types => {
// //       setPatrolTypeOptions(types.map(t => ({
// //         value: String(t.id ?? ''),
// //         label: String(t.patrolName || ''),
// //       })).filter(o => o.value && o.label))
// //     }).catch(() => {})

// //     listTrips().then(list => {
// //       setTripOptions(list.map(t => ({
// //         value: String(t.id ?? t.value ?? ''),
// //         label: String(t.lable || t.label || t.tripName || t.name || t.trip_name || ''),
// //       })).filter(o => o.value && o.label))
// //     }).catch(() => {})
// //   }, [])

// //   useEffect(() => {
// //     if (typeof window === 'undefined') return
// //     const onZones = () => getZoneFilter().then(records => {
// //       setZoneOptions(records.map(r => ({ value: String(r.value ?? r.id ?? ''), label: String(r.label || r.name || r.zoneName || '') })).filter(o => o.value && o.label))
// //     }).catch(() => {})
// //     const onTrips = () => listTrips().then(list => {
// //       setTripOptions(list.map(t => ({ value: String(t.id ?? t.value ?? ''), label: String(t.lable || t.label || t.tripName || t.name || '') })).filter(o => o.value && o.label))
// //     }).catch(() => {})
// //     window.addEventListener('zones-updated', onZones)
// //     window.addEventListener('trips-updated', onTrips)
// //     return () => { window.removeEventListener('zones-updated', onZones); window.removeEventListener('trips-updated', onTrips) }
// //   }, [])

// //   const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

// //   function buildPayload(f) {
// //     const roundUsed  = !!f.minRound
// //     const cyclicUsed = !!f.delay_mins
// //     const payload = {
// //       zone:            f.zoneId       ? [String(f.zoneId)]       : [],
// //       user:            (!f.userId || f.userId === 'all') ? ['all'] : [String(f.userId)],
// //       patrol_type:     f.patrolTypeId ? [String(f.patrolTypeId)] : [],
// //       trip:            Number(f.tripId) || 0,
// //       start_date_time: formatDateTime(f.startDate, f.startTime),
// //       end_date_time:   formatDateTime(f.endDate,   f.endTime),
// //       order:           f.ordered ? 1 : 0,
// //     }
// //     if (roundUsed) {
// //       payload.is_round  = 1
// //       payload.min_round = Number(f.minRound)
// //       payload.max_round = f.maxRound ? Number(f.maxRound) : null
// //     }
// //     if (cyclicUsed) {
// //       payload.is_cyclic    = 1
// //       payload.delay_mins   = Number(f.delay_mins)
// //       payload.expired_date = f.expiredDate
// //         ? `${f.expiredDate} 00:00:00`
// //         : formatDateTime(f.endDate, f.endTime)
// //     }
// //     return payload
// //   }

// //   function apiRecordToForm(s) {
// //     const userId  = s.user_id != null ? String(s.user_id) : ''
// //     const userOpt = userOptions.find(o => String(o.value) === userId)
// //     const tripOpt = tripOptions.find(o => String(o.value) === String(s.trip_id ?? ''))
// //     const zoneId  = Array.isArray(s.zone) ? (s.zone[0] || '') : (s.zone ? String(s.zone) : '')
// //     const zoneOpt = zoneOptions.find(o => String(o.value) === String(zoneId))
// //     const ptId    = s.patrol_type_id ? String(s.patrol_type_id) : ''
// //     const ptOpt   = patrolTypeOptions.find(o => String(o.value) === ptId)
// //     return {
// //       zoneId,         zoneName:       zoneOpt?.label        || zoneId,
// //       userId,         employeeName:   userOpt?.label        || safeStr(s.user),
// //       patrolTypeId:   ptId,
// //       patrolTypeName: ptOpt?.label   || safeStr(s.trip_type),
// //       tripId:         s.trip_id != null ? String(s.trip_id) : '',
// //       tripName:       tripOpt?.label || safeStr(s.trip_name),
// //       startDate:      safeStr(s.start_date),
// //       startTime:      safeStr(s.start_time).replace(/ (AM|PM)$/i, ''),
// //       endDate:        safeStr(s.start_date),
// //       endTime:        safeStr(s.end_time).replace(/ (AM|PM)$/i, ''),
// //       ordered:        Number(s.is_order) !== 0,
// //       minRound:       naVal(s.min_round)  != null ? String(s.min_round)  : '',
// //       maxRound:       naVal(s.max_round)  != null ? String(s.max_round)  : '',
// //       delay_mins:     naVal(s.delay_mins) != null ? String(s.delay_mins) : '',
// //       expiredDate:    safeStr(s.expired_at),
// //     }
// //   }

// //   const handleClone = (item) => { setForm(apiRecordToForm(item)); setSel(null) }
// //   const handleEdit  = (item) => { setForm(apiRecordToForm(item)); setSel(item.id) }

// //   const handleSaveClick = () => {
// //     setFormError('')
// //     const f = form
// //     if (!f.tripId)    return setFormError('Please select a Trip.')
// //     if (!f.startDate) return setFormError('Please set a Start Date.')
// //     if (!f.startTime) return setFormError('Please set a Start Time.')
// //     if (!f.endDate)   return setFormError('Please set an End Date.')
// //     if (!f.endTime)   return setFormError('Please set an End Time.')
// //     const roundTouched  = !!(f.minRound  || f.maxRound)
// //     const cyclicTouched = !!(f.delay_mins || f.expiredDate)
// //     if (!roundTouched && !cyclicTouched) {
// //       return setFormError('Please fill in Round or Cyclic details (or both) before saving.')
// //     }
// //     if (f.maxRound && !f.minRound) {
// //       return setFormError('You entered a Maximum Round — please also enter Minimum Round.')
// //     }
// //     if (f.delay_mins && !f.expiredDate) {
// //       return setFormError('You entered a Restart Time — please also enter the Expiry Date.')
// //     }
// //     if (f.expiredDate && !f.delay_mins) {
// //       return setFormError('You entered an Expiry Date — please also enter the Restart Time.')
// //     }
// //     setConfirm(true)
// //   }

// //   const handleConfirmed = async () => {
// //     setBusy(true)
// //     const payload = buildPayload(form)
// //     try {
// //       if (sel) {
// //         await updateSchedule(sel, payload)
// //         await loadSaved()
// //         setSel(null); setForm(blank)
// //       } else {
// //         await createSchedule(payload)
// //         await loadSaved()
// //         setForm(blank)
// //       }
// //     } catch (err) {
// //       console.error('[ScheduleForm] save error:', err)
// //       if (sel) { setSaved(p => p.map(s => s.id === sel ? { ...s, ...payload, id: sel } : s)); setSel(null); setForm(blank) }
// //     }
// //     setBusy(false); setConfirm(false)
// //   }

// //   const handleDelete = async (id) => {
// //     try { await deleteSchedule(id) } catch {}
// //     setSaved(p => p.filter(s => s.id !== id))
// //     if (sel === id) { setForm(blank); setSel(null) }
// //   }

// //   const summary = [
// //     { label: 'Zone',         value: form.zoneName       },
// //     { label: 'Employee',     value: form.employeeName   },
// //     { label: 'Patrol Type',  value: form.patrolTypeName },
// //     { label: 'Trip',         value: form.tripName       },
// //     { label: 'Start',        value: `${form.startDate} ${form.startTime}` },
// //     { label: 'End',          value: `${form.endDate} ${form.endTime}`     },
// //     { label: 'Order',        value: form.ordered ? 'ORDER' : 'UNORDER'   },
// //     ...(form.minRound    ? [{ label: 'Min Round',    value: form.minRound }]             : []),
// //     ...(form.maxRound    ? [{ label: 'Max Round',    value: form.maxRound }]             : []),
// //     ...(form.delay_mins  ? [{ label: 'Restart Time', value: `${form.delay_mins} mins` }] : []),
// //     ...(form.expiredDate ? [{ label: 'Expiry Date',  value: form.expiredDate }]          : []),
// //   ]

// //   const inp = {
// //     padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px',
// //     fontSize: '12px', outline: 'none', flex: 1, minWidth: '120px', boxSizing: 'border-box',
// //   }

// //   return (
// //     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
// //       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

// //       {/* ═══ LEFT PANEL ═══ */}
// //       <div style={{ flex: '0 0 55%', width: '55%', maxWidth: '55%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '20px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
// //         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0 }}>
// //           {sel ? 'Edit Schedule' : 'Create Schedule'}
// //         </h2>

// //         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>

// //           <div style={{ display: 'flex', gap: '12px' }}>
// //             <FieldDropdown label="Zone" displayValue={form.zoneName}
// //               onSelect={opt => setForm(p => ({ ...p, zoneId: opt.value, zoneName: opt.label }))} options={zoneOptions} />
// //             <FieldDropdown label="Employee" displayValue={form.employeeName}
// //               onSelect={opt => setForm(p => ({ ...p, userId: opt.value, employeeName: opt.label }))} options={userOptions} />
// //           </div>

// //           <div style={{ display: 'flex', gap: '12px' }}>
// //             <FieldDropdown label="Patrol Type" displayValue={form.patrolTypeName}
// //               onSelect={opt => setForm(p => ({ ...p, patrolTypeId: opt.value, patrolTypeName: opt.label }))} options={patrolTypeOptions} />
// //             <FieldDropdown label="Trip" displayValue={form.tripName}
// //               onSelect={opt => setForm(p => ({ ...p, tripId: opt.value, tripName: opt.label }))} options={tripOptions} />
// //           </div>

// //           <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
// //             <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}
// //               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
// //             <input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)}
// //               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
// //             <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
// //             <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)}
// //               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
// //             <input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)}
// //               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
// //             <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
// //           </div>

// //           <div style={{ display: 'flex', gap: '12px' }}>
// //             <button onClick={() => set('ordered', true)}
// //               style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '4px', background: form.ordered ? '#1a73e8' : '#f8f9fa', color: form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// //               Order
// //             </button>
// //             <button onClick={() => set('ordered', false)}
// //               style={{ flex: 1, padding: '10px', border: '1px solid #dadce0', borderRadius: '4px', background: !form.ordered ? '#1a73e8' : 'transparent', color: !form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// //               Unorder
// //             </button>
// //           </div>

// //           <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #e8eaed', flexWrap: 'wrap' }}>
// //             <span style={{ fontSize: '13px', fontWeight: 500, color: '#202124', flexShrink: 0, minWidth: '48px' }}>Round</span>
// //             <input type="number" min="0" placeholder="Minimum Round"
// //               value={form.minRound} onChange={e => set('minRound', e.target.value)}
// //               style={inp} />
// //             <input type="number" min="0" placeholder="Maximum Round"
// //               value={form.maxRound} onChange={e => set('maxRound', e.target.value)}
// //               style={inp} />
// //           </div>

// //           <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
// //             <span style={{ fontSize: '13px', fontWeight: 500, color: '#202124', flexShrink: 0, minWidth: '48px' }}>Cyclic</span>
// //             <input type="number" min="0" placeholder="Restart Time (mins)"
// //               value={form.delay_mins} onChange={e => set('delay_mins', e.target.value)}
// //               style={inp} />
// //             <input type="date" placeholder="Expiry Date"
// //               value={form.expiredDate} onChange={e => set('expiredDate', e.target.value)}
// //               style={inp} />
// //           </div>
// //         </div>

// //         {formError && (
// //           <div style={{ color: '#d93025', fontSize: '12px', paddingTop: '8px' }}>⚠ {formError}</div>
// //         )}

// //         <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', gap: '8px' }}>
// //           {sel && (
// //             <button onClick={() => { setForm(blank); setSel(null) }}
// //               style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '4px', background: '#f8f9fa', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// //               Cancel
// //             </button>
// //           )}
// //           <button onClick={handleSaveClick}
// //             style={{ padding: '10px 32px', border: 'none', borderRadius: '4px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// //             Save
// //           </button>
// //         </div>
// //       </div>

// //       {/* ═══ RIGHT PANEL ═══ */}
// //       <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

// //         {/* Right header */}
// //         <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
// //           {selectMode ? (
// //             <>
// //               <div onClick={() => {
// //                 if (selectedIds.length === saved.length) setSelectedIds([])
// //                 else setSelectedIds(saved.map(s => s.id))
// //               }}
// //                 style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
// //                 {selectedIds.length === saved.length
// //                   ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
// //                   : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
// //               </div>
// //               <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
// //                 {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Schedule'}
// //               </h2>
// //               <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
// //                 <button onClick={deleteSelected} disabled={selectedIds.length === 0}
// //                   style={{ display: 'flex', alignItems: 'center', gap: '4px', background: selectedIds.length > 0 ? '#fce8e6' : '#f5f5f5', border: 'none', color: selectedIds.length > 0 ? '#d93025' : '#bbb', fontSize: '12px', fontWeight: 600, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', padding: '5px 10px', borderRadius: '4px' }}>
// //                   🗑 Delete
// //                 </button>
// //                 <button onClick={cancelSelect} style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: '12px', cursor: 'pointer', padding: '5px 8px' }}>✕ Cancel</button>
// //               </div>
// //             </>
// //           ) : (
// //             <>
// //               {showSaved && (
// //                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
// //                   <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0 }}>Saved Schedule</h2>
// //                   {saved.length > 0 && (
// //                     <span style={{ background: '#e8f0fe', color: '#1a73e8', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>{saved.length}</span>
// //                   )}
// //                 </div>
// //               )}
// //               <button onClick={() => setShowSaved(v => !v)}
// //                 style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
// //                 {showSaved ? '⊏' : '⊐'}
// //               </button>
// //             </>
// //           )}
// //         </div>

// //         {showSaved && (
// //           <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
// //             {loadingPanel && (
// //               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '24px' }}>Loading…</div>
// //             )}

// //             {!loadingPanel && saved.map((s, idx) => (
// //               <ScheduleCard
// //                 key={s.id}
// //                 s={s}
// //                 idx={idx}
// //                 isChecked={selectedIds.includes(s.id)}
// //                 selectMode={selectMode}
// //                 onToggleSelect={toggleSelect}
// //                 onSelect={enterSelectMode}
// //                 onClone={handleClone}
// //                 onEdit={handleEdit}
// //                 onDelete={handleDelete}
// //               />
// //             ))}

// //             {!loadingPanel && saved.length === 0 && (
// //               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No schedules saved yet.</div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// import { useState, useEffect, useRef } from 'react'
// import {
//   getSchedules,
//   createSchedule,
//   deleteSchedule,
//   updateSchedule,
//   getZoneFilter,
//   getUserList,
//   listTrips,
//   filterPatrolTypes,
// } from '../../../api'
// import { ConfirmSaveModal } from '../components/MasterFormUI'
// import PagePreviousIcon from '@rsuite/icons/PagePrevious'
// import PageNextIcon     from '@rsuite/icons/PageNext'

// /* ── Custom 3-dot menu ── */
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
//       <button
//         onClick={() => setOpen((o) => !o)}
//         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontSize: '20px', color: '#5f6368', lineHeight: 1, borderRadius: '4px' }}
//       >⋮</button>
//       {open && (
//         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
//           {items.map(({ label, icon, color, action }) => (
//             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
//               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
//               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
//               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
//             >
//               <span style={{ fontSize: '14px' }}>{icon}</span> {label}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// /* ── blank form ── */
// const blank = {
//   zoneId: '', zoneName: '',
//   userId: '', employeeName: '',
//   patrolTypeId: '', patrolTypeName: '',
//   tripId: '', tripName: '',
//   startDate: '', startTime: '',
//   endDate: '', endTime: '',
//   ordered: true,
//   minRound: '', maxRound: '',
//   delay_mins: '', expiredDate: '',
// }

// /* ── Custom searchable dropdown ── */
// function FieldDropdown({ label, displayValue, onSelect, options }) {
//   const [open, setOpen] = useState(false)
//   const [search, setSearch] = useState('')
//   const ref = useRef(null)
//   useEffect(() => {
//     const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
//     document.addEventListener('mousedown', handler)
//     return () => document.removeEventListener('mousedown', handler)
//   }, [])
//   const filtered = options.filter(opt => (opt.label || '').toLowerCase().includes(search.toLowerCase()))
//   return (
//     <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
//       {label && <label style={{ fontSize: '11px', fontWeight: 500, color: '#5f6368' }}>{label}</label>}
//       <div ref={ref} style={{ position: 'relative' }}>
//         <div style={{ display: 'flex' }}>
//           <input type="text" placeholder={label}
//             value={open ? search : (displayValue || '')}
//             onChange={(e) => { setSearch(e.target.value); setOpen(true) }}
//             onFocus={() => { setSearch(''); setOpen(true) }}
//             style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '4px 0 0 4px', fontSize: '13px', color: '#202124', outline: 'none', height: '38px', boxSizing: 'border-box' }}
//           />
//           <button type="button" onClick={() => { setSearch(''); setOpen((o) => !o) }}
//             style={{ width: '38px', height: '38px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 4px 4px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
//           >+</button>
//         </div>
//         {open && (
//           <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
//             {filtered.length === 0
//               ? <div style={{ padding: '8px 12px', fontSize: '13px', color: '#9aa0a6' }}>No options</div>
//               : filtered.map((opt) => (
//                 <div key={opt.value} onMouseDown={() => { onSelect(opt); setSearch(''); setOpen(false) }}
//                   style={{ padding: '8px 12px', fontSize: '13px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
//                   onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
//                   onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
//                 >{opt.label}</div>
//               ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// /* ── helpers ── */
// function formatDateTime(date, time) {
//   if (!date) return ''
//   return `${date} ${time ? time + ':00' : '00:00:00'}`
// }
// function naVal(v) {
//   if (v == null || v === 'N/A' || v === '') return null
//   return v
// }
// function safeStr(v, fallback = '') {
//   if (v == null || v === 'N/A') return fallback
//   return String(v)
// }
// function extractRecords(raw) {
//   if (Array.isArray(raw?.data?.records)) return raw.data.records
//   if (Array.isArray(raw?.records))       return raw.records
//   if (Array.isArray(raw))                return raw
//   return []
// }

// /* ── Avatar color palette ── */
// const avatarColors = [
//   { bg: '#e8f0fe', text: '#1a73e8' },
//   { bg: '#fce8e6', text: '#d93025' },
//   { bg: '#e6f4ea', text: '#1e8e3e' },
//   { bg: '#fef7e0', text: '#f29900' },
//   { bg: '#f3e8fd', text: '#9334e6' },
//   { bg: '#e8f5e9', text: '#388e3c' },
//   { bg: '#fff3e0', text: '#e65100' },
//   { bg: '#e3f2fd', text: '#1565c0' },
// ]

// /* ── Schedule Card ── */
// function ScheduleCard({ s, idx, isChecked, selectMode, onToggleSelect, onSelect, onClone, onEdit, onDelete }) {
//   const isOrdered  = Number(s.is_order) === 1
//   const isRound    = Number(s.is_round) === 1
//   const isCyclic   = naVal(s.delay_mins) != null
//   const avatarClr  = avatarColors[idx % avatarColors.length]
//   const userName   = safeStr(s.user, '—')
//   const tripName   = safeStr(s.trip_name) || `Trip #${s.trip_id ?? ''}`
//   const tripType   = naVal(s.trip_type) ? safeStr(s.trip_type) : null
//   const minRound   = naVal(s.min_round)
//   const maxRound   = naVal(s.max_round)
//   const delayMins  = naVal(s.delay_mins)
//   const expiredAt  = naVal(s.expired_at)
//   const startDate  = safeStr(s.start_date)
//   const startTime  = safeStr(s.start_time)
//   const endTime    = safeStr(s.end_time)
//   const avatarChar = userName.charAt(0).toUpperCase() || '?'
//   const zone       = (() => {
//     if (Array.isArray(s.zone)) return s.zone.filter(Boolean).join(', ') || null
//     return naVal(s.zone) ? String(s.zone) : null
//   })()

//   /* Format "10:00 AM to 4:00 PM" style time range */
//   const timeRange = (startTime && endTime) ? `${startTime} — ${endTime}` : (startTime || endTime || '')

//   return (
//     <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
//       {selectMode && (
//         <div onClick={() => onToggleSelect(s.id)}
//           style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
//           {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
//         </div>
//       )}

//       <div style={{
//         flex: 1, minWidth: 0,
//         border: `1.5px solid ${isChecked ? '#1a73e8' : '#e8eaed'}`,
//         borderRadius: '14px',
//         background: '#fff',
//         boxShadow: '0 1px 4px rgba(60,64,67,0.08)',
//         overflow: 'hidden',
//       }}>

//         {/* ── Top time/order bar ── */}
//         <div style={{
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           padding: '8px 14px',
//           background: '#fff',
//           borderBottom: '1px solid #e8eaed',
//           gap: '6px',
//         }}>
//           {/* Left: time range + Order/Unorder badge */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minWidth: 0, flex: 1 }}>
//             {timeRange && (
//               <span style={{ fontSize: '12px', fontWeight: 600, color: '#3c4043' }}>{timeRange}</span>
//             )}
//             <span style={{
//               display: 'inline-flex', alignItems: 'center',
//               background: '#1e8e3e',
//               color: '#fff', borderRadius: '5px', padding: '2px 9px', fontSize: '10px', fontWeight: 700,
//               whiteSpace: 'nowrap',
//             }}>
//               {isOrdered ? 'Order' : 'Unorder'}
//             </span>
//             {isRound && (
//               <span style={{ background: '#e8f0fe', color: '#1a73e8', borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, border: '1px solid #c5d8fa', whiteSpace: 'nowrap' }}>
//                 🔁 Round
//               </span>
//             )}
//             {isCyclic && (
//               <span style={{ background: '#f3e8fd', color: '#9334e6', borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, border: '1px solid #e1c4fa', whiteSpace: 'nowrap' }}>
//                 🔄 Cyclic
//               </span>
//             )}
//           </div>

//           {/* Right: start date text + 3-dot menu */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
//             {startDate && (
//               <span style={{ fontSize: '11px', color: '#5f6368', whiteSpace: 'nowrap' }}>
//                 Start at {startDate}
//               </span>
//             )}
//             <CardMenu
//               onSelect={() => onSelect(s.id)}
//               onClone={() => onClone(s)}
//               onEdit={() => onEdit(s)}
//               onDelete={() => onDelete(s.id)}
//             />
//           </div>
//         </div>

//         {/* ── User row ── */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px 6px' }}>
//           <div style={{
//             width: '34px', height: '34px', borderRadius: '50%',
//             background: avatarClr.bg, color: avatarClr.text,
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: '13px', fontWeight: 700, flexShrink: 0,
//           }}>
//             {avatarChar}
//           </div>
//           <div style={{ minWidth: 0 }}>
//             <div style={{ fontSize: '14px', fontWeight: 700, color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
//             <div style={{ fontSize: '11px', color: '#5f6368' }}>{tripType || 'Trip type'}</div>
//           </div>
//         </div>

//         {/* ── Pills row: trip name, rounds, expiry, delay, zone ── */}
//         <div style={{ padding: '4px 14px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
//           {/* Trip name pill */}
//           <span style={{ background: '#f8f9fa', border: '1px solid #dadce0', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#3c4043', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
//             {tripName}
//           </span>
//           {(minRound != null || maxRound != null) && (
//             <span style={{ background: '#f0f4ff', border: '1px solid #c5d8fa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#1a73e8', fontWeight: 600, whiteSpace: 'nowrap' }}>
//               Rounds: {minRound ?? '—'}{maxRound != null ? ` – ${maxRound}` : ''}
//             </span>
//           )}
//           {expiredAt && (
//             <span style={{ background: '#fff8f0', border: '1px solid #ffcc80', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#e65100', fontWeight: 600, whiteSpace: 'nowrap' }}>
//               Exp: {expiredAt}
//             </span>
//           )}
//           {delayMins != null && (
//             <span style={{ background: '#f3e8fd', border: '1px solid #e1c4fa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#9334e6', fontWeight: 600, whiteSpace: 'nowrap' }}>
//               ⏱ {delayMins} min
//             </span>
//           )}
//           {zone && (
//             <span style={{ background: '#e6f4ea', border: '1px solid #b7e1c8', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#1e8e3e', fontWeight: 600, whiteSpace: 'nowrap' }}>
//               📍 {zone}
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function ScheduleForm() {
//   const [form, setForm]               = useState(blank)
//   const [saved, setSaved]             = useState([])
//   const [busy, setBusy]               = useState(false)
//   const [sel, setSel]                 = useState(null)
//   const [confirm, setConfirm]         = useState(false)
//   const [showSaved, setShowSaved]     = useState(true)
//   const [selectMode, setSelectMode]   = useState(false)
//   const [selectedIds, setSelectedIds] = useState([])
//   const [loadingPanel, setLoadingPanel] = useState(false)
//   const [formError, setFormError]     = useState('')

//   const [zoneOptions, setZoneOptions]             = useState([])
//   const [userOptions, setUserOptions]             = useState([])
//   const [patrolTypeOptions, setPatrolTypeOptions] = useState([])
//   const [tripOptions, setTripOptions]             = useState([])

//   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
//   const toggleSelect    = (id) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
//   const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
//   const deleteSelected  = async () => {
//     for (const id of selectedIds) { try { await deleteSchedule(id) } catch {} }
//     setSaved(p => p.filter(s => !selectedIds.includes(s.id)))
//     setSelectMode(false); setSelectedIds([])
//   }

//   const loadSaved = async () => {
//     setLoadingPanel(true)
//     try {
//       const raw = await getSchedules()
//       setSaved(Array.isArray(raw) ? raw: [])
//     } catch {
//       setSaved([])
//     } finally {
//       setLoadingPanel(false)
//     }
//   }

//   useEffect(() => {
//     loadSaved()

//     getZoneFilter().then(records => {
//       setZoneOptions(records.map(r => ({
//         value: String(r.value ?? r.id ?? ''),
//         label: String(r.label || r.name || r.zoneName || r.zoneNameLong || r.l_name || ''),
//       })).filter(o => o.value && o.label))
//     }).catch(() => {})

//     getUserList().then(users => {
//       const opts = users.map(u => ({
//         value: String(u.id ?? ''),
//         label: String(u.userName || u.userid || ''),
//       })).filter(o => o.value && o.label)
//       setUserOptions([{ value: 'all', label: 'All' }, ...opts])
//     }).catch(() => {})

//     filterPatrolTypes('all').then(types => {
//       setPatrolTypeOptions(types.map(t => ({
//         value: String(t.id ?? ''),
//         label: String(t.patrolName || ''),
//       })).filter(o => o.value && o.label))
//     }).catch(() => {})

//     listTrips().then(list => {
//       setTripOptions(list.map(t => ({
//         value: String(t.id ?? t.value ?? ''),
//         label: String(t.lable || t.label || t.tripName || t.name || t.trip_name || ''),
//       })).filter(o => o.value && o.label))
//     }).catch(() => {})
//   }, [])

//   useEffect(() => {
//     if (typeof window === 'undefined') return
//     const onZones = () => getZoneFilter().then(records => {
//       setZoneOptions(records.map(r => ({ value: String(r.value ?? r.id ?? ''), label: String(r.label || r.name || r.zoneName || '') })).filter(o => o.value && o.label))
//     }).catch(() => {})
//     const onTrips = () => listTrips().then(list => {
//       setTripOptions(list.map(t => ({ value: String(t.id ?? t.value ?? ''), label: String(t.lable || t.label || t.tripName || t.name || '') })).filter(o => o.value && o.label))
//     }).catch(() => {})
//     window.addEventListener('zones-updated', onZones)
//     window.addEventListener('trips-updated', onTrips)
//     return () => { window.removeEventListener('zones-updated', onZones); window.removeEventListener('trips-updated', onTrips) }
//   }, [])

//   const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

//   function buildPayload(f) {
//     const roundUsed  = !!f.minRound
//     const cyclicUsed = !!f.delay_mins
//     const payload = {
//       zone:            f.zoneId       ? [String(f.zoneId)]       : [],
//       user:            (!f.userId || f.userId === 'all') ? ['all'] : [String(f.userId)],
//       patrol_type:     f.patrolTypeId ? [String(f.patrolTypeId)] : [],
//       trip:            Number(f.tripId) || 0,
//       start_date_time: formatDateTime(f.startDate, f.startTime),
//       end_date_time:   formatDateTime(f.endDate,   f.endTime),
//       order:           f.ordered ? 1 : 0,
//     }
//     if (roundUsed) {
//       payload.is_round  = 1
//       payload.min_round = Number(f.minRound)
//       payload.max_round = f.maxRound ? Number(f.maxRound) : null
//     }
//     if (cyclicUsed) {
//       payload.is_cyclic    = 1
//       payload.delay_mins   = Number(f.delay_mins)
//       payload.expired_date = f.expiredDate
//         ? `${f.expiredDate} 00:00:00`
//         : formatDateTime(f.endDate, f.endTime)
//     }
//     return payload
//   }

//   function apiRecordToForm(s) {
//     const userId  = s.user_id != null ? String(s.user_id) : ''
//     const userOpt = userOptions.find(o => String(o.value) === userId)
//     const tripOpt = tripOptions.find(o => String(o.value) === String(s.trip_id ?? ''))
//     const zoneId  = Array.isArray(s.zone) ? (s.zone[0] || '') : (s.zone ? String(s.zone) : '')
//     const zoneOpt = zoneOptions.find(o => String(o.value) === String(zoneId))
//     const ptId    = s.patrol_type_id ? String(s.patrol_type_id) : ''
//     const ptOpt   = patrolTypeOptions.find(o => String(o.value) === ptId)
//     return {
//       zoneId,         zoneName:       zoneOpt?.label        || zoneId,
//       userId,         employeeName:   userOpt?.label        || safeStr(s.user),
//       patrolTypeId:   ptId,
//       patrolTypeName: ptOpt?.label   || safeStr(s.trip_type),
//       tripId:         s.trip_id != null ? String(s.trip_id) : '',
//       tripName:       tripOpt?.label || safeStr(s.trip_name),
//       startDate:      safeStr(s.start_date),
//       startTime:      safeStr(s.start_time).replace(/ (AM|PM)$/i, ''),
//       endDate:        safeStr(s.start_date),
//       endTime:        safeStr(s.end_time).replace(/ (AM|PM)$/i, ''),
//       ordered:        Number(s.is_order) !== 0,
//       minRound:       naVal(s.min_round)  != null ? String(s.min_round)  : '',
//       maxRound:       naVal(s.max_round)  != null ? String(s.max_round)  : '',
//       delay_mins:     naVal(s.delay_mins) != null ? String(s.delay_mins) : '',
//       expiredDate:    safeStr(s.expired_at),
//     }
//   }

//   const handleClone = (item) => { setForm(apiRecordToForm(item)); setSel(null) }
//   const handleEdit  = (item) => { setForm(apiRecordToForm(item)); setSel(item.id) }

//   const handleSaveClick = () => {
//     setFormError('')
//     const f = form
//     if (!f.tripId)    return setFormError('Please select a Trip.')
//     if (!f.startDate) return setFormError('Please set a Start Date.')
//     if (!f.startTime) return setFormError('Please set a Start Time.')
//     if (!f.endDate)   return setFormError('Please set an End Date.')
//     if (!f.endTime)   return setFormError('Please set an End Time.')
//     const roundTouched  = !!(f.minRound  || f.maxRound)
//     const cyclicTouched = !!(f.delay_mins || f.expiredDate)
//     if (!roundTouched && !cyclicTouched) {
//       return setFormError('Please fill in Round or Cyclic details (or both) before saving.')
//     }
//     if (f.maxRound && !f.minRound) {
//       return setFormError('You entered a Maximum Round — please also enter Minimum Round.')
//     }
//     if (f.delay_mins && !f.expiredDate) {
//       return setFormError('You entered a Restart Time — please also enter the Expiry Date.')
//     }
//     if (f.expiredDate && !f.delay_mins) {
//       return setFormError('You entered an Expiry Date — please also enter the Restart Time.')
//     }
//     setConfirm(true)
//   }

//   const handleConfirmed = async () => {
//     setBusy(true)
//     const payload = buildPayload(form)
//     try {
//       if (sel) {
//         await updateSchedule(sel, payload)
//         await loadSaved()
//         setSel(null); setForm(blank)
//       } else {
//         await createSchedule(payload)
//         await loadSaved()
//         setForm(blank)
//       }
//     } catch (err) {
//       console.error('[ScheduleForm] save error:', err)
//       if (sel) { setSaved(p => p.map(s => s.id === sel ? { ...s, ...payload, id: sel } : s)); setSel(null); setForm(blank) }
//     }
//     setBusy(false); setConfirm(false)
//   }

//   const handleDelete = async (id) => {
//     try { await deleteSchedule(id) } catch {}
//     setSaved(p => p.filter(s => s.id !== id))
//     if (sel === id) { setForm(blank); setSel(null) }
//   }

//   const summary = [
//     { label: 'Zone',         value: form.zoneName       },
//     { label: 'Employee',     value: form.employeeName   },
//     { label: 'Patrol Type',  value: form.patrolTypeName },
//     { label: 'Trip',         value: form.tripName       },
//     { label: 'Start',        value: `${form.startDate} ${form.startTime}` },
//     { label: 'End',          value: `${form.endDate} ${form.endTime}`     },
//     { label: 'Order',        value: form.ordered ? 'ORDER' : 'UNORDER'   },
//     ...(form.minRound    ? [{ label: 'Min Round',    value: form.minRound }]             : []),
//     ...(form.maxRound    ? [{ label: 'Max Round',    value: form.maxRound }]             : []),
//     ...(form.delay_mins  ? [{ label: 'Restart Time', value: `${form.delay_mins} mins` }] : []),
//     ...(form.expiredDate ? [{ label: 'Expiry Date',  value: form.expiredDate }]          : []),
//   ]

//   const inp = {
//     padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px',
//     fontSize: '12px', outline: 'none', flex: 1, minWidth: '120px', boxSizing: 'border-box',
//   }

//   return (
//     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
//       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

//       {/* ═══ LEFT PANEL ═══ */}
//       <div style={{ flex: '0 0 55%', width: '55%', maxWidth: '55%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '20px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
//         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0 }}>
//           {sel ? 'Edit Schedule' : 'Create Schedule'}
//         </h2>

//         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>

//           <div style={{ display: 'flex', gap: '12px' }}>
//             <FieldDropdown label="Zone" displayValue={form.zoneName}
//               onSelect={opt => setForm(p => ({ ...p, zoneId: opt.value, zoneName: opt.label }))} options={zoneOptions} />
//             <FieldDropdown label="Employee" displayValue={form.employeeName}
//               onSelect={opt => setForm(p => ({ ...p, userId: opt.value, employeeName: opt.label }))} options={userOptions} />
//           </div>

//           <div style={{ display: 'flex', gap: '12px' }}>
//             <FieldDropdown label="Patrol Type" displayValue={form.patrolTypeName}
//               onSelect={opt => setForm(p => ({ ...p, patrolTypeId: opt.value, patrolTypeName: opt.label }))} options={patrolTypeOptions} />
//             <FieldDropdown label="Trip" displayValue={form.tripName}
//               onSelect={opt => setForm(p => ({ ...p, tripId: opt.value, tripName: opt.label }))} options={tripOptions} />
//           </div>

//           <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
//             <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}
//               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
//             <input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)}
//               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
//             <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
//             <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)}
//               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
//             <input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)}
//               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
//             <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
//           </div>

//           <div style={{ display: 'flex', gap: '12px' }}>
//             <button onClick={() => set('ordered', true)}
//               style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '4px', background: form.ordered ? '#1a73e8' : '#f8f9fa', color: form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
//               Order
//             </button>
//             <button onClick={() => set('ordered', false)}
//               style={{ flex: 1, padding: '10px', border: '1px solid #dadce0', borderRadius: '4px', background: !form.ordered ? '#1a73e8' : 'transparent', color: !form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
//               Unorder
//             </button>
//           </div>

//           <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #e8eaed', flexWrap: 'wrap' }}>
//             <span style={{ fontSize: '13px', fontWeight: 500, color: '#202124', flexShrink: 0, minWidth: '48px' }}>Round</span>
//             <input type="number" min="0" placeholder="Minimum Round"
//               value={form.minRound} onChange={e => set('minRound', e.target.value)}
//               style={inp} />
//             <input type="number" min="0" placeholder="Maximum Round"
//               value={form.maxRound} onChange={e => set('maxRound', e.target.value)}
//               style={inp} />
//           </div>

//           <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
//             <span style={{ fontSize: '13px', fontWeight: 500, color: '#202124', flexShrink: 0, minWidth: '48px' }}>Cyclic</span>
//             <input type="number" min="0" placeholder="Restart Time (mins)"
//               value={form.delay_mins} onChange={e => set('delay_mins', e.target.value)}
//               style={inp} />
//             <input type="date" placeholder="Expiry Date"
//               value={form.expiredDate} onChange={e => set('expiredDate', e.target.value)}
//               style={inp} />
//           </div>
//         </div>

//         {formError && (
//           <div style={{ color: '#d93025', fontSize: '12px', paddingTop: '8px' }}>⚠ {formError}</div>
//         )}

//         <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', gap: '8px' }}>
//           {sel && (
//             <button onClick={() => { setForm(blank); setSel(null) }}
//               style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '4px', background: '#f8f9fa', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
//               Cancel
//             </button>
//           )}
//           <button onClick={handleSaveClick}
//             style={{ padding: '10px 32px', border: 'none', borderRadius: '4px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
//             Save
//           </button>
//         </div>
//       </div>

//       {/* ═══ RIGHT PANEL ═══ */}
//       <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

//         {/* Right header */}
//         <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
//           {selectMode ? (
//             <>
//               <div onClick={() => {
//                 if (selectedIds.length === saved.length) setSelectedIds([])
//                 else setSelectedIds(saved.map(s => s.id))
//               }}
//                 style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
//                 {selectedIds.length === saved.length
//                   ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
//                   : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
//               </div>
//               <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
//                 {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Schedule'}
//               </h2>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
//                 <button onClick={deleteSelected} disabled={selectedIds.length === 0}
//                   style={{ display: 'flex', alignItems: 'center', gap: '4px', background: selectedIds.length > 0 ? '#fce8e6' : '#f5f5f5', border: 'none', color: selectedIds.length > 0 ? '#d93025' : '#bbb', fontSize: '12px', fontWeight: 600, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', padding: '5px 10px', borderRadius: '4px' }}>
//                   🗑 Delete
//                 </button>
//                 <button onClick={cancelSelect} style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: '12px', cursor: 'pointer', padding: '5px 8px' }}>✕ Cancel</button>
//               </div>
//             </>
//           ) : (
//             <>
//               {showSaved && (
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0 }}>Saved Schedule</h2>
//                   {saved.length > 0 && (
//                     <span style={{ background: '#e8f0fe', color: '#1a73e8', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>{saved.length}</span>
//                   )}
//                 </div>
//               )}
//               <button onClick={() => setShowSaved(v => !v)}
//                 style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '16px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
//                 {showSaved ? <PagePreviousIcon /> : <PageNextIcon />}
//               </button>
//             </>
//           )}
//         </div>

//         {showSaved && (
//           <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
//             {loadingPanel && (
//               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '24px' }}>Loading…</div>
//             )}

//             {!loadingPanel && saved.map((s, idx) => (
//               <ScheduleCard
//                 key={s.id}
//                 s={s}
//                 idx={idx}
//                 isChecked={selectedIds.includes(s.id)}
//                 selectMode={selectMode}
//                 onToggleSelect={toggleSelect}
//                 onSelect={enterSelectMode}
//                 onClone={handleClone}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             ))}

//             {!loadingPanel && saved.length === 0 && (
//               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No schedules saved yet.</div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// // import { useState, useEffect, useRef } from 'react'
// // import {
// //   getSchedules,
// //   createSchedule,
// //   deleteSchedule,
// //   updateSchedule,
// //   getZoneFilter,
// //   getUserList,
// //   listTrips,
// //   filterPatrolTypes,
// // } from '../../../api'
// // import { ConfirmSaveModal } from '../components/MasterFormUI'

// // /* ── Custom 3-dot menu ── */
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
// //       <button
// //         onClick={() => setOpen((o) => !o)}
// //         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontSize: '20px', color: '#5f6368', lineHeight: 1, borderRadius: '4px' }}
// //       >⋮</button>
// //       {open && (
// //         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
// //           {items.map(({ label, icon, color, action }) => (
// //             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
// //               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
// //               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
// //               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
// //             >
// //               <span style={{ fontSize: '14px' }}>{icon}</span> {label}
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // /* ── blank form ── */
// // const blank = {
// //   zoneId: '', zoneName: '',
// //   userId: '', employeeName: '',
// //   patrolTypeId: '', patrolTypeName: '',
// //   tripId: '', tripName: '',
// //   startDate: '', startTime: '',
// //   endDate: '', endTime: '',
// //   ordered: true,
// //   minRound: '', maxRound: '',
// //   delay_mins: '', expiredDate: '',
// // }

// // /* ── Custom searchable dropdown ── */
// // function FieldDropdown({ label, displayValue, onSelect, options }) {
// //   const [open, setOpen] = useState(false)
// //   const [search, setSearch] = useState('')
// //   const ref = useRef(null)
// //   useEffect(() => {
// //     const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
// //     document.addEventListener('mousedown', handler)
// //     return () => document.removeEventListener('mousedown', handler)
// //   }, [])
// //   const filtered = options.filter(opt => (opt.label || '').toLowerCase().includes(search.toLowerCase()))
// //   return (
// //     <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
// //       {label && <label style={{ fontSize: '11px', fontWeight: 500, color: '#5f6368' }}>{label}</label>}
// //       <div ref={ref} style={{ position: 'relative' }}>
// //         <div style={{ display: 'flex' }}>
// //           <input type="text" placeholder={label}
// //             value={open ? search : (displayValue || '')}
// //             onChange={(e) => { setSearch(e.target.value); setOpen(true) }}
// //             onFocus={() => { setSearch(''); setOpen(true) }}
// //             style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '4px 0 0 4px', fontSize: '13px', color: '#202124', outline: 'none', height: '38px', boxSizing: 'border-box' }}
// //           />
// //           <button type="button" onClick={() => { setSearch(''); setOpen((o) => !o) }}
// //             style={{ width: '38px', height: '38px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 4px 4px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
// //           >+</button>
// //         </div>
// //         {open && (
// //           <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
// //             {filtered.length === 0
// //               ? <div style={{ padding: '8px 12px', fontSize: '13px', color: '#9aa0a6' }}>No options</div>
// //               : filtered.map((opt) => (
// //                 <div key={opt.value} onMouseDown={() => { onSelect(opt); setSearch(''); setOpen(false) }}
// //                   style={{ padding: '8px 12px', fontSize: '13px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
// //                   onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
// //                   onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
// //                 >{opt.label}</div>
// //               ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // /* ── helpers ── */
// // function formatDateTime(date, time) {
// //   if (!date) return ''
// //   return `${date} ${time ? time + ':00' : '00:00:00'}`
// // }
// // function naVal(v) {
// //   if (v == null || v === 'N/A' || v === '') return null
// //   return v
// // }
// // function safeStr(v, fallback = '') {
// //   if (v == null || v === 'N/A') return fallback
// //   return String(v)
// // }
// // function extractRecords(raw) {
// //   if (Array.isArray(raw?.data?.records)) return raw.data.records
// //   if (Array.isArray(raw?.records))       return raw.records
// //   if (Array.isArray(raw))                return raw
// //   return []
// // }

// // /* ── Avatar color palette ── */
// // const avatarColors = [
// //   { bg: '#e8f0fe', text: '#1a73e8' },
// //   { bg: '#fce8e6', text: '#d93025' },
// //   { bg: '#e6f4ea', text: '#1e8e3e' },
// //   { bg: '#fef7e0', text: '#f29900' },
// //   { bg: '#f3e8fd', text: '#9334e6' },
// //   { bg: '#e8f5e9', text: '#388e3c' },
// //   { bg: '#fff3e0', text: '#e65100' },
// //   { bg: '#e3f2fd', text: '#1565c0' },
// // ]

// // /* ── Schedule Card ── */
// // function ScheduleCard({ s, idx, isChecked, selectMode, onToggleSelect, onSelect, onClone, onEdit, onDelete }) {
// //   const isOrdered  = Number(s.is_order) === 1
// //   const isRound    = Number(s.is_round) === 1
// //   const isCyclic   = naVal(s.delay_mins) != null
// //   const avatarClr  = avatarColors[idx % avatarColors.length]
// //   const userName   = safeStr(s.user, '—')
// //   const tripName   = safeStr(s.trip_name) || `Trip #${s.trip_id ?? ''}`
// //   const tripType   = naVal(s.trip_type) ? safeStr(s.trip_type) : null
// //   const minRound   = naVal(s.min_round)
// //   const maxRound   = naVal(s.max_round)
// //   const delayMins  = naVal(s.delay_mins)
// //   const expiredAt  = naVal(s.expired_at)
// //   const startDate  = safeStr(s.start_date)
// //   const startTime  = safeStr(s.start_time)
// //   const endTime    = safeStr(s.end_time)
// //   const avatarChar = userName.charAt(0).toUpperCase() || '?'
// //   const zone       = (() => {
// //     if (Array.isArray(s.zone)) return s.zone.filter(Boolean).join(', ') || null
// //     return naVal(s.zone) ? String(s.zone) : null
// //   })()

// //   /* Format "10:00 AM to 4:00 PM" style time range */
// //   const timeRange = (startTime && endTime) ? `${startTime} — ${endTime}` : (startTime || endTime || '')

// //   return (
// //     <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
// //       {selectMode && (
// //         <div onClick={() => onToggleSelect(s.id)}
// //           style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
// //           {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
// //         </div>
// //       )}

// //       <div style={{
// //         flex: 1, minWidth: 0,
// //         border: `1.5px solid ${isChecked ? '#1a73e8' : '#e8eaed'}`,
// //         borderRadius: '14px',
// //         background: '#fff',
// //         boxShadow: '0 1px 4px rgba(60,64,67,0.08)',
// //         overflow: 'hidden',
// //       }}>

// //         {/* ── Top time/order bar ── */}
// //         <div style={{
// //           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
// //           padding: '8px 14px',
// //           background: isOrdered ? '#f0faf4' : '#fff8f0',
// //           borderBottom: `1px solid ${isOrdered ? '#d4edda' : '#ffe0b2'}`,
// //           flexWrap: 'wrap', gap: '6px',
// //         }}>
// //           {/* Left: time range + date */}
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minWidth: 0 }}>
// //             {timeRange && (
// //               <span style={{ fontSize: '12px', fontWeight: 600, color: '#3c4043' }}>{timeRange}</span>
// //             )}
// //             <span style={{
// //               display: 'inline-flex', alignItems: 'center', gap: '3px',
// //               background: isOrdered ? '#1e8e3e' : '#e65100',
// //               color: '#fff', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 700,
// //             }}>
// //               {isOrdered ? 'Order' : 'Unorder'}
// //             </span>
// //             {isRound && (
// //               <span style={{ background: '#e8f0fe', color: '#1a73e8', borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, border: '1px solid #c5d8fa' }}>
// //                 🔁 Round
// //               </span>
// //             )}
// //             {isCyclic && (
// //               <span style={{ background: '#f3e8fd', color: '#9334e6', borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, border: '1px solid #e1c4fa' }}>
// //                 🔄 Cyclic
// //               </span>
// //             )}
// //           </div>

// //           {/* Right: start date + menu */}
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
// //             <CardMenu
// //               onSelect={() => onSelect(s.id)}
// //               onClone={() => onClone(s)}
// //               onEdit={() => onEdit(s)}
// //               onDelete={() => onDelete(s.id)}
// //             />
// //           </div>
// //         </div>

// //         {/* ── User row ── */}
// //         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px 6px' }}>
// //           <div style={{
// //             width: '34px', height: '34px', borderRadius: '50%',
// //             background: avatarClr.bg, color: avatarClr.text,
// //             display: 'flex', alignItems: 'center', justifyContent: 'center',
// //             fontSize: '13px', fontWeight: 700, flexShrink: 0,
// //           }}>
// //             {avatarChar}
// //           </div>
// //           <div style={{ minWidth: 0 }}>
// //             <div style={{ fontSize: '14px', fontWeight: 700, color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
// //             {tripType && <div style={{ fontSize: '11px', color: '#5f6368' }}>{tripType}</div>}
// //           </div>
// //         </div>

// //         {/* ── Trip name ── */}
// //         <div style={{ padding: '2px 14px 8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
// //           <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a73e8' }}>🗺 {tripName}</span>
// //         </div>

// //         {/* ── Pills row: rounds, expiry, delay ── */}
// //         <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
// //           {(minRound != null || maxRound != null) && (
// //             <span style={{ background: '#f0f4ff', border: '1px solid #c5d8fa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#1a73e8', fontWeight: 600 }}>
// //               Rounds: {minRound ?? '—'}
// //               {maxRound != null ? ` – ${maxRound}` : ''}
// //             </span>
// //           )}
// //           {expiredAt && (
// //             <span style={{ background: '#fff8f0', border: '1px solid #ffcc80', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#e65100', fontWeight: 600 }}>
// //               Exp: {expiredAt}
// //             </span>
// //           )}
// //           {delayMins != null && (
// //             <span style={{ background: '#f3e8fd', border: '1px solid #e1c4fa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#9334e6', fontWeight: 600 }}>
// //               ⏱ Restart: {delayMins} min
// //             </span>
// //           )}
// //           {zone && (
// //             <span style={{ background: '#e6f4ea', border: '1px solid #b7e1c8', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#1e8e3e', fontWeight: 600 }}>
// //               📍 {zone}
// //             </span>
// //           )}
// //         </div>

// //         {/* ── Footer: created / updated ── */}
// //         {(s.created_at || naVal(s.updated_at)) && (
// //           <div style={{ padding: '6px 14px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
// //             {s.created_at && (
// //               <span style={{ fontSize: '10px', color: '#9aa0a6' }}>Created: {safeStr(s.created_at)}</span>
// //             )}
// //             {naVal(s.updated_at) && (
// //               <span style={{ fontSize: '10px', color: '#9aa0a6' }}>Updated: {safeStr(s.updated_at)}</span>
// //             )}
// //             {startDate && (
// //               <span style={{ fontSize: '11px', color: '#5f6368' }}>Start {startDate}</span>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // export default function ScheduleForm() {
// //   const [form, setForm]               = useState(blank)
// //   const [saved, setSaved]             = useState([])
// //   const [busy, setBusy]               = useState(false)
// //   const [sel, setSel]                 = useState(null)
// //   const [confirm, setConfirm]         = useState(false)
// //   const [showSaved, setShowSaved]     = useState(true)
// //   const [selectMode, setSelectMode]   = useState(false)
// //   const [selectedIds, setSelectedIds] = useState([])
// //   const [loadingPanel, setLoadingPanel] = useState(false)
// //   const [formError, setFormError]     = useState('')

// //   const [zoneOptions, setZoneOptions]             = useState([])
// //   const [userOptions, setUserOptions]             = useState([])
// //   const [patrolTypeOptions, setPatrolTypeOptions] = useState([])
// //   const [tripOptions, setTripOptions]             = useState([])

// //   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
// //   const toggleSelect    = (id) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
// //   const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
// //   const deleteSelected  = async () => {
// //     for (const id of selectedIds) { try { await deleteSchedule(id) } catch {} }
// //     setSaved(p => p.filter(s => !selectedIds.includes(s.id)))
// //     setSelectMode(false); setSelectedIds([])
// //   }

// //   const loadSaved = async () => {
// //     setLoadingPanel(true)
// //     try {
// //       const raw = await getSchedules()
// //       setSaved(Array.isArray(raw) ? raw: [])
// //     } catch {
// //       setSaved([])
// //     } finally {
// //       setLoadingPanel(false)
// //     }
// //   }

// //   useEffect(() => {
// //     loadSaved()

// //     getZoneFilter().then(records => {
// //       setZoneOptions(records.map(r => ({
// //         value: String(r.value ?? r.id ?? ''),
// //         label: String(r.label || r.name || r.zoneName || r.zoneNameLong || r.l_name || ''),
// //       })).filter(o => o.value && o.label))
// //     }).catch(() => {})

// //     getUserList().then(users => {
// //       const opts = users.map(u => ({
// //         value: String(u.id ?? ''),
// //         label: String(u.userName || u.userid || ''),
// //       })).filter(o => o.value && o.label)
// //       setUserOptions([{ value: 'all', label: 'All' }, ...opts])
// //     }).catch(() => {})

// //     filterPatrolTypes('all').then(types => {
// //       setPatrolTypeOptions(types.map(t => ({
// //         value: String(t.id ?? ''),
// //         label: String(t.patrolName || ''),
// //       })).filter(o => o.value && o.label))
// //     }).catch(() => {})

// //     listTrips().then(list => {
// //       setTripOptions(list.map(t => ({
// //         value: String(t.id ?? t.value ?? ''),
// //         label: String(t.lable || t.label || t.tripName || t.name || t.trip_name || ''),
// //       })).filter(o => o.value && o.label))
// //     }).catch(() => {})
// //   }, [])

// //   useEffect(() => {
// //     if (typeof window === 'undefined') return
// //     const onZones = () => getZoneFilter().then(records => {
// //       setZoneOptions(records.map(r => ({ value: String(r.value ?? r.id ?? ''), label: String(r.label || r.name || r.zoneName || '') })).filter(o => o.value && o.label))
// //     }).catch(() => {})
// //     const onTrips = () => listTrips().then(list => {
// //       setTripOptions(list.map(t => ({ value: String(t.id ?? t.value ?? ''), label: String(t.lable || t.label || t.tripName || t.name || '') })).filter(o => o.value && o.label))
// //     }).catch(() => {})
// //     window.addEventListener('zones-updated', onZones)
// //     window.addEventListener('trips-updated', onTrips)
// //     return () => { window.removeEventListener('zones-updated', onZones); window.removeEventListener('trips-updated', onTrips) }
// //   }, [])

// //   const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

// //   function buildPayload(f) {
// //     const roundUsed  = !!f.minRound
// //     const cyclicUsed = !!f.delay_mins
// //     const payload = {
// //       zone:            f.zoneId       ? [String(f.zoneId)]       : [],
// //       user:            (!f.userId || f.userId === 'all') ? ['all'] : [String(f.userId)],
// //       patrol_type:     f.patrolTypeId ? [String(f.patrolTypeId)] : [],
// //       trip:            Number(f.tripId) || 0,
// //       start_date_time: formatDateTime(f.startDate, f.startTime),
// //       end_date_time:   formatDateTime(f.endDate,   f.endTime),
// //       order:           f.ordered ? 1 : 0,
// //     }
// //     if (roundUsed) {
// //       payload.is_round  = 1
// //       payload.min_round = Number(f.minRound)
// //       payload.max_round = f.maxRound ? Number(f.maxRound) : null
// //     }
// //     if (cyclicUsed) {
// //       payload.is_cyclic    = 1
// //       payload.delay_mins   = Number(f.delay_mins)
// //       payload.expired_date = f.expiredDate
// //         ? `${f.expiredDate} 00:00:00`
// //         : formatDateTime(f.endDate, f.endTime)
// //     }
// //     return payload
// //   }

// //   function apiRecordToForm(s) {
// //     const userId  = s.user_id != null ? String(s.user_id) : ''
// //     const userOpt = userOptions.find(o => String(o.value) === userId)
// //     const tripOpt = tripOptions.find(o => String(o.value) === String(s.trip_id ?? ''))
// //     const zoneId  = Array.isArray(s.zone) ? (s.zone[0] || '') : (s.zone ? String(s.zone) : '')
// //     const zoneOpt = zoneOptions.find(o => String(o.value) === String(zoneId))
// //     const ptId    = s.patrol_type_id ? String(s.patrol_type_id) : ''
// //     const ptOpt   = patrolTypeOptions.find(o => String(o.value) === ptId)
// //     return {
// //       zoneId,         zoneName:       zoneOpt?.label        || zoneId,
// //       userId,         employeeName:   userOpt?.label        || safeStr(s.user),
// //       patrolTypeId:   ptId,
// //       patrolTypeName: ptOpt?.label   || safeStr(s.trip_type),
// //       tripId:         s.trip_id != null ? String(s.trip_id) : '',
// //       tripName:       tripOpt?.label || safeStr(s.trip_name),
// //       startDate:      safeStr(s.start_date),
// //       startTime:      safeStr(s.start_time).replace(/ (AM|PM)$/i, ''),
// //       endDate:        safeStr(s.start_date),
// //       endTime:        safeStr(s.end_time).replace(/ (AM|PM)$/i, ''),
// //       ordered:        Number(s.is_order) !== 0,
// //       minRound:       naVal(s.min_round)  != null ? String(s.min_round)  : '',
// //       maxRound:       naVal(s.max_round)  != null ? String(s.max_round)  : '',
// //       delay_mins:     naVal(s.delay_mins) != null ? String(s.delay_mins) : '',
// //       expiredDate:    safeStr(s.expired_at),
// //     }
// //   }

// //   const handleClone = (item) => { setForm(apiRecordToForm(item)); setSel(null) }
// //   const handleEdit  = (item) => { setForm(apiRecordToForm(item)); setSel(item.id) }

// //   const handleSaveClick = () => {
// //     setFormError('')
// //     const f = form
// //     if (!f.tripId)    return setFormError('Please select a Trip.')
// //     if (!f.startDate) return setFormError('Please set a Start Date.')
// //     if (!f.startTime) return setFormError('Please set a Start Time.')
// //     if (!f.endDate)   return setFormError('Please set an End Date.')
// //     if (!f.endTime)   return setFormError('Please set an End Time.')
// //     const roundTouched  = !!(f.minRound  || f.maxRound)
// //     const cyclicTouched = !!(f.delay_mins || f.expiredDate)
// //     if (!roundTouched && !cyclicTouched) {
// //       return setFormError('Please fill in Round or Cyclic details (or both) before saving.')
// //     }
// //     if (f.maxRound && !f.minRound) {
// //       return setFormError('You entered a Maximum Round — please also enter Minimum Round.')
// //     }
// //     if (f.delay_mins && !f.expiredDate) {
// //       return setFormError('You entered a Restart Time — please also enter the Expiry Date.')
// //     }
// //     if (f.expiredDate && !f.delay_mins) {
// //       return setFormError('You entered an Expiry Date — please also enter the Restart Time.')
// //     }
// //     setConfirm(true)
// //   }

// //   const handleConfirmed = async () => {
// //     setBusy(true)
// //     const payload = buildPayload(form)
// //     try {
// //       if (sel) {
// //         await updateSchedule(sel, payload)
// //         await loadSaved()
// //         setSel(null); setForm(blank)
// //       } else {
// //         await createSchedule(payload)
// //         await loadSaved()
// //         setForm(blank)
// //       }
// //     } catch (err) {
// //       console.error('[ScheduleForm] save error:', err)
// //       if (sel) { setSaved(p => p.map(s => s.id === sel ? { ...s, ...payload, id: sel } : s)); setSel(null); setForm(blank) }
// //     }
// //     setBusy(false); setConfirm(false)
// //   }

// //   const handleDelete = async (id) => {
// //     try { await deleteSchedule(id) } catch {}
// //     setSaved(p => p.filter(s => s.id !== id))
// //     if (sel === id) { setForm(blank); setSel(null) }
// //   }

// //   const summary = [
// //     { label: 'Zone',         value: form.zoneName       },
// //     { label: 'Employee',     value: form.employeeName   },
// //     { label: 'Patrol Type',  value: form.patrolTypeName },
// //     { label: 'Trip',         value: form.tripName       },
// //     { label: 'Start',        value: `${form.startDate} ${form.startTime}` },
// //     { label: 'End',          value: `${form.endDate} ${form.endTime}`     },
// //     { label: 'Order',        value: form.ordered ? 'ORDER' : 'UNORDER'   },
// //     ...(form.minRound    ? [{ label: 'Min Round',    value: form.minRound }]             : []),
// //     ...(form.maxRound    ? [{ label: 'Max Round',    value: form.maxRound }]             : []),
// //     ...(form.delay_mins  ? [{ label: 'Restart Time', value: `${form.delay_mins} mins` }] : []),
// //     ...(form.expiredDate ? [{ label: 'Expiry Date',  value: form.expiredDate }]          : []),
// //   ]

// //   const inp = {
// //     padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px',
// //     fontSize: '12px', outline: 'none', flex: 1, minWidth: '120px', boxSizing: 'border-box',
// //   }

// //   return (
// //     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
// //       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

// //       {/* ═══ LEFT PANEL ═══ */}
// //       <div style={{ flex: '0 0 55%', width: '55%', maxWidth: '55%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '20px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
// //         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0 }}>
// //           {sel ? 'Edit Schedule' : 'Create Schedule'}
// //         </h2>

// //         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>

// //           <div style={{ display: 'flex', gap: '12px' }}>
// //             <FieldDropdown label="Zone" displayValue={form.zoneName}
// //               onSelect={opt => setForm(p => ({ ...p, zoneId: opt.value, zoneName: opt.label }))} options={zoneOptions} />
// //             <FieldDropdown label="Employee" displayValue={form.employeeName}
// //               onSelect={opt => setForm(p => ({ ...p, userId: opt.value, employeeName: opt.label }))} options={userOptions} />
// //           </div>

// //           <div style={{ display: 'flex', gap: '12px' }}>
// //             <FieldDropdown label="Patrol Type" displayValue={form.patrolTypeName}
// //               onSelect={opt => setForm(p => ({ ...p, patrolTypeId: opt.value, patrolTypeName: opt.label }))} options={patrolTypeOptions} />
// //             <FieldDropdown label="Trip" displayValue={form.tripName}
// //               onSelect={opt => setForm(p => ({ ...p, tripId: opt.value, tripName: opt.label }))} options={tripOptions} />
// //           </div>

// //           <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
// //             <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}
// //               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
// //             <input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)}
// //               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
// //             <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
// //             <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)}
// //               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
// //             <input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)}
// //               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
// //             <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
// //           </div>

// //           <div style={{ display: 'flex', gap: '12px' }}>
// //             <button onClick={() => set('ordered', true)}
// //               style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '4px', background: form.ordered ? '#1a73e8' : '#f8f9fa', color: form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// //               Order
// //             </button>
// //             <button onClick={() => set('ordered', false)}
// //               style={{ flex: 1, padding: '10px', border: '1px solid #dadce0', borderRadius: '4px', background: !form.ordered ? '#1a73e8' : 'transparent', color: !form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// //               Unorder
// //             </button>
// //           </div>

// //           <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #e8eaed', flexWrap: 'wrap' }}>
// //             <span style={{ fontSize: '13px', fontWeight: 500, color: '#202124', flexShrink: 0, minWidth: '48px' }}>Round</span>
// //             <input type="number" min="0" placeholder="Minimum Round"
// //               value={form.minRound} onChange={e => set('minRound', e.target.value)}
// //               style={inp} />
// //             <input type="number" min="0" placeholder="Maximum Round"
// //               value={form.maxRound} onChange={e => set('maxRound', e.target.value)}
// //               style={inp} />
// //           </div>

// //           <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
// //             <span style={{ fontSize: '13px', fontWeight: 500, color: '#202124', flexShrink: 0, minWidth: '48px' }}>Cyclic</span>
// //             <input type="number" min="0" placeholder="Restart Time (mins)"
// //               value={form.delay_mins} onChange={e => set('delay_mins', e.target.value)}
// //               style={inp} />
// //             <input type="date" placeholder="Expiry Date"
// //               value={form.expiredDate} onChange={e => set('expiredDate', e.target.value)}
// //               style={inp} />
// //           </div>
// //         </div>

// //         {formError && (
// //           <div style={{ color: '#d93025', fontSize: '12px', paddingTop: '8px' }}>⚠ {formError}</div>
// //         )}

// //         <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', gap: '8px' }}>
// //           {sel && (
// //             <button onClick={() => { setForm(blank); setSel(null) }}
// //               style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '4px', background: '#f8f9fa', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// //               Cancel
// //             </button>
// //           )}
// //           <button onClick={handleSaveClick}
// //             style={{ padding: '10px 32px', border: 'none', borderRadius: '4px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
// //             Save
// //           </button>
// //         </div>
// //       </div>

// //       {/* ═══ RIGHT PANEL ═══ */}
// //       <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

// //         {/* Right header */}
// //         <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
// //           {selectMode ? (
// //             <>
// //               <div onClick={() => {
// //                 if (selectedIds.length === saved.length) setSelectedIds([])
// //                 else setSelectedIds(saved.map(s => s.id))
// //               }}
// //                 style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
// //                 {selectedIds.length === saved.length
// //                   ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
// //                   : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
// //               </div>
// //               <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
// //                 {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Schedule'}
// //               </h2>
// //               <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
// //                 <button onClick={deleteSelected} disabled={selectedIds.length === 0}
// //                   style={{ display: 'flex', alignItems: 'center', gap: '4px', background: selectedIds.length > 0 ? '#fce8e6' : '#f5f5f5', border: 'none', color: selectedIds.length > 0 ? '#d93025' : '#bbb', fontSize: '12px', fontWeight: 600, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', padding: '5px 10px', borderRadius: '4px' }}>
// //                   🗑 Delete
// //                 </button>
// //                 <button onClick={cancelSelect} style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: '12px', cursor: 'pointer', padding: '5px 8px' }}>✕ Cancel</button>
// //               </div>
// //             </>
// //           ) : (
// //             <>
// //               {showSaved && (
// //                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
// //                   <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0 }}>Saved Schedule</h2>
// //                   {saved.length > 0 && (
// //                     <span style={{ background: '#e8f0fe', color: '#1a73e8', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>{saved.length}</span>
// //                   )}
// //                 </div>
// //               )}
// //               <button onClick={() => setShowSaved(v => !v)}
// //                 style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
// //                 {showSaved ? '⊏' : '⊐'}
// //               </button>
// //             </>
// //           )}
// //         </div>

// //         {showSaved && (
// //           <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
// //             {loadingPanel && (
// //               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '24px' }}>Loading…</div>
// //             )}

// //             {!loadingPanel && saved.map((s, idx) => (
// //               <ScheduleCard
// //                 key={s.id}
// //                 s={s}
// //                 idx={idx}
// //                 isChecked={selectedIds.includes(s.id)}
// //                 selectMode={selectMode}
// //                 onToggleSelect={toggleSelect}
// //                 onSelect={enterSelectMode}
// //                 onClone={handleClone}
// //                 onEdit={handleEdit}
// //                 onDelete={handleDelete}
// //               />
// //             ))}

// //             {!loadingPanel && saved.length === 0 && (
// //               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No schedules saved yet.</div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// import { useState, useEffect, useRef } from 'react'
// import {
//   getSchedules,
//   createSchedule,
//   deleteSchedule,
//   updateSchedule,
//   getZoneFilter,
//   getUserList,
//   listTrips,
//   filterPatrolTypes,
// } from '../../../api'
// import { ConfirmSaveModal } from '../components/MasterFormUI'

// /* ── Custom 3-dot menu ── */
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
//       <button
//         onClick={() => setOpen((o) => !o)}
//         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontSize: '20px', color: '#5f6368', lineHeight: 1, borderRadius: '4px' }}
//       >⋮</button>
//       {open && (
//         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
//           {items.map(({ label, icon, color, action }) => (
//             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
//               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
//               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
//               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
//             >
//               <span style={{ fontSize: '14px' }}>{icon}</span> {label}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// /* ── blank form ── */
// const blank = {
//   zoneId: '', zoneName: '',
//   userId: '', employeeName: '',
//   patrolTypeId: '', patrolTypeName: '',
//   tripId: '', tripName: '',
//   startDate: '', startTime: '',
//   endDate: '', endTime: '',
//   ordered: true,
//   minRound: '', maxRound: '',
//   delay_mins: '', expiredDate: '',
// }

// /* ── Custom searchable dropdown ── */
// function FieldDropdown({ label, displayValue, onSelect, options }) {
//   const [open, setOpen] = useState(false)
//   const [search, setSearch] = useState('')
//   const ref = useRef(null)
//   useEffect(() => {
//     const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
//     document.addEventListener('mousedown', handler)
//     return () => document.removeEventListener('mousedown', handler)
//   }, [])
//   const filtered = options.filter(opt => (opt.label || '').toLowerCase().includes(search.toLowerCase()))
//   return (
//     <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
//       {label && <label style={{ fontSize: '11px', fontWeight: 500, color: '#5f6368' }}>{label}</label>}
//       <div ref={ref} style={{ position: 'relative' }}>
//         <div style={{ display: 'flex' }}>
//           <input type="text" placeholder={label}
//             value={open ? search : (displayValue || '')}
//             onChange={(e) => { setSearch(e.target.value); setOpen(true) }}
//             onFocus={() => { setSearch(''); setOpen(true) }}
//             style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '4px 0 0 4px', fontSize: '13px', color: '#202124', outline: 'none', height: '38px', boxSizing: 'border-box' }}
//           />
//           <button type="button" onClick={() => { setSearch(''); setOpen((o) => !o) }}
//             style={{ width: '38px', height: '38px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 4px 4px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
//           >+</button>
//         </div>
//         {open && (
//           <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
//             {filtered.length === 0
//               ? <div style={{ padding: '8px 12px', fontSize: '13px', color: '#9aa0a6' }}>No options</div>
//               : filtered.map((opt) => (
//                 <div key={opt.value} onMouseDown={() => { onSelect(opt); setSearch(''); setOpen(false) }}
//                   style={{ padding: '8px 12px', fontSize: '13px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
//                   onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
//                   onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
//                 >{opt.label}</div>
//               ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// /* ── helpers ── */
// function formatDateTime(date, time) {
//   if (!date) return ''
//   return `${date} ${time ? time + ':00' : '00:00:00'}`
// }
// function naVal(v) {
//   if (v == null || v === 'N/A' || v === '') return null
//   return v
// }
// function safeStr(v, fallback = '') {
//   if (v == null || v === 'N/A') return fallback
//   return String(v)
// }
// function extractRecords(raw) {
//   if (Array.isArray(raw?.data?.records)) return raw.data.records
//   if (Array.isArray(raw?.records))       return raw.records
//   if (Array.isArray(raw))                return raw
//   return []
// }

// /* ── Avatar color palette ── */
// const avatarColors = [
//   { bg: '#e8f0fe', text: '#1a73e8' },
//   { bg: '#fce8e6', text: '#d93025' },
//   { bg: '#e6f4ea', text: '#1e8e3e' },
//   { bg: '#fef7e0', text: '#f29900' },
//   { bg: '#f3e8fd', text: '#9334e6' },
//   { bg: '#e8f5e9', text: '#388e3c' },
//   { bg: '#fff3e0', text: '#e65100' },
//   { bg: '#e3f2fd', text: '#1565c0' },
// ]

// /* ── Schedule Card ── */
// function ScheduleCard({ s, idx, isChecked, selectMode, onToggleSelect, onSelect, onClone, onEdit, onDelete }) {
//   const isOrdered  = Number(s.is_order) === 1
//   const isRound    = Number(s.is_round) === 1
//   const isCyclic   = naVal(s.delay_mins) != null
//   const avatarClr  = avatarColors[idx % avatarColors.length]
//   const userName   = safeStr(s.user, '—')
//   const tripName   = safeStr(s.trip_name) || `Trip #${s.trip_id ?? ''}`
//   const tripType   = naVal(s.trip_type) ? safeStr(s.trip_type) : null
//   const minRound   = naVal(s.min_round)
//   const maxRound   = naVal(s.max_round)
//   const delayMins  = naVal(s.delay_mins)
//   const expiredAt  = naVal(s.expired_at)
//   const startDate  = safeStr(s.start_date)
//   const startTime  = safeStr(s.start_time)
//   const endTime    = safeStr(s.end_time)
//   const avatarChar = userName.charAt(0).toUpperCase() || '?'
//   const zone       = (() => {
//     if (Array.isArray(s.zone)) return s.zone.filter(Boolean).join(', ') || null
//     return naVal(s.zone) ? String(s.zone) : null
//   })()

//   /* Format "10:00 AM to 4:00 PM" style time range */
//   const timeRange = (startTime && endTime) ? `${startTime} — ${endTime}` : (startTime || endTime || '')

//   return (
//     <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
//       {selectMode && (
//         <div onClick={() => onToggleSelect(s.id)}
//           style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
//           {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
//         </div>
//       )}

//       <div style={{
//         flex: 1, minWidth: 0,
//         border: `1.5px solid ${isChecked ? '#1a73e8' : '#e8eaed'}`,
//         borderRadius: '14px',
//         background: '#fff',
//         boxShadow: '0 1px 4px rgba(60,64,67,0.08)',
//         overflow: 'hidden',
//       }}>

//         {/* ── Top time/order bar ── */}
//         <div style={{
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           padding: '8px 14px',
//           background: '#fff',
//           borderBottom: '1px solid #e8eaed',
//           gap: '6px',
//         }}>
//           {/* Left: time range + Order/Unorder badge */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minWidth: 0, flex: 1 }}>
//             {timeRange && (
//               <span style={{ fontSize: '12px', fontWeight: 600, color: '#3c4043' }}>{timeRange}</span>
//             )}
//             <span style={{
//               display: 'inline-flex', alignItems: 'center',
//               background: '#1e8e3e',
//               color: '#fff', borderRadius: '5px', padding: '2px 9px', fontSize: '10px', fontWeight: 700,
//               whiteSpace: 'nowrap',
//             }}>
//               {isOrdered ? 'Order' : 'Unorder'}
//             </span>
//             {isRound && (
//               <span style={{ background: '#e8f0fe', color: '#1a73e8', borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, border: '1px solid #c5d8fa', whiteSpace: 'nowrap' }}>
//                 🔁 Round
//               </span>
//             )}
//             {isCyclic && (
//               <span style={{ background: '#f3e8fd', color: '#9334e6', borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, border: '1px solid #e1c4fa', whiteSpace: 'nowrap' }}>
//                 🔄 Cyclic
//               </span>
//             )}
//           </div>

//           {/* Right: start date text + 3-dot menu */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
//             {startDate && (
//               <span style={{ fontSize: '11px', color: '#5f6368', whiteSpace: 'nowrap' }}>
//                 Start at {startDate}
//               </span>
//             )}
//             <CardMenu
//               onSelect={() => onSelect(s.id)}
//               onClone={() => onClone(s)}
//               onEdit={() => onEdit(s)}
//               onDelete={() => onDelete(s.id)}
//             />
//           </div>
//         </div>

//         {/* ── User row ── */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px 6px' }}>
//           <div style={{
//             width: '34px', height: '34px', borderRadius: '50%',
//             background: avatarClr.bg, color: avatarClr.text,
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: '13px', fontWeight: 700, flexShrink: 0,
//           }}>
//             {avatarChar}
//           </div>
//           <div style={{ minWidth: 0 }}>
//             <div style={{ fontSize: '14px', fontWeight: 700, color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
//             <div style={{ fontSize: '11px', color: '#5f6368' }}>{tripType || 'Trip type'}</div>
//           </div>
//         </div>

//         {/* ── Pills row: trip name, rounds, expiry, delay, zone ── */}
//         <div style={{ padding: '4px 14px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
//           {/* Trip name pill */}
//           <span style={{ background: '#f8f9fa', border: '1px solid #dadce0', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#3c4043', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
//             {tripName}
//           </span>
//           {(minRound != null || maxRound != null) && (
//             <span style={{ background: '#f0f4ff', border: '1px solid #c5d8fa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#1a73e8', fontWeight: 600, whiteSpace: 'nowrap' }}>
//               Rounds: {minRound ?? '—'}{maxRound != null ? ` – ${maxRound}` : ''}
//             </span>
//           )}
//           {expiredAt && (
//             <span style={{ background: '#fff8f0', border: '1px solid #ffcc80', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#e65100', fontWeight: 600, whiteSpace: 'nowrap' }}>
//               Exp: {expiredAt}
//             </span>
//           )}
//           {delayMins != null && (
//             <span style={{ background: '#f3e8fd', border: '1px solid #e1c4fa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#9334e6', fontWeight: 600, whiteSpace: 'nowrap' }}>
//               ⏱ {delayMins} min
//             </span>
//           )}
//           {zone && (
//             <span style={{ background: '#e6f4ea', border: '1px solid #b7e1c8', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#1e8e3e', fontWeight: 600, whiteSpace: 'nowrap' }}>
//               📍 {zone}
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function ScheduleForm() {
//   const [form, setForm]               = useState(blank)
//   const [saved, setSaved]             = useState([])
//   const [busy, setBusy]               = useState(false)
//   const [sel, setSel]                 = useState(null)
//   const [confirm, setConfirm]         = useState(false)
//   const [showSaved, setShowSaved]     = useState(true)
//   const [selectMode, setSelectMode]   = useState(false)
//   const [selectedIds, setSelectedIds] = useState([])
//   const [loadingPanel, setLoadingPanel] = useState(false)
//   const [formError, setFormError]     = useState('')

//   const [zoneOptions, setZoneOptions]             = useState([])
//   const [userOptions, setUserOptions]             = useState([])
//   const [patrolTypeOptions, setPatrolTypeOptions] = useState([])
//   const [tripOptions, setTripOptions]             = useState([])

//   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
//   const toggleSelect    = (id) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
//   const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
//   const deleteSelected  = async () => {
//     for (const id of selectedIds) { try { await deleteSchedule(id) } catch {} }
//     setSaved(p => p.filter(s => !selectedIds.includes(s.id)))
//     setSelectMode(false); setSelectedIds([])
//   }

//   const loadSaved = async () => {
//     setLoadingPanel(true)
//     try {
//       const raw = await getSchedules()
//       setSaved(Array.isArray(raw) ? raw: [])
//     } catch {
//       setSaved([])
//     } finally {
//       setLoadingPanel(false)
//     }
//   }

//   useEffect(() => {
//     loadSaved()

//     getZoneFilter().then(records => {
//       setZoneOptions(records.map(r => ({
//         value: String(r.value ?? r.id ?? ''),
//         label: String(r.label || r.name || r.zoneName || r.zoneNameLong || r.l_name || ''),
//       })).filter(o => o.value && o.label))
//     }).catch(() => {})

//     getUserList().then(users => {
//       const opts = users.map(u => ({
//         value: String(u.id ?? ''),
//         label: String(u.userName || u.userid || ''),
//       })).filter(o => o.value && o.label)
//       setUserOptions([{ value: 'all', label: 'All' }, ...opts])
//     }).catch(() => {})

//     filterPatrolTypes('all').then(types => {
//       setPatrolTypeOptions(types.map(t => ({
//         value: String(t.id ?? ''),
//         label: String(t.patrolName || ''),
//       })).filter(o => o.value && o.label))
//     }).catch(() => {})

//     listTrips().then(list => {
//       setTripOptions(list.map(t => ({
//         value: String(t.id ?? t.value ?? ''),
//         label: String(t.lable || t.label || t.tripName || t.name || t.trip_name || ''),
//       })).filter(o => o.value && o.label))
//     }).catch(() => {})
//   }, [])

//   useEffect(() => {
//     if (typeof window === 'undefined') return
//     const onZones = () => getZoneFilter().then(records => {
//       setZoneOptions(records.map(r => ({ value: String(r.value ?? r.id ?? ''), label: String(r.label || r.name || r.zoneName || '') })).filter(o => o.value && o.label))
//     }).catch(() => {})
//     const onTrips = () => listTrips().then(list => {
//       setTripOptions(list.map(t => ({ value: String(t.id ?? t.value ?? ''), label: String(t.lable || t.label || t.tripName || t.name || '') })).filter(o => o.value && o.label))
//     }).catch(() => {})
//     window.addEventListener('zones-updated', onZones)
//     window.addEventListener('trips-updated', onTrips)
//     return () => { window.removeEventListener('zones-updated', onZones); window.removeEventListener('trips-updated', onTrips) }
//   }, [])

//   const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

//   function buildPayload(f) {
//     const roundUsed  = !!f.minRound
//     const cyclicUsed = !!f.delay_mins
//     const payload = {
//       zone:            f.zoneId       ? [String(f.zoneId)]       : [],
//       user:            (!f.userId || f.userId === 'all') ? ['all'] : [String(f.userId)],
//       patrol_type:     f.patrolTypeId ? [String(f.patrolTypeId)] : [],
//       trip:            Number(f.tripId) || 0,
//       start_date_time: formatDateTime(f.startDate, f.startTime),
//       end_date_time:   formatDateTime(f.endDate,   f.endTime),
//       order:           f.ordered ? 1 : 0,
//     }
//     if (roundUsed) {
//       payload.is_round  = 1
//       payload.min_round = Number(f.minRound)
//       payload.max_round = f.maxRound ? Number(f.maxRound) : null
//     }
//     if (cyclicUsed) {
//       payload.is_cyclic    = 1
//       payload.delay_mins   = Number(f.delay_mins)
//       payload.expired_date = f.expiredDate
//         ? `${f.expiredDate} 00:00:00`
//         : formatDateTime(f.endDate, f.endTime)
//     }
//     return payload
//   }

//   function apiRecordToForm(s) {
//     const userId  = s.user_id != null ? String(s.user_id) : ''
//     const userOpt = userOptions.find(o => String(o.value) === userId)
//     const tripOpt = tripOptions.find(o => String(o.value) === String(s.trip_id ?? ''))
//     const zoneId  = Array.isArray(s.zone) ? (s.zone[0] || '') : (s.zone ? String(s.zone) : '')
//     const zoneOpt = zoneOptions.find(o => String(o.value) === String(zoneId))
//     const ptId    = s.patrol_type_id ? String(s.patrol_type_id) : ''
//     const ptOpt   = patrolTypeOptions.find(o => String(o.value) === ptId)
//     return {
//       zoneId,         zoneName:       zoneOpt?.label        || zoneId,
//       userId,         employeeName:   userOpt?.label        || safeStr(s.user),
//       patrolTypeId:   ptId,
//       patrolTypeName: ptOpt?.label   || safeStr(s.trip_type),
//       tripId:         s.trip_id != null ? String(s.trip_id) : '',
//       tripName:       tripOpt?.label || safeStr(s.trip_name),
//       startDate:      safeStr(s.start_date),
//       startTime:      safeStr(s.start_time).replace(/ (AM|PM)$/i, ''),
//       endDate:        safeStr(s.start_date),
//       endTime:        safeStr(s.end_time).replace(/ (AM|PM)$/i, ''),
//       ordered:        Number(s.is_order) !== 0,
//       minRound:       naVal(s.min_round)  != null ? String(s.min_round)  : '',
//       maxRound:       naVal(s.max_round)  != null ? String(s.max_round)  : '',
//       delay_mins:     naVal(s.delay_mins) != null ? String(s.delay_mins) : '',
//       expiredDate:    safeStr(s.expired_at),
//     }
//   }

//   const handleClone = (item) => { setForm(apiRecordToForm(item)); setSel(null) }
//   const handleEdit  = (item) => { setForm(apiRecordToForm(item)); setSel(item.id) }

//   const handleSaveClick = () => {
//     setFormError('')
//     const f = form
//     if (!f.tripId)    return setFormError('Please select a Trip.')
//     if (!f.startDate) return setFormError('Please set a Start Date.')
//     if (!f.startTime) return setFormError('Please set a Start Time.')
//     if (!f.endDate)   return setFormError('Please set an End Date.')
//     if (!f.endTime)   return setFormError('Please set an End Time.')
//     const roundTouched  = !!(f.minRound  || f.maxRound)
//     const cyclicTouched = !!(f.delay_mins || f.expiredDate)
//     if (!roundTouched && !cyclicTouched) {
//       return setFormError('Please fill in Round or Cyclic details (or both) before saving.')
//     }
//     if (f.maxRound && !f.minRound) {
//       return setFormError('You entered a Maximum Round — please also enter Minimum Round.')
//     }
//     if (f.delay_mins && !f.expiredDate) {
//       return setFormError('You entered a Restart Time — please also enter the Expiry Date.')
//     }
//     if (f.expiredDate && !f.delay_mins) {
//       return setFormError('You entered an Expiry Date — please also enter the Restart Time.')
//     }
//     setConfirm(true)
//   }

//   const handleConfirmed = async () => {
//     setBusy(true)
//     const payload = buildPayload(form)
//     try {
//       if (sel) {
//         await updateSchedule(sel, payload)
//         await loadSaved()
//         setSel(null); setForm(blank)
//       } else {
//         await createSchedule(payload)
//         await loadSaved()
//         setForm(blank)
//       }
//     } catch (err) {
//       console.error('[ScheduleForm] save error:', err)
//       if (sel) { setSaved(p => p.map(s => s.id === sel ? { ...s, ...payload, id: sel } : s)); setSel(null); setForm(blank) }
//     }
//     setBusy(false); setConfirm(false)
//   }

//   const handleDelete = async (id) => {
//     try { await deleteSchedule(id) } catch {}
//     setSaved(p => p.filter(s => s.id !== id))
//     if (sel === id) { setForm(blank); setSel(null) }
//   }

//   const summary = [
//     { label: 'Zone',         value: form.zoneName       },
//     { label: 'Employee',     value: form.employeeName   },
//     { label: 'Patrol Type',  value: form.patrolTypeName },
//     { label: 'Trip',         value: form.tripName       },
//     { label: 'Start',        value: `${form.startDate} ${form.startTime}` },
//     { label: 'End',          value: `${form.endDate} ${form.endTime}`     },
//     { label: 'Order',        value: form.ordered ? 'ORDER' : 'UNORDER'   },
//     ...(form.minRound    ? [{ label: 'Min Round',    value: form.minRound }]             : []),
//     ...(form.maxRound    ? [{ label: 'Max Round',    value: form.maxRound }]             : []),
//     ...(form.delay_mins  ? [{ label: 'Restart Time', value: `${form.delay_mins} mins` }] : []),
//     ...(form.expiredDate ? [{ label: 'Expiry Date',  value: form.expiredDate }]          : []),
//   ]

//   const inp = {
//     padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px',
//     fontSize: '12px', outline: 'none', flex: 1, minWidth: '120px', boxSizing: 'border-box',
//   }

//   return (
//     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
//       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

//       {/* ═══ LEFT PANEL ═══ */}
//       <div style={{ flex: '0 0 55%', width: '55%', maxWidth: '55%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '20px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
//         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0 }}>
//           {sel ? 'Edit Schedule' : 'Create Schedule'}
//         </h2>

//         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>

//           <div style={{ display: 'flex', gap: '12px' }}>
//             <FieldDropdown label="Zone" displayValue={form.zoneName}
//               onSelect={opt => setForm(p => ({ ...p, zoneId: opt.value, zoneName: opt.label }))} options={zoneOptions} />
//             <FieldDropdown label="Employee" displayValue={form.employeeName}
//               onSelect={opt => setForm(p => ({ ...p, userId: opt.value, employeeName: opt.label }))} options={userOptions} />
//           </div>

//           <div style={{ display: 'flex', gap: '12px' }}>
//             <FieldDropdown label="Patrol Type" displayValue={form.patrolTypeName}
//               onSelect={opt => setForm(p => ({ ...p, patrolTypeId: opt.value, patrolTypeName: opt.label }))} options={patrolTypeOptions} />
//             <FieldDropdown label="Trip" displayValue={form.tripName}
//               onSelect={opt => setForm(p => ({ ...p, tripId: opt.value, tripName: opt.label }))} options={tripOptions} />
//           </div>

//           <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
//             <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}
//               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
//             <input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)}
//               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
//             <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
//             <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)}
//               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
//             <input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)}
//               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
//             <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
//           </div>

//           <div style={{ display: 'flex', gap: '12px' }}>
//             <button onClick={() => set('ordered', true)}
//               style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '4px', background: form.ordered ? '#1a73e8' : '#f8f9fa', color: form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
//               Order
//             </button>
//             <button onClick={() => set('ordered', false)}
//               style={{ flex: 1, padding: '10px', border: '1px solid #dadce0', borderRadius: '4px', background: !form.ordered ? '#1a73e8' : 'transparent', color: !form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
//               Unorder
//             </button>
//           </div>

//           <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #e8eaed', flexWrap: 'wrap' }}>
//             <span style={{ fontSize: '13px', fontWeight: 500, color: '#202124', flexShrink: 0, minWidth: '48px' }}>Round</span>
//             <input type="number" min="0" placeholder="Minimum Round"
//               value={form.minRound} onChange={e => set('minRound', e.target.value)}
//               style={inp} />
//             <input type="number" min="0" placeholder="Maximum Round"
//               value={form.maxRound} onChange={e => set('maxRound', e.target.value)}
//               style={inp} />
//           </div>

//           <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
//             <span style={{ fontSize: '13px', fontWeight: 500, color: '#202124', flexShrink: 0, minWidth: '48px' }}>Cyclic</span>
//             <input type="number" min="0" placeholder="Restart Time (mins)"
//               value={form.delay_mins} onChange={e => set('delay_mins', e.target.value)}
//               style={inp} />
//             <input type="date" placeholder="Expiry Date"
//               value={form.expiredDate} onChange={e => set('expiredDate', e.target.value)}
//               style={inp} />
//           </div>
//         </div>

//         {formError && (
//           <div style={{ color: '#d93025', fontSize: '12px', paddingTop: '8px' }}>⚠ {formError}</div>
//         )}

//         <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', gap: '8px' }}>
//           {sel && (
//             <button onClick={() => { setForm(blank); setSel(null) }}
//               style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '4px', background: '#f8f9fa', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
//               Cancel
//             </button>
//           )}
//           <button onClick={handleSaveClick}
//             style={{ padding: '10px 32px', border: 'none', borderRadius: '4px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
//             Save
//           </button>
//         </div>
//       </div>

//       {/* ═══ RIGHT PANEL ═══ */}
//       <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

//         {/* Right header */}
//         <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
//           {selectMode ? (
//             <>
//               <div onClick={() => {
//                 if (selectedIds.length === saved.length) setSelectedIds([])
//                 else setSelectedIds(saved.map(s => s.id))
//               }}
//                 style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
//                 {selectedIds.length === saved.length
//                   ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
//                   : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
//               </div>
//               <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
//                 {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Schedule'}
//               </h2>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
//                 <button onClick={deleteSelected} disabled={selectedIds.length === 0}
//                   style={{ display: 'flex', alignItems: 'center', gap: '4px', background: selectedIds.length > 0 ? '#fce8e6' : '#f5f5f5', border: 'none', color: selectedIds.length > 0 ? '#d93025' : '#bbb', fontSize: '12px', fontWeight: 600, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', padding: '5px 10px', borderRadius: '4px' }}>
//                   🗑 Delete
//                 </button>
//                 <button onClick={cancelSelect} style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: '12px', cursor: 'pointer', padding: '5px 8px' }}>✕ Cancel</button>
//               </div>
//             </>
//           ) : (
//             <>
//               {showSaved && (
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0 }}>Saved Schedule</h2>
//                   {saved.length > 0 && (
//                     <span style={{ background: '#e8f0fe', color: '#1a73e8', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>{saved.length}</span>
//                   )}
//                 </div>
//               )}
//               <button onClick={() => setShowSaved(v => !v)}
//                 style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
//                 {showSaved ? '⊏' : '⊐'}
//               </button>
//             </>
//           )}
//         </div>

//         {showSaved && (
//           <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
//             {loadingPanel && (
//               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '24px' }}>Loading…</div>
//             )}

//             {!loadingPanel && saved.map((s, idx) => (
//               <ScheduleCard
//                 key={s.id}
//                 s={s}
//                 idx={idx}
//                 isChecked={selectedIds.includes(s.id)}
//                 selectMode={selectMode}
//                 onToggleSelect={toggleSelect}
//                 onSelect={enterSelectMode}
//                 onClone={handleClone}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             ))}

//             {!loadingPanel && saved.length === 0 && (
//               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No schedules saved yet.</div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// import { useState, useEffect, useRef } from 'react'
// import {
//   getSchedules,
//   createSchedule,
//   deleteSchedule,
//   updateSchedule,
//   getZoneFilter,
//   getUserList,
//   listTrips,
//   filterPatrolTypes,
// } from '../../../api'
// import { ConfirmSaveModal } from '../components/MasterFormUI'

// /* ── Custom 3-dot menu ── */
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
//       <button
//         onClick={() => setOpen((o) => !o)}
//         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontSize: '20px', color: '#5f6368', lineHeight: 1, borderRadius: '4px' }}
//       >⋮</button>
//       {open && (
//         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
//           {items.map(({ label, icon, color, action }) => (
//             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
//               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
//               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
//               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
//             >
//               <span style={{ fontSize: '14px' }}>{icon}</span> {label}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// /* ── blank form ── */
// const blank = {
//   zoneId: '', zoneName: '',
//   userId: '', employeeName: '',
//   patrolTypeId: '', patrolTypeName: '',
//   tripId: '', tripName: '',
//   startDate: '', startTime: '',
//   endDate: '', endTime: '',
//   ordered: true,
//   minRound: '', maxRound: '',
//   delay_mins: '', expiredDate: '',
// }

// /* ── Custom searchable dropdown ── */
// function FieldDropdown({ label, displayValue, onSelect, options }) {
//   const [open, setOpen] = useState(false)
//   const [search, setSearch] = useState('')
//   const ref = useRef(null)
//   useEffect(() => {
//     const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
//     document.addEventListener('mousedown', handler)
//     return () => document.removeEventListener('mousedown', handler)
//   }, [])
//   const filtered = options.filter(opt => (opt.label || '').toLowerCase().includes(search.toLowerCase()))
//   return (
//     <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
//       {label && <label style={{ fontSize: '11px', fontWeight: 500, color: '#5f6368' }}>{label}</label>}
//       <div ref={ref} style={{ position: 'relative' }}>
//         <div style={{ display: 'flex' }}>
//           <input type="text" placeholder={label}
//             value={open ? search : (displayValue || '')}
//             onChange={(e) => { setSearch(e.target.value); setOpen(true) }}
//             onFocus={() => { setSearch(''); setOpen(true) }}
//             style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '4px 0 0 4px', fontSize: '13px', color: '#202124', outline: 'none', height: '38px', boxSizing: 'border-box' }}
//           />
//           <button type="button" onClick={() => { setSearch(''); setOpen((o) => !o) }}
//             style={{ width: '38px', height: '38px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 4px 4px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
//           >+</button>
//         </div>
//         {open && (
//           <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
//             {filtered.length === 0
//               ? <div style={{ padding: '8px 12px', fontSize: '13px', color: '#9aa0a6' }}>No options</div>
//               : filtered.map((opt) => (
//                 <div key={opt.value} onMouseDown={() => { onSelect(opt); setSearch(''); setOpen(false) }}
//                   style={{ padding: '8px 12px', fontSize: '13px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
//                   onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
//                   onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
//                 >{opt.label}</div>
//               ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// /* ── helpers ── */
// function formatDateTime(date, time) {
//   if (!date) return ''
//   return `${date} ${time ? time + ':00' : '00:00:00'}`
// }
// function naVal(v) {
//   if (v == null || v === 'N/A' || v === '') return null
//   return v
// }
// function safeStr(v, fallback = '') {
//   if (v == null || v === 'N/A') return fallback
//   return String(v)
// }
// function extractRecords(raw) {
//   if (Array.isArray(raw?.data?.records)) return raw.data.records
//   if (Array.isArray(raw?.records))       return raw.records
//   if (Array.isArray(raw))                return raw
//   return []
// }

// /* ── Avatar color palette ── */
// const avatarColors = [
//   { bg: '#e8f0fe', text: '#1a73e8' },
//   { bg: '#fce8e6', text: '#d93025' },
//   { bg: '#e6f4ea', text: '#1e8e3e' },
//   { bg: '#fef7e0', text: '#f29900' },
//   { bg: '#f3e8fd', text: '#9334e6' },
//   { bg: '#e8f5e9', text: '#388e3c' },
//   { bg: '#fff3e0', text: '#e65100' },
//   { bg: '#e3f2fd', text: '#1565c0' },
// ]

// /* ── Schedule Card ── */
// function ScheduleCard({ s, idx, isChecked, selectMode, onToggleSelect, onSelect, onClone, onEdit, onDelete }) {
//   const isOrdered  = Number(s.is_order) === 1
//   const isRound    = Number(s.is_round) === 1
//   const isCyclic   = naVal(s.delay_mins) != null
//   const avatarClr  = avatarColors[idx % avatarColors.length]
//   const userName   = safeStr(s.user, '—')
//   const tripName   = safeStr(s.trip_name) || `Trip #${s.trip_id ?? ''}`
//   const tripType   = naVal(s.trip_type) ? safeStr(s.trip_type) : null
//   const minRound   = naVal(s.min_round)
//   const maxRound   = naVal(s.max_round)
//   const delayMins  = naVal(s.delay_mins)
//   const expiredAt  = naVal(s.expired_at)
//   const startDate  = safeStr(s.start_date)
//   const startTime  = safeStr(s.start_time)
//   const endTime    = safeStr(s.end_time)
//   const avatarChar = userName.charAt(0).toUpperCase() || '?'
//   const zone       = (() => {
//     if (Array.isArray(s.zone)) return s.zone.filter(Boolean).join(', ') || null
//     return naVal(s.zone) ? String(s.zone) : null
//   })()

//   /* Format "10:00 AM to 4:00 PM" style time range */
//   const timeRange = (startTime && endTime) ? `${startTime} — ${endTime}` : (startTime || endTime || '')

//   return (
//     <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
//       {selectMode && (
//         <div onClick={() => onToggleSelect(s.id)}
//           style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
//           {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
//         </div>
//       )}

//       <div style={{
//         flex: 1, minWidth: 0,
//         border: `1.5px solid ${isChecked ? '#1a73e8' : '#e8eaed'}`,
//         borderRadius: '14px',
//         background: '#fff',
//         boxShadow: '0 1px 4px rgba(60,64,67,0.08)',
//         overflow: 'hidden',
//       }}>

//         {/* ── Top time/order bar ── */}
//         <div style={{
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           padding: '8px 14px',
//           background: isOrdered ? '#f0faf4' : '#fff8f0',
//           borderBottom: `1px solid ${isOrdered ? '#d4edda' : '#ffe0b2'}`,
//           flexWrap: 'wrap', gap: '6px',
//         }}>
//           {/* Left: time range + date */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minWidth: 0 }}>
//             {timeRange && (
//               <span style={{ fontSize: '12px', fontWeight: 600, color: '#3c4043' }}>{timeRange}</span>
//             )}
//             <span style={{
//               display: 'inline-flex', alignItems: 'center', gap: '3px',
//               background: isOrdered ? '#1e8e3e' : '#e65100',
//               color: '#fff', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 700,
//             }}>
//               {isOrdered ? 'Order' : 'Unorder'}
//             </span>
//             {isRound && (
//               <span style={{ background: '#e8f0fe', color: '#1a73e8', borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, border: '1px solid #c5d8fa' }}>
//                 🔁 Round
//               </span>
//             )}
//             {isCyclic && (
//               <span style={{ background: '#f3e8fd', color: '#9334e6', borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, border: '1px solid #e1c4fa' }}>
//                 🔄 Cyclic
//               </span>
//             )}
//           </div>

//           {/* Right: start date + menu */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
//             <CardMenu
//               onSelect={() => onSelect(s.id)}
//               onClone={() => onClone(s)}
//               onEdit={() => onEdit(s)}
//               onDelete={() => onDelete(s.id)}
//             />
//           </div>
//         </div>

//         {/* ── User row ── */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px 6px' }}>
//           <div style={{
//             width: '34px', height: '34px', borderRadius: '50%',
//             background: avatarClr.bg, color: avatarClr.text,
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: '13px', fontWeight: 700, flexShrink: 0,
//           }}>
//             {avatarChar}
//           </div>
//           <div style={{ minWidth: 0 }}>
//             <div style={{ fontSize: '14px', fontWeight: 700, color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
//             {tripType && <div style={{ fontSize: '11px', color: '#5f6368' }}>{tripType}</div>}
//           </div>
//         </div>

//         {/* ── Trip name ── */}
//         <div style={{ padding: '2px 14px 8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
//           <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a73e8' }}>🗺 {tripName}</span>
//         </div>

//         {/* ── Pills row: rounds, expiry, delay ── */}
//         <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
//           {(minRound != null || maxRound != null) && (
//             <span style={{ background: '#f0f4ff', border: '1px solid #c5d8fa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#1a73e8', fontWeight: 600 }}>
//               Rounds: {minRound ?? '—'}
//               {maxRound != null ? ` – ${maxRound}` : ''}
//             </span>
//           )}
//           {expiredAt && (
//             <span style={{ background: '#fff8f0', border: '1px solid #ffcc80', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#e65100', fontWeight: 600 }}>
//               Exp: {expiredAt}
//             </span>
//           )}
//           {delayMins != null && (
//             <span style={{ background: '#f3e8fd', border: '1px solid #e1c4fa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#9334e6', fontWeight: 600 }}>
//               ⏱ Restart: {delayMins} min
//             </span>
//           )}
//           {zone && (
//             <span style={{ background: '#e6f4ea', border: '1px solid #b7e1c8', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#1e8e3e', fontWeight: 600 }}>
//               📍 {zone}
//             </span>
//           )}
//         </div>

//         {/* ── Footer: created / updated ── */}
//         {(s.created_at || naVal(s.updated_at)) && (
//           <div style={{ padding: '6px 14px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
//             {s.created_at && (
//               <span style={{ fontSize: '10px', color: '#9aa0a6' }}>Created: {safeStr(s.created_at)}</span>
//             )}
//             {naVal(s.updated_at) && (
//               <span style={{ fontSize: '10px', color: '#9aa0a6' }}>Updated: {safeStr(s.updated_at)}</span>
//             )}
//             {startDate && (
//               <span style={{ fontSize: '11px', color: '#5f6368' }}>Start {startDate}</span>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default function ScheduleForm() {
//   const [form, setForm]               = useState(blank)
//   const [saved, setSaved]             = useState([])
//   const [busy, setBusy]               = useState(false)
//   const [sel, setSel]                 = useState(null)
//   const [confirm, setConfirm]         = useState(false)
//   const [showSaved, setShowSaved]     = useState(true)
//   const [selectMode, setSelectMode]   = useState(false)
//   const [selectedIds, setSelectedIds] = useState([])
//   const [loadingPanel, setLoadingPanel] = useState(false)
//   const [formError, setFormError]     = useState('')

//   const [zoneOptions, setZoneOptions]             = useState([])
//   const [userOptions, setUserOptions]             = useState([])
//   const [patrolTypeOptions, setPatrolTypeOptions] = useState([])
//   const [tripOptions, setTripOptions]             = useState([])

//   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
//   const toggleSelect    = (id) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
//   const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
//   const deleteSelected  = async () => {
//     for (const id of selectedIds) { try { await deleteSchedule(id) } catch {} }
//     setSaved(p => p.filter(s => !selectedIds.includes(s.id)))
//     setSelectMode(false); setSelectedIds([])
//   }

//   const loadSaved = async () => {
//     setLoadingPanel(true)
//     try {
//       const raw = await getSchedules()
//       setSaved(Array.isArray(raw) ? raw: [])
//     } catch {
//       setSaved([])
//     } finally {
//       setLoadingPanel(false)
//     }
//   }

//   useEffect(() => {
//     loadSaved()

//     getZoneFilter().then(records => {
//       setZoneOptions(records.map(r => ({
//         value: String(r.value ?? r.id ?? ''),
//         label: String(r.label || r.name || r.zoneName || r.zoneNameLong || r.l_name || ''),
//       })).filter(o => o.value && o.label))
//     }).catch(() => {})

//     getUserList().then(users => {
//       const opts = users.map(u => ({
//         value: String(u.id ?? ''),
//         label: String(u.userName || u.userid || ''),
//       })).filter(o => o.value && o.label)
//       setUserOptions([{ value: 'all', label: 'All' }, ...opts])
//     }).catch(() => {})

//     filterPatrolTypes('all').then(types => {
//       setPatrolTypeOptions(types.map(t => ({
//         value: String(t.id ?? ''),
//         label: String(t.patrolName || ''),
//       })).filter(o => o.value && o.label))
//     }).catch(() => {})

//     listTrips().then(list => {
//       setTripOptions(list.map(t => ({
//         value: String(t.id ?? t.value ?? ''),
//         label: String(t.lable || t.label || t.tripName || t.name || t.trip_name || ''),
//       })).filter(o => o.value && o.label))
//     }).catch(() => {})
//   }, [])

//   useEffect(() => {
//     if (typeof window === 'undefined') return
//     const onZones = () => getZoneFilter().then(records => {
//       setZoneOptions(records.map(r => ({ value: String(r.value ?? r.id ?? ''), label: String(r.label || r.name || r.zoneName || '') })).filter(o => o.value && o.label))
//     }).catch(() => {})
//     const onTrips = () => listTrips().then(list => {
//       setTripOptions(list.map(t => ({ value: String(t.id ?? t.value ?? ''), label: String(t.lable || t.label || t.tripName || t.name || '') })).filter(o => o.value && o.label))
//     }).catch(() => {})
//     window.addEventListener('zones-updated', onZones)
//     window.addEventListener('trips-updated', onTrips)
//     return () => { window.removeEventListener('zones-updated', onZones); window.removeEventListener('trips-updated', onTrips) }
//   }, [])

//   const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

//   function buildPayload(f) {
//     const roundUsed  = !!f.minRound
//     const cyclicUsed = !!f.delay_mins
//     const payload = {
//       zone:            f.zoneId       ? [String(f.zoneId)]       : [],
//       user:            (!f.userId || f.userId === 'all') ? ['all'] : [String(f.userId)],
//       patrol_type:     f.patrolTypeId ? [String(f.patrolTypeId)] : [],
//       trip:            Number(f.tripId) || 0,
//       start_date_time: formatDateTime(f.startDate, f.startTime),
//       end_date_time:   formatDateTime(f.endDate,   f.endTime),
//       order:           f.ordered ? 1 : 0,
//     }
//     if (roundUsed) {
//       payload.is_round  = 1
//       payload.min_round = Number(f.minRound)
//       payload.max_round = f.maxRound ? Number(f.maxRound) : null
//     }
//     if (cyclicUsed) {
//       payload.is_cyclic    = 1
//       payload.delay_mins   = Number(f.delay_mins)
//       payload.expired_date = f.expiredDate
//         ? `${f.expiredDate} 00:00:00`
//         : formatDateTime(f.endDate, f.endTime)
//     }
//     return payload
//   }

//   function apiRecordToForm(s) {
//     const userId  = s.user_id != null ? String(s.user_id) : ''
//     const userOpt = userOptions.find(o => String(o.value) === userId)
//     const tripOpt = tripOptions.find(o => String(o.value) === String(s.trip_id ?? ''))
//     const zoneId  = Array.isArray(s.zone) ? (s.zone[0] || '') : (s.zone ? String(s.zone) : '')
//     const zoneOpt = zoneOptions.find(o => String(o.value) === String(zoneId))
//     const ptId    = s.patrol_type_id ? String(s.patrol_type_id) : ''
//     const ptOpt   = patrolTypeOptions.find(o => String(o.value) === ptId)
//     return {
//       zoneId,         zoneName:       zoneOpt?.label        || zoneId,
//       userId,         employeeName:   userOpt?.label        || safeStr(s.user),
//       patrolTypeId:   ptId,
//       patrolTypeName: ptOpt?.label   || safeStr(s.trip_type),
//       tripId:         s.trip_id != null ? String(s.trip_id) : '',
//       tripName:       tripOpt?.label || safeStr(s.trip_name),
//       startDate:      safeStr(s.start_date),
//       startTime:      safeStr(s.start_time).replace(/ (AM|PM)$/i, ''),
//       endDate:        safeStr(s.start_date),
//       endTime:        safeStr(s.end_time).replace(/ (AM|PM)$/i, ''),
//       ordered:        Number(s.is_order) !== 0,
//       minRound:       naVal(s.min_round)  != null ? String(s.min_round)  : '',
//       maxRound:       naVal(s.max_round)  != null ? String(s.max_round)  : '',
//       delay_mins:     naVal(s.delay_mins) != null ? String(s.delay_mins) : '',
//       expiredDate:    safeStr(s.expired_at),
//     }
//   }

//   const handleClone = (item) => { setForm(apiRecordToForm(item)); setSel(null) }
//   const handleEdit  = (item) => { setForm(apiRecordToForm(item)); setSel(item.id) }

//   const handleSaveClick = () => {
//     setFormError('')
//     const f = form
//     if (!f.tripId)    return setFormError('Please select a Trip.')
//     if (!f.startDate) return setFormError('Please set a Start Date.')
//     if (!f.startTime) return setFormError('Please set a Start Time.')
//     if (!f.endDate)   return setFormError('Please set an End Date.')
//     if (!f.endTime)   return setFormError('Please set an End Time.')
//     const roundTouched  = !!(f.minRound  || f.maxRound)
//     const cyclicTouched = !!(f.delay_mins || f.expiredDate)
//     if (!roundTouched && !cyclicTouched) {
//       return setFormError('Please fill in Round or Cyclic details (or both) before saving.')
//     }
//     if (f.maxRound && !f.minRound) {
//       return setFormError('You entered a Maximum Round — please also enter Minimum Round.')
//     }
//     if (f.delay_mins && !f.expiredDate) {
//       return setFormError('You entered a Restart Time — please also enter the Expiry Date.')
//     }
//     if (f.expiredDate && !f.delay_mins) {
//       return setFormError('You entered an Expiry Date — please also enter the Restart Time.')
//     }
//     setConfirm(true)
//   }

//   const handleConfirmed = async () => {
//     setBusy(true)
//     const payload = buildPayload(form)
//     try {
//       if (sel) {
//         await updateSchedule(sel, payload)
//         await loadSaved()
//         setSel(null); setForm(blank)
//       } else {
//         await createSchedule(payload)
//         await loadSaved()
//         setForm(blank)
//       }
//     } catch (err) {
//       console.error('[ScheduleForm] save error:', err)
//       if (sel) { setSaved(p => p.map(s => s.id === sel ? { ...s, ...payload, id: sel } : s)); setSel(null); setForm(blank) }
//     }
//     setBusy(false); setConfirm(false)
//   }

//   const handleDelete = async (id) => {
//     try { await deleteSchedule(id) } catch {}
//     setSaved(p => p.filter(s => s.id !== id))
//     if (sel === id) { setForm(blank); setSel(null) }
//   }

//   const summary = [
//     { label: 'Zone',         value: form.zoneName       },
//     { label: 'Employee',     value: form.employeeName   },
//     { label: 'Patrol Type',  value: form.patrolTypeName },
//     { label: 'Trip',         value: form.tripName       },
//     { label: 'Start',        value: `${form.startDate} ${form.startTime}` },
//     { label: 'End',          value: `${form.endDate} ${form.endTime}`     },
//     { label: 'Order',        value: form.ordered ? 'ORDER' : 'UNORDER'   },
//     ...(form.minRound    ? [{ label: 'Min Round',    value: form.minRound }]             : []),
//     ...(form.maxRound    ? [{ label: 'Max Round',    value: form.maxRound }]             : []),
//     ...(form.delay_mins  ? [{ label: 'Restart Time', value: `${form.delay_mins} mins` }] : []),
//     ...(form.expiredDate ? [{ label: 'Expiry Date',  value: form.expiredDate }]          : []),
//   ]

//   const inp = {
//     padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px',
//     fontSize: '12px', outline: 'none', flex: 1, minWidth: '120px', boxSizing: 'border-box',
//   }

//   return (
//     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
//       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

//       {/* ═══ LEFT PANEL ═══ */}
//       <div style={{ flex: '0 0 55%', width: '55%', maxWidth: '55%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '20px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
//         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0 }}>
//           {sel ? 'Edit Schedule' : 'Create Schedule'}
//         </h2>

//         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>

//           <div style={{ display: 'flex', gap: '12px' }}>
//             <FieldDropdown label="Zone" displayValue={form.zoneName}
//               onSelect={opt => setForm(p => ({ ...p, zoneId: opt.value, zoneName: opt.label }))} options={zoneOptions} />
//             <FieldDropdown label="Employee" displayValue={form.employeeName}
//               onSelect={opt => setForm(p => ({ ...p, userId: opt.value, employeeName: opt.label }))} options={userOptions} />
//           </div>

//           <div style={{ display: 'flex', gap: '12px' }}>
//             <FieldDropdown label="Patrol Type" displayValue={form.patrolTypeName}
//               onSelect={opt => setForm(p => ({ ...p, patrolTypeId: opt.value, patrolTypeName: opt.label }))} options={patrolTypeOptions} />
//             <FieldDropdown label="Trip" displayValue={form.tripName}
//               onSelect={opt => setForm(p => ({ ...p, tripId: opt.value, tripName: opt.label }))} options={tripOptions} />
//           </div>

//           <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
//             <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}
//               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
//             <input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)}
//               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
//             <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
//             <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)}
//               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
//             <input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)}
//               style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
//             <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
//           </div>

//           <div style={{ display: 'flex', gap: '12px' }}>
//             <button onClick={() => set('ordered', true)}
//               style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '4px', background: form.ordered ? '#1a73e8' : '#f8f9fa', color: form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
//               Order
//             </button>
//             <button onClick={() => set('ordered', false)}
//               style={{ flex: 1, padding: '10px', border: '1px solid #dadce0', borderRadius: '4px', background: !form.ordered ? '#1a73e8' : 'transparent', color: !form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
//               Unorder
//             </button>
//           </div>

//           <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #e8eaed', flexWrap: 'wrap' }}>
//             <span style={{ fontSize: '13px', fontWeight: 500, color: '#202124', flexShrink: 0, minWidth: '48px' }}>Round</span>
//             <input type="number" min="0" placeholder="Minimum Round"
//               value={form.minRound} onChange={e => set('minRound', e.target.value)}
//               style={inp} />
//             <input type="number" min="0" placeholder="Maximum Round"
//               value={form.maxRound} onChange={e => set('maxRound', e.target.value)}
//               style={inp} />
//           </div>

//           <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
//             <span style={{ fontSize: '13px', fontWeight: 500, color: '#202124', flexShrink: 0, minWidth: '48px' }}>Cyclic</span>
//             <input type="number" min="0" placeholder="Restart Time (mins)"
//               value={form.delay_mins} onChange={e => set('delay_mins', e.target.value)}
//               style={inp} />
//             <input type="date" placeholder="Expiry Date"
//               value={form.expiredDate} onChange={e => set('expiredDate', e.target.value)}
//               style={inp} />
//           </div>
//         </div>

//         {formError && (
//           <div style={{ color: '#d93025', fontSize: '12px', paddingTop: '8px' }}>⚠ {formError}</div>
//         )}

//         <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', gap: '8px' }}>
//           {sel && (
//             <button onClick={() => { setForm(blank); setSel(null) }}
//               style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '4px', background: '#f8f9fa', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
//               Cancel
//             </button>
//           )}
//           <button onClick={handleSaveClick}
//             style={{ padding: '10px 32px', border: 'none', borderRadius: '4px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
//             Save
//           </button>
//         </div>
//       </div>

//       {/* ═══ RIGHT PANEL ═══ */}
//       <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

//         {/* Right header */}
//         <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
//           {selectMode ? (
//             <>
//               <div onClick={() => {
//                 if (selectedIds.length === saved.length) setSelectedIds([])
//                 else setSelectedIds(saved.map(s => s.id))
//               }}
//                 style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
//                 {selectedIds.length === saved.length
//                   ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
//                   : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
//               </div>
//               <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
//                 {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Schedule'}
//               </h2>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
//                 <button onClick={deleteSelected} disabled={selectedIds.length === 0}
//                   style={{ display: 'flex', alignItems: 'center', gap: '4px', background: selectedIds.length > 0 ? '#fce8e6' : '#f5f5f5', border: 'none', color: selectedIds.length > 0 ? '#d93025' : '#bbb', fontSize: '12px', fontWeight: 600, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', padding: '5px 10px', borderRadius: '4px' }}>
//                   🗑 Delete
//                 </button>
//                 <button onClick={cancelSelect} style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: '12px', cursor: 'pointer', padding: '5px 8px' }}>✕ Cancel</button>
//               </div>
//             </>
//           ) : (
//             <>
//               {showSaved && (
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0 }}>Saved Schedule</h2>
//                   {saved.length > 0 && (
//                     <span style={{ background: '#e8f0fe', color: '#1a73e8', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>{saved.length}</span>
//                   )}
//                 </div>
//               )}
//               <button onClick={() => setShowSaved(v => !v)}
//                 style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
//                 {showSaved ? '⊏' : '⊐'}
//               </button>
//             </>
//           )}
//         </div>

//         {showSaved && (
//           <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
//             {loadingPanel && (
//               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '24px' }}>Loading…</div>
//             )}

//             {!loadingPanel && saved.map((s, idx) => (
//               <ScheduleCard
//                 key={s.id}
//                 s={s}
//                 idx={idx}
//                 isChecked={selectedIds.includes(s.id)}
//                 selectMode={selectMode}
//                 onToggleSelect={toggleSelect}
//                 onSelect={enterSelectMode}
//                 onClone={handleClone}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             ))}

//             {!loadingPanel && saved.length === 0 && (
//               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No schedules saved yet.</div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

import { useState, useEffect, useRef } from 'react'
import {
  getSchedules,
  createSchedule,
  deleteSchedule,
  updateSchedule,
  getZoneFilter,
  getUserList,
  listTrips,
  filterPatrolTypes,
} from '../../../api'
import { ConfirmSaveModal } from '../components/MasterFormUI'
import PagePreviousIcon from '@rsuite/icons/PagePrevious'
import PageNextIcon     from '@rsuite/icons/PageNext'

/* ── Custom 3-dot menu ── */
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
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontSize: '20px', color: '#5f6368', lineHeight: 1, borderRadius: '4px' }}
      >⋮</button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
          {items.map(({ label, icon, color, action }) => (
            <div key={label} onMouseDown={() => { action(); setOpen(false) }}
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

/* ── blank form ── */
const blank = {
  zoneId: '', zoneName: '',
  userId: '', employeeName: '',
  patrolTypeId: '', patrolTypeName: '',
  tripId: '', tripName: '',
  startDate: '', startTime: '',
  endDate: '', endTime: '',
  ordered: true,
  minRound: '', maxRound: '',
  delay_mins: '', expiredDate: '',
}

/* ── Custom searchable dropdown ── */
function FieldDropdown({ label, displayValue, onSelect, options }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  const filtered = options.filter(opt => (opt.label || '').toLowerCase().includes(search.toLowerCase()))
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {label && <label style={{ fontSize: '11px', fontWeight: 500, color: '#5f6368' }}>{label}</label>}
      <div ref={ref} style={{ position: 'relative' }}>
        <div style={{ display: 'flex' }}>
          <input type="text" placeholder={label}
            value={open ? search : (displayValue || '')}
            onChange={(e) => { setSearch(e.target.value); setOpen(true) }}
            onFocus={() => { setSearch(''); setOpen(true) }}
            style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '4px 0 0 4px', fontSize: '13px', color: '#202124', outline: 'none', height: '38px', boxSizing: 'border-box' }}
          />
          <button type="button" onClick={() => { setSearch(''); setOpen((o) => !o) }}
            style={{ width: '38px', height: '38px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 4px 4px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
          >+</button>
        </div>
        {open && (
          <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
            {filtered.length === 0
              ? <div style={{ padding: '8px 12px', fontSize: '13px', color: '#9aa0a6' }}>No options</div>
              : filtered.map((opt) => (
                <div key={opt.value} onMouseDown={() => { onSelect(opt); setSearch(''); setOpen(false) }}
                  style={{ padding: '8px 12px', fontSize: '13px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                >{opt.label}</div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── helpers ── */
function formatDateTime(date, time) {
  if (!date) return ''
  return `${date} ${time ? time + ':00' : '00:00:00'}`
}
function naVal(v) {
  if (v == null || v === 'N/A' || v === '') return null
  return v
}
function safeStr(v, fallback = '') {
  if (v == null || v === 'N/A') return fallback
  return String(v)
}
function extractRecords(raw) {
  if (Array.isArray(raw?.data?.records)) return raw.data.records
  if (Array.isArray(raw?.records))       return raw.records
  if (Array.isArray(raw))                return raw
  return []
}

/* ── Avatar color palette ── */
const avatarColors = [
  { bg: '#e8f0fe', text: '#1a73e8' },
  { bg: '#fce8e6', text: '#d93025' },
  { bg: '#e6f4ea', text: '#1e8e3e' },
  { bg: '#fef7e0', text: '#f29900' },
  { bg: '#f3e8fd', text: '#9334e6' },
  { bg: '#e8f5e9', text: '#388e3c' },
  { bg: '#fff3e0', text: '#e65100' },
  { bg: '#e3f2fd', text: '#1565c0' },
]

/* ── Schedule Card ── */
function ScheduleCard({ s, idx, isChecked, selectMode, onToggleSelect, onSelect, onClone, onEdit, onDelete }) {
  const isOrdered  = Number(s.is_order) === 1
  const isRound    = Number(s.is_round) === 1
  const isCyclic   = naVal(s.delay_mins) != null
  const avatarClr  = avatarColors[idx % avatarColors.length]
  const userName   = safeStr(s.user, '—')
  const tripName   = safeStr(s.trip_name) || `Trip #${s.trip_id ?? ''}`
  const tripType   = naVal(s.trip_type) ? safeStr(s.trip_type) : null
  const minRound   = naVal(s.min_round)
  const maxRound   = naVal(s.max_round)
  const delayMins  = naVal(s.delay_mins)
  const expiredAt  = naVal(s.expired_at)
  const startDate  = safeStr(s.start_date)
  const startTime  = safeStr(s.start_time)
  const endTime    = safeStr(s.end_time)
  const avatarChar = userName.charAt(0).toUpperCase() || '?'
  const zone       = (() => {
    if (Array.isArray(s.zone)) return s.zone.filter(Boolean).join(', ') || null
    return naVal(s.zone) ? String(s.zone) : null
  })()

  /* Format "10:00 AM to 4:00 PM" style time range */
  const timeRange = (startTime && endTime) ? `${startTime} — ${endTime}` : (startTime || endTime || '')

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
      {selectMode && (
        <div onClick={() => onToggleSelect(s.id)}
          style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
        </div>
      )}

      <div style={{
        flex: 1, minWidth: 0,
        border: `1.5px solid ${isChecked ? '#1a73e8' : '#e8eaed'}`,
        borderRadius: '14px',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(60,64,67,0.08)',
        overflow: 'hidden',
      }}>

        {/* ── Top time/order bar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 14px',
          background: '#fff',
          borderBottom: '1px solid #e8eaed',
          gap: '6px',
        }}>
          {/* Left: time range + Order/Unorder badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minWidth: 0, flex: 1 }}>
            {timeRange && (
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#3c4043' }}>{timeRange}</span>
            )}
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              background: '#1e8e3e',
              color: '#fff', borderRadius: '5px', padding: '2px 9px', fontSize: '10px', fontWeight: 700,
              whiteSpace: 'nowrap',
            }}>
              {isOrdered ? 'Order' : 'Unorder'}
            </span>
            {isRound && (
              <span style={{ background: '#e8f0fe', color: '#1a73e8', borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, border: '1px solid #c5d8fa', whiteSpace: 'nowrap' }}>
                🔁 Round
              </span>
            )}
            {isCyclic && (
              <span style={{ background: '#f3e8fd', color: '#9334e6', borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: 700, border: '1px solid #e1c4fa', whiteSpace: 'nowrap' }}>
                🔄 Cyclic
              </span>
            )}
          </div>

          {/* Right: start date text + 3-dot menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            {startDate && (
              <span style={{ fontSize: '11px', color: '#5f6368', whiteSpace: 'nowrap' }}>
                Start at {startDate}
              </span>
            )}
            <CardMenu
              onSelect={() => onSelect(s.id)}
              onClone={() => onClone(s)}
              onEdit={() => onEdit(s)}
              onDelete={() => onDelete(s.id)}
            />
          </div>
        </div>

        {/* ── User row ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px 6px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: avatarClr.bg, color: avatarClr.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700, flexShrink: 0,
          }}>
            {avatarChar}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
            <div style={{ fontSize: '11px', color: '#5f6368' }}>{tripType || 'Trip type'}</div>
          </div>
        </div>

        {/* ── Pills row: trip name, rounds, expiry, delay, zone ── */}
        <div style={{ padding: '4px 14px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {/* Trip name pill */}
          <span style={{ background: '#f8f9fa', border: '1px solid #dadce0', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#3c4043', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
            {tripName}
          </span>
          {(minRound != null || maxRound != null) && (
            <span style={{ background: '#f0f4ff', border: '1px solid #c5d8fa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#1a73e8', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Rounds: {minRound ?? '—'}{maxRound != null ? ` – ${maxRound}` : ''}
            </span>
          )}
          {expiredAt && (
            <span style={{ background: '#fff8f0', border: '1px solid #ffcc80', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#e65100', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Exp: {expiredAt}
            </span>
          )}
          {delayMins != null && (
            <span style={{ background: '#f3e8fd', border: '1px solid #e1c4fa', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#9334e6', fontWeight: 600, whiteSpace: 'nowrap' }}>
              ⏱ {delayMins} min
            </span>
          )}
          {zone && (
            <span style={{ background: '#e6f4ea', border: '1px solid #b7e1c8', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#1e8e3e', fontWeight: 600, whiteSpace: 'nowrap' }}>
              📍 {zone}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ScheduleForm() {
  const [form, setForm]               = useState(blank)
  const [saved, setSaved]             = useState([])
  const [busy, setBusy]               = useState(false)
  const [sel, setSel]                 = useState(null)
  const [confirm, setConfirm]         = useState(false)
  const [showSaved, setShowSaved]     = useState(true)
  const [selectMode, setSelectMode]   = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [loadingPanel, setLoadingPanel] = useState(false)
  const [formError, setFormError]     = useState('')
  const PAGE_SIZE = 10
  const [page, setPage]               = useState(0)
  useEffect(() => { setPage(0) }, [saved.length])

  const [zoneOptions, setZoneOptions]             = useState([])
  const [userOptions, setUserOptions]             = useState([])
  const [patrolTypeOptions, setPatrolTypeOptions] = useState([])
  const [tripOptions, setTripOptions]             = useState([])

  const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
  const toggleSelect    = (id) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
  const deleteSelected  = async () => {
    for (const id of selectedIds) { try { await deleteSchedule(id) } catch {} }
    setSaved(p => p.filter(s => !selectedIds.includes(s.id)))
    setSelectMode(false); setSelectedIds([])
  }

  const loadSaved = async () => {
    setLoadingPanel(true)
    try {
      const raw = await getSchedules()
      setSaved(Array.isArray(raw) ? raw: [])
    } catch {
      setSaved([])
    } finally {
      setLoadingPanel(false)
    }
  }

  useEffect(() => {
    loadSaved()

    getZoneFilter().then(records => {
      setZoneOptions(records.map(r => ({
        value: String(r.value ?? r.id ?? ''),
        label: String(r.label || r.name || r.zoneName || r.zoneNameLong || r.l_name || ''),
      })).filter(o => o.value && o.label))
    }).catch(() => {})

    getUserList().then(users => {
      const opts = users.map(u => ({
        value: String(u.id ?? ''),
        label: String(u.userName || u.userid || ''),
      })).filter(o => o.value && o.label)
      setUserOptions([{ value: 'all', label: 'All' }, ...opts])
    }).catch(() => {})

    filterPatrolTypes('all').then(types => {
      setPatrolTypeOptions(types.map(t => ({
        value: String(t.id ?? ''),
        label: String(t.patrolName || ''),
      })).filter(o => o.value && o.label))
    }).catch(() => {})

    listTrips().then(list => {
      setTripOptions(list.map(t => ({
        value: String(t.id ?? t.value ?? ''),
        label: String(t.lable || t.label || t.tripName || t.name || t.trip_name || ''),
      })).filter(o => o.value && o.label))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onZones = () => getZoneFilter().then(records => {
      setZoneOptions(records.map(r => ({ value: String(r.value ?? r.id ?? ''), label: String(r.label || r.name || r.zoneName || '') })).filter(o => o.value && o.label))
    }).catch(() => {})
    const onTrips = () => listTrips().then(list => {
      setTripOptions(list.map(t => ({ value: String(t.id ?? t.value ?? ''), label: String(t.lable || t.label || t.tripName || t.name || '') })).filter(o => o.value && o.label))
    }).catch(() => {})
    window.addEventListener('zones-updated', onZones)
    window.addEventListener('trips-updated', onTrips)
    return () => { window.removeEventListener('zones-updated', onZones); window.removeEventListener('trips-updated', onTrips) }
  }, [])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  function buildPayload(f) {
    const roundUsed  = !!f.minRound
    const cyclicUsed = !!f.delay_mins
    const payload = {
      zone:            f.zoneId       ? [String(f.zoneId)]       : [],
      user:            (!f.userId || f.userId === 'all') ? ['all'] : [String(f.userId)],
      patrol_type:     f.patrolTypeId ? [String(f.patrolTypeId)] : [],
      trip:            Number(f.tripId) || 0,
      start_date_time: formatDateTime(f.startDate, f.startTime),
      end_date_time:   formatDateTime(f.endDate,   f.endTime),
      order:           f.ordered ? 1 : 0,
    }
    if (roundUsed) {
      payload.is_round  = 1
      payload.min_round = Number(f.minRound)
      payload.max_round = f.maxRound ? Number(f.maxRound) : null
    }
    if (cyclicUsed) {
      payload.is_cyclic    = 1
      payload.delay_mins   = Number(f.delay_mins)
      payload.expired_date = f.expiredDate
        ? `${f.expiredDate} 00:00:00`
        : formatDateTime(f.endDate, f.endTime)
    }
    return payload
  }

  function apiRecordToForm(s) {
    const userId  = s.user_id != null ? String(s.user_id) : ''
    const userOpt = userOptions.find(o => String(o.value) === userId)
    const tripOpt = tripOptions.find(o => String(o.value) === String(s.trip_id ?? ''))
    const zoneId  = Array.isArray(s.zone) ? (s.zone[0] || '') : (s.zone ? String(s.zone) : '')
    const zoneOpt = zoneOptions.find(o => String(o.value) === String(zoneId))
    const ptId    = s.patrol_type_id ? String(s.patrol_type_id) : ''
    const ptOpt   = patrolTypeOptions.find(o => String(o.value) === ptId)
    return {
      zoneId,         zoneName:       zoneOpt?.label        || zoneId,
      userId,         employeeName:   userOpt?.label        || safeStr(s.user),
      patrolTypeId:   ptId,
      patrolTypeName: ptOpt?.label   || safeStr(s.trip_type),
      tripId:         s.trip_id != null ? String(s.trip_id) : '',
      tripName:       tripOpt?.label || safeStr(s.trip_name),
      startDate:      safeStr(s.start_date),
      startTime:      safeStr(s.start_time).replace(/ (AM|PM)$/i, ''),
      endDate:        safeStr(s.start_date),
      endTime:        safeStr(s.end_time).replace(/ (AM|PM)$/i, ''),
      ordered:        Number(s.is_order) !== 0,
      minRound:       naVal(s.min_round)  != null ? String(s.min_round)  : '',
      maxRound:       naVal(s.max_round)  != null ? String(s.max_round)  : '',
      delay_mins:     naVal(s.delay_mins) != null ? String(s.delay_mins) : '',
      expiredDate:    safeStr(s.expired_at),
    }
  }

  const handleClone = (item) => { setForm(apiRecordToForm(item)); setSel(null) }
  const handleEdit  = (item) => { setForm(apiRecordToForm(item)); setSel(item.id) }

  const handleSaveClick = () => {
    setFormError('')
    const f = form
    if (!f.tripId)    return setFormError('Please select a Trip.')
    if (!f.startDate) return setFormError('Please set a Start Date.')
    if (!f.startTime) return setFormError('Please set a Start Time.')
    if (!f.endDate)   return setFormError('Please set an End Date.')
    if (!f.endTime)   return setFormError('Please set an End Time.')
    const roundTouched  = !!(f.minRound  || f.maxRound)
    const cyclicTouched = !!(f.delay_mins || f.expiredDate)
    if (!roundTouched && !cyclicTouched) {
      return setFormError('Please fill in Round or Cyclic details (or both) before saving.')
    }
    if (f.maxRound && !f.minRound) {
      return setFormError('You entered a Maximum Round — please also enter Minimum Round.')
    }
    if (f.delay_mins && !f.expiredDate) {
      return setFormError('You entered a Restart Time — please also enter the Expiry Date.')
    }
    if (f.expiredDate && !f.delay_mins) {
      return setFormError('You entered an Expiry Date — please also enter the Restart Time.')
    }
    setConfirm(true)
  }

  const handleConfirmed = async () => {
    setBusy(true)
    const payload = buildPayload(form)
    try {
      if (sel) {
        await updateSchedule(sel, payload)
        await loadSaved()
        setSel(null); setForm(blank)
      } else {
        await createSchedule(payload)
        await loadSaved()
        setForm(blank)
      }
    } catch (err) {
      console.error('[ScheduleForm] save error:', err)
      if (sel) { setSaved(p => p.map(s => s.id === sel ? { ...s, ...payload, id: sel } : s)); setSel(null); setForm(blank) }
    }
    setBusy(false); setConfirm(false)
  }

  const handleDelete = async (id) => {
    try { await deleteSchedule(id) } catch {}
    setSaved(p => p.filter(s => s.id !== id))
    if (sel === id) { setForm(blank); setSel(null) }
  }

  const summary = [
    { label: 'Zone',         value: form.zoneName       },
    { label: 'Employee',     value: form.employeeName   },
    { label: 'Patrol Type',  value: form.patrolTypeName },
    { label: 'Trip',         value: form.tripName       },
    { label: 'Start',        value: `${form.startDate} ${form.startTime}` },
    { label: 'End',          value: `${form.endDate} ${form.endTime}`     },
    { label: 'Order',        value: form.ordered ? 'ORDER' : 'UNORDER'   },
    ...(form.minRound    ? [{ label: 'Min Round',    value: form.minRound }]             : []),
    ...(form.maxRound    ? [{ label: 'Max Round',    value: form.maxRound }]             : []),
    ...(form.delay_mins  ? [{ label: 'Restart Time', value: `${form.delay_mins} mins` }] : []),
    ...(form.expiredDate ? [{ label: 'Expiry Date',  value: form.expiredDate }]          : []),
  ]

  const inp = {
    padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px',
    fontSize: '12px', outline: 'none', flex: 1, minWidth: '120px', boxSizing: 'border-box',
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
      {/* ── Invisible scrollbar: hides webkit + firefox scrollbars while keeping scroll functionality ── */}
      <style>{`
        .sf-scroll-hide::-webkit-scrollbar { display: none; }
        .sf-scroll-hide { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

      {/* ═══ LEFT PANEL ═══ */}
      {/* flex sizing switches: panel visible → fixed 55%; panel hidden → flex:1 fills all space */}
      <div
        className="sf-scroll-hide"
        style={{
          flex:      showSaved ? '0 0 55%' : 1,
          width:     showSaved ? '55%'     : 'auto',
          maxWidth:  showSaved ? '55%'     : 'none',
          display: 'flex', flexDirection: 'column',
          borderRight: showSaved ? '2px solid #e8eaed' : 'none',
          padding: '20px', overflowY: 'auto', overflowX: 'hidden',
          boxSizing: 'border-box', alignSelf: 'stretch',
          transition: 'flex 0.25s ease, max-width 0.25s ease',
        }}
      >
        {/* ── Centering wrapper: max-width + auto margin when right panel is collapsed ── */}
        <div style={{
          display: 'flex', flexDirection: 'column', flex: 1,
          width: '100%',
          maxWidth: showSaved ? 'none' : '720px',
          margin:   showSaved ? '0'    : '0 auto',
          transition: 'max-width 0.25s ease',
        }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0 }}>
          {sel ? 'Edit Schedule' : 'Create Schedule'}
        </h2>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>

          <div style={{ display: 'flex', gap: '12px' }}>
            <FieldDropdown label="Zone" displayValue={form.zoneName}
              onSelect={opt => setForm(p => ({ ...p, zoneId: opt.value, zoneName: opt.label }))} options={zoneOptions} />
            <FieldDropdown label="Employee" displayValue={form.employeeName}
              onSelect={opt => setForm(p => ({ ...p, userId: opt.value, employeeName: opt.label }))} options={userOptions} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <FieldDropdown label="Patrol Type" displayValue={form.patrolTypeName}
              onSelect={opt => setForm(p => ({ ...p, patrolTypeId: opt.value, patrolTypeName: opt.label }))} options={patrolTypeOptions} />
            <FieldDropdown label="Trip" displayValue={form.tripName}
              onSelect={opt => setForm(p => ({ ...p, tripId: opt.value, tripName: opt.label }))} options={tripOptions} />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}
              style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
            <input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)}
              style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
            <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
            <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)}
              style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
            <input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)}
              style={{ flex: 1, minWidth: 0, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: '4px', fontSize: '13px', outline: 'none', height: '38px', boxSizing: 'border-box' }} />
            <button style={{ width: '38px', height: '38px', flexShrink: 0, border: '1px solid #dadce0', borderRadius: '4px', background: '#f0f4ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</button>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => set('ordered', true)}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '4px', background: form.ordered ? '#1a73e8' : '#f8f9fa', color: form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              Order
            </button>
            <button onClick={() => set('ordered', false)}
              style={{ flex: 1, padding: '10px', border: '1px solid #dadce0', borderRadius: '4px', background: !form.ordered ? '#1a73e8' : 'transparent', color: !form.ordered ? '#fff' : '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              Unorder
            </button>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #e8eaed', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#202124', flexShrink: 0, minWidth: '48px' }}>Round</span>
            <input type="number" min="0" placeholder="Minimum Round"
              value={form.minRound} onChange={e => set('minRound', e.target.value)}
              style={inp} />
            <input type="number" min="0" placeholder="Maximum Round"
              value={form.maxRound} onChange={e => set('maxRound', e.target.value)}
              style={inp} />
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#202124', flexShrink: 0, minWidth: '48px' }}>Cyclic</span>
            <input type="number" min="0" placeholder="Restart Time (mins)"
              value={form.delay_mins} onChange={e => set('delay_mins', e.target.value)}
              style={inp} />
            <input type="date" placeholder="Expiry Date"
              value={form.expiredDate} onChange={e => set('expiredDate', e.target.value)}
              style={inp} />
          </div>
        </div>

        {formError && (
          <div style={{ color: '#d93025', fontSize: '12px', paddingTop: '8px' }}>⚠ {formError}</div>
        )}

        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', gap: '8px' }}>
          {sel && (
            <button onClick={() => { setForm(blank); setSel(null) }}
              style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '4px', background: '#f8f9fa', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              Cancel
            </button>
          )}
          <button onClick={handleSaveClick}
            style={{ padding: '10px 32px', border: 'none', borderRadius: '4px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
            Save
          </button>
        </div>
        </div>{/* ── end centering wrapper ── */}
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      {/* flex sizing switches: panel visible → flex:1 fills remaining; panel hidden → shrinks to toggle-button width only */}
      <div style={{
        flex:     showSaved ? 1          : '0 0 auto',
        minWidth: showSaved ? 0          : 'auto',
        maxWidth: showSaved ? 'none'     : '56px',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box',
        transition: 'flex 0.25s ease, max-width 0.25s ease',
      }}>

        {/* Right header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: showSaved ? '20px 16px 16px' : '20px 12px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
          {selectMode ? (
            <>
              <div onClick={() => {
                if (selectedIds.length === saved.length) setSelectedIds([])
                else setSelectedIds(saved.map(s => s.id))
              }}
                style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                {selectedIds.length === saved.length
                  ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
                  : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
              </div>
              <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
                {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Schedule'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                <button onClick={deleteSelected} disabled={selectedIds.length === 0}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: selectedIds.length > 0 ? '#fce8e6' : '#f5f5f5', border: 'none', color: selectedIds.length > 0 ? '#d93025' : '#bbb', fontSize: '12px', fontWeight: 600, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', padding: '5px 10px', borderRadius: '4px' }}>
                  🗑 Delete
                </button>
                <button onClick={cancelSelect} style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: '12px', cursor: 'pointer', padding: '5px 8px' }}>✕ Cancel</button>
              </div>
            </>
          ) : (
            <>
              {showSaved && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0 }}>Saved Schedule</h2>
                  {saved.length > 0 && (
                    <span style={{ background: '#e8f0fe', color: '#1a73e8', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>{saved.length}</span>
                  )}
                </div>
              )}
              <button onClick={() => setShowSaved(v => !v)}
                style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '16px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
                {showSaved ? <PagePreviousIcon /> : <PageNextIcon />}
              </button>
            </>
          )}
        </div>

        {showSaved && (
          <div className="sf-scroll-hide" style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
            {loadingPanel && (
              <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '24px' }}>Loading…</div>
            )}

            {!loadingPanel && saved.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((s, idx) => (
              <ScheduleCard
                key={s.id}
                s={s}
                idx={idx}
                isChecked={selectedIds.includes(s.id)}
                selectMode={selectMode}
                onToggleSelect={toggleSelect}
                onSelect={enterSelectMode}
                onClone={handleClone}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}

            {!loadingPanel && saved.length === 0 && (
              <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No schedules saved yet.</div>
            )}
          </div>
        )}

        {/* Pagination footer */}
        {showSaved && !selectMode && saved.length > PAGE_SIZE && (
          <div style={{ padding: '8px 14px', borderTop: '1px solid #e8eaed', flexShrink: 0, background: '#fafbfc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 12px', border: '1px solid #dadce0', borderRadius: '6px', background: page === 0 ? '#f5f5f5' : '#fff', color: page === 0 ? '#bbb' : '#202124', fontSize: '12px', fontWeight: 500, cursor: page === 0 ? 'not-allowed' : 'pointer' }}>
              ← Prev
            </button>
            <span style={{ fontSize: '12px', color: '#5f6368', fontWeight: 500 }}>
              Page {page + 1} / {Math.ceil(saved.length / PAGE_SIZE)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={(page + 1) * PAGE_SIZE >= saved.length}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 12px', border: '1px solid #dadce0', borderRadius: '6px', background: (page + 1) * PAGE_SIZE >= saved.length ? '#f5f5f5' : '#fff', color: (page + 1) * PAGE_SIZE >= saved.length ? '#bbb' : '#202124', fontSize: '12px', fontWeight: 500, cursor: (page + 1) * PAGE_SIZE >= saved.length ? 'not-allowed' : 'pointer' }}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}