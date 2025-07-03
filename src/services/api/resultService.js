import mockResults from '@/services/mockData/results.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ResultService {
  constructor() {
    this.data = [...mockResults]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const result = this.data.find(item => item.Id === id)
    if (!result) {
      throw new Error('Result not found')
    }
    return { ...result }
  }

  async create(result) {
    await delay(400)
    const newResult = {
      ...result,
      Id: Math.max(...this.data.map(r => r.Id), 0) + 1
    }
    this.data.push(newResult)
    return { ...newResult }
  }

  async update(id, result) {
    await delay(400)
    const index = this.data.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Result not found')
    }
    this.data[index] = { ...this.data[index], ...result }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.data.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Result not found')
    }
    this.data.splice(index, 1)
    return true
  }
}

export default new ResultService()