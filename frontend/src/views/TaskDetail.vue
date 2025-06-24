<template>
  <div class="task-detail-container">
    <div v-if="taskStore.loading" class="loading">
      <div class="spinner"></div>
      <p>Chargement de la tâche...</p>
    </div>

    <div v-else-if="!taskStore.currentTask" class="error-state">
      <p>Tâche non trouvée</p>
      <router-link to="/tasks" class="btn btn-primary">
        Retour aux tâches
      </router-link>
    </div>

    <div v-else class="task-detail">
      <div class="task-header">
        <div class="task-title-section">
          <h1>{{ taskStore.currentTask.title }}</h1>
          <div class="task-meta">
            <span class="task-badge" :class="`status-${taskStore.currentTask.status}`">
              {{ getStatusLabel(taskStore.currentTask.status) }}
            </span>
            <span class="task-badge" :class="`priority-${taskStore.currentTask.priority}`">
              {{ getPriorityLabel(taskStore.currentTask.priority) }}
            </span>
          </div>
        </div>
        
        <div class="task-actions">
          <button @click="showEditModal = true" class="btn btn-primary">
            Modifier
          </button>
          <button @click="deleteTask" class="btn btn-danger">
            Supprimer
          </button>
          <router-link to="/tasks" class="btn btn-secondary">
            Retour
          </router-link>
        </div>
      </div>

      <div class="task-content">
        <div class="task-section">
          <h3>Description</h3>
          <p v-if="taskStore.currentTask.description" class="task-description">
            {{ taskStore.currentTask.description }}
          </p>
          <p v-else class="no-description">
            Aucune description fournie
          </p>
        </div>

        <div class="task-info-grid">
          <div class="info-item">
            <h4>Date de création</h4>
            <p>{{ formatDate(taskStore.currentTask.created_at) }}</p>
          </div>
          
          <div class="info-item">
            <h4>Dernière modification</h4>
            <p>{{ formatDate(taskStore.currentTask.updated_at) }}</p>
          </div>
          
          <div v-if="taskStore.currentTask.due_date" class="info-item">
            <h4>Date d'échéance</h4>
            <p>{{ formatDate(taskStore.currentTask.due_date) }}</p>
          </div>
          
          <div class="info-item">
            <h4>Statut</h4>
            <p>{{ getStatusLabel(taskStore.currentTask.status) }}</p>
          </div>
          
          <div class="info-item">
            <h4>Priorité</h4>
            <p>{{ getPriorityLabel(taskStore.currentTask.priority) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'édition -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Modifier la tâche</h3>
          <button @click="closeModal" class="btn-icon">✕</button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-group">
            <label for="title">Titre</label>
            <input
              id="title"
              v-model="taskForm.title"
              type="text"
              class="form-control"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="taskForm.description"
              class="form-control"
              rows="4"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="status">Statut</label>
              <select id="status" v-model="taskForm.status" class="form-control">
                <option value="pending">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="priority">Priorité</label>
              <select id="priority" v-model="taskForm.priority" class="form-control">
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="due_date">Date d'échéance</label>
            <input
              id="due_date"
              v-model="taskForm.due_date"
              type="date"
              class="form-control"
            />
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Annuler
            </button>
            <button type="submit" class="btn btn-primary" :disabled="taskStore.loading">
              Modifier
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/tasks'
import { useNotificationStore } from '@/stores/notification'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const notificationStore = useNotificationStore()

const showEditModal = ref(false)

const taskForm = reactive({
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  due_date: ''
})

onMounted(() => {
  loadTask()
})

watch(() => route.params.id, () => {
  loadTask()
})

const loadTask = async () => {
  const taskId = route.params.id
  if (taskId) {
    const result = await taskStore.fetchTask(taskId)
    if (result.success) {
      populateForm()
    } else {
      notificationStore.showError('Tâche non trouvée')
      router.push('/tasks')
    }
  }
}

const populateForm = () => {
  const task = taskStore.currentTask
  if (task) {
    taskForm.title = task.title
    taskForm.description = task.description || ''
    taskForm.status = task.status
    taskForm.priority = task.priority
    taskForm.due_date = task.due_date ? task.due_date.split('T')[0] : ''
  }
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    in_progress: 'En cours',
    completed: 'Terminé',
    cancelled: 'Annulé'
  }
  return labels[status] || status
}

const getPriorityLabel = (priority) => {
  const labels = {
    low: 'Faible',
    medium: 'Moyenne',
    high: 'Élevée'
  }
  return labels[priority] || priority
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const deleteTask = async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    const result = await taskStore.deleteTask(taskStore.currentTask.id)
    if (result.success) {
      notificationStore.showSuccess('Tâche supprimée avec succès')
      router.push('/tasks')
    } else {
      notificationStore.showError(result.error)
    }
  }
}

const handleSubmit = async () => {
  const result = await taskStore.updateTask(taskStore.currentTask.id, taskForm)
  if (result.success) {
    notificationStore.showSuccess('Tâche modifiée avec succès')
    closeModal()
  } else {
    notificationStore.showError(result.error)
  }
}

const closeModal = () => {
  showEditModal.value = false
  populateForm()
}
</script>

<style scoped>
.task-detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.loading, .error-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.task-detail {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.task-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.task-title-section h1 {
  margin: 0 0 1rem 0;
  font-size: 2rem;
}

.task-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.task-content {
  padding: 2rem;
}

.task-section {
  margin-bottom: 2rem;
}

.task-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.task-description {
  color: #666;
  line-height: 1.6;
  font-size: 1.1rem;
}

.no-description {
  color: #999;
  font-style: italic;
}

.task-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.info-item h4 {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item p {
  color: #666;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .task-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .task-actions {
    justify-content: stretch;
  }
  
  .task-actions .btn {
    flex: 1;
  }
  
  .task-info-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style> 