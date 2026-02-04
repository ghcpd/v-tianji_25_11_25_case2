import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

const extractNumber = (text) => Number(text.replace(/[^\d]/g, ''))

describe('App experience', () => {
  it('shows the hero headline and stats', () => {
    render(<App />)
    expect(screen.getByText(/Plan your fuel/i)).toBeInTheDocument()
    expect(screen.getByTestId('daily-total').textContent).toMatch(/\d/)
    expect(screen.getByText(/Weekly total/i)).toBeInTheDocument()
  })

  it('adds a meal and updates the daily total and list', async () => {
    const user = userEvent.setup()
    render(<App />)

    const dailyTotalEl = screen.getByTestId('daily-total')
    const startingTotal = extractNumber(dailyTotalEl.textContent)

    await user.type(screen.getByTestId('meal-name-input'), 'Testing Salad')
    await user.type(screen.getByTestId('calories-input'), '520')
    await user.click(screen.getByTestId('add-meal-button'))

    expect(await screen.findByText(/Testing Salad/i)).toBeInTheDocument()

    const updatedTotal = extractNumber(screen.getByTestId('daily-total').textContent)
    expect(updatedTotal - startingTotal).toBe(520)
  })
})
