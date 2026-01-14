import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Meal, NutritionGoals, DailyNutrition } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';

// State type
interface NutritionState {
  meals: Meal[];
  goals: NutritionGoals;
}

// Action types
type NutritionAction =
  | { type: 'ADD_MEAL'; payload: Omit<Meal, 'id'> }
  | { type: 'DELETE_MEAL'; payload: string }
  | { type: 'UPDATE_MEAL'; payload: Meal }
  | { type: 'SET_GOALS'; payload: NutritionGoals }
  | { type: 'LOAD_STATE'; payload: NutritionState };

// Context type
interface NutritionContextType {
  state: NutritionState;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  deleteMeal: (id: string) => void;
  updateMeal: (meal: Meal) => void;
  setGoals: (goals: NutritionGoals) => void;
  getDailyNutrition: (date: string) => DailyNutrition;
  getWeeklyNutrition: (date: string) => DailyNutrition[];
}

// Default goals
const defaultGoals: NutritionGoals = {
  dailyCalories: 2000,
  dailyProtein: 150,
  dailyCarbs: 250,
  dailyFat: 65,
};

// Initial state
const initialState: NutritionState = {
  meals: [],
  goals: defaultGoals,
};

// Reducer
function nutritionReducer(state: NutritionState, action: NutritionAction): NutritionState {
  switch (action.type) {
    case 'ADD_MEAL':
      return {
        ...state,
        meals: [...state.meals, { ...action.payload, id: uuidv4() }],
      };
    case 'DELETE_MEAL':
      return {
        ...state,
        meals: state.meals.filter((meal) => meal.id !== action.payload),
      };
    case 'UPDATE_MEAL':
      return {
        ...state,
        meals: state.meals.map((meal) =>
          meal.id === action.payload.id ? action.payload : meal
        ),
      };
    case 'SET_GOALS':
      return {
        ...state,
        goals: action.payload,
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

// Create context
const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = 'nutrition-tracker-data';

// Provider component
export function NutritionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(nutritionReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (e) {
        console.error('Failed to load nutrition data:', e);
      }
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addMeal = (meal: Omit<Meal, 'id'>) => {
    dispatch({ type: 'ADD_MEAL', payload: meal });
  };

  const deleteMeal = (id: string) => {
    dispatch({ type: 'DELETE_MEAL', payload: id });
  };

  const updateMeal = (meal: Meal) => {
    dispatch({ type: 'UPDATE_MEAL', payload: meal });
  };

  const setGoals = (goals: NutritionGoals) => {
    dispatch({ type: 'SET_GOALS', payload: goals });
  };

  const getDailyNutrition = (date: string): DailyNutrition => {
    const dailyMeals = state.meals.filter((meal) => meal.date === date);
    return {
      date,
      totalCalories: dailyMeals.reduce((sum, meal) => sum + meal.calories, 0),
      totalProtein: dailyMeals.reduce((sum, meal) => sum + meal.protein, 0),
      totalCarbs: dailyMeals.reduce((sum, meal) => sum + meal.carbs, 0),
      totalFat: dailyMeals.reduce((sum, meal) => sum + meal.fat, 0),
      meals: dailyMeals,
    };
  };

  const getWeeklyNutrition = (date: string): DailyNutrition[] => {
    const currentDate = parseISO(date);
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return daysInWeek.map((day) => getDailyNutrition(format(day, 'yyyy-MM-dd')));
  };

  return (
    <NutritionContext.Provider
      value={{
        state,
        addMeal,
        deleteMeal,
        updateMeal,
        setGoals,
        getDailyNutrition,
        getWeeklyNutrition,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
}

// Hook to use nutrition context
export function useNutrition() {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
}
