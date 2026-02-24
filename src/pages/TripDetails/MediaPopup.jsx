import { useState } from 'react'
import { Modal, IconButton } from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import PlayIcon  from '@rsuite/icons/PlayOutline'
import './MediaPopup.css'

/**
 * MediaPopup
 * type: 'voice' | 'photo' | 'video' | 'message' | 'report'
 * items: array from patrol.media[type]
 */
export default function MediaPopup({ open, onClose, type, items = [], patrolName }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = items[activeIdx]

  const TITLES = {
    voice:   '🎤 Voice Messages',
    photo:   '📷 Photos',
    video:   '🎥 Videos',
    message: '✉️ Messages',
    report:  '📋 Reports',
  }

  return (
    <Modal open={open} onClose={onClose} size="sm" className="media-modal">
      <Modal.Header>
        <Modal.Title style={{ fontSize: 14, fontWeight: 700 }}>
          {TITLES[type]} — <span style={{ color: '#3b7ff5', fontWeight: 500 }}>{patrolName}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: 0 }}>
        {items.length === 0 ? (
          <div className="mp-empty">No {type} files for this patrol.</div>
        ) : (
          <div className="mp-body">

            {/* ── Left: item list ── */}
            <div className="mp-list">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className={`mp-list-item${i === activeIdx ? ' mp-list-item-sel' : ''}`}
                  onClick={() => setActiveIdx(i)}
                >
                  {/* Thumbnail for photo/video */}
                  {(type === 'photo' || type === 'video') && (
                    <div className="mp-thumb-wrap">
                      <img src={item.thumb} alt={item.label} className="mp-thumb" />
                      {type === 'video' && <span className="mp-play-overlay"><PlayIcon /></span>}
                    </div>
                  )}
                  <div className="mp-item-info">
                    <span className="mp-item-label">{item.label}</span>
                    {item.duration && <span className="mp-item-meta">{item.duration}</span>}
                    {item.time     && <span className="mp-item-meta">{item.time}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Right: preview ── */}
            <div className="mp-preview">
              {!active && <div className="mp-empty">Select an item</div>}

              {active && type === 'voice' && (
                <div className="mp-voice">
                  <div className="mp-voice-icon">🎤</div>
                  <div className="mp-voice-label">{active.label}</div>
                  <div className="mp-voice-dur">{active.duration}</div>
                  <audio controls src={active.url} className="mp-audio" />
                </div>
              )}

              {active && type === 'photo' && (
                <div className="mp-photo">
                  <img src={active.url} alt={active.label} className="mp-photo-img" />
                  <div className="mp-caption">{active.label}</div>
                </div>
              )}

              {active && type === 'video' && (
                <div className="mp-video">
                  <video controls src={active.url} className="mp-video-el" key={active.url} />
                  <div className="mp-caption">{active.label}</div>
                </div>
              )}

              {active && type === 'message' && (
                <div className="mp-msg">
                  <div className="mp-msg-time">{active.time}</div>
                  <div className="mp-msg-bubble">{active.text}</div>
                </div>
              )}

              {active && type === 'report' && (
                <div className="mp-report">
                  <div className="mp-report-title">{active.label}</div>
                  <div className="mp-report-time">{active.time}</div>
                  <div className="mp-report-body">{active.text}</div>
                </div>
              )}
            </div>

          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}