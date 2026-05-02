// import { useState, useRef } from 'react'
// import { Input, Button, Dropdown, IconButton, DatePicker, Modal, Checkbox } from 'rsuite'
// import { FiPlus, FiCopy, FiEdit2, FiTrash2, FiMoreVertical, FiCheck, FiX, FiUpload, FiAlertCircle } from 'react-icons/fi'
// import { MdPeople, MdLocationOn, MdArrowForward, MdTask, MdEvent, MdNotifications } from 'react-icons/md'

// /* ── ICONS EXPORT ───────────────────────────────────────────── */
// export const Icons = {
//   Plus:       FiPlus,
//   Copy:       FiCopy,
//   Edit:       FiEdit2,
//   Trash:      FiTrash2,
//   More:       FiMoreVertical,
//   Check:      FiCheck,
//   Close:      FiX,
//   Upload:     FiUpload,
//   Bell:       MdNotifications,
//   People:     MdPeople,
//   Calendar:   MdEvent,
//   ArrowRight: MdArrowForward,
//   Task:       MdTask,
//   Location:   MdLocationOn,
//   Schedule:   MdEvent,
//   Alert:      FiAlertCircle,
// }

// /* ── COMMON STYLES ──────────────────────────────────────────── */
// const inputStyle = {
//   borderRadius: 8,
//   border: '1px solid var(--gf-input-border)',
//   background: 'var(--gf-input-bg)',
//   fontSize: 14,
//   height: 44,
//   color: 'var(--gf-text-primary)',
//   transition: 'all 0.2s ease',
// }

// const pickerBlockStyle = { width: '100%' }

// /* ── TEXT INPUT ─────────────────────────────────────────────── */
// export const GfInput = ({ placeholder, value, onChange, type = 'text', label }) => (
//   <div style={{ width: '100%' }}>
//     {label && <div className="gf-input-label">{label}</div>}
//     <Input
//       type={type}
//       placeholder={placeholder}
//       value={value}
//       onChange={onChange}
//       style={inputStyle}
//     />
//   </div>
// )

// /* ── DATE PICKER ────────────────────────────────────────────── */
// export const GfDatePicker = ({ placeholder, value, onChange, label }) => {
//   const toDate = (str) => {
//     if (!str) return null
//     const d = new Date(str)
//     return isNaN(d) ? null : d
//   }
//   const toStr = (date) => {
//     if (!date) return ''
//     const y = date.getFullYear()
//     const m = String(date.getMonth() + 1).padStart(2, '0')
//     const d = String(date.getDate()).padStart(2, '0')
//     return `${y}-${m}-${d}`
//   }
//   return (
//     <div style={{ width: '100%' }}>
//       {label && <div className="gf-input-label">{label}</div>}
//       <DatePicker
//         block
//         oneTap
//         placeholder={placeholder || 'Select date'}
//         value={toDate(value)}
//         onChange={(d) => onChange(toStr(d))}
//         format="dd/MM/yyyy"
//         style={pickerBlockStyle}
//         size="md"
//         container={() => document.body}
//         placement="autoVerticalStart"
//         preventOverflow
//       />
//     </div>
//   )
// }

// /* ── TIME PICKER ────────────────────────────────────────────── */
// export const GfTimePicker = ({ placeholder, value, onChange, label }) => {
//   const toDate = (str) => {
//     if (!str) return null
//     const [h, m] = str.split(':').map(Number)
//     const d = new Date()
//     d.setHours(h, m, 0, 0)
//     return d
//   }
//   const toStr = (date) => {
//     if (!date) return ''
//     return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
//   }
//   return (
//     <div style={{ width: '100%' }}>
//       {label && <div className="gf-input-label">{label}</div>}
//       <DatePicker
//         block
//         placeholder={placeholder || 'Select time'}
//         value={toDate(value)}
//         onChange={(d) => onChange(toStr(d))}
//         format="hh:mm a"
//         hideMinutes={(s) => s % 5 !== 0}
//         style={pickerBlockStyle}
//         size="md"
//         container={() => document.body}
//         placement="autoVerticalStart"
//         preventOverflow
//       />
//     </div>
//   )
// }

