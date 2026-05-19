// // import { useState, useEffect, useRef } from 'react'
// // import { getLocations, createLocation, deleteLocation, updateLocation, getZones } from '../../../api'
// // import { ConfirmSaveModal } from '../components/MasterFormUI'

// // const blank = {
// //   zone: '', location: '',
// //   lat: 51.505, lng: -0.09,
// //   qrCode: '', rfid: '',
// //   image: null, imagePreview: null,
// // }

// // const fallbackColors = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#4a90d9']

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
// //         <input type="text" placeholder={placeholder} value={value}
// //           onChange={(e) => onChange(e.target.value)}
// //           style={{ flex: 1, minWidth: 0, padding: '10px 14px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }}
// //         />
// //         <button type="button" onClick={() => setOpen((o) => !o)}
// //           style={{ width: '38px', height: '42px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 8px 8px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
// //         >+</button>
// //       </div>
// //       {open && (
// //         <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
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
// //         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '18px', color: '#5f6368', lineHeight: 1 }}>⋮</button>
// //       {open && (
// //         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
// //           {items.map(({ label, icon, color, action }) => (
// //             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
// //               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
// //               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
// //               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
// //             ><span>{icon}</span>{label}</div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // /* ── Leaflet map loaded via CDN ── */
// // function LocationMap({ lat, lng, onChange }) {
// //   const mapRef    = useRef(null)
// //   const leafletRef = useRef(null)
// //   const markerRef  = useRef(null)

// //   useEffect(() => {
// //     // Load Leaflet CSS
// //     if (!document.getElementById('leaflet-css')) {
// //       const link = document.createElement('link')
// //       link.id   = 'leaflet-css'
// //       link.rel  = 'stylesheet'
// //       link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
// //       document.head.appendChild(link)
// //     }

// //     // Load Leaflet JS then init map
// //     const initMap = () => {
// //       if (!mapRef.current || leafletRef.current) return
// //       const L   = window.L
// //       const map = L.map(mapRef.current, { zoomControl: false }).setView([lat, lng], 13)

// //       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// //         attribution: '© OpenStreetMap contributors',
// //         maxZoom: 19,
// //       }).addTo(map)

// //       L.control.zoom({ position: 'bottomright' }).addTo(map)

// //       // Custom marker icon (no default image path issues)
// //       const icon = L.divIcon({
// //         className: '',
// //         html: `<div style="width:20px;height:20px;background:#1a73e8;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
// //         iconSize: [20, 20],
// //         iconAnchor: [10, 10],
// //       })

// //       const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map)
// //       markerRef.current = marker

// //       marker.on('dragend', () => {
// //         const { lat: newLat, lng: newLng } = marker.getLatLng()
// //         onChange(newLat, newLng)
// //       })

// //       map.on('click', (e) => {
// //         marker.setLatLng(e.latlng)
// //         onChange(e.latlng.lat, e.latlng.lng)
// //       })

// //       leafletRef.current = map
// //     }

// //     if (window.L) {
// //       initMap()
// //     } else {
// //       const script = document.createElement('script')
// //       script.src   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
// //       script.onload = initMap
// //       document.head.appendChild(script)
// //     }

// //     return () => {
// //       if (leafletRef.current) {
// //         leafletRef.current.remove()
// //         leafletRef.current = null
// //       }
// //     }
// //   }, [])

// //   // Update marker when lat/lng prop changes from outside
// //   useEffect(() => {
// //     if (markerRef.current && leafletRef.current) {
// //       markerRef.current.setLatLng([lat, lng])
// //       leafletRef.current.setView([lat, lng], leafletRef.current.getZoom())
// //     }
// //   }, [lat, lng])

// //   return (
// //     <div ref={mapRef} style={{ width: '100%', height: '200px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #dadce0', zIndex: 0 }} />
// //   )
// // }

// // export default function LocationForm() {
// //   const [form, setForm]           = useState(blank)
// //   const [saved, setSaved]         = useState([])
// //   const [busy, setBusy]           = useState(false)
// //   const [sel, setSel]             = useState(null)
// //   const [confirm, setConfirm]     = useState(false)
// //   const [showSaved, setShowSaved] = useState(true)
// //   const [selectMode, setSelectMode]   = useState(false)
// //   const [selectedIds, setSelectedIds] = useState([])

// //   const qrRef  = useRef(null)
// //   const imgRef = useRef(null)

// //   const [zoneOpts, setZoneOpts] = useState([])
// //   const [locOpts,  setLocOpts]  = useState([])

// //   // Fetch zones from their source (Others → Zone master data)
// //   useEffect(() => {
// //     getZones().then(zones => {
// //       const names = zones.map(z => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
// //       setZoneOpts(names)
// //     }).catch(() => {})
// //   }, [])

// //   useEffect(() => {
// //     if (typeof window === 'undefined') return
// //     const handleZonesUpdated = () => {
// //       getZones().then(zones => {
// //         const names = zones.map(z => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
// //         setZoneOpts(names)
// //       }).catch(() => {})
// //     }
// //     window.addEventListener('zones-updated', handleZonesUpdated)
// //     return () => window.removeEventListener('zones-updated', handleZonesUpdated)
// //   }, [])

// //   useEffect(() => {
// //     getLocations().then((locs) => {
// //       setSaved(locs)
// //       const l = [...new Set(locs.map((l) => l.location).filter(Boolean))].sort()
// //       if (l.length) setLocOpts(l)
// //     }).catch(() => {})
// //   }, [])

// //   const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

// //   const handleEdit  = (item) => { setForm({ ...blank, ...item, image: null, imagePreview: null }); setSel(item.id) }
// //   const handleClone = (item) => { const { id, ...rest } = item; setForm({ ...blank, ...rest, image: null, imagePreview: null }); setSel(null) }
// //   const handleCancelEdit = () => { setForm(blank); setSel(null) }
// //   const handleSaveClick  = () => { if (!form.zone && !form.location) return; setConfirm(true) }

// //   const handleConfirmed = async () => {
// //     setBusy(true)
// //     const { image, imagePreview, ...payload } = form
// //     try {
// //       if (sel) {
// //         const updated = await updateLocation(sel, payload)
// //         setSaved((p) => p.map((l) => (l.id === sel ? { ...l, ...updated } : l)))
// //         setSel(null); setForm(blank)
// //       } else {
// //         const created = await createLocation(payload)
// //         setSaved((p) => [created, ...p]); setForm(blank)
// //       }
// //     } catch {
// //       if (sel) { setSaved((p) => p.map((l) => (l.id === sel ? { ...l, ...payload } : l))); setSel(null); setForm(blank) }
// //     }
// //     setBusy(false); setConfirm(false)
// //   }

// //   const handleDelete = async (id) => {
// //     try { await deleteLocation(id) } catch {}
// //     setSaved((p) => p.filter((l) => l.id !== id))
// //     if (sel === id) { setForm(blank); setSel(null) }
// //   }

// //   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
// //   const toggleSelect    = (id) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
// //   const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
// //   const deleteSelected  = async () => {
// //     for (const id of selectedIds) { try { await deleteLocation(id) } catch {} }
// //     setSaved((p) => p.filter((l) => !selectedIds.includes(l.id)))
// //     if (selectedIds.includes(sel)) { setForm(blank); setSel(null) }
// //     setSelectMode(false); setSelectedIds([])
// //   }

// //   const handleImageChange = (e) => {
// //     const file = e.target.files[0]
// //     if (!file) return
// //     const reader = new FileReader()
// //     reader.onload = (ev) => set('imagePreview', ev.target.result)
// //     reader.readAsDataURL(file)
// //     set('image', file)
// //   }

// //   const summary = [
// //     { label: 'Zone',     value: form.zone },
// //     { label: 'Location', value: form.location },
// //     { label: 'QR Code',  value: form.qrCode },
// //     { label: 'RFID',     value: form.rfid },
// //     { label: 'Lat',      value: form.lat },
// //     { label: 'Lng',      value: form.lng },
// //   ]

// //   return (
// //     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
// //       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

// //       {/* ═══ LEFT: FORM ═══ */}
// //       <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
// //         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, lineHeight: '28px' }}>
// //           {sel ? 'Edit Location' : 'Create Location'}
// //         </h2>

// //         <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

// //           {/* Zone | Location */}
// //           <div style={{ display: 'flex', gap: '14px' }}>
// //             <FieldDropdown placeholder="Zone"     value={form.zone}     onChange={(v) => set('zone', v)}     options={zoneOpts} />
// //             <FieldDropdown placeholder="Location" value={form.location} onChange={(v) => set('location', v)} options={locOpts} />
// //           </div>

// //           {/* Real OpenStreetMap */}
// //           <LocationMap
// //             lat={form.lat}
// //             lng={form.lng}
// //             onChange={(lat, lng) => setForm((p) => ({ ...p, lat, lng }))}
// //           />

// //           {/* QR code | or | RFID */}
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
// //             <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #dadce0', borderRadius: '8px', height: '42px', overflow: 'hidden' }}>
// //               <input placeholder="QR code" value={form.qrCode} onChange={(e) => set('qrCode', e.target.value)}
// //                 style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '13px', color: '#202124', background: 'transparent' }} />
// //               <button onClick={() => qrRef.current?.click()}
// //                 style={{ background: 'none', border: 'none', padding: '0 10px', cursor: 'pointer', fontSize: '18px', color: '#5f6368', flexShrink: 0 }}>📎</button>
// //               <input ref={qrRef} type="file" style={{ display: 'none' }} />
// //             </div>
// //             <span style={{ fontSize: '13px', color: '#9aa0a6', flexShrink: 0 }}>or</span>
// //             <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #dadce0', borderRadius: '8px', height: '42px', overflow: 'hidden' }}>
// //               <input placeholder="RFID" value={form.rfid} onChange={(e) => set('rfid', e.target.value)}
// //                 style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '13px', color: '#202124', background: 'transparent' }} />
// //               <button style={{ background: 'none', border: 'none', padding: '0 10px', cursor: 'pointer', fontSize: '18px', color: '#5f6368', flexShrink: 0 }}>📎</button>
// //             </div>
// //           </div>

// //           {/* Add image */}
// //           <div onClick={() => imgRef.current?.click()}
// //             style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', background: '#fff', height: '42px', boxSizing: 'border-box' }}>
// //             {form.imagePreview ? (
// //               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
// //                 <img src={form.imagePreview} alt="preview" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
// //                 <span style={{ fontSize: '13px', color: '#202124' }}>Image selected</span>
// //               </div>
// //             ) : (
// //               <span style={{ fontSize: '13px', color: '#9aa0a6' }}>Add image</span>
// //             )}
// //             <span style={{ fontSize: '18px', color: '#5f6368' }}>📎</span>
// //             <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
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

// //       {/* ═══ RIGHT: SAVED LOCATIONS ═══ */}
// //       <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

// //         {/* Header */}
// //         <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
// //           {selectMode ? (
// //             <>
// //               <div
// //                 onClick={() => setSelectedIds(selectedIds.length === saved.length ? [] : saved.map((l) => l.id))}
// //                 style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
// //               >
// //                 {selectedIds.length === saved.length
// //                   ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
// //                   : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
// //               </div>
// //               <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
// //                 {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Location'}
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
// //               {showSaved && <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0, lineHeight: '28px' }}>Saved Location</h2>}
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
// //             {saved.map((l, idx) => {
// //               const isChecked = selectedIds.includes(l.id)
// //               const color     = fallbackColors[idx % fallbackColors.length]
// //               return (
// //                 <div key={l.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>

// //                   {selectMode && (
// //                     <div onClick={() => toggleSelect(l.id)}
// //                       style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
// //                       {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
// //                     </div>
// //                   )}

// //                   <div style={{ flex: 1, minWidth: 0, border: `1px solid ${selectMode && isChecked ? '#1a73e8' : '#e0e0e0'}`, borderRadius: '10px', padding: '10px 12px', background: selectMode && isChecked ? '#f0f4ff' : '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>

// //                     {/* Top: icon + name + company + menu */}
// //                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '6px' }}>
// //                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
// //                         <span style={{ fontSize: '20px', flexShrink: 0 }}>🏢</span>
// //                         <div style={{ minWidth: 0 }}>
// //                           <div style={{ fontSize: '13px', fontWeight: 600, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //                             {l.location || 'OrbidX(Obx)'}
// //                           </div>
// //                           <div style={{ fontSize: '11px', color: '#5f6368' }}>{l.company || 'Company code'}</div>
// //                         </div>
// //                       </div>
// //                       <CardMenu
// //                         onSelect={() => enterSelectMode(l.id)}
// //                         onClone={() => handleClone(l)}
// //                         onEdit={() => handleEdit(l)}
// //                         onDelete={() => handleDelete(l.id)}
// //                       />
// //                     </div>

// //                     {/* Pills */}
// //                     <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
// //                       {[l.zone || 'Zone', 'QR/Barcode', l.image ? 'Attached' : 'Attached', l.location || 'Location'].map((tag, i) => (
// //                         <span key={i} style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#333' }}>{tag}</span>
// //                       ))}
// //                     </div>

// //                   </div>
// //                 </div>
// //               )
// //             })}

// //             {saved.length === 0 && (
// //               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No locations saved yet.</div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // import { useState, useEffect, useRef } from 'react'
// // import { getLocations, createLocation, deleteLocation, updateLocation, getZones } from '../../../api'
// // import { ConfirmSaveModal } from '../components/MasterFormUI'

// // const blank = {
// //   zone: '', location: '',
// //   lat: 51.505, lng: -0.09,
// //   qrCode: '', rfid: '',
// //   image: null, imagePreview: null,
// // }

// // const fallbackColors = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#4a90d9']

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
// //         <input type="text" placeholder={placeholder} value={value}
// //           onChange={(e) => onChange(e.target.value)}
// //           style={{ flex: 1, minWidth: 0, padding: '10px 14px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }}
// //         />
// //         <button type="button" onClick={() => setOpen((o) => !o)}
// //           style={{ width: '38px', height: '42px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 8px 8px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
// //         >+</button>
// //       </div>
// //       {open && (
// //         <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
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
// //         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '18px', color: '#5f6368', lineHeight: 1 }}>⋮</button>
// //       {open && (
// //         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
// //           {items.map(({ label, icon, color, action }) => (
// //             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
// //               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
// //               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
// //               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
// //             ><span>{icon}</span>{label}</div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // /* ── Leaflet map loaded via CDN ── */
// // function LocationMap({ lat, lng, onChange }) {
// //   const mapRef    = useRef(null)
// //   const leafletRef = useRef(null)
// //   const markerRef  = useRef(null)

// //   useEffect(() => {
// //     // Load Leaflet CSS
// //     if (!document.getElementById('leaflet-css')) {
// //       const link = document.createElement('link')
// //       link.id   = 'leaflet-css'
// //       link.rel  = 'stylesheet'
// //       link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
// //       document.head.appendChild(link)
// //     }

// //     // Load Leaflet JS then init map
// //     const initMap = () => {
// //       if (!mapRef.current || leafletRef.current) return
// //       const L   = window.L
// //       const map = L.map(mapRef.current, { zoomControl: false }).setView([lat, lng], 13)

