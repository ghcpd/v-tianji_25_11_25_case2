import { useState } from 'react';
import { useNutrition } from '../context/NutritionContext';

export function GoalsSettings() {
  const { state, setGoals } = useNutrition();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(state.goals);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const handleSave = () => {
    setGoals(formData);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleCancel = () => {
    setFormData(state.goals);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-3xl">🎯</span> Daily Goals
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {showSuccess && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-center">
          ✓ Goals updated successfully!
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
          <div>
            <p className="text-sm text-gray-600">Daily Calories</p>
            {isEditing ? (
              <input
                type="number"
                name="dailyCalories"
                value={formData.dailyCalories}
                onChange={handleChange}
                className="mt-1 w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <p className="text-2xl font-bold text-emerald-600">{state.goals.dailyCalories}</p>
            )}
          </div>
          <span className="text-4xl">🔥</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-blue-50 rounded-xl text-center">
            <p className="text-xs text-gray-600 mb-1">Protein</p>
            {isEditing ? (
              <input
                type="number"
                name="dailyProtein"
                value={formData.dailyProtein}
                onChange={handleChange}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-xl font-bold text-blue-600">{state.goals.dailyProtein}g</p>
            )}
          </div>
          <div className="p-4 bg-amber-50 rounded-xl text-center">
            <p className="text-xs text-gray-600 mb-1">Carbs</p>
            {isEditing ? (
              <input
                type="number"
                name="dailyCarbs"
                value={formData.dailyCarbs}
                onChange={handleChange}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-amber-500"
              />
            ) : (
              <p className="text-xl font-bold text-amber-600">{state.goals.dailyCarbs}g</p>
            )}
          </div>
          <div className="p-4 bg-red-50 rounded-xl text-center">
            <p className="text-xs text-gray-600 mb-1">Fat</p>
            {isEditing ? (
              <input
                type="number"
                name="dailyFat"
                value={formData.dailyFat}
                onChange={handleChange}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-red-500"
              />
            ) : (
              <p className="text-xl font-bold text-red-600">{state.goals.dailyFat}g</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
