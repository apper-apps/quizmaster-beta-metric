import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon,
  className = '',
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-100 text-primary-800 border-primary-200'
      case 'secondary':
        return 'bg-secondary-100 text-secondary-800 border-secondary-200'
      case 'success':
        return 'bg-accent-100 text-accent-800 border-accent-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'danger':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs'
      case 'md':
        return 'px-3 py-1.5 text-sm'
      case 'lg':
        return 'px-4 py-2 text-base'
      default:
        return 'px-3 py-1.5 text-sm'
    }
  }

  return (
    <span
      className={`
        inline-flex items-center space-x-1 font-medium rounded-full border
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
      {...props}
    >
      {icon && <ApperIcon name={icon} size={16} />}
      <span>{children}</span>
    </span>
  )
}

export default Badge