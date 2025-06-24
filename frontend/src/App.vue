<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">
          Task Manager
        </router-link>
        <div class="nav-menu">
          <router-link to="/" class="nav-link">Accueil</router-link>
          <router-link to="/tasks" class="nav-link">Tâches</router-link>
          <router-link to="/login" class="nav-link" v-if="!authStore.isAuthenticated">Connexion</router-link>
          <router-link to="/register" class="nav-link" v-if="!authStore.isAuthenticated">Inscription</router-link>
          <button @click="handleLogout" class="nav-link logout-btn" v-if="authStore.isAuthenticated">
            Déconnexion
          </button>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <!-- Notification Toast -->
    <div v-if="notificationStore.show" class="notification-toast" :class="notificationStore.type">
      {{ notificationStore.message }}
    </div>

    <!-- Pusher Connection Status -->
    <div class="pusher-status" :class="echoStore.connectionStatus">
      {{ echoStore.connectionStatusText }}
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { useEchoStore } from '@/stores/echo'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const echoStore = useEchoStore()

const handleLogout = async () => {
  console.log('handleLogout called')
  try {
    console.log('Calling authStore.logout()')
    await authStore.logout()
    console.log('authStore.logout() completed')
    
    console.log('Disconnecting Echo')
    echoStore.disconnectEcho()
    console.log('Echo disconnected')
    
    notificationStore.showSuccess('Déconnexion réussie')
    console.log('Redirecting to login page')
    router.push('/login')
  } catch (error) {
    console.error('handleLogout error:', error)
    notificationStore.showError('Erreur lors de la déconnexion')
  }
}

onMounted(async () => {
  // Initialize auth store
  if (authStore.token) {
    const success = await authStore.fetchUser()
    if (!success) {
      // Token is invalid, redirect to login
      router.push('/login')
      return
    }
  }
  
  // Initialize Echo if user is authenticated
  if (authStore.isAuthenticated) {
    echoStore.initializeEcho(authStore.token)
  }
})
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

.nav-brand {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.nav-menu {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  color: #ecf0f1;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #34495e;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: calc(100vh - 80px);
}

.notification-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  z-index: 1000;
  animation: slideInRight 0.3s ease-out;
}

.notification-toast.success {
  background-color: #27ae60;
}

.notification-toast.error {
  background-color: #e74c3c;
}

.notification-toast.info {
  background-color: #3498db;
}

.pusher-status {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  z-index: 1000;
}

.pusher-status.connected {
  background-color: #27ae60;
  color: white;
}

.pusher-status.disconnected {
  background-color: #e74c3c;
  color: white;
}

.pusher-status.connecting {
  background-color: #f39c12;
  color: white;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style> 