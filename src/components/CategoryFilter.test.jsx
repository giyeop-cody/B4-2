import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import CategoryFilter from './CategoryFilter'

describe('CategoryFilter', () => {
  it('카테고리별 개수를 표시하고 선택값을 부모에게 알린다', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <CategoryFilter
        value="전체"
        onChange={onChange}
        counts={{ 전체: 3, 일반: 1, 학습: 2 }}
      />,
    )

    expect(screen.getByRole('option', { name: '전체 (3)' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '학습 (2)' })).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText('카테고리'), '학습')
    expect(onChange).toHaveBeenCalledWith('학습')
  })
})
