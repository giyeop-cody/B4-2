import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/#/items')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await expect(page.getByText('React 학습 노트')).toBeVisible()
})

test('등록 → 상세 → 수정 → 삭제 화면 흐름이 이어진다', async ({ page }) => {
  const title = `브라우저 검사 ${Date.now()}`
  const changedTitle = `${title} 수정`

  await page.getByRole('link', { name: '+ 새 아이템 등록' }).click()
  await expect(page).toHaveURL(/#\/items\/new$/)
  await page.getByLabel('제목').fill(title)
  await page.getByLabel('카테고리').selectOption('학습')
  await page.getByLabel('내용').fill('Playwright로 사용자 화면 흐름을 검사합니다.')
  await page.getByRole('button', { name: '저장' }).click()

  await expect(page).toHaveURL(/#\/items\/[^/]+$/)
  await expect(page.getByRole('heading', { name: title })).toBeVisible()

  await page.getByRole('link', { name: '수정' }).click()
  await page.getByLabel('제목').fill(changedTitle)
  await page.getByRole('button', { name: '저장' }).click()
  await expect(page.getByRole('heading', { name: changedTitle })).toBeVisible()

  await page.getByRole('button', { name: '삭제' }).click()
  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: '삭제' }).click()

  await expect(page).toHaveURL(/#\/items$/)
  await expect(page.getByText(changedTitle)).toHaveCount(0)
})

test('필터, 보호 라우트, 잘못된 주소가 상태에 맞는 화면을 보인다', async ({ page }) => {
  await expect(page.getByText('LocalStorage 학습')).toBeVisible()
  await expect(page.getByRole('link', { name: '+ 새 아이템 등록' })).toHaveCount(1)
  await expect(page.getByRole('link', { name: '등록', exact: true })).toHaveCount(0)

  await page.getByLabel('카테고리').selectOption('일반')
  await expect(page.getByText('일반 카테고리에 표시할 데이터가 없습니다.')).toBeVisible()
  await expect(page.getByRole('link', { name: /새 아이템 등록/ })).toHaveCount(1)

  await page.getByLabel('카테고리').selectOption('학습')
  await expect(page.getByText('React 학습 노트')).toBeVisible()
  await expect(page.getByText('Supabase 입문')).toHaveCount(0)

  await page.goto('/#/profile')
  await expect(page).toHaveURL(/#\/login\?redirect=%2Fprofile$/)
  await expect(page.getByText('Supabase 인증 설정이 없습니다. 환경변수를 확인하세요.')).toBeVisible()

  await page.goto('/#/wrong-address')
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
})
