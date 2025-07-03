import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navigationItems = [
    { path: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
    { path: '/subjects', icon: 'BookOpen', label: 'Subjects' },
    { path: '/control', icon: 'Settings', label: 'Control Panel' },
    { path: '/scores', icon: 'Trophy', label: 'Scores' },
  ]

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        <ApperIcon name={isOpen ? "X" : "Menu"} size={24} className="text-gray-600" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%'
        }}
        className="lg:translate-x-0 lg:static fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 lg:block"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">QuizMaster</h1>
              <p className="text-sm text-gray-600">Pro</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                  >
                    <ApperIcon name={item.icon} size={20} />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <ApperIcon name="Lightbulb" size={20} className="text-primary-600" />
                <h3 className="font-semibold text-gray-900">Quick Tip</h3>
              </div>
              <p className="text-sm text-gray-600">
                Create engaging quizzes with multimedia questions to boost student participation!
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar