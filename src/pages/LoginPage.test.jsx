import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../context/AuthContext'
import LoginPage from './LoginPage'

function renderLogin(overrides = {}) {
  const auth = {
    user: null,
    loading: false,
    authAvailable: true,
    sessionError: null,
    signIn: vi.fn().mockResolvedValue({ data: null, error: null }),
    signUp: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    signOut: vi.fn(),
    ...overrides,
  }

  render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthContext.Provider>,
  )
  return auth
}

describe('LoginPage', () => {
  it('잘못된 이메일과 짧은 비밀번호를 Supabase에 보내지 않는다', async () => {
    const user = userEvent.setup()
    const auth = renderLogin()

    await user.type(screen.getByLabelText('이메일'), 'wrong-address')
    await user.type(screen.getByLabelText('비밀번호'), '123')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(screen.getByText('올바른 이메일 주소를 입력하세요.')).toBeInTheDocument()
    expect(auth.signIn).not.toHaveBeenCalled()
  })

  it('회원가입 뒤 세션이 없으면 이메일 확인 안내를 보여준다', async () => {
    const user = userEvent.setup()
    const auth = renderLogin()

    await user.click(screen.getByRole('button', { name: '계정이 없나요? 회원가입' }))
    await user.type(screen.getByLabelText('표시 이름'), '학습자')
    await user.type(screen.getByLabelText('이메일'), 'learner@example.com')
    await user.type(screen.getByLabelText('비밀번호'), 'password123')
    await user.click(screen.getByRole('button', { name: '가입하기' }))

    expect(auth.signUp).toHaveBeenCalledWith({
      displayName: '학습자',
      email: 'learner@example.com',
      password: 'password123',
    })
    expect(screen.getByRole('status')).toHaveTextContent('이메일 확인 뒤 로그인하세요')
  })
})
