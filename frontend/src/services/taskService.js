import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const taskService = {
  // Get all tasks
  async getTasks(params = {}) {
    const response = await api.get('/tasks', { params })
    return response.data
  },

  // Get single task
  async getTask(id) {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },

  // Create task
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData)
    return response.data
  },

  // Update task
  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData)
    return response.data
  },

  // Delete task
  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`)
    return response.data
  }
} 