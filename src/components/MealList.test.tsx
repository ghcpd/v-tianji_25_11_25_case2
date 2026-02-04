import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MealList } from './MealList'
import { Meal } from '../types'

describe('MealList', () => {
  const sampleMeals: Meal[] = [
    {
      id: '1',
      name: 'Breakfast',
      calories: 300,
      date: '2024-01-01',
      mealType: 'breakfast',
    },
    {
      id: '2',
      name: 'Lunch',
      calories: 500,
      date: '2024-01-01',
      mealType: 'lunch',
    },
  ]

  it('should render empty state when no meals', () => {
    const onDeleteMeal = vi.fn()
    render(<MealList meals={[]} onDeleteMeal={onDeleteMeal} />)

    expect(screen.getByText(/no meals recorded yet/i)).toBeInTheDocument()
  })

  it('should render meal list', () => {
    const onDeleteMeal = vi.fn()
    render(<MealList meals={sampleMeals} onDeleteMeal={onDeleteMeal} />)

    expect(screen.getByText('Breakfast', { selector: 'h3' })).toBeInTheDocument()
    expect(screen.getByText('Lunch', { selector: 'h3' })).toBeInTheDocument()
    expect(screen.getByText('300')).toBeInTheDocument()
    expect(screen.getByText('500')).toBeInTheDocument()
  })

  it('should call onDeleteMeal when delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDeleteMeal = vi.fn()
    render(<MealList meals={sampleMeals} onDeleteMeal={onDeleteMeal} />)

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    expect(onDeleteMeal).toHaveBeenCalledWith('1')
  })
})

