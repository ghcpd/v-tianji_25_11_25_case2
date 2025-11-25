import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MealForm } from './MealForm'

describe('MealForm', () => {
  it('should render form fields', () => {
    const onAddMeal = vi.fn()
    render(<MealForm onAddMeal={onAddMeal} />)

    expect(screen.getByLabelText(/meal name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/calories/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/meal type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add meal/i })).toBeInTheDocument()
  })

  it('should submit form and call onAddMeal', async () => {
    const user = userEvent.setup()
    const onAddMeal = vi.fn()
    render(<MealForm onAddMeal={onAddMeal} />)

    const nameInput = screen.getByLabelText(/meal name/i)
    const caloriesInput = screen.getByLabelText(/calories/i)
    const submitButton = screen.getByRole('button', { name: /add meal/i })

    await user.type(nameInput, 'Test Meal')
    await user.type(caloriesInput, '350')
    await user.click(submitButton)

    await waitFor(() => {
      expect(onAddMeal).toHaveBeenCalledTimes(1)
    })

    const calledMeal = onAddMeal.mock.calls[0][0]
    expect(calledMeal.name).toBe('Test Meal')
    expect(calledMeal.calories).toBe(350)
    expect(calledMeal.id).toBeDefined()
  })

  it('should clear form after submission', async () => {
    const user = userEvent.setup()
    const onAddMeal = vi.fn()
    render(<MealForm onAddMeal={onAddMeal} />)

    const nameInput = screen.getByLabelText(/meal name/i) as HTMLInputElement
    const caloriesInput = screen.getByLabelText(/calories/i) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /add meal/i })

    await user.type(nameInput, 'Test Meal')
    await user.type(caloriesInput, '350')
    await user.click(submitButton)

    await waitFor(() => {
      expect(nameInput.value).toBe('')
      expect(caloriesInput.value).toBe('')
    })
  })

  it('should not submit empty form', async () => {
    const user = userEvent.setup()
    const onAddMeal = vi.fn()
    render(<MealForm onAddMeal={onAddMeal} />)

    const submitButton = screen.getByRole('button', { name: /add meal/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(onAddMeal).not.toHaveBeenCalled()
    })
  })
})

