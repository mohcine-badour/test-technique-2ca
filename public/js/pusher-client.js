// Pusher Client Configuration
class TaskNotificationClient {
    constructor() {
        this.pusher = null;
        this.channel = null;
        this.userId = null;
        this.token = null;
    }

    // Initialize Pusher with user authentication
    init(userId, token) {
        this.userId = userId;
        this.token = token;

        // Initialize Pusher
        this.pusher = new Pusher('794f0c1940bd3ed42386', {
            cluster: 'eu',
            authEndpoint: '/api/broadcasting/auth',
            auth: {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        });

        // Subscribe to user's private channel
        this.channel = this.pusher.subscribe(`private-user.${this.userId}`);

        // Listen for task creation events
        this.channel.bind('task.created', (data) => {
            this.handleTaskCreated(data);
        });

        console.log('Pusher client initialized for user:', this.userId);
    }

    // Handle task created event
    handleTaskCreated(data) {
        console.log('New task created:', data);

        // Show notification
        this.showNotification(data.message, data.task);

        // Update task list if on tasks page
        this.updateTaskList(data.task);
    }

    // Show browser notification
    showNotification(message, task) {
        // Check if browser supports notifications
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return;
        }

        // Request permission if not granted
        if (Notification.permission === 'default') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    this.createNotification(message, task);
                }
            });
        } else if (Notification.permission === 'granted') {
            this.createNotification(message, task);
        }
    }

    // Create and show notification
    createNotification(message, task) {
        const notification = new Notification('Nouvelle Tâche', {
            body: message,
            icon: '/favicon.ico',
            tag: `task-${task.id}`,
            data: task
        });

        // Handle notification click
        notification.onclick = () => {
            window.focus();
            notification.close();
            
            // Navigate to task detail or list
            if (window.location.pathname.includes('/tasks')) {
                this.highlightTask(task.id);
            } else {
                window.location.href = `/tasks/${task.id}`;
            }
        };

        // Auto close after 5 seconds
        setTimeout(() => {
            notification.close();
        }, 5000);
    }

    // Update task list (if on tasks page)
    updateTaskList(newTask) {
        const taskList = document.getElementById('task-list');
        if (taskList) {
            // Add new task to the beginning of the list
            const taskElement = this.createTaskElement(newTask);
            taskList.insertBefore(taskElement, taskList.firstChild);
            
            // Add highlight animation
            taskElement.classList.add('new-task-highlight');
            setTimeout(() => {
                taskElement.classList.remove('new-task-highlight');
            }, 3000);
        }
    }

    // Create task element for DOM
    createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item';
        taskDiv.id = `task-${task.id}`;
        taskDiv.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description || ''}</p>
            <div class="task-meta">
                <span class="status ${task.status}">${task.status}</span>
                <span class="priority ${task.priority}">${task.priority}</span>
                ${task.due_date ? `<span class="due-date">${new Date(task.due_date).toLocaleDateString()}</span>` : ''}
            </div>
        `;
        return taskDiv;
    }

    // Highlight a specific task
    highlightTask(taskId) {
        const taskElement = document.getElementById(`task-${taskId}`);
        if (taskElement) {
            taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            taskElement.classList.add('highlight');
            setTimeout(() => {
                taskElement.classList.remove('highlight');
            }, 2000);
        }
    }

    // Disconnect from Pusher
    disconnect() {
        if (this.pusher) {
            this.pusher.disconnect();
            console.log('Pusher client disconnected');
        }
    }
}

// Global instance
window.taskNotificationClient = new TaskNotificationClient();

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Get user data from meta tags or global variables
    const userId = document.querySelector('meta[name="user-id"]')?.content;
    const token = document.querySelector('meta[name="auth-token"]')?.content;
    
    if (userId && token) {
        window.taskNotificationClient.init(userId, token);
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskNotificationClient;
} 