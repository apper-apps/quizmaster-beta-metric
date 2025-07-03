import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Timer = ({ duration, onTimeUp, isActive = true }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60)

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          onTimeUp?.()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, onTimeUp])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const getTimerColor = () => {
    if (timeLeft < 60) return 'text-red-600'
    if (timeLeft < 300) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getProgressPercentage = () => {
    return ((duration * 60 - timeLeft) / (duration * 60)) * 100
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg p-4 shadow-lg border border-gray-200"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Clock" size={20} className={getTimerColor()} />
          <span className="text-sm font-medium text-gray-600">Time Remaining</span>
        </div>
      </div>
      
      <div className={`text-2xl font-bold ${getTimerColor()}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      
      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${getProgressPercentage()}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  )
}

export default Timer