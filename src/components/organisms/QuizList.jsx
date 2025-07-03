import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import QuizCard from '@/components/molecules/QuizCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import quizService from '@/services/api/quizService'

const QuizList = ({ subjectFilter = null, limit = null }) => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadQuizzes = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await quizService.getAll()
      
      let filteredQuizzes = data
      if (subjectFilter) {
        filteredQuizzes = data.filter(quiz => 
          quiz.subject.toLowerCase() === subjectFilter.toLowerCase()
        )
      }
      
      if (limit) {
        filteredQuizzes = filteredQuizzes.slice(0, limit)
      }
      
      setQuizzes(filteredQuizzes)
    } catch (err) {
      setError('Failed to load quizzes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuizzes()
  }, [subjectFilter, limit])

  if (loading) {
    return <Loading variant="subjects" />
  }

  if (error) {
    return <Error message={error} onRetry={loadQuizzes} />
  }

  if (quizzes.length === 0) {
    return <Empty variant="quizzes" />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz, index) => (
        <motion.div
          key={quiz.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <QuizCard quiz={quiz} />
        </motion.div>
      ))}
    </div>
  )
}

export default QuizList