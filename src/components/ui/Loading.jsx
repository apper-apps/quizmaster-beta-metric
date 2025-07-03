import { motion } from 'framer-motion'

const Loading = ({ variant = 'default' }) => {
  if (variant === 'quiz') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
        />
        <div className="text-center space-y-2">
          <div className="h-6 bg-gray-200 rounded-lg w-48 shimmer"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-32 shimmer"></div>
        </div>
      </div>
    )
  }

  if (variant === 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="quiz-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg shimmer"></div>
                <div className="w-16 h-8 bg-gray-200 rounded-full shimmer"></div>
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded-lg w-3/4 shimmer"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/2 shimmer"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="quiz-card p-6">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3 shimmer"></div>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-full shimmer"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded-lg w-2/3 shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/3 shimmer"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded-lg shimmer"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'subjects') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="subject-card p-6 bg-gray-200 shimmer h-40">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gray-300 rounded-xl shimmer"></div>
              <div className="space-y-2 w-full">
                <div className="h-6 bg-gray-300 rounded-lg w-3/4 mx-auto shimmer"></div>
                <div className="h-4 bg-gray-300 rounded-lg w-1/2 mx-auto shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
      />
      <div className="text-gray-600 font-medium">Loading...</div>
    </div>
  )
}

export default Loading