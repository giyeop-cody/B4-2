import { useState, useEffect, useCallback } from 'react'
import { db } from '../lib/api'

export function useItem(id) {
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mutationError, setMutationError] = useState(null)

  const fetchItem = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setItem(await db.selectById(id))
    } catch (requestError) {
      setError(requestError.message || '데이터를 불러오지 못했습니다')
    } finally {
      setLoading(false)
    }
  }, [id])

  const updateItem = useCallback(async (formData) => {
    setMutationError(null)
    try {
      const updated = await db.update(id, formData)
      setItem(updated)
      return updated
    } catch (requestError) {
      setMutationError(requestError.message || '수정에 실패했습니다')
      return null
    }
  }, [id])

  const deleteItem = useCallback(async () => {
    setMutationError(null)
    try {
      await db.remove(id)
      return true
    } catch (requestError) {
      setMutationError(requestError.message || '삭제에 실패했습니다')
      return false
    }
  }, [id])

  useEffect(() => {
    if (id) fetchItem()
  }, [id, fetchItem])

  return {
    item,
    loading,
    error,
    mutationError,
    refetch: fetchItem,
    updateItem,
    deleteItem,
    clearMutationError: () => setMutationError(null),
  }
}
