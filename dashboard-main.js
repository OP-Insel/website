document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("opInselLoggedIn")
  if (!isLoggedIn) {
    window.location.href = "login.html"
    return
  }

  // Set user name
  const userName = localStorage.getItem("opInselUserName") || "User"
  const userRole = localStorage.getItem("opInselUserRole") || "user"
  document.getElementById("user-name").textContent = userName

  // Toggle sidebar on mobile
  const sidebarToggle = document.getElementById("sidebar-toggle")
  const sidebar = document.querySelector(".sidebar")

  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("show")
  })

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 992 &&
      !sidebar.contains(e.target) &&
      !sidebarToggle.contains(e.target) &&
      sidebar.classList.contains("show")
    ) {
      sidebar.classList.remove("show")
    }
  })

  // User dropdown
  const userMenu = document.getElementById("user-menu")
  const userDropdown = document.getElementById("user-dropdown")

  userMenu.addEventListener("click", (e) => {
    e.stopPropagation()
    userDropdown.classList.toggle("show")
  })

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
    userDropdown.classList.remove("show")
  })

  userDropdown.addEventListener("click", (e) => {
    e.stopPropagation()
  })

  // Logout functionality
  const logoutButton = document.getElementById("logout-button")

  logoutButton.addEventListener("click", (e) => {
    e.preventDefault()

    // Clear local storage
    localStorage.removeItem("opInselLoggedIn")
    localStorage.removeItem("opInselUserRole")
    localStorage.removeItem("opInselUserName")

    // Redirect to login page
    window.location.href = "login.html"
  })

  // Quick actions
  const quickActionButtons = document.querySelectorAll(".quick-action-btn")

  quickActionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-action")
      handleQuickAction(action)
    })
  })

  function handleQuickAction(action) {
    switch (action) {
      case "restart":
        showToast("warning", "Server-Neustart", "Der Server wird in 5 Minuten neu gestartet.")
        break
      case "whitelist":
        window.location.href = "whitelist.html"
        break
      case "event":
        window.location.href = "calendar.html"
        break
      case "announcement":
        showToast("success", "Ankündigung gesendet", "Deine Ankündigung wurde an alle Spieler gesendet.")
        break
    }
  }

  // Toast notification
  function showToast(type, title, message) {
    const toast = document.getElementById("toast")
    const toastTitle = toast.querySelector(".toast-title")
    const toastDescription = toast.querySelector(".toast-description")
    const toastIcon = toast.querySelector(".toast-icon")
    const toastProgress = toast.querySelector(".toast-progress")

    // Set content
    toastTitle.textContent = title
    toastDescription.textContent = message

    // Set type
    toast.className = "toast"
    if (type === "error") {
      toast.classList.add("error")
      toastIcon.className = "fas fa-times-circle toast-icon"
      toastProgress.style.backgroundColor = "var(--danger)"
    } else if (type === "warning") {
      toast.classList.add("warning")
      toastIcon.className = "fas fa-exclamation-triangle toast-icon"
      toastProgress.style.backgroundColor = "var(--warning)"
    } else {
      toastIcon.className = "fas fa-check-circle toast-icon"
      toastProgress.style.backgroundColor = "var(--success)"
    }

    // Show toast
    toast.classList.add("show")

    // Reset animation
    toastProgress.style.animation = "none"
    void toastProgress.offsetWidth // Trigger reflow
    toastProgress.style.animation = "progress 3s linear forwards"

    // Hide toast after animation
    setTimeout(() => {
      toast.classList.remove("show")
    }, 3000)
  }

  // Initialize notification count
  updateNotificationCount()
})

// Update notification badge
function updateNotificationCount() {
  // For demo purposes, set a random number of notifications
  const count = Math.floor(Math.random() * 5)
  const badge = document.getElementById("notification-badge")

  if (count > 0) {
    badge.textContent = count
    badge.style.display = "flex"
  } else {
    badge.style.display = "none"
  }
}

