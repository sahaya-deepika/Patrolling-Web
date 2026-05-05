import { useState, useEffect, useRef } from 'react'
import {
  getZones, createZone, updateZone, deleteZone, cloneZone, getZoneDetails,
  getPatrolTypes, createPatrolType, updatePatrolType, deletePatrolType, filterPatrolTypes,
  getDesignations, createDesignation, updateDesignation, deleteDesignation, filterDesignations,
  getDepartments, createDepartment, updateDepartment, deleteDepartment, filterDepartments,
} from '../../../api'
import { ConfirmSaveModal } from '../components/MasterFormUI'

/* ─── colour palette for avatars ─── */
const COLORS = ['#1a73e8', '#e8371a', '#1e8e3e', '#8e1ae8', '#e8a81a', '#1ae8d4', '#e81a8e', '#4a90d9']

/* ─── safe string coerce (mirrors api.js) ─── */
const str = v => (v == null ? '' : String(v))

const formatDesignation = (data) =>
  data.map(d => ({
    id: d.value,
    designationName: d.label
  }));

/* ─── shared base input style ─── */
const iStyle = {
  width: '100%', padding: '10px 14px', border: '1px solid #dadce0',
  borderRadius: '8px', fontSize: '13px', color: '#202124', outline: 'none',
  height: '42px', boxSizing: 'border-box', background: '#fff',
}

/* ─── label wrapper ─── */
function Field({ label, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0, ...style }}>
      <label style={{ fontSize: '11px', fontWeight: 600, color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
      {children}
    </div>
  )
}

/* ─── plain text input with label ─── */
function TextField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <Field label={label}>
      <input type={type} placeholder={placeholder || label} value={value} onChange={e => onChange(e.target.value)} style={iStyle} />
    </Field>
  )
}

/* ─── row wrapper ─── */
const Row = ({ children, gap = '14px' }) => (
  <div style={{ display: 'flex', gap, alignItems: 'flex-end' }}>{children}</div>
)

/* ─── shared 3-dot card menu ─── */
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
      <button onClick={() => setOpen(o => !o)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '18px', color: '#5f6368', lineHeight: 1 }}>⋮</button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '130px', overflow: 'hidden' }}>
          {items.map(({ label, icon, color, action }) => (
            <div key={label} onMouseDown={() => { action(); setOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontSize: '13px', color, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            ><span>{icon}</span>{label}</div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Leaflet map ─── */
function LocationMap({ lat, lng, onChange }) {
  const mapRef = useRef(null)
  const leafletRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'; link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    const initMap = () => {
      if (!mapRef.current || leafletRef.current) return
      const L = window.L
      const map = L.map(mapRef.current, { zoomControl: false }).setView([lat, lng], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 }).addTo(map)
      L.control.zoom({ position: 'bottomright' }).addTo(map)
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:20px;height:20px;background:#1a73e8;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [20, 20], iconAnchor: [10, 10],
      })
      const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map)
      markerRef.current = marker
      marker.on('dragend', () => { const { lat: la, lng: ln } = marker.getLatLng(); onChange(la, ln) })
      map.on('click', (e) => { marker.setLatLng(e.latlng); onChange(e.latlng.lat, e.latlng.lng) })
      leafletRef.current = map
    }
    if (window.L) { initMap() }
    else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      document.head.appendChild(script)
    }
    return () => { if (leafletRef.current) { leafletRef.current.remove(); leafletRef.current = null } }
  }, [])

  useEffect(() => {
    if (markerRef.current && leafletRef.current) {
      markerRef.current.setLatLng([lat, lng])
      leafletRef.current.setView([lat, lng], leafletRef.current.getZoom())
    }
  }, [lat, lng])

  return <div ref={mapRef} style={{ width: '100%', height: '180px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #dadce0', zIndex: 0 }} />
}

