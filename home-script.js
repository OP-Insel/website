// Set current year in footer
document.getElementById("current-year").textContent = new Date().getFullYear()

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    })
  })
})

// Check if user is logged in (for demo purposes)
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("opInselLoggedIn")
  const dashboardButton = document.querySelector('a[href="pages/dashboard.html"]')

  if (isLoggedIn === "true" && dashboardButton) {
    dashboardButton.textContent = "Continue to Dashboard"
  }
}

// Run on page load
window.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus()
})

