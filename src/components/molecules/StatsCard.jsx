import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const StatsCard = ({ title, value, subtitle, icon, color = 'primary', trend }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return {
          bg: 'from-primary-500 to-primary-600',
          iconBg: 'bg-primary-100',
          iconColor: 'text-primary-600'
        }
      case 'secondary':
        return {
          bg: 'from-secondary-500 to-secondary-600',
          iconBg: 'bg-secondary-100',
          iconColor: 'text-secondary-600'
        }
      case 'success':
        return {
          bg: 'from-accent-500 to-accent-600',
          iconBg: 'bg-accent-100',
          iconColor: 'text-accent-600'
        }
      case 'warning':
        return {
          bg: 'from-yellow-500 to-yellow-600',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600'
        }
      default:
        return {
          bg: 'from-gray-500 to-gray-600',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600'
        }
    }
  }

  const colors = getColorClasses()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Card className="overflow-hidden relative">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.bg} opacity-5 rounded-full -translate-y-12 translate-x-12`}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
              <ApperIcon name={icon} size={24} className={colors.iconColor} />
            </div>
            {trend && (
              <div className={`flex items-center space-x-1 text-sm ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                <ApperIcon name={trend.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} size={16} />
                <span>{trend.value}</span>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1 gradient-text">{value}</h3>
            <p className="text-gray-600 font-medium">{title}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default StatsCard