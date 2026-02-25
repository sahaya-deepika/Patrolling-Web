import { Input, Button, Dropdown, IconButton, DatePicker } from 'rsuite'
import PlusIcon         from '@rsuite/icons/Plus'
import MoreIcon         from '@rsuite/icons/More'
import EditIcon         from '@rsuite/icons/Edit'
import TrashIcon        from '@rsuite/icons/Trash'
import CheckOutlineIcon from '@rsuite/icons/CheckOutline'
import AttachmentIcon   from '@rsuite/icons/Attachment'
import CopyIcon         from '@rsuite/icons/Copy'
import PeopleFillIcon   from '@rsuite/icons/Member'
import LocationIcon     from '@rsuite/icons/Location'
import ArrowRightIcon   from '@rsuite/icons/ArrowRight'
import TaskIcon         from '@rsuite/icons/Task'
import CalendarIcon     from '@rsuite/icons/Calendar'
import NoticeIcon       from '@rsuite/icons/Notice'
import CloseIcon        from '@rsuite/icons/Close'

export const Icons = {
  Plus: PlusIcon, Copy: CopyIcon, Check: CheckOutlineIcon, Attachment: AttachmentIcon,
  Bell: NoticeIcon, People: PeopleFillIcon, Calendar: CalendarIcon,
  ArrowRight: ArrowRightIcon, Task: TaskIcon, Location: LocationIcon,
  Schedule: CalendarIcon, Edit: EditIcon, Trash: TrashIcon, Close: CloseIcon,
}

const inputStyle = {
  borderRadius: 8, borderColor: '#e5e7eb',
  background: '#fff', fontSize: 13, height: 38,
}

const pickerBlockStyle = { width: '100%' }

/* ── Text input ────────────────────────────────────────── */
export const MfInput = ({ placeholder, value, onChange, type = 'text' }) => (
  <Input type={type} placeholder={placeholder} value={value} onChange={onChange} style={inputStyle} />
)

