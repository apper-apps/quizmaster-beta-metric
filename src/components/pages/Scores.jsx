import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import resultService from '@/services/api/resultService'
import quizService from '@/services/api/quizService'

const Scores = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterSubject, setFilterSubject] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const loadResults = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [resultsData, quizzesData] = await Promise.all([
        resultService.getAll(),
        quizService.getAll()
      ])

      // Combine results with quiz information
      const enrichedResults = resultsData.map(result => {
        const quiz = quizzesData.find(q => q.Id === result.quizId)
        return {
          ...result,
          quizTitle: quiz?.title || 'Unknown Quiz',
          quizSubject: quiz?.subject || 'Unknown Subject'
        }
      })

      setResults(enrichedResults)
    } catch (err) {
      setError('Failed to load scores. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResults()
  }, [])

  const getScoreColor = (score) => {
    if (score >= 90) return 'success'
    if (score >= 80) return 'primary'
    if (score >= 70) return 'warning'
    if (score >= 60) return 'secondary'
    return 'danger'
  }

  const getPerformanceIcon = (score) => {
    if (score >= 90) return 'Trophy'
    if (score >= 80) return 'Award'
    if (score >= 70) return 'Target'
    if (score >= 60) return 'ThumbsUp'
    return 'AlertCircle'
  }

  const getFilteredResults = () => {
    let filtered = results

    if (filterSubject !== 'all') {
      filtered = filtered.filter(result => result.quizSubject === filterSubject)
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score
        case 'title':
          return a.quizTitle.localeCompare(b.quizTitle)
        case 'subject':
          return a.quizSubject.localeCompare(b.quizSubject)
        default:
          return new Date(b.completedAt) - new Date(a.completedAt)
      }
    })

    return filtered
  }

  const calculateStats = () => {
    if (results.length === 0) return { average: 0, highest: 0, total: 0 }
    
    const scores = results.map(r => r.score)
    return {
      average: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
      highest: Math.max(...scores),
      total: results.length
    }
  }

  const subjects = [...new Set(results.map(r => r.quizSubject))].filter(Boolean)
  const filteredResults = getFilteredResults()
  const stats = calculateStats()

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadResults} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Quiz Scores</h1>
          <p className="text-gray-600">Track your performance and progress</p>
        </div>
        
        <Link to="/subjects">
          <Button icon="Play">
            Take New Quiz
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="BarChart3" size={24} className="text-primary-600" />
            </div>
            <div className="text-3xl font-bold gradient-text mb-2">{stats.average}%</div>
            <div className="text-gray-600">Average Score</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Trophy" size={24} className="text-accent-600" />
            </div>
            <div className="text-3xl font-bold gradient-text mb-2">{stats.highest}%</div>
            <div className="text-gray-600">Highest Score</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="CheckCircle" size={24} className="text-secondary-600" />
            </div>
            <div className="text-3xl font-bold gradient-text mb-2">{stats.total}</div>
            <div className="text-gray-600">Quizzes Completed</div>
          </Card>
        </div>
      )}

      {results.length === 0 ? (
        <Empty variant="scores" />
      ) : (
        <>
          {/* Filters */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Subject
                  </label>
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="input-field w-auto"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input-field w-auto"
                  >
                    <option value="date">Date</option>
                    <option value="score">Score</option>
                    <option value="title">Quiz Title</option>
                    <option value="subject">Subject</option>
                  </select>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                Showing {filteredResults.length} of {results.length} results
              </div>
            </div>
          </Card>

          {/* Results List */}
          <Card className="overflow-hidden">
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
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResults.map((result, index) => (
                    <motion.tr
                      key={result.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {result.quizTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{result.quizSubject}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getScoreColor(result.score)} size="lg">
                          {result.score}%
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <ApperIcon 
                            name={getPerformanceIcon(result.score)} 
                            size={20} 
                            className={`${
                              result.score >= 80 ? 'text-green-600' :
                              result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}
                          />
                          <span className="text-sm text-gray-600">
                            {result.score >= 90 ? 'Excellent' :
                             result.score >= 80 ? 'Good' :
                             result.score >= 70 ? 'Average' :
                             result.score >= 60 ? 'Below Average' : 'Needs Improvement'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(result.completedAt))} ago
                        </div>
                        <div className="text-xs text-gray-400">
                          {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/quiz/${result.quizId}`}>
                          <Button variant="ghost" size="sm" icon="RotateCcw">
                            Retake
                          </Button>
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

export default Scores