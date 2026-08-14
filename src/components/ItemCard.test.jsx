import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ItemCard from './ItemCard'

const item = {
  id: 'item-1',
  title: '권한 테스트',
  content: '공개 조회와 로그인 쓰기를 구분합니다.',
  category: '학습',
}

function renderCard(canWrite) {
  render(
    <MemoryRouter>
      <ItemCard item={item} canWrite={canWrite} onDelete={vi.fn()} />
    </MemoryRouter>,
  )
}

describe('ItemCard 쓰기 권한 UI', () => {
  it('비로그인 사용자에게 수정과 삭제를 숨긴다', () => {
    renderCard(false)
    expect(screen.queryByRole('link', { name: '수정' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '삭제' })).not.toBeInTheDocument()
  })

  it('쓰기 가능한 사용자에게 수정과 삭제를 보여준다', () => {
    renderCard(true)
    expect(screen.getByRole('link', { name: '수정' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument()
  })
})