/* ── Date picker  (stores/returns 'YYYY-MM-DD' string) ─── */
export const MfDatePicker = ({ placeholder, value, onChange }) => {
  const toDate = (str) => { if (!str) return null; const d = new Date(str); return isNaN(d) ? null : d }
  const toStr  = (date) => {
    if (!date) return ''
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  return (
    <DatePicker
      block oneTap
      placeholder={placeholder || 'Select date'}
      value={toDate(value)}
      onChange={(d) => onChange(toStr(d))}
      format="dd/MM/yyyy"
      style={pickerBlockStyle}
      size="sm"
    />
  )
}

/* ── Time picker  (stores/returns 'HH:mm' string) ───────── */
export const MfTimePicker = ({ placeholder, value, onChange }) => {
  const toDate = (str) => {
    if (!str) return null
    const [h, m] = str.split(':').map(Number)
    const d = new Date(); d.setHours(h, m, 0, 0); return d
  }
  const toStr = (date) => {
    if (!date) return ''
    return `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`
  }
  return (
    <DatePicker
      block
      placeholder={placeholder || 'Select time'}
      value={toDate(value)}
      onChange={(d) => onChange(toStr(d))}
      format="HH:mm"
      hideMinutes={(s) => s % 5 !== 0}
      style={pickerBlockStyle}
      size="sm"
    />
  )
}

/* ── Input + ➕ dropdown ─────────────────────────────────── */
export const InputWithPlus = ({ placeholder, value, onChange, options = ['Option 1','Option 2','Option 3'] }) => (
  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
    <Input placeholder={placeholder} value={value} onChange={onChange} style={inputStyle} />
    <Dropdown
      placement="bottomEnd"
      renderToggle={(props, ref) => (
        <IconButton
          ref={ref} {...props}
          icon={<PlusIcon style={{ fontSize:12, color:'#fff' }} />}
          size="xs"
          style={{ width:26, height:26, borderRadius:'50%', background:'#2563eb', border:'none', flexShrink:0 }}
        />
      )}
    >
      {options.map(opt => <Dropdown.Item key={opt} onSelect={() => onChange?.(opt)}>{opt}</Dropdown.Item>)}
    </Dropdown>
  </div>
)

/* ── Toggle button ──────────────────────────────────────── */
export const ToggleBtn = ({ label, active, onClick }) => (
  <Button onClick={onClick} style={{
    flex:1, borderRadius:8, fontWeight:600, fontSize:13, height:36,
    background: active ? '#2563eb' : '#f3f4f6',
    color: active ? '#fff' : '#374151', border:'none',
  }}>
    {label}
  </Button>
)

/* ── Save / Save-changes bar ────────────────────────────── */
export const SaveBtn = ({ onClick, loading, isEditing, onCancelEdit }) => (
  <div className="mf-save-wrap">
    {isEditing && (
      <Button appearance="subtle" onClick={onCancelEdit} style={{
        borderRadius:8, padding:'8px 20px', fontWeight:600, fontSize:13,
        border:'1px solid #e5e7eb', color:'#6b7280',
      }}>
        Cancel
      </Button>
    )}
    <Button appearance="primary" onClick={onClick} loading={loading} style={{
      background: isEditing ? '#2563eb' : '#16a34a',
      border:'none', borderRadius:8, padding:'8px 28px',
      fontWeight:600, fontSize:14, color:'#fff',
    }}>
      {isEditing ? 'Save Changes' : 'Save'}
    </Button>
  </div>
)

/* ── CRUD 3-dot menu ────────────────────────────────────── */
export const CrudMenu = ({ onSelect, onDelete, onApply }) => (
  <Dropdown
    placement="bottomEnd"
    renderToggle={(props, ref) => (
      <IconButton ref={ref} {...props} icon={<MoreIcon />} size="xs" appearance="subtle" style={{ borderRadius:'50%' }} />
    )}
  >
    <Dropdown.Item icon={<EditIcon />} onSelect={onSelect}>Select</Dropdown.Item>
    <Dropdown.Item icon={<TrashIcon style={{ color:'#ef4444' }} />} onSelect={onDelete} style={{ color:'#ef4444' }}>Delete</Dropdown.Item>
    <Dropdown.Item icon={<CheckOutlineIcon style={{ color:'#16a34a' }} />} onSelect={onApply} style={{ color:'#16a34a' }}>Apply</Dropdown.Item>
  </Dropdown>
)

/* ── Saved-panel header ─────────────────────────────────── */
export const SavedPanelHeader = ({ title, onCopy }) => (
  <div className="mf-saved-header">
    <span>{title}</span>
    <IconButton icon={<CopyIcon />} size="xs" appearance="subtle" onClick={onCopy} />
  </div>
)

/* ── Pill badge ─────────────────────────────────────────── */
export const Pill = ({ children, color = 'blue' }) => {
  const colorMap = {
    blue:'#dbeafe:#1d4ed8', green:'#dcfce7:#15803d',
    yellow:'#fef9c3:#92400e', gray:'#f3f4f6:#6b7280', orange:'#ffedd5:#c2410c',
  }
  const [bg, tc] = (colorMap[color] || colorMap.blue).split(':')
  return (
    <span style={{ display:'inline-block', padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:600, background:bg, color:tc, whiteSpace:'nowrap' }}>
      {children}
    </span>
  )
}

export const SectionLabel = ({ children }) => <div className="mf-section-label">{children}</div>

export const IconCircle = ({ color = 'blue', children }) => {
  const bg = { blue:'#dbeafe', green:'#dcfce7', gray:'#f3f4f6' }[color] || '#dbeafe'
  return (
    <div style={{ width:20, height:20, borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      {children}
    </div>
  )
}

/* ── Image upload row ───────────────────────────────────── */
export const ImageUpload = ({ value, onChange }) => (
  <label className="mf-image-upload">
    <span style={{ fontSize:13, color: value ? '#374151' : '#9ca3af' }}>
      {value ? value.name : 'Add image'}
    </span>
    <AttachmentIcon style={{ color:'#9ca3af' }} />
    <input type="file" accept="image/*" hidden onChange={e => onChange(e.target.files[0])} />
  </label>
)