// //       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// //         attribution: '© OpenStreetMap contributors',
// //         maxZoom: 19,
// //       }).addTo(map)

// //       L.control.zoom({ position: 'bottomright' }).addTo(map)

// //       // Custom marker icon (no default image path issues)
// //       const icon = L.divIcon({
// //         className: '',
// //         html: `<div style="width:20px;height:20px;background:#1a73e8;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
// //         iconSize: [20, 20],
// //         iconAnchor: [10, 10],
// //       })

// //       const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map)
// //       markerRef.current = marker

// //       marker.on('dragend', () => {
// //         const { lat: newLat, lng: newLng } = marker.getLatLng()
// //         onChange(newLat, newLng)
// //       })

// //       map.on('click', (e) => {
// //         marker.setLatLng(e.latlng)
// //         onChange(e.latlng.lat, e.latlng.lng)
// //       })

// //       leafletRef.current = map
// //     }

// //     if (window.L) {
// //       initMap()
// //     } else {
// //       const script = document.createElement('script')
// //       script.src   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
// //       script.onload = initMap
// //       document.head.appendChild(script)
// //     }

// //     return () => {
// //       if (leafletRef.current) {
// //         leafletRef.current.remove()
// //         leafletRef.current = null
// //       }
// //     }
// //   }, [])

// //   // Update marker when lat/lng prop changes from outside
// //   useEffect(() => {
// //     if (markerRef.current && leafletRef.current) {
// //       markerRef.current.setLatLng([lat, lng])
// //       leafletRef.current.setView([lat, lng], leafletRef.current.getZoom())
// //     }
// //   }, [lat, lng])

// //   return (
// //     <div ref={mapRef} style={{ width: '100%', height: '200px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #dadce0', zIndex: 0 }} />
// //   )
// // }

// // export default function LocationForm() {
// //   const [form, setForm]           = useState(blank)
// //   const [saved, setSaved]         = useState([])
// //   const [busy, setBusy]           = useState(false)
// //   const [sel, setSel]             = useState(null)
// //   const [confirm, setConfirm]     = useState(false)
// //   const [showSaved, setShowSaved] = useState(true)
// //   const [selectMode, setSelectMode]   = useState(false)
// //   const [selectedIds, setSelectedIds] = useState([])

// //   const qrRef  = useRef(null)
// //   const imgRef = useRef(null)

// //   const [zoneOpts, setZoneOpts] = useState([])
// //   const [locOpts,  setLocOpts]  = useState([])

// //   // Fetch zones from their source (Others → Zone master data)
// //   useEffect(() => {
// //     getZones().then(zones => {
// //       const names = zones.map(z => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
// //       setZoneOpts(names)
// //     }).catch(() => {})
// //   }, [])

// //   useEffect(() => {
// //     if (typeof window === 'undefined') return
// //     const handleZonesUpdated = () => {
// //       getZones().then(zones => {
// //         const names = zones.map(z => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
// //         setZoneOpts(names)
// //       }).catch(() => {})
// //     }
// //     window.addEventListener('zones-updated', handleZonesUpdated)
// //     return () => window.removeEventListener('zones-updated', handleZonesUpdated)
// //   }, [])

// //   useEffect(() => {
// //     getLocations().then((locs) => {
// //       setSaved(locs)
// //       const l = [...new Set(locs.map((l) => l.location).filter(Boolean))].sort()
// //       if (l.length) setLocOpts(l)
// //     }).catch(() => {})
// //   }, [])

// //   const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

// //   const handleEdit  = (item) => { setForm({ ...blank, ...item, image: null, imagePreview: null }); setSel(item.id) }
// //   const handleClone = (item) => { const { id, ...rest } = item; setForm({ ...blank, ...rest, image: null, imagePreview: null }); setSel(null) }
// //   const handleCancelEdit = () => { setForm(blank); setSel(null) }
// //   const handleSaveClick  = () => { if (!form.zone && !form.location) return; setConfirm(true) }

// //   const handleConfirmed = async () => {
// //     setBusy(true)
// //     const { image, imagePreview, ...payload } = form
// //     try {
// //       if (sel) {
// //         const updated = await updateLocation(sel, payload)
// //         setSaved((p) => p.map((l) => (l.id === sel ? { ...l, ...updated } : l)))
// //         setSel(null); setForm(blank)
// //       } else {
// //         const created = await createLocation(payload)
// //         setSaved((p) => [created, ...p]); setForm(blank)
// //       }
// //     } catch {
// //       if (sel) { setSaved((p) => p.map((l) => (l.id === sel ? { ...l, ...payload } : l))); setSel(null); setForm(blank) }
// //     }
// //     setBusy(false); setConfirm(false)
// //   }

// //   const handleDelete = async (id) => {
// //     try { await deleteLocation(id) } catch {}
// //     setSaved((p) => p.filter((l) => l.id !== id))
// //     if (sel === id) { setForm(blank); setSel(null) }
// //   }

// //   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
// //   const toggleSelect    = (id) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
// //   const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
// //   const deleteSelected  = async () => {
// //     for (const id of selectedIds) { try { await deleteLocation(id) } catch {} }
// //     setSaved((p) => p.filter((l) => !selectedIds.includes(l.id)))
// //     if (selectedIds.includes(sel)) { setForm(blank); setSel(null) }
// //     setSelectMode(false); setSelectedIds([])
// //   }

// //   const handleImageChange = (e) => {
// //     const file = e.target.files[0]
// //     if (!file) return
// //     const reader = new FileReader()
// //     reader.onload = (ev) => set('imagePreview', ev.target.result)
// //     reader.readAsDataURL(file)
// //     set('image', file)
// //   }

// //   const summary = [
// //     { label: 'Zone',     value: form.zone },
// //     { label: 'Location', value: form.location },
// //     { label: 'QR Code',  value: form.qrCode },
// //     { label: 'RFID',     value: form.rfid },
// //     { label: 'Lat',      value: form.lat },
// //     { label: 'Lng',      value: form.lng },
// //   ]

// //   return (
// //     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
// //       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

// //       {/* ═══ LEFT: FORM ═══ */}
// //       <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
// //         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, lineHeight: '28px' }}>
// //           {sel ? 'Edit Location' : 'Create Location'}
// //         </h2>

// //         <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

// //           {/* Zone | Location */}
// //           <div style={{ display: 'flex', gap: '14px' }}>
// //             <FieldDropdown placeholder="Zone"     value={form.zone}     onChange={(v) => set('zone', v)}     options={zoneOpts} />
// //             <FieldDropdown placeholder="Location" value={form.location} onChange={(v) => set('location', v)} options={locOpts} />
// //           </div>

// //           {/* Real OpenStreetMap */}
// //           <LocationMap
// //             lat={form.lat}
// //             lng={form.lng}
// //             onChange={(lat, lng) => setForm((p) => ({ ...p, lat, lng }))}
// //           />

// //           {/* QR code | or | RFID */}
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
// //             <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #dadce0', borderRadius: '8px', height: '42px', overflow: 'hidden' }}>
// //               <input placeholder="QR code" value={form.qrCode} onChange={(e) => set('qrCode', e.target.value)}
// //                 style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '13px', color: '#202124', background: 'transparent' }} />
// //               <button onClick={() => qrRef.current?.click()}
// //                 style={{ background: 'none', border: 'none', padding: '0 10px', cursor: 'pointer', fontSize: '18px', color: '#5f6368', flexShrink: 0 }}>📎</button>
// //               <input ref={qrRef} type="file" style={{ display: 'none' }} />
// //             </div>
// //             <span style={{ fontSize: '13px', color: '#9aa0a6', flexShrink: 0 }}>or</span>
// //             <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #dadce0', borderRadius: '8px', height: '42px', overflow: 'hidden' }}>
// //               <input placeholder="RFID" value={form.rfid} onChange={(e) => set('rfid', e.target.value)}
// //                 style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '13px', color: '#202124', background: 'transparent' }} />
// //               <button style={{ background: 'none', border: 'none', padding: '0 10px', cursor: 'pointer', fontSize: '18px', color: '#5f6368', flexShrink: 0 }}>📎</button>
// //             </div>
// //           </div>

// //           {/* Add image */}
// //           <div onClick={() => imgRef.current?.click()}
// //             style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', background: '#fff', height: '42px', boxSizing: 'border-box' }}>
// //             {form.imagePreview ? (
// //               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
// //                 <img src={form.imagePreview} alt="preview" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
// //                 <span style={{ fontSize: '13px', color: '#202124' }}>Image selected</span>
// //               </div>
// //             ) : (
// //               <span style={{ fontSize: '13px', color: '#9aa0a6' }}>Add image</span>
// //             )}
// //             <span style={{ fontSize: '18px', color: '#5f6368' }}>📎</span>
// //             <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
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

// //       {/* ═══ RIGHT: SAVED LOCATIONS ═══ */}
// //       <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

// //         {/* Header */}
// //         <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
// //           {selectMode ? (
// //             <>
// //               <div
// //                 onClick={() => setSelectedIds(selectedIds.length === saved.length ? [] : saved.map((l) => l.id))}
// //                 style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
// //               >
// //                 {selectedIds.length === saved.length
// //                   ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
// //                   : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
// //               </div>
// //               <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
// //                 {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Location'}
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
// //               {showSaved && <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0, lineHeight: '28px' }}>Saved Location</h2>}
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
// //             {saved.map((l, idx) => {
// //               const isChecked = selectedIds.includes(l.id)
// //               const color     = fallbackColors[idx % fallbackColors.length]
// //               return (
// //                 <div key={l.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>

// //                   {selectMode && (
// //                     <div onClick={() => toggleSelect(l.id)}
// //                       style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
// //                       {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
// //                     </div>
// //                   )}

// //                   <div style={{ flex: 1, minWidth: 0, border: `1px solid ${selectMode && isChecked ? '#1a73e8' : '#e0e0e0'}`, borderRadius: '10px', padding: '10px 12px', background: selectMode && isChecked ? '#f0f4ff' : '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>

// //                     {/* Top: icon + name + company + menu */}
// //                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '6px' }}>
// //                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
// //                         <span style={{ fontSize: '20px', flexShrink: 0 }}>🏢</span>
// //                         <div style={{ minWidth: 0 }}>
// //                           <div style={{ fontSize: '13px', fontWeight: 600, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //                             {l.location || 'OrbidX(Obx)'}
// //                           </div>
// //                           <div style={{ fontSize: '11px', color: '#5f6368' }}>{l.company || 'Company code'}</div>
// //                         </div>
// //                       </div>
// //                       <CardMenu
// //                         onSelect={() => enterSelectMode(l.id)}
// //                         onClone={() => handleClone(l)}
// //                         onEdit={() => handleEdit(l)}
// //                         onDelete={() => handleDelete(l.id)}
// //                       />
// //                     </div>

// //                     {/* Pills */}
// //                     <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
// //                       {[l.zone || 'Zone', 'QR/Barcode', l.image ? 'Attached' : 'Attached', l.location || 'Location'].map((tag, i) => (
// //                         <span key={i} style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#333' }}>{tag}</span>
// //                       ))}
// //                     </div>

// //                   </div>
// //                 </div>
// //               )
// //             })}

// //             {saved.length === 0 && (
// //               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No locations saved yet.</div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // import { useState, useEffect, useRef } from 'react'
// // import { getLocations, createLocation, deleteLocation, updateLocation, getZones } from '../../../api'
// // import { ConfirmSaveModal } from '../components/MasterFormUI'

// // const blank = {
// //   zone: '', location: '',
// //   lat: 51.505, lng: -0.09,
// //   qrCode: '', rfid: '',
// //   image: null, imagePreview: null,
// // }

// // const fallbackColors = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#4a90d9']

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
// //         <input type="text" placeholder={placeholder} value={value}
// //           onChange={(e) => onChange(e.target.value)}
// //           style={{ flex: 1, minWidth: 0, padding: '10px 14px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }}
// //         />
// //         <button type="button" onClick={() => setOpen((o) => !o)}
// //           style={{ width: '38px', height: '42px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 8px 8px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
// //         >+</button>
// //       </div>
// //       {open && (
// //         <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
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
// //         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '18px', color: '#5f6368', lineHeight: 1 }}>⋮</button>
// //       {open && (
// //         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
// //           {items.map(({ label, icon, color, action }) => (
// //             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
// //               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
// //               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
// //               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
// //             ><span>{icon}</span>{label}</div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // /* ── Leaflet map loaded via CDN ── */
// // function LocationMap({ lat, lng, onChange }) {
// //   const mapRef    = useRef(null)
// //   const leafletRef = useRef(null)
// //   const markerRef  = useRef(null)

// //   useEffect(() => {
// //     // Load Leaflet CSS
// //     if (!document.getElementById('leaflet-css')) {
// //       const link = document.createElement('link')
// //       link.id   = 'leaflet-css'
// //       link.rel  = 'stylesheet'
// //       link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
// //       document.head.appendChild(link)
// //     }

// //     // Load Leaflet JS then init map
// //     const initMap = () => {
// //       if (!mapRef.current || leafletRef.current) return
// //       const L   = window.L
// //       const map = L.map(mapRef.current, { zoomControl: false }).setView([lat, lng], 13)

// //       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// //         attribution: '© OpenStreetMap contributors',
// //         maxZoom: 19,
// //       }).addTo(map)

// //       L.control.zoom({ position: 'bottomright' }).addTo(map)

// //       // Custom marker icon (no default image path issues)
// //       const icon = L.divIcon({
// //         className: '',
// //         html: `<div style="width:20px;height:20px;background:#1a73e8;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
// //         iconSize: [20, 20],
// //         iconAnchor: [10, 10],
// //       })

// //       const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map)
// //       markerRef.current = marker

// //       marker.on('dragend', () => {
// //         const { lat: newLat, lng: newLng } = marker.getLatLng()
// //         onChange(newLat, newLng)
// //       })

// //       map.on('click', (e) => {
// //         marker.setLatLng(e.latlng)
// //         onChange(e.latlng.lat, e.latlng.lng)
// //       })

// //       leafletRef.current = map
// //     }

// //     if (window.L) {
// //       initMap()
// //     } else {
// //       const script = document.createElement('script')
// //       script.src   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
// //       script.onload = initMap
// //       document.head.appendChild(script)
// //     }

// //     return () => {
// //       if (leafletRef.current) {
// //         leafletRef.current.remove()
// //         leafletRef.current = null
// //       }
// //     }
// //   }, [])

// //   // Update marker when lat/lng prop changes from outside
// //   useEffect(() => {
// //     if (markerRef.current && leafletRef.current) {
// //       markerRef.current.setLatLng([lat, lng])
// //       leafletRef.current.setView([lat, lng], leafletRef.current.getZoom())
// //     }
// //   }, [lat, lng])

// //   return (
// //     <div ref={mapRef} style={{ width: '100%', height: '200px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #dadce0', zIndex: 0 }} />
// //   )
// // }

