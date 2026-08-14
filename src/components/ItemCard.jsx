import { memo } from 'react'
import { Link } from 'react-router-dom'

function ItemCard({ item, onDelete, canWrite = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, border: '1px solid #e0e0e0', borderRadius: 8, padding: '16px 20px', background: '#fff' }}>
      <div style={{ flex: 1 }}>
        <Link to={`/items/${item.id}`} style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', textDecoration: 'none', display: 'block', marginBottom: 6 }}>{item.title}</Link>
        <p style={{ fontSize: 14, color: '#666', margin: '0 0 10px 0', lineHeight: 1.5 }}>{item.content}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500, background: '#f3f4f6', color: '#374151' }}>{item.category || '일반'}</span>
          <span style={{ color: '#aaa', fontSize: 12 }}>{item.created_at ? new Date(item.created_at).toLocaleDateString('ko-KR') : ''}</span>
        </div>
      </div>
      {canWrite && (
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <Link to={`/items/${item.id}/edit`} style={{ padding: '5px 12px', border: '1px solid #d1d5db', borderRadius: 5, background: '#fff', color: '#555', textDecoration: 'none', fontSize: 13 }}>수정</Link>
          <button onClick={() => onDelete(item.id)} style={{ padding: '5px 12px', border: '1px solid #fecaca', borderRadius: 5, background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 13 }}>삭제</button>
        </div>
      )}
    </div>
  )
}

export default memo(ItemCard)
