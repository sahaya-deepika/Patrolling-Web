// src/pages/MasterForm/forms/TaskForm.jsx
import React, { useState, useEffect } from 'react'
import { Input, Checkbox } from 'rsuite'
import { Icons, MfInput, InputWithPlus, ToggleBtn, SaveBtn, SavedPanelHeader, Pill, IconCircle, SectionLabel } from '../components/MasterFormUI'
import { getTasks, createTask } from '../../../api'

export default function TaskForm() {
  const blank = { employeeRoll: '', type: 'Option', questions: ['', ''], zone: '', shift: '' }
  const [form, setForm]   = useState(blank)
  const [saved, setSaved] = useState([])
  const [busy, setBusy]   = useState(false)

  useEffect(() => { getTasks().then(setSaved) }, [])
  const set  = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const setQ = (i, v) => { const qs = [...form.questions]; qs[i] = v; set('questions', qs) }

  const handleSave = async () => {
    setBusy(true)
    const created = await createTask({ ...form, tags: ['Fill', 'Yes/No', 'Option'] })
    setSaved(p => [created, ...p])
    setForm(blank)
    setBusy(false)
  }

  return (
    <div className="mf-split">
      <div className="mf-form-col">
        <p className="mf-form-title">Create Task</p>
        <div className="mf-section-row">
          <SectionLabel>Task info</SectionLabel>
          <div className="mf-section-fields">
            <MfInput placeholder="Employee roll" value={form.employeeRoll} onChange={v => set('employeeRoll', v)} />
            <div className="mf-toggle-group">
              {['Fill', 'Yes/No', 'Option'].map(t => (
                <ToggleBtn key={t} label={t} active={form.type === t} onClick={() => set('type', t)} />
              ))}
            </div>
            <div className="mf-questions-box">
              {form.questions.map((q, i) => (
                <div key={i} className="mf-question-row">
                  <Checkbox style={{ flexShrink: 0 }} />
                  <Input placeholder="Write a question" value={q} onChange={v => setQ(i, v)}
                    style={{ border: 'none', background: 'transparent', fontSize: 13, flex: 1 }} />
                </div>
              ))}
              <button className="mf-add-question-btn" onClick={() => set('questions', [...form.questions, ''])}>
                <Icons.Plus /> Add
              </button>
            </div>
            <div className="mf-field-row">
              <div className="mf-field-box"><InputWithPlus placeholder="Zone"  value={form.zone}  onChange={v => set('zone', v)}  /></div>
              <div className="mf-field-box"><InputWithPlus placeholder="Shift" value={form.shift} onChange={v => set('shift', v)} /></div>
            </div>
          </div>
        </div>
        <SaveBtn onClick={handleSave} loading={busy} />
      </div>

      <div className="mf-saved-col">
        <SavedPanelHeader title="Saved Task" />
        <div className="mf-saved-list">
          {saved.map((t, i) => (
            <div key={t.id || i} className="mf-saved-card">
              <div className="mf-saved-card-top">
                <IconCircle color="green"><Icons.Check /></IconCircle>
                <span className="mf-saved-card-name">{t.name || 'Questions 04'}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                  <Pill color="blue">Employee roll</Pill>
                  <Pill color="green">Zone</Pill>
                </div>
              </div>
              <div className="mf-saved-card-tags">
                {(t.tags || ['Fill', 'Yes/No', 'Option']).map(tag => (
                  <Pill key={tag} color={tag === 'Fill' ? 'gray' : tag === 'Yes/No' ? 'blue' : 'orange'}>{tag}</Pill>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}