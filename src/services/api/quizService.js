import mockQuizzes from '@/services/mockData/quizzes.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class QuizService {
  constructor() {
    this.data = [...mockQuizzes]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const quiz = this.data.find(item => item.Id === id)
    if (!quiz) {
      throw new Error('Quiz not found')
    }
    return { ...quiz }
  }

  async create(quiz) {
    await delay(400)
    const newQuiz = {
      ...quiz,
      Id: Math.max(...this.data.map(q => q.Id), 0) + 1,
      createdAt: new Date().toISOString()
    }
    this.data.push(newQuiz)
    return { ...newQuiz }
  }

  async update(id, quiz) {
    await delay(400)
    const index = this.data.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Quiz not found')
    }
    this.data[index] = { ...this.data[index], ...quiz }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.data.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Quiz not found')
    }
    this.data.splice(index, 1)
    return true
  }
}

export default new QuizService()