/* ─── right panel with saved items — includes search bar + quick-select dropdown ─── */
function SavedPanel({ title, items, renderCard, selectMode, selectedIds, onEnterSelect, onToggle, onDeleteSelected, onCancelSelect, onShowToggle, show, getItemLabel, extraHeader, statusBanner, onSearch, searchLoading }) {
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

  // ── Debounced real-API search (used when onSearch is provided) ──
  const handleSearchChange = (val) => {
    setSearch(val)
    if (!onSearch) return
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearch(val.trim() || 'all')
    }, 400)
  }

  // ── Clear search resets to full list ──
  const handleSearchClear = () => {
    setSearch('')
    if (onSearch) onSearch('all')
  }

  const getLabel = item => getItemLabel
    ? getItemLabel(item)
    : (item.name || item.zoneNameLong || item.typeName || item.patrolName || item.designationName || item.departmentName || String(item.id))

  // If onSearch is provided, items are already filtered by API; no local filter needed
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

      {/* ── Status banner (loading / error) — only for panels that supply it ── */}
      {statusBanner}

      {/* ── Quick-select dropdown + search bar ── */}
      {show && !selectMode && (
        <div style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
              {ddOpen && <button onMouseDown={() => { setDdOpen(false); setDdSearch('') }}
                style={{ padding: '0 8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#9aa0a6' }}>✕</button>}
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

          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#9aa0a6' }}>
              {searchLoading ? '⏳' : '🔍'}
            </span>
            <input value={search} onChange={e => handleSearchChange(e.target.value)} placeholder={onSearch ? 'Search via API…' : 'Filter list…'}
              style={{ width: '100%', padding: '6px 28px 6px 26px', border: '1px solid #e8eaed', borderRadius: '6px', fontSize: '12px', color: '#202124', outline: 'none', boxSizing: 'border-box', background: '#fafbfc' }} />
            {search && (
              <span onMouseDown={handleSearchClear} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#9aa0a6', cursor: 'pointer' }}>✕</span>
            )}
          </div>
        </div>
      )}

      {/* ── Cards list ── */}
      {show && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>
          {filteredItems.length === 0 && (
            <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>
              {items.length === 0 ? 'No items saved yet.' : 'No matches.'}
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

/* ═══════════════════════════════════════════════════════════
   COUNTRY / STATE DATA — used by ZoneSection dropdowns
═══════════════════════════════════════════════════════════ */
const GEO_DATA = {
  India: [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
  ],
  'United States': [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
    'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
  ],
  'United Kingdom': [
    'England', 'Scotland', 'Wales', 'Northern Ireland',
  ],
  Australia: [
    'New South Wales', 'Victoria', 'Queensland', 'South Australia',
    'Western Australia', 'Tasmania', 'Australian Capital Territory', 'Northern Territory',
  ],
  Canada: [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
    'Prince Edward Island', 'Quebec', 'Saskatchewan',
  ],
  Germany: [
    'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg',
    'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia',
    'Rhineland-Palatinate', 'Saarland', 'Saxony', 'Saxony-Anhalt',
    'Schleswig-Holstein', 'Thuringia',
  ],
  'Other': [],
}
const COUNTRY_LIST = Object.keys(GEO_DATA)

/* Districts keyed by Indian state — other countries fall back to free-text */
const DISTRICT_DATA = {
  'Tamil Nadu': [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
    'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram', 'Kanyakumari', 'Karur',
    'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal',
    'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet',
    'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi',
    'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur',
    'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar',
  ],
  'Maharashtra': [
    'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana',
    'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna',
    'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded',
    'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad',
    'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha',
    'Washim', 'Yavatmal',
  ],
  'Karnataka': [
    'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
    'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga',
    'Dakshina Kannada', 'Davangere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri',
    'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur',
    'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura',
    'Yadgir',
  ],
  'Kerala': [
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam',
    'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta',
    'Thiruvananthapuram', 'Thrissur', 'Wayanad',
  ],
  'Andhra Pradesh': [
    'Alluri Sitharama Raju', 'Anakapalli', 'Anantapur', 'Annamayya', 'Bapatla',
    'Chittoor', 'East Godavari', 'Eluru', 'Guntur', 'Kadapa', 'Kakinada',
    'Konaseema', 'Krishna', 'Kurnool', 'Nandyal', 'NTR', 'Palnadu', 'Parvathipuram Manyam',
    'Prakasam', 'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 'Srikakulam',
    'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari',
  ],
  'Telangana': [
    'Adilabad', 'Bhadradri Kothagudem', 'Hanamkonda', 'Hyderabad', 'Jagtial',
    'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy',
    'Karimnagar', 'Khammam', 'Kumuram Bheem', 'Mahabubabad', 'Mahabubnagar',
    'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool',
    'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla',
    'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy',
    'Warangal', 'Yadadri Bhuvanagiri',
  ],
  'Gujarat': [
    'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar',
    'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar',
    'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana',
    'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot',
    'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad',
  ],
  'Rajasthan': [
    'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner',
    'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh',
    'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli',
    'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar',
    'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur',
  ],
  'Uttar Pradesh': [
    'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya',
    'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Bara Banki',
    'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli',
    'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad',
    'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur',
    'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat',
    'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri', 'Lalitpur',
    'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut',
    'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj',
    'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur',
    'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur',
    'Unnao', 'Varanasi',
  ],
  'West Bengal': [
    'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling',
    'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda',
    'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur',
    'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur',
  ],
  'Punjab': [
    'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka',
    'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana',
    'Mansa', 'Moga', 'Mohali', 'Muktsar', 'Nawanshahr', 'Pathankot', 'Patiala',
    'Rupnagar', 'Sangrur', 'Tarn Taran',
  ],
  'Haryana': [
    'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram',
    'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh',
    'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar',
  ],
  'Madhya Pradesh': [
    'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani',
    'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh',
    'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad',
    'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla',
    'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch', 'Niwari', 'Panna', 'Raisen',
    'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol',
    'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain',
    'Umaria', 'Vidisha',
  ],
  'Bihar': [
    'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur',
    'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad',
    'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura',
    'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia',
    'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi',
    'Siwan', 'Supaul', 'Vaishali', 'West Champaran',
  ],
  'Odisha': [
    'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack',
    'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur',
    'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha',
    'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada',
    'Puri', 'Rayagada', 'Sambalpur', 'Sonepur', 'Sundargarh',
  ],
  'Assam': [
    'Bajali', 'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo',
    'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara',
    'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan',
    'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon',
    'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar',
    'Tinsukia', 'Udalguri', 'West Karbi Anglong',
  ],
  'Delhi': [
    'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
    'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi',
    'South West Delhi', 'West Delhi',
  ],
  'Himachal Pradesh': [
    'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul and Spiti',
    'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una',
  ],
  'Uttarakhand': [
    'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital',
    'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar',
    'Uttarkashi',
  ],
  'Jharkhand': [
    'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa',
    'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma',
    'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahebganj',
    'Seraikela Kharsawan', 'Simdega', 'West Singhbhum',
  ],
  'Chhattisgarh': [
    'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur',
    'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa',
    'Jashpur', 'Kabirdham', 'Kanker', 'Kondagaon', 'Korba', 'Korea', 'Mahasamund',
    'Manendragarh', 'Mohla-Manpur', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur',
    'Rajnandgaon', 'Sakti', 'Sarangarh-Bilaigarh', 'Sukma', 'Surajpur', 'Surguja',
  ],
  'Goa': ['North Goa', 'South Goa'],
  'Manipur': [
    'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam',
    'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong',
    'Tengnoupal', 'Thoubal', 'Ukhrul',
  ],
  'Meghalaya': ['East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'Eastern West Khasi Hills',
    'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills',
    'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'],
  'Sikkim': ['East Sikkim', 'North Sikkim', 'Pakyong', 'Soreng', 'South Sikkim', 'West Sikkim'],
  'Tripura': ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura'],
  'Arunachal Pradesh': [
    'Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Kamle',
    'Kra Daadi', 'Kurung Kumey', 'Lepa Rada', 'Lohit', 'Longding', 'Lower Dibang Valley',
    'Lower Siang', 'Lower Subansiri', 'Namsai', 'Pakke-Kessang', 'Papum Pare',
    'Shi Yomi', 'Siang', 'Tawang', 'Tirap', 'Upper Dibang Valley', 'Upper Siang',
    'Upper Subansiri', 'West Kameng', 'West Siang',
  ],
  'Mizoram': ['Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Saitual', 'Serchhip'],
  'Nagaland': ['Chumoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Niuland', 'Noklak', 'Peren', 'Phek', 'Shamator', 'Tseminyü', 'Tuensang', 'Wokha', 'Zunheboto'],
  'Puducherry': ['Karaikal', 'Mahe', 'Puducherry', 'Yanam'],
  'Chandigarh': ['Chandigarh'],
  'Jammu and Kashmir': [
    'Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu',
    'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri',
    'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur',
  ],
  'Ladakh': ['Kargil', 'Leh'],
  'Andaman and Nicobar Islands': ['Nicobar', 'North and Middle Andaman', 'South Andaman'],
  'Lakshadweep': ['Lakshadweep'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Dadra and Nagar Haveli', 'Daman', 'Diu'],
}

/* ─── Cascading select helper ─── */
function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ ...iStyle, appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%235f6368\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '32px', cursor: 'pointer' }}
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  )
}

