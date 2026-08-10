import { useState, useEffect, useCallback } from 'react'
import { db } from '../lib/api'

export function useItems() {
  const [items, setItems] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchItems = useCallback(async () => {
    setLoading(true); setError(null)
    try { setItems(await db.selectAll()) }
    catch (e) { setError(e.message || '데이터를 불러오지 못했습니다') }
    finally { setLoading(false) }
  }, [])

  const addItem = useCallback(async (formData) => {
    setLoading(true); setError(null)
    try { await db.insert(formData); await fetchItems(); return true }
    catch (e) { setError(e.message || '등록에 실패했습니다'); setLoading(false); return false }
  }, [fetchItems])

  const deleteItem = useCallback(async (id) => {
    setError(null)
    try { await db.remove(id); setItems(prev => prev ? prev.filter(i => String(i.id) !== String(id)) : prev); return true }
    catch (e) { setError(e.message || '삭제에 실패했습니다'); return false }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])
  return { items, loading, error, refetch: fetchItems, addItem, deleteItem }
}
