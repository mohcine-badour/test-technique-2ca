<template>
  <div class="tasks-container">
    <div class="tasks-header">
      <h1>Mes Tâches</h1>
      <button @click="showCreateModal = true" class="btn btn-primary">
        + Nouvelle Tâche
      </button>
    </div>

    <!-- Filtres -->
    <div class="filters">
      <div class="filter-group">
        <input
          v-model="taskStore.filters.search"
          type="text"
          placeholder="Rechercher une tâche..."
          class="form-control"
        />
      </div>
      
      <div class="filter-group">
        <select v-model="taskStore.filters.status" class="form-control">
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminé</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>
      
      <div class="filter-group">
        <select v-model="taskStore.filters.priority" class="form-control">
          <option value="">Toutes les priorités</option>
          <option value="low">Faible</option>
          <option value="medium">Moyenne</option>
          <option value="high">Élevée</option>
        </select>
      </div>
      
      <button @click="taskStore.clearFilters()" class="btn btn-secondary">
        Effacer les filtres
      </button>
    </div>

    <!-- Liste des tâches -->
    <div v-if="taskStore.loading" class="loading">
      <div class="spinner"></div>
      <p>Chargement des tâches...</p>
    </div>

    <div v-else-if="taskStore.filteredTasks.length === 0" class="empty-state">
      <p>Aucune tâche trouvée</p>
      <button @click="showCreateModal = true" class="btn btn-primary">
        Créer votre première tâche
      </button>
    </div>

    <div v-else class="tasks-grid">
      <div
        v-for="task in taskStore.filteredTasks"
        :key="task.id"
        class="task-item"
      >
        <div class="task-header">
          <h3 class="task-title">{{ task.title }}</h3>
          <div class="task-actions">
            <button @click="editTask(task)" class="btn-icon">✏️</button>
            <button @click="deleteTask(task.id)" class="btn-icon">🗑️</button>
          </div>
        </div>
        
        <p class="task-description">{{ task.description }}</p>
        
        <div class="task-meta">
          <span class="task-badge" :class="`status-${task.status}`">
            {{ getStatusLabel(task.status) }}
          </span>
          <span class="task-badge" :class="`priority-${task.priority}`">
            {{ getPriorityLabel(task.priority) }}
          </span>
        </div>
        
        <div class="task-footer">
          <small>Créée le {{ formatDate(task.created_at) }}</small>
          <router-link :to="`/tasks/${task.id}`" class="btn btn-secondary btn-sm">
            Voir détails
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal de création/édition -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? 'Modifier la tâche' : 'Nouvelle tâche' }}</h3>
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
              {{ showEditModal ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useTaskStore } from '@/stores/tasks'
import { useNotificationStore } from '@/stores/notification'

const taskStore = useTaskStore()
const notificationStore = useNotificationStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTask = ref(null)

const taskForm = reactive({
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  due_date: ''
})

onMounted(() => {
  taskStore.fetchTasks()
  taskStore.initializeRealTimeUpdates()
})

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
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const editTask = (task) => {
  editingTask.value = task
  taskForm.title = task.title
  taskForm.description = task.description || ''
  taskForm.status = task.status
  taskForm.priority = task.priority
  taskForm.due_date = task.due_date ? task.due_date.split('T')[0] : ''
  showEditModal.value = true
}

const deleteTask = async (taskId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    const result = await taskStore.deleteTask(taskId)
    if (result.success) {
      notificationStore.showSuccess('Tâche supprimée avec succès')
    } else {
      notificationStore.showError(result.error)
    }
  }
}

const handleSubmit = async () => {
  if (showEditModal.value) {
    const result = await taskStore.updateTask(editingTask.value.id, taskForm)
    if (result.success) {
      notificationStore.showSuccess('Tâche modifiée avec succès')
      closeModal()
    } else {
      notificationStore.showError(result.error)
    }
  } else {
    const result = await taskStore.createTask(taskForm)
    if (result.success) {
      notificationStore.showSuccess('Tâche créée avec succès')
      closeModal()
    } else {
      notificationStore.showError(result.error)
    }
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingTask.value = null
  Object.assign(taskForm, {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: ''
  })
}
</script>

<style scoped>
.tasks-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.tasks-header h1 {
  color: #2c3e50;
  margin: 0;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.loading, .empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.task-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.task-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 0;
  flex: 1;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.btn-icon:hover {
  background-color: #f8f9fa;
}

.task-description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.task-meta {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
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
  .tasks-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .filter-group {
    min-width: auto;
  }
  
  .tasks-grid {
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