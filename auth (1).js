/**
 * Authentication Module
 * 
 * Handles Discord OAuth2 authentication and user session management.
 */

// Mock DB and App objects for demonstration purposes
const DB = {
    users: {
        data: [],
        create: function(user) {
            user.id = 'user_' + Math.floor(Math.random() * 1000000);
            this.data.push(user);
            return user;
        },
        getById: function(id) {
            return this.data.find(user => user.id === id);
        },
        getByDiscordId: function(discordId) {
            return this.data.find(user => user.discordId === discordId);
        },
        update: function(id, updates) {
            const userIndex = this.data.findIndex(user => user.id === id);
            if (userIndex > -1) {
                this.data[userIndex] = { ...this.data[userIndex], ...updates };
                return this.data[userIndex];
            }
            return null;
        },
        hasPermission: function(userId, permission) {
            const user = this.getById(userId);
            if (!user) return false;
            // Implement permission checking logic here based on user roles or other criteria
            return true; // Placeholder: always return true for demonstration
        }
    }
};

const App = {
    init: function(user) {
        console.log('App initialized with user:', user);
        UI.showScreen('app-screen');
        UI.showPage('dashboard-page');
    }
};

const Auth = {
    // Discord OAuth2 configuration
    config: {
        clientId: '123456789012345678', // REPLACE WITH YOUR DISCORD CLIENT ID
        redirectUri: window.location.origin + window.location.pathname,
        scope: 'identify email',
        authUrl: 'https://discord.com/api/oauth2/authorize',
        tokenUrl: 'https://discord.com/api/oauth2/token',
        apiUrl: 'https://discord.com/api/users/@me'
    },
    
    // Current user session
    session: null,
    
    // Initialize authentication
    init: function() {
        console.log('Initializing authentication...');
        
        // Check for Discord OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
            // Remove code from URL to prevent sharing
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Exchange code for token (in a real app, this would be done server-side)
            this.handleOAuthCallback(code);
        } else {
            // Check for existing session
            this.loadSession();
        }
    },
    
    // Start Discord OAuth flow
    login: function() {
        // Build OAuth URL
        const authUrl = new URL(this.config.authUrl);
        authUrl.searchParams.append('client_id', this.config.clientId);
        authUrl.searchParams.append('redirect_uri', this.config.redirectUri);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('scope', this.config.scope);
        
        // Redirect to Discord OAuth
        window.location.href = authUrl.toString();
    },
    
    // Handle OAuth callback
    handleOAuthCallback: async function(code) {
        UI.showScreen('loading-screen');
        
        // In a real application, this would be handled server-side
        // For demo purposes, we'll simulate the token exchange and API call
        
        // Simulate token exchange
        console.log('Exchanging code for token...');
        
        // Simulate API call to get user data
        setTimeout(() => {
            // Generate mock Discord user data
            const mockDiscordUser = {
                id: 'discord_' + Math.floor(Math.random() * 1000000),
                username: 'Discord_User_' + Math.floor(Math.random() * 1000),
                discriminator: Math.floor(Math.random() * 9000 + 1000).toString(),
                avatar: null,
                email: 'user' + Math.floor(Math.random() * 1000) + '@example.com'
            };
            
            this.handleUserData(mockDiscordUser);
        }, 1500);
    },
    
    // Process user data from Discord
    handleUserData: function(discordUser) {
        console.log('Processing Discord user data...');
        
        // Check if user exists in our database
        let user = DB.users.getByDiscordId(discordUser.id);
        
        if (user) {
            // Update existing user
            user = DB.users.update(user.id, {
                discordUsername: discordUser.username,
                discordDiscriminator: discordUser.discriminator,
                discordAvatar: discordUser.avatar,
                email: discordUser.email,
                lastLogin: new Date().toISOString()
            });
            
            console.log('Existing user logged in:', user);
        } else {
            // Create new user
            user = DB.users.create({
                discordId: discordUser.id,
                discordUsername: discordUser.username,
                discordDiscriminator: discordUser.discriminator,
                discordAvatar: discordUser.avatar,
                email: discordUser.email,
                username: discordUser.username,
                minecraftUsername: '',
                role: 'member',
                points: 100,
                status: 'active',
                joinDate: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
            
            console.log('New user created:', user);
        }
        
        // Create session
        this.createSession(user);
        
        // Check if user has access
        if (this.hasAccess(user)) {
            // Load main app
            App.init(user);
        } else {
            // Show no access screen
            UI.showScreen('no-access-screen');
        }
    },
    
    // Create user session
    createSession: function(user) {
        // Create session object
        this.session = {
            userId: user.id,
            role: user.role,
            created: new Date().toISOString(),
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };
        
        // Save session to localStorage
        localStorage.setItem('op-insel-session', JSON.stringify(this.session));
        
        console.log('Session created:', this.session);
    },
    
    // Load existing session
    loadSession: function() {
        // Get session from localStorage
        const sessionData = localStorage.getItem('op-insel-session');
        
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                
                // Check if session is expired
                if (new Date(session.expires) > new Date()) {
                    // Session is valid
                    this.session = session;
                    
                    // Get user data
                    const user = DB.users.getById(session.userId);
                    
                    if (user) {
                        console.log('Session loaded:', this.session);
                        
                        // Check if user has access
                        if (this.hasAccess(user)) {
                            // Load main app
                            App.init(user);
                            return;
                        }
                    }
                }
            } catch (e) {
                console.error('Error loading session:', e);
            }
        }
        
        // No valid session, show login screen
        UI.showScreen('login-screen');
    },
    
    // Check if user has access to the system
    hasAccess: function(user) {
        // Check if user is active
        if (user.status !== 'active') {
            return false;
        }
        
        // Check if user has required role
        // For demo, we'll allow all roles except 'member'
        // In a real app, you might have more complex access rules
        return user.role !== 'member' || user.points > 0;
    },
    
    // Logout user
    logout: function() {
        // Clear session
        this.session = null;
        localStorage.removeItem('op-insel-session');
        
        // Show login screen
        UI.showScreen('login-screen');
        
        console.log('User logged out');
    },
    
    // Get current user
    getCurrentUser: function() {
        if (!this.session) return null;
        
        return DB.users.getById(this.session.userId);
    },
    
    // Check if user has permission
    hasPermission: function(permission) {
        if (!this.session) return false;
        
        return DB.users.hasPermission(this.session.userId, permission);
    }
};

