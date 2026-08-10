export default function ErrorBanner({ message = '요청에 실패했습니다. 다시 시도하세요.', onRetry }) {
  return (
    <div style={{ border: '1px solid #fecaca', background: '#fef2f2', borderRadius: 8, padding: '20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 28 }}>⚠️</span>
      <p style={{ color: '#b91c1c', fontSize: 14, fontWeight: 500, margin: 0 }}>{message}</p>
      {onRetry && <button onClick={onRetry} style={{ padding: '6px 16px', border: '1px solid #b91c1c', borderRadius: 6, background: '#fff', color: '#b91c1c', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>다시 시도</button>}
    </div>
  )
}
