import { Link } from 'react-router-dom'
export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h1 style={{ fontSize: 64, fontWeight: 800, color: '#d1d5db', margin: '0 0 8px 0' }}>404</h1>
      <p style={{ fontSize: 18, color: '#666', marginBottom: 24 }}>페이지를 찾을 수 없습니다</p>
      <Link to="/items" style={{ display: 'inline-block', padding: '10px 24px', background: '#3b82f6', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>목록으로 돌아가기</Link>
    </div>
  )
}
