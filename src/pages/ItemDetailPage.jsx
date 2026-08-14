import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useItem } from '../hooks/useItem'
import StateView from '../components/StateView'
import ConfirmDialog from '../components/ConfirmDialog'
import ErrorBanner from '../components/ErrorBanner'

export default function ItemDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    item,
    loading,
    error,
    mutationError,
    refetch,
    deleteItem,
    clearMutationError,
  } = useItem(id)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const openDeleteDialog = () => {
    clearMutationError()
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    setDeleting(true)
    const ok = await deleteItem()
    setDeleting(false)
    if (ok) navigate('/items')
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}><Link to="/items" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: 14 }}>← 목록으로</Link></div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>아이템 상세</h1>
      {mutationError && <div style={{ marginBottom: 16 }}><ErrorBanner message={mutationError} /></div>}
      <StateView loading={loading} error={error} data={item} emptyMessage="존재하지 않는 항목입니다." onRetry={refetch}>
        {(data) => (
          <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 24, background: '#fff' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{data.title}</h2>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500, background: '#f3f4f6', color: '#374151' }}>{data.category || '일반'}</span>
              <span style={{ color: '#aaa', fontSize: 13 }}>{data.created_at ? new Date(data.created_at).toLocaleString('ko-KR') : ''}</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: '#444', whiteSpace: 'pre-wrap' }}>{data.content}</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
              <Link to={`/items/${data.id}/edit`} style={{ padding: '6px 16px', border: '1px solid #d1d5db', borderRadius: 5, background: '#fff', color: '#555', textDecoration: 'none', fontSize: 13 }}>수정</Link>
              <button onClick={openDeleteDialog} style={{ padding: '6px 16px', border: '1px solid #fecaca', borderRadius: 5, background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 13 }}>삭제</button>
            </div>
          </div>
        )}
      </StateView>
      <ConfirmDialog
        open={confirmOpen}
        message="정말 삭제하시겠습니까?"
        busy={deleting}
        error={mutationError}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
