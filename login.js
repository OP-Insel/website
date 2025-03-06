document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const errorMessage = document.getElementById("error-message")
  const errorText = document.getElementById("error-text")
  const loginButton = document.getElementById("login-button")

  // Basic validation
  if (!email || !password) {
    errorText.textContent = "Bitte fülle alle Felder aus."
    errorMessage.classList.remove("hidden")
    return
  }

  // Disable button and show loading state
  loginButton.disabled = true
  loginButton.textContent = "Anmelden..."
  errorMessage.classList.add("hidden")

  // Simulate login - in a real app, this would be an API call
  setTimeout(() => {
    // Mock user data - in a real app, this would come from the server
    const userData = {
      name: "TestUser",
      minecraftName: "TestPlayer",
      email: email,
      rank: "Admin", // For testing admin features
      points: 450,
    }

    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(userData))

    // Redirect to dashboard
    window.location.href = "index.html"
  }, 1500)
})

// Check for dark mode preference
const savedTheme = localStorage.getItem("theme")
if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  document.documentElement.classList.add("dark")
}

