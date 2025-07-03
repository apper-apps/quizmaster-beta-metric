import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import QuestionForm from '@/components/organisms/QuestionForm'
import ApperIcon from '@/components/ApperIcon'
import quizService from '@/services/api/quizService'
import subjectService from '@/services/api/subjectService'

const QuizEditor = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(quizId)

  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    subject: '',
    timeLimit: 30,
    difficulty: 'Medium',
    questions: []
  })
  const [subjects, setSubjects] = useState([])
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const subjectsData = await subjectService.getAll()
      setSubjects(subjectsData)

      if (isEditing) {
        const quizData = await quizService.getById(parseInt(quizId))
        setQuiz(quizData)
      }
    } catch (err) {
      setError('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [quizId])

  const handleInputChange = (field, value) => {
    setQuiz({ ...quiz, [field]: value })
  }

  const handleAddQuestion = (question) => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, question]
    })
    setShowQuestionForm(false)
  }

  const handleRemoveQuestion = (index) => {
    if (window.confirm('Are you sure you want to remove this question?')) {
      const newQuestions = quiz.questions.filter((_, i) => i !== index)
      setQuiz({ ...quiz, questions: newQuestions })
      toast.success('Question removed successfully!')
    }
  }

  const handleSaveQuiz = async () => {
    // Validation
    if (!quiz.title.trim()) {
      toast.error('Please enter a quiz title')
      return
    }
    
    if (!quiz.subject) {
      toast.error('Please select a subject')
      return
    }
    
    if (quiz.questions.length === 0) {
      toast.error('Please add at least one question')
      return
    }

    try {
      setSaving(true)
      
      const quizData = {
        ...quiz,
        createdAt: isEditing ? quiz.createdAt : new Date().toISOString()
      }

      if (isEditing) {
        await quizService.update(parseInt(quizId), quizData)
        toast.success('Quiz updated successfully!')
      } else {
        await quizService.create(quizData)
        toast.success('Quiz created successfully!')
      }
      
      navigate('/control')
    } catch (err) {
      toast.error('Failed to save quiz. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update your quiz content and settings' : 'Build an engaging quiz for your students'}
          </p>
        </div>
        
        <Button
          variant="outline"
          icon="ArrowLeft"
          onClick={() => navigate('/control')}
        >
          Back to Control Panel
        </Button>
      </div>

      {/* Quiz Details Form */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quiz Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Quiz Title"
            value={quiz.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter quiz title..."
            required
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject
            </label>
            <select
              value={quiz.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.Id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Time Limit (minutes)
            </label>
            <input
              type="number"
              value={quiz.timeLimit}
              onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value))}
              className="input-field"
              min="1"
              max="180"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={quiz.difficulty}
              onChange={(e) => handleInputChange('difficulty', e.target.value)}
              className="input-field"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={quiz.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter quiz description..."
            rows={3}
            className="input-field resize-none"
          />
        </div>
      </Card>

      {/* Questions Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Questions</h2>
            <p className="text-gray-600">
              {quiz.questions.length} {quiz.questions.length === 1 ? 'question' : 'questions'} added
            </p>
          </div>
          
          <Button
            icon="Plus"
            onClick={() => setShowQuestionForm(true)}
            disabled={showQuestionForm}
          >
            Add Question
          </Button>
        </div>

        <AnimatePresence>
          {showQuestionForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <QuestionForm
                onAddQuestion={handleAddQuestion}
                onCancel={() => setShowQuestionForm(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {quiz.questions.length === 0 && !showQuestionForm ? (
          <Empty 
            variant="questions"
            onAction={() => setShowQuestionForm(true)}
          />
        ) : (
          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <motion.div
                key={question.Id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Question {index + 1}: {question.text}
                    </h3>
                    <div className="space-y-1">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`text-sm ${
                            optIndex === question.correctAnswer
                              ? 'text-green-600 font-medium'
                              : 'text-gray-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}. {option}
                          {optIndex === question.correctAnswer && (
                            <ApperIcon name="Check" size={16} className="inline ml-1" />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {question.points} points
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => handleRemoveQuestion(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/control')}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveQuiz}
          loading={saving}
          icon="Save"
          disabled={quiz.questions.length === 0}
        >
          {isEditing ? 'Update Quiz' : 'Save Quiz'}
        </Button>
      </div>
    </div>
  )
}

export default QuizEditor