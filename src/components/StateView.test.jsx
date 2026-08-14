import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import StateView from './StateView'

describe('StateView', () => {
  it('불러오는 동안 로딩 문구를 보여준다', () => {
    render(<StateView loading data={null}>{() => <p>완료</p>}</StateView>)

    expect(screen.getByText('불러오는 중…')).toBeInTheDocument()
    expect(screen.queryByText('완료')).not.toBeInTheDocument()
  })

  it('오류와 다시 시도 버튼을 보여준다', () => {
    const retry = vi.fn()
    render(
      <StateView loading={false} error="연결 실패" data={null} onRetry={retry}>
        {() => <p>완료</p>}
      </StateView>,
    )

    screen.getByRole('button', { name: '다시 시도' }).click()
    expect(screen.getByText('연결 실패')).toBeInTheDocument()
    expect(retry).toHaveBeenCalledOnce()
  })

  it('빈 배열이면 빈 상태 문구를 보여준다', () => {
    render(
      <StateView loading={false} error={null} data={[]} emptyMessage="자료가 없습니다">
        {() => <p>완료</p>}
      </StateView>,
    )

    expect(screen.getByText('자료가 없습니다')).toBeInTheDocument()
  })

  it('데이터가 있으면 자식 화면에 데이터를 전달한다', () => {
    const items = [{ id: '1', title: '첫 자료' }]
    render(
      <StateView loading={false} error={null} data={items}>
        {(data) => <p>{data[0].title}</p>}
      </StateView>,
    )

    expect(screen.getByText('첫 자료')).toBeInTheDocument()
  })
})
