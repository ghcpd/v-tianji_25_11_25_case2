import { useNutrition } from '../context/NutritionContext';
import { format, subDays } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area,
} from 'recharts';

interface WeeklyChartProps {
  date?: string;
}

export function WeeklyChart({ date = format(new Date(), 'yyyy-MM-dd') }: WeeklyChartProps) {
  const { getWeeklyNutrition, state } = useNutrition();
  const weeklyData = getWeeklyNutrition(date);
  const { goals } = state;

  const chartData = weeklyData.map((day) => ({
    date: format(new Date(day.date), 'EEE'),
    fullDate: day.date,
    calories: day.totalCalories,
    protein: day.totalProtein,
    carbs: day.totalCarbs,
    fat: day.totalFat,
    goal: goals.dailyCalories,
  }));

  // Calculate weekly stats
  const totalCalories = weeklyData.reduce((sum, day) => sum + day.totalCalories, 0);
  const avgCalories = Math.round(totalCalories / 7);
  const daysOnTarget = weeklyData.filter(
    (day) => day.totalCalories >= goals.dailyCalories * 0.8 && day.totalCalories <= goals.dailyCalories * 1.2
  ).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <span className="text-3xl">📈</span> Weekly Progress
      </h2>
      <p className="text-gray-500 mb-6">
        {format(subDays(new Date(date), 6), 'MMM d')} - {format(new Date(date), 'MMM d, yyyy')}
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{totalCalories.toLocaleString()}</p>
          <p className="text-xs text-gray-600">Total Calories</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{avgCalories}</p>
          <p className="text-xs text-gray-600">Daily Average</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{daysOnTarget}/7</p>
          <p className="text-xs text-gray-600">Days on Target</p>
        </div>
      </div>

      {/* Calories Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Calorie Intake</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <ReferenceLine y={goals.dailyCalories} stroke="#f59e0b" strokeDasharray="5 5" label="Goal" />
              <Area
                type="monotone"
                dataKey="calories"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorCalories)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Macros Chart */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Macronutrients</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="protein"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                name="Protein (g)"
              />
              <Line
                type="monotone"
                dataKey="carbs"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
                name="Carbs (g)"
              />
              <Line
                type="monotone"
                dataKey="fat"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                name="Fat (g)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
