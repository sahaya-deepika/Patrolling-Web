import { useState } from 'react'
import {
  Badge, Avatar, Whisper, Tooltip, Popover,
  Modal, Button, IconButton, Input, Divider, Tag,
  Grid, Row, Col, Panel, Message, useToaster, Stack, Nav
} from 'rsuite'
import NoticeIcon from '@rsuite/icons/Notice'
import {
  FiMoon, FiSun, FiUser, FiLogOut, FiChevronDown,
  FiEdit2, FiTrash2, FiCheck, FiX, FiCamera, FiShield,
  FiMail, FiPhone, FiMapPin, FiBriefcase,
  FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle, FiBell
} from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'
import { logout } from '../../api'
import './Header.css'

/* ─── Notification Data ──────────────────────── */
const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'alert',   title: 'Trip Missed',       desc: 'Driver Karthik missed the 9:30 AM trip.',      time: '1 secs ago',  read: false },
  { id: 2, type: 'success', title: 'Trip Completed',    desc: 'Nicolas completed Round 6 successfully.',      time: '15 min ago', read: false },
  { id: 3, type: 'info',    title: 'Shift Changed',     desc: 'Shift 2 schedule updated for Unit 3.',         time: '1 hr ago',   read: false },
  { id: 4, type: 'warning', title: 'Late Arrival',      desc: 'Praveen arrived 12 minutes late.',             time: '2 hr ago',   read: true  },
  { id: 5, type: 'success', title: 'Attendance Synced', desc: 'All attendance records updated.',              time: '3 hr ago',   read: true  },
]

/* ─── Profile Storage Key ────────────────────── */
const PROFILE_KEY = 'adminProfile'

const DEFAULT_ADMIN = {
  name: 'Admin',
  email: '',
  phone: '',
  role: 'Administrator',
  department: '',
  location: '',
  bio: '',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  joinDate: '',
  lastLogin: new Date().toLocaleString(),
}

/* ─── Load profile from localStorage ────────── */
function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null')
    if (saved) return saved
  } catch {}

  try {
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}')
    const userId = authUser.user_id || authUser.userId || authUser.username || 'Admin'
    return {
      ...DEFAULT_ADMIN,
      name:  authUser.name  || authUser.userName  || userId,
      email: authUser.email || authUser.mail       || '',
      role:  authUser.role  || 'Administrator',
    }
  } catch {}

  return DEFAULT_ADMIN
}

function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

function clearProfile() {
  localStorage.removeItem(PROFILE_KEY)
}

/* ─── Notification Icon by type ─────────────── */
function NotifIcon({ type }) {
  const map = {
    alert:   { icon: <FiAlertCircle size={15} />,  color: '#e74c3c' },
    success: { icon: <FiCheckCircle size={15} />,  color: '#27ae60' },
    info:    { icon: <FiInfo size={15} />,          color: '#2980b9' },
    warning: { icon: <FiAlertTriangle size={15} />, color: '#f39c12' },
  }
  const { icon, color } = map[type] || map.info
  return (
    <div className="notif-icon-wrap" style={{ background: color + '18', color }}>
      {icon}
    </div>
  )
}