// /* ── INPUT WITH PLUS DROPDOWN ───────────────────────────────── */
// export const InputWithPlus = ({
//   placeholder,
//   value,
//   onChange,
//   options = ['Option 1', 'Option 2', 'Option 3'],
//   label,
// }) => (
//   <div style={{ width: '100%' }}>
//     {label && <div className="gf-input-label">{label}</div>}
//     <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//       <Input
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         style={inputStyle}
//       />
//       <Dropdown
//         placement="autoVerticalEnd"
//         container={() => document.body}
//         renderToggle={(props, ref) => (
//           <IconButton
//             ref={ref}
//             {...props}
//             icon={<FiPlus style={{ fontSize: 14 }} />}
//             size="md"
//             appearance="primary"
//             circle
//             style={{
//               flexShrink: 0,
//               width: 36,
//               height: 36,
//               background: 'var(--gf-accent)',
//               border: 'none',
//             }}
//           />
//         )}
//       >
//         {options.map((opt) => (
//           <Dropdown.Item key={opt} onSelect={() => onChange?.(opt)}>
//             {opt}
//           </Dropdown.Item>
//         ))}
//       </Dropdown>
//     </div>
//   </div>
// )

// /* ── TOGGLE BUTTON ──────────────────────────────────────────── */
// export const ToggleBtn = ({ label, active, onClick }) => (
//   <Button
//     onClick={onClick}
//     style={{
//       flex: 1,
//       borderRadius: 8,
//       fontWeight: 500,
//       fontSize: 14,
//       height: 44,
//       background: active ? 'var(--gf-accent)' : 'var(--gf-input-bg)',
//       color: active ? '#fff' : 'var(--gf-text-secondary)',
//       border: active ? 'none' : '1px solid var(--gf-border)',
//       transition: 'all 0.2s ease',
//     }}
//   >
//     {label}
//   </Button>
// )

// /* ── CONFIRM SAVE MODAL ─────────────────────────────────────── */
// export const ConfirmSaveModal = ({ open, onConfirm, onCancel, loading, isEditing, summary = [] }) => (
//   <Modal open={open} onClose={onCancel} size="xs" backdrop="static" container={() => document.body}>
//     <Modal.Header>
//       <Modal.Title
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: 10,
//           fontSize: 18,
//           fontWeight: 500,
//           color: 'var(--gf-text-primary)',
//         }}
//       >
//         <FiAlertCircle style={{ color: 'var(--gf-warning)', fontSize: 20 }} />
//         {isEditing ? 'Confirm Changes' : 'Confirm & Save'}
//       </Modal.Title>
//     </Modal.Header>

//     <Modal.Body style={{ paddingBottom: 8 }}>
//       <p style={{ fontSize: 14, color: 'var(--gf-text-secondary)', margin: '0 0 20px', lineHeight: 1.5 }}>
//         Please review the details below. Are all the information correct?
//       </p>

//       <div style={{ border: '1px solid var(--gf-border)', borderRadius: 8, overflow: 'hidden', fontSize: 13 }}>
//         {summary
//           .filter((r) => r.value !== '' && r.value !== null && r.value !== undefined && r.value !== false)
//           .map((row, i, arr) => (
//             <div
//               key={row.label}
//               style={{
//                 display: 'flex',
//                 gap: 12,
//                 padding: '12px 16px',
//                 background: i % 2 === 0 ? 'var(--gf-input-bg)' : 'var(--gf-card-bg)',
//                 borderBottom: i < arr.length - 1 ? '1px solid var(--gf-divider)' : 'none',
//               }}
//             >
//               <span style={{ color: 'var(--gf-text-secondary)', width: 120, flexShrink: 0 }}>
//                 {row.label}
//               </span>
//               <span style={{ color: 'var(--gf-text-primary)', fontWeight: 500, flex: 1, wordBreak: 'break-word' }}>
//                 {row.value === true ? 'Yes' : String(row.value)}
//               </span>
//             </div>
//           ))}
//       </div>
//     </Modal.Body>

