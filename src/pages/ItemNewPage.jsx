import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useItems } from '../hooks/useItems'
import ItemForm from '../components/ItemForm'

export default function ItemNewPage() {
  const navigate = useNavigate()
  const { addItem, mutationError } = useItems()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    const created = await addItem(formData)
    setSubmitting(false)
    if (created) navigate(`/items/${created.id}`)
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}><Link to="/items" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: 14 }}>← 목록으로</Link></div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>새 아이템 등록</h1>
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 24, background: '#fff' }}>
        <ItemForm onSubmit={handleSubmit} submitting={submitting} submitError={mutationError} />
      </div>
    </div>
  )
}
