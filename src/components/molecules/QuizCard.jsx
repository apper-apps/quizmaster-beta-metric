import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'

const QuizCard = ({ quiz, showSubject = true }) => {
  const navigate = useNavigate()

  const handleStartQuiz = () => {
    navigate(`/quiz/${quiz.Id}`)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'success'
      case 'medium':
        return 'warning'
      case 'hard':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getSubjectIcon = (subject) => {
    const icons = {
      'Mathematics': 'Calculator',
      'Science': 'Microscope',
      'History': 'Clock',
      'English': 'BookOpen',
      'Geography': 'Globe',
      'Chemistry': 'FlaskConical',
      'Physics': 'Zap',
      'Biology': 'Leaf',
    }
    return icons[subject] || 'BookOpen'
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="quiz-card h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {showSubject && (
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <ApperIcon 
                    name={getSubjectIcon(quiz.subject)} 
                    size={24} 
                    className="text-white" 
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{quiz.title}</h3>
                {showSubject && (
                  <p className="text-sm text-gray-600">{quiz.subject}</p>
                )}
              </div>
            </div>
            <Badge variant={getDifficultyColor(quiz.difficulty)}>
              {quiz.difficulty || 'Medium'}
            </Badge>
          </div>

          <p className="text-gray-600 mb-4 flex-grow">{quiz.description}</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <ApperIcon name="HelpCircle" size={16} />
                  <span>{quiz.questions?.length || 0} Questions</span>
                </span>
                <span className="flex items-center space-x-1">
                  <ApperIcon name="Clock" size={16} />
                  <span>{quiz.timeLimit} min</span>
                </span>
              </div>
              <span className="text-xs">
                {formatDistanceToNow(new Date(quiz.createdAt))} ago
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartQuiz}
              className="w-full btn-primary"
            >
              <ApperIcon name="Play" size={20} />
              <span>Start Quiz</span>
            </motion.button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default QuizCard