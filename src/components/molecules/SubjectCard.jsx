import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const SubjectCard = ({ subject, quizCount = 0 }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/subjects/${subject.Id}`)
  }

  const getSubjectColor = (subjectName) => {
    const colors = {
      'Mathematics': 'from-blue-500 to-blue-600',
      'Science': 'from-green-500 to-green-600',
      'History': 'from-yellow-500 to-yellow-600',
      'English': 'from-red-500 to-red-600',
      'Geography': 'from-purple-500 to-purple-600',
      'Chemistry': 'from-cyan-500 to-cyan-600',
      'Physics': 'from-orange-500 to-orange-600',
      'Biology': 'from-lime-500 to-lime-600',
    }
    return colors[subjectName] || 'from-gray-500 to-gray-600'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <Card 
        className={`
          subject-card cursor-pointer overflow-hidden
          bg-gradient-to-br ${getSubjectColor(subject.name)}
          text-white border-none
        `}
        padding="none"
        hover={false}
      >
        <div className="p-6 relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-6 -translate-x-6"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <ApperIcon name={subject.icon} size={32} className="text-white" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-1">{subject.name}</h3>
              <p className="text-white/80 text-sm">
                {quizCount} {quizCount === 1 ? 'Quiz' : 'Quizzes'} Available
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default SubjectCard