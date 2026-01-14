import React, { useState } from 'react';
import { useNutrition } from '../context/NutritionContext';
import type { MealType } from '../types';
import { format } from 'date-fns';

const mealTypes: { value: MealType; label: string; icon: string }[] = [
  { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { value: 'lunch', label: 'Lunch', icon: '☀️' },
  { value: 'dinner', label: 'Dinner', icon: '🌙' },
  { value: 'snack', label: 'Snack', icon: '🍎' },
];

interface MealFormData {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  mealType: MealType;
  date: string;
  time: string;
}

const initialFormData: MealFormData = {
  name: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  mealType: 'breakfast',
  date: format(new Date(), 'yyyy-MM-dd'),
  time: format(new Date(), 'HH:mm'),
};

export function MealLogger() {
  const { addMeal } = useNutrition();
  const [formData, setFormData] = useState<MealFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    addMeal({
      name: formData.name,
      calories: Number(formData.calories) || 0,
      protein: Number(formData.protein) || 0,
      carbs: Number(formData.carbs) || 0,
      fat: Number(formData.fat) || 0,
      mealType: formData.mealType,
      date: formData.date,
      time: formData.time,
    });

    setFormData({
      ...initialFormData,
      date: formData.date,
      time: format(new Date(), 'HH:mm'),
    });
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-3xl">🍽️</span> Log a Meal
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Meal Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Meal Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Grilled Chicken Salad"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Meal Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meal Type
          </label>
          <div className="grid grid-cols-4 gap-2">
            {mealTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, mealType: type.value }))}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.mealType === type.value
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-xl block">{type.icon}</span>
                <span className="text-xs font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Nutrition Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
              Calories
            </label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              placeholder="0"
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">
              Protein (g)
            </label>
            <input
              type="number"
              id="protein"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">
              Carbs (g)
            </label>
            <input
              type="number"
              id="carbs"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">
              Fat (g)
            </label>
            <input
              type="number"
              id="fat"
              name="fat"
              value={formData.fat}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:from-emerald-600 hover:to-teal-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding...' : '+ Add Meal'}
        </button>

        {/* Success Message */}
        {showSuccess && (
          <div className="text-center text-emerald-600 font-medium animate-pulse">
            ✓ Meal added successfully!
          </div>
        )}
      </form>
    </div>
  );
}
