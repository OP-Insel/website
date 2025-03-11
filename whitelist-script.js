document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("opInselLoggedIn")
  if (!isLoggedIn) {
    window.location.href = "login.html"
    return
  }

  // Check if user is owner (only owners can manage whitelist)
  const userRole = localStorage.getItem("opInselUserRole")
  if (userRole !== "owner") {
    showToast("error", "Zugriff verweigert", "Nur Server-Besitzer können die Whitelist verwalten.")
    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 3000)
    return
  }

  // Initialize whitelist data
  let whitelistData = [
    {
      id: "1",
      username: "MinecraftPro123",
      addedOn: "2025-03-01",
      addedBy: "Admin",
    },
    {
      id: "2",
      username: "BuilderKing",
      addedOn: "2025-03-05",
      addedBy: "Admin",
    },
    {
      id: "3",
      username: "RedstoneWizard",
      addedOn: "2025-03-08",
      addedBy: "Moderator",
    },
    {
      id: "4",
      username: "ExplorerGirl",
      addedOn: "2025-03-10",
      addedBy: "Admin",
    },
  ]

  // Load whitelist from localStorage if available
  const savedWhitelist = localStorage.getItem("opInselWhitelist")
  if (savedWhitelist) {
    whitelistData = JSON.parse(savedWhitelist)
  }

  // Render whitelist table
  renderWhitelistTable(whitelistData)

  // Add player button click handler
  const addPlayerBtn = document.getElementById("add-player-btn")
  const usernameInput = document.getElementById("username")

  addPlayerBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim()

    if (!username) {
      showToast("error", "Fehler", "Bitte gib einen Benutzernamen ein.")
      return
    }

    // Check if player already exists
    if (whitelistData.some((player) => player.username.toLowerCase() === username.toLowerCase())) {
      showToast("error", "Fehler", "Dieser Spieler ist bereits auf der Whitelist.")
      return
    }

    // Add new player
    const newPlayer = {
      id: Date.now().toString(),
      username: username,
      addedOn: new Date().toISOString().split("T")[0],
      addedBy: localStorage.getItem("opInselUserName") || "Admin",
    }

    whitelistData.push(newPlayer)

    // Save to localStorage
    localStorage.setItem("opInselWhitelist", JSON.stringify(whitelistData))

    // Re-render table
    renderWhitelistTable(whitelistData)

    // Clear input
    usernameInput.value = ""

    // Show success toast
    showToast("success", "Spieler hinzugefügt", `${username} wurde zur Whitelist hinzugefügt.`)
  })

  // Search functionality
  const searchInput = document.getElementById("search-input")

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase()

    if (searchTerm) {
      const filteredData = whitelistData.filter((player) => player.username.toLowerCase().includes(searchTerm))
      renderWhitelistTable(filteredData)
    } else {
      renderWhitelistTable(whitelistData)
    }
  })

  // Function to render whitelist table
  function renderWhitelistTable(data) {
    const tableBody = document.getElementById("whitelist-table-body")

    if (data.length === 0) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="whitelist-empty">
                        <i class="fas fa-users"></i>
                        <p>Keine Spieler gefunden.</p>
                    </td>
                </tr>
            `
      return
    }

    let html = ""

    data.forEach((player) => {
      html += `
                <tr>
                    <td>${player.username}</td>
                    <td>${formatDate(player.addedOn)}</td>
                    <td>${player.addedBy}</td>
                    <td>
                        <button class="btn btn-sm btn-outline btn-danger remove-player" data-id="${player.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `
    })

    tableBody.innerHTML = html

    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-player").forEach((button) => {
      button.addEventListener("click", () => {
        const playerId = button.getAttribute("data-id")
        removePlayer(playerId)
      })
    })
  }

  // Function to remove player
  function removePlayer(id) {
    const playerToRemove = whitelistData.find((player) => player.id === id)

    if (!playerToRemove) return

    // Remove player from data
    whitelistData = whitelistData.filter((player) => player.id !== id)

    // Save to localStorage
    localStorage.setItem("opInselWhitelist", JSON.stringify(whitelistData))

    // Re-render table
    renderWhitelistTable(whitelistData)

    // Show success toast
    showToast("success", "Spieler entfernt", `${playerToRemove.username} wurde von der Whitelist entfernt.`)
  }

  // Helper function to format date
  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Toast notification function
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

