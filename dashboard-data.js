document.addEventListener("DOMContentLoaded", () => {
  // Load tasks data
  loadTasks()

  // Load events data
  loadEvents()

  // Load activity data
  loadActivity()
})

// Mock data for tasks
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
      avatar: "../images/avatar-placeholder.jpg",
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
      avatar: "../images/avatar-placeholder.jpg",
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
      avatar: "../images/avatar-placeholder.jpg",
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
      avatar: "../images/avatar-placeholder.jpg",
      initials: "JD",
    },
  },
]

// Mock data for events
const eventsData = [
  {
    id: "event-1",
    title: "Server Launch Party",
    description: "Celebrating the launch of our new server features",
    date: "2025-03-15",
    time: "8:00 PM",
    location: "Main Spawn",
    attendees: 24,
    type: "server-event",
  },
  {
    id: "event-2",
    title: "Team Building Session",
    description: "Working on the new castle in the north region",
    date: "2025-03-18",
    time: "6:30 PM",
    location: "North Region",
    attendees: 8,
    type: "build-session",
  },
  {
    id: "event-3",
    title: "Story Planning Meeting",
    description: "Planning the next story arc for the server",
    date: "2025-03-20",
    time: "7:00 PM",
    location: "Discord",
    attendees: 5,
    type: "meeting",
  },
]

// Mock data for activity
const activityData = [
  {
    id: "activity-1",
    user: {
      name: "Alex",
      avatar: "../images/avatar-placeholder.jpg",
      initials: "AX",
    },
    action: "completed task",
    target: "Fix server lag issues",
    timestamp: "10 minutes ago",
  },
  {
    id: "activity-2",
    user: {
      name: "Sarah",
      avatar: "../images/avatar-placeholder.jpg",
      initials: "SH",
    },
    action: "created character",
    target: "King Aldric",
    timestamp: "1 hour ago",
  },
  {
    id: "activity-3",
    user: {
      name: "Mike",
      avatar: "../images/avatar-placeholder.jpg",
      initials: "MK",
    },
    action: "updated story",
    target: "The Rise of the Ender Dragon",
    timestamp: "3 hours ago",
  },
  {
    id: "activity-4",
    user: {
      name: "John",
      avatar: "../images/avatar-placeholder.jpg",
      initials: "JD",
    },
    action: "assigned task",
    target: "Create NPC dialogue for quest",
    timestamp: "5 hours ago",
  },
  {
    id: "activity-5",
    user: {
      name: "Emma",
      avatar: "../images/avatar-placeholder.jpg",
      initials: "EM",
    },
    action: "scheduled event",
    target: "Server Launch Party",
    timestamp: "Yesterday",
  },
]

// Load tasks into the UI
function loadTasks() {
  const tasksList = document.getElementById("tasks-list")

  if (!tasksList) return

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
                            <div class="task-assignee">
                                <div class="task-assignee-avatar">
                                    <img src="${task.assignee.avatar}" alt="${task.assignee.name}">
                                </div>
                                <span>${task.assignee.name}</span>
                            </div>
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

// Load events into the UI
function loadEvents() {
  const eventsGrid = document.getElementById("events-grid")

  if (!eventsGrid) return

  let eventsHTML = ""

  if (eventsData.length === 0) {
    eventsHTML = '<div class="empty-state">No events found.</div>'
  } else {
    eventsData.forEach((event) => {
      const typeClass = getEventTypeClass(event.type)

      eventsHTML += `
                <div class="event-card">
                    <div class="event-header">
                        <div class="event-title-row">
                            <h3 class="event-title">${event.title}</h3>
                            <span class="badge ${typeClass}">${formatEventType(event.type)}</span>
                        </div>
                        <p class="event-description">${event.description}</p>
                    </div>
                    <div class="event-content">
                        <div class="event-details">
                            <div class="event-detail">
                                <i class="fas fa-calendar"></i>
                                <span>${formatDate(event.date)}</span>
                            </div>
                            <div class="event-detail">
                                <i class="fas fa-clock"></i>
                                <span>${event.time}</span>
                            </div>
                            <div class="event-detail">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${event.location}</span>
                            </div>
                            <div class="event-detail">
                                <i class="fas fa-users"></i>
                                <span>${event.attendees} attendees</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
    })
  }

  eventsGrid.innerHTML = eventsHTML
}

// Load activity into the UI
function loadActivity() {
  const activityList = document.getElementById("activity-list")

  if (!activityList) return

  let activityHTML = ""

  if (activityData.length === 0) {
    activityHTML = '<div class="empty-state">No activity found.</div>'
  } else {
    activityData.forEach((activity) => {
      activityHTML += `
                <div class="activity-item">
                    <div class="activity-avatar">
                        <img src="${activity.user.avatar}" alt="${activity.user.name}">
                    </div>
                    <div class="activity-content">
                        <p class="activity-text">
                            <strong>${activity.user.name}</strong> ${activity.action} 
                            <strong>"${activity.target}"</strong>
                        </p>
                        <p class="activity-time">${activity.timestamp}</p>
                    </div>
                </div>
            `
    })
  }

  activityList.innerHTML = activityHTML
}

// Helper functions
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

function getEventTypeClass(type) {
  switch (type) {
    case "server-event":
      return "badge-primary"
    case "build-session":
      return "badge-success"
    case "meeting":
      return "badge-warning"
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

function formatEventType(type) {
  switch (type) {
    case "server-event":
      return "Server Event"
    case "build-session":
      return "Build Session"
    case "meeting":
      return "Meeting"
    default:
      return type
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

