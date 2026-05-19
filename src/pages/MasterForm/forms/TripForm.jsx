
import { useState, useEffect, useRef } from 'react'
import {
  getTrips, createTrip, deleteTrip, updateTrip,
  getZoneFilter, filterPatrolTypes, filterLocations, filterQuestions, getQuestions,
  notifyTripsUpdated,
} from '../../../api'
import { ConfirmSaveModal } from '../components/MasterFormUI'
import PagePreviousIcon from '@rsuite/icons/PagePrevious'
import PageNextIcon from '@rsuite/icons/PageNext'

/* ─────────────────────────────────────────────
   BLANK FORM  (matches API schema exactly)
   patrol_type : number[]
   zone        : number[]
   patrols     : [{ loc_id: number|'', qus_ids: string[] }]
───────────────────────────────────────────── */
const blank = {
  tripName: '',
  patrolType: [],          // patrol_type: number[]
  zone: [],          // zone: number[]
  patrols: [            // location: [{loc_id, qus_id:[]}]
    { loc_id: '', qus_ids: [] },
    { loc_id: '', qus_ids: [] },
  ],
}

const fallbackColors = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#1ae8d4', '#e81a8e', '#4a90d9']

/* ══════════════════════════════════════════════════════
   MultiSelectDropdown
   — checkbox list + selected chips shown below trigger
   Props:
     placeholder : string
     selected    : any[]          (array of selected values)
     onChange    : (newArr) => void
     options     : { value, label }[]
══════════════════════════════════════════════════════ */
function MultiSelectDropdown({ placeholder, selected, onChange, options }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const toggle = (val) => {
    const already = selected.includes(val)
    onChange(already ? selected.filter((v) => v !== val) : [...selected, val])
  }

  const removeChip = (val) => onChange(selected.filter((v) => v !== val))

  const labelOf = (val) => options.find((o) => o.value === val)?.label ?? String(val)

  const triggerLabel = selected.length === 0
    ? placeholder
    : selected.length === 1
      ? labelOf(selected[0])
      : `${selected.length} selected`

  return (
    <div ref={ref} style={{ flex: 1, minWidth: 0 }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 12px', height: '42px', border: '1px solid #dadce0', borderRadius: '8px',
          background: '#fff', fontSize: '13px',
          color: selected.length === 0 ? '#9aa0a6' : '#202124',
          cursor: 'pointer', boxSizing: 'border-box', outline: 'none',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {triggerLabel}
        </span>
        <span style={{ fontSize: '10px', marginLeft: '6px', color: '#5f6368', flexShrink: 0 }}>
          {open ? '▲' : '▼'}
        </span>
      </button>

      {/* Dropdown list */}
      {open && (
        <div style={{
          position: 'absolute', zIndex: 9999, background: '#fff',
          border: '1px solid #dadce0', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          maxHeight: '200px', overflowY: 'auto', minWidth: '220px',
          marginTop: '2px',
        }}>
          {options.length === 0
            ? <div style={{ padding: '10px 14px', fontSize: '13px', color: '#9aa0a6' }}>No options</div>
            : options.map((opt) => {
              const checked = selected.includes(opt.value)
              return (
                <div
                  key={opt.value}
                  onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); toggle(opt.value) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 14px', fontSize: '13px', cursor: 'pointer',
                    borderBottom: '1px solid #f5f5f5',
                    background: checked ? '#f0f4ff' : '#fff',
                  }}
                  onMouseEnter={(e) => { if (!checked) e.currentTarget.style.background = '#f9f9f9' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = checked ? '#f0f4ff' : '#fff' }}
                >
                  {/* Custom checkbox */}
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0,
                    border: checked ? '2px solid #1a73e8' : '2px solid #ccc',
                    background: checked ? '#1a73e8' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {checked && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700, lineHeight: 1 }}>✓</span>}
                  </div>
                  <span style={{ color: '#202124' }}>{opt.label}</span>
                </div>
              )
            })}
        </div>
      )}

      {/* Selected chips */}
      {selected.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
          {selected.map((val) => (
            <span
              key={val}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                background: '#e8f0fe', border: '1px solid #c5d8fc', borderRadius: '12px',
                padding: '2px 8px', fontSize: '11px', color: '#1a73e8',
              }}
            >
              {labelOf(val)}
              <span
                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); removeChip(val) }}
                style={{ cursor: 'pointer', fontWeight: 700, fontSize: '12px', lineHeight: 1, color: '#1a73e8' }}
              >×</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   SingleSelectDropdown
   — plain dropdown (single value), used for Location
   Props:
     placeholder : string
     value       : any           (selected value or '')
     onChange    : (val) => void
     options     : { value, label }[]
