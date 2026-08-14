import { test, expect } from '@playwright/test'

test.skip(!process.env.PLAYWRIGHT_PRODUCTION, '배포 원격 CRUD를 요청한 경우에만 실행')

test('Vercel 화면에서 Supabase 원격 CRUD가 동작한다', async ({ page }) => {
  const title = `배포 검사 ${Date.now()}`
  const changedTitle = `${title} 수정`
  let createdId = null

  try {
    await page.goto('/#/items')
    await expect(page.getByText('Supabase 원격')).toBeVisible()

    await page.getByRole('link', { name: '+ 새 아이템 등록' }).click()
    await page.getByLabel('제목').fill(title)
    await page.getByLabel('카테고리').selectOption('학습')
    await page.getByLabel('내용').fill('Vercel과 Supabase를 함께 검사하는 임시 데이터입니다.')
    await page.getByRole('button', { name: '저장' }).click()

    await expect(page).toHaveURL(/#\/items\/[^/]+$/)
    createdId = page.url().split('/').at(-1)
    await expect(page.getByRole('heading', { name: title })).toBeVisible()

    await page.getByRole('link', { name: '수정' }).click()
    await page.getByLabel('제목').fill(changedTitle)
    await page.getByRole('button', { name: '저장' }).click()
    await expect(page.getByRole('heading', { name: changedTitle })).toBeVisible()

    await page.getByRole('button', { name: '삭제', exact: true }).click()
    await page.getByRole('alertdialog').getByRole('button', { name: '삭제', exact: true }).click()
    await expect(page).toHaveURL(/#\/items$/)
    await expect(page.getByText(changedTitle)).toHaveCount(0)
    createdId = null
  } finally {
    if (createdId) {
      await page.goto(`/#/items/${createdId}`)
      const deleteButton = page.getByRole('button', { name: '삭제', exact: true })
      if (await deleteButton.isVisible().catch(() => false)) {
        await deleteButton.click()
        await page.getByRole('alertdialog').getByRole('button', { name: '삭제', exact: true }).click()
      }
    }
  }
})
