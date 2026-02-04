import { Meal, DailyStats, WeeklyStats } from '../types'
import { format, startOfWeek, endOfWeek, parseISO, isWithinInterval, eachDayOfInterval } from 'date-fns'

export const calculateDailyCalories = (meals: Meal[], date: string): number => {
  return meals
    .filter(meal => meal.date === date)
    .reduce((sum, meal) => sum + meal.calories, 0)
}

export const getDailyStats = (meals: Meal[], date: string): DailyStats => {
  const dailyMeals = meals.filter(meal => meal.date === date)
  return {
    date,
    totalCalories: dailyMeals.reduce((sum, meal) => sum + meal.calories, 0),
    mealCount: dailyMeals.length,
  }
}

export const getWeeklyStats = (meals: Meal[], weekStartDate: Date): WeeklyStats => {
  const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(weekStartDate, { weekStartsOn: 1 })
  
  const weekMeals = meals.filter(meal => {
    const mealDate = parseISO(meal.date)
    return isWithinInterval(mealDate, { start: weekStart, end: weekEnd })
  })

  const days = eachDayOfInterval({ start: weekStart, end: weekEnd }).map(date => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return getDailyStats(meals, dateStr)
  })

  const totalCalories = weekMeals.reduce((sum, meal) => sum + meal.calories, 0)
  const averageDailyCalories = days.length > 0 ? totalCalories / days.length : 0

  return {
    weekStart: format(weekStart, 'yyyy-MM-dd'),
    weekEnd: format(weekEnd, 'yyyy-MM-dd'),
    totalCalories,
    averageDailyCalories,
    days,
  }
}

export const getLast7DaysStats = (meals: Meal[]): DailyStats[] => {
  const today = new Date()
  const days: DailyStats[] = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = format(date, 'yyyy-MM-dd')
    days.push(getDailyStats(meals, dateStr))
  }
  
  return days
}

