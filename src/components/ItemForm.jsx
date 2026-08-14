import { useId, useState } from 'react'
import ErrorBanner from './ErrorBanner'

export default function ItemForm({ initialData, onSubmit, submitting, submitError }) {
  const formId = useId()
  const titleId = `${formId}-title`
  const titleErrorId = `${titleId}-error`
  const categoryId = `${formId}-category`
  const contentId = `${formId}-content`
  const contentErrorId = `${contentId}-error`

  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [category, setCategory] = useState(initialData?.category || '일반')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const nextErrors = {}
    if (!title.trim()) nextErrors.title = '제목을 입력하세요'
    else if (title.trim().length < 2) nextErrors.title = '제목은 최소 2자 이상이어야 합니다'
    if (!content.trim()) nextErrors.content = '내용을 입력하세요'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return
    onSubmit({ title: title.trim(), content: content.trim(), category })
  }

  return (
    <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {submitError && <ErrorBanner message={submitError} />}
      <div>
        <label htmlFor={titleId} style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#333' }}>
          제목 <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>
        </label>
        <input
          id={titleId}
          type="text"
          value={title}
          aria-required="true"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? titleErrorId : undefined}
          onChange={(event) => {
            setTitle(event.target.value)
            if (errors.title) setErrors((previous) => ({ ...previous, title: null }))
          }}
          style={errors.title
            ? { width: '100%', padding: '10px 12px', border: '1px solid #dc2626', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }
            : { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
          placeholder="제목을 입력하세요"
        />
        {errors.title && <p id={titleErrorId} role="alert" style={{ color: '#dc2626', fontSize: 13, margin: '4px 0 0 0' }}>{errors.title}</p>}
      </div>
      <div>
        <label htmlFor={categoryId} style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#333' }}>카테고리</label>
        <select
          id={categoryId}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
        >
          <option value="일반">일반</option>
          <option value="학습">학습</option>
          <option value="도구">도구</option>
          <option value="백엔드">백엔드</option>
        </select>
      </div>
      <div>
        <label htmlFor={contentId} style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#333' }}>
          내용 <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>
        </label>
        <textarea
          id={contentId}
          value={content}
          aria-required="true"
          aria-invalid={Boolean(errors.content)}
          aria-describedby={errors.content ? contentErrorId : undefined}
          onChange={(event) => {
            setContent(event.target.value)
            if (errors.content) setErrors((previous) => ({ ...previous, content: null }))
          }}
          style={errors.content
            ? { width: '100%', padding: '10px 12px', border: '1px solid #dc2626', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', height: 120, resize: 'vertical' }
            : { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', height: 120, resize: 'vertical' }}
          placeholder="내용을 입력하세요"
        />
        {errors.content && <p id={contentErrorId} role="alert" style={{ color: '#dc2626', fontSize: 13, margin: '4px 0 0 0' }}>{errors.content}</p>}
      </div>
      <div>
        <button
          type="submit"
          disabled={submitting}
          style={submitting
            ? { padding: '10px 28px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'not-allowed', opacity: 0.6 }
            : { padding: '10px 28px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          {submitting ? '저장 중…' : '저장'}
        </button>
      </div>
    </form>
  )
}
