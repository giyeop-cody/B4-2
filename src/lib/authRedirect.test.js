import { describe, expect, it } from 'vitest'
import { buildAuthRedirectURL } from './authRedirect'

describe('buildAuthRedirectURL', () => {
  it('설정한 배포 주소가 있으면 localhost보다 먼저 사용한다', () => {
    expect(buildAuthRedirectURL('https://b4-2.vercel.app', 'http://localhost:5173'))
      .toBe('https://b4-2.vercel.app')
  })

  it('별도 설정이 없으면 현재 브라우저 origin을 사용한다', () => {
    expect(buildAuthRedirectURL('', 'https://preview.example.com'))
      .toBe('https://preview.example.com')
  })

  it('HashRouter 경로와 기존 path를 제거하고 origin만 반환한다', () => {
    expect(buildAuthRedirectURL('https://b4-2.vercel.app/#/login', 'http://localhost:5173'))
      .toBe('https://b4-2.vercel.app')
  })
})
