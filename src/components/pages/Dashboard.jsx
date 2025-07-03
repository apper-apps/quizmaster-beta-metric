import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import StatsCard from '@/components/molecules/StatsCard'
import QuizCard from '@/components/molecules/QuizCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import quizService from '@/services/api/quizService'
import subjectService from '@/services/api/subjectService'
import resultService from '@/services/api/resultService'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalSubjects: 0,
    completedQuizzes: 0,
    averageScore: 0
  })
  const [recentQuizzes, setRecentQuizzes] = useState([])
  const [recentResults, setRecentResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [quizzes, subjects, results] = await Promise.all([
        quizService.getAll(),
        subjectService.getAll(),
        resultService.getAll()
      ])

      // Calculate stats
      const totalQuizzes = quizzes.length
      const totalSubjects = subjects.length
      const completedQuizzes = results.length
      const averageScore = results.length > 0
        ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
        : 0

      setStats({
        totalQuizzes,
        totalSubjects,
        completedQuizzes,
        averageScore
      })

      // Get recent quizzes (last 3)
      const sortedQuizzes = quizzes
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
      
      setRecentQuizzes(sortedQuizzes)

      // Get recent results (last 5)
      const sortedResults = results
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        .slice(0, 5)
        .map(result => {
          const quiz = quizzes.find(q => q.Id === result.quizId)
          return { ...result, quizTitle: quiz?.title || 'Unknown Quiz' }
        })
      
      setRecentResults(sortedResults)
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) {
    return <Loading variant="dashboard" />
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-4">
          Welcome to QuizMaster Pro
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create engaging quizzes, track student progress, and make learning fun with our interactive platform.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Quizzes"
          value={stats.totalQuizzes}
          icon="BookOpen"
          color="primary"
        />
        <StatsCard
          title="Subjects"
          value={stats.totalSubjects}
          icon="GraduationCap"
          color="secondary"
        />
        <StatsCard
          title="Completed"
          value={stats.completedQuizzes}
          icon="CheckCircle"
          color="success"
        />
        <StatsCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          icon="Trophy"
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quizzes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Quizzes</h2>
              <Link to="/subjects">
                <Button variant="outline" size="sm" icon="ArrowRight">
                  View All
                </Button>
              </Link>
            </div>
            
            {recentQuizzes.length > 0 ? (
              <div className="space-y-4">
                {recentQuizzes.map((quiz) => (
                  <div key={quiz.Id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                        <p className="text-sm text-gray-600">{quiz.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{quiz.questions?.length || 0} questions</p>
                        <p className="text-xs text-gray-400">{quiz.timeLimit} min</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="BookOpen" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No quizzes created yet</p>
                <Link to="/control/quiz/new" className="inline-block mt-2">
                  <Button size="sm" icon="Plus">Create Quiz</Button>
                </Link>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Results</h2>
              <Link to="/scores">
                <Button variant="outline" size="sm" icon="ArrowRight">
                  View All
                </Button>
              </Link>
            </div>
            
            {recentResults.length > 0 ? (
              <div className="space-y-4">
                {recentResults.map((result) => (
                  <div key={result.Id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{result.quizTitle}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(result.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        result.score >= 80 ? 'text-green-600' : 
                        result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {result.score}%
                      </div>
                      <p className="text-xs text-gray-500">{result.timeSpent}s</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="Trophy" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No quiz results yet</p>
                <Link to="/subjects" className="inline-block mt-2">
                  <Button size="sm" icon="Play">Take a Quiz</Button>
                </Link>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-8 text-center bg-gradient-to-br from-primary-50 to-accent-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <p className="text-gray-600 mb-6">Get started with creating or taking quizzes</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/control/quiz/new">
              <Button icon="Plus" size="lg">
                Create New Quiz
              </Button>
            </Link>
            <Link to="/subjects">
              <Button variant="outline" icon="BookOpen" size="lg">
                Browse Subjects
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Dashboard