// // export default function LocationForm() {
// //   const [form, setForm]           = useState(blank)
// //   const [saved, setSaved]         = useState([])
// //   const [busy, setBusy]           = useState(false)
// //   const [sel, setSel]             = useState(null)
// //   const [confirm, setConfirm]     = useState(false)
// //   const [showSaved, setShowSaved] = useState(true)
// //   const [selectMode, setSelectMode]   = useState(false)
// //   const [selectedIds, setSelectedIds] = useState([])

// //   const qrRef  = useRef(null)
// //   const imgRef = useRef(null)

// //   const [zoneOpts, setZoneOpts] = useState([])
// //   const [locOpts,  setLocOpts]  = useState([])

// //   // Fetch zones from their source (Others → Zone master data)
// //   useEffect(() => {
// //     getZones().then(zones => {
// //       const names = zones.map(z => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
// //       setZoneOpts(names)
// //     }).catch(() => {})
// //   }, [])

// //   useEffect(() => {
// //     if (typeof window === 'undefined') return
// //     const handleZonesUpdated = () => {
// //       getZones().then(zones => {
// //         const names = zones.map(z => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
// //         setZoneOpts(names)
// //       }).catch(() => {})
// //     }
// //     window.addEventListener('zones-updated', handleZonesUpdated)
// //     return () => window.removeEventListener('zones-updated', handleZonesUpdated)
// //   }, [])

// //   useEffect(() => {
// //     getLocations().then((locs) => {
// //       setSaved(locs)
// //       const l = [...new Set(locs.map((l) => l.location).filter(Boolean))].sort()
// //       if (l.length) setLocOpts(l)
// //     }).catch(() => {})
// //   }, [])

// //   const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

// //   const handleEdit  = (item) => { setForm({ ...blank, ...item, image: null, imagePreview: null }); setSel(item.id) }
// //   const handleClone = (item) => { const { id, ...rest } = item; setForm({ ...blank, ...rest, image: null, imagePreview: null }); setSel(null) }
// //   const handleCancelEdit = () => { setForm(blank); setSel(null) }
// //   const handleSaveClick  = () => { if (!form.zone && !form.location) return; setConfirm(true) }

// //   const handleConfirmed = async () => {
// //     setBusy(true)
// //     const { image, imagePreview, ...payload } = form
// //     try {
// //       if (sel) {
// //         const updated = await updateLocation(sel, payload)
// //         setSaved((p) => p.map((l) => (l.id === sel ? { ...l, ...updated } : l)))
// //         setSel(null); setForm(blank)
// //       } else {
// //         const created = await createLocation(payload)
// //         setSaved((p) => [created, ...p]); setForm(blank)
// //       }
// //     } catch {
// //       if (sel) { setSaved((p) => p.map((l) => (l.id === sel ? { ...l, ...payload } : l))); setSel(null); setForm(blank) }
// //     }
// //     setBusy(false); setConfirm(false)
// //   }

// //   const handleDelete = async (id) => {
// //     try { await deleteLocation(id) } catch {}
// //     setSaved((p) => p.filter((l) => l.id !== id))
// //     if (sel === id) { setForm(blank); setSel(null) }
// //   }

// //   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
// //   const toggleSelect    = (id) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
// //   const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
// //   const deleteSelected  = async () => {
// //     for (const id of selectedIds) { try { await deleteLocation(id) } catch {} }
// //     setSaved((p) => p.filter((l) => !selectedIds.includes(l.id)))
// //     if (selectedIds.includes(sel)) { setForm(blank); setSel(null) }
// //     setSelectMode(false); setSelectedIds([])
// //   }

// //   const handleImageChange = (e) => {
// //     const file = e.target.files[0]
// //     if (!file) return
// //     const reader = new FileReader()
// //     reader.onload = (ev) => set('imagePreview', ev.target.result)
// //     reader.readAsDataURL(file)
// //     set('image', file)
// //   }

// //   const summary = [
// //     { label: 'Zone',     value: form.zone },
// //     { label: 'Location', value: form.location },
// //     { label: 'QR Code',  value: form.qrCode },
// //     { label: 'RFID',     value: form.rfid },
// //     { label: 'Lat',      value: form.lat },
// //     { label: 'Lng',      value: form.lng },
// //   ]

// //   return (
// //     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
// //       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

// //       {/* ═══ LEFT: FORM ═══ */}
// //       <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
// //         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, lineHeight: '28px' }}>
// //           {sel ? 'Edit Location' : 'Create Location'}
// //         </h2>

// //         <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

// //           {/* Zone | Location */}
// //           <div style={{ display: 'flex', gap: '14px' }}>
// //             <FieldDropdown placeholder="Zone"     value={form.zone}     onChange={(v) => set('zone', v)}     options={zoneOpts} />
// //             <FieldDropdown placeholder="Location" value={form.location} onChange={(v) => set('location', v)} options={locOpts} />
// //           </div>

// //           {/* Real OpenStreetMap */}
// //           <LocationMap
// //             lat={form.lat}
// //             lng={form.lng}
// //             onChange={(lat, lng) => setForm((p) => ({ ...p, lat, lng }))}
// //           />

// //           {/* QR code | or | RFID */}
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
// //             <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #dadce0', borderRadius: '8px', height: '42px', overflow: 'hidden' }}>
// //               <input placeholder="QR code" value={form.qrCode} onChange={(e) => set('qrCode', e.target.value)}
// //                 style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '13px', color: '#202124', background: 'transparent' }} />
// //               <button onClick={() => qrRef.current?.click()}
// //                 style={{ background: 'none', border: 'none', padding: '0 10px', cursor: 'pointer', fontSize: '18px', color: '#5f6368', flexShrink: 0 }}>📎</button>
// //               <input ref={qrRef} type="file" style={{ display: 'none' }} />
// //             </div>
// //             <span style={{ fontSize: '13px', color: '#9aa0a6', flexShrink: 0 }}>or</span>
// //             <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #dadce0', borderRadius: '8px', height: '42px', overflow: 'hidden' }}>
// //               <input placeholder="RFID" value={form.rfid} onChange={(e) => set('rfid', e.target.value)}
// //                 style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '13px', color: '#202124', background: 'transparent' }} />
// //               <button style={{ background: 'none', border: 'none', padding: '0 10px', cursor: 'pointer', fontSize: '18px', color: '#5f6368', flexShrink: 0 }}>📎</button>
// //             </div>
// //           </div>

// //           {/* Add image */}
// //           <div onClick={() => imgRef.current?.click()}
// //             style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', background: '#fff', height: '42px', boxSizing: 'border-box' }}>
// //             {form.imagePreview ? (
// //               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
// //                 <img src={form.imagePreview} alt="preview" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
// //                 <span style={{ fontSize: '13px', color: '#202124' }}>Image selected</span>
// //               </div>
// //             ) : (
// //               <span style={{ fontSize: '13px', color: '#9aa0a6' }}>Add image</span>
// //             )}
// //             <span style={{ fontSize: '18px', color: '#5f6368' }}>📎</span>
// //             <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
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

// //       {/* ═══ RIGHT: SAVED LOCATIONS ═══ */}
// //       <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

// //         {/* Header */}
// //         <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
// //           {selectMode ? (
// //             <>
// //               <div
// //                 onClick={() => setSelectedIds(selectedIds.length === saved.length ? [] : saved.map((l) => l.id))}
// //                 style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
// //               >
// //                 {selectedIds.length === saved.length
// //                   ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
// //                   : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
// //               </div>
// //               <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
// //                 {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Location'}
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
// //               {showSaved && <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0, lineHeight: '28px' }}>Saved Location</h2>}
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
// //             {saved.map((l, idx) => {
// //               const isChecked = selectedIds.includes(l.id)
// //               const color     = fallbackColors[idx % fallbackColors.length]
// //               return (
// //                 <div key={l.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>

// //                   {selectMode && (
// //                     <div onClick={() => toggleSelect(l.id)}
// //                       style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
// //                       {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
// //                     </div>
// //                   )}

// //                   <div style={{ flex: 1, minWidth: 0, border: `1px solid ${selectMode && isChecked ? '#1a73e8' : '#e0e0e0'}`, borderRadius: '10px', padding: '10px 12px', background: selectMode && isChecked ? '#f0f4ff' : '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>

// //                     {/* Top: icon + name + company + menu */}
// //                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '6px' }}>
// //                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
// //                         <span style={{ fontSize: '20px', flexShrink: 0 }}>🏢</span>
// //                         <div style={{ minWidth: 0 }}>
// //                           <div style={{ fontSize: '13px', fontWeight: 600, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //                             {l.location || 'OrbidX(Obx)'}
// //                           </div>
// //                           <div style={{ fontSize: '11px', color: '#5f6368' }}>{l.company || 'Company code'}</div>
// //                         </div>
// //                       </div>
// //                       <CardMenu
// //                         onSelect={() => enterSelectMode(l.id)}
// //                         onClone={() => handleClone(l)}
// //                         onEdit={() => handleEdit(l)}
// //                         onDelete={() => handleDelete(l.id)}
// //                       />
// //                     </div>

// //                     {/* Pills */}
// //                     <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
// //                       {[l.zone || 'Zone', 'QR/Barcode', l.image ? 'Attached' : 'Attached', l.location || 'Location'].map((tag, i) => (
// //                         <span key={i} style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#333' }}>{tag}</span>
// //                       ))}
// //                     </div>

// //                   </div>
// //                 </div>
// //               )
// //             })}

// //             {saved.length === 0 && (
// //               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No locations saved yet.</div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// import { useState, useEffect, useRef } from 'react'
// import { getLocations, createLocation, deleteLocation, updateLocation, getZones } from '../../../api'
// import { ConfirmSaveModal } from '../components/MasterFormUI'

// const blank = {
//   zone: '', location: '',
//   lat: 51.505, lng: -0.09,
//   qr: '', rfid: '',
//   image: null, imagePreview: null,
// }

// /* ── QR Code Generator using qrserver CDN ── */
// function QRPreview({ value }) {
//   if (!value) return null
//   const url = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(value)}`
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px', border: '1px solid #dadce0', borderRadius: '8px', background: '#fafafa' }}>
//       <img src={url} alt="QR Code" style={{ width: '100px', height: '100px', borderRadius: '4px' }} />
//       <span style={{ fontSize: '11px', color: '#5f6368' }}>{value}</span>
//     </div>
//   )
// }


// /* ── Zone dropdown — shows name, sends id to API ── */
// function ZoneDropdown({ value, onChange, options }) {
//   const [open, setOpen] = useState(false)
//   const ref = useRef(null)
//   useEffect(() => {
//     const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
//     document.addEventListener('mousedown', h)
//     return () => document.removeEventListener('mousedown', h)
//   }, [])
//   const selected = options.find(o => o.id === value)
//   return (
//     <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
//       <div style={{ display: 'flex' }}>
//         <input type="text" placeholder="Zone" readOnly value={selected ? selected.name : ''}
//           onFocus={() => setOpen(true)}
//           style={{ flex: 1, minWidth: 0, padding: '10px 14px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff', cursor: 'pointer' }}
//         />
//         <button type="button" onClick={() => setOpen((o) => !o)}
//           style={{ width: '38px', height: '42px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 8px 8px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//         >+</button>
//       </div>
//       {open && (
//         <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
//           {options.length === 0
//             ? <div style={{ padding: '10px 14px', fontSize: '13px', color: '#9aa0a6' }}>No zones</div>
//             : options.map((opt) => (
//               <div key={opt.id} onMouseDown={() => { onChange(opt.id); setOpen(false) }}
//                 style={{ padding: '10px 14px', fontSize: '13px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', background: opt.id === value ? '#f0f4ff' : '#fff' }}
//                 onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
//                 onMouseLeave={(e) => e.currentTarget.style.background = opt.id === value ? '#f0f4ff' : '#fff'}
//               >{opt.name}</div>
//             ))}
//         </div>
//       )}
//     </div>
//   )
// }

// const fallbackColors = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#4a90d9']

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
//         <input type="text" placeholder={placeholder} value={value}
//           onChange={(e) => onChange(e.target.value)}
//           style={{ flex: 1, minWidth: 0, padding: '10px 14px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }}
//         />
//         <button type="button" onClick={() => setOpen((o) => !o)}
//           style={{ width: '38px', height: '42px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 8px 8px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//         >+</button>
//       </div>
//       {open && (
//         <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
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

// /* ── Location input with geocoding (no + button) ── */
// function LocationInput({ value, onChange, onGeocode, options, placeholder }) {
//   const [open, setOpen] = useState(false)
//   const debounceRef = useRef(null)
//   const ref = useRef(null)

//   useEffect(() => {
//     const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
//     document.addEventListener('mousedown', h)
//     return () => document.removeEventListener('mousedown', h)
//   }, [])

//   const handleChange = (e) => {
//     const v = e.target.value
//     onChange(v)
//     setOpen(true)
//     // Debounce geocoding: wait 600ms after user stops typing
//     if (debounceRef.current) clearTimeout(debounceRef.current)
//     if (v.trim().length > 3) {
//       debounceRef.current = setTimeout(async () => {
//         try {
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(v)}&limit=1`,
//             { headers: { 'Accept-Language': 'en' } }
//           )
//           const data = await res.json()
//           if (data && data[0]) {
//             onGeocode(parseFloat(data[0].lat), parseFloat(data[0].lon))
//           }
//         } catch {}
//       }, 600)
//     }
//   }

//   const filteredOpts = options.filter(o => o.toLowerCase().includes(value.toLowerCase()))

//   return (
//     <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
//       <input
//         type="text"
//         placeholder={placeholder}
//         value={value}
//         onChange={handleChange}
//         onFocus={() => setOpen(true)}
//         style={{ width: '100%', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }}
//       />
//       {open && filteredOpts.length > 0 && (
//         <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
//           {filteredOpts.map((opt) => (
//             <div key={opt} onMouseDown={() => { onChange(opt); setOpen(false) }}
//               style={{ padding: '10px 14px', fontSize: '13px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' }}
//               onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
//               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
//             >{opt}</div>
//           ))}
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
//         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '18px', color: '#5f6368', lineHeight: 1 }}>⋮</button>
//       {open && (
//         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
//           {items.map(({ label, icon, color, action }) => (
//             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
//               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
//               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
//               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
//             ><span>{icon}</span>{label}</div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// /* ── Leaflet map loaded via CDN ── */
// function LocationMap({ lat, lng, onChange }) {
//   const mapRef    = useRef(null)
//   const leafletRef = useRef(null)
//   const markerRef  = useRef(null)

//   useEffect(() => {
//     // Load Leaflet CSS
//     if (!document.getElementById('leaflet-css')) {
//       const link = document.createElement('link')
//       link.id   = 'leaflet-css'
//       link.rel  = 'stylesheet'
//       link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
//       document.head.appendChild(link)
//     }

//     // Load Leaflet JS then init map
//     const initMap = () => {
//       if (!mapRef.current || leafletRef.current) return
//       const L   = window.L
//       const map = L.map(mapRef.current, { zoomControl: false }).setView([lat, lng], 13)

//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors',
//         maxZoom: 19,
//       }).addTo(map)

//       L.control.zoom({ position: 'bottomright' }).addTo(map)

//       // Custom marker icon (no default image path issues)
//       const icon = L.divIcon({
//         className: '',
//         html: `<div style="width:20px;height:20px;background:#1a73e8;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
//         iconSize: [20, 20],
//         iconAnchor: [10, 10],
//       })

