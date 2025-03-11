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

  // Server status
  updateServerStatus()

  // Refresh button click handler
  const refreshButton = document.getElementById("refresh-status")
  refreshButton.addEventListener("click", () => {
    refreshButton.disabled = true
    refreshButton.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Aktualisieren'

    // Simulate API call delay
    setTimeout(() => {
      updateServerStatus()
      refreshButton.disabled = false
      refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> Aktualisieren'
    }, 1500)
  })

  // Quick actions
  const quickActionButtons = document.querySelectorAll(".quick-action-btn")

  quickActionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-action")
      handleQuickAction(action)
    })
  })

  // Load tasks
  loadTasks()

  // Functions
  function updateServerStatus() {
    const serverStatusBadge = document.getElementById("server-status-badge")
    const playerCount = document.getElementById("player-count")
    const playerProgress = document.getElementById("player-progress")
    const statusTimestamp = document.getElementById("status-timestamp")

    // For demo purposes, randomly set status
    const isOnline = Math.random() > 0.2 // 80% chance to be online
    const maxPlayers = 50

    if (isOnline) {
      // Set online status
      serverStatusBadge.textContent = "Online"
      serverStatusBadge.className = "badge badge-success"

      // Random player count
      const currentPlayers = Math.floor(Math.random() * maxPlayers)
      playerCount.textContent = `${currentPlayers}/${maxPlayers}`

      // Update progress bar
      const percentage = (currentPlayers / maxPlayers) * 100
      playerProgress.style.width = `${percentage}%`

      // If server is nearly full, change color
      if (percentage > 80) {
        playerProgress.style.backgroundColor = "var(--warning)"
      } else {
        playerProgress.style.backgroundColor = "var(--primary)"
      }
    } else {
      // Set offline status
      serverStatusBadge.textContent = "Offline"
      serverStatusBadge.className = "badge badge-danger"

      // Clear player count and progress
      playerCount.textContent = "0/0"
      playerProgress.style.width = "0%"
    }

    // Update timestamp
    const now = new Date()
    statusTimestamp.textContent = `Zuletzt aktualisiert: ${now.toLocaleTimeString()}`
  }

  function handleQuickAction(action) {
    switch (action) {
      case "restart":
        showToast("warning", "Server-Neustart", "Der Server wird in 5 Minuten neu gestartet.")
        break
      case "whitelist":
        window.location.href = "whitelist.html"
        break
      case "event":
        showToast("info", "Event-Erstellung", "Funktion noch nicht verfügbar.")
        break
      case "announcement":
        showToast("success", "Ankündigung gesendet", "Deine Ankündigung wurde an alle Spieler gesendet.")
        break
    }
  }

  function loadTasks() {
    const tasksList = document.getElementById("tasks-list")

    if (!tasksList) return

    // Mock tasks data
    const tasksData = [
      {
        id: "task-1",
        title: "Build new spawn area",
        status: "in-progress",
        priority: "high",
        progress: 65,
        dueDate: "2025-03-15",
        assignee: {
          name: "Alex",
          avatar: "avatar-placeholder.jpg",
          initials: "AX",
        },
      },
      {
        id: "task-2",
        title: "Create NPC dialogue for quest",
        status: "todo",
        priority: "medium",
        progress: 0,
        dueDate: "2025-03-20",
        assignee: {
          name: "Sarah",
          avatar: "avatar-placeholder.jpg",
          initials: "SH",
        },
      },
      {
        id: "task-3",
        title: "Design dungeon layout",
        status: "completed",
        priority: "medium",
        progress: 100,
        dueDate: "2025-03-10",
        assignee: {
          name: "Mike",
          avatar: "avatar-placeholder.jpg",
          initials: "MK",
        },
      },
      {
        id: "task-4",
        title: "Fix server lag issues",
        status: "overdue",
        priority: "high",
        progress: 30,
        dueDate: "2025-03-05",
        assignee: {
          name: "John",
          avatar: "avatar-placeholder.jpg",
          initials: "JD",
        },
      },
    ]

    let tasksHTML = ""

    if (tasksData.length === 0) {
      tasksHTML = '<div class="empty-state">No tasks found.</div>'
    } else {
      tasksData.forEach((task) => {
        const statusClass = getStatusClass(task.status)
        const priorityClass = getPriorityClass(task.priority)

        tasksHTML += `
          <div class="task-item">
            <input type="checkbox" class="task-checkbox" ${task.status === "completed" ? "checked" : ""}>
            <div class="task-content">
              <div class="task-title">${task.title}</div>
              <div class="task-meta">
                <span class="badge ${statusClass}">${formatStatus(task.status)}</span>
                <span class="badge ${priorityClass}">${formatPriority(task.priority)}</span>
                <span>Due: ${formatDate(task.dueDate)}</span>
              </div>
            </div>
            <div class="task-actions">
              <button class="btn btn-sm btn-outline">Edit</button>
            </div>
          </div>
        `
      })
    }

    tasksList.innerHTML = tasksHTML
  }

  function getStatusClass(status) {
    switch (status) {
      case "todo":
        return "badge-outline"
      case "in-progress":
        return "badge-warning"
      case "completed":
        return "badge-success"
      case "overdue":
        return "badge-danger"
      default:
        return "badge-outline"
    }
  }

  function getPriorityClass(priority) {
    switch (priority) {
      case "low":
        return "badge-outline"
      case "medium":
        return "badge-warning"
      case "high":
        return "badge-danger"
      default:
        return "badge-outline"
    }
  }

  function formatStatus(status) {
    switch (status) {
      case "todo":
        return "To Do"
      case "in-progress":
        return "In Progress"
      case "completed":
        return "Completed"
      case "overdue":
        return "Overdue"
      default:
        return status
    }
  }

  function formatPriority(priority) {
    return priority.charAt(0).toUpperCase() + priority.slice(1)
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

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
})

