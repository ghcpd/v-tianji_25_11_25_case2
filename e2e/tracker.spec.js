import { test, expect } from '@playwright/test'

const numberFrom = (text) => Number(text.replace(/[^\d]/g, ''))

test('logs a meal and updates the dashboard', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText(/Plan your fuel/i)).toBeVisible()
  const startingTotalText = await page.getByTestId('daily-total').innerText()
  const startingTotal = numberFrom(startingTotalText)

  await page.getByTestId('meal-name-input').fill('Playwright Power Bowl')
  await page.getByTestId('calories-input').fill('450')
  await page.getByTestId('add-meal-button').click()

  await expect(page.getByText(/Playwright Power Bowl/i)).toBeVisible()

  const updatedTotalText = await page.getByTestId('daily-total').innerText()
  const updatedTotal = numberFrom(updatedTotalText)
  expect(updatedTotal).toBeGreaterThan(startingTotal)

  await expect(page.getByRole('heading', { name: /calories across the last 7 days/i })).toBeVisible()
})
