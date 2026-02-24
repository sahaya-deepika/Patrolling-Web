
import { Input, Button, Dropdown, IconButton, Tag, Checkbox } from 'rsuite'
import PlusIcon       from '@rsuite/icons/Plus'
import MoreIcon       from '@rsuite/icons/More'
import EditIcon       from '@rsuite/icons/Edit'
import TrashIcon      from '@rsuite/icons/Trash'
import CheckOutlineIcon from '@rsuite/icons/CheckOutline'
import AttachmentIcon from '@rsuite/icons/Attachment'
import CopyIcon       from '@rsuite/icons/Copy'
import PeopleFillIcon from '@rsuite/icons/Member'
import LocationIcon   from '@rsuite/icons/Location'
import ArrowRightIcon from '@rsuite/icons/ArrowRight'
import TaskIcon       from '@rsuite/icons/Task'
import CalendarIcon   from '@rsuite/icons/Calendar'
import NoticeIcon     from '@rsuite/icons/Notice'

export const Icons = {
  Plus: PlusIcon, Copy: CopyIcon, Check: CheckOutlineIcon, Attachment: AttachmentIcon,
  Bell: NoticeIcon, People: PeopleFillIcon, Calendar: CalendarIcon,
  ArrowRight: ArrowRightIcon, Task: TaskIcon, Location: LocationIcon,
  Schedule: CalendarIcon, Edit: EditIcon, Trash: TrashIcon,
}

export const MfInput = ({ placeholder, value, onChange, type='text' }) => (
  <Input type={type} placeholder={placeholder} value={value} onChange={onChange}
    style={{ borderRadius: 8, borderColor: '#e5e7eb', background: '#f9fafb', fontSize: 13 }} />
)

export const NativeInput = ({ placeholder, value, onChange, type='text' }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange}
    style={{ width:'100%', borderRadius:8, border:'1px solid #e5e7eb', background:'#f9fafb', fontSize:13, color:'#374151', padding:'8px 12px', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }} />
)

// + button that opens dropdown with 3 options
export const InputWithPlus = ({ placeholder, value, onChange, options = ['Option 1','Option 2','Option 3'] }) => (
  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
    <Input placeholder={placeholder} value={value} onChange={onChange}
      style={{ borderRadius:8, borderColor:'#e5e7eb', background:'#f9fafb', fontSize:13 }} />
    <Dropdown
      placement="bottomEnd"
      renderToggle={(props, ref) => (
        <button ref={ref} {...props}
          style={{ width:26, height:26, borderRadius:'50%', background:'#2563eb', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
          <PlusIcon style={{ fontSize:12, color:'#fff' }} />
        </button>
      )}
    >
      {options.map(opt => (
        <Dropdown.Item key={opt} onSelect={() => onChange?.(opt)}>{opt}</Dropdown.Item>
      ))}
    </Dropdown>
  </div>
)

export const ToggleBtn = ({ label, active, onClick }) => (
  <Button onClick={onClick} style={{ flex:1, borderRadius:8, fontWeight:600, fontSize:13,
    background: active ? '#2563eb' : '#f3f4f6', color: active ? '#fff' : '#374151', border:'none' }}>
    {label}
  </Button>
)

export const SaveBtn = ({ onClick, loading }) => (
  <div className="mf-save-wrap">
    <Button appearance="primary" onClick={onClick} loading={loading}
      style={{ background:'#16a34a', border:'none', borderRadius:8, padding:'8px 32px', fontWeight:600, fontSize:14, color:'#fff' }}>
      Save
    </Button>
  </div>
)

// CRUD 3-dot dropdown
export const CrudMenu = ({ onSelect, onDelete, onApply }) => (
  <Dropdown
    placement="bottomEnd"
    renderToggle={(props, ref) => (
      <IconButton ref={ref} {...props} icon={<MoreIcon />} size="xs" appearance="subtle"
        style={{ borderRadius:'50%' }} />
    )}
  >
    <Dropdown.Item icon={<CheckOutlineIcon />} onSelect={onSelect}>Select</Dropdown.Item>
    <Dropdown.Item icon={<TrashIcon style={{ color:'#ef4444' }} />} onSelect={onDelete} style={{ color:'#ef4444' }}>Delete</Dropdown.Item>
    <Dropdown.Item icon={<CheckOutlineIcon style={{ color:'#16a34a' }} />} onSelect={onApply} style={{ color:'#16a34a' }}>Apply</Dropdown.Item>
  </Dropdown>
)

export const SavedPanelHeader = ({ title }) => (
  <div className="mf-saved-header">
    <span>{title}</span>
    <IconButton icon={<CopyIcon />} size="xs" appearance="subtle" />
  </div>
)

export const Pill = ({ children, color='blue' }) => {
  const colorMap = { blue:'#dbeafe:#1d4ed8', green:'#dcfce7:#15803d', yellow:'#fef9c3:#92400e', gray:'#f3f4f6:#6b7280', orange:'#ffedd5:#c2410c' }
  const [bg, tc] = (colorMap[color] || colorMap.blue).split(':')
  return <span style={{ display:'inline-block', padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:600, background:bg, color:tc }}>{children}</span>
}

export const SectionLabel = ({ children }) => (
  <div className="mf-section-label">{children}</div>
)

export const IconCircle = ({ color='blue', children }) => {
  const bg = { blue:'#dbeafe', green:'#dcfce7', gray:'#f3f4f6' }[color] || '#dbeafe'
  return <div style={{ width:20, height:20, borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{children}</div>
}