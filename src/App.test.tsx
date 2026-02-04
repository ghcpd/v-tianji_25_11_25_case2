import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import * as storage from './utils/storage'

vi.mock('./utils/storage', () => {
  const meals: any[] = []
  return {
    loadMeals: vi.fn(() => meals),
    saveMeals: vi.fn((m: any[]) => {
      meals.length = 0
      meals.push(...m)
    }),
    addMeal: vi.fn((meal: any) => {
      meals.push(meal)
    }),
    deleteMeal: vi.fn((id: string) => {
      const index = meals.findIndex(m => m.id === id)
      if (index > -1) meals.splice(index, 1)
    }),
  }
})

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear stored meals
    const storageModule = vi.mocked(storage)
    if (storageModule.loadMeals) {
      vi.mocked(storageModule.loadMeals).mockReturnValue([])
    }
  })

  it('should render app title', () => {
    render(<App />)
    expect(screen.getByText(/nutrition tracker/i)).toBeInTheDocument()
  })

  it('should render stats cards', () => {
    render(<App />)
    expect(screen.getByText(/today's calories/i)).toBeInTheDocument()
    expect(screen.getByText(/weekly average/i)).toBeInTheDocument()
    expect(screen.getByText(/weekly total/i)).toBeInTheDocument()
  })

  it('should be able to add new meal', async () => {
    const user = userEvent.setup()
    render(<App />)

    const nameInput = screen.getByLabelText(/meal name/i)
    const caloriesInput = screen.getByLabelText(/calories/i)
    const submitButton = screen.getByRole('button', { name: /add meal/i })

    await user.type(nameInput, 'Test Meal')
    await user.type(caloriesInput, '350')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Test Meal')).toBeInTheDocument()
    })
  })
})

