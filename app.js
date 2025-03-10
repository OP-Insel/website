// Import authentication and router modules
import { initAuth } from "./auth.js"
import { initRouter } from "./router.js"

// Main application entry point

// Initialize the application
function initApp() {
  // Initialize authentication
  initAuth()

  // Initialize router
  initRouter()
}

// Start the application when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp)

