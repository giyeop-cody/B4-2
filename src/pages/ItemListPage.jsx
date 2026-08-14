import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useItems } from '../hooks/useItems'
import StateView from '../components/StateView'
import ItemCard from '../components/ItemCard'
import ConfirmDialog from '../components/ConfirmDialog'
import ErrorBanner from '../components/ErrorBanner'

export default function ItemListPage() {
  const {
    items,
    loading,
    error,
    mutationError,
    refetch,
    deleteItem,
    clearMutationError,
  } = useItems()
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const openDeleteDialog = (id) => {
    clearMutationError()
    setConfirmId(id)
  }

  const handleDelete = async () => {
    setDeleting(true)
    const ok = await deleteItem(confirmId)
    setDeleting(false)
    if (ok) setConfirmId(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>아이템 목록</h1>
        <Link to="/items/new" style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>+ 새 아이템</Link>
      </div>
      {mutationError && <div style={{ marginBottom: 16 }}><ErrorBanner message={mutationError} /></div>}
      <StateView loading={loading} error={error} data={items} emptyMessage="표시할 데이터가 없습니다." emptyActionLabel="첫 아이템 등록하기" emptyActionTo="/items/new" onRetry={refetch}>
        {(data) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.map((item) => <ItemCard key={item.id} item={item} onDelete={openDeleteDialog} />)}
          </div>
        )}
      </StateView>
      <ConfirmDialog
        open={confirmId !== null}
        message="정말 삭제하시겠습니까?"
        busy={deleting}
        error={mutationError}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  )
}
