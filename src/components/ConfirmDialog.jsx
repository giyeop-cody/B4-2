import { useEffect, useId, useRef } from 'react'

export default function ConfirmDialog({
  open,
  message,
  onConfirm,
  onCancel,
  busy = false,
  error = null,
}) {
  const messageId = useId()
  const cancelButtonRef = useRef(null)

  useEffect(() => {
    if (open) cancelButtonRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const closeWithEscape = (event) => {
      if (event.key === 'Escape' && !busy) onCancel()
    }
    document.addEventListener('keydown', closeWithEscape)
    return () => document.removeEventListener('keydown', closeWithEscape)
  }, [busy, onCancel, open])

  if (!open) return null

  const cancel = () => {
    if (!busy) onCancel()
  }

  return (
    <div
      role="presentation"
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) cancel()
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={messageId}
        aria-busy={busy}
        style={{ background: '#fff', borderRadius: 10, padding: '24px 28px', minWidth: 320, maxWidth: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
      >
        <p id={messageId} style={{ fontSize: 15, color: '#333', margin: '0 0 20px 0' }}>{message}</p>
        {error && <p role="alert" style={{ color: '#b91c1c', fontSize: 13, margin: '0 0 16px 0' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            ref={cancelButtonRef}
            type="button"
            disabled={busy}
            onClick={cancel}
            style={{ padding: '8px 18px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', color: '#555', cursor: busy ? 'not-allowed' : 'pointer', fontSize: 14 }}
          >
            취소
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            style={{ padding: '8px 18px', border: 'none', borderRadius: 6, background: '#dc2626', color: '#fff', cursor: busy ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, opacity: busy ? 0.65 : 1 }}
          >
            {busy ? '삭제 중…' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  )
}
