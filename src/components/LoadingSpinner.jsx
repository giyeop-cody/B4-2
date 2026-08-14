export default function LoadingSpinner({ message = '불러오는 중…' }) {
  return (
    <div role="status" aria-live="polite" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0' }}>
      <div aria-hidden="true" style={{ width: 36, height: 36, border: '3px solid #e0e0e0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ marginTop: 16, color: '#888', fontSize: 14 }}>{message}</p>
    </div>
  )
}
