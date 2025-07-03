import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found", 
  message = "There's nothing here yet", 
  actionLabel, 
  onAction,
  icon = 'Inbox',
  variant = 'default'
}) => {
  const getEmptyContent = () => {
    switch (variant) {
      case 'quizzes':
        return {
          title: "No quizzes available",
          message: "Get started by creating your first quiz or check back later for new content",
          icon: 'BookOpen',
          actionLabel: "Create Quiz"
        }
      case 'subjects':
        return {
          title: "No subjects found",
          message: "Subjects will appear here once quizzes are created",
          icon: 'GraduationCap',
          actionLabel: "Add Subjects"
        }
      case 'scores':
        return {
          title: "No quiz results yet",
          message: "Take your first quiz to see your scores and progress here",
          icon: 'Trophy',
          actionLabel: "Browse Quizzes"
        }
      case 'questions':
        return {
          title: "No questions added",
          message: "Start building your quiz by adding questions below",
          icon: 'HelpCircle',
          actionLabel: "Add Question"
        }
      default:
        return { title, message, icon, actionLabel }
    }
  }

  const content = getEmptyContent()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mb-8"
      >
        <ApperIcon name={content.icon} size={48} className="text-primary-600" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 max-w-md"
      >
        <h3 className="text-2xl font-bold text-gray-900">{content.title}</h3>
        <p className="text-gray-600">{content.message}</p>
        
        {(onAction || content.actionLabel) && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAction}
            className="btn-primary inline-flex items-center space-x-2 mt-6"
          >
            <ApperIcon name="Plus" size={20} />
            <span>{content.actionLabel || actionLabel}</span>
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  )
}

export default Empty