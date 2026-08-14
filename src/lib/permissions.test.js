import { describe, expect, it } from 'vitest'
import { canWriteItems } from './permissions'

describe('canWriteItems', () => {
  it('비로그인 원격 사용자는 쓸 수 없다', () => {
    expect(canWriteItems(null, false)).toBe(false)
  })

  it('로그인 사용자는 쓸 수 있다', () => {
    expect(canWriteItems({ id: 'user-1' }, false)).toBe(true)
  })

  it('명시적 LocalStorage 학습 모드에서는 쓰기 연습을 허용한다', () => {
    expect(canWriteItems(null, true)).toBe(true)
  })
})
