import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export const useEchoStore = defineStore('echo', () => {
  // State
  const echo = ref(null)
  const connectionStatus = ref('disconnected') // 'connected', 'disconnected', 'connecting'
  const connectionError = ref(null)

  // Getters
  const connectionStatusText = computed(() => {
    switch (connectionStatus.value) {
      case 'connected':
        return 'Connecté'
      case 'connecting':
        return 'Connexion...'
      case 'disconnected':
        return 'Déconnecté'
      default:
        return 'Inconnu'
    }
  })

  const isConnected = computed(() => connectionStatus.value === 'connected')

  // Actions
  const initializeEcho = (token) => {
    if (echo.value) {
      disconnectEcho()
    }

    try {
      // Configure Pusher
      window.Pusher = Pusher

      // Initialize Laravel Echo
      echo.value = new Echo({
        broadcaster: 'pusher',
        key: '794f0c1940bd3ed42386', // Your Pusher key
        cluster: 'eu', // Your Pusher cluster
        forceTLS: true,
        authEndpoint: '/api/broadcasting/auth',
        auth: {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }
      })

      // Set up connection event listeners
      echo.value.connector.pusher.connection.bind('connected', () => {
        connectionStatus.value = 'connected'
        connectionError.value = null
        console.log('Echo connected successfully')
      })

      echo.value.connector.pusher.connection.bind('disconnected', () => {
        connectionStatus.value = 'disconnected'
        console.log('Echo disconnected')
      })

      echo.value.connector.pusher.connection.bind('connecting', () => {
        connectionStatus.value = 'connecting'
        console.log('Echo connecting...')
      })

      echo.value.connector.pusher.connection.bind('error', (error) => {
        connectionStatus.value = 'disconnected'
        connectionError.value = error
        console.error('Echo connection error:', error)
      })

      return true
    } catch (error) {
      console.error('Failed to initialize Echo:', error)
      connectionError.value = error
      return false
    }
  }

  const disconnectEcho = () => {
    if (echo.value) {
      echo.value.disconnect()
      echo.value = null
    }
    connectionStatus.value = 'disconnected'
    connectionError.value = null
  }

  const subscribeToChannel = (channelName, eventName, callback) => {
    if (!echo.value) {
      console.error('Echo not initialized')
      return null
    }

    try {
      const channel = echo.value.channel(channelName)
      channel.listen(eventName, callback)
      return channel
    } catch (error) {
      console.error('Failed to subscribe to channel:', error)
      return null
    }
  }

  const subscribeToPrivateChannel = (channelName, eventName, callback) => {
    if (!echo.value) {
      console.error('Echo not initialized')
      return null
    }

    try {
      const channel = echo.value.private(channelName)
      channel.listen(eventName, callback)
      return channel
    } catch (error) {
      console.error('Failed to subscribe to private channel:', error)
      return null
    }
  }

  const unsubscribeFromChannel = (channelName) => {
    if (echo.value) {
      echo.value.leaveChannel(channelName)
    }
  }

  return {
    // State
    echo,
    connectionStatus,
    connectionError,
    
    // Getters
    connectionStatusText,
    isConnected,
    
    // Actions
    initializeEcho,
    disconnectEcho,
    subscribeToChannel,
    subscribeToPrivateChannel,
    unsubscribeFromChannel
  }
}) 