//       const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map)
//       markerRef.current = marker

//       marker.on('dragend', () => {
//         const { lat: newLat, lng: newLng } = marker.getLatLng()
//         onChange(newLat, newLng)
//       })

//       map.on('click', (e) => {
//         marker.setLatLng(e.latlng)
//         onChange(e.latlng.lat, e.latlng.lng)
//       })

//       leafletRef.current = map
//     }

//     if (window.L) {
//       initMap()
//     } else {
//       const script = document.createElement('script')
//       script.src   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
//       script.onload = initMap
//       document.head.appendChild(script)
//     }

//     return () => {
//       if (leafletRef.current) {
//         leafletRef.current.remove()
//         leafletRef.current = null
//       }
//     }
//   }, [])

//   // Update marker when lat/lng prop changes from outside
//   useEffect(() => {
//     if (markerRef.current && leafletRef.current) {
//       markerRef.current.setLatLng([lat, lng])
//       leafletRef.current.setView([lat, lng], leafletRef.current.getZoom())
//     }
//   }, [lat, lng])

//   return (
//     <div ref={mapRef} style={{ width: '100%', height: '200px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #dadce0', zIndex: 0 }} />
//   )
// }

// /* ══════════════════════════════════════════════════════
//    SAVED PANEL — same pattern as UserForm
// ══════════════════════════════════════════════════════ */
// const LOC_COLORS = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#4a90d9']

// function SavedPanel({
//   title, items, renderCard,
//   selectMode, selectedIds,
//   onEnterSelect, onToggle, onDeleteSelected, onCancelSelect,
//   onShowToggle, show,
//   getItemLabel, extraHeader, statusBanner,
// }) {
//   const [search, setSearch] = useState('')
//   const [ddOpen, setDdOpen] = useState(false)
//   const [ddSearch, setDdSearch] = useState('')
//   const ddRef = useRef(null)

//   useEffect(() => {
//     const h = e => { if (ddRef.current && !ddRef.current.contains(e.target)) { setDdOpen(false); setDdSearch('') } }
//     document.addEventListener('mousedown', h)
//     return () => document.removeEventListener('mousedown', h)
//   }, [])

//   const getLabel = item => getItemLabel ? getItemLabel(item) : (item.name || String(item.id))
//   const filteredItems = items.filter(item => getLabel(item).toLowerCase().includes(search.toLowerCase()))
//   const ddFiltered    = items.filter(item => getLabel(item).toLowerCase().includes(ddSearch.toLowerCase()))

//   return (
//     <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

//       {/* Header */}
//       <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
//         {selectMode ? (
//           <>
//             <div onClick={() => onToggle(selectedIds.length === items.length ? [] : items.map(i => i.id))}
//               style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === items.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === items.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
//               {selectedIds.length === items.length
//                 ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
//                 : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
//             </div>
//             <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
//               {selectedIds.length > 0 ? `${selectedIds.length} selected` : title}
//             </h2>
//             <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
//               <button onClick={onDeleteSelected} disabled={selectedIds.length === 0}
//                 style={{ display: 'flex', alignItems: 'center', gap: '4px', background: selectedIds.length > 0 ? '#fce8e6' : '#f5f5f5', border: 'none', color: selectedIds.length > 0 ? '#d93025' : '#bbb', fontSize: '12px', fontWeight: 600, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', padding: '5px 10px', borderRadius: '4px' }}>
//                 🗑 Delete
//               </button>
//               <button onClick={onCancelSelect}
//                 style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: '12px', fontWeight: 500, cursor: 'pointer', padding: '5px 8px', borderRadius: '4px' }}>
//                 ✕ Cancel
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             {show && (
//               <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0 }}>
//                 {title}
//                 <span style={{ fontSize: '12px', fontWeight: 400, color: '#9aa0a6', marginLeft: '6px' }}>({items.length})</span>
//               </h2>
//             )}
//             <button onClick={onShowToggle} style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
//               {show ? '⊏' : '⊐'}
//             </button>
//             {extraHeader}
//           </>
//         )}
//       </div>

//       {statusBanner}

//       {/* Quick-select + search */}
//       {show && !selectMode && (
//         <div style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
//           <div ref={ddRef} style={{ position: 'relative' }}>
//             <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #dadce0', borderRadius: '8px', height: '36px', background: '#fff', overflow: 'hidden' }}>
//               <span style={{ padding: '0 8px', fontSize: '13px', color: '#9aa0a6', flexShrink: 0 }}>▾</span>
//               <input value={ddOpen ? ddSearch : ''} placeholder={`Quick-select ${title.toLowerCase()}…`}
//                 onFocus={() => { setDdOpen(true); setDdSearch('') }}
//                 onChange={e => { setDdSearch(e.target.value); setDdOpen(true) }}
//                 style={{ flex: 1, border: 'none', outline: 'none', fontSize: '12px', color: '#202124', background: 'transparent', height: '100%', padding: '0 4px' }} />
//               {ddOpen && (
//                 <button onMouseDown={() => { setDdOpen(false); setDdSearch('') }}
//                   style={{ padding: '0 8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#9aa0a6' }}>✕</button>
//               )}
//             </div>
//             {ddOpen && (
//               <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
//                 {ddFiltered.length === 0
//                   ? <div style={{ padding: '10px 14px', fontSize: '12px', color: '#9aa0a6' }}>No matches</div>
//                   : ddFiltered.map((item, idx) => (
//                     <div key={item.id} onMouseDown={() => { onEnterSelect(item.id); setDdOpen(false); setDdSearch('') }}
//                       style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '12px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' }}
//                       onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
//                       onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
//                       <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: LOC_COLORS[idx % LOC_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', flexShrink: 0 }}>
//                         {getLabel(item).charAt(0).toUpperCase()}
//                       </div>
//                       <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getLabel(item)}</span>
//                     </div>
//                   ))}
//               </div>
//             )}
//           </div>
//           <div style={{ position: 'relative' }}>
//             <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#9aa0a6' }}>🔍</span>
//             <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter list…"
//               style={{ width: '100%', padding: '6px 28px 6px 26px', border: '1px solid #e8eaed', borderRadius: '6px', fontSize: '12px', color: '#202124', outline: 'none', boxSizing: 'border-box', background: '#fafbfc' }} />
//             {search && (
//               <span onMouseDown={() => setSearch('')}
//                 style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#9aa0a6', cursor: 'pointer' }}>✕</span>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Cards */}
//       {show && (
//         <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>
//           {filteredItems.length === 0 && (
//             <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>
//               {items.length === 0 ? 'No locations saved yet.' : 'No matches.'}
//             </div>
//           )}
//           {filteredItems.map((item, idx) => {
//             const isChecked = selectedIds.includes(item.id)
//             return (
//               <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
//                 {selectMode && (
//                   <div onClick={() => onToggle(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id])}
//                     style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
//                     {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
//                   </div>
//                 )}
//                 <div style={{ flex: 1, minWidth: 0, border: `1px solid ${selectMode && isChecked ? '#1a73e8' : '#e0e0e0'}`, borderRadius: '10px', padding: '10px 12px', background: selectMode && isChecked ? '#f0f4ff' : '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>
//                   {renderCard(item, idx)}
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       )}
//     </div>
//   )
// }

// export default function LocationForm() {
//   const [form, setForm]           = useState(blank)
//   const [saved, setSaved]         = useState([])
//   const [busy, setBusy]           = useState(false)
//   const [sel, setSel]             = useState(null)
//   const [confirm, setConfirm]     = useState(false)
//   const [show, setShow]           = useState(true)
//   const [loadingLocs, setLoadingLocs] = useState(false)
//   const [selectMode, setSelectMode]   = useState(false)
//   const [selectedIds, setSelectedIds] = useState([])

//   const imgRef = useRef(null)

//   const [zoneOpts, setZoneOpts] = useState([])
//   const [locOpts,  setLocOpts]  = useState([])

//   const loadZones = () => {
//     getZones().then(zones => {
//       const opts = zones
//         .filter(z => z.id != null && (z.zoneNameLong || z.zoneNameShort || z.zoneName))
//         .map(z => ({ id: String(z.id), name: z.zoneNameLong || z.zoneNameShort || z.zoneName }))
//         .sort((a, b) => a.name.localeCompare(b.name))
//       setZoneOpts(opts)
//     }).catch(() => {})
//   }

//   /* ── Load locations from API on mount ── */
//   const loadLocations = async () => {
//     setLoadingLocs(true)
//     try {
//       const locs = await getLocations()
//       console.log('[LocationForm] loaded locations:', locs)
//       setSaved(locs)
//       const names = [...new Set(locs.map(l => l.name).filter(Boolean))].sort()
//       if (names.length) setLocOpts(names)
//     } catch {}
//     finally { setLoadingLocs(false) }
//   }

//   useEffect(() => { loadZones(); loadLocations() }, [])

//   useEffect(() => {
//     if (typeof window === 'undefined') return
//     window.addEventListener('zones-updated', loadZones)
//     return () => window.removeEventListener('zones-updated', loadZones)
//   }, [])

//   const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

//   const handleEdit  = (item) => {
//     setForm({ ...blank, location: item.name || '', zone: item.zone || '', lat: Number(item.lat) || blank.lat, lng: Number(item.lon || item.lng) || blank.lng, qr: item.qr || '', rfid: item.rfid || '', image: null, imagePreview: null })
//     setSel(item.id)
//   }
//   const handleClone = (item) => {
//     setForm({ ...blank, location: item.name || '', zone: item.zone || '', lat: Number(item.lat) || blank.lat, lng: Number(item.lon || item.lng) || blank.lng, qr: item.qr || '', rfid: item.rfid || '', image: null, imagePreview: null })
//     setSel(null)
//   }
//   const handleCancelEdit = () => { setForm(blank); setSel(null) }
//   const handleSaveClick  = () => { if (!form.zone && !form.location) return; setConfirm(true) }

//   const handleConfirmed = async () => {
//     setBusy(true)
//     const payload = {
//       name: form.location,
//       zone: form.zone,
//       lat:  String(form.lat),
//       lon:  String(form.lng),
//       qr:   form.qr,
//       rfid: form.rfid,
//       image: form.imagePreview ? [form.imagePreview] : [],
//     }
//     try {
//       if (sel) {
//         await updateLocation(sel, payload)
//         setSaved(p => p.map(l => l.id === sel ? { ...l, ...payload, id: sel } : l))
//         setSel(null); setForm(blank)
//       } else {
//         await createLocation(payload)
//         // Server returns result:false even on success — reload from API to get the real record
//         await loadLocations()
//         setForm(blank)
//       }
//     } catch {
//       // Even if API throws, optimistically add/update so UI reflects the action
//       if (sel) {
//         setSaved(p => p.map(l => l.id === sel ? { ...l, ...payload, id: sel } : l))
//         setSel(null); setForm(blank)
//       } else {
//         const tempId = Date.now()
//         setSaved(p => [{ ...payload, id: tempId }, ...p])
//         setForm(blank)
//       }
//     }
//     setBusy(false); setConfirm(false)
//   }

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this location?')) return
//     try { await deleteLocation(id) } catch {}
//     setSaved(p => p.filter(l => l.id !== id))
//     if (sel === id) { setForm(blank); setSel(null) }
//   }

//   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
//   const toggleSelect    = fn  => setSelectedIds(typeof fn === 'function' ? fn : fn)
//   const cancelSelect    = ()  => { setSelectMode(false); setSelectedIds([]) }
//   const deleteSelected  = async () => {
//     if (!window.confirm(`Delete ${selectedIds.length} selected location(s)?`)) return
//     for (const id of selectedIds) { try { await deleteLocation(id) } catch {} }
//     setSaved(p => p.filter(l => !selectedIds.includes(l.id)))
//     if (selectedIds.includes(sel)) { setForm(blank); setSel(null) }
//     setSelectMode(false); setSelectedIds([])
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]; if (!file) return
//     const reader = new FileReader()
//     reader.onload = (ev) => set('imagePreview', ev.target.result)
//     reader.readAsDataURL(file)
//     set('image', file)
//   }

//   const selectedZoneName = zoneOpts.find(o => o.id === form.zone)?.name || form.zone
//   const summary = [
//     { label: 'Zone',     value: selectedZoneName },
//     { label: 'Location', value: form.location },
//     { label: 'QR Code',  value: form.qr },
//     { label: 'RFID',     value: form.rfid },
//     { label: 'Lat',      value: String(form.lat) },
//     { label: 'Lng',      value: String(form.lng) },
//   ]

//   return (
//     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
//       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

//       {/* ═══ LEFT: FORM ═══ */}
//       <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
//         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, lineHeight: '28px' }}>
//           {sel ? 'Edit Location' : 'Create Location'}
//         </h2>

//         <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

//           {/* Zone | Location */}
//           <div style={{ display: 'flex', gap: '14px' }}>
//             <ZoneDropdown value={form.zone} onChange={(id) => set('zone', id)} options={zoneOpts} />
//             <LocationInput placeholder="Location" value={form.location} onChange={(v) => set('location', v)} options={locOpts}
//               onGeocode={(lat, lng) => setForm((p) => ({ ...p, lat, lng }))} />
//           </div>

//           {/* Real OpenStreetMap */}
//           <LocationMap
//             lat={form.lat}
//             lng={form.lng}
//             onChange={(lat, lng) => setForm((p) => ({ ...p, lat, lng }))}
//           />

//           {/* QR code | or | RFID */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//             <input
//               placeholder="QR code"
//               value={form.qr}
//               onChange={(e) => set('qr', e.target.value)}
//               style={{ flex: 1, border: '1px solid #dadce0', borderRadius: '8px', height: '42px', padding: '0 12px', fontSize: '13px', color: '#202124', outline: 'none', boxSizing: 'border-box' }}
//             />
//             <span style={{ fontSize: '13px', color: '#9aa0a6', flexShrink: 0 }}>or</span>
//             <input
//               placeholder="RFID"
//               value={form.rfid}
//               onChange={(e) => set('rfid', e.target.value)}
//               style={{ flex: 1, border: '1px solid #dadce0', borderRadius: '8px', height: '42px', padding: '0 12px', fontSize: '13px', color: '#202124', outline: 'none', boxSizing: 'border-box' }}
//             />
//           </div>

//           {/* Add image */}
//           <div onClick={() => imgRef.current?.click()}
//             style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', background: '#fff', height: '42px', boxSizing: 'border-box' }}>
//             {form.imagePreview ? (
//               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                 <img src={form.imagePreview} alt="preview" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
//                 <span style={{ fontSize: '13px', color: '#202124' }}>Image selected</span>
//               </div>
//             ) : (
//               <span style={{ fontSize: '13px', color: '#9aa0a6' }}>Add image</span>
//             )}
//             <span style={{ fontSize: '18px', color: '#5f6368' }}>📎</span>
//             <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
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