//     <Modal.Footer style={{ paddingTop: 20 }}>
//       <Button
//         onClick={onCancel}
//         appearance="subtle"
//         style={{
//           borderRadius: 8,
//           border: '1px solid var(--gf-border)',
//           color: 'var(--gf-text-secondary)',
//           fontWeight: 500,
//           marginRight: 10,
//           height: 40,
//         }}
//       >
//         Go Back & Edit
//       </Button>
//       <Button
//         onClick={onConfirm}
//         appearance="primary"
//         loading={loading}
//         style={{
//           background: isEditing ? 'var(--gf-accent)' : 'var(--gf-success)',
//           border: 'none',
//           borderRadius: 8,
//           fontWeight: 500,
//           color: '#fff',
//           height: 40,
//         }}
//       >
//         {isEditing ? 'Confirm & Update' : 'Confirm & Save'}
//       </Button>
//     </Modal.Footer>
//   </Modal>
// )

// /* ── SAVE BUTTON ────────────────────────────────────────────── */
// export const SaveBtn = ({ onClick, loading, isEditing, onCancelEdit }) => (
//   <div className="gf-save-wrap">
//     {isEditing && (
//       <Button
//         appearance="subtle"
//         onClick={onCancelEdit}
//         style={{
//           borderRadius: 8,
//           padding: '10px 24px',
//           fontWeight: 500,
//           fontSize: 14,
//           border: '1px solid var(--gf-border)',
//           color: 'var(--gf-text-secondary)',
//           height: 44,
//         }}
//       >
//         Cancel
//       </Button>
//     )}
//     <Button
//       appearance="primary"
//       onClick={onClick}
//       loading={loading}
//       style={{
//         background: isEditing ? 'var(--gf-accent)' : 'var(--gf-success)',
//         border: 'none',
//         borderRadius: 8,
//         padding: '10px 32px',
//         fontWeight: 500,
//         fontSize: 14,
//         color: '#fff',
//         height: 44,
//       }}
//     >
//       {isEditing ? 'Save Changes' : 'Save'}
//     </Button>
//   </div>
// )

// /* ── CRUD MENU ──────────────────────────────────────────────── */
// export const CrudMenu = ({ onClone, onEdit, onDelete }) => (
//   <Dropdown
//     placement="leftStart"
//     container={() => document.body}
//     renderToggle={(props, ref) => (
//       <IconButton
//         ref={ref}
//         {...props}
//         icon={<FiMoreVertical />}
//         size="xs"
//         appearance="subtle"
//         circle
//         style={{ color: 'var(--gf-text-tertiary)' }}
//       />
//     )}
//   >
//     <Dropdown.Item icon={<FiCopy style={{ fontSize: 14 }} />} onSelect={onClone} style={{ fontSize: 13 }}>
//       Clone
//     </Dropdown.Item>
//     <Dropdown.Item icon={<FiEdit2 style={{ fontSize: 14 }} />} onSelect={onEdit} style={{ fontSize: 13 }}>
//       Edit
//     </Dropdown.Item>
//     <Dropdown.Item
//       icon={<FiTrash2 style={{ fontSize: 14, color: 'var(--gf-danger)' }} />}
//       onSelect={onDelete}
//       style={{ color: 'var(--gf-danger)', fontSize: 13 }}
//     >
//       Delete
//     </Dropdown.Item>
//   </Dropdown>
// )

// /* ── SAVED PANEL HEADER ─────────────────────────────────────── */
// export const SavedPanelHeader = ({ title, onSelectMode, selectMode, onSelectAll, allSelected }) => (
//   <div className="gf-saved-header">
//     <span className="gf-saved-header-title">{title}</span>
//     <div className="gf-saved-header-actions">
//       {selectMode && (
//         <Checkbox checked={allSelected} onChange={onSelectAll} style={{ marginRight: 8 }}>
//           <span style={{ fontSize: 13, color: 'var(--gf-text-secondary)' }}>Select all</span>
//         </Checkbox>
//       )}
//       <IconButton
//         icon={selectMode ? <FiX /> : <FiCheck />}
//         size="sm"
//         appearance="subtle"
//         onClick={onSelectMode}
//         circle
//         style={{ color: selectMode ? 'var(--gf-danger)' : 'var(--gf-accent)' }}
//       />
//     </div>
//   </div>
// )