/* ─── Notification Popup ─────────────────────── */
function NotificationPopup({ notifications, onMarkRead, onMarkAllRead, onClear }) {
  const unread = notifications.filter(n => !n.read).length
  return (
    <div className="notif-popup">
      <div className="notif-popup-header">
        <div className="notif-popup-title-row">
          <span className="notif-popup-title">
            <FiBell size={14} style={{ marginRight: 6 }} />Notifications
          </span>
          {unread > 0 && <span className="notif-unread-badge">{unread} new</span>}
        </div>
        {/* ✅ FIX: was native <button> → now RSuite Button */}
        {unread > 0 && (
          <Button appearance="link" size="xs" className="notif-mark-all" onClick={onMarkAllRead}>
            Mark all as read
          </Button>
        )}
      </div>
      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">
            <FiBell size={28} style={{ opacity: 0.25, marginBottom: 8 }} />
            <span>No notifications</span>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className={`notif-item ${!n.read ? 'notif-item-unread' : ''}`}
              onClick={() => onMarkRead(n.id)}
            >
              <NotifIcon type={n.type} />
              <div className="notif-content">
                <div className="notif-item-title">{n.title}</div>
                <div className="notif-item-desc">{n.desc}</div>
                <div className="notif-item-time">{n.time}</div>
              </div>
              {!n.read && <div className="notif-dot" />}
            </div>
          ))
        )}
      </div>
      {notifications.length > 0 && (
        <div className="notif-popup-footer">
          <Button appearance="subtle" size="xs" className="notif-clear-btn" onClick={onClear}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}

/* ─── Theme Card ─────────────────────────────── */
function ThemeCard({ value, label, icon, current, onClick }) {
  const active = current === value
  return (
    <Panel
      bordered
      className={`theme-card ${active ? 'theme-card-active' : ''}`}
      onClick={() => onClick(value)}
    >
      <div className={`theme-card-preview theme-preview-${value}`}>
        <div className="tp-header" />
        <div className="tp-sidebar" />
        <div className="tp-content">
          <div className="tp-card" />
          <div className="tp-card" />
        </div>
      </div>
      <Stack alignItems="center" justifyContent="space-between" className="theme-card-footer">
        <Stack spacing={6} alignItems="center" className="theme-card-label">
          {icon} {label}
        </Stack>
        {active && (
          <IconButton icon={<FiCheck size={10} />} circle size="xs" appearance="primary" className="theme-card-check" />
        )}
      </Stack>
    </Panel>
  )
}

/* ─── Admin Profile Modal ────────────────────── */
function AdminProfileModal({ open, onClose, onProfileUpdate }) {
  const { theme, setTheme } = useTheme()
  const [admin, setAdmin]   = useState(() => loadProfile())
  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft]   = useState(() => loadProfile())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const toaster = useToaster()

  const handleEdit   = () => { setDraft({ ...admin }); setEditMode(true) }
  const handleCancel = () => { setDraft({ ...admin }); setEditMode(false) }

  const handleSave = () => {
    const updated = { ...draft, lastLogin: admin.lastLogin }
    setAdmin(updated)
    saveProfile(updated)
    setEditMode(false)
    onProfileUpdate?.(updated)
    toaster.push(
      <Message type="success" showIcon closable>Profile updated successfully!</Message>,
      { placement: 'topCenter', duration: 3000 }
    )
  }

  const handleReset = () => {
    const base = loadProfile()
    clearProfile()
    setAdmin(base)
    setDraft(base)
    setShowDeleteConfirm(false)
    setEditMode(false)
    onProfileUpdate?.(base)
    toaster.push(
      <Message type="info" showIcon closable>Profile reset to default.</Message>,
      { placement: 'topCenter', duration: 3000 }
    )
  }

  const handleAvatarCycle = () => {
    const seeds = ['admin', 'admin1', 'admin2', 'admin3', 'admin4']
    const current = draft.avatar.split('seed=')[1]
    const next = seeds[(seeds.indexOf(current) + 1) % seeds.length]
    setDraft(d => ({ ...d, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${next}` }))
  }

  const Field = ({ label, icon, fieldKey }) => (
    <div className="ap-field" key={fieldKey}>
      <label className="ap-label"><span className="ap-label-icon">{icon}</span>{label}</label>
      {editMode
        ? (
          <Input
            value={draft[fieldKey] || ''}
            onChange={(value) => setDraft(d => ({ ...d, [fieldKey]: value }))}
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
            autoFocus={fieldKey === 'name'}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )
        : <div className="ap-value">{admin[fieldKey] || <span style={{ color: '#bbb' }}>Not set</span>}</div>
      }
    </div>
  )

  return (
    <Modal open={open} onClose={onClose} size="md" className="ap-modal">
      <Modal.Header className="ap-modal-header">
        <Modal.Title className="ap-modal-title">
          <FiShield style={{ marginRight: 8 }} /> Admin Profile
        </Modal.Title>
      </Modal.Header>

      <Nav appearance="subtle" activeKey={activeTab} onSelect={setActiveTab} className="ap-nav">
        <Nav.Item eventKey="profile" icon={<FiUser size={14} />}>Profile</Nav.Item>
        <Nav.Item eventKey="theme"   icon={<FiSun  size={14} />}>Appearance</Nav.Item>
      </Nav>

      <Modal.Body className="ap-modal-body">
        {activeTab === 'profile' && (
          <>
            <Stack spacing={16} alignItems="center" className="ap-avatar-section">
              <div className="ap-avatar-wrap">
                <Avatar circle src={editMode ? draft.avatar : admin.avatar} size="lg" className="ap-avatar" />
                {editMode && (
                  <IconButton
                    className="ap-avatar-btn"
                    icon={<FiCamera size={12} />}
                    circle size="xs" appearance="primary"
                    onClick={handleAvatarCycle}
                  />
                )}
              </div>
              <Stack direction="column" alignItems="flex-start" spacing={4}>
                <h3 className="ap-name">{admin.name}</h3>
                <Tag color="blue">{admin.role}</Tag>
                {admin.lastLogin && (
                  <Stack spacing={6} className="ap-meta">
                    <span>Last login: {admin.lastLogin}</span>
                  </Stack>
                )}
              </Stack>
            </Stack>

            <Divider style={{ margin: '16px 0' }} />

            <Grid fluid>
              <Row gutter={20}>
                <Col xs={24} sm={12}>
                  <Field label="Full Name"      icon={<FiUser />}     fieldKey="name"       />
                  <Field label="Email Address"  icon={<FiMail />}     fieldKey="email"      />
                  <Field label="Phone Number"   icon={<FiPhone />}    fieldKey="phone"      />
                </Col>
                <Col xs={24} sm={12}>
                  <Field label="Role"           icon={<FiShield />}   fieldKey="role"       />
                  <Field label="Department"     icon={<FiBriefcase />}fieldKey="department" />
                  <Field label="Location"       icon={<FiMapPin />}   fieldKey="location"   />
                </Col>
                <Col xs={24}>
                  <Field label="Bio"            icon={<FiUser />}     fieldKey="bio"        />
                </Col>
              </Row>
            </Grid>

            {showDeleteConfirm && (
              <Panel className="ap-delete-panel" bordered>
                <p className="ap-delete-msg">⚠️ This will reset all profile data. Are you sure?</p>
                <Stack spacing={10}>
                  <Button size="sm" appearance="ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                  <Button size="sm" color="red" appearance="primary" onClick={handleReset}>Yes, Reset</Button>
                </Stack>
              </Panel>
            )}
          </>
        )}

        {activeTab === 'theme' && (
          <Stack direction="column" spacing={16}>
            <Message type="info" showIcon>Changes apply instantly across all pages.</Message>
            <Stack spacing={14} className="ap-theme-cards">
              <ThemeCard value="light" label="Light" current={theme} icon={<FiSun  size={13} />} onClick={setTheme} />
              <ThemeCard value="dark"  label="Dark"  current={theme} icon={<FiMoon size={13} />} onClick={setTheme} />
            </Stack>
            <Panel bordered className="ap-theme-current">
              <Stack spacing={8} alignItems="center">
                {theme === 'dark' ? <FiMoon size={15} color="#f0c040" /> : <FiSun size={15} color="#f0a040" />}
                Currently using <Tag color="blue">{theme.charAt(0).toUpperCase() + theme.slice(1)} Mode</Tag>
              </Stack>
            </Panel>
          </Stack>
        )}
      </Modal.Body>

      {activeTab === 'profile' && (
        <Modal.Footer className="ap-modal-footer">
          {!editMode ? (
            <Stack justifyContent="space-between" style={{ width: '100%' }}>
              <Button appearance="subtle" color="red" startIcon={<FiTrash2 />} onClick={() => setShowDeleteConfirm(true)}>
                Reset Profile
              </Button>
              <Stack spacing={10}>
                <Button appearance="ghost" onClick={onClose}>Close</Button>
                <Button appearance="primary" startIcon={<FiEdit2 />} onClick={handleEdit}>Edit Profile</Button>
              </Stack>
            </Stack>
          ) : (
            <Stack justifyContent="space-between" style={{ width: '100%' }}>
              <Button appearance="subtle" startIcon={<FiX />} onClick={handleCancel}>Cancel</Button>
              <Button appearance="primary" color="green" startIcon={<FiCheck />} onClick={handleSave}>Save Changes</Button>
            </Stack>
          )}
        </Modal.Footer>
      )}
    </Modal>
  )
}

/* ─── Header ─────────────────────────────────── */
export default function Header({ onLogout }) {
  const { theme, toggleTheme } = useTheme()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen,   setNotifOpen]   = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [profileData, setProfileData] = useState(() => loadProfile())
  const isDark = theme === 'dark'

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkRead    = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const handleMarkAllRead = ()   => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const handleClearAll    = ()   => { setNotifications([]); setNotifOpen(false) }

  const handleProfileUpdate = (updated) => setProfileData(updated)

  const AvatarMenu = (
    <Popover className="h-avatar-popover" arrow={false}>
      <Stack spacing={12} className="h-pop-user" alignItems="center">
        <Avatar circle src={profileData.avatar} size="sm" />
        <Stack direction="column" alignItems="flex-start" spacing={2}>
          <span className="h-pop-name">{profileData.name}</span>
          <span className="h-pop-role">{profileData.role}</span>
        </Stack>
      </Stack>
      <div className="h-pop-divider" />
      <Button block appearance="subtle" className="h-pop-item"
        startIcon={<FiUser />} onClick={() => setProfileOpen(true)}>
        Profile
      </Button>
      <Button block appearance="subtle" className="h-pop-item h-pop-logout"
        startIcon={<FiLogOut />}
        onClick={async () => {
          await logout()
          onLogout?.()
        }}>
        Logout
      </Button>
    </Popover>
  )

  return (
    <>
      <header className={`header ${isDark ? 'header-dark' : ''}`}>
        <div className="h-company">Company</div>
        <Stack spacing={10} alignItems="center">

          <Whisper placement="bottom" trigger="hover"
            speaker={<Tooltip>{isDark ? 'Switch to Light' : 'Switch to Dark'}</Tooltip>}>
            <IconButton
              icon={isDark ? <FiSun color="#f0c040" size={17} /> : <FiMoon color="#5b6f8a" size={17} />}
              circle appearance="subtle" className="h-icon-btn"
              onClick={toggleTheme}
            />
          </Whisper>

          {/* ── Notification Button + Popup ── */}
          <div className="notif-wrapper">
            <Badge content={unreadCount > 0 ? unreadCount : false} color="red">
              <IconButton
                icon={<NoticeIcon style={{ fontSize: 20, color: notifOpen ? 'var(--rs-primary-500)' : '#5b6f8a' }} />}
                circle appearance="subtle"
                className={`h-icon-btn ${notifOpen ? 'h-icon-btn-active' : ''}`}
                onClick={() => setNotifOpen(v => !v)}
              />
            </Badge>
            {notifOpen && (
              <>
                <div className="notif-backdrop" onClick={() => setNotifOpen(false)} />
                <NotificationPopup
                  notifications={notifications}
                  onMarkRead={handleMarkRead}
                  onMarkAllRead={handleMarkAllRead}
                  onClear={handleClearAll}
                />
              </>
            )}
          </div>

          <Whisper placement="bottomEnd" trigger="click" speaker={AvatarMenu}>
            <Button appearance="subtle" className="h-avatar-btn">
              <Avatar circle src={profileData.avatar} size="sm" className="h-avatar" />
              <FiChevronDown size={13} className="h-chevron" />
            </Button>
          </Whisper>

        </Stack>
      </header>

      <AdminProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onProfileUpdate={handleProfileUpdate}
      />
    </>
  )
}