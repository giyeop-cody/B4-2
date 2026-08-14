import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ItemForm from './ItemForm'

describe('ItemForm', () => {
  it('필수값이 비어 있으면 오류를 보이고 제출하지 않는다', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ItemForm onSubmit={onSubmit} submitting={false} />)

    await user.click(screen.getByRole('button', { name: '저장' }))

    expect(screen.getByText('제목을 입력하세요')).toBeInTheDocument()
    expect(screen.getByText('내용을 입력하세요')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('올바른 입력은 공백을 정리하여 부모에게 보낸다', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ItemForm onSubmit={onSubmit} submitting={false} />)

    await user.type(screen.getByLabelText(/^제목/), '  테스트 제목  ')
    await user.selectOptions(screen.getByLabelText('카테고리'), '학습')
    await user.type(screen.getByLabelText(/^내용/), '  테스트 내용  ')
    await user.click(screen.getByRole('button', { name: '저장' }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: '테스트 제목',
      content: '테스트 내용',
      category: '학습',
    })
  })

  it('제출 중에는 버튼을 비활성화한다', () => {
    render(<ItemForm onSubmit={vi.fn()} submitting />)

    expect(screen.getByRole('button', { name: '저장 중…' })).toBeDisabled()
  })

  it('원격 저장 실패 메시지를 폼 안에 보여준다', () => {
    render(<ItemForm onSubmit={vi.fn()} submitting={false} submitError="저장 권한이 없습니다" />)

    expect(screen.getByText('저장 권한이 없습니다')).toBeInTheDocument()
  })
})