// /* ── SELECT MODE ACTIONS BAR ────────────────────────────────── */
// export const SelectModeBar = ({ selectedCount, onDeleteSelected, onCancel }) => (
//   <div className="gf-select-mode-header">
//     <div className="gf-select-mode-left">
//       <span className="gf-select-mode-count">{selectedCount} selected</span>
//     </div>
//     <div style={{ display: 'flex', gap: 8 }}>
//       <Button
//         appearance="subtle"
//         size="sm"
//         onClick={onCancel}
//         style={{ borderRadius: 6, fontSize: 13, color: 'var(--gf-text-secondary)' }}
//       >
//         Cancel
//       </Button>
//       <Button
//         appearance="primary"
//         size="sm"
//         onClick={onDeleteSelected}
//         disabled={selectedCount === 0}
//         style={{ background: 'var(--gf-danger)', border: 'none', borderRadius: 6, fontSize: 13 }}
//         startIcon={<FiTrash2 />}
//       >
//         Delete Selected
//       </Button>
//     </div>
//   </div>
// )

// /* ── PILL BADGE ─────────────────────────────────────────────── */
// export const Pill = ({ children, color = 'blue' }) => (
//   <span className={`gf-pill ${color}`}>{children}</span>
// )

// /* ── ICON CIRCLE ────────────────────────────────────────────── */
// export const IconCircle = ({ color = 'blue', children }) => (
//   <div className={`gf-icon-circle ${color}`}>{children}</div>
// )

// /* ── IMAGE UPLOAD ───────────────────────────────────────────── */
// // Uses a hidden native file input — no floating previews or overlays
// export const ImageUpload = ({ value, onChange, label }) => {
//   const inputRef = useRef(null)
//   return (
//     <div style={{ width: '100%' }}>
//       {label && <div className="gf-input-label">{label}</div>}
//       <div className="gf-image-upload" onClick={() => inputRef.current?.click()}>
//         <span style={{ color: 'var(--gf-text-secondary)', fontSize: 14 }}>
//           {value ? value.name : 'Add image'}
//         </span>
//         <FiUpload style={{ color: 'var(--gf-text-tertiary)', fontSize: 16, flexShrink: 0 }} />
//         <input
//           ref={inputRef}
//           type="file"
//           accept="image/*"
//           style={{ display: 'none' }}
//           onChange={(e) => {
//             const file = e.target.files?.[0] ?? null
//             onChange(file)
//             e.target.value = ''
//           }}
//         />
//       </div>
//     </div>
//   )
// }

// /* ── SECTION HEADER ─────────────────────────────────────────── */
// export const SectionHeader = ({ children }) => (
//   <div className="gf-section-header">{children}</div>
// )

import { useState, useRef } from 'react'
import { Input, Button, Dropdown, IconButton, DatePicker, Modal, Checkbox } from 'rsuite'
import { FiPlus, FiCopy, FiEdit2, FiTrash2, FiMoreVertical, FiCheck, FiX, FiUpload, FiAlertCircle } from 'react-icons/fi'
import { MdPeople, MdLocationOn, MdArrowForward, MdTask, MdEvent, MdNotifications } from 'react-icons/md'

/* ── ICONS EXPORT ───────────────────────────────────────────── */
export const Icons = {
  Plus:       FiPlus,
  Copy:       FiCopy,
  Edit:       FiEdit2,
  Trash:      FiTrash2,
  More:       FiMoreVertical,
  Check:      FiCheck,
  Close:      FiX,
  Upload:     FiUpload,
  Bell:       MdNotifications,
  People:     MdPeople,
  Calendar:   MdEvent,
  ArrowRight: MdArrowForward,
  Task:       MdTask,
  Location:   MdLocationOn,
  Schedule:   MdEvent,
  Alert:      FiAlertCircle,
}

