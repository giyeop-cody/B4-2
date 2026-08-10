import { Link } from 'react-router-dom'
export default function EmptyState({ message = '표시할 데이터가 없습니다.', actionLabel, actionTo }) {
  return (
    <div style={{ border: '1px dashed #d1d5db', borderRadius: 8, padding: '48px 24px', textAlign: 'center' }}>
      <span style={{ fontSize: 32 }}>📭</span>
      <p style={{ color: '#888', fontSize: 15, marginTop: 12, marginBottom: 0 }}>{message}</p>
      {actionLabel && actionTo && <Link to={actionTo} style={{ display: 'inline-block', marginTop: 16, padding: '8px 20px', background: '#3b82f6', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>{actionLabel}</Link>}
    </div>
  )
}
