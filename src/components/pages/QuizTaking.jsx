import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Timer from '@/components/molecules/Timer'
import ProgressRing from '@/components/molecules/ProgressRing'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import quizService from '@/services/api/quizService'
import resultService from '@/services/api/resultService'

const QuizTaking = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  
  const [quiz, setQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [timeSpent, setTimeSpent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quizStarted, setQuizStarted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const loadQuiz = async () => {
    try {
      setLoading(true)
      setError('')
      const quizData = await quizService.getById(parseInt(quizId))
      setQuiz(quizData)
    } catch (err) {
      setError('Failed to load quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuiz()
  }, [quizId])

  useEffect(() => {
    if (quizStarted) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [quizStarted])

  const handleStartQuiz = () => {
    setQuizStarted(true)
    toast.success('Quiz started! Good luck!')
  }

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answerIndex
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleTimeUp = () => {
    toast.warning('Time is up! Submitting your quiz...')
    handleSubmitQuiz()
  }

  const handleSubmitQuiz = async () => {
    try {
      // Calculate score
      let correctAnswers = 0
      let totalPoints = 0
      
      quiz.questions.forEach((question, index) => {
        totalPoints += question.points
        if (selectedAnswers[index] === question.correctAnswer) {
          correctAnswers += question.points
        }
      })

      const score = Math.round((correctAnswers / totalPoints) * 100)

      // Save result
      const result = {
        Id: Date.now(),
        quizId: quiz.Id,
        score,
        totalPoints,
        completedAt: new Date().toISOString(),
        timeSpent,
        answers: selectedAnswers
      }

      await resultService.create(result)
      
      toast.success(`Quiz completed! Your score: ${score}%`)
      navigate(`/quiz/${quizId}/results`, { 
        state: { 
          result, 
          quiz,
          selectedAnswers 
        } 
      })
    } catch (err) {
      toast.error('Failed to submit quiz. Please try again.')
    }
  }

  if (loading) {
    return <Loading variant="quiz" />
  }

  if (error) {
    return <Error message={error} onRetry={loadQuiz} />
  }

  if (!quiz) {
    return <Error message="Quiz not found" />
  }

  // Quiz intro screen
  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="text-center p-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <ApperIcon name="BookOpen" size={40} className="text-white" />
            </div>
            
            <h1 className="text-3xl font-bold gradient-text mb-4">{quiz.title}</h1>
            <p className="text-gray-600 mb-6">{quiz.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{quiz.questions.length}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600">{quiz.timeLimit}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">{quiz.difficulty}</div>
                <div className="text-sm text-gray-600">Difficulty</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button size="lg" icon="Play" onClick={handleStartQuiz}>
                Start Quiz
              </Button>
              <Button variant="outline" icon="ArrowLeft" onClick={() => navigate(-1)}>
                Back
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100
  const answeredQuestions = Object.keys(selectedAnswers).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-600">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <ProgressRing progress={progress} size={80} />
          <Timer 
            duration={quiz.timeLimit} 
            onTimeUp={handleTimeUp}
            isActive={quizStarted}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentQuestion.text}
              </h2>
              <div className="text-sm text-gray-500">
                {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
              </div>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'border-primary-500 bg-primary-50 text-primary-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswers[currentQuestionIndex] === index && (
                        <ApperIcon name="Check" size={16} className="text-white" />
                      )}
                    </div>
                    <span className="font-medium">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          icon="ArrowLeft"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="text-sm text-gray-600">
          {answeredQuestions} of {quiz.questions.length} answered
        </div>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <Button
            icon="CheckCircle"
            onClick={handleSubmitQuiz}
            disabled={answeredQuestions === 0}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            icon="ArrowRight"
            iconPosition="right"
            onClick={handleNextQuestion}
          >
            Next
          </Button>
        )}
      </div>

      {/* Question Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                index === currentQuestionIndex
                  ? 'bg-primary-500 text-white'
                  : selectedAnswers[index] !== undefined
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default QuizTaking