//       {/* ═══ RIGHT: SAVED PANEL ═══ */}
//       <SavedPanel
//         title="Locations"
//         items={saved}
//         show={show}
//         onShowToggle={() => setShow(s => !s)}
//         selectMode={selectMode}
//         selectedIds={selectedIds}
//         onEnterSelect={enterSelectMode}
//         onToggle={toggleSelect}
//         onDeleteSelected={deleteSelected}
//         onCancelSelect={cancelSelect}
//         getItemLabel={item => item.name || String(item.id)}
//         extraHeader={
//           <button onClick={loadLocations} disabled={loadingLocs} title="Refresh locations"
//             style={{ background: 'none', border: '1px solid #dadce0', borderRadius: '4px', cursor: loadingLocs ? 'wait' : 'pointer', fontSize: '13px', padding: '2px 6px', color: '#5f6368', flexShrink: 0 }}>
//             {loadingLocs ? '⏳' : '↻'}
//           </button>
//         }
//         statusBanner={
//           loadingLocs ? (
//             <div style={{ padding: '10px 14px', fontSize: '12px', color: '#1a73e8', background: '#e8f0fe', borderBottom: '1px solid #c6dafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
//               <span>⏳</span> Loading locations…
//             </div>
//           ) : null
//         }
//         renderCard={(l, idx) => {
//           const color = LOC_COLORS[idx % LOC_COLORS.length]
//           const zoneName = zoneOpts.find(o => o.id === String(l.zone))?.name || (l.zone ? `Zone ${l.zone}` : '')
//           return (
//             <>
//               {/* Top: icon + name + menu */}
//               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '6px' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
//                   <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>
//                     🏢
//                   </div>
//                   <div style={{ minWidth: 0 }}>
//                     <div style={{ fontSize: '13px', fontWeight: 600, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                       {l.name || l.location_name || l.locationName || l.label || '(no name)'}
//                     </div>
//                     <div style={{ fontSize: '11px', color: '#5f6368' }}>{zoneName}</div>
//                   </div>
//                 </div>
//                 <CardMenu
//                   onSelect={() => enterSelectMode(l.id)}
//                   onClone={() => handleClone(l)}
//                   onEdit={() => handleEdit(l)}
//                   onDelete={() => handleDelete(l.id)}
//                 />
//               </div>

//               {/* Pills */}
//               <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
//                 {[
//                   zoneName && { label: zoneName, bg: '#e8f0fe', border: '#d2e3fc', color: '#1a73e8' },
//                   l.qr     && { label: 'QR: ' + l.qr,   bg: '#fef7e0', border: '#fde293', color: '#856400' },
//                   l.rfid   && { label: 'RFID: ' + l.rfid, bg: '#e6f4ea', border: '#b7dfbf', color: '#1e6e3e' },
//                   (l.lat || l.lon) && { label: `${Number(l.lat).toFixed(4)}, ${Number(l.lon || l.lng).toFixed(4)}`, bg: '#f3e8fd', border: '#e0c3fc', color: '#6a1a8e' },
//                 ].filter(Boolean).map(t => (
//                   <span key={t.label} style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '2px 8px', fontSize: '11px', color: t.color, whiteSpace: 'nowrap', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                     {t.label}
//                   </span>
//                 ))}
//               </div>
//             </>
//           )
//         }}
//       />
//     </div>
//   )
// }

// import { useState, useEffect, useRef } from 'react'
// import { getLocations, createLocation, deleteLocation, updateLocation, getZones } from '../../../api'
// import { ConfirmSaveModal } from '../components/MasterFormUI'

// const blank = {
//   zone: '', location: '',
//   lat: 51.505, lng: -0.09,
//   qrCode: '', rfid: '',
//   image: null, imagePreview: null,
// }

// const fallbackColors = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#4a90d9']

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
//         <input type="text" placeholder={placeholder} value={value}
//           onChange={(e) => onChange(e.target.value)}
//           style={{ flex: 1, minWidth: 0, padding: '10px 14px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }}
//         />
//         <button type="button" onClick={() => setOpen((o) => !o)}
//           style={{ width: '38px', height: '42px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 8px 8px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//         >+</button>
//       </div>
//       {open && (
//         <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
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
//         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '18px', color: '#5f6368', lineHeight: 1 }}>⋮</button>
//       {open && (
//         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
//           {items.map(({ label, icon, color, action }) => (
//             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
//               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
//               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
//               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
//             ><span>{icon}</span>{label}</div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// /* ── Leaflet map loaded via CDN ── */
// function LocationMap({ lat, lng, onChange }) {
//   const mapRef    = useRef(null)
//   const leafletRef = useRef(null)
//   const markerRef  = useRef(null)

//   useEffect(() => {
//     // Load Leaflet CSS
//     if (!document.getElementById('leaflet-css')) {
//       const link = document.createElement('link')
//       link.id   = 'leaflet-css'
//       link.rel  = 'stylesheet'
//       link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
//       document.head.appendChild(link)
//     }

//     // Load Leaflet JS then init map
//     const initMap = () => {
//       if (!mapRef.current || leafletRef.current) return
//       const L   = window.L
//       const map = L.map(mapRef.current, { zoomControl: false }).setView([lat, lng], 13)

//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors',
//         maxZoom: 19,
//       }).addTo(map)

//       L.control.zoom({ position: 'bottomright' }).addTo(map)

//       // Custom marker icon (no default image path issues)
//       const icon = L.divIcon({
//         className: '',
//         html: `<div style="width:20px;height:20px;background:#1a73e8;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
//         iconSize: [20, 20],
//         iconAnchor: [10, 10],
//       })

//       const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map)
//       markerRef.current = marker

//       marker.on('dragend', () => {
//         const { lat: newLat, lng: newLng } = marker.getLatLng()
//         onChange(newLat, newLng)
//       })

//       map.on('click', (e) => {
//         marker.setLatLng(e.latlng)
//         onChange(e.latlng.lat, e.latlng.lng)
//       })

//       leafletRef.current = map
//     }

//     if (window.L) {
//       initMap()
//     } else {
//       const script = document.createElement('script')
//       script.src   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
//       script.onload = initMap
//       document.head.appendChild(script)
//     }

//     return () => {
//       if (leafletRef.current) {
//         leafletRef.current.remove()
//         leafletRef.current = null
//       }
//     }
//   }, [])

//   // Update marker when lat/lng prop changes from outside
//   useEffect(() => {
//     if (markerRef.current && leafletRef.current) {
//       markerRef.current.setLatLng([lat, lng])
//       leafletRef.current.setView([lat, lng], leafletRef.current.getZoom())
//     }
//   }, [lat, lng])

//   return (
//     <div ref={mapRef} style={{ width: '100%', height: '200px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #dadce0', zIndex: 0 }} />
//   )
// }

// export default function LocationForm() {
//   const [form, setForm]           = useState(blank)
//   const [saved, setSaved]         = useState([])
//   const [busy, setBusy]           = useState(false)
//   const [sel, setSel]             = useState(null)
//   const [confirm, setConfirm]     = useState(false)
//   const [showSaved, setShowSaved] = useState(true)
//   const [selectMode, setSelectMode]   = useState(false)
//   const [selectedIds, setSelectedIds] = useState([])

//   const qrRef  = useRef(null)
//   const imgRef = useRef(null)

//   const [zoneOpts, setZoneOpts] = useState([])
//   const [locOpts,  setLocOpts]  = useState([])

//   // Fetch zones from their source (Others → Zone master data)
//   useEffect(() => {
//     getZones().then(zones => {
//       const names = zones.map(z => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
//       setZoneOpts(names)
//     }).catch(() => {})
//   }, [])

//   useEffect(() => {
//     if (typeof window === 'undefined') return
//     const handleZonesUpdated = () => {
//       getZones().then(zones => {
//         const names = zones.map(z => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
//         setZoneOpts(names)
//       }).catch(() => {})
//     }
//     window.addEventListener('zones-updated', handleZonesUpdated)
//     return () => window.removeEventListener('zones-updated', handleZonesUpdated)
//   }, [])

//   useEffect(() => {
//     getLocations().then((locs) => {
//       setSaved(locs)
//       const l = [...new Set(locs.map((l) => l.location).filter(Boolean))].sort()
//       if (l.length) setLocOpts(l)
//     }).catch(() => {})
//   }, [])

//   const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

//   const handleEdit  = (item) => { setForm({ ...blank, ...item, image: null, imagePreview: null }); setSel(item.id) }
//   const handleClone = (item) => { const { id, ...rest } = item; setForm({ ...blank, ...rest, image: null, imagePreview: null }); setSel(null) }
//   const handleCancelEdit = () => { setForm(blank); setSel(null) }
//   const handleSaveClick  = () => { if (!form.zone && !form.location) return; setConfirm(true) }

//   const handleConfirmed = async () => {
//     setBusy(true)
//     const { image, imagePreview, ...payload } = form
//     try {
//       if (sel) {
//         const updated = await updateLocation(sel, payload)
//         setSaved((p) => p.map((l) => (l.id === sel ? { ...l, ...updated } : l)))
//         setSel(null); setForm(blank)
//       } else {
//         const created = await createLocation(payload)
//         setSaved((p) => [created, ...p]); setForm(blank)
//       }
//     } catch {
//       if (sel) { setSaved((p) => p.map((l) => (l.id === sel ? { ...l, ...payload } : l))); setSel(null); setForm(blank) }
//     }
//     setBusy(false); setConfirm(false)
//   }

//   const handleDelete = async (id) => {
//     try { await deleteLocation(id) } catch {}
//     setSaved((p) => p.filter((l) => l.id !== id))
//     if (sel === id) { setForm(blank); setSel(null) }
//   }

//   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
//   const toggleSelect    = (id) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
//   const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
//   const deleteSelected  = async () => {
//     for (const id of selectedIds) { try { await deleteLocation(id) } catch {} }
//     setSaved((p) => p.filter((l) => !selectedIds.includes(l.id)))
//     if (selectedIds.includes(sel)) { setForm(blank); setSel(null) }
//     setSelectMode(false); setSelectedIds([])
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (!file) return
//     const reader = new FileReader()
//     reader.onload = (ev) => set('imagePreview', ev.target.result)
//     reader.readAsDataURL(file)
//     set('image', file)
//   }

//   const summary = [
//     { label: 'Zone',     value: form.zone },
//     { label: 'Location', value: form.location },
//     { label: 'QR Code',  value: form.qrCode },
//     { label: 'RFID',     value: form.rfid },
//     { label: 'Lat',      value: form.lat },
//     { label: 'Lng',      value: form.lng },
//   ]

//   return (
//     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
//       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

//       {/* ═══ LEFT: FORM ═══ */}
//       <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
//         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, lineHeight: '28px' }}>
//           {sel ? 'Edit Location' : 'Create Location'}
//         </h2>

//         <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

//           {/* Zone | Location */}
//           <div style={{ display: 'flex', gap: '14px' }}>
//             <FieldDropdown placeholder="Zone"     value={form.zone}     onChange={(v) => set('zone', v)}     options={zoneOpts} />
//             <FieldDropdown placeholder="Location" value={form.location} onChange={(v) => set('location', v)} options={locOpts} />
//           </div>

//           {/* Real OpenStreetMap */}
//           <LocationMap
//             lat={form.lat}
//             lng={form.lng}
//             onChange={(lat, lng) => setForm((p) => ({ ...p, lat, lng }))}
//           />

//           {/* QR code | or | RFID */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//             <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #dadce0', borderRadius: '8px', height: '42px', overflow: 'hidden' }}>
//               <input placeholder="QR code" value={form.qrCode} onChange={(e) => set('qrCode', e.target.value)}
//                 style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '13px', color: '#202124', background: 'transparent' }} />
//               <button onClick={() => qrRef.current?.click()}
//                 style={{ background: 'none', border: 'none', padding: '0 10px', cursor: 'pointer', fontSize: '18px', color: '#5f6368', flexShrink: 0 }}>📎</button>
//               <input ref={qrRef} type="file" style={{ display: 'none' }} />
//             </div>
//             <span style={{ fontSize: '13px', color: '#9aa0a6', flexShrink: 0 }}>or</span>
//             <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #dadce0', borderRadius: '8px', height: '42px', overflow: 'hidden' }}>
//               <input placeholder="RFID" value={form.rfid} onChange={(e) => set('rfid', e.target.value)}
//                 style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '13px', color: '#202124', background: 'transparent' }} />
//               <button style={{ background: 'none', border: 'none', padding: '0 10px', cursor: 'pointer', fontSize: '18px', color: '#5f6368', flexShrink: 0 }}>📎</button>
//             </div>
//           </div>

//           {/* Add image */}
//           <div onClick={() => imgRef.current?.click()}
//             style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', background: '#fff', height: '42px', boxSizing: 'border-box' }}>
//             {form.imagePreview ? (
//               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                 <img src={form.imagePreview} alt="preview" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
//                 <span style={{ fontSize: '13px', color: '#202124' }}>Image selected</span>
//               </div>
//             ) : (
//               <span style={{ fontSize: '13px', color: '#9aa0a6' }}>Add image</span>
//             )}
//             <span style={{ fontSize: '18px', color: '#5f6368' }}>📎</span>
//             <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
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

//       {/* ═══ RIGHT: SAVED LOCATIONS ═══ */}
//       <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

//         {/* Header */}
//         <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
//           {selectMode ? (
//             <>
//               <div
//                 onClick={() => setSelectedIds(selectedIds.length === saved.length ? [] : saved.map((l) => l.id))}
//                 style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
//               >
//                 {selectedIds.length === saved.length
//                   ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
//                   : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
//               </div>
//               <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
//                 {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Location'}
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
//               {showSaved && <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0, lineHeight: '28px' }}>Saved Location</h2>}
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
//             {saved.map((l, idx) => {
//               const isChecked = selectedIds.includes(l.id)
//               const color     = fallbackColors[idx % fallbackColors.length]
//               return (
//                 <div key={l.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>

//                   {selectMode && (
//                     <div onClick={() => toggleSelect(l.id)}
//                       style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
//                       {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
//                     </div>
//                   )}

//                   <div style={{ flex: 1, minWidth: 0, border: `1px solid ${selectMode && isChecked ? '#1a73e8' : '#e0e0e0'}`, borderRadius: '10px', padding: '10px 12px', background: selectMode && isChecked ? '#f0f4ff' : '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>

//                     {/* Top: icon + name + company + menu */}
//                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '6px' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
//                         <span style={{ fontSize: '20px', flexShrink: 0 }}>🏢</span>
//                         <div style={{ minWidth: 0 }}>
//                           <div style={{ fontSize: '13px', fontWeight: 600, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                             {l.location || 'OrbidX(Obx)'}
//                           </div>
//                           <div style={{ fontSize: '11px', color: '#5f6368' }}>{l.company || 'Company code'}</div>
//                         </div>
//                       </div>
//                       <CardMenu
//                         onSelect={() => enterSelectMode(l.id)}
//                         onClone={() => handleClone(l)}
//                         onEdit={() => handleEdit(l)}
//                         onDelete={() => handleDelete(l.id)}
//                       />
//                     </div>

//                     {/* Pills */}
//                     <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
//                       {[l.zone || 'Zone', 'QR/Barcode', l.image ? 'Attached' : 'Attached', l.location || 'Location'].map((tag, i) => (
//                         <span key={i} style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#333' }}>{tag}</span>
//                       ))}
//                     </div>

