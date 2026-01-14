import { test, expect } from '@playwright/test';

test.describe('Nutrition Tracker E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to page and wait for it to load
    await page.goto('/');
    // Wait for the app to render
    await page.waitForSelector('h1');
  });

  test('should load the app and display header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('NutriTrack');
    await expect(page.getByRole('button', { name: /log meal/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /daily/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /weekly/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /goals/i })).toBeVisible();
  });

  test('should add a meal and see it in daily view', async ({ page }) => {
    // Fill in meal form
    await page.getByLabel(/meal name/i).fill('Grilled Chicken');
    await page.getByLabel(/^calories$/i).fill('350');
    await page.getByLabel(/protein/i).fill('40');
    await page.getByLabel(/carbs/i).fill('5');
    await page.getByLabel(/^fat/i).fill('15');

    // Select lunch
    await page.getByRole('button', { name: /lunch/i }).click();

    // Submit
    await page.getByRole('button', { name: /add meal/i }).click();

    // Wait for success message
    await expect(page.getByText(/meal added successfully/i)).toBeVisible();

    // Navigate to daily view
    await page.getByRole('button', { name: /daily/i }).click();

    // Verify meal appears
    await expect(page.getByText('Grilled Chicken')).toBeVisible();
    await expect(page.getByText(/350 cal/i)).toBeVisible();
  });

  test('should delete a meal from daily view', async ({ page }) => {
    // Add a meal first
    await page.getByLabel(/meal name/i).fill('Test Meal');
    await page.getByLabel(/^calories$/i).fill('500');
    await page.getByRole('button', { name: /add meal/i }).click();

    // Go to daily view
    await page.getByRole('button', { name: /daily/i }).click();

    // Verify meal exists
    await expect(page.getByText('Test Meal')).toBeVisible();

    // Hover and click delete
    const mealItem = page.getByText('Test Meal').locator('..');
    await mealItem.hover();
    await page.getByLabel('Delete meal').click();

    // Verify meal is gone
    await expect(page.getByText('Test Meal')).not.toBeVisible();
    await expect(page.getByText('No meals logged yet')).toBeVisible();
  });

  test('should update nutrition goals', async ({ page }) => {
    // Navigate to goals
    await page.getByRole('button', { name: /goals/i }).click();

    // Click edit
    await page.getByRole('button', { name: 'Edit' }).click();

    // Update calories goal
    const caloriesInput = page.getByRole('spinbutton').first();
    await caloriesInput.clear();
    await caloriesInput.fill('2500');

    // Save
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify update
    await expect(page.getByText(/goals updated successfully/i)).toBeVisible();
    await expect(page.getByText('2500')).toBeVisible();
  });

  test('should navigate between dates', async ({ page }) => {
    const dateInput = page.locator('header input[type="date"]');
    const initialDate = await dateInput.inputValue();

    // Click previous day
    await page.getByLabel('Previous day').click();

    // Date should change
    const newDate = await dateInput.inputValue();
    expect(newDate).not.toBe(initialDate);

    // Click next day
    await page.getByLabel('Next day').click();

    // Should be back to original
    const finalDate = await dateInput.inputValue();
    expect(finalDate).toBe(initialDate);
  });

  test('should navigate through all tabs', async ({ page }) => {
    // Log Meal (default)
    await expect(page.getByText('Log a Meal')).toBeVisible();

    // Daily
    await page.getByRole('button', { name: /daily/i }).click();
    await expect(page.getByText('Daily Summary')).toBeVisible();

    // Weekly
    await page.getByRole('button', { name: /weekly/i }).click();
    await expect(page.getByText('Weekly Progress')).toBeVisible();

    // Goals
    await page.getByRole('button', { name: /goals/i }).click();
    await expect(page.getByText('Daily Goals')).toBeVisible();

    // Back to Log
    await page.getByRole('button', { name: /log meal/i }).click();
    await expect(page.getByText('Log a Meal')).toBeVisible();
  });

  test('should show weekly statistics', async ({ page }) => {
    // Add a meal
    await page.getByLabel(/meal name/i).fill('Breakfast');
    await page.getByLabel(/^calories$/i).fill('400');
    await page.getByRole('button', { name: /add meal/i }).click();

    // Go to weekly view
    await page.getByRole('button', { name: /weekly/i }).click();

    // Check stats are visible
    await expect(page.getByText('Total Calories')).toBeVisible();
    await expect(page.getByText('Daily Average')).toBeVisible();
    await expect(page.getByText('Days on Target')).toBeVisible();
    await expect(page.getByText('Calorie Intake')).toBeVisible();
    await expect(page.getByText('Macronutrients')).toBeVisible();
  });

  test('should show macro progress in daily view', async ({ page }) => {
    // Add a meal with macros
    await page.getByLabel(/meal name/i).fill('High Protein Meal');
    await page.getByLabel(/^calories$/i).fill('600');
    await page.getByLabel(/protein/i).fill('50');
    await page.getByLabel(/carbs/i).fill('40');
    await page.getByLabel(/^fat/i).fill('25');
    await page.getByRole('button', { name: /add meal/i }).click();

    // Go to daily view
    await page.getByRole('button', { name: /daily/i }).click();

    // Check macro labels exist
    await expect(page.getByText('Protein').first()).toBeVisible();
    await expect(page.getByText('Carbs').first()).toBeVisible();
    await expect(page.getByText('Fat').first()).toBeVisible();

    // Check totals updated - the calories ring shows 600
    await expect(page.getByText('600', { exact: true }).first()).toBeVisible();
  });

  test('should persist meals after page reload', async ({ page }) => {
    // Add a meal
    await page.getByLabel(/meal name/i).fill('Persistent Meal');
    await page.getByLabel(/^calories$/i).fill('300');
    await page.getByRole('button', { name: /add meal/i }).click();
    
    // Wait for success
    await expect(page.getByText(/meal added successfully/i)).toBeVisible();

    // Reload page
    await page.reload();
    await page.waitForSelector('h1');

    // Go to daily view
    await page.getByRole('button', { name: /daily/i }).click();

    // Meal should still be there
    await expect(page.getByText('Persistent Meal')).toBeVisible();
  });
});
