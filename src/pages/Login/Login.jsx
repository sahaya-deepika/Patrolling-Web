
import { useState, useCallback } from 'react'
import { login, getAuthHeader, changePassword } from '../../api'
import './Login.css'

// ── Auth Helpers (works for both JWT and plain API keys) ──
const auth = {
  save(token)   { localStorage.setItem('accessToken', token) },
  get()         { return localStorage.getItem('accessToken') },
  clear()       { localStorage.removeItem('accessToken') },
  // Only attempts JWT decode if value looks like a JWT (3 dot-separated parts)
  decode(token) {
    if (!token || token.split('.').length !== 3) return null
    try {
      return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    } catch {
      return null
    }
  },
  isJwt(token)  { return !!token && token.split('.').length === 3 },
}

// ── Token Resolver — covers virtually all backend response shapes 
function resolveToken(response) {
  if (!response || typeof response !== 'object') return null

  const TOKEN_KEYS = [
    'api_key', 'apiKey',
    'token', 'accessToken', 'access_token', 'authToken', 'auth_token',
    'id_token', 'idToken', 'jwt', 'JWT', 'bearerToken', 'bearer_token',
    'sessionToken', 'session_token', 'userToken', 'user_token',
  ]

  function findToken(obj, depth = 0) {
    if (!obj || typeof obj !== 'object' || depth > 3) return null

    for (const key of TOKEN_KEYS) {
      if (typeof obj[key] === 'string' && obj[key].trim()) {
        console.log(`[resolveToken] Found token at key: "${key}" (depth ${depth})`)
        return obj[key].trim()
      }
    }

    for (const key of Object.keys(obj)) {
      if (/token|api.?key/i.test(key) && typeof obj[key] === 'string' && obj[key].trim()) {
        console.log(`[resolveToken] Found token via fuzzy match key: "${key}" (depth ${depth})`)
        return obj[key].trim()
      }
    }

    for (const key of Object.keys(obj)) {
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        const found = findToken(obj[key], depth + 1)
        if (found) return found
      }
    }

    return null
  }

  return findToken(response)
}

// ── Extract user info from response ──
function resolveUser(response, fallbackId) {
  if (!response || typeof response !== 'object') return fallbackId

  const direct = response.name || response.userName || response.user_name
    || response.fullName || response.full_name || response.displayName
    || response.user_id || response.userId
  if (direct) return direct

  const nested = response.user || response.data || response.userData || response.result
  if (nested && typeof nested === 'object') {
    return nested.name || nested.userName || nested.user_name
      || nested.fullName || nested.user_id || nested.id || fallbackId
  }

  return fallbackId
}

// ── Extract backend error message ──
function resolveErrorMessage(response) {
  if (!response || typeof response !== 'object') return null
  return response.message || response.error || response.errorMessage
    || response.data?.message || response.data?.error
    || response.result?.message || null
}

// ── API ──
async function apiLogin(user_id, password) {
  let response
  try {
    response = await login({ user_id, password })
    console.log('[Login] Raw response:', response)
    console.log('[Login] Response JSON:', JSON.stringify(response, null, 2))
  } catch (error) {
    console.error('[Login] Fetch error:', error)
    throw new Error(error.message || 'Network error. Please check your connection.')
  }

  const token = resolveToken(response)

  if (!token) {
    const serverMsg = resolveErrorMessage(response)

    if (response?.result === true || response?.error === false) {
      console.error('[Login] Backend says success but no token key found. Full response:', JSON.stringify(response, null, 2))
      throw new Error('Login succeeded but no api_key / token was returned. Check console for response shape.')
    }

    throw new Error(serverMsg || 'Invalid User ID or password.')
  }

  return {
    token,
    isJwt: auth.isJwt(token),
    decoded: auth.decode(token),
    user: resolveUser(response, user_id),
  }
}

async function apiChangePassword(user_id, currentPw, newPw, confirmPw) {
  return changePassword({ old_pass: currentPw, new_pass: newPw, confirm_pass: confirmPw })
}

// ── Icons ──
const Icons = {
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  Person: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/>
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2"/>
      <path d="M8 11V7a4 4 0 018 0v4"/>
    </svg>
  ),
  Key: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="15" r="5"/>
      <path d="M21 3l-9.4 9.4M16 8l2 2"/>
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
}

// ── Helpers ──
function pad(n) { return String(n).padStart(2, '0') }
function nowStr() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}  ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// ── Password Field ──
function PasswordField({ icon: Icon, label, name, placeholder, value, onChange, disabled }) {
  const [show, setShow] = useState(false)
  return (
    <div className="login-group">
      <label className="login-label" htmlFor={name}>{label}</label>
      <div className="login-input-wrap">
        <input
          id={name} name={name}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="login-input"
          autoComplete="off"
        />
        <span className="login-input-icon"><Icon /></span>
        <button type="button" className="pw-toggle" onClick={() => setShow(s => !s)} tabIndex={-1}>
          {show ? <Icons.EyeOff /> : <Icons.Eye />}
        </button>
      </div>
    </div>
  )
}

// ── Text Field ──
function TextField({ icon: Icon, label, name, placeholder, value, onChange, disabled, autoComplete }) {
  return (
    <div className="login-group">
      <label className="login-label" htmlFor={name}>{label}</label>
      <div className="login-input-wrap">
        <input
          id={name} name={name}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="login-input"
          autoComplete={autoComplete}
        />
        <span className="login-input-icon"><Icon /></span>
      </div>
    </div>
  )
}

