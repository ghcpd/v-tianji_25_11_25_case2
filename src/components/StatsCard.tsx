import './StatsCard.css'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
}

export const StatsCard = ({ title, value, subtitle, icon }: StatsCardProps) => {
  return (
    <div className="stats-card">
      {icon && <div className="stats-icon">{icon}</div>}
      <div className="stats-content">
        <h3 className="stats-title">{title}</h3>
        <div className="stats-value">{value}</div>
        {subtitle && <div className="stats-subtitle">{subtitle}</div>}
      </div>
    </div>
  )
}

