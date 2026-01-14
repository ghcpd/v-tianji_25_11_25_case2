export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // HH:mm format
  mealType: MealType;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface DailyNutrition {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: Meal[];
}

export interface NutritionGoals {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
}

export interface ChartDataPoint {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  goal: number;
}
