import { useNutrition } from '../context/NutritionContext';
import { format } from 'date-fns';

interface DailySummaryProps {
  date?: string;
}

export function DailySummary({ date = format(new Date(), 'yyyy-MM-dd') }: DailySummaryProps) {
  const { getDailyNutrition, state, deleteMeal } = useNutrition();
  const daily = getDailyNutrition(date);
  const { goals } = state;

  const caloriePercentage = Math.min((daily.totalCalories / goals.dailyCalories) * 100, 100);
  const proteinPercentage = Math.min((daily.totalProtein / goals.dailyProtein) * 100, 100);
  const carbsPercentage = Math.min((daily.totalCarbs / goals.dailyCarbs) * 100, 100);
  const fatPercentage = Math.min((daily.totalFat / goals.dailyFat) * 100, 100);

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-emerald-400';
    if (percentage < 80) return 'bg-amber-400';
    if (percentage <= 100) return 'bg-emerald-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <span className="text-3xl">📊</span> Daily Summary
      </h2>
      <p className="text-gray-500 mb-6">{format(new Date(date), 'EEEE, MMMM d, yyyy')}</p>

      {/* Calorie Ring */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke={daily.totalCalories > goals.dailyCalories ? '#ef4444' : '#10b981'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${caloriePercentage * 4.4} 440`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-800">{daily.totalCalories}</span>
            <span className="text-sm text-gray-500">/ {goals.dailyCalories} cal</span>
          </div>
        </div>
      </div>

      {/* Macros Progress */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Protein</span>
            <span className="text-gray-500">{daily.totalProtein}g / {goals.dailyProtein}g</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(proteinPercentage)}`}
              style={{ width: `${proteinPercentage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Carbs</span>
            <span className="text-gray-500">{daily.totalCarbs}g / {goals.dailyCarbs}g</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(carbsPercentage)}`}
              style={{ width: `${carbsPercentage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Fat</span>
            <span className="text-gray-500">{daily.totalFat}g / {goals.dailyFat}g</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(fatPercentage)}`}
              style={{ width: `${fatPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Meals List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Today's Meals</h3>
        {daily.meals.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No meals logged yet</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {daily.meals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getMealTypeIcon(meal.mealType)}</span>
                  <div>
                    <p className="font-medium text-gray-800">{meal.name}</p>
                    <p className="text-xs text-gray-500">
                      {meal.time} • {meal.calories} cal
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteMeal(meal.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"
                  aria-label="Delete meal"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
