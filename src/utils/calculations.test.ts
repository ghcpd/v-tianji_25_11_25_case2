import { describe, it, expect } from 'vitest'
import { Meal } from '../types'
import {
  calculateDailyCalories,
  getDailyStats,
  getWeeklyStats,
  getLast7DaysStats,
} from './calculations'

describe('calculations', () => {
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
    {
      id: '3',
      name: 'Dinner',
      calories: 600,
      date: '2024-01-02',
      mealType: 'dinner',
    },
  ]

  describe('calculateDailyCalories', () => {
    it('should calculate total calories for specified date', () => {
      const calories = calculateDailyCalories(sampleMeals, '2024-01-01')
      expect(calories).toBe(800)
    })

    it('should return 0 when no meals for that date', () => {
      const calories = calculateDailyCalories(sampleMeals, '2024-01-03')
      expect(calories).toBe(0)
    })
  })

  describe('getDailyStats', () => {
    it('should return correct daily stats', () => {
      const stats = getDailyStats(sampleMeals, '2024-01-01')
      expect(stats.date).toBe('2024-01-01')
      expect(stats.totalCalories).toBe(800)
      expect(stats.mealCount).toBe(2)
    })

    it('should return zero stats when no meals', () => {
      const stats = getDailyStats(sampleMeals, '2024-01-03')
      expect(stats.date).toBe('2024-01-03')
      expect(stats.totalCalories).toBe(0)
      expect(stats.mealCount).toBe(0)
    })
  })

  describe('getWeeklyStats', () => {
    it('should return correct weekly stats', () => {
      const weekStartDate = new Date('2024-01-01')
      const stats = getWeeklyStats(sampleMeals, weekStartDate)
      
      expect(stats.totalCalories).toBeGreaterThan(0)
      expect(stats.days.length).toBe(7)
      expect(stats.averageDailyCalories).toBeGreaterThanOrEqual(0)
    })
  })

  describe('getLast7DaysStats', () => {
    it('should return last 7 days stats', () => {
      const stats = getLast7DaysStats(sampleMeals)
      expect(stats).toHaveLength(7)
      expect(stats.every(s => typeof s.date === 'string')).toBe(true)
      expect(stats.every(s => typeof s.totalCalories === 'number')).toBe(true)
      expect(stats.every(s => typeof s.mealCount === 'number')).toBe(true)
    })
  })
})

