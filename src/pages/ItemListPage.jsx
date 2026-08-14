import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useItems } from '../hooks/useItems'
import StateView from '../components/StateView'
import ItemCard from '../components/ItemCard'
import ConfirmDialog from '../components/ConfirmDialog'
import ErrorBanner from '../components/ErrorBanner'
import CategoryFilter from '../components/CategoryFilter'

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
  const [category, setCategory] = useState('전체')
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const categoryCounts = useMemo(() => {
    if (!items) return { 전체: 0 }
    return items.reduce((counts, item) => {
      const itemCategory = item.category || '일반'
      counts[itemCategory] = (counts[itemCategory] || 0) + 1
      return counts
    }, { 전체: items.length })
  }, [items])

  const filteredItems = useMemo(() => {
    if (!items || category === '전체') return items
    return items.filter((item) => (item.category || '일반') === category)
  }, [category, items])

  const openDeleteDialog = useCallback((id) => {
    clearMutationError()
    setConfirmId(id)
  }, [clearMutationError])

  const handleDelete = async () => {
    setDeleting(true)
    const ok = await deleteItem(confirmId)
    setDeleting(false)
    if (ok) setConfirmId(null)
  }

  const emptyMessage = category === '전체'
    ? '표시할 데이터가 없습니다.'
    : `${category} 카테고리에 표시할 데이터가 없습니다.`

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>아이템 목록</h1>
        <Link to="/items/new" style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>+ 새 아이템 등록</Link>
      </div>
      <CategoryFilter value={category} onChange={setCategory} counts={categoryCounts} />
      {mutationError && <div style={{ marginBottom: 16 }}><ErrorBanner message={mutationError} /></div>}
      <StateView
        loading={loading}
        error={error}
        data={filteredItems}
        emptyMessage={emptyMessage}
        onRetry={refetch}
      >
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
