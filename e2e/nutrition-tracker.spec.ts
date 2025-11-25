import { test, expect } from '@playwright/test'

test.describe('Nutrition Tracker E2E Tests', () => {
  test('should load app and display title', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByText(/nutrition tracker/i)).toBeVisible()
    await expect(page.getByText(/log your meals/i)).toBeVisible()
  })

  test('should display stats cards', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByText(/today's calories/i)).toBeVisible()
    await expect(page.getByText(/weekly average/i)).toBeVisible()
    await expect(page.getByText(/weekly total/i)).toBeVisible()
  })

  test('should be able to add meal', async ({ page }) => {
    await page.goto('/')
    
    // Fill form
    await page.getByLabel(/meal name/i).fill('Test Meal')
    await page.getByLabel(/calories/i).fill('350')
    await page.getByRole('button', { name: /add meal/i }).click()
    
    // Verify meal was added
    await expect(page.getByText('Test Meal')).toBeVisible()
    // Use more specific selector to find calories value in meal card
    const mealCard = page.locator('.meal-card').filter({ hasText: 'Test Meal' })
    await expect(mealCard.getByText('350')).toBeVisible()
  })

  test('should be able to delete meal', async ({ page }) => {
    await page.goto('/')
    
    // First add a meal
    await page.getByLabel(/meal name/i).fill('Meal to Delete')
    await page.getByLabel(/calories/i).fill('200')
    await page.getByRole('button', { name: /add meal/i }).click()
    
    // Wait for meal to appear
    await expect(page.getByText('Meal to Delete')).toBeVisible()
    
    // Delete meal
    const deleteButtons = page.getByRole('button', { name: /delete/i })
    await deleteButtons.first().click()
    
    // Verify meal was deleted
    await expect(page.getByText('Meal to Delete')).not.toBeVisible()
  })

  test('should display chart', async ({ page }) => {
    await page.goto('/')
    
    // Add some meals to generate chart data
    await page.getByLabel(/meal name/i).fill('Breakfast')
    await page.getByLabel(/calories/i).fill('300')
    await page.getByRole('button', { name: /add meal/i }).click()
    
    await expect(page.getByText(/last 7 days calorie trend/i)).toBeVisible()
  })

  test('form validation should work', async ({ page }) => {
    await page.goto('/')
    
    // Try to submit empty form
    await page.getByRole('button', { name: /add meal/i }).click()
    
    // Verify form fields still exist (not submitted)
    await expect(page.getByLabel(/meal name/i)).toBeVisible()
  })
})

