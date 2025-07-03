import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'default',
  shadow = 'default',
  ...props 
}) => {
  const getPaddingClasses = () => {
    switch (padding) {
      case 'sm':
        return 'p-4'
      case 'md':
        return 'p-6'
      case 'lg':
        return 'p-8'
      case 'none':
        return ''
      default:
        return 'p-6'
    }
  }

  const getShadowClasses = () => {
    switch (shadow) {
      case 'sm':
        return 'card-shadow'
      case 'md':
        return 'card-shadow-lg'
      case 'lg':
        return 'card-shadow-xl'
      case 'none':
        return ''
      default:
        return 'card-shadow-lg'
    }
  }

  const cardClasses = `
    bg-white rounded-xl border border-gray-100
    ${getShadowClasses()}
    ${getPaddingClasses()}
    ${hover ? 'hover:card-shadow-xl transition-all duration-300' : ''}
    ${className}
  `

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={cardClasses}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  )
}

export default Card