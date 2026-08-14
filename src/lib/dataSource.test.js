import { describe, expect, it } from 'vitest'
import { resolveDataSource } from './dataSource'

describe('resolveDataSource', () => {
  it('URL과 키가 있으면 원격 Supabase를 먼저 고른다', () => {
    expect(resolveDataSource({ url: 'https://example.supabase.co', key: 'public-key', allowLocalDB: 'true' })).toBe('supabase')
  })

  it('명시적으로 허용한 경우에만 로컬 모드를 고른다', () => {
    expect(resolveDataSource({ url: '', key: '', allowLocalDB: 'true' })).toBe('local')
  })

  it('원격 설정과 로컬 허용이 모두 없으면 설정 누락으로 판단한다', () => {
    expect(resolveDataSource({ url: '', key: '', allowLocalDB: 'false' })).toBe('missing')
  })
})
