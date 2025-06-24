<template>
  <div class="home">
    <div class="hero">
      <h1>Bienvenue sur Task Manager</h1>
      <p class="hero-subtitle">
        Gérez vos tâches efficacement avec des notifications en temps réel
      </p>
      
      <div class="hero-actions" v-if="!authStore.isAuthenticated">
        <router-link to="/register" class="btn btn-primary">
          Commencer
        </router-link>
        <router-link to="/login" class="btn btn-secondary">
          Se connecter
        </router-link>
      </div>
      
      <div class="hero-actions" v-else>
        <router-link to="/tasks" class="btn btn-primary">
          Voir mes tâches
        </router-link>
      </div>
    </div>

    <div class="features">
      <div class="grid grid-3">
        <div class="feature-card">
          <div class="feature-icon">📋</div>
          <h3>Gestion des Tâches</h3>
          <p>Créez, modifiez et organisez vos tâches avec facilité. Suivez leur progression et définissez des priorités.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Temps Réel</h3>
          <p>Recevez des notifications instantanées lors de la création de nouvelles tâches grâce à Pusher.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🔐</div>
          <h3>Sécurisé</h3>
          <p>Authentification JWT sécurisée avec protection des données et canaux privés pour chaque utilisateur.</p>
        </div>
      </div>
    </div>

    <div class="tech-stack" v-if="!authStore.isAuthenticated">
      <h2>Technologies Utilisées</h2>
      <div class="tech-grid">
        <div class="tech-item">
          <h4>Frontend</h4>
          <ul>
            <li>Vue.js 3</li>
            <li>Pinia (State Management)</li>
            <li>Vue Router</li>
            <li>Axios</li>
          </ul>
        </div>
        
        <div class="tech-item">
          <h4>Backend</h4>
          <ul>
            <li>Laravel 11</li>
            <li>JWT Authentication</li>
            <li>MySQL Database</li>
            <li>Laravel Echo</li>
          </ul>
        </div>
        
        <div class="tech-item">
          <h4>Real-time</h4>
          <ul>
            <li>Pusher</li>
            <li>Laravel Broadcasting</li>
            <li>WebSocket</li>
            <li>Private Channels</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.hero {
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  margin-bottom: 4rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-actions .btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.hero-actions .btn:hover {
  transform: translateY(-2px);
}

.features {
  margin-bottom: 4rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.tech-stack {
  background: #f8f9fa;
  padding: 3rem;
  border-radius: 12px;
}

.tech-stack h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 2rem;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.tech-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tech-item h4 {
  color: #3498db;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.tech-item ul {
  list-style: none;
  padding: 0;
}

.tech-item li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  color: #555;
}

.tech-item li:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
  }
}
</style> 