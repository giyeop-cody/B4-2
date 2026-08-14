import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ErrorBanner from '../components/ErrorBanner'
import { useAuth } from '../hooks/useAuth'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSignOut = async () => {
    setSubmitting(true)
    setError(null)
    let result
    try {
      result = await signOut()
    } catch (requestError) {
      setError(requestError.message || '로그아웃에 실패했습니다.')
      return
    } finally {
      setSubmitting(false)
    }

    if (result.error) {
      setError(result.error.message || '로그아웃에 실패했습니다.')
      return
    }
    navigate('/items', { replace: true })
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>내 프로필</h1>
      {error && <div style={{ marginBottom: 16 }}><ErrorBanner message={error} /></div>}
      <section style={{ padding: 24, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, margin: 0 }}>
          <dt style={{ fontWeight: 700 }}>표시 이름</dt>
          <dd style={{ margin: 0 }}>{user.user_metadata?.display_name || '설정 안 함'}</dd>
          <dt style={{ fontWeight: 700 }}>이메일</dt>
          <dd style={{ margin: 0 }}>{user.email}</dd>
          <dt style={{ fontWeight: 700 }}>가입일</dt>
          <dd style={{ margin: 0 }}>{user.created_at ? new Date(user.created_at).toLocaleString('ko-KR') : '-'}</dd>
        </dl>
        <button type="button" onClick={handleSignOut} disabled={submitting} style={{ marginTop: 24, padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', cursor: submitting ? 'not-allowed' : 'pointer' }}>
          {submitting ? '로그아웃 중…' : '로그아웃'}
        </button>
      </section>
    </div>
  )
}
