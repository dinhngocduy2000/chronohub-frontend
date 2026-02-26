import { expect, test } from '@playwright/test'

test('homepage has correct title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/chronohub/i)
})

test('homepage renders successfully', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('body')).toBeVisible()
})
