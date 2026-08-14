import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import ErrorBanner from '../components/ErrorBanner'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { user, authAvailable, sessionError, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedRedirect = searchParams.get('redirect') || '/profile'
  const redirect = requestedRedirect.startsWith('/') && !requestedRedirect.startsWith('//')
    ? requestedRedirect
    : '/profile'

  const [mode, setMode] = useState('signin')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to={redirect} replace />

  const changeMode = () => {
    setMode((previous) => previous === 'signin' ? 'signup' : 'signin')
    setFormError(null)
    setSuccessMessage(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError(null)
    setSuccessMessage(null)

    if (mode === 'signup' && !displayName.trim()) {
      setFormError('표시 이름을 입력하세요.')
      return
    }
    if (!email.includes('@')) {
      setFormError('올바른 이메일 주소를 입력하세요.')
      return
    }
    if (password.length < 6) {
      setFormError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    setSubmitting(true)
    let result
    try {
      result = mode === 'signin'
        ? await signIn({ email: email.trim(), password })
        : await signUp({ email: email.trim(), password, displayName: displayName.trim() })
    } catch (requestError) {
      setFormError(requestError.message || '인증 요청에 실패했습니다.')
      return
    } finally {
      setSubmitting(false)
    }

    if (result.error) {
      setFormError(result.error.message || '인증 요청에 실패했습니다.')
      return
    }

    if (mode === 'signup' && !result.data?.session) {
      setSuccessMessage('가입 요청이 완료되었습니다. 이메일 확인 뒤 로그인하세요.')
      setMode('signin')
      setPassword('')
      return
    }

    navigate(redirect, { replace: true })
  }

  if (!authAvailable) {
    return (
      <div>
        <h1 style={{ fontSize: 22, marginBottom: 20 }}>로그인</h1>
        <ErrorBanner message="Supabase 인증 설정이 없습니다. 환경변수를 확인하세요." />
        <Link to="/items" style={{ display: 'inline-block', marginTop: 16, color: '#2563eb' }}>목록으로 돌아가기</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>{mode === 'signin' ? '로그인' : '회원가입'}</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
        Supabase Auth로 사용자 상태를 확인합니다.
      </p>
      <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }}>
        {(formError || sessionError) && <ErrorBanner message={formError || sessionError} />}
        {successMessage && <p role="status" style={{ padding: 12, color: '#166534', background: '#dcfce7', borderRadius: 6 }}>{successMessage}</p>}
        {mode === 'signup' && (
          <div>
            <label htmlFor="display-name" style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>표시 이름</label>
            <input id="display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6 }} />
          </div>
        )}
        <div>
          <label htmlFor="auth-email" style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>이메일</label>
          <input id="auth-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6 }} />
        </div>
        <div>
          <label htmlFor="auth-password" style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>비밀번호</label>
          <input id="auth-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6 }} />
        </div>
        <button type="submit" disabled={submitting} style={{ padding: 10, border: 0, borderRadius: 6, color: '#fff', background: '#2563eb', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.65 : 1 }}>
          {submitting ? '처리 중…' : mode === 'signin' ? '로그인' : '가입하기'}
        </button>
      </form>
      <button type="button" onClick={changeMode} style={{ marginTop: 16, border: 0, background: 'transparent', color: '#2563eb', cursor: 'pointer' }}>
        {mode === 'signin' ? '계정이 없나요? 회원가입' : '이미 계정이 있나요? 로그인'}
      </button>
    </div>
  )
}
