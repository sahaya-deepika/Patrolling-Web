
import { useState, useEffect } from 'react'
import { Checkbox } from 'rsuite'
import { getTasks, createTask, deleteTask } from '../../../api'
import { MfInput, InputWithPlus, ToggleBtn, SaveBtn, SavedPanelHeader, Pill, SectionLabel, CrudMenu, Icons, IconCircle } from '../components/MasterFormUI'

const blank = { employeeRoll:'', type:'Option', questions:['',''], zone:'', shift:'' }

export default function TaskForm() {
  const [form, setForm]   = useState(blank)
  const [saved, setSaved] = useState([])
  const [busy, setBusy]   = useState(false)
  const [sel,  setSel]    = useState(null)

  useEffect(() => { getTasks().then(setSaved).catch(() => {}) }, [])
  const set  = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const setQ = (i, v) => { const qs=[...form.questions]; qs[i]=v; set('questions',qs) }
  const remQ = i => set('questions', form.questions.filter((_,idx) => idx !== i))

  const handleSave = async () => {
    setBusy(true)
    try { const c = await createTask({ ...form, tags:['Fill','Yes/No','Option'] }); setSaved(p=>[c,...p]); setForm(blank) } catch(e) {}
    setBusy(false)
  }
  const handleDelete = async id => { try { await deleteTask(id); setSaved(p => p.filter(t => t.id !== id)) } catch(e) {} }

  return (
    <div className="mf-split">
      <div className="mf-form-col">
        <p className="mf-form-title">Create Task</p>
        <div className="mf-section-row">
          <SectionLabel>Task info</SectionLabel>
          <div className="mf-section-fields">
            <MfInput placeholder="Employee roll" value={form.employeeRoll} onChange={v => set('employeeRoll', v)} />
            <div className="mf-toggle-group">
              {['Fill','Yes/No','Option'].map(t => (
                <ToggleBtn key={t} label={t} active={form.type===t} onClick={() => set('type',t)} />
              ))}
            </div>
            <div className="mf-questions-box">
              {form.questions.map((q,i) => (
                <div key={i} className="mf-question-row">
                  <Checkbox style={{ flexShrink:0 }} />
                  <MfInput placeholder="Write a question" value={q} onChange={v => setQ(i, v)} />
                  <button onClick={() => remQ(i)} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', padding:'0 4px' }}>✕</button>
                </div>
              ))}
              <button className="mf-add-question-btn" onClick={() => set('questions',[...form.questions,''])}>
                <Icons.Plus style={{ fontSize:12 }} /> Add
              </button>
            </div>
            <div className="mf-field-row">
              <div className="mf-field-box"><InputWithPlus placeholder="Zone"  value={form.zone}  onChange={v => set('zone', v)}  options={['Zone 1','Zone 2','Zone 3']} /></div>
              <div className="mf-field-box"><InputWithPlus placeholder="Shift" value={form.shift} onChange={v => set('shift', v)} options={['Shift 1','Shift 2','Shift 3']} /></div>
            </div>
          </div>
        </div>
        <SaveBtn onClick={handleSave} loading={busy} />
      </div>

      <div className="mf-saved-col">
        <SavedPanelHeader title="Saved Task" />
        <div className="mf-saved-list">
          {saved.map(t => (
            <div key={t.id} className={`mf-saved-card${sel===t.id?' selected':''}`}>
              <div className="mf-saved-card-top">
                <IconCircle color="green"><Icons.Check style={{ fontSize:10, color:'#15803d' }} /></IconCircle>
                <span className="mf-saved-card-name">{t.name||'Questions'}</span>
                <div style={{ marginLeft:'auto', display:'flex', gap:4 }}>
                  <Pill color="blue">Employee roll</Pill>
                  <Pill color="green">Zone</Pill>
                </div>
                <CrudMenu onSelect={() => { setSel(t.id) }} onDelete={() => handleDelete(t.id)} onApply={() => setSel(t.id)} />
              </div>
              <div className="mf-saved-card-tags">
                {(t.tags||['Fill','Yes/No','Option']).map(tag => (
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