import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary'
      case 'secondary':
        return 'btn-secondary'
      case 'outline':
        return 'btn-outline'
      case 'ghost':
        return 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-all duration-200'
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[0.98] active:scale-[0.96]'
      default:
        return 'btn-primary'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-4 text-sm'
      case 'md':
        return 'py-3 px-6'
      case 'lg':
        return 'py-4 px-8 text-lg'
      default:
        return 'py-3 px-6'
    }
  }

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e)
    }
  }

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
        inline-flex items-center justify-center space-x-2
      `}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" size={20} className="animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <ApperIcon name={icon} size={20} />
          )}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && (
            <ApperIcon name={icon} size={20} />
          )}
        </>
      )}
    </motion.button>
  )
}

export default Button