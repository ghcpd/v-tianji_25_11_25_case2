export const normalizeDate = (value) => {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 10)
}

export const getToday = () => normalizeDate(new Date())

export const shiftDate = (dateString, days) => {
  const date = new Date(dateString)
  date.setDate(date.getDate() + days)
  return normalizeDate(date)
}

export const calculateDailyTotal = (meals, dateString) => {
  const dayKey = normalizeDate(dateString)
  return meals
    .filter((meal) => normalizeDate(meal.date) === dayKey)
    .reduce((sum, meal) => sum + Number(meal.calories || 0), 0)
}

export const buildWeeklySummary = (meals, { endDate = getToday(), days = 7 } = {}) => {
  const end = new Date(normalizeDate(endDate))
  const summary = []

  for (let i = days - 1; i >= 0; i -= 1) {
    const current = new Date(end)
    current.setDate(end.getDate() - i)
    const key = normalizeDate(current)
    const total = calculateDailyTotal(meals, key)
    summary.push({ date: key, total })
  }

  return summary
}

export const getMealBreakdown = (meals) => {
  const breakdown = meals.reduce((acc, meal) => {
    const key = meal.category || 'Uncategorized'
    acc[key] = acc[key] || { calories: 0, count: 0 }
    acc[key].calories += Number(meal.calories || 0)
    acc[key].count += 1
    return acc
  }, {})

  return Object.entries(breakdown).map(([type, info]) => ({
    type,
    calories: info.calories,
    count: info.count,
  }))
}

export const formatNumber = (value) => value.toLocaleString()

export const dayLabel = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, { weekday: 'short' })
}
