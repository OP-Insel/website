/**
 * Database Module
 * 
 * This module handles all data storage and retrieval operations.
 * Since GitHub Pages only supports static content, we use localStorage
 * for client-side storage with export/import functionality.
 */

const DB = {
    // Database structure
    data: {
        users: [],
        tasks: [],
        infractions: [],
        announcements: [],
        settings: {
            pointResetDay: 1, // Day of month for point reset
            roles: [
                { id: 'owner', name: 'Owner', pointThreshold: 600, color: '#9c27b0' },
                { id: 'co-owner', name: 'Co-Owner', pointThreshold: 500, color: '#3f51b5' },
                { id: 'admin', name: 'Admin', pointThreshold: 400, color: '#f44336' },
                { id: 'jr-admin', name: 'Jr. Admin', pointThreshold: 300, color: '#e91e63' },
                { id: 'moderator', name: 'Moderator', pointThreshold: 250, color: '#4caf50' },
                { id: 'jr-moderator', name: 'Jr. Moderator', pointThreshold: 200, color: '#8bc34a' },
                { id: 'supporter', name: 'Supporter', pointThreshold: 150, color: '#ff9800' },
                { id: 'jr-supporter', name: 'Jr. Supporter', pointThreshold: 100, color: '#ffeb3b' },
                { id: 'member', name: 'Member', pointThreshold: 0, color: '#b0b0b0' }
            ],
            permissions: {
                'owner': ['manage_users', 'manage_roles', 'manage_infractions', 'manage_tasks', 'view_all', 'edit_all'],
                'co-owner': ['manage_users', 'manage_roles', 'manage_infractions', 'manage_tasks', 'view_all'],
                'admin': ['manage_users', 'manage_infractions', 'manage_tasks', 'view_all'],
                'jr-admin': ['manage_infractions', 'manage_tasks', 'view_all'],
                'moderator': ['manage_infractions', 'manage_tasks'],
                'jr-moderator': ['manage_tasks'],
                'supporter': ['view_tasks'],
                'jr-supporter': ['view_tasks'],
                'member': []
            },
            infractionTypes: [
                { id: 'ban-no-reason', name: 'Ban without reason', points: -5 },
                { id: 'unfair-punishment', name: 'Unfair punishment', points: -10 },
                { id: 'admin-abuse', name: 'Admin abuse', points: -20 },
                { id: 'insults', name: 'Insults', points: -15 },
                { id: 'inactivity', name: 'Inactivity', points: -10 },
                { id: 'repeated-misconduct', name: 'Repeated misconduct', points: -30 },
                { id: 'spamming', name: 'Spamming', points: -5 },
                { id: 'severe-violation', name: 'Severe violation', points: -20 }
            ]
        }
    },

    // Initialize the database
    init: function() {
        // Load data from localStorage if available
        const savedData = localStorage.getItem('op-insel-data');
        if (savedData) {
            try {
                this.data = JSON.parse(savedData);
                console.log('Database loaded from localStorage');
            } catch (e) {
                console.error('Error loading database:', e);
                this.resetDatabase();
            }
        } else {
            // Initialize with default data
            this.resetDatabase();
        }
    },

    // Save data to localStorage
    save: function() {
        localStorage.setItem('op-insel-data', JSON.stringify(this.data));
        console.log('Database saved to localStorage');
    },

    // Reset database to default state
    resetDatabase: function() {
        // Reset to default structure but keep settings
        const settings = this.data.settings;
        this.data = {
            users: [],
            tasks: [],
            infractions: [],
            announcements: [
                {
                    id: 'welcome',
                    title: 'Welcome to OP-Insel Management',
                    content: 'This is the new management system for our Minecraft server team.',
                    date: new Date().toISOString(),
                    author: 'System'
                }
            ],
            settings: settings
        };
        this.save();
        console.log('Database reset to default state');
    },

    // Export database as JSON
    exportDatabase: function() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'op-insel-backup-' + new Date().toISOString().split('T')[0] + '.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    },

    // Import database from JSON file
    importDatabase: function(jsonData) {
        try {
            const parsedData = JSON.parse(jsonData);
            
            // Validate data structure
            if (!parsedData.users || !parsedData.tasks || !parsedData.infractions || !parsedData.settings) {
                throw new Error('Invalid database structure');
            }
            
            this.data = parsedData;
            this.save();
            return true;
        } catch (e) {
            console.error('Error importing database:', e);
            return false;
        }
    },

    // User Management
    users: {
        getAll: function() {
            return DB.data.users;
        },
        
        getById: function(id) {
            return DB.data.users.find(user => user.id === id);
        },
        
        getByDiscordId: function(discordId) {
            return DB.data.users.find(user => user.discordId === discordId);
        },
        
        create: function(userData) {
            const newUser = {
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                points: 100, // Default starting points
                role: 'member', // Default role
                status: 'active',
                ...userData
            };
            
            DB.data.users.push(newUser);
            DB.save();
            return newUser;
        },
        
        update: function(id, userData) {
            const index = DB.data.users.findIndex(user => user.id === id);
            if (index !== -1) {
                // Update user data
                DB.data.users[index] = {
                    ...DB.data.users[index],
                    ...userData,
                    updatedAt: new Date().toISOString()
                };
                DB.save();
                return DB.data.users[index];
            }
            return null;
        },
        
        delete: function(id) {
            const index = DB.data.users.findIndex(user => user.id === id);
            if (index !== -1) {
                DB.data.users.splice(index, 1);
                DB.save();
                return true;
            }
            return false;
        },
        
        // Update user points and check for role changes
        updatePoints: function(id, pointChange, reason) {
            const user = this.getById(id);
            if (!user) return null;
            
            const oldPoints = user.points;
            const newPoints = Math.max(0, oldPoints + pointChange);
            
            // Update points
            user.points = newPoints;
            
            // Check if role should change based on points
            const oldRole = user.role;
            let newRole = oldRole;
            
            // If points decreased, check for demotion
            if (pointChange < 0) {
                const roles = DB.data.settings.roles;
                
                // Sort roles by point threshold (highest first)
                const sortedRoles = [...roles].sort((a, b) => b.pointThreshold - a.pointThreshold);
                
                // Find the appropriate role based on points
                for (const role of sortedRoles) {
                    if (newPoints >= role.pointThreshold) {
                        newRole = role.id;
                        break;
                    }
                }
                
                // If points are 0 or below, remove from team
                if (newPoints <= 0) {
                    user.status = 'removed';
                    newRole = 'member';
                }
            }
            
            // Update role if changed
            if (newRole !== oldRole) {
                user.role = newRole;
                user.roleChangedAt = new Date().toISOString();
                user.roleChangeReason = reason || 'Point threshold reached';
            }
            
            // Save changes
            DB.save();
            
            return {
                user,
                pointChange,
                oldPoints,
                newPoints,
                oldRole,
                newRole,
                roleChanged: oldRole !== newRole
            };
        },
        
        // Check if user has a specific permission
        hasPermission: function(userId, permission) {
            const user = this.getById(userId);
            if (!user) return false;
            
            const userRole = user.role;
            const permissions = DB.data.settings.permissions[userRole] || [];
            
            return permissions.includes(permission);
        }
    },
    
    // Task Management
    tasks: {
        getAll: function() {
            return DB.data.tasks;
        },
        
        getById: function(id) {
            return DB.data.tasks.find(task => task.id === id);
        },
        
        getByUser: function(userId) {
            return DB.data.tasks.filter(task => task.assignedTo === userId);
        },
        
        getAvailable: function() {
            return DB.data.tasks.filter(task => !task.assignedTo && task.status !== 'completed');
        },
        
        create: function(taskData) {
            const newTask = {
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                status: 'pending',
                ...taskData
            };
            
            DB.data.tasks.push(newTask);
            DB.save();
            return newTask;
        },
        
        update: function(id, taskData) {
            const index = DB.data.tasks.findIndex(task => task.id === id);
            if (index !== -1) {
                // Update task data
                DB.data.tasks[index] = {
                    ...DB.data.tasks[index],
                    ...taskData,
                    updatedAt: new Date().toISOString()
                };
                DB.save();
                return DB.data.tasks[index];
            }
            return null;
        },
        
        delete: function(id) {
            const index = DB.data.tasks.findIndex(task => task.id === id);
            if (index !== -1) {
                DB.data.tasks.splice(index, 1);
                DB.save();
                return true;
            }
            return false;
        },
        
        // Assign task to user
        assign: function(taskId, userId) {
            const task = this.getById(taskId);
            if (!task) return null;
            
            task.assignedTo = userId;
            task.assignedAt = new Date().toISOString();
            
            DB.save();
            return task;
        },
        
        // Complete a task
        complete: function(taskId, userId) {
            const task = this.getById(taskId);
            if (!task) return null;
            
            // Check if user is assigned to this task
            if (task.assignedTo !== userId) return null;
            
            task.status = 'completed';
            task.completedAt = new Date().toISOString();
            task.completedBy = userId;
            
            DB.save();
            return task;
        }
    },
    
    // Infraction Management
    infractions: {
        getAll: function() {
            return DB.data.infractions;
        },
        
        getById: function(id) {
            return DB.data.infractions.find(infraction => infraction.id === id);
        },
        
        getByUser: function(userId) {
            return DB.data.infractions.filter(infraction => infraction.userId === userId);
        },
        
        create: function(infractionData) {
            const newInfraction = {
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                ...infractionData
            };
            
            // Apply point deduction to user
            if (infractionData.userId && infractionData.points) {
                DB.users.updatePoints(
                    infractionData.userId, 
                    infractionData.points, 
                    `Infraction: ${infractionData.type}`
                );
            }
            
            DB.data.infractions.push(newInfraction);
            DB.save();
            return newInfraction;
        },
        
        update: function(id, infractionData) {
            const index = DB.data.infractions.findIndex(infraction => infraction.id === id);
            if (index !== -1) {
                // Get the old infraction to calculate point difference
                const oldInfraction = DB.data.infractions[index];
                
                // Update infraction data
                DB.data.infractions[index] = {
                    ...oldInfraction,
                    ...infractionData,
                    updatedAt: new Date().toISOString()
                };
                
                // If points changed, update user points
                if (infractionData.points && oldInfraction.points !== infractionData.points) {
                    // Calculate point difference
                    const pointDifference = infractionData.points - oldInfraction.points;
                    
                    // Update user points
                    if (pointDifference !== 0) {
                        DB.users.updatePoints(
                            oldInfraction.userId,
                            pointDifference,
                            `Infraction update: ${infractionData.type || oldInfraction.type}`
                        );
                    }
                }
                
                DB.save();
                return DB.data.infractions[index];
            }
            return null;
        },
        
        delete: function(id) {
            const index = DB.data.infractions.findIndex(infraction => infraction.id === id);
            if (index !== -1) {
                // Get the infraction to revert points
                const infraction = DB.data.infractions[index];
                
                // Revert point deduction if applicable
                if (infraction.userId && infraction.points) {
                    // Points are negative for infractions, so we negate to add them back
                    DB.users.updatePoints(
                        infraction.userId,
                        -infraction.points, // Negate to reverse
                        `Infraction removed: ${infraction.type}`
                    );
                }
                
                DB.data.infractions.splice(index, 1);
                DB.save();
                return true;
            }
            return false;
        }
    },
    
    // Announcement Management
    announcements: {
        getAll: function() {
            return DB.data.announcements;
        },
        
        getById: function(id) {
            return DB.data.announcements.find(announcement => announcement.id === id);
        },
        
        create: function(announcementData) {
            const newAnnouncement = {
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                ...announcementData
            };
            
            DB.data.announcements.push(newAnnouncement);
            DB.save();
            return newAnnouncement;
        },
        
        update: function(id, announcementData) {
            const index = DB.data.announcements.findIndex(announcement => announcement.id === id);
            if (index !== -1) {
                // Update announcement data
                DB.data.announcements[index] = {
                    ...DB.data.announcements[index],
                    ...announcementData,
                    updatedAt: new Date().toISOString()
                };
                DB.save();
                return DB.data.announcements[index];
            }
            return null;
        },
        
        delete: function(id) {
            const index = DB.data.announcements.findIndex(announcement => announcement.id === id);
            if (index !== -1) {
                DB.data.announcements.splice(index, 1);
                DB.save();
                return true;
            }
            return false;
        }
    },
    
    // Settings Management
    settings: {
        get: function() {
            return DB.data.settings;
        },
        
        update: function(settingsData) {
            DB.data.settings = {
                ...DB.data.settings,
                ...settingsData
            };
            DB.save();
            return DB.data.settings;
        },
        
        getRoles: function() {
            return DB.data.settings.roles;
        },
        
        getPermissions: function() {
            return DB.data.settings.permissions;
        },
        
        getInfractionTypes: function() {
            return DB.data.settings.infractionTypes;
        }
    }
};

// Initialize database when script loads
DB.init();