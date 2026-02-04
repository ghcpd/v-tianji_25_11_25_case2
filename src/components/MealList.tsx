import { Meal } from '../types'
import { format, parseISO } from 'date-fns'
import { enUS } from 'date-fns/locale'
import './MealList.css'

interface MealListProps {
  meals: Meal[]
  onDeleteMeal: (id: string) => void
}

const mealTypeLabels: Record<Meal['mealType'], string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

export const MealList = ({ meals, onDeleteMeal }: MealListProps) => {
  const sortedMeals = [...meals].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date)
    if (dateCompare !== 0) return dateCompare
    
    const typeOrder: Meal['mealType'][] = ['breakfast', 'lunch', 'dinner', 'snack']
    return typeOrder.indexOf(a.mealType) - typeOrder.indexOf(b.mealType)
  })

  if (meals.length === 0) {
    return (
      <div className="meal-list">
        <h2>Meal Records</h2>
        <div className="empty-state">
          <p>No meals recorded yet</p>
          <p className="empty-hint">Use the form above to add your first meal</p>
        </div>
      </div>
    )
  }

  return (
    <div className="meal-list">
      <h2>Meal Records</h2>
      <div className="meals-container">
        {sortedMeals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <div className="meal-header">
              <span className="meal-type-badge">{mealTypeLabels[meal.mealType]}</span>
              <span className="meal-date">
                {format(parseISO(meal.date), 'MMM dd, yyyy', { locale: enUS })}
              </span>
            </div>
            <div className="meal-content">
              <h3 className="meal-name">{meal.name}</h3>
              <div className="meal-calories">
                <span className="calories-value">{meal.calories}</span>
                <span className="calories-unit">calories</span>
              </div>
            </div>
            <button
              className="delete-button"
              onClick={() => onDeleteMeal(meal.id)}
              aria-label="Delete meal"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

