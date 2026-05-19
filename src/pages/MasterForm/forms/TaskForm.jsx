

import { useState, useEffect, useRef } from 'react'
import {
  getPatrolTypes,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  cloneQuestion,
} from '../../../api'
import { ConfirmSaveModal } from '../components/MasterFormUI'

// ── helpers: map between UI form shape and api.js shape ──────────────────────

function toFormShape(q) {
  const typeRaw = (q.type || '').toLowerCase()
  const questionType =
    typeRaw === 'fill'  ? 'Fill'   :
    typeRaw === 'yesno' ? 'Yes/No' : 'Option'
  return {
    id:          q.id,
    question:    q.name || '',
    questionType,
    patrolType:  q.patrolType || '',
    qus_id:      q.qus_id || q.id,
    options:     Array.isArray(q.options)
                   ? q.options.map(o => (typeof o === 'object' ? o.label || '' : o))
                   : [],
  }
}

function toApiPayload(form) {
  const typeMap = { Fill: 'fill', 'Yes/No': 'yesno', Option: 'options' }
  return {
    name:    form.question,
    type:    typeMap[form.questionType] || 'options',
    options: form.options.filter(o => o.trim()).map((o, i) => ({ id: String(i + 1), label: o })),
    role:    [2],
    qus_id:  form.qus_id || undefined,
  }
}

async function loadQuestions() {
  const raw = await getQuestions()
  return raw.map(toFormShape)
}

async function saveQuestion(form) {
  const payload = toApiPayload(form)
  const raw = await createQuestion(payload)
  return toFormShape(raw)
}

async function editQuestion(id, form) {
  const payload = { ...toApiPayload(form), qus_id: form.qus_id || id }
  const raw = await updateQuestion(id, payload)
  return toFormShape({ ...raw, id })
}

async function removeQuestion(id) {
  return deleteQuestion(id)
}

async function duplicateQuestion(id) {
  try {
    const raw = await cloneQuestion(id)
    if (raw) return toFormShape(raw)
  } catch {}
  return null
}
const blank = {
  patrolType: '',
  questionType: 'Option',
  question: '',
  options: ['', ''],
  qus_id: null,
}

const fallbackNames = ['Questions 04', 'Questions 01', 'Questions 02', 'Questions 03', 'Questions 05', 'Questions 06']

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

/* ── Custom dropdown for select-from-list fields ── */
function FieldDropdown({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ display: 'flex' }}>
        <input
          type="text" placeholder={placeholder} value={value}
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
            ? <div style={{ padding: '10px 14px', fontSize: '13px', color: '#9aa0a6' }}>No patrol types — add them in Others → Patrol Types</div>
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

