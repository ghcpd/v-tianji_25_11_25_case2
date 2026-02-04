export interface Meal {
  id: string
  name: string
  calories: number
  date: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

export interface DailyStats {
  date: string
  totalCalories: number
  mealCount: number
}

export interface WeeklyStats {
  weekStart: string
  weekEnd: string
  totalCalories: number
  averageDailyCalories: number
  days: DailyStats[]
}

