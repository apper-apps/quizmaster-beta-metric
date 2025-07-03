import { useLocation } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Header = () => {
  const location = useLocation()
  
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Dashboard', subtitle: 'Overview of your quiz activities' }
      case '/subjects':
        return { title: 'Subjects', subtitle: 'Browse quiz categories' }
      case '/control':
        return { title: 'Control Panel', subtitle: 'Manage quizzes and questions' }
      case '/scores':
        return { title: 'Scores', subtitle: 'View quiz results and analytics' }
      default:
        if (location.pathname.includes('/quiz/')) {
          return { title: 'Quiz Session', subtitle: 'Answer questions and track progress' }
        }
        if (location.pathname.includes('/control/quiz/')) {
          return { title: 'Quiz Editor', subtitle: 'Create and edit quiz content' }
        }
        return { title: 'QuizMaster Pro', subtitle: 'Interactive learning platform' }
    }
  }

  const pageInfo = getPageInfo()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pageInfo.title}</h1>
          <p className="text-gray-600 mt-1">{pageInfo.subtitle}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ApperIcon name="Calendar" size={16} />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header