import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ProgressRing from '@/components/molecules/ProgressRing'
import ApperIcon from '@/components/ApperIcon'

const QuizResults = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showConfetti, setShowConfetti] = useState(false)
  
  const { result, quiz, selectedAnswers } = location.state || {}

  useEffect(() => {
    if (!result || !quiz) {
      navigate('/subjects')
      return
    }

    // Show confetti for high scores
    if (result.score >= 80) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [result, quiz, navigate])

  if (!result || !quiz) {
    return null
  }

  const getScoreMessage = (score) => {
    if (score >= 90) return { message: "Outstanding!", color: "text-green-600", icon: "Trophy" }
    if (score >= 80) return { message: "Excellent Work!", color: "text-green-600", icon: "Award" }
    if (score >= 70) return { message: "Good Job!", color: "text-blue-600", icon: "ThumbsUp" }
    if (score >= 60) return { message: "Not Bad!", color: "text-yellow-600", icon: "Target" }
    return { message: "Keep Practicing!", color: "text-red-600", icon: "RefreshCw" }
  }

  const scoreMessage = getScoreMessage(result.score)
  const correctAnswers = quiz.questions.filter((_, index) => 
    selectedAnswers[index] === quiz.questions[index].correctAnswer
  ).length

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 opacity-80 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className={`text-6xl mb-4 ${scoreMessage.color}`}>
          <ApperIcon name={scoreMessage.icon} size={80} className="mx-auto" />
        </div>
        <h1 className={`text-4xl font-bold mb-2 ${scoreMessage.color}`}>
          {scoreMessage.message}
        </h1>
        <p className="text-xl text-gray-600">Quiz Completed Successfully</p>
      </motion.div>

      {/* Score Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-8 text-center bg-gradient-to-br from-primary-50 to-accent-50">
          <div className="flex items-center justify-center mb-6">
            <ProgressRing 
              progress={result.score} 
              size={150} 
              color={result.score >= 80 ? '#10B981' : result.score >= 60 ? '#F59E0B' : '#EF4444'}
            />
          </div>
          
          <h2 className="text-3xl font-bold gradient-text mb-2">{quiz.title}</h2>
          <p className="text-gray-600 mb-6">{quiz.subject}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-gray-900">{result.score}%</div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {correctAnswers}/{quiz.questions.length}
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{quiz.difficulty}</div>
              <div className="text-sm text-gray-600">Difficulty</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Detailed Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Question Review</h3>
          
          <div className="space-y-4">
            {quiz.questions.map((question, index) => {
              const userAnswer = selectedAnswers[index]
              const isCorrect = userAnswer === question.correctAnswer
              
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect 
                      ? 'border-green-200 bg-green-50' 
                      : userAnswer !== undefined 
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCorrect 
                        ? 'bg-green-500 text-white' 
                        : userAnswer !== undefined 
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-400 text-white'
                    }`}>
                      <ApperIcon 
                        name={isCorrect ? "Check" : userAnswer !== undefined ? "X" : "Minus"} 
                        size={16} 
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Question {index + 1}: {question.text}
                      </h4>
                      
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded text-sm ${
                              optIndex === question.correctAnswer
                                ? 'bg-green-100 text-green-800 font-medium'
                                : optIndex === userAnswer && !isCorrect
                                  ? 'bg-red-100 text-red-800'
                                  : 'text-gray-700'
                            }`}
                          >
                            <span className="font-medium">
                              {String.fromCharCode(65 + optIndex)}.
                            </span> {option}
                            {optIndex === question.correctAnswer && (
                              <ApperIcon name="Check" size={16} className="inline ml-2 text-green-600" />
                            )}
                            {optIndex === userAnswer && optIndex !== question.correctAnswer && (
                              <ApperIcon name="X" size={16} className="inline ml-2 text-red-600" />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {userAnswer === undefined && (
                        <p className="text-sm text-gray-500 mt-2">Not answered</p>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {question.points} pts
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link to={`/quiz/${quiz.Id}`}>
          <Button icon="RotateCcw" size="lg">
            Retake Quiz
          </Button>
        </Link>
        <Link to={`/subjects/${quiz.subject}`}>
          <Button variant="outline" icon="BookOpen" size="lg">
            More {quiz.subject} Quizzes
          </Button>
        </Link>
        <Link to="/subjects">
          <Button variant="outline" icon="Home" size="lg">
            Browse All Subjects
          </Button>
        </Link>
        <Link to="/scores">
          <Button variant="outline" icon="Trophy" size="lg">
            View All Scores
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}

export default QuizResults