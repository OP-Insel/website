document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form")
  const loginButton = document.getElementById("login-button")
  const toast = document.getElementById("toast")

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form values
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    // Disable button and show loading state
    loginButton.disabled = true
    loginButton.textContent = "Anmeldung..."

    // Simulate API call
    setTimeout(() => {
      // Check if owner credentials
      if (email === "admin@opinsel.de" && password === "OPInsel2025!") {
        // Set owner data
        localStorage.setItem("opInselLoggedIn", "true")
        localStorage.setItem("opInselUserRole", "owner")
        localStorage.setItem("opInselUserName", "Admin")

        showToast("success", "Besitzer-Login erfolgreich", "Willkommen zurück, Admin!")

        // Redirect after toast
        setTimeout(() => {
          window.location.href = "dashboard.html"
        }, 1000)
      } else if (email && password) {
        // Set regular user data
        localStorage.setItem("opInselLoggedIn", "true")
        localStorage.setItem("opInselUserRole", "user")
        localStorage.setItem("opInselUserName", email.split("@")[0])

        showToast("success", "Login erfolgreich", "Willkommen zurück bei OP Insel!")

        // Redirect after toast
        setTimeout(() => {
          window.location.href = "dashboard.html"
        }, 1000)
      } else {
        // Show error
        showToast("error", "Login fehlgeschlagen", "Bitte überprüfe deine Anmeldedaten.")
        loginButton.disabled = false
        loginButton.textContent = "Anmelden"
      }
    }, 1000)
  })

  function showToast(type, title, message) {
    // Set toast content
    document.querySelector(".toast-title").textContent = title
    document.querySelector(".toast-description").textContent = message

    // Set toast type
    toast.className = "toast"
    if (type === "error") {
      toast.classList.add("error")
      document.querySelector(".toast-icon").className = "fas fa-times-circle toast-icon"
    } else {
      document.querySelector(".toast-icon").className = "fas fa-check-circle toast-icon"
    }

    // Show toast
    toast.classList.add("show")

    // Hide toast after animation
    setTimeout(() => {
      toast.classList.remove("show")
    }, 3000)
  }
})

