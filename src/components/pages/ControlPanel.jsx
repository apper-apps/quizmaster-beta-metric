import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { formatDistanceToNow } from 'date-fns'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import quizService from '@/services/api/quizService'

const ControlPanel = () => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadQuizzes = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await quizService.getAll()
      setQuizzes(data)
    } catch (err) {
      setError('Failed to load quizzes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuizzes()
  }, [])

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return
    }

    try {
      await quizService.delete(quizId)
      setQuizzes(quizzes.filter(quiz => quiz.Id !== quizId))
      toast.success('Quiz deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete quiz. Please try again.')
    }
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

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadQuizzes} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Control Panel</h1>
          <p className="text-gray-600">Manage your quizzes and create new content</p>
        </div>
        
        <Link to="/control/quiz/new">
          <Button icon="Plus" size="lg">
            Create New Quiz
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold gradient-text mb-2">{quizzes.length}</div>
          <div className="text-gray-600">Total Quizzes</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold gradient-text mb-2">
            {quizzes.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0)}
          </div>
          <div className="text-gray-600">Total Questions</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold gradient-text mb-2">
            {[...new Set(quizzes.map(quiz => quiz.subject))].length}
          </div>
          <div className="text-gray-600">Subjects</div>
        </Card>
      </div>

      {/* Quiz List */}
      {quizzes.length === 0 ? (
        <Empty 
          variant="quizzes"
          onAction={() => window.location.href = '/control/quiz/new'}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Quiz Management</h2>
            <p className="text-gray-600">Edit, delete, or view details of your quizzes</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quizzes.map((quiz, index) => (
                  <motion.tr
                    key={quiz.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {quiz.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{quiz.subject}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="HelpCircle" size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {quiz.questions?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty || 'Medium'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(quiz.createdAt))} ago
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link to={`/control/quiz/${quiz.Id}/edit`}>
                          <Button variant="ghost" size="sm" icon="Edit">
                            Edit
                          </Button>
                        </Link>
                        <Link to={`/quiz/${quiz.Id}`}>
                          <Button variant="ghost" size="sm" icon="Play">
                            Preview
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => handleDeleteQuiz(quiz.Id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

export default ControlPanel