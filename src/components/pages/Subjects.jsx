import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import SubjectCard from '@/components/molecules/SubjectCard'
import QuizList from '@/components/organisms/QuizList'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import subjectService from '@/services/api/subjectService'
import quizService from '@/services/api/quizService'

const Subjects = () => {
  const { subjectId } = useParams()
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadSubjects = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [subjectsData, quizzesData] = await Promise.all([
        subjectService.getAll(),
        quizService.getAll()
      ])

      // Count quizzes per subject
      const subjectsWithCounts = subjectsData.map(subject => ({
        ...subject,
        quizCount: quizzesData.filter(quiz => quiz.subject === subject.name).length
      }))

      setSubjects(subjectsWithCounts)

      // If subjectId is provided, find and set the selected subject
      if (subjectId) {
        const subject = subjectsWithCounts.find(s => s.Id === parseInt(subjectId))
        setSelectedSubject(subject)
      }
    } catch (err) {
      setError('Failed to load subjects. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubjects()
  }, [subjectId])

  const handleBackToSubjects = () => {
    setSelectedSubject(null)
    window.history.pushState({}, '', '/subjects')
  }

  if (loading) {
    return <Loading variant="subjects" />
  }

  if (error) {
    return <Error message={error} onRetry={loadSubjects} />
  }

  // Show individual subject quizzes
  if (selectedSubject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              icon="ArrowLeft"
              onClick={handleBackToSubjects}
              className="mb-4"
            >
              Back to Subjects
            </Button>
            <h1 className="text-3xl font-bold gradient-text">{selectedSubject.name}</h1>
            <p className="text-gray-600">
              {selectedSubject.quizCount} {selectedSubject.quizCount === 1 ? 'quiz' : 'quizzes'} available
            </p>
          </div>
          
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <ApperIcon name={selectedSubject.icon} size={32} className="text-white" />
          </div>
        </div>

        <QuizList subjectFilter={selectedSubject.name} />
      </div>
    )
  }

  // Show all subjects
  if (subjects.length === 0) {
    return <Empty variant="subjects" />
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold gradient-text mb-4">Choose Your Subject</h1>
        <p className="text-xl text-gray-600">
          Select a subject to browse available quizzes and start learning
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SubjectCard 
              subject={subject} 
              quizCount={subject.quizCount}
            />
          </motion.div>
        ))}
      </div>

      {subjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for?
          </p>
          <Button variant="outline" icon="Plus">
            Request New Subject
          </Button>
        </motion.div>
      )}
    </div>
  )
}

export default Subjects