import { Link } from 'react-router-dom'
export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #e0e0e0', background: '#fff' }}>
        <Link to="/items" style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', textDecoration: 'none' }}>📝 Item Manager</Link>
        <nav style={{ display: 'flex', gap: 16 }}>
          <Link to="/items" style={{ color: '#555', textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 6 }}>목록</Link>
          <Link to="/items/new" style={{ color: '#555', textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 6 }}>등록</Link>
        </nav>
      </header>
      <main style={{ flex: 1, padding: '24px', maxWidth: 960, margin: '0 auto', width: '100%' }}>{children}</main>
      <footer style={{ padding: '12px 24px', textAlign: 'center', color: '#999', fontSize: 13, borderTop: '1px solid #e0e0e0' }}>B4-2 React CRUD · Codyssey</footer>
    </div>
  )
}
