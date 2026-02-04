import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Meal } from '../types'
import { saveMeals, loadMeals, addMeal, deleteMeal } from './storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('saveMeals and loadMeals', () => {
    it('should save and load meal list', () => {
      const meals: Meal[] = [
        {
          id: '1',
          name: 'Breakfast',
          calories: 300,
          date: '2024-01-01',
          mealType: 'breakfast',
        },
      ]

      saveMeals(meals)
      const loaded = loadMeals()

      expect(loaded).toEqual(meals)
    })

    it('should return empty array when no stored data', () => {
      const loaded = loadMeals()
      expect(loaded).toEqual([])
    })

    it('should handle invalid JSON data', () => {
      localStorage.setItem('nutrition-tracker-meals', 'invalid json')
      const loaded = loadMeals()
      expect(loaded).toEqual([])
    })
  })

  describe('addMeal', () => {
    it('should add new meal to list', () => {
      const meal: Meal = {
        id: '1',
        name: 'Lunch',
        calories: 500,
        date: '2024-01-01',
        mealType: 'lunch',
      }

      addMeal(meal)
      const loaded = loadMeals()

      expect(loaded).toHaveLength(1)
      expect(loaded[0]).toEqual(meal)
    })

    it('should append to existing list', () => {
      const meal1: Meal = {
        id: '1',
        name: 'Breakfast',
        calories: 300,
        date: '2024-01-01',
        mealType: 'breakfast',
      }
      const meal2: Meal = {
        id: '2',
        name: 'Lunch',
        calories: 500,
        date: '2024-01-01',
        mealType: 'lunch',
      }

      addMeal(meal1)
      addMeal(meal2)
      const loaded = loadMeals()

      expect(loaded).toHaveLength(2)
      expect(loaded).toContainEqual(meal1)
      expect(loaded).toContainEqual(meal2)
    })
  })

  describe('deleteMeal', () => {
    it('should delete meal with specified ID', () => {
      const meal1: Meal = {
        id: '1',
        name: 'Breakfast',
        calories: 300,
        date: '2024-01-01',
        mealType: 'breakfast',
      }
      const meal2: Meal = {
        id: '2',
        name: 'Lunch',
        calories: 500,
        date: '2024-01-01',
        mealType: 'lunch',
      }

      addMeal(meal1)
      addMeal(meal2)
      deleteMeal('1')
      const loaded = loadMeals()

      expect(loaded).toHaveLength(1)
      expect(loaded[0]).toEqual(meal2)
    })

    it('should handle deleting non-existent ID', () => {
      const meal: Meal = {
        id: '1',
        name: 'Breakfast',
        calories: 300,
        date: '2024-01-01',
        mealType: 'breakfast',
      }

      addMeal(meal)
      deleteMeal('999')
      const loaded = loadMeals()

      expect(loaded).toHaveLength(1)
      expect(loaded[0]).toEqual(meal)
    })
  })
})

