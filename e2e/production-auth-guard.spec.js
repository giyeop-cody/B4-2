import { test, expect } from '@playwright/test'

test.skip(!process.env.PLAYWRIGHT_PRODUCTION, '배포 인증 권한을 요청한 경우에만 실행')

test('비로그인 사용자는 조회만 가능하고 쓰기는 로그인으로 이동한다', async ({ page }) => {
  await page.goto('/#/items')
  await expect(page.getByText('Supabase 원격')).toBeVisible()
  await expect(page.getByRole('link', { name: '로그인 후 등록' })).toBeVisible()
  await expect(page.getByRole('link', { name: '수정' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: '삭제' })).toHaveCount(0)

  const firstItem = page.locator('main').getByRole('link').filter({ hasNotText: /등록|로그인/ }).first()
  await firstItem.click()
  await expect(page.getByText('로그인하면 수정과 삭제를 사용할 수 있습니다.')).toBeVisible()
  await expect(page.getByRole('link', { name: '수정' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: '삭제' })).toHaveCount(0)

  await page.goto('/#/items')
  await page.getByRole('link', { name: '로그인 후 등록' }).click()
  await expect(page).toHaveURL(/#\/login\?redirect=%2Fitems%2Fnew$/)
})
