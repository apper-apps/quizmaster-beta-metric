import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Subjects from '@/components/pages/Subjects'
import QuizTaking from '@/components/pages/QuizTaking'
import ControlPanel from '@/components/pages/ControlPanel'
import QuizEditor from '@/components/pages/QuizEditor'
import Scores from '@/components/pages/Scores'
import QuizResults from '@/components/pages/QuizResults'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="subjects/:subjectId" element={<Subjects />} />
            <Route path="quiz/:quizId" element={<QuizTaking />} />
            <Route path="quiz/:quizId/results" element={<QuizResults />} />
            <Route path="control" element={<ControlPanel />} />
            <Route path="control/quiz/new" element={<QuizEditor />} />
            <Route path="control/quiz/:quizId/edit" element={<QuizEditor />} />
            <Route path="scores" element={<Scores />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App