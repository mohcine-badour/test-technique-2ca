import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userFullName = computed(() => user.value?.full_name || '')
  const userEmail = computed(() => user.value?.email || '')

  // Actions
  const login = async (credentials) => {
    loading.value = true
    try {
      const response = await authService.login(credentials)
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    try {
      const response = await authService.register(userData)
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    console.log('Logout initiated')
    try {
      if (token.value) {
        console.log('Attempting to logout from server...')
        await authService.logout()
        console.log('Server logout successful')
      }
    } catch (error) {
      console.error('Server logout error:', error)
      // Continue with local logout even if server logout fails
    } finally {
      console.log('Performing local logout cleanup')
      // Always perform local cleanup
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      console.log('Local logout cleanup completed')
    }
  }

  const fetchUser = async () => {
    if (!token.value) return false
    
    try {
      const response = await authService.me()
      user.value = response.data.user
      return true
    } catch (error) {
      console.error('Fetch user error:', error)
      // Don't call logout here to avoid infinite loop
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      return false
    }
  }

  const refreshToken = async () => {
    try {
      const response = await authService.refresh()
      token.value = response.data.token
      localStorage.setItem('token', token.value)
      return true
    } catch (error) {
      console.error('Token refresh error:', error)
      // Don't call logout here to avoid infinite loop
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      return false
    }
  }

  return {
    // State
    user,
    token,
    loading,
    
    // Getters
    isAuthenticated,
    userFullName,
    userEmail,
    
    // Actions
    login,
    register,
    logout,
    fetchUser,
    refreshToken
  }
}) 