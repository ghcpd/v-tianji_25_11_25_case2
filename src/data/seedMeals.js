import { getToday, shiftDate } from '../utils/metrics'

const makeMeal = (id, name, calories, category, date) => ({
  id,
  name,
  calories,
  category,
  date,
})

export const createSeedMeals = (baseDate = getToday()) => {
  const today = baseDate
  return [
    makeMeal('m-1', 'Citrus Chia Oats', 420, 'Breakfast', today),
    makeMeal('m-2', 'Green Protein Smoothie', 280, 'Snack', today),
    makeMeal('m-3', 'Mediterranean Power Bowl', 640, 'Lunch', today),
    makeMeal('m-4', 'Roasted Veggie Pasta', 730, 'Dinner', shiftDate(today, -1)),
    makeMeal('m-5', 'Berry Yogurt Parfait', 320, 'Breakfast', shiftDate(today, -1)),
    makeMeal('m-6', 'Spicy Chickpea Wrap', 510, 'Lunch', shiftDate(today, -2)),
    makeMeal('m-7', 'Coconut Lime Sipper', 120, 'Snack', shiftDate(today, -2)),
    makeMeal('m-8', 'Sheet-Pan Salmon', 690, 'Dinner', shiftDate(today, -3)),
    makeMeal('m-9', 'Matcha Date Bites', 180, 'Snack', shiftDate(today, -4)),
    makeMeal('m-10', 'Avocado Toast Deluxe', 450, 'Breakfast', shiftDate(today, -5)),
    makeMeal('m-11', 'Miso Ginger Ramen', 620, 'Dinner', shiftDate(today, -6)),
  ]
}
