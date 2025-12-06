import { ReactNode } from 'react'

export interface ProgressBarProps {
  current: number
  goal: number
  label?: string
  showStats?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'green' | 'red' | 'gold'
  className?: string
  stats?: {
    backers?: number
    daysLeft?: number
    customStat?: ReactNode
  }
}

export function ProgressBar({
  current,
  goal,
  label,
  showStats = true,
  size = 'md',
  color = 'green',
  className = '',
  stats,
}: ProgressBarProps) {
  const percentage = Math.min((current / goal) * 100, 100)
  const isFullyFunded = current >= goal

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  const colorClasses = {
    green: 'bg-vlockster-green',
    red: 'bg-vlockster-red',
    gold: 'bg-vlockster-gold',
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-vlockster-white">
            {label}
          </span>
          {isFullyFunded && (
            <span className="text-xs font-semibold text-vlockster-green px-2 py-1 bg-vlockster-green/10 rounded">
              FUNDED
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div
        className={`w-full ${heightClasses[size]} bg-vlockster-gray-dark rounded-full overflow-hidden relative`}
      >
        <div
          className={`${heightClasses[size]} ${colorClasses[color]} transition-all duration-700 ease-out rounded-full relative overflow-hidden`}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Raised Amount */}
          <div>
            <div className="text-2xl font-bold text-vlockster-white">
              {formatCurrency(current)}
            </div>
            <div className="text-xs text-vlockster-gray-text">
              raised of {formatCurrency(goal)}
            </div>
          </div>

          {/* Backers */}
          {stats?.backers !== undefined && (
            <div>
              <div className="text-2xl font-bold text-vlockster-white">
                {formatNumber(stats.backers)}
              </div>
              <div className="text-xs text-vlockster-gray-text">backers</div>
            </div>
          )}

          {/* Days Left */}
          {stats?.daysLeft !== undefined && (
            <div>
              <div className="text-2xl font-bold text-vlockster-white">
                {stats.daysLeft}
              </div>
              <div className="text-xs text-vlockster-gray-text">days left</div>
            </div>
          )}

          {/* Custom Stat */}
          {stats?.customStat && <div>{stats.customStat}</div>}
        </div>
      )}

      {/* Percentage Badge (optional) */}
      {!showStats && (
        <div className="mt-2 text-right">
          <span className="text-sm font-semibold text-vlockster-white">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  )
}

// Simple variant for minimal usage
export interface SimpleProgressBarProps {
  percentage: number
  color?: 'green' | 'red' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SimpleProgressBar({
  percentage,
  color = 'green',
  size = 'md',
  className = '',
}: SimpleProgressBarProps) {
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  const colorClasses = {
    green: 'bg-vlockster-green',
    red: 'bg-vlockster-red',
    gold: 'bg-vlockster-gold',
  }

  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)

  return (
    <div
      className={`w-full ${heightClasses[size]} bg-vlockster-gray-dark rounded-full overflow-hidden ${className}`}
    >
      <div
        className={`${heightClasses[size]} ${colorClasses[color]} transition-all duration-500 rounded-full`}
        style={{ width: `${clampedPercentage}%` }}
      />
    </div>
  )
}
