import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  // State
  const show = ref(false)
  const message = ref('')
  const type = ref('info') // 'success', 'error', 'info', 'warning'
  const timeout = ref(null)

  // Actions
  const showNotification = (msg, notificationType = 'info', duration = 5000) => {
    // Clear existing timeout
    if (timeout.value) {
      clearTimeout(timeout.value)
    }

    // Set notification
    message.value = msg
    type.value = notificationType
    show.value = true

    // Auto hide after duration
    timeout.value = setTimeout(() => {
      hideNotification()
    }, duration)
  }

  const hideNotification = () => {
    show.value = false
    message.value = ''
    if (timeout.value) {
      clearTimeout(timeout.value)
      timeout.value = null
    }
  }

  const showSuccess = (msg, duration = 5000) => {
    showNotification(msg, 'success', duration)
  }

  const showError = (msg, duration = 5000) => {
    showNotification(msg, 'error', duration)
  }

  const showInfo = (msg, duration = 5000) => {
    showNotification(msg, 'info', duration)
  }

  const showWarning = (msg, duration = 5000) => {
    showNotification(msg, 'warning', duration)
  }

  return {
    // State
    show,
    message,
    type,
    
    // Actions
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}) 