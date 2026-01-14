import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { NutritionProvider, useNutrition } from '../context/NutritionContext';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <NutritionProvider>{children}</NutritionProvider>
);

describe('NutritionContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide initial state with default goals', () => {
    const { result } = renderHook(() => useNutrition(), { wrapper });

    expect(result.current.state.meals).toEqual([]);
    expect(result.current.state.goals).toEqual({
      dailyCalories: 2000,
      dailyProtein: 150,
      dailyCarbs: 250,
      dailyFat: 65,
    });
  });

  it('should add a meal', () => {
    const { result } = renderHook(() => useNutrition(), { wrapper });

    const newMeal = {
      name: 'Test Meal',
      calories: 500,
      protein: 30,
      carbs: 50,
      fat: 20,
      date: '2025-01-01',
      time: '12:00',
      mealType: 'lunch' as const,
    };

    act(() => {
      result.current.addMeal(newMeal);
    });

    expect(result.current.state.meals).toHaveLength(1);
    expect(result.current.state.meals[0]).toMatchObject(newMeal);
    expect(result.current.state.meals[0].id).toBeDefined();
  });

  it('should delete a meal', () => {
    const { result } = renderHook(() => useNutrition(), { wrapper });

    act(() => {
      result.current.addMeal({
        name: 'Test Meal',
        calories: 500,
        protein: 30,
        carbs: 50,
        fat: 20,
        date: '2025-01-01',
        time: '12:00',
        mealType: 'lunch',
      });
    });

    const mealId = result.current.state.meals[0].id;

    act(() => {
      result.current.deleteMeal(mealId);
    });

    expect(result.current.state.meals).toHaveLength(0);
  });

  it('should update a meal', () => {
    const { result } = renderHook(() => useNutrition(), { wrapper });

    act(() => {
      result.current.addMeal({
        name: 'Test Meal',
        calories: 500,
        protein: 30,
        carbs: 50,
        fat: 20,
        date: '2025-01-01',
        time: '12:00',
        mealType: 'lunch',
      });
    });

    const meal = result.current.state.meals[0];

    act(() => {
      result.current.updateMeal({
        ...meal,
        name: 'Updated Meal',
        calories: 600,
      });
    });

    expect(result.current.state.meals[0].name).toBe('Updated Meal');
    expect(result.current.state.meals[0].calories).toBe(600);
  });

  it('should update goals', () => {
    const { result } = renderHook(() => useNutrition(), { wrapper });

    const newGoals = {
      dailyCalories: 2500,
      dailyProtein: 180,
      dailyCarbs: 300,
      dailyFat: 80,
    };

    act(() => {
      result.current.setGoals(newGoals);
    });

    expect(result.current.state.goals).toEqual(newGoals);
  });

  it('should get daily nutrition', () => {
    const { result } = renderHook(() => useNutrition(), { wrapper });

    const date = '2025-01-01';

    act(() => {
      result.current.addMeal({
        name: 'Breakfast',
        calories: 400,
        protein: 20,
        carbs: 40,
        fat: 15,
        date,
        time: '08:00',
        mealType: 'breakfast',
      });
      result.current.addMeal({
        name: 'Lunch',
        calories: 600,
        protein: 35,
        carbs: 60,
        fat: 25,
        date,
        time: '12:00',
        mealType: 'lunch',
      });
    });

    const daily = result.current.getDailyNutrition(date);

    expect(daily.totalCalories).toBe(1000);
    expect(daily.totalProtein).toBe(55);
    expect(daily.totalCarbs).toBe(100);
    expect(daily.totalFat).toBe(40);
    expect(daily.meals).toHaveLength(2);
  });

  it('should get weekly nutrition', () => {
    const { result } = renderHook(() => useNutrition(), { wrapper });

    act(() => {
      result.current.addMeal({
        name: 'Monday Meal',
        calories: 500,
        protein: 25,
        carbs: 50,
        fat: 20,
        date: '2025-01-06', // Monday
        time: '12:00',
        mealType: 'lunch',
      });
      result.current.addMeal({
        name: 'Wednesday Meal',
        calories: 600,
        protein: 30,
        carbs: 60,
        fat: 25,
        date: '2025-01-08', // Wednesday
        time: '12:00',
        mealType: 'lunch',
      });
    });

    const weekly = result.current.getWeeklyNutrition('2025-01-08');

    expect(weekly).toHaveLength(7);
    expect(weekly[0].date).toBe('2025-01-06'); // Monday
    expect(weekly[0].totalCalories).toBe(500);
    expect(weekly[2].date).toBe('2025-01-08'); // Wednesday
    expect(weekly[2].totalCalories).toBe(600);
  });

  it('should throw error when useNutrition is used outside provider', () => {
    expect(() => {
      renderHook(() => useNutrition());
    }).toThrow('useNutrition must be used within a NutritionProvider');
  });
});
