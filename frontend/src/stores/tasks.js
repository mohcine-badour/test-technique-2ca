import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskService } from '@/services/taskService'
import { useEchoStore } from './echo'

export const useTaskStore = defineStore('tasks', () => {
  // State
  const tasks = ref([])
  const currentTask = ref(null)
  const loading = ref(false)
  const filters = ref({
    status: '',
    priority: '',
    search: ''
  })
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })

  // Getters
  const filteredTasks = computed(() => {
    let filtered = tasks.value

    if (filters.value.status) {
      filtered = filtered.filter(task => task.status === filters.value.status)
    }

    if (filters.value.priority) {
      filtered = filtered.filter(task => task.priority === filters.value.priority)
    }

    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(search) ||
        task.description?.toLowerCase().includes(search)
      )
    }

    return filtered
  })

  const tasksByStatus = computed(() => {
    const grouped = {
      pending: [],
      in_progress: [],
      completed: [],
      cancelled: []
    }
    
    filteredTasks.value.forEach(task => {
      if (grouped[task.status]) {
        grouped[task.status].push(task)
      }
    })
    
    return grouped
  })

  // Actions
  const fetchTasks = async (params = {}) => {
    loading.value = true
    try {
      const response = await taskService.getTasks(params)
      tasks.value = response.data.tasks
      pagination.value = response.data.pagination
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch tasks' }
    } finally {
      loading.value = false
    }
  }

  const createTask = async (taskData) => {
    loading.value = true
    try {
      const response = await taskService.createTask(taskData)
      tasks.value.unshift(response.data.task)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create task' }
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (id, taskData) => {
    loading.value = true
    try {
      const response = await taskService.updateTask(id, taskData)
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        tasks.value[index] = response.data.task
      }
      if (currentTask.value?.id === id) {
        currentTask.value = response.data.task
      }
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update task' }
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (id) => {
    loading.value = true
    try {
      await taskService.deleteTask(id)
      tasks.value = tasks.value.filter(task => task.id !== id)
      if (currentTask.value?.id === id) {
        currentTask.value = null
      }
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete task' }
    } finally {
      loading.value = false
    }
  }

  const fetchTask = async (id) => {
    loading.value = true
    try {
      const response = await taskService.getTask(id)
      currentTask.value = response.data.task
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch task' }
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
      status: '',
      priority: '',
      search: ''
    }
  }

  // Real-time updates
  const initializeRealTimeUpdates = () => {
    const echoStore = useEchoStore()
    
    if (echoStore.echo) {
      // Listen for task creation events
      echoStore.echo.private(`user.${useAuthStore().user?.id}`)
        .listen('task.created', (e) => {
          console.log('New task received:', e)
          // Add the new task to the beginning of the list
          tasks.value.unshift(e.task)
          
          // Show notification
          const notificationStore = useNotificationStore()
          notificationStore.showNotification(e.message, 'success')
        })
    }
  }

  const addTaskFromEvent = (task) => {
    // Check if task already exists
    const existingIndex = tasks.value.findIndex(t => t.id === task.id)
    if (existingIndex === -1) {
      tasks.value.unshift(task)
    } else {
      tasks.value[existingIndex] = task
    }
  }

  return {
    // State
    tasks,
    currentTask,
    loading,
    filters,
    pagination,
    
    // Getters
    filteredTasks,
    tasksByStatus,
    
    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchTask,
    setFilters,
    clearFilters,
    initializeRealTimeUpdates,
    addTaskFromEvent
  }
}) 