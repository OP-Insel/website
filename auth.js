document.addEventListener('DOMContentLoaded', function() {
  // Check if user is already logged in
  const currentUser = localStorage.getItem('minecraft_team_user');
  
  if (currentUser) {
    // User is already logged in, redirect to dashboard
    window.location.href = 'dashboard.html';
  }
  
  // Handle login form submission
  document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // For demo purposes, check if username is one of the demo users
    const validUsernames = ['MaxMC', 'JaneDoeMC', 'AlexMC', 'SamBuilds', 'ChrisSupport', 'EmilyDev'];
    
    if (validUsernames.includes(username) && password.length > 0) {
      // Create user object
      const user = {
        username: username,
        displayName: username === 'MaxMC' ? 'Max Owner' : 
                    username === 'JaneDoeMC' ? 'Jane Doe' : 
                    username === 'AlexMC' ? 'Alex Admin' : 
                    username === 'SamBuilds' ? 'Sam Builder' : 
                    username === 'ChrisSupport' ? 'Chris Support' : 'Emily Developer',
        rank: username === 'MaxMC' ? 'Owner' : 
              username === 'JaneDoeMC' ? 'Co-Owner' : 
              username === 'AlexMC' ? 'Admin' : 
              username === 'SamBuilds' ? 'Builder' : 
              username === 'ChrisSupport' ? 'Supporter' : 'Developer',
        permissions: username === 'MaxMC' || username === 'JaneDoeMC' ? 
                    ['manage_users', 'manage_points', 'approve_requests', 'manage_story'] : 
                    username === 'AlexMC' ? 
                    ['manage_users', 'suggest_points', 'manage_story'] : 
                    ['suggest_points']
      };
      
      // Store user in localStorage
      localStorage.setItem('minecraft_team_user', JSON.stringify(user));
      
      // Redirect to dashboard
      window.location.href = 'dashboard.html';
    } else {
      // Show error message
      document.getElementById('error-message').style.display = 'block';
    }
  });
});
