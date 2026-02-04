import {
  buildWeeklySummary,
  calculateDailyTotal,
  getMealBreakdown,
  normalizeDate,
  shiftDate,
} from './metrics'

describe('metrics utilities', () => {
  const baseDate = '2024-06-10'
  const meals = [
    { calories: 400, category: 'Breakfast', date: baseDate },
    { calories: 600, category: 'Lunch', date: shiftDate(baseDate, -1) },
    { calories: 200, category: 'Snack', date: shiftDate(baseDate, -1) },
  ]

  it('sums daily calories for a given date', () => {
    const total = calculateDailyTotal(meals, baseDate)
    expect(total).toBe(400)
  })

  it('builds a complete weekly summary even when some days are empty', () => {
    const summary = buildWeeklySummary(meals, { endDate: baseDate, days: 3 })
    expect(summary).toHaveLength(3)
    expect(summary[2].date).toBe(normalizeDate(baseDate))
    expect(summary[1].total).toBe(800)
    expect(summary[0].total).toBe(0)
  })

  it('groups meals into a breakdown by category', () => {
    const breakdown = getMealBreakdown(meals)
    const snack = breakdown.find((item) => item.type === 'Snack')
    expect(snack.calories).toBe(200)
    expect(snack.count).toBe(1)
  })
})
