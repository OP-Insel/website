// Auth service
const auth = firebase.auth();
const db = firebase.firestore();

// Current user data
let currentUser = null;
let currentUserData = null;

// Check if user is logged in
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        
        // Get user data from Firestore
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            
            if (userDoc.exists) {
                currentUserData = userDoc.data();
                UI.showDashboard();
                UI.updateUserInfo();
                
                // Check if user is admin or owner
                if (currentUserData.role === 'Owner' || currentUserData.role === 'Co-Owner' || currentUserData.role === 'Admin') {
                    document.getElementById('admin-nav-item').classList.remove('hidden');
                }
                
                // Load dashboard data
                Database.loadDashboardData();
            } else {
                console.error('User document does not exist');
                auth.signOut();
            }
        } catch (error) {
            console.error('Error getting user data:', error);
            auth.signOut();
        }
    } else {
        currentUser = null;
        currentUserData = null;
        UI.showLogin();
    }
});

// Auth functions
const Auth = {
    // Register new user
    async register(username, minecraftUsername, email, password) {
        try {
            // Create user in Firebase Auth
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Create user document in Firestore
            const userData = {
                uid: user.uid,
                username: username,
                minecraftUsername: minecraftUsername,
                email: email,
                role: 'Jr. Supporter',
                points: 0,
                joinDate: new Date().toISOString(),
                tasks: {
                    assigned: 0,
                    completed: 0
                }
            };
            
            await db.collection('users').doc(user.uid).set(userData);
            
            return { success: true };
        } catch (error) {
            console.error('Error registering user:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Login user
    async login(email, password) {
        try {
            await auth.signInWithEmailAndPassword(email, password);
            return { success: true };
        } catch (error) {
            console.error('Error logging in:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Logout user
    async logout() {
        try {
            await auth.signOut();
            return { success: true };
        } catch (error) {
            console.error('Error logging out:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Update user profile
    async updateProfile(username, minecraftUsername, email) {
        try {
            if (!currentUser) {
                throw new Error('No user is logged in');
            }
            
            // Update email in Firebase Auth if changed
            if (email !== currentUser.email) {
                await currentUser.updateEmail(email);
            }
            
            // Update user document in Firestore
            await db.collection('users').doc(currentUser.uid).update({
                username: username,
                minecraftUsername: minecraftUsername,
                email: email
            });
            
            // Update current user data
            currentUserData.username = username;
            currentUserData.minecraftUsername = minecraftUsername;
            currentUserData.email = email;
            
            return { success: true };
        } catch (error) {
            console.error('Error updating profile:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Change password
    async changePassword(currentPassword, newPassword) {
        try {
            if (!currentUser) {
                throw new Error('No user is logged in');
            }
            
            // Reauthenticate user
            const credential = firebase.auth.EmailAuthProvider.credential(
                currentUser.email,
                currentPassword
            );
            
            await currentUser.reauthenticateWithCredential(credential);
            
            // Update password
            await currentUser.updatePassword(newPassword);
            
            return { success: true };
        } catch (error) {
            console.error('Error changing password:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Get current user data
    getCurrentUser() {
        return currentUserData;
    },
    
    // Check if user is admin or owner
    isAdmin() {
        if (!currentUserData) return false;
        
        return ['Owner', 'Co-Owner', 'Admin'].includes(currentUserData.role);
    },
    
    // Check if user is owner
    isOwner() {
        if (!currentUserData) return false;
        
        return ['Owner', 'Co-Owner'].includes(currentUserData.role);
    }
};

