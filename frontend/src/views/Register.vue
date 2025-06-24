<template>
  <div class="register-container">
    <div class="register-card">
      <div class="card-header">
        <h2 class="card-title">Inscription</h2>
        <p>Créez votre compte</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="full_name">Nom complet</label>
          <input
            type="text"
            id="full_name"
            v-model="form.full_name"
            class="form-control"
            placeholder="Votre nom complet"
            required
          />
        </div>

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
          <label for="phone_number">Téléphone</label>
          <input
            type="tel"
            id="phone_number"
            v-model="form.phone_number"
            class="form-control"
            placeholder="Votre numéro de téléphone"
          />
        </div>

        <div class="form-group">
          <label for="address">Adresse</label>
          <textarea
            id="address"
            v-model="form.address"
            class="form-control"
            placeholder="Votre adresse"
            rows="3"
          ></textarea>
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

        <div class="form-group">
          <label for="password_confirmation">Confirmer le mot de passe</label>
          <input
            type="password"
            id="password_confirmation"
            v-model="form.password_confirmation"
            class="form-control"
            placeholder="Confirmez votre mot de passe"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="authStore.loading">
          {{ authStore.loading ? 'Inscription...' : 'S\'inscrire' }}
        </button>
      </form>

      <div class="register-footer">
        <p>
          Déjà un compte ?
          <router-link to="/login" class="link">Se connecter</router-link>
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
  full_name: '',
  email: '',
  phone_number: '',
  address: '',
  password: '',
  password_confirmation: ''
})

const handleRegister = async () => {
  if (form.password !== form.password_confirmation) {
    notificationStore.showError('Les mots de passe ne correspondent pas')
    return
  }

  const result = await authStore.register({
    full_name: form.full_name,
    email: form.email,
    phone_number: form.phone_number,
    address: form.address,
    password: form.password,
    password_confirmation: form.password_confirmation
  })

  if (result.success) {
    notificationStore.showSuccess('Inscription réussie !')
    router.push('/tasks')
  } else {
    notificationStore.showError(result.error)
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 2rem 1rem;
}

.register-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
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

.register-form {
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

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

.btn-block {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 8px;
}

.register-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}
</style> 