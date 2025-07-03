import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry, variant = 'default' }) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name="AlertTriangle" size={40} className="text-red-600" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h3 className="text-2xl font-bold text-gray-900">Oops! Something went wrong</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
        
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
            className="btn-primary inline-flex items-center space-x-2 mt-6"
          >
            <ApperIcon name="RefreshCw" size={20} />
            <span>Try Again</span>
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  )
}

export default Error