//                   </div>
//                 </div>
//               )
//             })}

//             {saved.length === 0 && (
//               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No locations saved yet.</div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// import { useState, useEffect, useRef } from 'react'
// import { getLocations, createLocation, deleteLocation, updateLocation, getZones } from '../../../api'
// import { ConfirmSaveModal } from '../components/MasterFormUI'

// const blank = {
//   zone: '', location: '',
//   lat: 51.505, lng: -0.09,
//   qrCode: '', rfid: '',
//   image: null, imagePreview: null,
// }

// const fallbackColors = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#4a90d9']

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
//         <input type="text" placeholder={placeholder} value={value}
//           onChange={(e) => onChange(e.target.value)}
//           style={{ flex: 1, minWidth: 0, padding: '10px 14px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }}
//         />
//         <button type="button" onClick={() => setOpen((o) => !o)}
//           style={{ width: '38px', height: '42px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 8px 8px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//         >+</button>
//       </div>
//       {open && (
//         <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
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
//         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '18px', color: '#5f6368', lineHeight: 1 }}>⋮</button>
//       {open && (
//         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
//           {items.map(({ label, icon, color, action }) => (
//             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
//               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
//               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
//               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
//             ><span>{icon}</span>{label}</div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// /* ── Leaflet map loaded via CDN ── */
// function LocationMap({ lat, lng, onChange }) {
//   const mapRef    = useRef(null)
//   const leafletRef = useRef(null)
//   const markerRef  = useRef(null)

//   useEffect(() => {
//     // Load Leaflet CSS
//     if (!document.getElementById('leaflet-css')) {
//       const link = document.createElement('link')
//       link.id   = 'leaflet-css'
//       link.rel  = 'stylesheet'
//       link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
//       document.head.appendChild(link)
//     }

//     // Load Leaflet JS then init map
//     const initMap = () => {
//       if (!mapRef.current || leafletRef.current) return
//       const L   = window.L
//       const map = L.map(mapRef.current, { zoomControl: false }).setView([lat, lng], 13)

//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors',
//         maxZoom: 19,
//       }).addTo(map)

//       L.control.zoom({ position: 'bottomright' }).addTo(map)

//       // Custom marker icon (no default image path issues)
//       const icon = L.divIcon({
//         className: '',
//         html: `<div style="width:20px;height:20px;background:#1a73e8;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
//         iconSize: [20, 20],
//         iconAnchor: [10, 10],
//       })

//       const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map)
//       markerRef.current = marker

//       marker.on('dragend', () => {
//         const { lat: newLat, lng: newLng } = marker.getLatLng()
//         onChange(newLat, newLng)
//       })

//       map.on('click', (e) => {
//         marker.setLatLng(e.latlng)
//         onChange(e.latlng.lat, e.latlng.lng)
//       })

//       leafletRef.current = map
//     }

//     if (window.L) {
//       initMap()
//     } else {
//       const script = document.createElement('script')
//       script.src   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
//       script.onload = initMap
//       document.head.appendChild(script)
//     }

//     return () => {
//       if (leafletRef.current) {
//         leafletRef.current.remove()
//         leafletRef.current = null
//       }
//     }
//   }, [])

//   // Update marker when lat/lng prop changes from outside
//   useEffect(() => {
//     if (markerRef.current && leafletRef.current) {
//       markerRef.current.setLatLng([lat, lng])
//       leafletRef.current.setView([lat, lng], leafletRef.current.getZoom())
//     }
//   }, [lat, lng])

//   return (
//     <div ref={mapRef} style={{ width: '100%', height: '200px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #dadce0', zIndex: 0 }} />
//   )
// }

// export default function LocationForm() {
//   const [form, setForm]           = useState(blank)
//   const [saved, setSaved]         = useState([])
//   const [busy, setBusy]           = useState(false)
//   const [sel, setSel]             = useState(null)
//   const [confirm, setConfirm]     = useState(false)
//   const [showSaved, setShowSaved] = useState(true)
//   const [selectMode, setSelectMode]   = useState(false)
//   const [selectedIds, setSelectedIds] = useState([])

//   const qrRef  = useRef(null)
//   const imgRef = useRef(null)

//   const [zoneOpts, setZoneOpts] = useState([])
//   const [locOpts,  setLocOpts]  = useState([])

//   // Fetch zones from their source (Others → Zone master data)
//   useEffect(() => {
//     getZones().then(zones => {
//       const names = zones.map(z => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
//       setZoneOpts(names)
//     }).catch(() => {})
//   }, [])

//   useEffect(() => {
//     if (typeof window === 'undefined') return
//     const handleZonesUpdated = () => {
//       getZones().then(zones => {
//         const names = zones.map(z => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
//         setZoneOpts(names)
//       }).catch(() => {})
//     }
//     window.addEventListener('zones-updated', handleZonesUpdated)
//     return () => window.removeEventListener('zones-updated', handleZonesUpdated)
//   }, [])

//   useEffect(() => {
//     getLocations().then((locs) => {
//       setSaved(locs)
//       const l = [...new Set(locs.map((l) => l.location).filter(Boolean))].sort()
//       if (l.length) setLocOpts(l)
//     }).catch(() => {})
//   }, [])

//   const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

//   const handleEdit  = (item) => { setForm({ ...blank, ...item, image: null, imagePreview: null }); setSel(item.id) }
//   const handleClone = (item) => { const { id, ...rest } = item; setForm({ ...blank, ...rest, image: null, imagePreview: null }); setSel(null) }
//   const handleCancelEdit = () => { setForm(blank); setSel(null) }
//   const handleSaveClick  = () => { if (!form.zone && !form.location) return; setConfirm(true) }

//   const handleConfirmed = async () => {
//     setBusy(true)
//     const { image, imagePreview, ...payload } = form
//     try {
//       if (sel) {
//         const updated = await updateLocation(sel, payload)
//         setSaved((p) => p.map((l) => (l.id === sel ? { ...l, ...updated } : l)))
//         setSel(null); setForm(blank)
//       } else {
//         const created = await createLocation(payload)
//         setSaved((p) => [created, ...p]); setForm(blank)
//       }
//     } catch {
//       if (sel) { setSaved((p) => p.map((l) => (l.id === sel ? { ...l, ...payload } : l))); setSel(null); setForm(blank) }
//     }
//     setBusy(false); setConfirm(false)
//   }

//   const handleDelete = async (id) => {
//     try { await deleteLocation(id) } catch {}
//     setSaved((p) => p.filter((l) => l.id !== id))
//     if (sel === id) { setForm(blank); setSel(null) }
//   }

//   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
//   const toggleSelect    = (id) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
//   const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
//   const deleteSelected  = async () => {
//     for (const id of selectedIds) { try { await deleteLocation(id) } catch {} }
//     setSaved((p) => p.filter((l) => !selectedIds.includes(l.id)))
//     if (selectedIds.includes(sel)) { setForm(blank); setSel(null) }
//     setSelectMode(false); setSelectedIds([])
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (!file) return
//     const reader = new FileReader()
//     reader.onload = (ev) => set('imagePreview', ev.target.result)
//     reader.readAsDataURL(file)
//     set('image', file)
//   }

//   const summary = [
//     { label: 'Zone',     value: form.zone },
//     { label: 'Location', value: form.location },
//     { label: 'QR Code',  value: form.qrCode },
//     { label: 'RFID',     value: form.rfid },
//     { label: 'Lat',      value: form.lat },
//     { label: 'Lng',      value: form.lng },
//   ]

//   return (
//     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
//       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

//       {/* ═══ LEFT: FORM ═══ */}
//       <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
//         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, lineHeight: '28px' }}>
//           {sel ? 'Edit Location' : 'Create Location'}
//         </h2>

//         <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

//           {/* Zone | Location */}
//           <div style={{ display: 'flex', gap: '14px' }}>
//             <FieldDropdown placeholder="Zone"     value={form.zone}     onChange={(v) => set('zone', v)}     options={zoneOpts} />
//             <FieldDropdown placeholder="Location" value={form.location} onChange={(v) => set('location', v)} options={locOpts} />
//           </div>

//           {/* Real OpenStreetMap */}
//           <LocationMap
//             lat={form.lat}
//             lng={form.lng}
//             onChange={(lat, lng) => setForm((p) => ({ ...p, lat, lng }))}
//           />

//           {/* QR code | or | RFID */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//             <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #dadce0', borderRadius: '8px', height: '42px', overflow: 'hidden' }}>
//               <input placeholder="QR code" value={form.qrCode} onChange={(e) => set('qrCode', e.target.value)}
//                 style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '13px', color: '#202124', background: 'transparent' }} />
//               <button onClick={() => qrRef.current?.click()}
//                 style={{ background: 'none', border: 'none', padding: '0 10px', cursor: 'pointer', fontSize: '18px', color: '#5f6368', flexShrink: 0 }}>📎</button>
//               <input ref={qrRef} type="file" style={{ display: 'none' }} />
//             </div>
//             <span style={{ fontSize: '13px', color: '#9aa0a6', flexShrink: 0 }}>or</span>
//             <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #dadce0', borderRadius: '8px', height: '42px', overflow: 'hidden' }}>
//               <input placeholder="RFID" value={form.rfid} onChange={(e) => set('rfid', e.target.value)}
//                 style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '13px', color: '#202124', background: 'transparent' }} />
//               <button style={{ background: 'none', border: 'none', padding: '0 10px', cursor: 'pointer', fontSize: '18px', color: '#5f6368', flexShrink: 0 }}>📎</button>
//             </div>
//           </div>

//           {/* Add image */}
//           <div onClick={() => imgRef.current?.click()}
//             style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', background: '#fff', height: '42px', boxSizing: 'border-box' }}>
//             {form.imagePreview ? (
//               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                 <img src={form.imagePreview} alt="preview" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
//                 <span style={{ fontSize: '13px', color: '#202124' }}>Image selected</span>
//               </div>
//             ) : (
//               <span style={{ fontSize: '13px', color: '#9aa0a6' }}>Add image</span>
//             )}
//             <span style={{ fontSize: '18px', color: '#5f6368' }}>📎</span>
//             <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
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

//       {/* ═══ RIGHT: SAVED LOCATIONS ═══ */}
//       <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

//         {/* Header */}
//         <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
//           {selectMode ? (
//             <>
//               <div
//                 onClick={() => setSelectedIds(selectedIds.length === saved.length ? [] : saved.map((l) => l.id))}
//                 style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
//               >
//                 {selectedIds.length === saved.length
//                   ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
//                   : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
//               </div>
//               <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
//                 {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Location'}
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
//               {showSaved && <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0, lineHeight: '28px' }}>Saved Location</h2>}
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
//             {saved.map((l, idx) => {
//               const isChecked = selectedIds.includes(l.id)
//               const color     = fallbackColors[idx % fallbackColors.length]
//               return (
//                 <div key={l.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>

//                   {selectMode && (
//                     <div onClick={() => toggleSelect(l.id)}
//                       style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
//                       {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
//                     </div>
//                   )}

//                   <div style={{ flex: 1, minWidth: 0, border: `1px solid ${selectMode && isChecked ? '#1a73e8' : '#e0e0e0'}`, borderRadius: '10px', padding: '10px 12px', background: selectMode && isChecked ? '#f0f4ff' : '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>

//                     {/* Top: icon + name + company + menu */}
//                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '6px' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
//                         <span style={{ fontSize: '20px', flexShrink: 0 }}>🏢</span>
//                         <div style={{ minWidth: 0 }}>
//                           <div style={{ fontSize: '13px', fontWeight: 600, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                             {l.location || 'OrbidX(Obx)'}
//                           </div>
//                           <div style={{ fontSize: '11px', color: '#5f6368' }}>{l.company || 'Company code'}</div>
//                         </div>
//                       </div>
//                       <CardMenu
//                         onSelect={() => enterSelectMode(l.id)}
//                         onClone={() => handleClone(l)}
//                         onEdit={() => handleEdit(l)}
//                         onDelete={() => handleDelete(l.id)}
//                       />
//                     </div>

//                     {/* Pills */}
//                     <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
//                       {[l.zone || 'Zone', 'QR/Barcode', l.image ? 'Attached' : 'Attached', l.location || 'Location'].map((tag, i) => (
//                         <span key={i} style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#333' }}>{tag}</span>
//                       ))}
//                     </div>

//                   </div>
//                 </div>
//               )
//             })}

//             {saved.length === 0 && (
//               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No locations saved yet.</div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// import { useState, useEffect, useRef } from 'react'
// import { getLocations, createLocation, deleteLocation, updateLocation, getZones } from '../../../api'
// import { ConfirmSaveModal } from '../components/MasterFormUI'

// const blank = {
//   zone: '', location: '',
//   lat: 51.505, lng: -0.09,
//   qrCode: '', rfid: '',
//   image: null, imagePreview: null,
// }

// const fallbackColors = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#4a90d9']

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
//         <input type="text" placeholder={placeholder} value={value}
//           onChange={(e) => onChange(e.target.value)}
//           style={{ flex: 1, minWidth: 0, padding: '10px 14px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }}
//         />
//         <button type="button" onClick={() => setOpen((o) => !o)}
//           style={{ width: '38px', height: '42px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 8px 8px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//         >+</button>
//       </div>
//       {open && (
//         <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
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
//         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '18px', color: '#5f6368', lineHeight: 1 }}>⋮</button>
//       {open && (
//         <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
//           {items.map(({ label, icon, color, action }) => (
//             <div key={label} onMouseDown={() => { action(); setOpen(false) }}
//               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
//               onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
//               onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
//             ><span>{icon}</span>{label}</div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// /* ── Leaflet map loaded via CDN ── */
// function LocationMap({ lat, lng, onChange }) {
//   const mapRef    = useRef(null)
//   const leafletRef = useRef(null)
//   const markerRef  = useRef(null)

//   useEffect(() => {
//     // Load Leaflet CSS
//     if (!document.getElementById('leaflet-css')) {
//       const link = document.createElement('link')
//       link.id   = 'leaflet-css'
//       link.rel  = 'stylesheet'
//       link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
//       document.head.appendChild(link)
//     }

//     // Load Leaflet JS then init map
//     const initMap = () => {
//       if (!mapRef.current || leafletRef.current) return
//       const L   = window.L
//       const map = L.map(mapRef.current, { zoomControl: false }).setView([lat, lng], 13)

//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors',
//         maxZoom: 19,
//       }).addTo(map)

//       L.control.zoom({ position: 'bottomright' }).addTo(map)

//       // Custom marker icon (no default image path issues)
//       const icon = L.divIcon({
//         className: '',
//         html: `<div style="width:20px;height:20px;background:#1a73e8;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
//         iconSize: [20, 20],
//         iconAnchor: [10, 10],
//       })

//       const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map)
//       markerRef.current = marker

//       marker.on('dragend', () => {
//         const { lat: newLat, lng: newLng } = marker.getLatLng()
//         onChange(newLat, newLng)
//       })

//       map.on('click', (e) => {
//         marker.setLatLng(e.latlng)
//         onChange(e.latlng.lat, e.latlng.lng)
//       })

