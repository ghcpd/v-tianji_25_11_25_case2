import { useState, useEffect } from 'react'
import { Meal } from './types'
import { MealForm } from './components/MealForm'
import { MealList } from './components/MealList'
import { StatsCard } from './components/StatsCard'
import { CaloriesChart } from './components/CaloriesChart'
import { loadMeals, saveMeals, addMeal, deleteMeal } from './utils/storage'
import { getDailyStats, getLast7DaysStats } from './utils/calculations'
import { format } from 'date-fns'
import './App.css'

function App() {
  const [meals, setMeals] = useState<Meal[]>([])

  useEffect(() => {
    const loadedMeals = loadMeals()
    setMeals(loadedMeals)
  }, [])

  const handleAddMeal = (meal: Meal) => {
    addMeal(meal)
    setMeals([...meals, meal])
  }

  const handleDeleteMeal = (id: string) => {
    deleteMeal(id)
    setMeals(meals.filter(m => m.id !== id))
  }

  const today = format(new Date(), 'yyyy-MM-dd')
  const todayStats = getDailyStats(meals, today)
  const last7DaysStats = getLast7DaysStats(meals)
  const weeklyTotal = last7DaysStats.reduce((sum, stat) => sum + stat.totalCalories, 0)
  const weeklyAverage = last7DaysStats.length > 0 
    ? Math.round(weeklyTotal / last7DaysStats.length) 
    : 0

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍎 Nutrition Tracker</h1>
        <p>Log your meals and track calorie intake</p>
      </header>
      
      <main className="app-main">
        <div className="stats-grid">
          <StatsCard 
            title="Today's Calories" 
            value={todayStats.totalCalories}
            subtitle={`${todayStats.mealCount} meals`}
            icon="🔥"
          />
          <StatsCard 
            title="Weekly Average" 
            value={weeklyAverage}
            subtitle="Average daily calories"
            icon="📊"
          />
          <StatsCard 
            title="Weekly Total" 
            value={weeklyTotal}
            subtitle="Total calories (7 days)"
            icon="📈"
          />
        </div>

        <MealForm onAddMeal={handleAddMeal} />
        
        <CaloriesChart data={last7DaysStats} />
        
        <MealList meals={meals} onDeleteMeal={handleDeleteMeal} />
      </main>
    </div>
  )
}

export default App

