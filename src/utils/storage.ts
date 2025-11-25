import { Meal } from '../types'

const STORAGE_KEY = 'nutrition-tracker-meals'

export const saveMeals = (meals: Meal[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals))
}

export const loadMeals = (): Meal[] => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored) as Meal[]
  } catch {
    return []
  }
}

export const addMeal = (meal: Meal): void => {
  const meals = loadMeals()
  meals.push(meal)
  saveMeals(meals)
}

export const deleteMeal = (id: string): void => {
  const meals = loadMeals()
  const filtered = meals.filter(m => m.id !== id)
  saveMeals(filtered)
}

