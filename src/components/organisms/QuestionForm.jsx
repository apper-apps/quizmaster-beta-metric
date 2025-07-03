import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const QuestionForm = ({ onAddQuestion, onCancel }) => {
  const [question, setQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 10
  })

  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options]
    newOptions[index] = value
    setQuestion({ ...question, options: newOptions })
  }

  const handleCorrectAnswerChange = (index) => {
    setQuestion({ ...question, correctAnswer: index })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    if (!question.text.trim()) {
      toast.error('Please enter a question')
      return
    }
    
    const filledOptions = question.options.filter(opt => opt.trim())
    if (filledOptions.length < 2) {
      toast.error('Please provide at least 2 answer options')
      return
    }
    
    if (!question.options[question.correctAnswer].trim()) {
      toast.error('The selected correct answer cannot be empty')
      return
    }

    const newQuestion = {
      Id: Date.now(),
      text: question.text,
      options: question.options.filter(opt => opt.trim()),
      correctAnswer: question.correctAnswer,
      points: parseInt(question.points)
    }

    onAddQuestion(newQuestion)
    
    // Reset form
    setQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10
    })
    
    toast.success('Question added successfully!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Add New Question</h3>
          <Button variant="ghost" onClick={onCancel} icon="X" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Question Text"
            value={question.text}
            onChange={(e) => setQuestion({ ...question, text: e.target.value })}
            placeholder="Enter your question here..."
            required
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Answer Options
            </label>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handleCorrectAnswerChange(index)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      question.correctAnswer === index
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {question.correctAnswer === index && (
                      <ApperIcon name="Check" size={16} className="text-white" />
                    )}
                  </button>
                  
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Click the circle to mark the correct answer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Points"
              type="number"
              value={question.points}
              onChange={(e) => setQuestion({ ...question, points: e.target.value })}
              min="1"
              max="100"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" icon="Plus">
              Add Question
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  )
}

export default QuestionForm