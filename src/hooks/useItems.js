import { useState, useEffect, useCallback } from 'react'
import { db } from '../lib/api'

export function useItems() {
  const [items, setItems] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mutationError, setMutationError] = useState(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setItems(await db.selectAll())
    } catch (requestError) {
      setError(requestError.message || '데이터를 불러오지 못했습니다')
    } finally {
      setLoading(false)
    }
  }, [])

  const addItem = useCallback(async (formData) => {
    setMutationError(null)
    try {
      const created = await db.insert(formData)
      setItems((previous) => previous ? [created, ...previous] : [created])
      return created
    } catch (requestError) {
      setMutationError(requestError.message || '등록에 실패했습니다')
      return null
    }
  }, [])

  const deleteItem = useCallback(async (id) => {
    setMutationError(null)
    try {
      await db.remove(id)
      setItems((previous) => previous
        ? previous.filter((item) => String(item.id) !== String(id))
        : previous)
      return true
    } catch (requestError) {
      setMutationError(requestError.message || '삭제에 실패했습니다')
      return false
    }
  }, [])

  const clearMutationError = useCallback(() => setMutationError(null), [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return {
    items,
    loading,
    error,
    mutationError,
    refetch: fetchItems,
    addItem,
    deleteItem,
    clearMutationError,
  }
}
