import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ConfirmDialog from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('열리면 경고 대화상자를 표시하고 취소 버튼에 초점을 둔다', () => {
    render(
      <ConfirmDialog
        open
        message="정말 삭제하시겠습니까?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.getByRole('alertdialog')).toHaveAccessibleName('정말 삭제하시겠습니까?')
    expect(screen.getByRole('button', { name: '취소' })).toHaveFocus()
  })

  it('Escape 키를 누르면 닫기 함수를 부른다', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        open
        message="정말 삭제하시겠습니까?"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    )

    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('삭제 중에는 두 버튼을 잠그고 실패 메시지도 표시할 수 있다', () => {
    render(
      <ConfirmDialog
        open
        busy
        error="삭제 권한이 없습니다"
        message="정말 삭제하시겠습니까?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: '취소' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '삭제 중…' })).toBeDisabled()
    expect(screen.getByRole('alert')).toHaveTextContent('삭제 권한이 없습니다')
  })
})
