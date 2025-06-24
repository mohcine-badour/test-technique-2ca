<template>
  <div class="login-container">
    <div class="login-card">
      <div class="card-header">
        <h2 class="card-title">Connexion</h2>
        <p>Connectez-vous à votre compte</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="form-control"
            placeholder="votre@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            class="form-control"
            placeholder="Votre mot de passe"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="authStore.loading">
          {{ authStore.loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <div class="login-footer">
        <p>
          Pas encore de compte ?
          <router-link to="/register" class="link">Créer un compte</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const form = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  const result = await authStore.login({
    email: form.email,
    password: form.password
  })

  if (result.success) {
    notificationStore.showSuccess('Connexion réussie !')
    router.push('/tasks')
  } else {
    notificationStore.showError(result.error)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 2rem 1rem;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.card-header p {
  color: #666;
  margin: 0;
}

.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-control.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.btn-block {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 8px;
}

.login-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
  
  .card-title {
    font-size: 1.75rem;
  }
}
</style> 