/* ═══════════════════════════════════════════════════════════
   ZONE DETAIL MODAL — lazy-fetches full details on open
═══════════════════════════════════════════════════════════ */
function ZoneDetailModal({ zone, onClose, onEdit, onClone }) {
  if (!zone) return null

  // All params that were saved — read directly from the zone object (from localStorage cache)
  // Show every field except offset/limit. Use '-' as placeholder only if field exists but is empty.
  const DRow = ({ label, value }) => {
    const v = str(value).trim()
    if (!v || v === '-' || v === '0' || v === '0.0') return null
    return (
      <div style={{ display: 'flex', borderBottom: '1px solid #f5f5f5', padding: '9px 0' }}>
        <span style={{ width: '130px', flexShrink: 0, fontSize: '11px', fontWeight: 700, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: '0.4px', paddingTop: '1px' }}>{label}</span>
        <span style={{ flex: 1, fontSize: '13px', color: '#202124', wordBreak: 'break-word', lineHeight: 1.5 }}>{v}</span>
      </div>
    )
  }

  const SectionHead = ({ icon, title }) => (
    <div style={{ fontSize: '11px', fontWeight: 700, color: '#1a73e8', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '16px 0 4px', borderBottom: '2px solid #e8f0fe', paddingBottom: '4px' }}>
      {icon} {title}
    </div>
  )

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 16px 48px rgba(0,0,0,0.28)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e8eaed', flexShrink: 0, background: '#1a73e8', borderRadius: '16px 16px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🗺</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{str(zone.zoneName || zone.zoneNameLong) || 'Zone'}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)' }}>Zone Details</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#fff', padding: '6px 10px', borderRadius: '8px', lineHeight: 1 }}>✕</button>
        </div>

        {/* ── Scrollable body — ALL params ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 16px' }}>

          <SectionHead icon="🏷" title="Zone Identity" />
          <DRow label="Zone Name" value={zone.zoneName || zone.zoneNameLong} />

          <SectionHead icon="📍" title="Map Location" />
          <DRow label="Latitude" value={zone.lat} />
          <DRow label="Longitude" value={zone.lng} />

          <SectionHead icon="🏠" title="Address" />
          <DRow label="Address Line 1" value={zone.addressLine1} />
          <DRow label="Address Line 2" value={zone.addressLine2} />
          <DRow label="City" value={zone.city} />
          <DRow label="District" value={zone.district} />
          <DRow label="State" value={zone.state} />
          <DRow label="Country" value={zone.country} />
          <DRow label="Pincode" value={zone.pincode} />

          <SectionHead icon="📞" title="Contact" />
          <DRow label="Mobile" value={zone.mobile} />
          <DRow label="Email" value={zone.email} />

        </div>

        {/* ── Footer actions ── */}
        <div style={{ display: 'flex', gap: '10px', padding: '14px 20px', borderTop: '1px solid #e8eaed', background: '#fafbfc', borderRadius: '0 0 16px 16px', flexShrink: 0 }}>
          <button
            onClick={() => { onEdit(zone); onClose() }}
            style={{ flex: 1, padding: '10px', border: '1px solid #1a73e8', borderRadius: '8px', background: '#e8f0fe', color: '#1a73e8', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >✎ Edit</button>
          <button
            onClick={() => { onClone(zone); onClose() }}
            style={{ flex: 1, padding: '10px', border: '1px solid #dadce0', borderRadius: '8px', background: '#fff', color: '#202124', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >⧉ Clone</button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ZONE SECTION — map + full address fields  (REAL API)
═══════════════════════════════════════════════════════════ */
const zoneBlank = {
  zoneName: '',
  lat: 20.5937, lng: 78.9629,
  liveAddress: '',
  addressLine1: '', addressLine2: '',
  city: '', district: '', state: '', country: 'India', pincode: '',
  email: '', mobile: '',
}

function ZoneSection() {
  const [form, setForm] = useState(zoneBlank)
  const [saved, setSaved] = useState([])
  const [sel, setSel] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [show, setShow] = useState(true)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [geocoding, setGeocoding] = useState(false)
  const [loadingZones, setLoadingZones] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [viewZone, setViewZone] = useState(null)   // zone detail modal

  // ── cascading dropdown derived state ──
  const stateList = GEO_DATA[form.country] || []
  const districtList = DISTRICT_DATA[form.state] || []

  const loadZones = async () => {
    setLoadingZones(true)
    setLoadError(null)
    try {
      // getZones now tries zone/view for full details (lat, address, contact) for every zone
      const fresh = await getZones()
      setSaved(fresh)
    } catch (err) {
      setLoadError(err?.message || 'Failed to load saved zones')
    } finally {
      setLoadingZones(false)
    }
  }

  useEffect(() => { loadZones() }, [])

  useEffect(() => {
    window.addEventListener('zones-updated', loadZones)
    return () => window.removeEventListener('zones-updated', loadZones)
  }, [])

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => { const e = { ...p }; delete e[k]; return e }) }

  // when country changes, reset state (but keep city — user may re-type)
  const setCountry = v => setForm(p => ({ ...p, country: v, state: '', district: '' }))
  // when state changes just update state
  const setState_ = v => setForm(p => ({ ...p, state: v, district: '' }))

  const handleEdit = async item => {
    // Normalise country capitalisation for dropdown match
    const country = COUNTRY_LIST.find(c => c.toLowerCase() === str(item.country).toLowerCase()) || item.country || 'India'
    // Pre-populate immediately so UI responds fast
    setForm({ ...zoneBlank, ...item, zoneName: item.zoneName || item.zoneNameLong || '', country })
    setSel(item.id)
    // If address fields are missing, fetch full details from API
    if (!item.addressLine1 && !item.city && !item.email && !item.mobile) {
      try {
        const full = await getZoneDetails(item.id)
        if (full) {
          const fullCountry = COUNTRY_LIST.find(c => c.toLowerCase() === str(full.country).toLowerCase()) || full.country || 'India'
          setForm({ ...zoneBlank, ...full, zoneName: full.zoneName || full.zoneNameLong || '', country: fullCountry })
        }
      } catch { }
    }
  }

  const handleClone = async item => {
    try {
      const cloned = await cloneZone(item.id)
      // cloned already has zoneName from api.js fix
      const country = COUNTRY_LIST.find(c => c.toLowerCase() === str(cloned.country).toLowerCase()) || cloned.country || 'India'
      setForm({ ...zoneBlank, ...cloned, country })
      setSel(null)
    } catch (err) {
      alert(err?.message || 'Clone failed — please try again')
    }
  }

  const [errors, setErrors] = useState({})
  const handleCancel = () => { setForm(zoneBlank); setSel(null); setErrors({}) }
  const handleSave = () => {
    const errs = {}
    if (!form.zoneName) errs.zoneName = 'Zone Name is required'
    if (!form.addressLine1) errs.addressLine1 = 'Address Line 1 is required by the server'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setConfirm(true)
  }

  const reverseGeocode = async (lat, lng) => {
    setForm(p => ({ ...p, lat, lng }))
    setGeocoding(true)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
      const data = await res.json()
      const a = data.address || {}
      const rawCountry = a.country || ''
      const country = COUNTRY_LIST.find(c => c.toLowerCase() === rawCountry.toLowerCase()) || rawCountry
      setForm(p => ({
        ...p,
        liveAddress: data.display_name || '',
        addressLine1: [a.house_number, a.road].filter(Boolean).join(' '),
        addressLine2: [a.suburb, a.neighbourhood].filter(Boolean).join(', '),
        city: a.city || a.town || a.village || '',
        district: a.county || a.state_district || '',
        state: a.state || '',
        country,
        pincode: a.postcode || '',
      }))
    } catch { }
    setGeocoding(false)
  }

  const handleConfirmed = async () => {
    setBusy(true)
    try {
      if (sel) {
        await updateZone(sel, form)
      } else {
        await createZone(form)
      }
      // Always re-fetch from API — source of truth
      await loadZones()
      setSel(null)
      setForm(zoneBlank)
    } catch (err) {
      alert(err.message || 'Save failed — check console for details')
    }
    setBusy(false)
    setConfirm(false)
  }

  const handleDelete = async id => {
    try {
      // Pass full zone object so deleteZone can build a complete Postman-matching body
      const zone = saved.find(z => z.id === id)
      await deleteZone(id, zone || '')
      await loadZones()
      if (sel === id) { setForm(zoneBlank); setSel(null) }
    } catch (err) {
      alert(err?.message || 'Delete failed — please try again')
    }
  }

  const enterSel = id => { setSelectMode(true); setSelectedIds([id]) }
  const toggleSel = fn => setSelectedIds(typeof fn === 'function' ? fn : fn)
  const cancelSel = () => { setSelectMode(false); setSelectedIds([]) }
  const deleteSel = async () => {
    const ids = [...selectedIds]
    setSelectMode(false)
    setSelectedIds([])
    let failed = 0
    for (const id of ids) {
      const zone = saved.find(z => z.id === id)
      try { await deleteZone(id, zone || '') } catch { failed++ }
    }
    await loadZones()
    if (failed > 0) alert(`${failed} zone(s) could not be deleted.`)
  }

  const summary = [
    { label: 'Zone Name', value: form.zoneName },
    { label: 'Live Address', value: form.liveAddress },
    { label: 'City', value: form.city },
    { label: 'District', value: form.district },
    { label: 'State', value: form.state },
    { label: 'Country', value: form.country },
    { label: 'Pincode', value: form.pincode },
    { label: 'Mobile', value: form.mobile },
    { label: 'Email', value: form.email },
  ]

  const sectionLabel = {
    fontSize: '11px', fontWeight: 700, color: '#1a73e8', textTransform: 'uppercase',
    letterSpacing: '0.6px', margin: '6px 0 2px', borderBottom: '1px solid #e8eaed', paddingBottom: '4px',
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', overflow: 'hidden', alignItems: 'stretch' }}>
      <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />
      <ZoneDetailModal zone={viewZone} onClose={() => setViewZone(null)} onEdit={handleEdit} onClone={handleClone} />

      {/* LEFT */}
      <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 16px', paddingBottom: '16px', borderBottom: '1px solid #e8eaed' }}>
          {sel ? 'Edit Zone' : 'Create Zone'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={sectionLabel}>Zone Identity</p>
          <div>
            <TextField label={<>Zone Name <span style={{ color: '#d93025' }}>*</span></>} value={form.zoneName} onChange={v => set('zoneName', v)} placeholder="e.g. North Industrial Zone" />
            {errors.zoneName && <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#d93025' }}>{errors.zoneName}</p>}
          </div>

          <p style={sectionLabel}>
            Map Location {geocoding && <span style={{ fontWeight: 400, color: '#9aa0a6', textTransform: 'none', fontSize: '11px' }}>— fetching address…</span>}
          </p>
          <Row>
            <TextField label="Latitude" value={form.lat} onChange={v => set('lat', parseFloat(v) || 0)} type="number" />
            <TextField label="Longitude" value={form.lng} onChange={v => set('lng', parseFloat(v) || 0)} type="number" />
          </Row>
          <LocationMap lat={form.lat} lng={form.lng} onChange={reverseGeocode} />

          <p style={sectionLabel}>Address Details</p>
          <Field label="Live Address (auto-filled from map)">
            <input value={form.liveAddress} onChange={e => set('liveAddress', e.target.value)} placeholder="Drag pin or click map to auto-fill" style={iStyle} />
          </Field>
          <div>
            <TextField label={<>Address Line 1 <span style={{ color: '#d93025' }}>*</span></>} value={form.addressLine1} onChange={v => set('addressLine1', v)} placeholder="House / Building / Street" />
            {errors.addressLine1 && <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#d93025' }}>⚠ {errors.addressLine1}</p>}
          </div>
          <TextField label="Address Line 2" value={form.addressLine2} onChange={v => set('addressLine2', v)} placeholder="Area / Locality" />

          {/* ── Cascading Country → State → City ── */}
          <Row>
            <SelectField
              label="Country"
              value={form.country}
              onChange={setCountry}
              options={COUNTRY_LIST}
              placeholder="Select Country"
            />
            <SelectField
              label="State / Province"
              value={form.state}
              onChange={setState_}
              options={stateList}
              placeholder={form.country ? 'Select State' : 'Select Country first'}
            />
          </Row>
          <Row>
            {/* City is always free-text (custom) */}
            <TextField label="City (custom)" value={form.city} onChange={v => set('city', v)} placeholder="Type city name" />
            {DISTRICT_DATA[form.state] ? (
              <SelectField
                label="District"
                value={form.district}
                onChange={v => set('district', v)}
                options={DISTRICT_DATA[form.state]}
                placeholder={form.state ? 'Select District' : 'Select State first'}
              />
            ) : (
              <TextField label="District" value={form.district} onChange={v => set('district', v)} placeholder="Type district" />
            )}
          </Row>
          <Row>
            <TextField label="Pincode" value={form.pincode} onChange={v => set('pincode', v)} type="number" placeholder="6-digit pincode" />
            <div style={{ flex: 1 }} />
          </Row>

          <p style={sectionLabel}>Contact</p>
          <Row>
            <TextField label="Mobile" value={form.mobile} onChange={v => set('mobile', v)} type="tel" placeholder="+91 XXXXX XXXXX" />
            <TextField label="Email" value={form.email} onChange={v => set('email', v)} type="email" placeholder="zone@example.com" />
          </Row>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '24px', marginTop: 'auto' }}>
          {sel && <button onClick={handleCancel} style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '6px', background: '#fff', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>}
          <button onClick={handleSave} style={{ padding: '10px 32px', border: 'none', borderRadius: '6px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>{sel ? 'Update' : 'Save'}</button>
        </div>
      </div>

      {/* RIGHT */}
      <SavedPanel title="Saved Zones" items={saved} show={show} onShowToggle={() => setShow(s => !s)}
        selectMode={selectMode} selectedIds={selectedIds}
        onEnterSelect={enterSel} onToggle={toggleSel}
        onDeleteSelected={deleteSel} onCancelSelect={cancelSel}
        getItemLabel={item => item.zoneName || item.zoneNameLong || 'Zone'}
        extraHeader={
          <button
            onClick={loadZones}
            disabled={loadingZones}
            title="Refresh zones"
            style={{ background: 'none', border: '1px solid #dadce0', borderRadius: '4px', cursor: loadingZones ? 'wait' : 'pointer', fontSize: '13px', padding: '2px 6px', color: '#5f6368', flexShrink: 0 }}
          >{loadingZones ? '⏳' : '↻'}</button>
        }
        statusBanner={
          loadingZones ? (
            <div style={{ padding: '10px 14px', fontSize: '12px', color: '#1a73e8', background: '#e8f0fe', borderBottom: '1px solid #c6dafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Loading saved zones…
            </div>
          ) : loadError ? (
            <div style={{ padding: '10px 14px', fontSize: '12px', color: '#d93025', background: '#fce8e6', borderBottom: '1px solid #f5c6c2', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⚠ {loadError} — <span onClick={loadZones} style={{ cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}>Retry</span>
            </div>
          ) : null
        }
        renderCard={(item, idx) => (
          <>
            {/* ── Card header row ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div onClick={() => setViewZone(item)} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0, cursor: 'pointer' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: COLORS[idx % COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: '#fff', flexShrink: 0 }}>🗺</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {str(item.zoneName || item.zoneNameLong) || 'Zone'}
                </div>
              </div>
              <div onClick={e => e.stopPropagation()}>
                <CardMenu onSelect={() => enterSel(item.id)} onClone={() => handleClone(item)} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id)} />
              </div>
            </div>

            {/* ── All params as label:value rows ── */}
            {(() => {
              const rows = [
                { label: 'Lat / Lon', value: (item.lat && item.lng) ? `${item.lat}, ${item.lng}` : '' },
                { label: 'Address 1', value: item.addressLine1 },
                { label: 'Address 2', value: item.addressLine2 },
                { label: 'City', value: item.city },
                { label: 'District', value: item.district },
                { label: 'State', value: item.state },
                { label: 'Country', value: item.country },
                { label: 'Pincode', value: item.pincode },
                { label: 'Mobile', value: item.mobile },
                { label: 'Email', value: item.email },
              ].filter(r => str(r.value).trim() && str(r.value).trim() !== '-' && str(r.value).trim() !== '0')
              if (rows.length === 0) return (
                <div onClick={() => setViewZone(item)} style={{ fontSize: '11px', color: '#bbb', fontStyle: 'italic', cursor: 'pointer' }}>Tap to view details</div>
              )
              return (
                <div onClick={() => setViewZone(item)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {rows.map(r => (
                    <div key={r.label} style={{ display: 'flex', gap: '6px', fontSize: '11px', lineHeight: 1.4 }}>
                      <span style={{ width: '68px', flexShrink: 0, color: '#9aa0a6', fontWeight: 600, textTransform: 'uppercase', fontSize: '10px', paddingTop: '1px' }}>{r.label}</span>
                      <span style={{ color: '#3c4043', wordBreak: 'break-all' }}>{str(r.value)}</span>
                    </div>
                  ))}
                </div>
              )
            })()}
          </>
        )}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TRIP TYPE — single field
═══════════════════════════════════════════════════════════ */
const ttBlank = { typeName: '' }

function TripTypeSection() {
  const [form, setForm] = useState(ttBlank)
  const [saved, setSaved] = useState([])
  const [sel, setSel] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [show, setShow] = useState(true)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [errors, setErrors] = useState({})

  // ✅ FIX: Centralized loader — always fetches fresh from API
  const loadData = async () => {
    try { setSaved(await getTripTypes()) } catch { }
  }

  useEffect(() => { loadData() }, [])

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => { const e = { ...p }; delete e[k]; return e }) }
  const handleEdit = item => { setForm({ typeName: item.typeName || '' }); setSel(item.id); setErrors({}) }
  const handleClone = item => { setForm({ typeName: item.typeName || '' }); setSel(null); setErrors({}) }
  const handleCancel = () => { setForm(ttBlank); setSel(null); setErrors({}) }
  const handleSave = () => { if (!form.typeName) return; setConfirm(true) }

  const handleConfirmed = async () => {
    setBusy(true)
    try {
      if (sel) {
        await updateTripType(sel, { typeName: form.typeName })
      } else {
        await createTripType({ typeName: form.typeName })
      }
      // ✅ FIX: Re-fetch from API immediately — no more stale local state
      await loadData()
      setSel(null)
      setForm(ttBlank)
    } catch (err) {
      alert(err?.message || 'Save failed')
    }
    setBusy(false)
    setConfirm(false)
  }

  const handleDelete = async id => {
    try {
      await deleteTripType(id)
      await loadData()
      if (sel === id) { setForm(ttBlank); setSel(null) }
    } catch (err) {
      alert(err?.message || 'Delete failed — please try again')
    }
  }

  const enterSel = id => { setSelectMode(true); setSelectedIds([id]) }
  const toggleSel = fn => setSelectedIds(typeof fn === 'function' ? fn : fn)
  const cancelSel = () => { setSelectMode(false); setSelectedIds([]) }
  const deleteSel = async () => {
    let failed = 0
    for (const id of selectedIds) { try { await deleteTripType(id) } catch { failed++ } }
    // ✅ FIX: Re-fetch after bulk delete
    await loadData()
    setSelectMode(false)
    setSelectedIds([])
    if (failed > 0) alert(`${failed} trip type(s) could not be deleted.`)
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', overflow: 'hidden', alignItems: 'stretch' }}>
      <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={[{ label: 'Trip Type', value: form.typeName }]} />

      {/* LEFT */}
      <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px', paddingBottom: '16px', borderBottom: '1px solid #e8eaed' }}>
          {sel ? 'Edit Trip Type' : 'Add Trip Type'}
        </h2>
        <TextField label="Trip Type Name" value={form.typeName} onChange={v => set('typeName', v)} placeholder="e.g. Day Patrol, Night Round, Emergency" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '24px', marginTop: 'auto' }}>
          {sel && <button onClick={handleCancel} style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '6px', background: '#fff', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>}
          <button onClick={handleSave} style={{ padding: '10px 32px', border: 'none', borderRadius: '6px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>{sel ? 'Update' : 'Save'}</button>
        </div>
      </div>

      {/* RIGHT */}
      <SavedPanel title="Trip Types" items={saved} show={show} onShowToggle={() => setShow(s => !s)}
        selectMode={selectMode} selectedIds={selectedIds}
        onEnterSelect={enterSel} onToggle={toggleSel}
        onDeleteSelected={deleteSel} onCancelSelect={cancelSel}
        getItemLabel={item => item.typeName || 'Trip Type'}
        renderCard={(item, idx) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: COLORS[idx % COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#fff', flexShrink: 0 }}>🚦</div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#202124' }}>{item.typeName}</span>
            </div>
            <CardMenu onSelect={() => enterSel(item.id)} onClone={() => handleClone(item)} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id)} />
          </div>
        )}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PATROL TYPE — single field
═══════════════════════════════════════════════════════════ */
const ptBlank = { patrolName: '' }

function PatrolTypeSection() {
  const [form, setForm] = useState(ptBlank)
  const [saved, setSaved] = useState([])
  const [sel, setSel] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [show, setShow] = useState(true)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [errors, setErrors] = useState({})
  const [searching, setSearching] = useState(false)

  // ✅ Load all patrol types on mount
  const loadData = async () => {
    try { setSaved(await getPatrolTypes()) } catch { }
  }

  useEffect(() => { loadData() }, [])

  // ✅ Real API filter search — called from SavedPanel via onSearch
  const handleSearch = async (query) => {
    setSearching(true)
    try {
      const results = await filterPatrolTypes(query && query.trim() ? query.trim() : 'all')
      setSaved(results)
    } catch {
      // fallback: keep existing list
    } finally {
      setSearching(false)
    }
  }

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => { const e = { ...p }; delete e[k]; return e }) }
  const handleEdit = item => { setForm({ patrolName: item.patrolName || item.typeName || '' }); setSel(item.id); setErrors({}) }
  const handleClone = item => { setForm({ patrolName: item.patrolName || item.typeName || '' }); setSel(null); setErrors({}) }
  const handleCancel = () => { setForm(ptBlank); setSel(null); setErrors({}) }
  const handleSave = () => { if (!form.patrolName) return; setConfirm(true) }

  const handleConfirmed = async () => {
    setBusy(true)
    try {
      if (sel) {
        await updatePatrolType(sel, { patrolName: form.patrolName })
      } else {
        await createPatrolType({ patrolName: form.patrolName })
      }
      // ✅ FIX: Re-fetch from API immediately
      await loadData()
      setSel(null)
      setForm(ptBlank)
    } catch (err) {
      alert(err?.message || 'Save failed')
    }
    setBusy(false)
    setConfirm(false)
  }

  const handleDelete = async id => {
    try {
      await deletePatrolType(id)
      await loadData()
      if (sel === id) { setForm(ptBlank); setSel(null) }
    } catch (err) {
      alert(err?.message || 'Delete failed — please try again')
    }
  }

  const enterSel = id => { setSelectMode(true); setSelectedIds([id]) }
  const toggleSel = fn => setSelectedIds(typeof fn === 'function' ? fn : fn)
  const cancelSel = () => { setSelectMode(false); setSelectedIds([]) }
  const deleteSel = async () => {
    let failed = 0
    for (const id of selectedIds) { try { await deletePatrolType(id) } catch { failed++ } }
    // ✅ FIX: Re-fetch after bulk delete
    await loadData()
    setSelectMode(false)
    setSelectedIds([])
    if (failed > 0) alert(`${failed} patrol type(s) could not be deleted.`)
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', overflow: 'hidden', alignItems: 'stretch' }}>
      <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={[{ label: 'Patrol Name', value: form.patrolName }]} />

      {/* LEFT */}
      <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px', paddingBottom: '16px', borderBottom: '1px solid #e8eaed' }}>
          {sel ? 'Edit Patrol Type' : 'Add Patrol Type'}
        </h2>
        <TextField label="Patrol Name" value={form.patrolName} onChange={v => set('patrolName', v)} placeholder="e.g. Foot Patrol, Vehicle Patrol" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '24px', marginTop: 'auto' }}>
          {sel && <button onClick={handleCancel} style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '6px', background: '#fff', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>}
          <button onClick={handleSave} style={{ padding: '10px 32px', border: 'none', borderRadius: '6px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>{sel ? 'Update' : 'Save'}</button>
        </div>
      </div>

      {/* RIGHT */}
      <SavedPanel title="Patrol Types" items={saved} show={show} onShowToggle={() => setShow(s => !s)}
        selectMode={selectMode} selectedIds={selectedIds}
        onEnterSelect={enterSel} onToggle={toggleSel}
        onDeleteSelected={deleteSel} onCancelSelect={cancelSel}
        onSearch={handleSearch} searchLoading={searching}
        getItemLabel={item => item.patrolName || item.typeName || 'Patrol Type'}
        renderCard={(item, idx) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: COLORS[idx % COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#fff', flexShrink: 0 }}>🔖</div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#202124' }}>{item.patrolName || item.typeName}</span>
            </div>
            <CardMenu onSelect={() => enterSel(item.id)} onClone={() => handleClone(item)} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id)} />
          </div>
        )}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   DESIGNATION — single input, persisted via real API
═══════════════════════════════════════════════════════════ */
const desigBlank = { designationName: '' }

function DesignationSection() {
  const [form, setForm] = useState(desigBlank)
  const [saved, setSaved] = useState([])
  const [sel, setSel] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [show, setShow] = useState(true)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [errors, setErrors] = useState({})
  const [searching, setSearching] = useState(false)

  //  FIX: Centralized loader
  const loadData = async () => {
<<<<<<< HEAD
    try { 
      const res=await getDesignations()
      setSaved(res) } catch { }
=======
    try {
      const res = await getDesignations()
      setSaved(res)
    } catch (err) {
      console.error(err)
    }
>>>>>>> 79db11b5e6cc4a72f98e9d5e0cf751a80350ebb7
  }

  useEffect(() => { loadData() }, [])

  //  Real API filter search
  const handleSearch = async (query) => {
    setSearching(true)
    try {
      const results = await filterDesignations(query?.trim() || 'all')

      const formatted = results.map(r => ({
        id: r.value,
        designationName: r.label
      }))

      setSaved(formatted)

    } finally {
      setSearching(false)
    }
  }

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => { const e = { ...p }; delete e[k]; return e }) }
  const handleEdit = item => { setForm({ designationName: item.designationName }); setSel(item.id); setErrors({}) }
  const handleClone = item => { setForm({ designationName: item.designationName }); setSel(null); setErrors({}) }
  const handleCancel = () => { setForm(desigBlank); setSel(null); setErrors({}) }
  const handleSave = () => { if (!form.designationName) return; setConfirm(true) }

  const handleConfirmed = async () => {
    setBusy(true)
    try {
      if (sel) {
        await updateDesignation(sel, form)
      } else {
        await createDesignation(form)
      }
      await loadData()
      setSel(null)
      setForm(desigBlank)
    } catch (err) {
      alert(err?.message || 'Save failed')
    }
    setBusy(false)
    setConfirm(false)
  }

  const handleDelete = async id => {
    try {
      await deleteDesignation(id)
      await loadData()
      if (sel === id) { setForm(desigBlank); setSel(null) }
    } catch (err) {
      alert(err?.message || 'Delete failed — please try again')
    }
  }

  const enterSel = id => { setSelectMode(true); setSelectedIds([id]) }
  const toggleSel = fn => setSelectedIds(typeof fn === 'function' ? fn : fn)
  const cancelSel = () => { setSelectMode(false); setSelectedIds([]) }
  const deleteSel = async () => {
    let failed = 0
    for (const id of selectedIds) { try { await deleteDesignation(id) } catch { failed++ } }
    await loadData()
    setSelectMode(false)
    setSelectedIds([])
    if (failed > 0) alert(`${failed} designation(s) could not be deleted.`)
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', overflow: 'hidden', alignItems: 'stretch' }}>
      <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={[{ label: 'Designation', value: form.designationName }]} />

      {/* LEFT */}
      <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px', paddingBottom: '16px', borderBottom: '1px solid #e8eaed' }}>
          {sel ? 'Edit Designation' : 'Add Designation'}
        </h2>
        <TextField label="Designation Name" value={form.designationName} onChange={v => set('designationName', v)} placeholder="e.g. Security Guard, Supervisor" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '24px', marginTop: 'auto' }}>
          {sel && <button onClick={handleCancel} style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '6px', background: '#fff', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>}
          <button onClick={handleSave} style={{ padding: '10px 32px', border: 'none', borderRadius: '6px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>{sel ? 'Update' : 'Save'}</button>
        </div>
      </div>

      {/* RIGHT */}
      <SavedPanel title="Designations" items={saved} show={show} onShowToggle={() => setShow(s => !s)}
        selectMode={selectMode} selectedIds={selectedIds}
        onEnterSelect={enterSel} onToggle={toggleSel}
        onDeleteSelected={deleteSel} onCancelSelect={cancelSel}
        onSearch={handleSearch} searchLoading={searching}
        getItemLabel={item => item.designationName || 'Designation'}
        renderCard={(item, idx) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: COLORS[idx % COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#fff', flexShrink: 0 }}>🏷</div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#202124' }}>{item.designationName}</span>
            </div>
            <CardMenu onSelect={() => enterSel(item.id)} onClone={() => handleClone(item)} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id)} />
          </div>
        )}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   DEPARTMENT — single input, persisted via real API
═══════════════════════════════════════════════════════════ */
const deptBlank = { departmentName: '' }

function DepartmentSection() {
  const [form, setForm] = useState(deptBlank)
  const [saved, setSaved] = useState([])
  const [sel, setSel] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [show, setShow] = useState(true)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [errors, setErrors] = useState({})
  const [searching, setSearching] = useState(false)

  // ✅ FIX: Centralized loader
  const loadData = async () => {
<<<<<<< HEAD
    try { setSaved(await getDepartments()) } catch { }
=======
    try { 
      setSaved(await getDepartments()) 
    } catch {
      
     }
>>>>>>> 79db11b5e6cc4a72f98e9d5e0cf751a80350ebb7
  }

  useEffect(() => { loadData() }, [])

  // ✅ Real API filter search
  const handleSearch = async (query) => {
    setSearching(true)
    try {
      const results = await filterDepartments(query && query.trim() ? query.trim() : 'all')
      setSaved(results)
    } catch {
      // fallback: keep existing list
    } finally {
      setSearching(false)
    }
  }

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => { const e = { ...p }; delete e[k]; return e }) }
  const handleEdit = item => { setForm({ departmentName: item.departmentName }); setSel(item.id); setErrors({}) }
  const handleClone = item => { setForm({ departmentName: item.departmentName }); setSel(null); setErrors({}) }
  const handleCancel = () => { setForm(deptBlank); setSel(null); setErrors({}) }
  const handleSave = () => { if (!form.departmentName) return; setConfirm(true) }

  const handleConfirmed = async () => {
    setBusy(true)
    try {
      if (sel) {
        await updateDepartment(sel, form)
      } else {
        await createDepartment(form)
      }
      // ✅ FIX: Re-fetch from API immediately
      await loadData()
      setSel(null)
      setForm(deptBlank)
    } catch (err) {
      alert(err?.message || 'Save failed')
    }
    setBusy(false)
    setConfirm(false)
  }

  const handleDelete = async id => {
    try {
      await deleteDepartment(id)
      await loadData()
      if (sel === id) { setForm(deptBlank); setSel(null) }
    } catch (err) {
      alert(err?.message || 'Delete failed — please try again')
    }
  }

  const enterSel = id => { setSelectMode(true); setSelectedIds([id]) }
  const toggleSel = fn => setSelectedIds(typeof fn === 'function' ? fn : fn)
  const cancelSel = () => { setSelectMode(false); setSelectedIds([]) }
  const deleteSel = async () => {
    let failed = 0
    for (const id of selectedIds) { try { await deleteDepartment(id) } catch { failed++ } }
    await loadData()
    setSelectMode(false)
    setSelectedIds([])
    if (failed > 0) alert(`${failed} department(s) could not be deleted.`)
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', overflow: 'hidden', alignItems: 'stretch' }}>
      <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={[{ label: 'Department', value: form.departmentName }]} />

      {/* LEFT */}
      <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px', paddingBottom: '16px', borderBottom: '1px solid #e8eaed' }}>
          {sel ? 'Edit Department' : 'Add Department'}
        </h2>
        <TextField label="Department Name" value={form.departmentName} onChange={v => set('departmentName', v)} placeholder="e.g. Operations, HR, Security" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '24px', marginTop: 'auto' }}>
          {sel && <button onClick={handleCancel} style={{ padding: '10px 20px', border: '1px solid #dadce0', borderRadius: '6px', background: '#fff', color: '#202124', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>}
          <button onClick={handleSave} style={{ padding: '10px 32px', border: 'none', borderRadius: '6px', background: '#1e8e3e', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>{sel ? 'Update' : 'Save'}</button>
        </div>
      </div>

      {/* RIGHT */}
      <SavedPanel title="Departments" items={saved} show={show} onShowToggle={() => setShow(s => !s)}
        selectMode={selectMode} selectedIds={selectedIds}
        onEnterSelect={enterSel} onToggle={toggleSel}
        onDeleteSelected={deleteSel} onCancelSelect={cancelSel}
        onSearch={handleSearch} searchLoading={searching}
        getItemLabel={item => item.departmentName || 'Department'}
        renderCard={(item, idx) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: COLORS[idx % COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#fff', flexShrink: 0 }}>🏢</div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#202124' }}>{item.departmentName}</span>
            </div>
            <CardMenu onSelect={() => enterSel(item.id)} onClone={() => handleClone(item)} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id)} />
          </div>
        )}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   OTHERS FORM — top-level with sub-tabs
═══════════════════════════════════════════════════════════ */
const SUB_TABS = [
  { key: 'zone', label: 'Zones', icon: '🗺' },
  { key: 'patroltype', label: 'Patrol Types', icon: '🔖' },
  { key: 'designation', label: 'Designations', icon: '🏷' },
  { key: 'department', label: 'Departments', icon: '🏢' },
]

export default function OthersForm() {
  const [active, setActive] = useState('zone')

  const Comp = {
    zone: ZoneSection,
    patroltype: PatrolTypeSection,
    designation: DesignationSection,
    department: DepartmentSection,
  }[active]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      {/* Sub-tab bar */}
      <div style={{ display: 'flex', gap: '6px', padding: '10px 16px', borderBottom: '1px solid #e8eaed', background: '#fafbfc', flexShrink: 0, flexWrap: 'wrap' }}>
        {SUB_TABS.map(({ key, label, icon }) => (
          <button key={key} onClick={() => setActive(key)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '6px', border: active === key ? 'none' : '1px solid #dadce0', background: active === key ? '#1a73e8' : '#fff', color: active === key ? '#fff' : '#5f6368', fontSize: '12px', fontWeight: active === key ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
            <span style={{ fontSize: '13px' }}>{icon}</span> {label}
          </button>
        ))}
      </div>
      {/* Active sub-form */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Comp />
      </div>
    </div>
  )
}