//       leafletRef.current = map
//     }

//     if (window.L) {
//       initMap()
//     } else {
//       const script = document.createElement('script')
//       script.src   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
//       script.onload = initMap
//       document.head.appendChild(script)
//     }

//     return () => {
//       if (leafletRef.current) {
//         leafletRef.current.remove()
//         leafletRef.current = null
//       }
//     }
//   }, [])

//   // Update marker when lat/lng prop changes from outside
//   useEffect(() => {
//     if (markerRef.current && leafletRef.current) {
//       markerRef.current.setLatLng([lat, lng])
//       leafletRef.current.setView([lat, lng], leafletRef.current.getZoom())
//     }
//   }, [lat, lng])

//   return (
//     <div ref={mapRef} style={{ width: '100%', height: '200px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #dadce0', zIndex: 0 }} />
//   )
// }

// export default function LocationForm() {
//   const [form, setForm]           = useState(blank)
//   const [saved, setSaved]         = useState([])
//   const [busy, setBusy]           = useState(false)
//   const [sel, setSel]             = useState(null)
//   const [confirm, setConfirm]     = useState(false)
//   const [showSaved, setShowSaved] = useState(true)
//   const [selectMode, setSelectMode]   = useState(false)
//   const [selectedIds, setSelectedIds] = useState([])

//   const qrRef  = useRef(null)
//   const imgRef = useRef(null)

//   const [zoneOpts, setZoneOpts] = useState([])
//   const [locOpts,  setLocOpts]  = useState([])

//   // Fetch zones from their source (Others → Zone master data)
//   useEffect(() => {
//     getZones().then(zones => {
//       const names = zones.map(z => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
//       setZoneOpts(names)
//     }).catch(() => {})
//   }, [])

//   useEffect(() => {
//     if (typeof window === 'undefined') return
//     const handleZonesUpdated = () => {
//       getZones().then(zones => {
//         const names = zones.map(z => z.zoneNameLong || z.zoneNameShort).filter(Boolean).sort()
//         setZoneOpts(names)
//       }).catch(() => {})
//     }
//     window.addEventListener('zones-updated', handleZonesUpdated)
//     return () => window.removeEventListener('zones-updated', handleZonesUpdated)
//   }, [])

//   useEffect(() => {
//     getLocations().then((locs) => {
//       setSaved(locs)
//       const l = [...new Set(locs.map((l) => l.location).filter(Boolean))].sort()
//       if (l.length) setLocOpts(l)
//     }).catch(() => {})
//   }, [])

//   const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

//   const handleEdit  = (item) => { setForm({ ...blank, ...item, image: null, imagePreview: null }); setSel(item.id) }
//   const handleClone = (item) => { const { id, ...rest } = item; setForm({ ...blank, ...rest, image: null, imagePreview: null }); setSel(null) }
//   const handleCancelEdit = () => { setForm(blank); setSel(null) }
//   const handleSaveClick  = () => { if (!form.zone && !form.location) return; setConfirm(true) }

//   const handleConfirmed = async () => {
//     setBusy(true)
//     const { image, imagePreview, ...payload } = form
//     try {
//       if (sel) {
//         const updated = await updateLocation(sel, payload)
//         setSaved((p) => p.map((l) => (l.id === sel ? { ...l, ...updated } : l)))
//         setSel(null); setForm(blank)
//       } else {
//         const created = await createLocation(payload)
//         setSaved((p) => [created, ...p]); setForm(blank)
//       }
//     } catch {
//       if (sel) { setSaved((p) => p.map((l) => (l.id === sel ? { ...l, ...payload } : l))); setSel(null); setForm(blank) }
//     }
//     setBusy(false); setConfirm(false)
//   }

//   const handleDelete = async (id) => {
//     try { await deleteLocation(id) } catch {}
//     setSaved((p) => p.filter((l) => l.id !== id))
//     if (sel === id) { setForm(blank); setSel(null) }
//   }

//   const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
//   const toggleSelect    = (id) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
//   const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
//   const deleteSelected  = async () => {
//     for (const id of selectedIds) { try { await deleteLocation(id) } catch {} }
//     setSaved((p) => p.filter((l) => !selectedIds.includes(l.id)))
//     if (selectedIds.includes(sel)) { setForm(blank); setSel(null) }
//     setSelectMode(false); setSelectedIds([])
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (!file) return
//     const reader = new FileReader()
//     reader.onload = (ev) => set('imagePreview', ev.target.result)
//     reader.readAsDataURL(file)
//     set('image', file)
//   }

//   const summary = [
//     { label: 'Zone',     value: form.zone },
//     { label: 'Location', value: form.location },
//     { label: 'QR Code',  value: form.qrCode },
//     { label: 'RFID',     value: form.rfid },
//     { label: 'Lat',      value: form.lat },
//     { label: 'Lng',      value: form.lng },
//   ]

//   return (
//     <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
//       <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

//       {/* ═══ LEFT: FORM ═══ */}
//       <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
//         <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, lineHeight: '28px' }}>
//           {sel ? 'Edit Location' : 'Create Location'}
//         </h2>

//         <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

//           {/* Zone | Location */}
//           <div style={{ display: 'flex', gap: '14px' }}>
//             <FieldDropdown placeholder="Zone"     value={form.zone}     onChange={(v) => set('zone', v)}     options={zoneOpts} />
//             <FieldDropdown placeholder="Location" value={form.location} onChange={(v) => set('location', v)} options={locOpts} />
//           </div>

//           {/* Real OpenStreetMap */}
//           <LocationMap
//             lat={form.lat}
//             lng={form.lng}
//             onChange={(lat, lng) => setForm((p) => ({ ...p, lat, lng }))}
//           />

//           {/* QR code | or | RFID */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//             <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #dadce0', borderRadius: '8px', height: '42px', overflow: 'hidden' }}>
//               <input placeholder="QR code" value={form.qrCode} onChange={(e) => set('qrCode', e.target.value)}
//                 style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '13px', color: '#202124', background: 'transparent' }} />
//               <button onClick={() => qrRef.current?.click()}
//                 style={{ background: 'none', border: 'none', padding: '0 10px', cursor: 'pointer', fontSize: '18px', color: '#5f6368', flexShrink: 0 }}>📎</button>
//               <input ref={qrRef} type="file" style={{ display: 'none' }} />
//             </div>
//             <span style={{ fontSize: '13px', color: '#9aa0a6', flexShrink: 0 }}>or</span>
//             <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #dadce0', borderRadius: '8px', height: '42px', overflow: 'hidden' }}>
//               <input placeholder="RFID" value={form.rfid} onChange={(e) => set('rfid', e.target.value)}
//                 style={{ flex: 1, border: 'none', outline: 'none', padding: '0 12px', fontSize: '13px', color: '#202124', background: 'transparent' }} />
//               <button style={{ background: 'none', border: 'none', padding: '0 10px', cursor: 'pointer', fontSize: '18px', color: '#5f6368', flexShrink: 0 }}>📎</button>
//             </div>
//           </div>

//           {/* Add image */}
//           <div onClick={() => imgRef.current?.click()}
//             style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', background: '#fff', height: '42px', boxSizing: 'border-box' }}>
//             {form.imagePreview ? (
//               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                 <img src={form.imagePreview} alt="preview" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
//                 <span style={{ fontSize: '13px', color: '#202124' }}>Image selected</span>
//               </div>
//             ) : (
//               <span style={{ fontSize: '13px', color: '#9aa0a6' }}>Add image</span>
//             )}
//             <span style={{ fontSize: '18px', color: '#5f6368' }}>📎</span>
//             <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
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

//       {/* ═══ RIGHT: SAVED LOCATIONS ═══ */}
//       <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

//         {/* Header */}
//         <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
//           {selectMode ? (
//             <>
//               <div
//                 onClick={() => setSelectedIds(selectedIds.length === saved.length ? [] : saved.map((l) => l.id))}
//                 style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
//               >
//                 {selectedIds.length === saved.length
//                   ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
//                   : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
//               </div>
//               <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
//                 {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Location'}
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
//               {showSaved && <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0, lineHeight: '28px' }}>Saved Location</h2>}
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
//             {saved.map((l, idx) => {
//               const isChecked = selectedIds.includes(l.id)
//               const color     = fallbackColors[idx % fallbackColors.length]
//               return (
//                 <div key={l.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>

//                   {selectMode && (
//                     <div onClick={() => toggleSelect(l.id)}
//                       style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
//                       {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
//                     </div>
//                   )}

//                   <div style={{ flex: 1, minWidth: 0, border: `1px solid ${selectMode && isChecked ? '#1a73e8' : '#e0e0e0'}`, borderRadius: '10px', padding: '10px 12px', background: selectMode && isChecked ? '#f0f4ff' : '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>

//                     {/* Top: icon + name + company + menu */}
//                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '6px' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
//                         <span style={{ fontSize: '20px', flexShrink: 0 }}>🏢</span>
//                         <div style={{ minWidth: 0 }}>
//                           <div style={{ fontSize: '13px', fontWeight: 600, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                             {l.location || 'OrbidX(Obx)'}
//                           </div>
//                           <div style={{ fontSize: '11px', color: '#5f6368' }}>{l.company || 'Company code'}</div>
//                         </div>
//                       </div>
//                       <CardMenu
//                         onSelect={() => enterSelectMode(l.id)}
//                         onClone={() => handleClone(l)}
//                         onEdit={() => handleEdit(l)}
//                         onDelete={() => handleDelete(l.id)}
//                       />
//                     </div>

//                     {/* Pills */}
//                     <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
//                       {[l.zone || 'Zone', 'QR/Barcode', l.image ? 'Attached' : 'Attached', l.location || 'Location'].map((tag, i) => (
//                         <span key={i} style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', color: '#333' }}>{tag}</span>
//                       ))}
//                     </div>

//                   </div>
//                 </div>
//               )
//             })}

//             {saved.length === 0 && (
//               <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No locations saved yet.</div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

import { useState, useEffect, useRef } from 'react'
import { getLocations, filterLocations, createLocation, deleteLocation, updateLocation, getZones } from '../../../api'
import { ConfirmSaveModal } from '../components/MasterFormUI'

const blank = {
  zone: '', location: '',
  lat: 51.505, lng: -0.09,
  qr: '', rfid: '',
  image: null, imagePreview: null,
}

