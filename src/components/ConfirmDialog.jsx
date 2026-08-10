export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onCancel}>
      <div style={{ background: '#fff', borderRadius: 10, padding: '24px 28px', minWidth: 320, maxWidth: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
        <p style={{ fontSize: 15, color: '#333', margin: '0 0 20px 0' }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '8px 18px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', color: '#555', cursor: 'pointer', fontSize: 14 }}>취소</button>
          <button onClick={onConfirm} style={{ padding: '8px 18px', border: 'none', borderRadius: 6, background: '#dc2626', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>삭제</button>
        </div>
      </div>
    </div>
  )
}
