import { useState, useEffect } from 'react'
import { Checkbox } from 'rsuite'
import { getTasks, createTask, deleteTask, updateTask } from '../../../api'
import {
  MfInput, InputWithPlus, ToggleBtn, SaveBtn, SavedPanelHeader,
  Pill, SectionLabel, CrudMenu, Icons, IconCircle,
} from '../components/MasterFormUI'

const blank = { employeeRoll:'', type:'Option', questions:['',''], zone:'', shift:'' }

export default function TaskForm() {
  const [form, setForm] = useState(blank)
  const [saved, setSaved] = useState([])
  const [busy, setBusy]   = useState(false)
  const [sel, setSel]     = useState(null)

  useEffect(() => { getTasks().then(setSaved).catch(() => {}) }, [])

  const set  = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const setQ = (i, v) => { const qs = [...form.questions]; qs[i] = v; set('questions', qs) }
  const remQ = i => set('questions', form.questions.filter((_, idx) => idx !== i))

  const handleApply = (item) => {
    setForm({ ...blank, ...item, questions: Array.isArray(item.questions) && item.questions.length ? item.questions : ['',''] })
    setSel(item.id)
  }
  const handleCancelEdit = () => { setForm(blank); setSel(null) }

  const handleSave = async () => {
    setBusy(true)
    const payload = { ...form, tags:['Fill','Yes/No','Option'] }
    try {
      if (sel) {
        const updated = typeof updateTask === 'function' ? await updateTask(sel, payload) : { ...payload, id:sel }
        setSaved(p => p.map(t => t.id === sel ? { ...t, ...updated } : t))
        setSel(null); setForm(blank)
      } else {
        const c = await createTask(payload)
        setSaved(p => [c, ...p]); setForm(blank)
      }
    } catch (e) {
      if (sel) { setSaved(p => p.map(t => t.id === sel ? { ...t, ...form } : t)); setSel(null); setForm(blank) }
    }
    setBusy(false)
  }

  const handleDelete = async (id) => {
    try { await deleteTask(id) } catch (e) {}
    setSaved(p => p.filter(t => t.id !== id))
    if (sel === id) { setForm(blank); setSel(null) }
  }

  return (
    <div className="mf-split">

      {/* ── Form ── */}
      <div className="mf-form-col">
        <div className="mf-form-inner">
          <p className="mf-form-title">{sel ? 'Edit Task' : 'Create Task'}</p>

          <div className="mf-section-row">
            <SectionLabel>Task info</SectionLabel>
            <div className="mf-section-fields">
              <MfInput placeholder="Employee roll" value={form.employeeRoll} onChange={v => set('employeeRoll', v)} />

              <div className="mf-toggle-group">
                {['Fill','Yes/No','Option'].map(t => (
                  <ToggleBtn key={t} label={t} active={form.type === t} onClick={() => set('type', t)} />
                ))}
              </div>

              <div className="mf-questions-box">
                {form.questions.map((q, i) => (
                  <div key={i} className="mf-question-row">
                    <Checkbox style={{ flexShrink:0 }} />
                    <MfInput placeholder="Write a question" value={q} onChange={v => setQ(i, v)} />
                    <Icons.Close
                      onClick={() => remQ(i)}
                      style={{ cursor:'pointer', color:'#9ca3af', fontSize:12, flexShrink:0 }}
                    />
                  </div>
                ))}
                <button className="mf-add-question-btn" onClick={() => set('questions', [...form.questions,''])}>
                  <Icons.Plus style={{ fontSize:12 }} /> Add
                </button>
              </div>

              <div className="mf-field-row">
                <div className="mf-field-box"><InputWithPlus placeholder="Zone"  value={form.zone}  onChange={v => set('zone', v)}  options={['Zone 1','Zone 2','Zone 3']} /></div>
                <div className="mf-field-box"><InputWithPlus placeholder="Shift" value={form.shift} onChange={v => set('shift', v)} options={['Shift 1','Shift 2','Shift 3']} /></div>
              </div>
            </div>
          </div>

          <SaveBtn onClick={handleSave} loading={busy} isEditing={!!sel} onCancelEdit={handleCancelEdit} />
        </div>
      </div>

      {/* ── Saved panel ── */}
      <div className="mf-saved-col">
        <SavedPanelHeader title="Saved Task" />
        <div className="mf-saved-list">
          {saved.map(t => (
            <div key={t.id} className={`mf-saved-card${sel === t.id ? ' selected' : ''}`}>
              <div className="mf-card-time-row">
                <IconCircle color="green"><Icons.Check style={{ fontSize:10, color:'#15803d' }} /></IconCircle>
                <span style={{ fontWeight:600, fontSize:12, color:'#374151' }}>{t.name || t.employeeRoll || 'Task'}</span>
                <div className="mf-dot-menu" style={{ marginLeft:'auto' }}>
                  <CrudMenu onSelect={() => handleApply(t)} onDelete={() => handleDelete(t.id)} onApply={() => handleApply(t)} />
                </div>
              </div>
              <div className="mf-saved-card-meta" style={{ marginTop:4 }}>
                {t.employeeRoll && <Pill color="blue">Roll: {t.employeeRoll}</Pill>}
                {t.zone         && <Pill color="green">{t.zone}</Pill>}
                {t.shift        && <Pill color="gray">{t.shift}</Pill>}
              </div>
              <div className="mf-saved-card-tags" style={{ marginTop:5 }}>
                {(t.tags || ['Fill','Yes/No','Option']).map(tag => (
                  <Pill key={tag} color={tag==='Fill'?'gray':tag==='Yes/No'?'blue':'orange'}>{tag}</Pill>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}