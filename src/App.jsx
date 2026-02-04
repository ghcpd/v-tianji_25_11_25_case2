import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  buildWeeklySummary,
  calculateDailyTotal,
  dayLabel,
  formatNumber,
  getMealBreakdown,
  getToday,
  normalizeDate,
} from './utils/metrics'
import { createSeedMeals } from './data/seedMeals'

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Smoothie', 'Other']

const randomId = () =>
  (globalThis.crypto?.randomUUID?.() ?? `meal-${Date.now()}-${Math.random().toString(16).slice(2)}`)

const StatCard = ({ label, value, hint }) => (
  <div className="stat-card">
    <p className="stat-label">{label}</p>
    <p className="stat-value">{value}</p>
    {hint ? <p className="stat-hint">{hint}</p> : null}
  </div>
)

const MealForm = ({ defaultDate, onAdd }) => {
  const [form, setForm] = useState({
    name: '',
    calories: '',
    category: 'Lunch',
    date: defaultDate,
  })

  useEffect(() => {
    setForm((prev) => ({ ...prev, date: defaultDate }))
  }, [defaultDate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const cleanName = form.name.trim()
    const caloriesNumber = Number(form.calories)
    if (!cleanName || !Number.isFinite(caloriesNumber) || caloriesNumber <= 0) return

    onAdd({
      name: cleanName,
      calories: caloriesNumber,
      category: form.category,
      date: form.date || defaultDate,
    })

    setForm((prev) => ({ ...prev, name: '', calories: '' }))
  }

  return (
    <form className="card" onSubmit={handleSubmit} aria-label="Add meal">
      <div className="card-header">
        <div>
          <p className="eyebrow">Log a meal</p>
          <h3>Capture fuel quickly</h3>
        </div>
        <span className="soft-tag">Auto-saves to the selected day</span>
      </div>
      <div className="form-grid">
        <label className="field">
          <span>Meal name</span>
          <input
            data-testid="meal-name-input"
            name="name"
            type="text"
            placeholder="Roasted veggie bowl"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label className="field">
          <span>Calories</span>
          <input
            data-testid="calories-input"
            name="calories"
            type="number"
            min="0"
            step="10"
            placeholder="640"
            value={form.calories}
            onChange={handleChange}
            required
          />
        </label>
        <label className="field">
          <span>Category</span>
          <select name="category" value={form.category} onChange={handleChange}>
            {MEAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Date</span>
          <input name="date" type="date" value={form.date} onChange={handleChange} />
        </label>
      </div>
      <button data-testid="add-meal-button" type="submit" className="primary-btn">
        Add meal
      </button>
    </form>
  )
}

const MealList = ({ meals, dateLabel, dailyTotal }) => (
  <div className="card list-card">
    <div className="card-header">
      <div>
        <p className="eyebrow">Meal log</p>
        <h3>Meals for {dateLabel}</h3>
      </div>
      <span className="soft-tag">
        <strong>{formatNumber(dailyTotal)}</strong> kcal today
      </span>
    </div>
    {meals.length === 0 ? (
      <p className="empty-state">No meals logged yet. Add one to start tracking.</p>
    ) : (
      <ul className="meal-list">
        {meals.map((meal) => (
          <li key={meal.id} className="meal-row">
            <div>
              <p className="meal-name">{meal.name}</p>
              <p className="meal-meta">
                {meal.category} • {formatNumber(meal.calories)} kcal
              </p>
            </div>
            <span className="pill">{dayLabel(meal.date)}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
)

const ProgressChart = ({ data }) => {
  const max = Math.max(...data.map((entry) => entry.total), 1)
  return (
    <div className="card chart-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Weekly trajectory</p>
          <h3>Calories across the last 7 days</h3>
        </div>
        <span className="soft-tag">Auto scales to your week</span>
      </div>
      <div className="bars">
        {data.map((entry) => {
          const height = Math.max((entry.total / max) * 100, 6)
          return (
            <div key={entry.date} className="bar-group" title={`${entry.total} kcal`}>
              <div className="bar" style={{ height: `${height}%` }}>
                <span className="bar-value">{formatNumber(entry.total)}</span>
              </div>
              <span className="bar-label">{dayLabel(entry.date)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const Breakdown = ({ items }) => (
  <div className="card breakdown-card">
    <div className="card-header">
      <div>
        <p className="eyebrow">Today&apos;s spread</p>
        <h3>Where your calories land</h3>
      </div>
      <span className="soft-tag">{items.length} categories</span>
    </div>
    <div className="badge-row">
      {items.length === 0 ? (
        <span className="empty-state">Add meals to see the breakdown.</span>
      ) : (
        items.map((item) => (
          <span key={item.type} className="badge">
            <strong>{item.type}</strong>
            <small>
              {formatNumber(item.calories)} kcal • {item.count}x
            </small>
          </span>
        ))
      )}
    </div>
  </div>
)

function App() {
  const [selectedDate, setSelectedDate] = useState(getToday())
  const [meals, setMeals] = useState(() => createSeedMeals())

  const weeklySummary = useMemo(
    () => buildWeeklySummary(meals, { endDate: selectedDate, days: 7 }),
    [meals, selectedDate],
  )

  const dailyMeals = useMemo(
    () => meals.filter((meal) => normalizeDate(meal.date) === normalizeDate(selectedDate)),
    [meals, selectedDate],
  )

  const dailyTotal = useMemo(() => calculateDailyTotal(meals, selectedDate), [meals, selectedDate])
  const weeklyTotal = useMemo(
    () => weeklySummary.reduce((sum, entry) => sum + entry.total, 0),
    [weeklySummary],
  )
  const weeklyAverage = weeklySummary.length ? Math.round(weeklyTotal / weeklySummary.length) : 0
  const bestDay =
    weeklySummary.reduce(
      (best, entry) => (entry.total > best.total ? entry : best),
      weeklySummary[0] || { total: 0, date: selectedDate },
    ) || { total: 0, date: selectedDate }

  const breakdown = useMemo(() => getMealBreakdown(dailyMeals), [dailyMeals])

  const handleAddMeal = (meal) => {
    setMeals((prev) => [
      ...prev,
      {
        ...meal,
        id: randomId(),
        calories: Number(meal.calories),
        date: normalizeDate(meal.date || selectedDate),
      },
    ])
  }

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Nutrition tracker</p>
          <h1>Plan your fuel, stay in rhythm.</h1>
          <p className="lede">
            Log meals, keep an eye on today&apos;s calories, and glance at your weekly pace with
            smooth visuals.
          </p>
          <div className="hero-pills">
            <span className="pill bright" data-testid="daily-total">
              Today {formatNumber(dailyTotal)} kcal
            </span>
            <span className="pill">{formatNumber(weeklyTotal)} kcal this week</span>
            <span className="pill">Best day {dayLabel(bestDay.date)}</span>
          </div>
        </div>
        <div className="hero-card">
          <p className="eyebrow">Week glance</p>
          <h3>{formatNumber(weeklyAverage)} kcal average</h3>
          <p className="stat-hint">Small, consistent days keep the trend steady.</p>
          <div className="mini-bars">
            {weeklySummary.map((entry) => {
              const maxTotal = Math.max(...weeklySummary.map((item) => item.total), 1)
              const height = Math.max((entry.total / maxTotal) * 100, 14)
              return (
                <span
                  key={entry.date}
                  className="mini-bar"
                  style={{ height: `${height}%` }}
                  title={`${dayLabel(entry.date)} • ${formatNumber(entry.total)} kcal`}
                />
              )
            })}
          </div>
        </div>
      </header>

      <section className="controls">
        <label className="field">
          <span>Focus day</span>
          <input
            data-testid="date-input"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(normalizeDate(event.target.value))}
          />
        </label>
        <div className="stats-grid">
          <StatCard
            label="Daily total"
            value={`${formatNumber(dailyTotal)} kcal`}
            hint="Calories logged for the selected day."
          />
          <StatCard
            label="Weekly total"
            value={`${formatNumber(weeklyTotal)} kcal`}
            hint="Sum of the last 7 days."
          />
          <StatCard
            label="Weekly average"
            value={`${formatNumber(weeklyAverage)} kcal`}
            hint="Keeps you close to target pace."
          />
          <StatCard
            label="Best day"
            value={`${dayLabel(bestDay.date)} · ${formatNumber(bestDay.total)} kcal`}
            hint="Highest calorie intake this week."
          />
        </div>
      </section>

      <section className="grid two-col">
        <ProgressChart data={weeklySummary} />
        <Breakdown items={breakdown} />
      </section>

      <section className="grid two-col">
        <MealForm defaultDate={selectedDate} onAdd={handleAddMeal} />
        <MealList meals={dailyMeals} dateLabel={selectedDate} dailyTotal={dailyTotal} />
      </section>
    </div>
  )
}

export default App
