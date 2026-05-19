
import { useState, useEffect, useRef } from 'react'
import {
  getUsers, createUser, updateUser, deleteUser, cloneUser, filterUsers,
  getZoneFilter,
} from '../../../api'
import { ConfirmSaveModal } from '../components/MasterFormUI'

/* ══════════════════════════════════════════════════════
   INLINE API HELPERS FOR DROPDOWN OPTIONS
   Raw API returns { value: <id>, label: <name> } for all three.
   We hit the endpoints directly so no intermediate transform
   can corrupt the value/label shape we depend on.
══════════════════════════════════════════════════════ */
const BASE = 'http://194.238.18.68:5045/api/web/v1'

function _getAuth() {
  const api_key = localStorage.getItem('api_key') || ''
  const e_id    = localStorage.getItem('e_id')    || ''
  return { api_key, e_id }
}

// Shared boilerplate fields required by this server
function _commonBody(auth) {
  return {
    id: 0, limit: '100', offset: '0', name: 'all',
    lat: '0', lon: '0', adrs1: '-', adrs2: '-', city: '-',
    district: '-', state: '-', country: 'india',
    zipcode: '000000', mail: 'a@a.com', mobile: '0000000000',
    zone: 'all',
    e_id: auth.e_id, api_key: auth.api_key,
    
    userid: '1', dsg: '1', dept: '1', role: '1', is_admin: '1',
  }
}

/** designation/filter → [{ value: <id>, label: <name> }] */
async function fetchDesignationOptions() {
  const auth = _getAuth()
  try {
    const res  = await fetch(`${BASE}/designation/filter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(_commonBody(auth)),
    })
    const data = await res.json()
    if (data.error || !data.result) return []
    const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
    // Server already sends { value, label } — use directly
    return records
      .map(r => ({ value: r.value, label: r.label }))
      .filter(r => r.label != null && r.value != null)
  } catch (err) {
    console.error('fetchDesignationOptions failed:', err)
    return []
  }
}

/** patrol_type/filter → [{ value: <id>, label: <name> }] */
async function fetchPatrolTypeOptions() {
  const auth = _getAuth()
  try {
    const res  = await fetch(`${BASE}/patrol_type/filter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(_commonBody(auth)),
    })
    const data = await res.json()
    if (data.error || !data.result) return []
    const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
    return records
      .map(r => ({ value: r.value, label: r.label }))
      .filter(r => r.label != null && r.value != null)
  } catch (err) {
    console.error('fetchPatrolTypeOptions failed:', err)
    return []
  }
}

