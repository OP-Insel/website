// Initialize the authentication system
document.addEventListener('DOMContentLoaded', () => {
    auth.init();
    
    // Set up navigation
    setupNavigation();
    
    // Check if user is logged in
    if (auth.isLoggedIn()) {
        showDashboard();
    }
});

/**
 * Set up navigation event listeners
 */
function setupNavigation() {
    // Home page navigation
    document.getElementById('get-started').addEventListener('click', () => {
        showLoginPage();
    });
    
    document.getElementById('check-setup').addEventListener('click', () => {
        showSetupPage();
    });
    
    document.getElementById('login-nav').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginPage();
    });
    
    // Template event listeners will be set up when the template is rendered
}

/**
 * Show the login page
 */
function showLoginPage() {
    // If already logged in, go to dashboard
    if (auth.isLoggedIn()) {
        showDashboard();
        return;
    }
    
    // Get the login template
    const template = document.getElementById('login-template');
    const clone = document.importNode(template.content, true);
    
    // Clear the main content and append the login form
    const main = document.querySelector('.main');
    main.innerHTML = '';
    main.appendChild(clone);
    
    // Set up form submission
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Clear any previous error
        clearMessage('login-error');
        
        // Attempt to login
        const result = auth.login(email, password);
        
        if (result.success) {
            showDashboard();
        } else {
            showError('login-error', result.error);
        }
    });
    
    // Set up the check setup link
    document.getElementById('check-setup-link').addEventListener('click', (e) => {
        e.preventDefault();
        showSetupPage();
    });
}

/**
 * Show the setup page
 */
function showSetupPage() {
    // If already logged in, go to dashboard
    if (auth.isLoggedIn()) {
        showDashboard();
        return;
    }
    
    // Get the setup template
    const template = document.getElementById('setup-template');
    const clone = document.importNode(template.content, true);
    
    // Clear the main content and append the setup content
    const main = document.querySelector('.main');
    main.innerHTML = '';
    main.appendChild(clone);
    
    // Check if owner account exists
    const ownerExists = auth.checkOwnerExists();
    
    if (!ownerExists) {
        // Create owner account
        const ownerAccount = auth.createOwnerAccount();
        
        // Get the setup initial template
        const initialTemplate = document.getElementById('setup-initial-template');
        const initialClone = document.importNode(initialTemplate.content, true);
        
        // Set the owner email and password
        const setupContent = document.getElementById('setup-content');
        setupContent.innerHTML = '';
        setupContent.appendChild(initialClone);
        
        document.getElementById('owner-email').textContent = ownerAccount.email;
        document.getElementById('owner-password').textContent = ownerAccount.password;
        
        // Set up the proceed to login button
        document.getElementById('proceed-to-login').addEventListener('click', () => {
            showLoginPage();
        });
    } else {
        // Get the setup complete template
        const completeTemplate = document.getElementById('setup-complete-template');
        const completeClone = document.importNode(completeTemplate.content, true);
        
        // Set the setup content
        const setupContent = document.getElementById('setup-content');
        setupContent.innerHTML = '';
        setupContent.appendChild(completeClone);
        
        // Set up the proceed to login button
        document.getElementById('proceed-to-login-complete').addEventListener('click', () => {
            showLoginPage();
        });
    }
}

/**
 * Show the dashboard
 */
function showDashboard() {
    // If not logged in, go to login page
    if (!auth.isLoggedIn()) {
        showLoginPage();
        return;
    }
    
    // Get the dashboard template
    const template = document.getElementById('dashboard-template');
    const clone = document.importNode(template.content, true);
    
    // Replace the entire app content
    const app = document.querySelector('.app');
    app.innerHTML = '';
    app.appendChild(clone);
    
    // Set up dashboard navigation
    document.getElementById('dashboard-nav').addEventListener('click', (e) => {
        e.preventDefault();
        showDashboardContent();
    });
    
    document.getElementById('settings-nav').addEventListener('click', (e) => {
        e.preventDefault();
        showSettingsContent();
    });
    
    document.getElementById('logout-nav').addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
        window.location.href = 'index.html';
    });
    
    // Set the user role
    const user = auth.getCurrentUser();
    document.getElementById('user-role').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    
    // Show the dashboard content by default
    showDashboardContent();
}

/**
 * Show the dashboard content
 */
function showDashboardContent() {
    // The dashboard content is already in the template
    // Just make sure the dashboard nav link is active
    document.getElementById('dashboard-nav').classList.add('active');
    document.getElementById('settings-nav').classList.remove('active');
}

/**
 * Show the settings content
 */
function showSettingsContent() {
    // Get the settings template
    const template = document.getElementById('settings-template');
    const clone = document.importNode(template.content, true);
    
    // Replace the dashboard content
    const dashboardContent = document.getElementById('dashboard-content');
    dashboardContent.innerHTML = '';
    dashboardContent.appendChild(clone);
    
    // Update the active nav link
    document.getElementById('dashboard-nav').classList.remove('active');
    document.getElementById('settings-nav').classList.add('active');
    
    // Set up the password change form
    document.getElementById('password-change-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Clear any previous messages
        clearMessage('password-change-message');
        
        // Check if passwords match
        if (newPassword !== confirmPassword) {
            showError('password-change-message', "Passwords don't match");
            return;
        }
        
        // Attempt to change the password
        const result = auth.changePassword(currentPassword, newPassword);
        
        if (result.success) {
            showSuccess('password-change-message', "Password changed successfully!");
            document.getElementById('password-change-form').reset();
        } else {
            showError('password-change-message', result.error);
        }
    });
}