/* ── COMMON STYLES ──────────────────────────────────────────── */
const inputStyle = {
  borderRadius: 8,
  border: '1px solid var(--gf-input-border)',
  background: 'var(--gf-input-bg)',
  fontSize: 14,
  height: 44,
  color: 'var(--gf-text-primary)',
  transition: 'all 0.2s ease',
}

const pickerBlockStyle = { width: '100%' }

/* ── TEXT INPUT ─────────────────────────────────────────────── */
export const GfInput = ({ placeholder, value, onChange, type = 'text', label }) => (
  <div style={{ width: '100%' }}>
    {label && <div className="gf-input-label">{label}</div>}
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={inputStyle}
    />
  </div>
)

/* ── DATE PICKER ────────────────────────────────────────────── */
export const GfDatePicker = ({ placeholder, value, onChange, label }) => {
  const toDate = (str) => {
    if (!str) return null
    const d = new Date(str)
    return isNaN(d) ? null : d
  }
  const toStr = (date) => {
    if (!date) return ''
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  return (
    <div style={{ width: '100%' }}>
      {label && <div className="gf-input-label">{label}</div>}
      <DatePicker
        block
        oneTap
        placeholder={placeholder || 'Select date'}
        value={toDate(value)}
        onChange={(d) => onChange(toStr(d))}
        format="dd/MM/yyyy"
        style={pickerBlockStyle}
        size="md"
        container={() => document.body}
        placement="autoVerticalStart"
        preventOverflow
      />
    </div>
  )
}

/* ── TIME PICKER ────────────────────────────────────────────── */
export const GfTimePicker = ({ placeholder, value, onChange, label }) => {
  const toDate = (str) => {
    if (!str) return null
    const [h, m] = str.split(':').map(Number)
    const d = new Date()
    d.setHours(h, m, 0, 0)
    return d
  }
  const toStr = (date) => {
    if (!date) return ''
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
  return (
    <div style={{ width: '100%' }}>
      {label && <div className="gf-input-label">{label}</div>}
      <DatePicker
        block
        placeholder={placeholder || 'Select time'}
        value={toDate(value)}
        onChange={(d) => onChange(toStr(d))}
        format="hh:mm a"
        hideMinutes={(s) => s % 5 !== 0}
        style={pickerBlockStyle}
        size="md"
        container={() => document.body}
        placement="autoVerticalStart"
        preventOverflow
      />
    </div>
  )
}

/* ── INPUT WITH PLUS DROPDOWN ───────────────────────────────── */
export const InputWithPlus = ({
  placeholder,
  value,
  onChange,
  options = ['Option 1', 'Option 2', 'Option 3'],
  label,
}) => (
  <div style={{ width: '100%' }}>
    {label && <div className="gf-input-label">{label}</div>}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={inputStyle}
      />
      <Dropdown
        placement="bottomEnd"
        renderToggle={(props, ref) => (
          <IconButton
            ref={ref}
            {...props}
            icon={<FiPlus style={{ fontSize: 14 }} />}
            size="md"
            appearance="primary"
            circle
            style={{
              flexShrink: 0,
              width: 36,
              height: 36,
              background: 'var(--gf-accent)',
              border: 'none',
            }}
          />
        )}
      >
        {options.map((opt) => (
          <Dropdown.Item key={opt} onSelect={() => onChange?.(opt)}>
            {opt}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  </div>
)

/* ── TOGGLE BUTTON ──────────────────────────────────────────── */
export const ToggleBtn = ({ label, active, onClick }) => (
  <Button
    onClick={onClick}
    style={{
      flex: 1,
      borderRadius: 8,
      fontWeight: 500,
      fontSize: 14,
      height: 44,
      background: active ? 'var(--gf-accent)' : 'var(--gf-input-bg)',
      color: active ? '#fff' : 'var(--gf-text-secondary)',
      border: active ? 'none' : '1px solid var(--gf-border)',
      transition: 'all 0.2s ease',
    }}
  >
    {label}
  </Button>
)

/* ── CONFIRM SAVE MODAL ─────────────────────────────────────── */
export const ConfirmSaveModal = ({ open, onConfirm, onCancel, loading, isEditing, summary = [] }) => (
  <Modal open={open} onClose={onCancel} size="xs" backdrop="static" container={() => document.body}>
    <Modal.Header>
      <Modal.Title
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 18,
          fontWeight: 500,
          color: 'var(--gf-text-primary)',
        }}
      >
        <FiAlertCircle style={{ color: 'var(--gf-warning)', fontSize: 20 }} />
        {isEditing ? 'Confirm Changes' : 'Confirm & Save'}
      </Modal.Title>
    </Modal.Header>

    <Modal.Body style={{ paddingBottom: 8 }}>
      <p style={{ fontSize: 14, color: 'var(--gf-text-secondary)', margin: '0 0 20px', lineHeight: 1.5 }}>
        Please review the details below. Are all the information correct?
      </p>

      <div style={{ border: '1px solid var(--gf-border)', borderRadius: 8, overflow: 'hidden', fontSize: 13 }}>
        {summary
          .filter((r) => r.value !== '' && r.value !== null && r.value !== undefined && r.value !== false)
          .map((row, i, arr) => (
            <div
              key={row.label}
              style={{
                display: 'flex',
                gap: 12,
                padding: '12px 16px',
                background: i % 2 === 0 ? 'var(--gf-input-bg)' : 'var(--gf-card-bg)',
                borderBottom: i < arr.length - 1 ? '1px solid var(--gf-divider)' : 'none',
              }}
            >
              <span style={{ color: 'var(--gf-text-secondary)', width: 120, flexShrink: 0 }}>
                {row.label}
              </span>
              <span style={{ color: 'var(--gf-text-primary)', fontWeight: 500, flex: 1, wordBreak: 'break-word' }}>
                {row.value === true ? 'Yes' : String(row.value)}
              </span>
            </div>
          ))}
      </div>
    </Modal.Body>

    <Modal.Footer style={{ paddingTop: 20 }}>
      <Button
        onClick={onCancel}
        appearance="subtle"
        style={{
          borderRadius: 8,
          border: '1px solid var(--gf-border)',
          color: 'var(--gf-text-secondary)',
          fontWeight: 500,
          marginRight: 10,
          height: 40,
        }}
      >
        Go Back & Edit
      </Button>
      <Button
        onClick={onConfirm}
        appearance="primary"
        loading={loading}
        style={{
          background: isEditing ? 'var(--gf-accent)' : 'var(--gf-success)',
          border: 'none',
          borderRadius: 8,
          fontWeight: 500,
          color: '#fff',
          height: 40,
        }}
      >
        {isEditing ? 'Confirm & Update' : 'Confirm & Save'}
      </Button>
    </Modal.Footer>
  </Modal>
)

/* ── SAVE BUTTON ────────────────────────────────────────────── */
export const SaveBtn = ({ onClick, loading, isEditing, onCancelEdit }) => (
  <div className="gf-save-wrap">
    {isEditing && (
      <Button
        appearance="subtle"
        onClick={onCancelEdit}
        style={{
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 500,
          fontSize: 14,
          border: '1px solid var(--gf-border)',
          color: 'var(--gf-text-secondary)',
          height: 44,
        }}
      >
        Cancel
      </Button>
    )}
    <Button
      appearance="primary"
      onClick={onClick}
      loading={loading}
      style={{
        background: isEditing ? 'var(--gf-accent)' : 'var(--gf-success)',
        border: 'none',
        borderRadius: 8,
        padding: '10px 32px',
        fontWeight: 500,
        fontSize: 14,
        color: '#fff',
        height: 44,
      }}
    >
      {isEditing ? 'Save Changes' : 'Save'}
    </Button>
  </div>
)

/* ── CRUD MENU ──────────────────────────────────────────────── */
export const CrudMenu = ({ onClone, onEdit, onDelete }) => (
  <Dropdown
    placement="leftStart"
    container={() => document.body}
    renderToggle={(props, ref) => (
      <IconButton
        ref={ref}
        {...props}
        icon={<FiMoreVertical />}
        size="xs"
        appearance="subtle"
        circle
        style={{ color: 'var(--gf-text-tertiary)' }}
      />
    )}
  >
    <Dropdown.Item icon={<FiCopy style={{ fontSize: 14 }} />} onSelect={onClone} style={{ fontSize: 13 }}>
      Clone
    </Dropdown.Item>
    <Dropdown.Item icon={<FiEdit2 style={{ fontSize: 14 }} />} onSelect={onEdit} style={{ fontSize: 13 }}>
      Edit
    </Dropdown.Item>
    <Dropdown.Item
      icon={<FiTrash2 style={{ fontSize: 14, color: 'var(--gf-danger)' }} />}
      onSelect={onDelete}
      style={{ color: 'var(--gf-danger)', fontSize: 13 }}
    >
      Delete
    </Dropdown.Item>
  </Dropdown>
)

/* ── SAVED PANEL HEADER ─────────────────────────────────────── */
export const SavedPanelHeader = ({ title, onSelectMode, selectMode, onSelectAll, allSelected }) => (
  <div className="gf-saved-header">
    <span className="gf-saved-header-title">{title}</span>
    <div className="gf-saved-header-actions">
      {selectMode && (
        <Checkbox checked={allSelected} onChange={onSelectAll} style={{ marginRight: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--gf-text-secondary)' }}>Select all</span>
        </Checkbox>
      )}
      <IconButton
        icon={selectMode ? <FiX /> : <FiCheck />}
        size="sm"
        appearance="subtle"
        onClick={onSelectMode}
        circle
        style={{ color: selectMode ? 'var(--gf-danger)' : 'var(--gf-accent)' }}
      />
    </div>
  </div>
)

/* ── SELECT MODE ACTIONS BAR ────────────────────────────────── */
export const SelectModeBar = ({ selectedCount, onDeleteSelected, onCancel }) => (
  <div className="gf-select-mode-header">
    <div className="gf-select-mode-left">
      <span className="gf-select-mode-count">{selectedCount} selected</span>
    </div>
    <div style={{ display: 'flex', gap: 8 }}>
      <Button
        appearance="subtle"
        size="sm"
        onClick={onCancel}
        style={{ borderRadius: 6, fontSize: 13, color: 'var(--gf-text-secondary)' }}
      >
        Cancel
      </Button>
      <Button
        appearance="primary"
        size="sm"
        onClick={onDeleteSelected}
        disabled={selectedCount === 0}
        style={{ background: 'var(--gf-danger)', border: 'none', borderRadius: 6, fontSize: 13 }}
        startIcon={<FiTrash2 />}
      >
        Delete Selected
      </Button>
    </div>
  </div>
)

/* ── PILL BADGE ─────────────────────────────────────────────── */
export const Pill = ({ children, color = 'blue' }) => (
  <span className={`gf-pill ${color}`}>{children}</span>
)

/* ── ICON CIRCLE ────────────────────────────────────────────── */
export const IconCircle = ({ color = 'blue', children }) => (
  <div className={`gf-icon-circle ${color}`}>{children}</div>
)

/* ── IMAGE UPLOAD ───────────────────────────────────────────── */
// Uses a hidden native file input — no floating previews or overlays
export const ImageUpload = ({ value, onChange, label }) => {
  const inputRef = useRef(null)
  return (
    <div style={{ width: '100%' }}>
      {label && <div className="gf-input-label">{label}</div>}
      <div className="gf-image-upload" onClick={() => inputRef.current?.click()}>
        <span style={{ color: 'var(--gf-text-secondary)', fontSize: 14 }}>
          {value ? value.name : 'Add image'}
        </span>
        <FiUpload style={{ color: 'var(--gf-text-tertiary)', fontSize: 16, flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null
            onChange(file)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}

/* ── SECTION HEADER ─────────────────────────────────────────── */
export const SectionHeader = ({ children }) => (
  <div className="gf-section-header">{children}</div>
)