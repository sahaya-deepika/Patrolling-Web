// src/pages/MasterForm/components/MasterFormUI.jsx
import React from 'react'
import { Input, Button } from 'rsuite'

// ── Inline SVG Icons (no @rsuite/icons dependency issues) ────
export const Icons = {
  Plus: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Copy: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  ),
  Check: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Attachment: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
    </svg>
  ),
  Bell: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  People: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Task: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  ),
  Location: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Schedule: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
}

// ── Shared UI components ──────────────────────────────────────

export const MfInput = ({ placeholder, value, onChange, type = 'text' }) => (
  <Input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="mf-input"
  />
)

export const NativeInput = ({ placeholder, value, onChange, type = 'text' }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="mf-native-input"
  />
)

export const InputWithPlus = ({ placeholder, value, onChange }) => (
  <div className="mf-input-plus-wrap">
    <MfInput placeholder={placeholder} value={value} onChange={onChange} />
    <button className="mf-plus-btn" type="button">
      <Icons.Plus />
    </button>
  </div>
)

export const ToggleBtn = ({ label, active, onClick }) => (
  <Button onClick={onClick} className={`mf-toggle-btn ${active ? 'on' : 'off'}`}>
    {label}
  </Button>
)

export const SaveBtn = ({ onClick, loading }) => (
  <div className="mf-save-wrap">
    <Button appearance="primary" onClick={onClick} loading={loading} className="mf-save-btn">
      Save
    </Button>
  </div>
)

export const SavedPanelHeader = ({ title }) => (
  <div className="mf-saved-header">
    <span>{title}</span>
    <span style={{ color: '#9ca3af', cursor: 'pointer' }}><Icons.Copy /></span>
  </div>
)

export const Pill = ({ children, color = 'blue' }) => (
  <span className={`mf-pill ${color}`}>{children}</span>
)

export const SectionLabel = ({ children }) => (
  <div className="mf-section-label">{children}</div>
)

export const IconCircle = ({ color = 'blue', children }) => (
  <div className={`mf-icon-circle ${color}`}>{children}</div>
)