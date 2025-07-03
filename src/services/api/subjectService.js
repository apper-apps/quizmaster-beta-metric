import mockSubjects from '@/services/mockData/subjects.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class SubjectService {
  constructor() {
    this.data = [...mockSubjects]
  }

  async getAll() {
    await delay(250)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const subject = this.data.find(item => item.Id === id)
    if (!subject) {
      throw new Error('Subject not found')
    }
    return { ...subject }
  }

  async create(subject) {
    await delay(400)
    const newSubject = {
      ...subject,
      Id: Math.max(...this.data.map(s => s.Id), 0) + 1
    }
    this.data.push(newSubject)
    return { ...newSubject }
  }

  async update(id, subject) {
    await delay(400)
    const index = this.data.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Subject not found')
    }
    this.data[index] = { ...this.data[index], ...subject }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.data.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Subject not found')
    }
    this.data.splice(index, 1)
    return true
  }
}

export default new SubjectService()