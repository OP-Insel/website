// Theme Toggle
const themeToggle = document.getElementById("theme-toggle")
const sunIcon = document.getElementById("sun-icon")
const moonIcon = document.getElementById("moon-icon")

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem("theme")
if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  document.documentElement.classList.add("dark")
  sunIcon.classList.add("hidden")
  moonIcon.classList.remove("hidden")
} else {
  document.documentElement.classList.remove("dark")
  sunIcon.classList.remove("hidden")
  moonIcon.classList.add("hidden")
}

themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark")

  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("theme", "dark")
    sunIcon.classList.add("hidden")
    moonIcon.classList.remove("hidden")
  } else {
    localStorage.setItem("theme", "light")
    sunIcon.classList.remove("hidden")
    moonIcon.classList.add("hidden")
  }
})

// User Menu Toggle
const userMenuButton = document.getElementById("user-menu-button")
const userMenu = document.getElementById("user-menu")

userMenuButton.addEventListener("click", () => {
  userMenu.classList.toggle("hidden")
})

// Close menu when clicking outside
document.addEventListener("click", (event) => {
  if (!userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
    userMenu.classList.add("hidden")
  }
})

// Logout functionality
const logoutButton = document.getElementById("logout-button")
logoutButton.addEventListener("click", () => {
  // In a real app, you would clear authentication tokens
  localStorage.removeItem("user")
  window.location.href = "login.html"
})

// Tab functionality
const tabButtons = document.querySelectorAll(".tab-button")
const tabContents = document.querySelectorAll(".tab-content")

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons and contents
    tabButtons.forEach((btn) => btn.classList.remove("active", "bg-blue-600", "text-white"))
    tabContents.forEach((content) => content.classList.remove("active"))

    // Add active class to clicked button and corresponding content
    button.classList.add("active", "bg-blue-600", "text-white")
    document.getElementById(`${button.dataset.tab}-tab`).classList.add("active")
  })
})

// Admin Tab functionality
const adminTabButtons = document.querySelectorAll(".admin-tab-button")
const adminTabContents = document.querySelectorAll(".admin-tab-content")

adminTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons and contents
    adminTabButtons.forEach((btn) => btn.classList.remove("active", "border-b-2", "border-blue-600"))
    adminTabContents.forEach((content) => content.classList.remove("active"))

    // Add active class to clicked button and corresponding content
    button.classList.add("active", "border-b-2", "border-blue-600")
    document.getElementById(`${button.dataset.tab}-tab`).classList.add("active")
  })
})

// Check if user is logged in
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user")
  if (!user && window.location.pathname !== "/login.html") {
    window.location.href = "login.html"
  }
})

