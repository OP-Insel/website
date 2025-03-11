document.addEventListener("DOMContentLoaded", () => {
  const serverStatusBadge = document.getElementById("server-status-badge")
  const playerCount = document.getElementById("player-count")
  const playerProgress = document.getElementById("player-progress")
  const statusTimestamp = document.getElementById("status-timestamp")
  const refreshButton = document.getElementById("refresh-status")

  // Initial server status update
  updateServerStatus()

  // Refresh button click handler
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

  // Auto-refresh every 5 minutes
  setInterval(updateServerStatus, 5 * 60 * 1000)

  function updateServerStatus() {
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
})