/** department/filter → [{ value: <id>, label: <name> }] */
async function fetchDepartmentOptions() {
  const auth = _getAuth()
  try {
    const res  = await fetch(`${BASE}/department/filter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(_commonBody(auth)),
    })
    const data = await res.json()
    if (data.error || !data.result) return []
    const records = Array.isArray(data.data) ? data.data : (data.data?.records || [])
    return records
      .map(r => ({ value: r.value, label: r.label }))
      .filter(r => r.label != null && r.value != null)
  } catch (err) {
    console.error('fetchDepartmentOptions failed:', err)
    return []
  }
}

/* ─── colour palette for avatars ─── */

const COLORS = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#1ae8d4', '#e81a8e', '#4a90d9']
const fallbackNames = ['Karthick', 'Arjun', 'Priya', 'Ravi', 'Meena', 'Suresh', 'Divya', 'Vikram']

// dsg / patroltype / dept now store { value, label } | null
// so we can show label in UI but send value to API
const blank = {
  userid: '', name: '', mobile: '', mail: '',
  image: null, imagePreview: null,
  zone:       null,   // { id, label }
  dsg:        null,   // { value, label }
  patroltype: null,   // { value, label }
  dept:       null,   // { value, label }
  is_admin: false, role: '2',
}

/* ══════════════════════════════════════════════════════
   ZoneDropdown — zone/filter API call பண்ணும்,
   { value/id, label } objects return பண்ணும்,
   label show பண்ணும், ஆனா id submit-க்கு use ஆகும்
══════════════════════════════════════════════════════ */
function ZoneDropdown({ value, onChange, refreshEvent }) {
  // value = { id, label } | null
  const [open, setOpen]       = useState(false)
  const [search, setSearch]   = useState('')
  const [options, setOptions] = useState([])   // [{ id, label }]
  const [loading, setLoading] = useState(false)
  const ref        = useRef(null)
  const fetchedRef = useRef(false)

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch('') } }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    if (!refreshEvent) return
    const events = Array.isArray(refreshEvent) ? refreshEvent : [refreshEvent]
    const h = () => { fetchedRef.current = false }
    events.forEach(e => window.addEventListener(e, h))
    return () => events.forEach(e => window.removeEventListener(e, h))
  }, [refreshEvent])

  const handleFocus = async () => {
    setOpen(true); setSearch('')
    //if (fetchedRef.current) return
    setLoading(true)
    try {
      const records = await getZoneFilter()
      // getZoneFilter returns [{value, label}] or [{id, label}]
      const mapped = records.map(r => ({
        id:    r.value ?? r.id,
        label: r.label || r.name || String(r.value ?? r.id),
      })).filter(r => r.label)
      setOptions(mapped)
      console.log(mapped);
      fetchedRef.current = true
    } catch (err) {
      console.error('ZoneDropdown fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const displayVal = open ? search : (value?.label || '')
  const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <input
        type="text"
        placeholder="Zone"
        value={displayVal}
        onChange={e => { setSearch(e.target.value); setOpen(true) }}
        onFocus={handleFocus}
        style={{
          width: '100%', padding: '10px 14px',
          border: '1px solid #dadce0', borderRadius: '8px',
          fontSize: '13px', color: '#202124', outline: 'none',
          height: '42px', boxSizing: 'border-box', background: '#fff',
        }}
      />
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0,
          background: '#fff', border: '1px solid #dadce0', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999,
          maxHeight: '200px', overflowY: 'auto',
        }}>
          {loading ? (
            <div style={{ padding: '10px 14px', fontSize: '13px', color: '#9aa0a6' }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '10px 14px', fontSize: '13px', color: '#9aa0a6' }}>
              {search ? `No match for "${search}"` : 'No zones found.'}
            </div>
          ) : filtered.map(opt => (
            <div
              key={opt.id}
              onMouseDown={() => { onChange(opt); setOpen(false); setSearch('') }}
              style={{
                padding: '10px 14px', fontSize: '13px', color: '#202124',
                cursor: 'pointer', borderBottom: '1px solid #f5f5f5',
                background: value?.id === opt.id ? '#f0f4ff' : '#fff',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
              onMouseLeave={e => e.currentTarget.style.background = value?.id === opt.id ? '#f0f4ff' : '#fff'}
            >{opt.label}</div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   ApiDropdown — stores { value, label } internally
   • Shows label in the input / list
   • Passes { value, label } to onChange
   • Caller extracts .value for API payload
══════════════════════════════════════════════════════ */
function ApiDropdown({ value, onChange, fetchFn, placeholder, refreshEvent }) {
  // value = { value, label } | null
  const [open, setOpen]       = useState(false)
  const [search, setSearch]   = useState('')
  const [options, setOptions] = useState([])   // [{ value, label }]
  const [loading, setLoading] = useState(false)
  const ref        = useRef(null)
  const fetchedRef = useRef(false)

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch('') } }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    if (!refreshEvent) return
    const events = Array.isArray(refreshEvent) ? refreshEvent : [refreshEvent]
    const h = () => { fetchedRef.current = false }
    events.forEach(e => window.addEventListener(e, h))
    return () => events.forEach(e => window.removeEventListener(e, h))
  }, [refreshEvent])

  const handleFocus = async () => {
    setOpen(true); setSearch('')
    if (fetchedRef.current) return
    setLoading(true)
    try {
      // fetchFn must return [{ value, label }]
      const list = await fetchFn()
      setOptions(list)
      fetchedRef.current = true
    } catch (err) {
      console.error('ApiDropdown fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }

  // Show label in input when closed; show search text when open
  const displayVal = open ? search : (value?.label || '')

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <input
        type="text"
        placeholder={placeholder}
        value={displayVal}
        onChange={e => { setSearch(e.target.value); setOpen(true) }}
        onFocus={handleFocus}
        style={{
          width: '100%', padding: '10px 14px',
          border: '1px solid #dadce0', borderRadius: '8px',
          fontSize: '13px', color: '#202124', outline: 'none',
          height: '42px', boxSizing: 'border-box', background: '#fff',
        }}
      />
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0,
          background: '#fff', border: '1px solid #dadce0', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 9999,
          maxHeight: '200px', overflowY: 'auto',
        }}>
          {loading ? (
            <div style={{ padding: '10px 14px', fontSize: '13px', color: '#9aa0a6' }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '10px 14px', fontSize: '13px', color: '#9aa0a6' }}>
              {search ? `No match for "${search}"` : `No ${placeholder.toLowerCase()} found.`}
            </div>
          ) : filtered.map(opt => (
            <div
              key={opt.value}
              onMouseDown={() => { onChange(opt); setOpen(false); setSearch('') }}
              style={{
                padding: '10px 14px', fontSize: '13px', color: '#202124',
                cursor: 'pointer', borderBottom: '1px solid #f5f5f5',
                background: value?.value === opt.value ? '#f0f4ff' : '#fff',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
              onMouseLeave={e => e.currentTarget.style.background = value?.value === opt.value ? '#f0f4ff' : '#fff'}
            >{opt.label}</div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── 3-dot card menu ─── */
function CardMenu({ onSelect, onClone, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
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
   SAVED PANEL
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

  const getLabel = item =>
    getItemLabel ? getItemLabel(item) : (item.userName || item.name || String(item.id))

  const filteredItems = onSearch
    ? items
    : items.filter(item => getLabel(item).toLowerCase().includes(search.toLowerCase()))

  const ddFiltered = items.filter(item =>
    getLabel(item).toLowerCase().includes(ddSearch.toLowerCase())
  )

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Header ── */}
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

      {/* ── Status banner ── */}
      {statusBanner}

      {/* ── Quick-select dropdown + search bar ── */}
      {show && !selectMode && (
        <div style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>

          {/* Quick-select dropdown */}
          <div ref={ddRef} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #dadce0', borderRadius: '8px', height: '36px', background: '#fff', overflow: 'hidden' }}>
              <span style={{ padding: '0 8px', fontSize: '13px', color: '#9aa0a6', flexShrink: 0 }}>▾</span>
              <input
                value={ddOpen ? ddSearch : ''}
                placeholder={`Quick-select ${title.toLowerCase()}…`}
                onFocus={() => { setDdOpen(true); setDdSearch('') }}
                onChange={e => { setDdSearch(e.target.value); setDdOpen(true) }}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '12px', color: '#202124', background: 'transparent', height: '100%', padding: '0 4px' }}
              />
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
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '12px', color: '#202124', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', background: '#fff' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                      <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: COLORS[idx % COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', flexShrink: 0 }}>
                        {getLabel(item).charAt(0).toUpperCase()}
                      </div>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getLabel(item)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#9aa0a6' }}>
              {searchLoading ? '⏳' : '🔍'}
            </span>
            <input value={search} onChange={e => handleSearchChange(e.target.value)}
              placeholder={onSearch ? 'Search via API…' : 'Filter list…'}
              style={{ width: '100%', padding: '6px 28px 6px 26px', border: '1px solid #e8eaed', borderRadius: '6px', fontSize: '12px', color: '#202124', outline: 'none', boxSizing: 'border-box', background: '#fafbfc' }} />
            {search && (
              <span onMouseDown={handleSearchClear}
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#9aa0a6', cursor: 'pointer' }}>✕</span>
            )}
          </div>
        </div>
      )}

      {/* ── Cards list ── */}
      {show && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>
          {filteredItems.length === 0 && (
            <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>
              {items.length === 0 ? 'No users saved yet.' : 'No matches.'}
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
   MAIN UserForm
══════════════════════════════════════════════════════ */
export default function UserForm() {
  const [form, setForm]         = useState(blank)
  const [saved, setSaved]       = useState([])
  const [sel, setSel]           = useState(null)   // editing user id
  const [busy, setBusy]         = useState(false)
  const [confirm, setConfirm]   = useState(false)
  const [show, setShow]         = useState(true)
  const [selectMode, setSelectMode]   = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [searching, setSearching]     = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [errors, setErrors]           = useState({})

  const fileRef = useRef(null)

  useEffect(() => {
    console.log("savvvved", saved);
  }, [saved]);

  /* ── Load users on mount ── */
  const loadUsers = async () => {
    setLoadingUsers(true)
    try { setSaved(await getUsers()) } catch {}
    finally { setLoadingUsers(false) }
  }

  useEffect(() => { loadUsers() }, [])

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => { const e = { ...p }; delete e[k]; return e })
  }

  /* ── Helper: reconstruct { value, label } from a raw stored string ──
     When loading from the API we only have the stored value string;
     we wrap it so ApiDropdown can display it as a label until the
     user reopens the dropdown and picks a proper entry.               */
  const toOpt = raw => raw ? { value: raw, label: raw } : null

  /* ── Edit — load into form ── */
  const handleEdit = item => {
    const zoneVal = Array.isArray(item.zone)
      ? (item.zone.length > 0 ? { id: item.zone[0], label: String(item.zone[0]) } : null)
      : (item.zone ? { id: item.zone, label: item.zone } : null)

    setForm({
      ...blank,
      userid:       item.userid     || '',
      name:         item.userName   || item.name || '',
      mobile:       item.mobile     || '',
      mail:         item.mail       || '',
      zone:         zoneVal,
      // Wrap raw strings so ApiDropdown shows the stored value as label
      dsg:          toOpt(item.dsg),
      patroltype:   toOpt(item.patroltype),
      dept:         toOpt(item.dept),
      is_admin:     item.is_admin   || false,
      role:         item.role       || '2',
      imagePreview: item.imagePreview || null,
      image:        null,
    })
    setSel(item.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ── Clone — use cloneUser API ── */
  const handleClone = async item => {
    setBusy(true)
    try {
      const cloned = await cloneUser(item.id)
      setForm({
        ...blank,
        userid:       cloned.userid     || '',
        name:         cloned.userName   || cloned.name || '',
        mobile:       cloned.mobile     || '',
        mail:         cloned.mail       || '',
        zone:         null,
        dsg:          toOpt(cloned.dsg),
        patroltype:   toOpt(cloned.patroltype),
        dept:         toOpt(cloned.dept),
        is_admin:     cloned.is_admin   || false,
        role:         cloned.role       || '2',
        imagePreview: cloned.imagePreview || null,
        image:        null,
      })
      setSel(null)
      await loadUsers()
    } catch (err) {
      alert(err?.message || 'Clone failed — please try again')
    }
    setBusy(false)
  }

  const handleCancelEdit = () => { setForm(blank); setSel(null); setErrors({}) }
  const handleSaveClick  = () => {
    const errs = {}
    if (!form.name.trim())   errs.name   = 'User Name is required'
    if (!form.mobile.trim()) errs.mobile = 'Mobile is required'
    if (!form.mail.trim())   errs.mail   = 'Email is required'
    if (Object.keys(errs).length) {
      setErrors(errs)
      console.log('[UserForm] ❌ Validation failed:', errs)
      return
    }
    setErrors({})
    console.log('[UserForm] ✅ Validation passed — form:', form)
    setConfirm(true)
  }

  /* ── Submit → createUser / updateUser API ── */
  const handleConfirmed = async () => {
    setBusy(true)
    try {
      if (sel) {
        console.log('[UserForm] 🔄 Updating user id:', sel, 'form:', form)
        await updateUser(sel, form)
        setSel(null)
      } else {
        console.log('[UserForm] ➕ Creating user — form:', form)
        console.log("form - inside else of handleConfirmed", form);
        await createUser(form)
      }
      await loadUsers()
      console.log('[UserForm] ✅ Save successful — reloaded list')
      setForm(blank)
    } catch (err) {
      console.log('[UserForm] 🔥 Save error:', err)
      alert(err?.message || 'Save failed — please try again')
    }
    setBusy(false); setConfirm(false)
  }

  /* ── Delete single ── */
  const handleDelete = async id => {
    if (!window.confirm('Delete this user?')) return
    console.log('[UserForm] 🗑 Deleting user id:', id)
    try { await deleteUser(id) } catch (err) { console.log('[UserForm] 🔥 Delete error:', err) }
    setSaved(p => p.filter(u => u.id !== id))
    if (sel === id) { setForm(blank); setSel(null) }
  }

  /* ── Select mode ── */
  const enterSelectMode = id => { setSelectMode(true); setSelectedIds([id]) }
  const toggleSelect    = fn => setSelectedIds(typeof fn === 'function' ? fn : fn)
  const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
  const deleteSelected  = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} selected user(s)?`)) return
    for (const id of selectedIds) { try { await deleteUser(id) } catch {} }
    setSaved(p => p.filter(u => !selectedIds.includes(u.id)))
    if (selectedIds.includes(sel)) { setForm(blank); setSel(null) }
    setSelectMode(false); setSelectedIds([])
  }

  /* ── filterUsers API search (debounced via SavedPanel) ── */
  const handleSearch = async (query) => {
    setSearching(true)
    try {
      const results = await filterUsers(query && query.trim() ? query.trim() : 'all')
      setSaved(results)
    } catch {
      // fallback: keep existing list
    } finally {
      setSearching(false)
    }
  }

  /* ── Image ── */
  const handleImageChange = e => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => set('imagePreview', ev.target.result)
    reader.readAsDataURL(file)
    set('image', file)
  }

  // Summary shows labels for human-readable display
  // All values are explicitly coerced to strings to prevent .split crashes in ConfirmSaveModal
  const _s = v => (v == null ? '' : String(v))
  const summary = [
    { label: 'User ID',     value: _s(form.userid) },
    { label: 'User Name',   value: _s(form.name) },
    { label: 'Mobile',      value: _s(form.mobile) },
    { label: 'Mail',        value: _s(form.mail) },
    { label: 'Zone',        value: _s(form.zone?.label) },
    { label: 'Designation', value: _s(form.dsg?.label) },
    { label: 'Patrol Type', value: _s(form.patroltype?.label) },
    { label: 'Department',  value: _s(form.dept?.label) },
    { label: 'Is Admin',    value: form.is_admin ? 'Yes' : 'No' },
  ]

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #dadce0',
    borderRadius: '8px', fontSize: '13px', color: '#202124',
    outline: 'none', height: '42px', boxSizing: 'border-box', background: '#fff',
  }

  // fetchDesignationOptions / fetchPatrolTypeOptions / fetchDepartmentOptions
  // are module-level functions defined at the top of this file.
  // They hit the API directly and return [{ value, label }] with no intermediate
  // transform — label is shown in the UI, value is sent in the payload.

  console.log("saved", saved);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>

      <ConfirmSaveModal
        open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)}
        loading={busy} isEditing={!!sel} summary={summary}
      />

      {/* ═══ LEFT: FORM ═══ */}
      <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0 }}>
          {sel ? 'Edit User' : 'Create User'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Row 1: User ID & Name */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <input placeholder="User ID"   value={form.userid} onChange={e => set('userid', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <input placeholder="User Name *" value={form.name} onChange={e => set('name', e.target.value)}
                style={{ ...inputStyle, borderColor: errors.name ? '#d93025' : '#dadce0' }} />
              {errors.name && <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#d93025' }}>⚠ {errors.name}</p>}
            </div>
          </div>

          {/* Row 2: Mobile & Mail */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <input placeholder="Mobile *" value={form.mobile} onChange={e => set('mobile', e.target.value)}
                style={{ ...inputStyle, borderColor: errors.mobile ? '#d93025' : '#dadce0' }} />
              {errors.mobile && <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#d93025' }}>⚠ {errors.mobile}</p>}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <input placeholder="Mail *" value={form.mail} onChange={e => set('mail', e.target.value)} type="email"
                style={{ ...inputStyle, borderColor: errors.mail ? '#d93025' : '#dadce0' }} />
              {errors.mail && <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#d93025' }}>⚠ {errors.mail}</p>}
            </div>
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

          {/* Row 3: Zone & Designation */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <ZoneDropdown
              value={form.zone}
              onChange={v => set('zone', v)}
              refreshEvent="zones-updated"
            />
            {/* value = { value, label } | null — onChange gives { value, label }
                label shown in UI, value sent to API payload */}
            <ApiDropdown
              placeholder="Designation"
              value={form.dsg}
              onChange={v => set('dsg', v)}
              fetchFn={fetchDesignationOptions}
              refreshEvent={['designations-updated', 'masters-updated']}
            />
          </div>

          {/* Row 4: Patrol Type & Department */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <ApiDropdown
              placeholder="Patrol Type"
              value={form.patroltype}
              onChange={v => set('patroltype', v)}
              fetchFn={fetchPatrolTypeOptions}
              refreshEvent={['patroltypes-updated', 'masters-updated']}
            />
            <ApiDropdown
              placeholder="Department"
              value={form.dept}
              onChange={v => set('dept', v)}
              fetchFn={fetchDepartmentOptions}
              refreshEvent={['departments-updated', 'masters-updated']}
            />
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

        {/* Save / Cancel */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '20px', marginTop: 'auto' }}>
          {sel && (
            <button onClick={handleCancelEdit}
              style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '6px', background: '#fff', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              Cancel
            </button>
          )}
          <button onClick={handleSaveClick}
            style={{ padding: '10px 32px', border: 'none', borderRadius: '6px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
            {sel ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      {/* ═══ RIGHT: SAVED PANEL ═══ */}
      <SavedPanel
        title="Users"
        items={saved}
        show={show}
        onShowToggle={() => setShow(s => !s)}
        selectMode={selectMode}
        selectedIds={selectedIds}
        onEnterSelect={enterSelectMode}
        onToggle={toggleSelect}
        onDeleteSelected={deleteSelected}
        onCancelSelect={cancelSelect}
        onSearch={handleSearch}
        searchLoading={searching}
        getItemLabel={item => item.userName || item.name || String(item.id)}
        extraHeader={
          <button onClick={loadUsers} disabled={loadingUsers} title="Refresh users"
            style={{ background: 'none', border: '1px solid #dadce0', borderRadius: '4px', cursor: loadingUsers ? 'wait' : 'pointer', fontSize: '13px', padding: '2px 6px', color: '#5f6368', flexShrink: 0 }}>
            {loadingUsers ? '⏳' : '↻'}
          </button>
        }
        statusBanner={
          loadingUsers ? (
            <div style={{ padding: '10px 14px', fontSize: '12px', color: '#1a73e8', background: '#e8f0fe', borderBottom: '1px solid #c6dafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⏳</span> Loading users…
            </div>
          ) : null
        }
        renderCard={(u, idx) => {
          const displayName = u.userName || u.name || fallbackNames[idx % fallbackNames.length]
          const avatarColor = COLORS[idx % COLORS.length]
          const zoneLabel    = Array.isArray(u.zone) ? u.zone[0] : u.zone
          const companyName  = u.company || u.companyName || 'Company name'
          const shiftLabel   = u.shift || u.shiftName || null

          return (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>

              {/* ── Avatar (spans all rows on the left) ── */}
              <div style={{ flexShrink: 0, marginTop: '2px' }}>
                {u.imagePreview
                  ? <img src={u.imagePreview} alt="" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                  : <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', color: '#fff', fontWeight: 700 }}>
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                }
              </div>

              {/* ── Right content ── */}
              <div style={{ flex: 1, minWidth: 0 }}>

                {/* Row 1: Role label + badge | Company name + ⋮ menu */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                  <span style={{ fontSize: '12px', color: '#5f6368', fontWeight: 500, flexShrink: 0 }}>Role</span>
                  <span style={{
                    background: '#1e8e3e', color: '#fff',
                    padding: '1px 7px', borderRadius: '4px',
                    fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap',
                  }}>
                    {u.is_admin ? 'Admin' : 'Admin or not'}
                  </span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: '12px', color: '#5f6368', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>
                    {companyName}
                  </span>
                  <CardMenu
                    onSelect={() => enterSelectMode(u.id)}
                    onClone={()  => handleClone(u)}
                    onEdit={()   => handleEdit(u)}
                    onDelete={()  => handleDelete(u.id)}
                  />
                </div>

                {/* Row 2: Name (UserId) */}
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '2px' }}>
                  {displayName}{u.userid ? ` (${u.userid})` : ''}
                </div>

                {/* Row 3: Mobile | Mail */}
                <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                  <span>{u.mobile || '—'}</span>
                  {u.mail && (
                    <>
                      <span style={{ color: '#dadce0' }}>|</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{u.mail}</span>
                    </>
                  )}
                </div>

                {/* Row 4: Pill tags — Zone, Designation, Shift, Department */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    zoneLabel   && { label: zoneLabel },
                    u.dsg       && { label: typeof u.dsg === 'object' ? u.dsg.label : u.dsg },
                    shiftLabel  && { label: shiftLabel },
                    u.dept      && { label: typeof u.dept === 'object' ? u.dept.label : u.dept },
                  ].filter(Boolean).map(t => (
                    <span key={t.label} style={{
                      background: '#f8f9fa', border: '1px solid #dadce0',
                      borderRadius: '6px', padding: '3px 10px',
                      fontSize: '12px', color: '#3c4043', fontWeight: 500, whiteSpace: 'nowrap',
                    }}>
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        }}
      />
    </div>
  )
}