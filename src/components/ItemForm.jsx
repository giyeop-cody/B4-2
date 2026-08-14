import { useState } from 'react'
import ErrorBanner from './ErrorBanner'

export default function ItemForm({ initialData, onSubmit, submitting, submitError }) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [category, setCategory] = useState(initialData?.category || '일반')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!title.trim()) e.title = '제목을 입력하세요'
    else if (title.trim().length < 2) e.title = '제목은 최소 2자 이상이어야 합니다'
    if (!content.trim()) e.content = '내용을 입력하세요'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ title: title.trim(), content: content.trim(), category })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {submitError && <ErrorBanner message={submitError} />}
      <div>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#333' }}>제목 <span style={{ color: '#dc2626' }}>*</span></label>
        <input type="text" value={title} onChange={e => { setTitle(e.target.value); if (errors.title) setErrors(p => ({ ...p, title: null })) }} style={errors.title ? { width: '100%', padding: '10px 12px', border: '1px solid #dc2626', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' } : { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} placeholder="제목을 입력하세요" />
        {errors.title && <p style={{ color: '#dc2626', fontSize: 13, margin: '4px 0 0 0' }}>{errors.title}</p>}
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#333' }}>카테고리</label>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}>
          <option value="일반">일반</option><option value="학습">학습</option><option value="도구">도구</option><option value="백엔드">백엔드</option>
        </select>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#333' }}>내용 <span style={{ color: '#dc2626' }}>*</span></label>
        <textarea value={content} onChange={e => { setContent(e.target.value); if (errors.content) setErrors(p => ({ ...p, content: null })) }} style={errors.content ? { width: '100%', padding: '10px 12px', border: '1px solid #dc2626', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', height: 120, resize: 'vertical' } : { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', height: 120, resize: 'vertical' }} placeholder="내용을 입력하세요" />
        {errors.content && <p style={{ color: '#dc2626', fontSize: 13, margin: '4px 0 0 0' }}>{errors.content}</p>}
      </div>
      <div>
        <button type="submit" disabled={submitting} style={submitting ? { padding: '10px 28px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'not-allowed', opacity: 0.6 } : { padding: '10px 28px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{submitting ? '저장 중…' : '저장'}</button>
      </div>
    </form>
  )
}
