// UI service
const UI = {
    // Show login page
    showLogin() {
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('dashboard-container').classList.add('hidden');
    },
    
    // Show dashboard
    showDashboard() {
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('dashboard-container').classList.remove('hidden');
    },
    
    // Update user info in UI
    updateUserInfo() {
        if (!currentUserData) return;
        
        // Update header user info
        document.getElementById('user-name').textContent = currentUserData.username;
        document.getElementById('user-avatar').src = `https://crafatar.com/avatars/${currentUserData.minecraftUsername}?size=64&overlay`;
        
        // Update dashboard cards
        document.getElementById('user-role').textContent = currentUserData.role;
        document.getElementById('user-points').textContent = currentUserData.points;
        document.getElementById('tasks-completed').textContent = currentUserData.tasks.completed;
        document.getElementById('tasks-total').textContent = currentUserData.tasks.assigned;
        document.getElementById('join-date').textContent = new Date(currentUserData.joinDate).toLocaleDateString();
        
        // Update points status icon
        const pointsStatus = document.getElementById('points-status');
        pointsStatus.innerHTML = '';
        
        if (currentUserData.points >= 400) {
            pointsStatus.innerHTML = '<i class="fas fa-laugh-beam" style="color: var(--success);"></i>';
        } else if (currentUserData.points >= 250) {
            pointsStatus.innerHTML = '<i class="fas fa-smile" style="color: var(--success);"></i>';
        } else if (currentUserData.points >= 150) {
            pointsStatus.innerHTML = '<i class="fas fa-meh" style="color: var(--warning);"></i>';
        } else if (currentUserData.points > 0) {
            pointsStatus.innerHTML = '<i class="fas fa-frown" style="color: var(--warning);"></i>';
        } else {
            pointsStatus.innerHTML = '<i class="fas fa-angry" style="color: var(--danger);"></i>';
        }
        
        // Update profile page
        document.getElementById('profile-avatar-img').src = `https://crafatar.com/avatars/${currentUserData.minecraftUsername}?size=128&overlay`;
        document.getElementById('profile-username').textContent = currentUserData.username;
        document.getElementById('profile-role').textContent = currentUserData.role;
        document.getElementById('profile-minecraft-username').textContent = currentUserData.minecraftUsername;
        document.getElementById('profile-email').textContent = currentUserData.email;
        document.getElementById('profile-points').textContent = currentUserData.points;
        document.getElementById('profile-join-date').textContent = new Date(currentUserData.joinDate).toLocaleDateString();
        
        // Update stats
        document.getElementById('stats-tasks-completed').textContent = currentUserData.tasks.completed;
    },
    
    // Render recent tasks
    renderRecentTasks(tasks) {
        const recentTasksContainer = document.getElementById('recent-tasks');
        
        if (tasks.length === 0) {
            recentTasksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tasks"></i>
                    <p>No tasks assigned yet</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        tasks.forEach(task => {
            const dueDate = new Date(task.dueDate).toLocaleDateString();
            const statusClass = task.status === TASK_STATUSES.COMPLETED ? 'success' :
                               task.status === TASK_STATUSES.IN_PROGRESS ? 'warning' : 'tertiary';
            
            html += `
                <div class="task-item">
                    <div class="task-status">
                        <span class="status-dot ${statusClass}"></span>
                    </div>
                    <div class="task-content">
                        <div class="task-title">${task.title}</div>
                        <div class="task-meta">${task.type} • Due ${dueDate}</div>
                    </div>
                    <div class="task-badge ${statusClass}">${task.status}</div>
                </div>
            `;
        });
        
        recentTasksContainer.innerHTML = html;
    },
    
    // Render notifications
    renderNotifications(notifications) {
        const notificationsContainer = document.getElementById('notifications-list');
        
        if (notifications.length === 0) {
            notificationsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell-slash"></i>
                    <p>No notifications yet</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        notifications.forEach(notification => {
            const time = this.getTimeAgo(notification.timestamp);
            
            html += `
                <div class="notification-item">
                    <div class="notification-icon">
                        <i class="fas fa-bell"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-message">${notification.message}</div>
                        <div class="notification-time">${time}</div>
                    </div>
                </div>
            `;
        });
        
        notificationsContainer.innerHTML = html;
        
        // Update notification badge
        const unreadCount = notifications.filter(n => !n.read).length;
        document.querySelector('.notification-badge').textContent = unreadCount;
    },
    
    // Get time ago string
    getTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) {
            return 'Just now';
        }
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        }
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        
        const days = Math.floor(hours / 24);
        if (days < 7) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
        
        return date.toLocaleDateString();
    },
    
    // Show modal
    showModal(modalId) {
        document.getElementById('modal-container').classList.remove('hidden');
        document.getElementById(modalId).classList.remove('hidden');
    },
    
    // Hide modal
    hideModal(modalId) {
        document.getElementById('modal-container').classList.add('hidden');
        document.getElementById(modalId).classList.add('hidden');
    },
    
    // Show error message
    showError(message) {
        alert(message); // Simple alert for now, can be improved with a toast notification
    },
    
    // Show success message
    showSuccess(message) {
        alert(message); // Simple alert for now, can be improved with a toast notification
    }
};

let currentUserData = {};
const TASK_STATUSES = {
    COMPLETED: 'COMPLETED',
    IN_PROGRESS: 'IN_PROGRESS'
};

