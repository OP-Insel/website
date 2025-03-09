// Import necessary modules or declare variables
let currentUser; // Example declaration, adjust as needed based on your authentication setup
let UI; // Example declaration, adjust as needed based on your UI library/framework
let db; // Example declaration, adjust as needed based on your Firebase setup
let currentUserData; // Example declaration, adjust as needed based on your data fetching
const TASK_STATUSES = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed'
};

const INFRACTIONS = {
    SPAM: { name: 'Spam', points: 10 },
    HARASSMENT: { name: 'Harassment', points: 20 },
    DISRESPECT: { name: 'Disrespect', points: 15 }
};

// Declare firebase
let firebase;

// Database service
const Database = {
    // Load dashboard data
    async loadDashboardData() {
        try {
            if (!currentUser) return;
            
            // Update user info
            UI.updateUserInfo();
            
            // Load tasks
            const tasks = await this.getUserTasks(currentUser.uid);
            UI.renderRecentTasks(tasks);
            
            // Load notifications
            const notifications = await this.getUserNotifications(currentUser.uid);
            UI.renderNotifications(notifications);
            
            // Update rank progress
            this.updateRankProgress();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    },
    
    // Get user tasks
    async getUserTasks(userId) {
        try {
            const tasksSnapshot = await db.collection('tasks')
                .where('assignedTo', '==', userId)
                .orderBy('dueDate', 'asc')
                .limit(5)
                .get();
            
            const tasks = [];
            tasksSnapshot.forEach(doc => {
                tasks.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return tasks;
        } catch (error) {
            console.error('Error getting user tasks:', error);
            return [];
        }
    },
    
    // Get user notifications
    async getUserNotifications(userId) {
        try {
            const notificationsSnapshot = await db.collection('notifications')
                .where('userId', '==', userId)
                .orderBy('timestamp', 'desc')
                .limit(5)
                .get();
            
            const notifications = [];
            notificationsSnapshot.forEach(doc => {
                notifications.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return notifications;
        } catch (error) {
            console.error('Error getting user notifications:', error);
            return [];
        }
    },
    
    // Update rank progress
    updateRankProgress() {
        if (!currentUserData) return;
        
        const currentRole = currentUserData.role;
        let nextRole = '';
        let pointsNeeded = 0;
        let progress = 0;
        
        // Determine next role and points needed
        switch (currentRole) {
            case 'Jr. Supporter':
                nextRole = 'Supporter';
                pointsNeeded = 150 - currentUserData.points;
                progress = (currentUserData.points / 150) * 100;
                break;
            case 'Supporter':
                nextRole = 'Jr. Moderator';
                pointsNeeded = 200 - currentUserData.points;
                progress = ((currentUserData.points - 150) / 50) * 100;
                break;
            case 'Jr. Moderator':
                nextRole = 'Moderator';
                pointsNeeded = 250 - currentUserData.points;
                progress = ((currentUserData.points - 200) / 50) * 100;
                break;
            case 'Moderator':
                nextRole = 'Jr. Admin';
                pointsNeeded = 300 - currentUserData.points;
                progress = ((currentUserData.points - 250) / 50) * 100;
                break;
            case 'Jr. Admin':
                nextRole = 'Admin';
                pointsNeeded = 400 - currentUserData.points;
                progress = ((currentUserData.points - 300) / 100) * 100;
                break;
            case 'Admin':
                nextRole = 'Co-Owner';
                pointsNeeded = 500 - currentUserData.points;
                progress = ((currentUserData.points - 400) / 100) * 100;
                break;
            case 'Co-Owner':
                nextRole = 'Owner';
                pointsNeeded = Infinity;
                progress = 100;
                break;
            case 'Owner':
                nextRole = 'Owner';
                pointsNeeded = 0;
                progress = 100;
                break;
        }
        
        // Ensure progress is between 0 and 100
        progress = Math.max(0, Math.min(100, progress));
        
        // Update UI
        document.getElementById('current-rank').textContent = currentRole;
        document.getElementById('next-rank').textContent = nextRole;
        document.getElementById('points-needed').textContent = pointsNeeded === Infinity ? '∞' : pointsNeeded;
        document.getElementById('rank-progress-fill').style.width = `${progress}%`;
        document.getElementById('rank-progress-percentage').textContent = `${Math.round(progress)}%`;
    },
    
    // Get all users (for admin panel)
    async getAllUsers() {
        try {
            const usersSnapshot = await db.collection('users').get();
            
            const users = [];
            usersSnapshot.forEach(doc => {
                users.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return users;
        } catch (error) {
            console.error('Error getting all users:', error);
            return [];
        }
    },
    
    // Get all infractions (for admin panel)
    async getAllInfractions() {
        try {
            const infractionsSnapshot = await db.collection('infractions')
                .orderBy('date', 'desc')
                .get();
            
            const infractions = [];
            infractionsSnapshot.forEach(doc => {
                infractions.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return infractions;
        } catch (error) {
            console.error('Error getting all infractions:', error);
            return [];
        }
    },
    
    // Get all tasks (for admin panel)
    async getAllTasks() {
        try {
            const tasksSnapshot = await db.collection('tasks')
                .orderBy('dueDate', 'asc')
                .get();
            
            const tasks = [];
            tasksSnapshot.forEach(doc => {
                tasks.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return tasks;
        } catch (error) {
            console.error('Error getting all tasks:', error);
            return [];
        }
    },
    
    // Add new task
    async addTask(taskData) {
        try {
            const result = await db.collection('tasks').add({
                ...taskData,
                createdAt: new Date().toISOString(),
                status: TASK_STATUSES.NOT_STARTED
            });
            
            // Update user's assigned tasks count
            await db.collection('users').doc(taskData.assignedTo).update({
                'tasks.assigned': firebase.firestore.FieldValue.increment(1)
            });
            
            // Add notification for assigned user
            await this.addNotification(taskData.assignedTo, `You've been assigned a new task: ${taskData.title}`);
            
            return { success: true, id: result.id };
        } catch (error) {
            console.error('Error adding task:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Update task status
    async updateTaskStatus(taskId, status) {
        try {
            // Get task data
            const taskDoc = await db.collection('tasks').doc(taskId).get();
            const taskData = taskDoc.data();
            
            // Update task status
            await db.collection('tasks').doc(taskId).update({
                status: status
            });
            
            // If task is completed, update user's completed tasks count
            if (status === TASK_STATUSES.COMPLETED) {
                await db.collection('users').doc(taskData.assignedTo).update({
                    'tasks.completed': firebase.firestore.FieldValue.increment(1)
                });
                
                // Add notification
                await this.addNotification(taskData.assignedTo, `You've completed the task: ${taskData.title}`);
            }
            
            return { success: true };
        } catch (error) {
            console.error('Error updating task status:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Add infraction
    async addInfraction(infractionData) {
        try {
            // Get infraction points
            const infractionType = Object.keys(INFRACTIONS).find(key => 
                INFRACTIONS[key].name === infractionData.type
            );
            
            const points = INFRACTIONS[infractionType].points;
            
            // Add infraction to database
            const result = await db.collection('infractions').add({
                ...infractionData,
                points: points,
                timestamp: new Date().toISOString()
            });
            
            // Update user's points
            await db.collection('users').doc(infractionData.userId).update({
                points: firebase.firestore.FieldValue.increment(points)
            });
            
            // Add notification for user
            await this.addNotification(infractionData.userId, `You received an infraction: ${infractionData.type} (${points} points)`);
            
            // Check if user needs to be degraded
            await this.checkUserDegradation(infractionData.userId);
            
            return { success: true, id: result.id };
        } catch (error) {
            console.error('Error adding infraction:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Check if user needs to be degraded based on points
    async checkUserDegradation(userId) {
        try {
            // Get user data
            const userDoc = await db.collection('users').doc(userId).get();
            const userData = userDoc.data();
            
            // Get current role and points
            const currentRole = userData.role;
            const points = userData.points;
            
            // Determine if user needs to be degraded
            let newRole = currentRole;
            
            if (points <= 0) {
                // Remove from team
                newRole = 'Removed';
            } else if (points < 150 && currentRole !== 'Jr. Supporter') {
                newRole = 'Jr. Supporter';
            } else if (points < 200 && ['Supporter', 'Jr. Moderator', 'Moderator', 'Jr. Admin', 'Admin', 'Co-Owner'].includes(currentRole)) {
                newRole = 'Supporter';
            } else if (points < 250 && ['Jr. Moderator', 'Moderator', 'Jr. Admin', 'Admin', 'Co-Owner'].includes(currentRole)) {
                newRole = 'Jr. Moderator';
            } else if (points < 300 && ['Moderator', 'Jr. Admin', 'Admin', 'Co-Owner'].includes(currentRole)) {
                newRole = 'Moderator';
            } else if (points < 400 && ['Jr. Admin', 'Admin', 'Co-Owner'].includes(currentRole)) {
                newRole = 'Jr. Admin';
            } else if (points < 500 && ['Admin', 'Co-Owner'].includes(currentRole)) {
                newRole = 'Admin';
            }
            
            // If role changed, update user
            if (newRole !== currentRole) {
                await db.collection('users').doc(userId).update({
                    role: newRole
                });
                
                // Add notification
                await this.addNotification(userId, `Your role has been changed to ${newRole} due to your point balance.`);
                
                return { success: true, degraded: true, newRole: newRole };
            }
            
            return { success: true, degraded: false };
        } catch (error) {
            console.error('Error checking user degradation:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Add notification
    async addNotification(userId, message) {
        try {
            await db.collection('notifications').add({
                userId: userId,
                message: message,
                read: false,
                timestamp: new Date().toISOString()
            });
            
            return { success: true };
        } catch (error) {
            console.error('Error adding notification:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Reset points on first day of month
    async resetMonthlyPoints() {
        try {
            const today = new Date();
            
            // Check if it's the first day of the month
            if (today.getDate() === 1) {
                // Get all users
                const usersSnapshot = await db.collection('users').get();
                
                // Batch update
                const batch = db.batch();
                
                usersSnapshot.forEach(doc => {
                    // Store current role before reset
                    const userData = doc.data();
                    const currentRole = userData.role;
                    
                    // Reset points but keep degradations
                    batch.update(doc.ref, {
                        points: 0,
                        lastPointsReset: today.toISOString()
                    });
                    
                    // Add notification
                    this.addNotification(doc.id, 'Your points have been reset for the new month. Your current role remains unchanged.');
                });
                
                // Commit batch
                await batch.commit();
                
                return { success: true };
            }
            
            return { success: true, noReset: true };
        } catch (error) {
            console.error('Error resetting monthly points:', error);
            return { success: false, error: error.message };
        }
    }
};

