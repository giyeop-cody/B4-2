import { useState, useEffect, useCallback } from 'react'
import { db } from '../lib/api'

export function useItem(id) {
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchItem = useCallback(async () => {
    setLoading(true); setError(null)
    try { setItem(await db.selectById(id)) }
    catch (e) { setError(e.message || '데이터를 불러오지 못했습니다') }
    finally { setLoading(false) }
  }, [id])

  const updateItem = useCallback(async (formData) => {
    setLoading(true); setError(null)
    try { await db.update(id, formData); await fetchItem(); return true }
    catch (e) { setError(e.message || '수정에 실패했습니다'); setLoading(false); return false }
  }, [id, fetchItem])

  useEffect(() => { if (id) fetchItem() }, [fetchItem])
  return { item, loading, error, updateItem }
}
