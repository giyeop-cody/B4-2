import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

function CurrentLocation() {
  const location = useLocation()
  return <p>{`${location.pathname}${location.search}`}</p>
}

function renderProtected({ user = null, loading = false } = {}) {
  const auth = {
    user,
    loading,
    authAvailable: true,
    sessionError: null,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  }

  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/login" element={<><p>로그인 화면</p><CurrentLocation /></>} />
          <Route path="/profile" element={<ProtectedRoute><p>보호된 프로필</p></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('ProtectedRoute', () => {
  it('로그인 확인 중에는 로딩 상태를 보여준다', () => {
    renderProtected({ loading: true })

    expect(screen.getByText('로그인 상태를 확인하는 중…')).toBeInTheDocument()
  })

  it('로그인하지 않았으면 원래 주소를 담아 로그인으로 보낸다', () => {
    renderProtected()

    expect(screen.getByText('로그인 화면')).toBeInTheDocument()
    expect(screen.getByText('/login?redirect=%2Fprofile')).toBeInTheDocument()
  })

  it('로그인 사용자는 보호된 화면을 볼 수 있다', () => {
    renderProtected({ user: { id: 'user-1', email: 'learner@example.com' } })

    expect(screen.getByText('보호된 프로필')).toBeInTheDocument()
  })
})
