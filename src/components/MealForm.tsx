import { useState } from 'react'
import { Meal } from '../types'
import { format } from 'date-fns'
import './MealForm.css'

interface MealFormProps {
  onAddMeal: (meal: Meal) => void
}

export const MealForm = ({ onAddMeal }: MealFormProps) => {
  const [name, setName] = useState('')
  const [calories, setCalories] = useState('')
  const [mealType, setMealType] = useState<Meal['mealType']>('breakfast')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !calories.trim()) {
      return
    }

    const caloriesNum = parseInt(calories, 10)
    if (isNaN(caloriesNum) || caloriesNum <= 0) {
      return
    }

    const meal: Meal = {
      id: `${Date.now()}-${Math.random()}`,
      name: name.trim(),
      calories: caloriesNum,
      date,
      mealType,
    }

    onAddMeal(meal)
    setName('')
    setCalories('')
  }

  return (
    <form className="meal-form" onSubmit={handleSubmit}>
      <h2>Log Meal</h2>
      <div className="form-group">
        <label htmlFor="meal-name">Meal Name</label>
        <input
          id="meal-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Egg Sandwich"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="calories">Calories</label>
        <input
          id="calories"
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="e.g., 350"
          min="1"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="meal-type">Meal Type</label>
        <select
          id="meal-type"
          value={mealType}
          onChange={(e) => setMealType(e.target.value as Meal['mealType'])}
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="submit-button">Add Meal</button>
    </form>
  )
}

