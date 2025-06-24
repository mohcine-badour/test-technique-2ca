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

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('token')
        if (refreshToken) {
          const response = await api.post('/auth/refresh')
          const newToken = response.data.data.token
          localStorage.setItem('token', newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Token refresh failed, redirect to login
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export const authService = {
  // Login user
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Register user
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Logout user
  async logout() {
    const response = await api.post('/auth/logout')
    return response.data
  },

  // Get current user
  async me() {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Refresh token
  async refresh() {
    const response = await api.post('/auth/refresh')
    return response.data
  }
} 