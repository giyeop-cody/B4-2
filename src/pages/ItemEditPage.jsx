import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useItem } from '../hooks/useItem'
import ItemForm from '../components/ItemForm'
import StateView from '../components/StateView'

export default function ItemEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { item, loading, error, updateItem } = useItem(id)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    const ok = await updateItem(formData)
    setSubmitting(false)
    if (ok) navigate(`/items/${id}`)
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}><Link to={`/items/${id}`} style={{ color: '#3b82f6', textDecoration: 'none', fontSize: 14 }}>← 상세로</Link></div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>아이템 수정</h1>
      <StateView loading={loading} error={error} data={item} emptyMessage="존재하지 않는 항목입니다.">
        {(data) => (
          <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 24, background: '#fff' }}>
            <ItemForm initialData={data} onSubmit={handleSubmit} submitting={submitting} />
          </div>
        )}
      </StateView>
    </div>
  )
}
