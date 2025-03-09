/**
 * Main Application Module
 * 
 * Handles the main application logic and UI interactions.
 */

// Declare UI, Auth, and DB variables
let UI;
let Auth;
let DB;

const App = {
    // Current user
    currentUser: null,
    
    // Initialize application
    init: function(user) {
        console.log('Initializing application...');
        
        // Set current user
        this.currentUser = user;
        
        // Show main app screen
        UI.showScreen('main-app');
        
        // Initialize UI
        this.initUI();
        
        // Load dashboard data
        this.loadDashboard();
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('Application initialized');
    },
    
    // Initialize UI elements
    initUI: function() {
        // Update user info in sidebar
        this.updateUserInfo();
        
        // Show/hide admin section based on permissions
        if (Auth.hasPermission('manage_users') || Auth.hasPermission('manage_roles') || 
            Auth.hasPermission('manage_infractions')) {
            document.querySelector('.sidebar-nav li[data-page="admin"]').classList.remove('hidden');
        }
    },
    
    // Update user info in UI
    updateUserInfo: function() {
        // Get fresh user data
        const user = DB.users.getById(this.currentUser.id);
        this.currentUser = user;
        
        // Update sidebar
        document.getElementById('username').textContent = user.username;
        document.getElementById('user-role').textContent = user.role;
        document.getElementById('user-role').className = 'role-badge ' + user.role;
        document.getElementById('user-points').textContent = user.points;
        
        // Update avatar
        let avatarUrl = 'https://mc-heads.net/avatar/Steve/50';
        if (user.minecraftUsername) {
            avatarUrl = `https://mc-heads.net/avatar/${user.minecraftUsername}/50`;
        }
        document.getElementById('user-avatar').src = avatarUrl;
        
        // Update points bar
        const pointsPercentage = Math.min(100, (user.points / 500) * 100);
        document.getElementById('points-bar').style.width = pointsPercentage + '%';
    },
    
    // Load dashboard data
    loadDashboard: function() {
        // Get user tasks
        const userTasks = DB.tasks.getByUser(this.currentUser.id);
        const completedTasks = userTasks.filter(task => task.status === 'completed');
        
        // Get user infractions
        const userInfractions = DB.infractions.getByUser(this.currentUser.id);
        const infractionPoints = userInfractions.reduce((total, inf) => total + inf.points, 0);
        
        // Update dashboard stats
        document.getElementById('tasks-count').textContent = userTasks.length + ' Assigned';
        document.getElementById('completed-count').textContent = completedTasks.length + ' Tasks';
        document.getElementById('infractions-count').textContent = infractionPoints + ' Points';
        
        // Calculate rank progress
        const roles = DB.settings.getRoles();
        const currentRole = roles.find(r => r.id === this.currentUser.role);
        const nextRoleIndex = roles.findIndex(r => r.id === this.currentUser.role) - 1;
        
        if (nextRoleIndex >= 0) {
            const nextRole = roles[nextRoleIndex];
            const currentPoints = this.currentUser.points;
            const pointsNeeded = nextRole.pointThreshold - currentPoints;
            const progress = Math.min(100, (currentPoints / nextRole.pointThreshold) * 100);
            
            document.getElementById('rank-progress').textContent = Math.round(progress) + '%';
        } else {
            document.getElementById('rank-progress').textContent = 'Max Rank';
        }
        
        // Load recent tasks
        this.loadRecentTasks();
        
        // Load announcements
        this.loadAnnouncements();
    },
    
    // Load recent tasks
    loadRecentTasks: function() {
        const tasksContainer = document.getElementById('recent-tasks');
        
        // Get user tasks
        const userTasks = DB.tasks.getByUser(this.currentUser.id);
        
        if (userTasks.length === 0) {
            tasksContainer.innerHTML = '<p class="empty-state">No tasks assigned yet</p>';
            return;
        }
        
        // Sort tasks by date (newest first)
        userTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Take only the 5 most recent tasks
        const recentTasks = userTasks.slice(0, 5);
        
        // Generate HTML
        let html = '';
        
        recentTasks.forEach(task => {
            const statusClass = task.status === 'completed' ? 'status-completed' : 'status-pending';
            
            html += `
                <div class="task-item">
                    <div class="task-info">
                        <h4>${task.title}</h4>
                        <div class="task-meta">${task.type} • Due ${new Date(task.dueDate).toLocaleDateString()}</div>
                    </div>
                    <div class="task-status ${statusClass}">${task.status}</div>
                </div>
            `;
        });
        
        tasksContainer.innerHTML = html;
    },
    
    // Load announcements
    loadAnnouncements: function() {
        const announcementsContainer = document.getElementById('announcements');
        
        // Get announcements
        const announcements = DB.announcements.getAll();
        
        if (announcements.length === 0) {
            announcementsContainer.innerHTML = '<p class="empty-state">No announcements yet</p>';
            return;
        }
        
        // Sort announcements by date (newest first)
        announcements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Generate HTML
        let html = '';
        
        announcements.forEach(announcement => {
            const date = new Date(announcement.createdAt).toLocaleDateString();
            
            html += `
                <div class="announcement">
                    <h4>${announcement.title}</h4>
                    <p>${announcement.content}</p>
                    <span class="announcement-date">${date}</span>
                </div>
            `;
        });
        
        announcementsContainer.innerHTML = html;
    },
    
    // Load profile data
    loadProfile: function() {
        // Get fresh user data
        const user = DB.users.getById(this.currentUser.id);
        
        // Update profile info
        document.getElementById('profile-username').textContent = user.username;
        document.getElementById('profile-role').textContent = user.role;
        document.getElementById('profile-role').className = 'role-badge ' + user.role;
        document.getElementById('profile-joined-date').textContent = new Date(user.joinDate).toLocaleDateString();
        document.getElementById('profile-discord').textContent = user.discordUsername + '#' + user.discordDiscriminator;
        document.getElementById('minecraft-username').value = user.minecraftUsername || '';
        document.getElementById('profile-points').textContent = user.points;
        
        // Update avatar
        let avatarUrl = 'https://mc-heads.net/avatar/Steve/100';
        if (user.minecraftUsername) {
            avatarUrl = `https://mc-heads.net/avatar/${user.minecraftUsername}/100`;
        }
        document.getElementById('profile-avatar-img').src = avatarUrl;
        
        // Update points bar
        const pointsPercentage = Math.min(100, (user.points / 500) * 100);
        document.getElementById('profile-points-bar').style.width = pointsPercentage + '%';
        
        // Calculate next rank
        const roles = DB.settings.getRoles();
        const currentRoleIndex = roles.findIndex(r => r.id === user.role);
        const nextRoleIndex = currentRoleIndex - 1;
        
        if (nextRoleIndex >= 0) {
            const nextRole = roles[nextRoleIndex];
            const pointsNeeded = nextRole.pointThreshold - user.points;
            
            document.getElementById('profile-next-rank').textContent = nextRole.name;
            document.getElementById('profile-points-needed').textContent = pointsNeeded;
        } else {
            document.getElementById('profile-next-rank').textContent = 'Max Rank';
            document.getElementById('profile-points-needed').textContent = '0';
        }
    },
    
    // Load tasks page
    loadTasks: function() {
        const tasksContainer = document.getElementById('tasks-list');
        
        // Get tasks based on filter
        const filter = document.getElementById('task-filter').value;
        let tasks = [];
        
        if (filter === 'assigned') {
            tasks = DB.tasks.getByUser(this.currentUser.id);
        } else if (filter === 'available') {
            tasks = DB.tasks.getAvailable();
        } else if (filter === 'completed') {
            tasks = DB.tasks.getAll().filter(task => 
                task.status === 'completed' && task.completedBy === this.currentUser.id
            );
        } else {
            // All tasks
            tasks = DB.tasks.getAll();
        }
        
        // Apply search filter if any
        const searchTerm = document.getElementById('task-search').value.toLowerCase();
        if (searchTerm) {
            tasks = tasks.filter(task => 
                task.title.toLowerCase().includes(searchTerm) || 
                task.description.toLowerCase().includes(searchTerm)
            );
        }
        
        if (tasks.length === 0) {
            tasksContainer.innerHTML = '<p class="empty-state">No tasks found</p>';
            return;
        }
        
        // Sort tasks by date (newest first)
        tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Generate HTML
        let html = '';
        
        tasks.forEach(task => {
            const statusClass = task.status === 'completed' ? 'status-completed' : 'status-pending';
            const dueDate = new Date(task.dueDate).toLocaleDateString();
            
            // Check if task is assigned to current user
            const isAssigned = task.assignedTo === this.currentUser.id;
            
            // Check if task is available to take
            const isAvailable = !task.assignedTo && task.status !== 'completed';
            
            // Action buttons based on task state
            let actionButtons = '';
            
            if (isAssigned && task.status !== 'completed') {
                actionButtons = `<button class="btn btn-success complete-task" data-id="${task.id}">Complete</button>`;
            } else if (isAvailable) {
                actionButtons = `<button class="btn btn-primary take-task" data-id="${task.id}">Take Task</button>`;
            }
            
            html += `
                <div class="task-item">
                    <div class="task-header">
                        <h3>${task.title}</h3>
                        <div class="task-status ${statusClass}">${task.status}</div>
                    </div>
                    <div class="task-body">
                        <p>${task.description}</p>
                        <div class="task-meta">
                            <span><i class="fas fa-tag"></i> ${task.type}</span>
                            <span><i class="fas fa-calendar"></i> Due: ${dueDate}</span>
                        </div>
                    </div>
                    <div class="task-footer">
                        ${actionButtons}
                    </div>
                </div>
            `;
        });
        
        tasksContainer.innerHTML = html;
        
        // Add event listeners to task buttons
        document.querySelectorAll('.take-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.getAttribute('data-id');
                this.takeTask(taskId);
            });
        });
        
        document.querySelectorAll('.complete-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.getAttribute('data-id');
                this.completeTask(taskId);
            });
        });
    },
    
    // Take a task
    takeTask: function(taskId) {
        // Assign task to current user
        const task = DB.tasks.assign(taskId, this.currentUser.id);
        
        if (task) {
            // Reload tasks
            this.loadTasks();
            
            // Show success message
            alert('Task assigned to you!');
        }
    },
    
    // Complete a task
    completeTask: function(taskId) {
        // Complete task
        const task = DB.tasks.complete(taskId, this.currentUser.id);
        
        if (task) {
            // Add points to user
            DB.users.updatePoints(this.currentUser.id, 10, 'Task completed');
            
            // Update user info
            this.updateUserInfo();
            
            // Reload tasks
            this.loadTasks();
            
            // Show success message
            alert('Task completed! You earned 10 points.');
        }
    },
    
    // Load team members
    loadTeam: function() {
        const teamContainer = document.getElementById('team-grid');
        
        // Get all active users
        let users = DB.users.getAll().filter(user => user.status === 'active');
        
        // Apply role filter if any
        const roleFilter = document.getElementById('role-filter').value;
        if (roleFilter !== 'all') {
            users = users.filter(user => user.role === roleFilter);
        }
        
        // Apply search filter if any
        const searchTerm = document.getElementById('member-search').value.toLowerCase();
        if (searchTerm) {
            users = users.filter(user => 
                user.username.toLowerCase().includes(searchTerm) || 
                (user.minecraftUsername && user.minecraftUsername.toLowerCase().includes(searchTerm))
            );
        }
        
        if (users.length === 0) {
            teamContainer.innerHTML = '<p class="empty-state">No team members found</p>';
            return;
        }
        
        // Sort users by role importance
        const roleOrder = ['Owner', 'Co-Owner', 'Admin', 'Jr. Admin', 'Moderator', 'Jr. Moderator', 'Supporter', 'Jr. Supporter', 'Member'];
        users.sort((a, b) => {
            const roleA = roleOrder.indexOf(a.role);
            const roleB = roleOrder.indexOf(b.role);
            return roleA - roleB;
        });
        
        // Generate HTML
        let html = '';
        
        users.forEach(user => {
            // Get avatar URL
            let avatarUrl = 'https://mc-heads.net/avatar/Steve/80';
            if (user.minecraftUsername) {
                avatarUrl = `https://mc-heads.net/avatar/${user.minecraftUsername}/80`;
            }
            
            html += `
                <div class="team-member">
                    <img src="${avatarUrl}" alt="${user.username}" class="member-avatar ${user.role}">
                    <div class="member-info">
                        <h4>${user.username}</h4>
                        <span class="role-badge ${user.role}">${user.role}</span>
                        <div class="member-points">
                            <i class="fas fa-star"></i> ${user.points} Points
                        </div>
                    </div>
                </div>
            `;
        });
        
        teamContainer.innerHTML = html;
    },
    
    // Load admin users tab
    loadAdminUsers: function() {
        const usersTableBody = document.getElementById('users-table-body');
        
        // Get all users
        let users = DB.users.getAll();
        
        // Apply search filter if any
        const searchTerm = document.getElementById('admin-user-search').value.toLowerCase();
        if (searchTerm) {
            users = users.filter(user => 
                user.username.toLowerCase().includes(searchTerm) || 
                (user.minecraftUsername && user.minecraftUsername.toLowerCase().includes(searchTerm)) ||
                user.discordUsername.toLowerCase().includes(searchTerm)
            );
        }
        
        if (users.length === 0) {
            usersTableBody.innerHTML = '<tr><td colspan="5" class="empty-state">No users found</td></tr>';
            return;
        }
        
        // Sort users by role importance
        const roleOrder = ['Owner', 'Co-Owner', 'Admin', 'Jr. Admin', 'Moderator', 'Jr. Moderator', 'Supporter', 'Jr. Supporter', 'Member'];
        users.sort((a, b) => {
            const roleA = roleOrder.indexOf(a.role);
            const roleB = roleOrder.indexOf(b.role);
            return roleA - roleB;
        });
        
        // Generate HTML
        let html = '';
        
        users.forEach(user => {
            const statusClass = user.status === 'active' ? 'success' : 
                              user.status === 'inactive' ? 'warning' : 'danger';
            
            html += `
                <tr>
                    <td>${user.username}</td>
                    <td><span class="role-badge ${user.role}">${user.role}</span></td>
                    <td>${user.points}</td>
                    <td><span class="status-badge ${statusClass}">${user.status}</span></td>
                    <td>
                        <button class="btn btn-secondary edit-user" data-id="${user.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger delete-user" data-id="${user.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        usersTableBody.innerHTML = html;
        
        // Add event listeners to user buttons
        document.querySelectorAll('.edit-user').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.closest('.edit-user').getAttribute('data-id');
                this.showEditUserModal(userId);
            });
        });
        
        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.closest('.delete-user').getAttribute('data-id');
                this.confirmDeleteUser(userId);
            });
        });
    },
    
    // Show edit user modal
    showEditUserModal: function(userId) {
        const user = DB.users.getById(userId);
        
        if (!user) return;
        
        // Fill form with user data
        document.getElementById('edit-user-id').value = user.id;
        document.getElementById('edit-username').value = user.username;
        document.getElementById('edit-minecraft').value = user.minecraftUsername || '';
        document.getElementById('edit-role').value = user.role;
        document.getElementById('edit-points').value = user.points;
        document.getElementById('edit-status').value = user.status;
        
        // Show modal
        UI.showModal('edit-user-modal');
    },
    
    // Save edited user
    saveUser: function() {
        const userId = document.getElementById('edit-user-id').value;
        
        // Get form data
        const userData = {
            username: document.getElementById('edit-username').value,
            minecraftUsername: document.getElementById('edit-minecraft').value,
            role: document.getElementById('edit-role').value,
            points: parseInt(document.getElementById('edit-points').value),
            status: document.getElementById('edit-status').value
        };
        
        // Update user
        const updatedUser = DB.users.update(userId, userData);
        
        if (updatedUser) {
            // Hide modal
            UI.hideAllModals();
            
            // Reload admin users
            this.loadAdminUsers();
            
            // If current user was updated, refresh UI
            if (userId === this.currentUser.id) {
                this.updateUserInfo();
            }
            
            // Show success message
            alert('User updated successfully!');
        }
    },
    
    // Confirm delete user
    confirmDeleteUser: function(userId) {
        const user = DB.users.getById(userId);
        
        if (!user) return;
        
        // Don't allow deleting yourself
        if (userId === this.currentUser.id) {
            alert('You cannot delete your own account!');
            return;
        }
        
        // Show confirmation dialog
        UI.showConfirmation(
            'Delete User',
            `Are you sure you want to delete ${user.username}? This action cannot be undone.`,
            () => {
                // Delete user
                const deleted = DB.users.delete(userId);
                
                if (deleted) {
                    // Reload admin users
                    this.loadAdminUsers();
                    
                    // Show success message
                    alert('User deleted successfully!');
                }
            }
        );
    },
    
    // Load admin roles tab
    loadAdminRoles: function() {
        const rolesContainer = document.getElementById('roles-list');
        
        // Get all roles
        const roles = DB.settings.getRoles();
        
        if (roles.length === 0) {
            rolesContainer.innerHTML = '<p class="empty-state">No roles found</p>';
            return;
        }
        
        // Get permissions
        const permissions = DB.settings.getPermissions();
        
        // Generate HTML
        let html = '';
        
        roles.forEach(role => {
            const rolePermissions = permissions[role.id] || [];
            
            // Generate permissions HTML
            let permissionsHtml = '';
            
            const allPermissions = [
                'manage_users', 'manage_roles', 'manage_infractions', 
                'manage_tasks', 'view_all', 'edit_all'
            ];
            
            allPermissions.forEach(perm => {
                const hasPermission = rolePermissions.includes(perm);
                const permClass = hasPermission ? 'allowed' : '';
                const permIcon = hasPermission ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>';
                
                permissionsHtml += `
                    <div class="permission">
                        <div class="permission-indicator ${permClass}">${permIcon}</div>
                        <span>${perm.replace('_', ' ')}</span>
                    </div>
                `;
            });
            
            html += `
                <div class="role-card ${role.name}">
                    <div class="role-header">
                        <div class="role-name">
                            <h3>${role.name}</h3>
                            <span>(${role.pointThreshold}+ points)</span>
                        </div>
                        <button class="btn btn-secondary edit-role" data-id="${role.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </div>
                    <div class="role-permissions">
                        ${permissionsHtml}
                    </div>
                </div>
            `;
        });
        
        rolesContainer.innerHTML = html;
    },
    
    // Load admin infractions tab
    loadAdminInfractions: function() {
        const infractionsTableBody = document.getElementById('infractions-table-body');
        
        // Get all infractions
        let infractions = DB.infractions.getAll();
        
        // Apply search filter if any
        const searchTerm = document.getElementById('infraction-search').value.toLowerCase();
        if (searchTerm) {
            infractions = infractions.filter(inf => 
                inf.reason.toLowerCase().includes(searchTerm) || 
                inf.type.toLowerCase().includes(searchTerm)
            );
        }
        
        if (infractions.length === 0) {
            infractionsTableBody.innerHTML = '<tr><td colspan="6" class="empty-state">No infractions found</td></tr>';
            return;
        }
        
        // Sort infractions by date (newest first)
        infractions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Generate HTML
        let html = '';
        
        infractions.forEach(inf => {
            // Get user
            const user = DB.users.getById(inf.userId);
            const username = user ? user.username : 'Unknown User';
            
            const date = new Date(inf.createdAt).toLocaleDateString();
            
            html += `
                <tr>
                    <td>${username}</td>
                    <td>${inf.type}</td>
                    <td>${inf.points}</td>
                    <td>${date}</td>
                    <td>${inf.reason}</td>
                    <td>
                        <button class="btn btn-danger delete-infraction" data-id="${inf.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        infractionsTableBody.innerHTML = html;
        
        // Add event listeners to infraction buttons
        document.querySelectorAll('.delete-infraction').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const infractionId = e.target.closest('.delete-infraction').getAttribute('data-id');
                this.confirmDeleteInfraction(infractionId);
            });
        });
    },
    
    // Show add infraction modal
    showAddInfractionModal: function() {
        // Get all active users
        const users = DB.users.getAll().filter(user => user.status === 'active');
        
        // Populate user dropdown
        const userSelect = document.getElementById('infraction-user');
        userSelect.innerHTML = '';
        
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.username;
            userSelect.appendChild(option);
        });
        
        // Show modal
        UI.showModal('add-infraction-modal');
    },
    
    // Save new infraction
    saveInfraction: function() {
        // Get form data
        const userId = document.getElementById('infraction-user').value;
        const type = document.getElementById('infraction-type').value;
        const reason = document.getElementById('infraction-reason').value;
        
        // Validate
        if (!userId || !type || !reason) {
            alert('Please fill all fields');
            return;
        }
        
        // Get points based on type
        let points = 0;
        
        if (type === 'Other') {
            points = parseInt(document.getElementById('infraction-points').value);
        } else {
            // Extract points from type string
            const match = type.match(/$$([^)]+)$$/);
            if (match) {
                points = parseInt(match[1]);
            }
        }
        
        // Create infraction
        const infraction = DB.infractions.create({
            userId,
            type,
            points,
            reason,
            createdBy: this.currentUser.id
        });
        
        if (infraction) {
            // Hide modal
            UI.hideAllModals();
            
            // Reload infractions
            this.loadAdminInfractions();
            
            // Show success message
            alert('Infraction added successfully!');
        }
    },
    
    // Confirm delete infraction
    confirmDeleteInfraction: function(infractionId) {
        const infraction = DB.infractions.getById(infractionId);
        
        if (!infraction) return;
        
        // Show confirmation dialog
        UI.showConfirmation(
            'Delete Infraction',
            'Are you sure you want to delete this infraction? This will restore the points to the user.',
            () => {
                // Delete infraction
                const deleted = DB.infractions.delete(infractionId);
                
                if (deleted) {
                    // Reload infractions
                    this.loadAdminInfractions();
                    
                    // Show success message
                    alert('Infraction deleted successfully!');
                }
            }
        );
    },
    
    // Set up event listeners
    setupEventListeners: function() {
        // Navigation
        document.querySelectorAll('.sidebar-nav li[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.target.closest('li').getAttribute('data-page');
                UI.showPage(page + '-page');
                
                // Load page data
                if (page === 'profile') {
                    this.loadProfile();
                } else if (page === 'tasks') {
                    this.loadTasks();
                } else if (page === 'team') {
                    this.loadTeam();
                } else if (page === 'admin') {
                    this.loadAdminUsers();
                }
            });
        });
        
        // Save Minecraft username
        document.getElementById('save-minecraft').addEventListener('click', () => {
            const minecraftUsername = document.getElementById('minecraft-username').value;
            
            // Update user
            const updatedUser = DB.users.update(this.currentUser.id, {
                minecraftUsername
            });
            
            if (updatedUser) {
                // Update current user
                this.currentUser = updatedUser;
                
                // Update UI
                this.updateUserInfo();
                this.loadProfile();
                
                // Show success message
                alert('Minecraft username updated!');
            }
        });
        
        // Task filters
        document.getElementById('task-filter').addEventListener('change', () => {
            this.loadTasks();
        });
        
        document.getElementById('task-search').addEventListener('input', () => {
            this.loadTasks();
        });
        
        // Team filters
        document.getElementById('role-filter').addEventListener('change', () => {
            this.loadTeam();
        });
        
        document.getElementById('member-search').addEventListener('input', () => {
            this.loadTeam();
        });
        
        // Admin tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                
                // Update active tab
                document.querySelectorAll('.tab').forEach(t => {
                    t.classList.remove('active');
                });
                e.target.classList.add('active');
                
                // Show tab content
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                document.getElementById(tabId + '-tab').classList.add('active');
                
                // Load tab data
                if (tabId === 'users') {
                    this.loadAdminUsers();
                } else if (tabId === 'roles') {
                    this.loadAdminRoles();
                } else if (tabId === 'infractions') {
                    this.loadAdminInfractions();
                }
            });
        });
        
        // Admin user search
        document.getElementById('admin-user-search').addEventListener('input', () => {
            this.loadAdminUsers();
        });
        
        // Admin infraction search
        document.getElementById('infraction-search').addEventListener('input', () => {
            this.loadAdminInfractions();
        });
        
        // Add user button
        document.getElementById('add-user').addEventListener('click', () => {
            // Not implemented in this demo
            alert('This feature is not implemented in the demo.');
        });
        
        // Save user button
        document.getElementById('save-user').addEventListener('click', () => {
            this.saveUser();
        });
        
        // Add infraction button
        document.getElementById('add-infraction').addEventListener('click', () => {
            this.showAddInfractionModal();
        });
        
        // Infraction type change
        document.getElementById('infraction-type').addEventListener('change', (e) => {
            const type = e.target.value;
            const customPointsGroup = document.getElementById('custom-points-group');
            
            if (type === 'Other') {
                customPointsGroup.style.display = 'block';
            } else {
                customPointsGroup.style.display = 'none';
            }
        });
        
        // Save infraction button
        document.getElementById('save-infraction').addEventListener('click', () => {
            this.saveInfraction();
        });
        
        // Database actions
        document.getElementById('export-db').addEventListener('click', () => {
            DB.exportDatabase();
        });
        
        document.getElementById('import-db').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        
        document.getElementById('import-file').addEventListener('change', (e) => {
            const file = e.target.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.onload = (event) => {
                    const jsonData = event.target.result;
                    
                    // Import database
                    const success = DB.importDatabase(jsonData);
                    
                    if (success) {
                        // Reload app
                        window.location.reload();
                    } else {
                        alert('Failed to import database. Invalid format.');
                    }
                };
                
                reader.readAsText(file);
            }
        });
        
        document.getElementById('reset-db').addEventListener('click', () => {
            UI.showConfirmation(
                'Reset Database',
                'Are you sure you want to reset the database? All data will be lost!',
                () => {
                    DB.resetDatabase();
                    window.location.reload();
                }
            );
        });
    }
};

// Initialize app when page loads
// (Auth module will call App.init when user is authenticated)