/* ── QR Code Generator using qrserver CDN ── */
function QRPreview({ value }) {
  if (!value) return null
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(value)}`
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px', border: '1px solid #dadce0', borderRadius: '8px', background: '#fafafa' }}>
      <img src={url} alt="QR Code" style={{ width: '100px', height: '100px', borderRadius: '4px' }} />
      <span style={{ fontSize: '11px', color: '#5f6368' }}>{value}</span>
    </div>
  )
}


/* ── Zone dropdown — shows name, sends id to API ── */
function ZoneDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const selected = options.find(o => o.id === value)
  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex' }}>
        <input type="text" placeholder="Zone" readOnly value={selected ? selected.name : ''}
          onFocus={() => setOpen(true)}
          style={{ flex: 1, minWidth: 0, padding: '10px 14px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff', cursor: 'pointer' }}
        />
        <button type="button" onClick={() => setOpen((o) => !o)}
          style={{ width: '38px', height: '42px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 8px 8px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >+</button>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
          {options.length === 0
            ? <div style={{ padding: '10px 14px', fontSize: '13px', color: '#9aa0a6' }}>No zones</div>
            : options.map((opt) => (
              <div key={opt.id} onMouseDown={() => { onChange(opt.id); setOpen(false) }}
                style={{ padding: '10px 14px', fontSize: '13px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', background: opt.id === value ? '#f0f4ff' : '#fff' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = opt.id === value ? '#f0f4ff' : '#fff'}
              >{opt.name}</div>
            ))}
        </div>
      )}
    </div>
  )
}

const fallbackColors = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#4a90d9']

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
        <input type="text" placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, minWidth: 0, padding: '10px 14px', border: '1px solid #dadce0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }}
        />
        <button type="button" onClick={() => setOpen((o) => !o)}
          style={{ width: '38px', height: '42px', flexShrink: 0, background: '#1a73e8', border: '1px solid #1a73e8', borderRadius: '0 8px 8px 0', color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >+</button>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
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

/* ── Location input with geocoding (no + button) ── */
function LocationInput({ value, onChange, onGeocode, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const debounceRef = useRef(null)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleChange = (e) => {
    const v = e.target.value
    onChange(v)
    setOpen(true)
    // Debounce geocoding: wait 600ms after user stops typing
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (v.trim().length > 3) {
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(v)}&limit=1`,
            { headers: { 'Accept-Language': 'en' } }
          )
          const data = await res.json()
          if (data && data[0]) {
            onGeocode(parseFloat(data[0].lat), parseFloat(data[0].lon))
          }
        } catch {}
      }, 600)
    }
  }

  const filteredOpts = options.filter(o => o.toLowerCase().includes(value.toLowerCase()))

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        style={{ width: '100%', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '13px', color: '#202124', outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff' }}
      />
      {open && filteredOpts.length > 0 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
          {filteredOpts.map((opt) => (
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
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '18px', color: '#5f6368', lineHeight: 1 }}>⋮</button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
          {items.map(({ label, icon, color, action }) => (
            <div key={label} onMouseDown={() => { action(); setOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            ><span>{icon}</span>{label}</div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Leaflet map loaded via CDN ── */
function LocationMap({ lat, lng, onChange }) {
  const mapRef    = useRef(null)
  const leafletRef = useRef(null)
  const markerRef  = useRef(null)

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id   = 'leaflet-css'
      link.rel  = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Load Leaflet JS then init map
    const initMap = () => {
      if (!mapRef.current || leafletRef.current) return
      const L   = window.L
      const map = L.map(mapRef.current, { zoomControl: false }).setView([lat, lng], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // Custom marker icon (no default image path issues)
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:20px;height:20px;background:#1a73e8;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map)
      markerRef.current = marker

      marker.on('dragend', () => {
        const { lat: newLat, lng: newLng } = marker.getLatLng()
        onChange(newLat, newLng)
      })

      map.on('click', (e) => {
        marker.setLatLng(e.latlng)
        onChange(e.latlng.lat, e.latlng.lng)
      })

      leafletRef.current = map
    }

    if (window.L) {
      initMap()
    } else {
      const script = document.createElement('script')
      script.src   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      document.head.appendChild(script)
    }

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove()
        leafletRef.current = null
      }
    }
  }, [])

  // Update marker when lat/lng prop changes from outside
  useEffect(() => {
    if (markerRef.current && leafletRef.current) {
      markerRef.current.setLatLng([lat, lng])
      leafletRef.current.setView([lat, lng], leafletRef.current.getZoom())
    }
  }, [lat, lng])

  return (
    <div ref={mapRef} style={{ width: '100%', height: '200px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #dadce0', zIndex: 0 }} />
  )
}

/* ══════════════════════════════════════════════════════
   SAVED PANEL — same pattern as UserForm
══════════════════════════════════════════════════════ */
const LOC_COLORS = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#4a90d9']

function SavedPanel({
  title, items, renderCard,
  selectMode, selectedIds,
  onEnterSelect, onToggle, onDeleteSelected, onCancelSelect,
  onShowToggle, show,
  getItemLabel, extraHeader, statusBanner,
}) {
  const [search, setSearch] = useState('')
  const [ddOpen, setDdOpen] = useState(false)
  const [ddSearch, setDdSearch] = useState('')
  const ddRef = useRef(null)

  useEffect(() => {
    const h = e => { if (ddRef.current && !ddRef.current.contains(e.target)) { setDdOpen(false); setDdSearch('') } }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const getLabel = item => getItemLabel ? getItemLabel(item) : (item.name || String(item.id))
  const filteredItems = items.filter(item => getLabel(item).toLowerCase().includes(search.toLowerCase()))
  const ddFiltered    = items.filter(item => getLabel(item).toLowerCase().includes(ddSearch.toLowerCase()))

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
        {selectMode ? (
          <>
            <div onClick={() => onToggle(selectedIds.length === items.length ? [] : items.map(i => i.id))}
              style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === items.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === items.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {selectedIds.length === items.length
                ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
                : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
            </div>
            <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
              {selectedIds.length > 0 ? `${selectedIds.length} selected` : title}
            </h2>
            <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
              <button onClick={onDeleteSelected} disabled={selectedIds.length === 0}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: selectedIds.length > 0 ? '#fce8e6' : '#f5f5f5', border: 'none', color: selectedIds.length > 0 ? '#d93025' : '#bbb', fontSize: '12px', fontWeight: 600, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', padding: '5px 10px', borderRadius: '4px' }}>
                🗑 Delete
              </button>
              <button onClick={onCancelSelect}
                style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: '12px', fontWeight: 500, cursor: 'pointer', padding: '5px 8px', borderRadius: '4px' }}>
                ✕ Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {show && (
              <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0 }}>
                {title}
                <span style={{ fontSize: '12px', fontWeight: 400, color: '#9aa0a6', marginLeft: '6px' }}>({items.length})</span>
              </h2>
            )}
            <button onClick={onShowToggle} style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
              {show ? '⊏' : '⊐'}
            </button>
            {extraHeader}
          </>
        )}
      </div>

      {statusBanner}

      {/* Quick-select + search */}
      {show && !selectMode && (
        <div style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div ref={ddRef} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #dadce0', borderRadius: '8px', height: '36px', background: '#fff', overflow: 'hidden' }}>
              <span style={{ padding: '0 8px', fontSize: '13px', color: '#9aa0a6', flexShrink: 0 }}>▾</span>
              <input value={ddOpen ? ddSearch : ''} placeholder={`Quick-select ${title.toLowerCase()}…`}
                onFocus={() => { setDdOpen(true); setDdSearch('') }}
                onChange={e => { setDdSearch(e.target.value); setDdOpen(true) }}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '12px', color: '#202124', background: 'transparent', height: '100%', padding: '0 4px' }} />
              {ddOpen && (
                <button onMouseDown={() => { setDdOpen(false); setDdSearch('') }}
                  style={{ padding: '0 8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#9aa0a6' }}>✕</button>
              )}
            </div>
            {ddOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 9999, maxHeight: '180px', overflowY: 'auto' }}>
                {ddFiltered.length === 0
                  ? <div style={{ padding: '10px 14px', fontSize: '12px', color: '#9aa0a6' }}>No matches</div>
                  : ddFiltered.map((item, idx) => (
                    <div key={item.id} onMouseDown={() => { onEnterSelect(item.id); setDdOpen(false); setDdSearch('') }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '12px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: LOC_COLORS[idx % LOC_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', flexShrink: 0 }}>
                        {getLabel(item).charAt(0).toUpperCase()}
                      </div>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getLabel(item)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#9aa0a6' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter list…"
              style={{ width: '100%', padding: '6px 28px 6px 26px', border: '1px solid #e8eaed', borderRadius: '6px', fontSize: '12px', color: '#202124', outline: 'none', boxSizing: 'border-box', background: '#fafbfc' }} />
            {search && (
              <span onMouseDown={() => setSearch('')}
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#9aa0a6', cursor: 'pointer' }}>✕</span>
            )}
          </div>
        </div>
      )}

      {/* Cards */}
      {show && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>
          {filteredItems.length === 0 && (
            <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>
              {items.length === 0 ? 'No locations saved yet.' : 'No matches.'}
            </div>
          )}
          {filteredItems.map((item, idx) => {
            const isChecked = selectedIds.includes(item.id)
            return (
              <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                {selectMode && (
                  <div onClick={() => onToggle(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id])}
                    style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0, border: `1px solid ${selectMode && isChecked ? '#1a73e8' : '#e0e0e0'}`, borderRadius: '10px', padding: '10px 12px', background: selectMode && isChecked ? '#f0f4ff' : '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>
                  {renderCard(item, idx)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function LocationForm() {
  const [form, setForm]           = useState(blank)
  const [saved, setSaved]         = useState([])
  const [busy, setBusy]           = useState(false)
  const [sel, setSel]             = useState(null)
  const [confirm, setConfirm]     = useState(false)
  const [show, setShow]           = useState(true)
  const [loadingLocs, setLoadingLocs] = useState(false)
  const [selectMode, setSelectMode]   = useState(false)
  const [selectedIds, setSelectedIds] = useState([])

  const imgRef = useRef(null)

  const [zoneOpts, setZoneOpts] = useState([])
  const [locOpts,  setLocOpts]  = useState([])
  const [filterZone, setFilterZone] = useState('')   // right-panel zone filter dropdown

  const loadZones = () => {
    getZones().then(zones => {
      const opts = zones
        .filter(z => z.id != null && (z.zoneNameLong || z.zoneNameShort || z.zoneName))
        .map(z => ({ id: String(z.id), name: z.zoneNameLong || z.zoneNameShort || z.zoneName }))
        .sort((a, b) => a.name.localeCompare(b.name))
      setZoneOpts(opts)
    }).catch(() => {})
  }

  /* ── Load all locations from API ── */
  const loadLocations = async () => {
    setLoadingLocs(true)
    try {
      const locs = await getLocations()
      console.log('[LocationForm] loaded locations:', locs)
      setSaved(locs)
      const names = [...new Set(locs.map(l => l.name).filter(Boolean))].sort()
      if (names.length) setLocOpts(names)
    } catch {}
    finally { setLoadingLocs(false) }
  }

  /* ── Filter right-panel locations when zone filter changes ── */
  useEffect(() => {
    if (!filterZone) { loadLocations(); return }
    setLoadingLocs(true)
    filterLocations({ zone_id: filterZone })
      .then(locs => { setSaved(locs) })
      .catch(() => {})
      .finally(() => setLoadingLocs(false))
  }, [filterZone])

  useEffect(() => { loadZones(); loadLocations() }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('zones-updated', loadZones)
    return () => window.removeEventListener('zones-updated', loadZones)
  }, [])

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handleEdit  = (item) => {
    setForm({ ...blank, location: item.name || '', zone: item.zone || '', lat: Number(item.lat) || blank.lat, lng: Number(item.lon || item.lng) || blank.lng, qr: item.qr || '', rfid: item.rfid || '', image: null, imagePreview: null })
    setSel(item.id)
  }
  const handleClone = (item) => {
    setForm({ ...blank, location: item.name || '', zone: item.zone || '', lat: Number(item.lat) || blank.lat, lng: Number(item.lon || item.lng) || blank.lng, qr: item.qr || '', rfid: item.rfid || '', image: null, imagePreview: null })
    setSel(null)
  }
  const handleCancelEdit = () => { setForm(blank); setSel(null) }
  const handleSaveClick  = () => { if (!form.zone && !form.location) return; setConfirm(true) }

  const handleConfirmed = async () => {
    setBusy(true)
    const payload = {
      name: form.location,
      zone: Number(form.zone),
      lat:  String(form.lat),
      lon:  String(form.lng),
      qr:   form.qr,
      rfid: form.rfid,
      image: form.imagePreview ? [form.imagePreview] : [],
    }
    try {
      if (sel) {
        await updateLocation(sel, payload)
        setSaved(p => p.map(l => l.id === sel ? { ...l, ...payload, id: sel } : l))
        setSel(null); setForm(blank)
      } else {
        await createLocation(payload)
        // Server returns result:false even on success — reload from API to get the real record
        await loadLocations()
        setForm(blank)
      }
    } catch {
      // Even if API throws, optimistically add/update so UI reflects the action
      if (sel) {
        setSaved(p => p.map(l => l.id === sel ? { ...l, ...payload, id: sel } : l))
        setSel(null); setForm(blank)
      } else {
        const tempId = Date.now()
        setSaved(p => [{ ...payload, id: tempId }, ...p])
        setForm(blank)
      }
    }
    setBusy(false); setConfirm(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this location?')) return
    try { await deleteLocation(id) } catch {}
    setSaved(p => p.filter(l => l.id !== id))
    if (sel === id) { setForm(blank); setSel(null) }
  }

  const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
  const toggleSelect    = fn  => setSelectedIds(typeof fn === 'function' ? fn : fn)
  const cancelSelect    = ()  => { setSelectMode(false); setSelectedIds([]) }
  const deleteSelected  = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} selected location(s)?`)) return
    for (const id of selectedIds) { try { await deleteLocation(id) } catch {} }
    setSaved(p => p.filter(l => !selectedIds.includes(l.id)))
    if (selectedIds.includes(sel)) { setForm(blank); setSel(null) }
    setSelectMode(false); setSelectedIds([])
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => set('imagePreview', ev.target.result)
    reader.readAsDataURL(file)
    set('image', file)
  }

  const selectedZoneName = zoneOpts.find(o => o.id === form.zone)?.name || form.zone
  const summary = [
    { label: 'Zone',     value: selectedZoneName },
    { label: 'Location', value: form.location },
    { label: 'QR Code',  value: form.qr },
    { label: 'RFID',     value: form.rfid },
    { label: 'Lat',      value: String(form.lat) },
    { label: 'Lng',      value: String(form.lng) },
  ]

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
      <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

      {/* ═══ LEFT: FORM ═══ */}
      <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, lineHeight: '28px' }}>
          {sel ? 'Edit Location' : 'Create Location'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Zone | Location */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <ZoneDropdown value={form.zone} onChange={(id) => set('zone', id)} options={zoneOpts} />
            <LocationInput placeholder="Location" value={form.location} onChange={(v) => set('location', v)} options={locOpts}
              onGeocode={(lat, lng) => setForm((p) => ({ ...p, lat, lng }))} />
          </div>

          {/* Real OpenStreetMap */}
          <LocationMap
            lat={form.lat}
            lng={form.lng}
            onChange={(lat, lng) => setForm((p) => ({ ...p, lat, lng }))}
          />

          {/* QR code | or | RFID */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              placeholder="QR code"
              value={form.qr}
              onChange={(e) => set('qr', e.target.value)}
              style={{ flex: 1, border: '1px solid #dadce0', borderRadius: '8px', height: '42px', padding: '0 12px', fontSize: '13px', color: '#202124', outline: 'none', boxSizing: 'border-box' }}
            />
            <span style={{ fontSize: '13px', color: '#9aa0a6', flexShrink: 0 }}>or</span>
            <input
              placeholder="RFID"
              value={form.rfid}
              onChange={(e) => set('rfid', e.target.value)}
              style={{ flex: 1, border: '1px solid #dadce0', borderRadius: '8px', height: '42px', padding: '0 12px', fontSize: '13px', color: '#202124', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Add image */}
          <div onClick={() => imgRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', background: '#fff', height: '42px', boxSizing: 'border-box' }}>
            {form.imagePreview ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={form.imagePreview} alt="preview" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
                <span style={{ fontSize: '13px', color: '#202124' }}>Image selected</span>
              </div>
            ) : (
              <span style={{ fontSize: '13px', color: '#9aa0a6' }}>Add image</span>
            )}
            <span style={{ fontSize: '18px', color: '#5f6368' }}>📎</span>
            <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
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

      {/* ═══ RIGHT: SAVED PANEL ═══ */}
      <SavedPanel
        title="Locations"
        items={saved}
        show={show}
        onShowToggle={() => setShow(s => !s)}
        selectMode={selectMode}
        selectedIds={selectedIds}
        onEnterSelect={enterSelectMode}
        onToggle={toggleSelect}
        onDeleteSelected={deleteSelected}
        onCancelSelect={cancelSelect}
        getItemLabel={item => item.name || String(item.id)}
        extraHeader={
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <select
              value={filterZone}
              onChange={e => setFilterZone(e.target.value)}
              style={{ fontSize: '12px', border: '1px solid #dadce0', borderRadius: '4px', padding: '2px 4px', color: '#202124', background: '#fff', cursor: 'pointer', maxWidth: '120px' }}
              title="Filter by zone"
            >
              <option value="">All Zones</option>
              {zoneOpts.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
            <button onClick={() => { setFilterZone(''); loadLocations() }} disabled={loadingLocs} title="Refresh locations"
              style={{ background: 'none', border: '1px solid #dadce0', borderRadius: '4px', cursor: loadingLocs ? 'wait' : 'pointer', fontSize: '13px', padding: '2px 6px', color: '#5f6368', flexShrink: 0 }}>
              {loadingLocs ? '⏳' : '↻'}
            </button>
          </div>
        }
        statusBanner={
          loadingLocs ? (
            <div style={{ padding: '10px 14px', fontSize: '12px', color: '#1a73e8', background: '#e8f0fe', borderBottom: '1px solid #c6dafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⏳</span> Loading locations…
            </div>
          ) : null
        }
        renderCard={(l, idx) => {
          const color = LOC_COLORS[idx % LOC_COLORS.length]
          const zoneName = zoneOpts.find(o => o.id === String(l.zone))?.name || (l.zone ? `Zone ${l.zone}` : '')
          return (
            <>
              {/* Top: icon + name + menu */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>
                    🏢
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.name || l.location_name || l.locationName || l.label || '(no name)'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#5f6368' }}>{zoneName}</div>
                  </div>
                </div>
                <CardMenu
                  onSelect={() => enterSelectMode(l.id)}
                  onClone={() => handleClone(l)}
                  onEdit={() => handleEdit(l)}
                  onDelete={() => handleDelete(l.id)}
                />
              </div>

              {/* Pills */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {[
                  zoneName && { label: zoneName, bg: '#e8f0fe', border: '#d2e3fc', color: '#1a73e8' },
                  l.qr     && { label: 'QR: ' + l.qr,   bg: '#fef7e0', border: '#fde293', color: '#856400' },
                  l.rfid   && { label: 'RFID: ' + l.rfid, bg: '#e6f4ea', border: '#b7dfbf', color: '#1e6e3e' },
                  (l.lat || l.lon) && { label: `${Number(l.lat).toFixed(4)}, ${Number(l.lon || l.lng).toFixed(4)}`, bg: '#f3e8fd', border: '#e0c3fc', color: '#6a1a8e' },
                ].filter(Boolean).map(t => (
                  <span key={t.label} style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '2px 8px', fontSize: '11px', color: t.color, whiteSpace: 'nowrap', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.label}
                  </span>
                ))}
              </div>
            </>
          )
        }}
      />
    </div>
  )
}