══════════════════════════════════════════════════════ */
function SingleSelectDropdown({ placeholder, value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const labelOf = (val) => options.find((o) => o.value === val)?.label ?? String(val)

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 12px', height: '42px', border: '1px solid #dadce0', borderRadius: '8px',
          background: '#fff', fontSize: '13px',
          color: !value ? '#9aa0a6' : '#202124',
          cursor: 'pointer', boxSizing: 'border-box', outline: 'none',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value ? labelOf(value) : placeholder}
        </span>
        <span style={{ fontSize: '10px', marginLeft: '6px', color: '#5f6368', flexShrink: 0 }}>
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0,
          zIndex: 9999, background: '#fff',
          border: '1px solid #dadce0', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          maxHeight: '200px', overflowY: 'auto',
        }}>
          {options.length === 0
            ? <div style={{ padding: '10px 14px', fontSize: '13px', color: '#9aa0a6' }}>No options</div>
            : options.map((opt) => (
              <div
                key={opt.value}
                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onChange(opt.value); setOpen(false) }}
                style={{
                  padding: '9px 14px', fontSize: '13px', color: '#202124',
                  cursor: 'pointer', borderBottom: '1px solid #f5f5f5',
                  background: opt.value === value ? '#f0f4ff' : '#fff',
                }}
                onMouseEnter={(e) => { if (opt.value !== value) e.currentTarget.style.background = '#f9f9f9' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = opt.value === value ? '#f0f4ff' : '#fff' }}
              >
                {opt.label}
              </div>
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
    { label: 'Clone', icon: '⧉', color: '#202124', action: onClone },
    { label: 'Edit', icon: '✎', color: '#202124', action: onEdit },
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

//ellam ok but ipo epti vanthuchu?

/* ══════════════════════════════════════════════════════
   SAVED PANEL  (shared pattern)
  ══════════════════════════════════════════════════════ */
function SavedPanel({
  title, items, renderCard,
  selectMode, selectedIds,
  onEnterSelect, onToggle, onDeleteSelected, onCancelSelect,
  onShowToggle, show,
  getItemLabel, extraHeader, statusBanner,
  onSearch, searchLoading,
}) {
  const [search, setSearch] = useState('')
  const [ddOpen, setDdOpen] = useState(false)
  const [ddSearch, setDdSearch] = useState('')
  const ddRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    const h = e => { if (ddRef.current && !ddRef.current.contains(e.target)) { setDdOpen(false); setDdSearch('') } }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleSearchChange = val => {
    setSearch(val)
    if (!onSearch) return
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onSearch(val.trim() || 'all'), 400)
  }
  const handleSearchClear = () => { setSearch(''); if (onSearch) onSearch('all') }

  const getLabel = item => getItemLabel ? getItemLabel(item) : (item.name || String(item.id))
  const filteredItems = onSearch ? items : items.filter(item => getLabel(item).toLowerCase().includes(search.toLowerCase()))
  const ddFiltered = items.filter(item => getLabel(item).toLowerCase().includes(ddSearch.toLowerCase()))

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
        {selectMode ? (
          <>
            <div
              onClick={() => onToggle(selectedIds.length === items.length ? [] : items.map(i => i.id))}
              style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === items.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === items.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              {selectedIds.length === items.length
                ? <span style={{ color: '#c2a2a2', fontSize: '11px', fontWeight: 700 }}>✓</span>
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
            <button onClick={onShowToggle} style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '16px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
              {show ? <PagePreviousIcon /> : <PageNextIcon />}
            </button>
            {extraHeader}
          </>
        )}
      </div>

      {/* ── Status banner ── */}
      {statusBanner}

      {/* ── Quick-select dropdown + search bar ── */}
      {show && !selectMode && (
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #e8eaed', flexShrink: 0, display: 'flex', gap: '6px', alignItems: 'center' }}>
          {/* Quick-select dropdown */}
          <div ref={ddRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setDdOpen(o => !o)}
              style={{ height: '32px', padding: '0 10px', border: '1px solid #dadce0', borderRadius: '6px', background: '#f8f9fa', fontSize: '12px', color: '#5f6368', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              ☰ <span style={{ fontSize: '10px' }}>{ddOpen ? '▲' : '▼'}</span>
            </button>
            {ddOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999, width: '200px', overflow: 'hidden' }}>
                <div style={{ padding: '6px 8px', borderBottom: '1px solid #f0f0f0' }}>
                  <input
                    autoFocus
                    value={ddSearch}
                    onChange={e => setDdSearch(e.target.value)}
                    placeholder="Search..."
                    style={{ width: '100%', padding: '5px 8px', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
                  {ddFiltered.length === 0
                    ? <div style={{ padding: '8px 12px', fontSize: '12px', color: '#9aa0a6' }}>No matches</div>
                    : ddFiltered.map(item => (
                      <div
                        key={item.id}
                        onMouseDown={() => { setDdOpen(false); setDdSearch('') }}
                        style={{ padding: '8px 12px', fontSize: '12px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                      >
                        {getLabel(item)}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Search input */}
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '9px', fontSize: '13px', color: '#9aa0a6', pointerEvents: 'none' }}>🔍</span>
            <input
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search trips…"
              style={{ width: '100%', height: '32px', paddingLeft: '30px', paddingRight: search ? '28px' : '10px', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '12px', outline: 'none', boxSizing: 'border-box', color: '#202124' }}
            />
            {search && (
              <span
                onClick={handleSearchClear}
                style={{ position: 'absolute', right: '8px', fontSize: '14px', color: '#9aa0a6', cursor: 'pointer', lineHeight: 1 }}
              >✕</span>
            )}
            {searchLoading && (
              <span style={{ position: 'absolute', right: '8px', fontSize: '11px', color: '#1a73e8' }}>…</span>
            )}
          </div>
        </div>
      )}

      {/* ── Cards list ── */}
      {show && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>
          {filteredItems.length === 0 && (
            <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>
              {items.length === 0 ? 'No trips saved yet.' : 'No matches.'}
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

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function TripForm() {
  const [form, setForm] = useState(blank)
  const [saved, setSaved] = useState([])
  const [busy, setBusy] = useState(false)
  const [sel, setSel] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const [showSaved, setShowSaved] = useState(true)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [loadingTrips, setLoadingTrips] = useState(false)
  const [searching, setSearching] = useState(false)

  // Options — stored as { value, label } for dropdowns
  const [zoneOpts, setZoneOpts] = useState([]) // { value: number, label: string }
  const [patrolTypeOpts, setPatrolTypeOpts] = useState([]) // { value: number, label: string }
  const [locOpts, setLocOpts] = useState([]) // { value: number, label: string }
  const [questionOpts, setQuestionOpts] = useState([]) // { value: string (qus_id), label: string }

  /* ── Load trips ── */
  const loadTrips = async () => {
    setLoadingTrips(true)
    try { setSaved(await getTrips()) } catch { }
    finally { setLoadingTrips(false) }
  }
  useEffect(() => { loadTrips() }, [])

  /* ── Load option lists ── */
  useEffect(() => {
    // Zones — { value, label }
    getZoneFilter().then((records) => {
      const opts = records
        .map(r => ({ value: Number(r.id ?? r.value), label: String(r.label || r.name || '') }))
        .filter(o => o.label)
        .sort((a, b) => a.label.localeCompare(b.label))
      if (opts.length) setZoneOpts(opts)
    }).catch(() => { })

    // Patrol Types — { value, label }
    filterPatrolTypes().then((types) => {
      const opts = types
        .map(t => ({ value: Number(t.id), label: String(t.patrolName || '') }))
        .filter(o => o.label)
        .sort((a, b) => a.label.localeCompare(b.label))
      if (opts.length) setPatrolTypeOpts(opts)
    }).catch(() => { })

    // Locations — { value, label }
    filterLocations().then((locs) => {
      const opts = locs
        .map(l => ({ value: Number(l.id), label: String(l.name || '') }))
        .filter(o => o.label)
        .sort((a, b) => a.label.localeCompare(b.label))
      if (opts.length) setLocOpts(opts)
    }).catch(() => { })

    // Questions — use qus_id as value (that's what API schema expects in qus_id array)
    filterQuestions().then((questions) => {
      const opts = questions
        .map(q => ({ value: String(q.qus_id ?? q.id), label: String(q.name || '') }))
        .filter(o => o.label && o.value)
        .sort((a, b) => a.label.localeCompare(b.label))
      if (opts.length) {
        setQuestionOpts(opts)
      } else {
        getQuestions?.().then((qs) => {
          const fallback = qs
            .map(q => ({ value: String(q.qus_id ?? q.id), label: String(q.name || '') }))
            .filter(o => o.label && o.value)
            .sort((a, b) => a.label.localeCompare(b.label))
          if (fallback.length) setQuestionOpts(fallback)
        }).catch(() => { })
      }
    }).catch(() => {
      getQuestions?.().then((qs) => {
        const fallback = qs
          .map(q => ({ value: String(q.qus_id ?? q.id), label: String(q.name || '') }))
          .filter(o => o.label && o.value)
          .sort((a, b) => a.label.localeCompare(b.label))
        if (fallback.length) setQuestionOpts(fallback)
      }).catch(() => { })
    })
  }, [])

  /* ── Listen for master-form updates ── */
  useEffect(() => {
    if (typeof window === 'undefined') return
    const refreshZones = () => getZoneFilter().then(records => {
      const opts = records.map(r => ({ value: Number(r.id ?? r.value), label: String(r.label || r.name || '') })).filter(o => o.label)
      if (opts.length) setZoneOpts(opts)
    }).catch(() => { })
    const refreshPatrolTypes = () => filterPatrolTypes().then(types => {
      const opts = types.map(t => ({ value: Number(t.id), label: String(t.patrolName || '') })).filter(o => o.label)
      if (opts.length) setPatrolTypeOpts(opts)
    }).catch(() => { })
    const refreshLocations = () => filterLocations().then(locs => {
      const opts = locs.map(l => ({ value: Number(l.id), label: String(l.name || '') })).filter(o => o.label)
      if (opts.length) setLocOpts(opts)
    }).catch(() => { })
    window.addEventListener('zones-updated', refreshZones)
    window.addEventListener('patroltypes-updated', refreshPatrolTypes)
    window.addEventListener('locations-updated', refreshLocations)
    return () => {
      window.removeEventListener('zones-updated', refreshZones)
      window.removeEventListener('patroltypes-updated', refreshPatrolTypes)
      window.removeEventListener('locations-updated', refreshLocations)
    }
  }, [])

  /* ── API search (debounced via SavedPanel) ── */
  const handleSearch = async (query) => {
    setSearching(true)
    try {
      const results = await getTrips()
      const q = (query || '').trim().toLowerCase()
      setSaved(q && q !== 'all'
        ? results.filter(t => (t.name || t.tripName || '').toLowerCase().includes(q))
        : results
      )
    } catch { }
    finally { setSearching(false) }
  }

  /* ── Form helpers ── */
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  // Update a specific field in a patrol row
  const setPatrolField = (i, field, val) =>
    set('patrols', form.patrols.map((p, idx) => idx === i ? { ...p, [field]: val } : p))

  const addPatrol = () => set('patrols', [...form.patrols, { loc_id: '', qus_ids: [] }])
  const removePatrol = (i) => set('patrols', form.patrols.filter((_, idx) => idx !== i))

  /* ── Map API record → form shape (for edit / clone) ── */
  const apiToForm = (item) => ({
    tripName: item.name || item.tripName || '',
    // patrol_type comes back as array of ids (numbers or strings)
    patrolType: Array.isArray(item.patrolType)
      ? item.patrolType.map(Number)
      : item.patrolType != null ? [Number(item.patrolType)] : [],
    // zone comes back as array of ids
    zone: Array.isArray(item.zone)
      ? item.zone.map(Number)
      : item.zone != null ? [Number(item.zone)] : [],
    // location comes back as [{loc_id, qus_id:[]}]
    patrols: Array.isArray(item.location) && item.location.length
      ? item.location.map(l => ({
        loc_id: Number(l.loc_id ?? ''),
        qus_ids: Array.isArray(l.qus_id) ? l.qus_id.map(String) : [],
      }))
      : blank.patrols,
  })

  /* ── Build payload for API (createTrip / updateTrip) ── */
  const buildPayload = () => ({
    tripName: form.tripName,
    patrolType: form.patrolType.map(Number).filter(n => n > 0),
    zone: form.zone.map(Number).filter(n => n > 0),
    location: form.patrols
      .map(p => ({ loc_id: parseInt(p.loc_id, 10), qus_id: p.qus_ids.map(String) }))
      .filter(p => Number.isFinite(p.loc_id) && p.loc_id > 0),
  })

  const handleEdit = (item) => { setForm({ ...blank, ...apiToForm(item) }); setSel(item.id) }
  const handleClone = (item) => { setForm({ ...blank, ...apiToForm(item) }); setSel(null) }
  const handleCancelEdit = () => { setForm(blank); setSel(null) }
  const handleSaveClick = () => { if (!form.tripName && form.patrolType.length === 0) return; setConfirm(true) }

  const handleConfirmed = async () => {
    setBusy(true)
    const payload = buildPayload()
    try {
      if (sel) {
        await updateTrip(sel, payload)
        setSel(null); setForm(blank)
      } else {
        await createTrip(payload)
        setForm(blank)
      }
      await loadTrips()
      notifyTripsUpdated()
    } catch {
      if (sel) { setSel(null); setForm(blank) }
    }
    setBusy(false); setConfirm(false)
  }

  const handleDelete = async (id) => {
    try { await deleteTrip(id) } catch { }
    if (sel === id) { setForm(blank); setSel(null) }
    await loadTrips()
    notifyTripsUpdated()
  }

  const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
  const toggleSelect = (id) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
  const cancelSelect = () => { setSelectMode(false); setSelectedIds([]) }
  const deleteSelected = async () => {
    for (const id of selectedIds) { try { await deleteTrip(id) } catch { } }
    if (selectedIds.includes(sel)) { setForm(blank); setSel(null) }
    setSelectMode(false); setSelectedIds([])
    await loadTrips()
    notifyTripsUpdated()
  }

  /* ── Confirm modal summary ── */
  const summary = [
    { label: 'Trip Name', value: form.tripName },
    { label: 'Patrol Types', value: form.patrolType.map(v => patrolTypeOpts.find(o => o.value === v)?.label ?? v).join(', ') || '—' },
    { label: 'Zones', value: form.zone.map(v => zoneOpts.find(o => o.value === v)?.label ?? v).join(', ') || '—' },
    ...form.patrols
      .filter(p => p.loc_id !== '')
      .map((p, i) => ({
        label: `Stop ${i + 1}`,
        value: `${locOpts.find(o => o.value === Number(p.loc_id))?.label ?? p.loc_id} / ${p.qus_ids.length} question(s)`,
      })),
  ]

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #dadce0',
    borderRadius: '8px', fontSize: '13px', color: '#202124', outline: 'none',
    height: '42px', boxSizing: 'border-box', background: '#fff',
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
      <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

      {/* ═══ LEFT: FORM ═══ */}
      <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, lineHeight: '28px' }}>
          {sel ? 'Edit Trip' : 'Create Trip'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* ── Trip name ── */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#5f6368', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Trip Name
            </label>
            <input
              placeholder="Enter trip name"
              value={form.tripName}
              onChange={(e) => set('tripName', e.target.value)}
              style={{ ...inputStyle }}
            />
          </div>

          {/* ── Patrol Type  (multi-select) ── */}
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#5f6368', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Patrol Type
            </label>
            <MultiSelectDropdown
              placeholder="Select patrol type(s)"
              selected={form.patrolType}
              onChange={(vals) => set('patrolType', vals)}
              options={patrolTypeOpts}
            />
          </div>

          {/* ── Zone  (multi-select) ── */}
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#5f6368', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Zone
            </label>
            <MultiSelectDropdown
              placeholder="Select zone(s)"
              selected={form.zone}
              onChange={(vals) => set('zone', vals)}
              options={zoneOpts}
            />
          </div>

          {/* ── Location + Question stops ── */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#5f6368', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Locations &amp; Questions
            </label>

            <div style={{ border: '1px solid #dadce0', borderRadius: '10px', padding: '14px', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {form.patrols.map((patrol, i) => (
                <div key={i}>
                  {/* Row label */}
                  <div style={{ fontSize: '11px', color: '#9aa0a6', marginBottom: '5px', fontWeight: 500 }}>
                    Stop {i + 1}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    {/* Location — single select */}
                    <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
                      <SingleSelectDropdown
                        placeholder="Location"
                        value={patrol.loc_id === '' ? '' : Number(patrol.loc_id)}
                        onChange={(v) => setPatrolField(i, 'loc_id', Number(v))}
                        options={locOpts}
                      />
                    </div>

                    {/* Questions — multi-select checkbox dropdown */}
                    <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
                      <MultiSelectDropdown
                        placeholder="Questions"
                        selected={patrol.qus_ids}
                        onChange={(vals) => setPatrolField(i, 'qus_ids', vals)}
                        options={questionOpts}
                      />
                    </div>

                    {/* Remove row */}
                    {form.patrols.length > 1 && (
                      <button
                        onClick={() => removePatrol(i)}
                        style={{ background: 'none', border: 'none', color: '#d93025', fontSize: '20px', cursor: 'pointer', flexShrink: 0, padding: '8px 4px', lineHeight: 1, marginTop: '0' }}
                      >×</button>
                    )}
                  </div>
                </div>
              ))}

              {/* Add row */}
              <button
                onClick={addPatrol}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#1a73e8', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '4px 0', alignSelf: 'flex-start' }}
              >
                <span style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: 1 }}>+</span> Add Stop
              </button>
            </div>
          </div>

        </div>

        {/* ── Save / Cancel ── */}
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
      <SavedPanel
        title="Saved Trips"
        items={saved}
        show={showSaved}
        onShowToggle={() => setShowSaved(s => !s)}
        selectMode={selectMode}
        selectedIds={selectedIds}
        onEnterSelect={enterSelectMode}
        onToggle={toggleSelect}
        onDeleteSelected={deleteSelected}
        onCancelSelect={cancelSelect}
        onSearch={handleSearch}
        searchLoading={searching}
        getItemLabel={t => t.name || t.tripName || String(t.id)}
        extraHeader={
          <button onClick={loadTrips} disabled={loadingTrips} title="Refresh trips"
            style={{ background: 'none', border: '1px solid #dadce0', borderRadius: '4px', cursor: loadingTrips ? 'wait' : 'pointer', fontSize: '13px', padding: '2px 6px', color: '#5f6368', flexShrink: 0 }}>
            {loadingTrips ? '⏳' : '↻'}
          </button>
        }
        statusBanner={
          loadingTrips ? (
            <div style={{ padding: '10px 14px', fontSize: '12px', color: '#1a73e8', background: '#e8f0fe', borderBottom: '1px solid #c6dafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⏳</span> Loading trips…
            </div>
          ) : null
        }
        renderCard={(t, idx) => {
          const displayName = t.name || `Trip #${t.id}`
          const avatarColor = fallbackColors[idx % fallbackColors.length]

          const roleLabel = t.role || null
          const zoneLabel = t.zone || null
          const locationCount = t.location_count ?? 0

          return (
            <>
              {/* ── SECTION 1: Role badge (top bar) + Zone + Menu ── */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px solid #f0f0f0', gap: '8px' }}>

                {/* Left: role badge */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', flex: 1 }}>
                  {roleLabel
                    ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#e8f0fe', border: '1px solid #c5d8fc', borderRadius: '6px', padding: '3px 9px', fontSize: '12px', fontWeight: 600, color: '#1a56db' }}>
                        🛡 {roleLabel}
                      </span>
                    )
                    : <span style={{ fontSize: '11px', color: '#bbb' }}>No role</span>
                  }
                </div>

                {/* Right: zone label + menu */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  {zoneLabel && (
                    <span style={{ fontSize: '11px', color: '#5f6368', whiteSpace: 'nowrap' }}>
                      Zone: {zoneLabel}
                    </span>
                  )}
                  <CardMenu
                    onSelect={() => enterSelectMode(t.id)}
                    onClone={() => handleClone(t)}
                    onEdit={() => handleEdit(t)}
                    onDelete={() => handleDelete(t.id)}
                  />
                </div>
              </div>

              {/* ── SECTION 2: Avatar + Trip Name + Zone subtitle ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {displayName}
                  </div>
                  {zoneLabel && (
                    <div style={{ fontSize: '11px', color: '#5f6368', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {zoneLabel}
                    </div>
                  )}
                </div>
              </div>

              {/* ── SECTION 3: Location count pill ── */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
                {locationCount === 0 ? (
                  <span style={{ fontSize: '11px', color: '#bbb' }}>No stops</span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '2px 9px', fontSize: '11px', color: '#3c4043', whiteSpace: 'nowrap' }}>
                    📍 {locationCount} Stop{locationCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </>
          )
        }}
      />
    </div>
  )
} //ok ipo yenna pannanum nu exact ah sollu.,schedule form mari ella data vum side la show aakanum exact ahh ellla data vum, but athukkku data responsela varanum , response la yenna varutho athan show panna mudiyum ., ....ok then response data mattum pothum , ok