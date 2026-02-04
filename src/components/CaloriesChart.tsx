import { DailyStats } from '../types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'
import { enUS } from 'date-fns/locale'
import './CaloriesChart.css'

interface CaloriesChartProps {
  data: DailyStats[]
}

export const CaloriesChart = ({ data }: CaloriesChartProps) => {
  const chartData = data.map(stat => ({
    date: format(parseISO(stat.date), 'MM/dd', { locale: enUS }),
    fullDate: stat.date,
    calories: stat.totalCalories,
  }))

  return (
    <div className="calories-chart">
      <h2>Last 7 Days Calorie Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="date" 
            stroke="#666"
            style={{ fontSize: '0.85rem' }}
          />
          <YAxis 
            stroke="#666"
            style={{ fontSize: '0.85rem' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '0.5rem',
            }}
            labelFormatter={(value) => {
              const stat = data.find(d => d.date === value)
              if (stat) {
                return format(parseISO(stat.date), 'MMM dd, yyyy', { locale: enUS })
              }
              return value
            }}
            formatter={(value: number) => [`${value} calories`, 'Calories']}
          />
          <Line 
            type="monotone" 
            dataKey="calories" 
            stroke="#667eea" 
            strokeWidth={3}
            dot={{ fill: '#764ba2', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