// ── Success Screen ──
function SuccessScreen({ userName, onLogout }) {
  return (
    <div className="success-screen">
      <div className="success-check-circle">
        <Icons.Check />
      </div>
      <h2 className="success-title">Welcome, {userName}!</h2>
      <p className="success-sub">You have successfully signed in.</p>

      <div className="success-info-row">
        <span className="success-info-icon"><Icons.Person /></span>
        <div>
          <div className="success-info-label">Logged in as</div>
          <div className="success-info-value">{userName}</div>
        </div>
      </div>

      <div className="success-info-row">
        <span className="success-info-icon"><Icons.Clock /></span>
        <div>
          <div className="success-info-label">Session started</div>
          <div className="success-info-value">{nowStr()}</div>
        </div>
      </div>

      <button className="logout-btn" onClick={onLogout}>Sign Out</button>
    </div>
  )
}

// ── Main Component ──
export default function Login({ onLoginSuccess }) {
  const [mode,    setMode]    = useState('login') // 'login' | 'change' | 'success'
  const [form,    setForm]    = useState({ user_id: '', password: '', currentPw: '', newPw: '', confirmPw: '' })
  const [message, setMessage] = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = useCallback(e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value })), [])

  const switchMode = m => { setMode(m); setError(''); setMessage('') }
  const resetForm  = () => setForm({ user_id: '', password: '', currentPw: '', newPw: '', confirmPw: '' })

  // ── LOGIN ──
  const handleLogin = async (e) => {
    e.preventDefault()
    setError(''); setMessage('')
    const { user_id, password } = form

    if (!user_id.trim()) return setError('User ID is required.')
    if (!password)       return setError('Password is required.')

    setLoading(true)
    try {
      const data = await apiLogin(user_id.trim(), password)
      auth.save(data.token)
      onLoginSuccess?.(data)
    } catch (err) {
      auth.clear()
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── CHANGE PASSWORD ──
  const handleChangePassword = async (e) => {
    if (e?.preventDefault) e.preventDefault()
    setError(''); setMessage('')
    const { user_id, currentPw, newPw, confirmPw } = form

    if (!user_id.trim())    return setError('User ID is required.')
    if (!currentPw)         return setError('Current password is required.')
    if (!newPw)             return setError('New password is required.')
    if (newPw.length < 6)   return setError('New password must be at least 6 characters.')
    if (newPw === currentPw) return setError('New password must differ from current password.')
    if (newPw !== confirmPw) return setError('Passwords do not match.')

    setLoading(true)
    try {
      await apiChangePassword(user_id.trim(), currentPw, newPw, confirmPw)
      setMessage('Password changed successfully! Please log in.')
      setForm(f => ({ ...f, currentPw: '', newPw: '', confirmPw: '' }))
      setTimeout(() => switchMode('login'), 1800)
    } catch (err) {
      setError(err.message || 'Failed to change password.')
    } finally {
      setLoading(false)
    }
  }

  // ── LOGOUT ──
  const handleLogout = () => {
    auth.clear()
    resetForm()
    switchMode('login')
  }

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Back button */}
        {mode === 'change' && (
          <button className="login-back" onClick={() => switchMode('login')}>
            <Icons.Back /> Back to Login
          </button>
        )}

        {/* Brand */}
        <div className="login-brand">
          <div className="login-logo"><Icons.Shield /></div>
          <span className="login-app-name">Archaea</span>
          <span className="login-app-sub">Patrol &amp; Surveillance</span>
        </div>

        <p className="login-mode-label">
          {mode === 'login' ? 'Sign in to your account' : 'Change your password'}
        </p>

        {/* Alerts */}
        {error   && <div className="login-alert error"><Icons.X />{error}</div>}
        {message && <div className="login-alert success"><Icons.Check />{message}</div>}

        {/* ── LOGIN FORM ── */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} noValidate>
            <TextField
              icon={Icons.Person} label="User ID" name="user_id"
              placeholder="Enter your User ID"
              value={form.user_id} onChange={handleChange}
              disabled={loading} autoComplete="username"
            />
            <PasswordField
              icon={Icons.Lock} label="Password" name="password"
              placeholder="Enter your password"
              value={form.password} onChange={handleChange}
              disabled={loading}
            />
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? <><span className="btn-spinner" />Verifying...</> : 'Login'}
            </button>
          </form>
        )}

        {/* ── CHANGE PASSWORD FORM ── */}
        {mode === 'change' && (
          <form onSubmit={handleChangePassword} noValidate>
            <TextField
              icon={Icons.Person} label="User ID" name="user_id"
              placeholder="Enter your User ID"
              value={form.user_id} onChange={handleChange}
              disabled={loading} autoComplete="username"
            />
            <PasswordField
              icon={Icons.Lock} label="Current Password" name="currentPw"
              placeholder="Enter current password"
              value={form.currentPw} onChange={handleChange}
              disabled={loading}
            />
            <PasswordField
              icon={Icons.Key} label="New Password" name="newPw"
              placeholder="Min 6 characters"
              value={form.newPw} onChange={handleChange}
              disabled={loading}
            />
            <PasswordField
              icon={Icons.Key} label="Confirm New Password" name="confirmPw"
              placeholder="Re-enter new password"
              value={form.confirmPw} onChange={handleChange}
              disabled={loading}
            />
            <button className="login-btn" type="button" onClick={handleChangePassword} disabled={loading}>
              {loading ? <><span className="btn-spinner" />Updating...</> : 'Save Changes'}
            </button>
          </form>
        )}

        {/* Footer */}
        {mode === 'login' && (
          <>
            <div className="login-divider" />
            <div className="login-footer-link">
              <span onClick={() => switchMode('change')}>🔑 Change Password</span>
            </div>
          </>
        )}

      </div>
    </div>
  )
}