// UI Helper Functions
const UI = {
    // Show a specific screen
    showScreen: function(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Show requested screen
        document.getElementById(screenId).classList.remove('hidden');
    },
    
    // Show a specific page
    showPage: function(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('hidden');
        });
        
        // Show requested page
        document.getElementById(pageId).classList.remove('hidden');
        
        // Update active nav item
        document.querySelectorAll('.sidebar-nav li').forEach(item => {
            item.classList.remove('active');
        });
        
        document.querySelector(`.sidebar-nav li[data-page="${pageId.replace('-page', '')}"]`).classList.add('active');
    },
    
    // Show modal
    showModal: function(modalId) {
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.getElementById(modalId).classList.remove('hidden');
    },
    
    // Hide modal
    hideModal: function(modalId) {
        document.getElementById('modal-overlay').classList.add('hidden');
        document.getElementById(modalId).classList.add('hidden');
    },
    
    // Hide all modals
    hideAllModals: function() {
        document.getElementById('modal-overlay').classList.add('hidden');
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    },
    
    // Show confirmation dialog
    showConfirmation: function(title, message, callback) {
        document.getElementById('confirm-title').textContent = title;
        document.getElementById('confirm-message').textContent = message;
        
        // Set confirm action
        const confirmBtn = document.getElementById('confirm-action');
        
        // Remove old event listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        // Add new event listener
        newConfirmBtn.addEventListener('click', () => {
            this.hideAllModals();
            callback();
        });
        
        this.showModal('confirm-modal');
    }
};

// Initialize authentication when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set up login button
    document.getElementById('discord-login').addEventListener('click', function() {
        Auth.login();
    });
    
    // Set up logout buttons
    document.querySelectorAll('#logout-btn, #logout-nav').forEach(btn => {
        btn.addEventListener('click', function() {
            Auth.logout();
        });
    });
    
    // Set up modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            UI.hideAllModals();
        });
    });
    
    // Initialize authentication
    Auth.init();
});