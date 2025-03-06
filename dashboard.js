document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const currentUserJson = localStorage.getItem('minecraft_team_user');
  
  if (!currentUserJson) {
    // User is not logged in, redirect to login page
    window.location.href = 'index.html';
    return;
  }
  
  const currentUser = JSON.parse(currentUserJson);
  
  // Update user info in sidebar
  document.getElementById('user-name').textContent = currentUser.displayName;
  document.getElementById('user-rank').textContent = currentUser.rank;
  document.getElementById('user-avatar').src = `https://mc-heads.net/avatar/${currentUser.username}/100`;
  
  // Logout functionality
  document.getElementById('logout-button').addEventListener('click', function() {
    localStorage.removeItem('minecraft_team_user');
    window.location.href = 'index.html';
  });
  
  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  
  themeToggle.addEventListener('click', function() {
    const iframe = document.getElementById('content-frame');
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
    
    if (iframeDocument.body) {
      iframeDocument.body.classList.toggle('light-mode');
      iframeDocument.body.classList.toggle('dark-mode');
    }
  });
  
  // Navigation
  const menuItems = document.querySelectorAll('.sidebar-menu-item');
  
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      // Update active menu item
      menuItems.forEach(mi => mi.classList.remove('active'));
      this.classList.add('active');
      
      // Load the corresponding page
      const page = this.getAttribute('data-page');
      document.getElementById('content-frame').src = page;
    });
  });
});
