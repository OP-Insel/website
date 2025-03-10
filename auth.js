/**
 * User authentication and management
 */

// Import bcrypt and generateSecurePassword
import bcrypt from 'bcryptjs';
import { generateSecurePassword } from './utils'; // Assuming utils.js contains generateSecurePassword

class Auth {
    constructor() {
        this.currentUser = null;
        this.initialized = false;
    }

    /**
     * Initialize the authentication system
     */
    init() {
        if (this.initialized) return;

        // Check if we have a user in localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
        }

        this.initialized = true;
    }

    /**
     * Check if the owner account exists
     * @returns {boolean} - Whether the owner account exists
     */
    checkOwnerExists() {
        return localStorage.getItem('ownerAccount') !== null;
    }

    /**
     * Create the owner account
     * @returns {Object} - The created owner account
     */
    createOwnerAccount() {
        // Generate a secure password
        const password = generateSecurePassword();
        const email = "owner@example.com";
        
        // Hash the password (in a real app, this would be done server-side)
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        // Create the owner account
        const ownerAccount = {
            id: "owner-" + Date.now(),
            email,
            name: "System Owner",
            role: "owner",
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };
        
        // Store the owner account
        localStorage.setItem('ownerAccount', JSON.stringify(ownerAccount));
        
        // Return the account with the plaintext password (only for initial setup)
        return {
            ...ownerAccount,
            password
        };
    }

    /**
     * Login a user
     * @param {string} email - The user's email
     * @param {string} password - The user's password
     * @returns {Object} - The result of the login attempt
     */
    login(email, password) {
        // Get the owner account
        const ownerAccountStr = localStorage.getItem('ownerAccount');
        if (!ownerAccountStr) {
            return { success: false, error: "No accounts exist" };
        }
        
        const ownerAccount = JSON.parse(ownerAccountStr);
        
        // Check if the email matches
        if (email !== ownerAccount.email) {
            return { success: false, error: "Invalid email or password" };
        }
        
        // Check if the password matches
        const passwordMatches = bcrypt.compareSync(password, ownerAccount.password);
        if (!passwordMatches) {
            return { success: false, error: "Invalid email or password" };
        }
        
        // Set the current user (without the password)
        const { password: _, ...userWithoutPassword } = ownerAccount;
        this.currentUser = userWithoutPassword;
        
        // Store the current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        return { success: true, user: this.currentUser };
    }

    /**
     * Logout the current user
     */
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    /**
     * Check if a user is logged in
     * @returns {boolean} - Whether a user is logged in
     */
    isLoggedIn() {
        return this.currentUser !== null;
    }

    /**
     * Get the current user
     * @returns {Object|null} - The current user or null if not logged in
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Change the password for the current user
     * @param {string} currentPassword - The current password
     * @param {string} newPassword - The new password
     * @returns {Object} - The result of the password change attempt
     */
    changePassword(currentPassword, newPassword) {
        if (!this.isLoggedIn()) {
            return { success: false, error: "Not logged in" };
        }
        
        // Get the owner account
        const ownerAccountStr = localStorage.getItem('ownerAccount');
        if (!ownerAccountStr) {
            return { success: false, error: "Account not found" };
        }
        
        const ownerAccount = JSON.parse(ownerAccountStr);
        
        // Check if the current password matches
        const passwordMatches = bcrypt.compareSync(currentPassword, ownerAccount.password);
        if (!passwordMatches) {
            return { success: false, error: "Current password is incorrect" };
        }
        
        // Hash the new password
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        
        // Update the password
        ownerAccount.password = hashedPassword;
        
        // Store the updated account
        localStorage.setItem('ownerAccount', JSON.stringify(ownerAccount));
        
        return { success: true };
    }
}

// Create a global auth instance
const auth = new Auth();
