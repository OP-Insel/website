document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const currentUserJson = localStorage.getItem('minecraft_team_user');
  
  if (!currentUserJson) {
    // User is not logged in, redirect to login page
    window.location.href = 'index.html';
    return;
  }
  
  const currentUser = JSON.parse(currentUserJson);
  
  // Tab navigation
  const tabs = document.querySelectorAll('.tabs .tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const contentId = this.getAttribute('data-content');
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Show corresponding content
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(`${contentId}-content`).classList.add('active');
    });
  });
  
  // Modal tab navigation
  const modalTabs = document.querySelectorAll('.modal .tab');
  const modalTabContents = document.querySelectorAll('.modal-tab-content');
  
  modalTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const contentId = this.getAttribute('data-modal-content');
      
      // Update active tab
      modalTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Show corresponding content
      modalTabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(`${contentId}-content`).classList.add('active');
    });
  });
  
  // Generate demo user data
  const demoUsers = [
    {
      id: '1',
      name: 'Max Owner',
      username: 'MaxMC',
      rank: 'Owner',
      points: 750,
      joinedAt: '2023-01-15',
      nextDeadline: '2023-12-31',
      history: [
        { date: '2023-11-10', action: 'Added new team member', reason: 'Team expansion' }
      ]
    },
    {
      id: '2',
      name: 'Jane Doe',
      username: 'JaneDoeMC',
      rank: 'Co-Owner',
      points: 650,
      joinedAt: '2023-02-20',
      nextDeadline: '2023-12-15',
      history: [
        { date: '2023-11-05', action: 'Updated server rules', reason: 'Clarity improvements' }
      ]
    },
    {
      id: '3',
      name: 'Alex Admin',
      username: 'AlexMC',
      rank: 'Admin',
      points: 520,
      joinedAt: '2023-03-10',
      nextDeadline: '2023-12-20',
      history: [
        { date: '2023-11-08', action: 'Point deduction: -10', reason: 'Inactivity' }
      ]
    },
    {
      id: '4',
      name: 'Sam Builder',
      username: 'SamBuilds',
      rank: 'Builder',
      points: 320,
      joinedAt: '2023-05-15',
      nextDeadline: '2023-12-10',
      history: [
        { date: '2023-11-01', action: 'Completed project', reason: 'Main spawn area' }
      ]
    },
    {
      id: '5',
      name: 'Chris Support',
      username: 'ChrisSupport',
      rank: 'Supporter',
      points: 180,
      joinedAt: '2023-07-22',
      nextDeadline: '2023-12-05',
      history: [
        { date: '2023-11-03', action: 'Point deduction: -5', reason: 'Missed meeting' }
      ]
    },
    {
      id: '6',
      name: 'Emily Developer',
      username: 'EmilyDev',
      rank: 'Developer',
      points: 420,
      joinedAt: '2023-04-18',
      nextDeadline: '2023-12-25',
      history: [
        { date: '2023-11-07', action: 'Added new plugin', reason: 'Custom crafting system' }
      ]
    }
  ];
  
  // Save demo users to localStorage if not already there
  if (!localStorage.getItem('minecraft_team_users')) {
    localStorage.setItem('minecraft_team_users', JSON.stringify(demoUsers));
  }
  
  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('minecraft_team_users')) || demoUsers;
  
  // Render user cards
  const userGrid = document.getElementById('user-grid');
  
  function renderUsers() {
    userGrid.innerHTML = ''; // Clear existing cards
    
    users.forEach(user => {
      const card = document.createElement('div');
      card.className = 'user-card';
      card.dataset.userId = user.id;
      
      // Get rank color
      let rankColor;
      switch(user.rank) {
        case 'Owner':
          rankColor = 'background-color: black; color: white;';
          break;
        case 'Co-Owner':
          rankColor = 'background-color: #333; color: white;';
          break;
        case 'Admin':
        case 'Developer':
          rankColor = 'background-color: #555; color: white;';
          break;
        case 'Builder':
          rankColor = 'background-color: #777; color: white;';
          break;
        default:
          rankColor = 'background-color: #999; color: white;';
      }
      
      // Get mood emoji based on points
      let moodEmoji;
      if (user.points > 600) {
        moodEmoji = '😄';
      } else if (user.points > 400) {
        moodEmoji = '😊';
      } else if (user.points > 200) {
        moodEmoji = '😐';
      } else if (user.points > 100) {
        moodEmoji = '😟';
      } else {
        moodEmoji = '😰';
      }
      
      card.innerHTML = `
        <div class="user-card-header" style="${rankColor}">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3>${user.name}</h3>
            <span style="font-size: 1.5rem;" title="Mood based on points">${moodEmoji}</span>
          </div>
          <div style="font-size: 0.875rem; opacity: 0.9;">${user.rank}</div>
        </div>
        <div class="user-card-content">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 60px; height: 60px; border-radius: 0.375rem; overflow: hidden; border: 2px solid #444; position: relative;">
              <img src="https://mc-heads.net/avatar/${user.username}/100" alt="${user.username}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div>
              <div style="font-weight: 500;">${user.username}</div>
              <div style="font-size: 0.875rem; color: #9ca3af;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline; margin-right: 0.25rem;">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Joined: ${new Date(user.joinedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 0.875rem; color: #9ca3af;">Points</div>
              <div style="font-weight: 700; font-size: 1.25rem;">${user.points}</div>
            </div>
            
            <button class="button deduct-points-button" data-user-id="${user.id}" style="background-color: #ef4444; font-size: 0.875rem; padding: 0.375rem 0.75rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.25rem;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Deduct
            </button>
          </div>
        </div>
        <div class="user-card-footer">
          <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem;">
            <div style="display: flex; align-items: center; gap: 0.25rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              ${user.nextDeadline ? new Date(user.nextDeadline).toLocaleDateString() : 'No deadline'}
            </div>
            <div>
              <span style="color: #9ca3af;">${user.history.length} actions</span>
            </div>
          </div>
        </div>
      `;
      
      userGrid.appendChild(card);
    });
    
    // Add event listeners to user cards
    document.querySelectorAll('.user-card').forEach(card => {
      card.addEventListener('click', function() {
        const userId = this.dataset.userId;
        const user = users.find(u => u.id === userId);
        
        if (user) {
          showUserDetailsModal(user);
        }
      });
    });
    
    // Add event listeners to deduct points buttons
    document.querySelectorAll('.deduct-points-button').forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent card click
        
        const userId = this.dataset.userId;
        const user = users.find(u => u.id === userId);
        
        if (user) {
          showDeductPointsModal(user);
        }
      });
    });
  }
  
  renderUsers();
  
  // Add User Modal
  const addUserModal = document.getElementById('add-user-modal');
  const addUserButton = document.getElementById('add-user-button');
  
  addUserButton.addEventListener('click', function() {
    addUserModal.style.display = 'block';
  });
  
  // Close modals when clicking close button or outside
  document.querySelectorAll('.close-button, .cancel-button').forEach(button => {
    button.addEventListener('click', function() {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
      });
    });
  });
  
  window.addEventListener('click', function(e) {
    document.querySelectorAll('.modal').forEach(modal => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
  
  // Add User Form
  const addUserForm = document.getElementById('add-user-form');
  const saveAddUserButton = addUserModal.querySelector('.save-button');
  
  saveAddUserButton.addEventListener('click', function() {
    const name = document.getElementById('new-name').value;
    const username = document.getElementById('new-username').value;
    const rank = document.getElementById('new-rank').value;
    
    if (name && username) {
      const newUser = {
        id: Date.now().toString(),
        name,
        username,
        rank,
        points: rank === 'Jr. Supporter' ? 150 : 
                rank === 'Supporter' ? 200 : 
                rank === 'Jr. Moderator' ? 250 : 
                rank === 'Moderator' ? 300 : 
                rank === 'Builder' ? 200 : 
                rank === 'Developer' ? 250 : 
                rank === 'Jr. Admin' ? 400 : 
                rank === 'Admin' ? 500 : 750,
        joinedAt: new Date().toISOString(),
        nextDeadline: null,
        history: [
          {
            date: new Date().toISOString(),
            action: 'User added to team',
            reason: null
          }
        ]
      };
      
      users.push(newUser);
      localStorage.setItem('minecraft_team_users', JSON.stringify(users));
      
      renderUsers();
      addUserModal.style.display = 'none';
      addUserForm.reset();
    }
  });
  
  // User Details Modal
  const userDetailsModal = document.getElementById('user-details-modal');
  
  function showUserDetailsModal(user) {
    // Fill form with user data
    document.getElementById('edit-name').value = user.name;
    document.getElementById('edit-username').value = user.username;
    document.getElementById('edit-rank').value = user.rank;
    document.getElementById('edit-points').value = user.points;
    document.getElementById('edit-deadline').value = user.nextDeadline ? new Date(user.nextDeadline).toISOString().split('T')[0] : '';
    
    // Fill history list
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    if (user.history.length === 0) {
      historyList.innerHTML = '<p>No history records found</p>';
    } else {
      user.history.forEach(record => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        historyItem.innerHTML = `
          <div class="history-item-header">
            <div class="history-item-action">${record.action}</div>
            <div class="history-item-date">${new Date(record.date).toLocaleString()}</div>
          </div>
          ${record.reason ? `<div class="history-item-reason">${record.reason}</div>` : ''}
        `;
        
        historyList.appendChild(historyItem);
      });
    }
    
    // Show modal
    userDetailsModal.style.display = 'block';
    
    // Save button event
    const saveButton = userDetailsModal.querySelector('.save-button');
    saveButton.onclick = function() {
      const updatedUser = {
        ...user,
        name: document.getElementById('edit-name').value,
        username: document.getElementById('edit-username').value,
        rank: document.getElementById('edit-rank').value,
        points: parseInt(document.getElementById('edit-points').value),
        nextDeadline: document.getElementById('edit-deadline').value ? new Date(document.getElementById('edit-deadline').value).toISOString() : null
      };
      
      // Update user in array
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('minecraft_team_users', JSON.stringify(users));
        renderUsers();
      }
      
      userDetailsModal.style.display = 'none';
    };
    
    // Remove user button event
    const removeUserButton = document.getElementById('remove-user-button');
    removeUserButton.onclick = function() {
      if (confirm(`Are you sure you want to remove ${user.name} from the team?`)) {
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          users.splice(index, 1);
          localStorage.setItem('minecraft_team_users', JSON.stringify(users));
          renderUsers();
        }
        
        userDetailsModal.style.display = 'none';
      }
    };
  }
  
  // Deduct Points Modal
  const deductPointsModal = document.getElementById('deduct-points-modal');
  
  function showDeductPointsModal(user) {
    // Reset form
    document.getElementById('deduct-points').value = 5;
    document.getElementById('deduct-reason').value = '';
    
    // Show modal
    deductPointsModal.style.display = 'block';
    
    // Deduct button event
    const deductButton = deductPointsModal.querySelector('.danger-button');
    deductButton.onclick = function() {
      const points = parseInt(document.getElementById('deduct-points').value);
      const reason = document.getElementById('deduct-reason').value;
      
      if (points > 0 && reason) {
        // Update user points
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          const newPoints = Math.max(0, users[index].points - points);
          
          // Add history record
          users[index].history.unshift({
            date: new Date().toISOString(),
            action: `Point deduction: -${points}`,
            reason: reason
          });
          
          // Update points
          users[index].points = newPoints;
          
          localStorage.setItem('minecraft_team_users', JSON.stringify(users));
          renderUsers();
        }
        
        deductPointsModal.style.display = 'none';
      }
    };
  }
});