export default function TaskForm() {
  const [form, setForm]               = useState(blank)
  const [saved, setSaved]             = useState([])
  const [busy, setBusy]               = useState(false)
  const [sel, setSel]                 = useState(null)
  const [confirm, setConfirm]         = useState(false)
  const [showSaved, setShowSaved]     = useState(true)
  const [selectMode, setSelectMode]   = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [patrolTypeOpts, setPatrolTypeOpts] = useState([])

  useEffect(() => {
    loadQuestions().then(setSaved).catch(() => {})
    getPatrolTypes().then(pts => {
      setPatrolTypeOpts(pts.map(p => p.patrolName).filter(Boolean).sort())
    }).catch(() => {})
  }, [])

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const setOption    = (i, val) => set('options', form.options.map((o, idx) => idx === i ? val : o))
  const addOption    = () => set('options', [...form.options, ''])
  const removeOption = (i) => set('options', form.options.filter((_, idx) => idx !== i))

  const handleEdit       = (item) => { setForm({ ...blank, ...item, options: item.options?.length ? item.options : blank.options }); setSel(item.id) }
  const handleCancelEdit = () => { setForm(blank); setSel(null) }
  const handleSaveClick  = () => { if (!form.question && !form.patrolType) return; setConfirm(true) }

  const handleClone = async (item) => {
    try {
      const cloned = await duplicateQuestion(item.id)
      if (cloned) { setSaved((p) => [cloned, ...p]); return }
    } catch {}
    // fallback: load into form as new
    const { id, ...rest } = item
    setForm({ ...blank, ...rest, options: rest.options?.length ? rest.options : blank.options })
    setSel(null)
  }

  const handleConfirmed = async () => {
    setBusy(true)
    const payload = { ...form }
    try {
      if (sel) {
        const updated = await editQuestion(sel, payload)
        setSaved((p) => p.map((t) => (t.id === sel ? { ...t, ...updated } : t)))
        setSel(null); setForm(blank)
      } else {
        const created = await saveQuestion(payload)
        setSaved((p) => [created, ...p]); setForm(blank)
      }
    } catch {
      if (sel) { setSaved((p) => p.map((t) => (t.id === sel ? { ...t, ...payload } : t))); setSel(null); setForm(blank) }
    }
    setBusy(false); setConfirm(false)
  }

  const handleDelete = async (id) => {
    try { await removeQuestion(id) } catch {}
    setSaved((p) => p.filter((t) => t.id !== id))
    if (sel === id) { setForm(blank); setSel(null) }
  }

  const enterSelectMode = (id) => { setSelectMode(true); setSelectedIds([id]) }
  const toggleSelect    = (id) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
  const cancelSelect    = () => { setSelectMode(false); setSelectedIds([]) }
  const deleteSelected  = async () => {
    for (const id of selectedIds) { try { await removeQuestion(id) } catch {} }
    setSaved((p) => p.filter((t) => !selectedIds.includes(t.id)))
    if (selectedIds.includes(sel)) { setForm(blank); setSel(null) }
    setSelectMode(false); setSelectedIds([])
  }

  const summary = [
    { label: 'Patrol Type',   value: form.patrolType },
    { label: 'Question Type', value: form.questionType },
    { label: 'Question',      value: form.question },
    ...form.options.map((o, i) => ({ label: `Option ${i + 1}`, value: o })),
  ]

  const qTypes = ['Fill', 'Yes/No', 'Option']

  const inputStyle = { width: '100%', padding: '10px 14px', border: 'none', borderBottom: '1px solid #e8eaed', fontSize: '13px', color: '#202124', outline: 'none', background: 'transparent', boxSizing: 'border-box' }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(60,64,67,0.15)', alignItems: 'stretch' }}>
      <ConfirmSaveModal open={confirm} onConfirm={handleConfirmed} onCancel={() => setConfirm(false)} loading={busy} isEditing={!!sel} summary={summary} />

      {/* ═══ LEFT: FORM ═══ */}
      <div style={{ flex: '0 0 60%', width: '60%', maxWidth: '60%', display: 'flex', flexDirection: 'column', borderRight: '2px solid #e8eaed', padding: '24px', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', alignSelf: 'stretch' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: '0 0 20px 0', paddingBottom: '16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, lineHeight: '28px' }}>
          {sel ? 'Edit Question' : 'Questions'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Patrol type — dropdown fetched from Others → Patrol Types */}
          <FieldDropdown
            value={form.patrolType}
            onChange={(v) => set('patrolType', v)}
            options={patrolTypeOpts}
            placeholder="Patrol type"
          />

          {/* Question type toggle: Fill | Yes/No | Option */}
          <div style={{ display: 'flex', border: '1px solid #dadce0', borderRadius: '8px', overflow: 'hidden', height: '42px' }}>
            {qTypes.map((t) => (
              <button
                key={t}
                onClick={() => set('questionType', t)}
                style={{
                  flex: 1, border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                  background: form.questionType === t ? '#1a73e8' : '#fff',
                  color: form.questionType === t ? '#fff' : '#202124',
                  transition: 'all 0.15s',
                  borderRight: t !== 'Option' ? '1px solid #dadce0' : 'none',
                }}
              >{t}</button>
            ))}
          </div>

          {/* Question + Options box */}
          <div style={{ border: '1px solid #dadce0', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>

            {/* Write a Question */}
            <div style={{ borderBottom: '1px solid #e8eaed' }}>
              <input
                placeholder="Write a Question"
                value={form.question}
                onChange={(e) => set('question', e.target.value)}
                style={{ ...inputStyle, padding: '14px 16px', width: '100%' }}
              />
            </div>

            {/* Options — only shown when questionType is Option or Yes/No */}
            {form.questionType !== 'Fill' && (
              <div style={{ padding: '8px 0' }}>
                {form.questionType === 'Yes/No' ? (
                  ['Yes', 'No'].map((opt) => (
                    <div key={opt} style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '10px' }}>
                      <span style={{ fontSize: '13px', color: '#202124' }}>{opt}</span>
                    </div>
                  ))
                ) : (
                  <>
                    {form.options.map((opt, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '4px 16px', gap: '10px', borderBottom: i < form.options.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                        <input
                          placeholder="Write a Option"
                          value={opt}
                          onChange={(e) => setOption(i, e.target.value)}
                          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', color: '#202124', background: 'transparent', padding: '8px 0' }}
                        />
                        <button onClick={() => removeOption(i)}
                          style={{ background: 'none', border: 'none', color: '#9aa0a6', fontSize: '18px', cursor: 'pointer', padding: '0', lineHeight: 1, flexShrink: 0 }}>×</button>
                      </div>
                    ))}
                    <button onClick={addOption}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#1a73e8', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '8px 16px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: 1 }}>+</span> Add
                    </button>
                  </>
                )}
              </div>
            )}
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

      {/* ═══ RIGHT: SAVED QUESTIONS ═══ */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '20px 16px 16px', borderBottom: '1px solid #e8eaed', flexShrink: 0, gap: '8px' }}>
          {selectMode ? (
            <>
              <div
                onClick={() => setSelectedIds(selectedIds.length === saved.length ? [] : saved.map((t) => t.id))}
                style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, border: selectedIds.length === saved.length ? '2px solid #1a73e8' : '2px solid #ccc', background: selectedIds.length === saved.length ? '#1a73e8' : selectedIds.length > 0 ? '#e8f0fe' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                {selectedIds.length === saved.length
                  ? <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
                  : selectedIds.length > 0 ? <span style={{ color: '#1a73e8', fontSize: '13px', fontWeight: 700 }}>−</span> : null}
              </div>
              <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', margin: 0 }}>
                {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Saved Question'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                <button onClick={deleteSelected} disabled={selectedIds.length === 0}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: selectedIds.length > 0 ? '#fce8e6' : '#f5f5f5', border: 'none', color: selectedIds.length > 0 ? '#d93025' : '#bbb', fontSize: '12px', fontWeight: 600, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', padding: '5px 10px', borderRadius: '4px' }}>
                  🗑 Delete
                </button>
                <button onClick={cancelSelect}
                  style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: '12px', fontWeight: 500, cursor: 'pointer', padding: '5px 8px', borderRadius: '4px' }}>
                  ✕ Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {showSaved && <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', margin: 0, lineHeight: '28px' }}>Saved Question</h2>}
              <button onClick={() => setShowSaved(!showSaved)}
                style={{ width: '28px', height: '28px', border: '1px solid #dadce0', background: '#f8f9fa', color: '#202124', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
                {showSaved ? '⊏' : '⊐'}
              </button>
            </>
          )}
        </div>

        {/* Saved list */}
        {showSaved && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>
            {saved.map((t, idx) => {
              const displayName = t.question || fallbackNames[idx % fallbackNames.length]
              const isChecked   = selectedIds.includes(t.id)
              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>

                  {/* Checkbox — only in selectMode */}
                  {selectMode && (
                    <div onClick={() => toggleSelect(t.id)}
                      style={{ width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '14px', border: isChecked ? '2px solid #1a73e8' : '2px solid #ccc', background: isChecked ? '#1a73e8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
                      {isChecked && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                    </div>
                  )}

                  {/* Card */}
                  <div style={{ flex: 1, minWidth: 0, border: `1px solid ${selectMode && isChecked ? '#1a73e8' : '#e0e0e0'}`, borderRadius: '10px', padding: '10px 12px', background: selectMode && isChecked ? '#f0f4ff' : '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>

                    {/* Top row: question icon + name + patrol type + menu */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
                        <span style={{ fontSize: '16px', flexShrink: 0 }}>❓</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {displayName}
                          </div>
                          {/* Question type badge */}
                          <span style={{ background: '#1a73e8', color: '#fff', padding: '1px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700 }}>
                            {t.questionType || 'Option'}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <span style={{ fontSize: '11px', color: '#5f6368', whiteSpace: 'nowrap' }}>{t.patrolType || 'Patrol type'}</span>
                        <CardMenu
                          onSelect={() => enterSelectMode(t.id)}
                          onClone={() => handleClone(t)}
                          onEdit={() => handleEdit(t)}
                          onDelete={() => handleDelete(t.id)}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              )
            })}

            {saved.length === 0 && (
              <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '13px', marginTop: '40px' }}>No questions saved yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}