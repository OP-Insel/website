document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form")
  const registerButton = document.getElementById("register-button")
  const toast = document.getElementById("toast")

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form values
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirm-password").value

    // Validate passwords match
    if (password !== confirmPassword) {
      showToast("error", "Registrierung fehlgeschlagen", "Die Passwörter stimmen nicht überein.")
      return
    }

    // Disable button and show loading state
    registerButton.disabled = true
    registerButton.textContent = "Konto wird erstellt..."

    // Simulate API call
    setTimeout(() => {
      // Set user data
      localStorage.setItem("opInselLoggedIn", "true")
      localStorage.setItem("opInselUserRole", "user")
      localStorage.setItem("opInselUserName", name)

      showToast("success", "Registrierung erfolgreich", "Dein Konto wurde erstellt!")

      // Redirect after toast
      setTimeout(() => {
        window.location.href = "dashboard.html"
      }, 1000)
    }, 1500)
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

