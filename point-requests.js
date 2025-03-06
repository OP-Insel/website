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
  
  // Generate demo requests
  const demoRequests = [
    {
      id: '1',
      userId: '4', // Sam Builder
      requestedBy: '3', // Alex Admin
      requestedByUsername: 'Alex Admin',
      points: 10,
      reason: 'Missed team meeting without notice',
      status: 'pending',
      createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: '2',
      userId: '5', // Chris Support
      requestedBy: '3', // Alex Admin
      requestedByUsername: 'Alex Admin',
      points: 5,
      reason: 'Failed to complete assigned task on time',
      status: 'pending',
      createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    },
    {
      id: '3',
      userId: '6', // Emily Developer
      requestedBy: '3', // Alex Admin
      requestedByUsername: 'Alex Admin',
      points: 15,
      reason: 'Unauthorized changes to server configuration',
      status: 'pending',
      createdAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
    },
    {
      id: '4',
      userId: '3', // Alex Admin
      requestedBy: '5', // Chris Support
      requestedByUsername: 'Chris Support',
      points: 20,
      reason: 'Unfair treatment of players',
      status: 'approved',
      createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      reviewedBy: '1', // Max Owner
      reviewedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      reviewNote: 'Confirmed with multiple player reports'
    },
    {
      id: '5',
      userId: '4', // Sam Builder
      requestedBy: '6', // Emily Developer
      requestedByUsername: 'Emily Developer',
      points: 5,
      reason: 'Delayed project completion',
      status: 'rejected',
      createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
      reviewedBy: '2', // Jane Doe
      reviewedAt: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
      reviewNote: 'Delay was due to server issues, not Sam\'s fault'
    }
  ];
  
  // Save demo requests to localStorage if not already there
  if (!localStorage.getItem('minecraft_team_requests')) {
    localStorage.setItem('minecraft_team_requests', JSON.stringify(demoRequests));
  }
  
  // Get requests from localStorage
  const requests = JSON.parse(localStorage.getItem('minecraft_team_requests')) || demoRequests;
  
  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('minecraft_team_users')) || [];
  
  // Render requests
  function renderRequests() {
    const pendingGrid = document.getElementById('pending-requests');
    const approvedGrid = document.getElementById('approved-requests');
    const rejectedGrid = document.getElementById('rejected-requests');
    
    // Clear grids
    pendingGrid.innerHTML = '';
    approvedGrid.innerHTML = '';
    rejectedGrid.innerHTML = '';
    
    // Filter requests by status
    const pendingRequests = requests.filter(req => req.status === 'pending');
    const approvedRequests = requests.filter(req => req.status === 'approved');
    const rejectedRequests = requests.filter(req => req.status === 'rejected');
    
    // Render pending requests
    if (pendingRequests.length === 0) {
      pendingGrid.innerHTML = '<p class="empty-message">No pending requests</p>';
    } else {
      pendingRequests.forEach(request => {
        const targetUser = users.find(user => user.id === request.userId);
        const requestedBy = users.find(user => user.id === request.requestedBy);
        
        const card = document.createElement('div');
        card.className = 'request-card';
        card.dataset.requestId = request.id;
        
        card.innerHTML = `
          <div class="request-card-header">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <h3>Point Deduction Request</h3>
                <p style="font-size: 0.875rem; opacity: 0.7;">Requested on ${new Date(request.createdAt).toLocaleDateString()}</p>
              </div>
              <div class="request-badge pending">Pending</div>
            </div>
          </div>
          <div class="request-card-content">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid #444;">
                <img src="https://mc-heads.net/avatar/${targetUser?.username || 'Steve'}/100" alt="${targetUser?.name || 'User'}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div>
                <div style="font-weight: 500;">${targetUser?.name || 'Unknown User'}</div>
                <div style="font-size: 0.875rem; opacity: 0.7;">Current Points: ${targetUser?.points || 0}</div>
              </div>
            </div>
            
            <div style="background-color: #252525; padding: 0.75rem; border-radius: 0.25rem; margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-size: 0.875rem; font-weight: 500;">Requested Deduction:</span>
                <span style="color: #ef4444; font-weight: 600;">-${request.points} points</span>
              </div>
              <p style="font-size: 0.875rem;">${request.reason}</p>
            </div>
            
            <div style="font-size: 0.75rem; opacity: 0.7; display: flex; align-items: center; gap: 0.25rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Requested by ${requestedBy?.name || request.requestedByUsername} • ${new Date(request.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>
          <div class="request-card-footer">
            <button class="button outline-button reject-button" data-request-id="${request.id}">Reject</button>
            <button class="button review-button" data-request-id="${request.id}">Review</button>
          </div>
        `;
        
        pendingGrid.appendChild(card);
      });
      
      // Add event listeners to review buttons
      document.querySelectorAll('.review-button').forEach(button => {
        button.addEventListener('click', function() {
          const requestId = this.dataset.requestId;
          const request = requests.find(req => req.id === requestId);
          
          if (request) {
            showReviewModal(request);
          }
        });
      });
      
      // Add event listeners to reject buttons
      document.querySelectorAll('.reject-button').forEach(button => {
        button.addEventListener('click', function() {
          const requestId = this.dataset.requestId;
          const request = requests.find(req => req.id === requestId);
          
          if (request) {
            rejectRequest(request);
          }
        });
      });
    }
    
    // Render approved requests
    if (approvedRequests.length === 0) {
      approvedGrid.innerHTML = '<p class="empty-message">No approved requests</p>';
    } else {
      approvedRequests.forEach(request => {
        const targetUser = users.find(user => user.id === request.userId);
        const requestedBy = users.find(user => user.id === request.requestedBy);
        const reviewedBy = users.find(user => user.id === request.reviewedBy);
        
        const card = document.createElement('div');
        card.className = 'request-card';
        
        card.innerHTML = `
          <div class="request-card-header" style="background-color: rgba(16, 185, 129, 0.1);">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <h3>Point Deduction Request</h3>
                <p style="font-size: 0.875rem; opacity: 0.7;">Approved on ${new Date(request.reviewedAt).toLocaleDateString()}</p>
              </div>
              <div class="request-badge approved">Approved</div>
            </div>
          </div>
          <div class="request-card-content">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid #444;">
                <img src="https://mc-heads.net/avatar/${targetUser?.username || 'Steve'}/100" alt="${targetUser?.name || 'User'}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div>
                <div style="font-weight: 500;">${targetUser?.name || 'Unknown User'}</div>
                <div style="font-size: 0.875rem; opacity: 0.7;">Points Deducted: ${request.points}</div>
              </div>
            </div>
            
            <div style="background-color: #252525; padding: 0.75rem; border-radius: 0.25rem; margin-bottom: 1rem;">
              <div style="font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">Reason for deduction:</div>
              <p style="font-size: 0.875rem;">${request.reason}</p>
            </div>
            
            ${request.reviewNote ? `
              <div style="background-color: rgba(16, 185, 129, 0.1); padding: 0.75rem; border-radius: 0.25rem; margin-bottom: 1rem; border: 1px solid rgba(16, 185, 129, 0.2);">
                <div style="font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">Review note:</div>
                <p style="font-size: 0.875rem;">${request.reviewNote}</p>
              </div>
            ` : ''}
            
            <div style="font-size: 0.75rem; opacity: 0.7; display: flex; align-items: center; gap: 0.25rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Approved by ${reviewedBy?.name || 'Admin'}</span>
            </div>
          </div>
        `;
        
        approvedGrid.appendChild(card);
      });
    }
    
    // Render rejected requests
    if (rejectedRequests.length === 0) {
      rejectedGrid.innerHTML = '<p class="empty-message">No rejected requests</p>';
    } else {
      rejectedRequests.forEach(request => {
        const targetUser = users.find(user => user.id === request.userId);
        const requestedBy = users.find(user => user.id === request.requestedBy);
        const reviewedBy = users.find(user => user.id === request.reviewedBy);
        
        const card = document.createElement('div');
        card.className = 'request-card';
        
        card.innerHTML = `
          <div class="request-card-header" style="background-color: rgba(239, 68, 68, 0.1);">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <h3>Point Deduction Request</h3>
                <p style="font-size: 0.875rem; opacity: 0.7;">Rejected on ${new Date(request.reviewedAt).toLocaleDateString()}</p>
              </div>
              <div class="request-badge rejected">Rejected</div>
            </div>
          </div>
          <div class="request-card-content">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid #444;">
                <img src="https://mc-heads.net/avatar/${targetUser?.username || 'Steve'}/100" alt="${targetUser?.name || 'User'}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div>
                <div style="font-weight: 500;">${targetUser?.name || 'Unknown User'}</div>
                <div style="font-size: 0.875rem; opacity: 0.7;">Requested Deduction: ${request.points} points</div>
              </div>
            </div>
            
            <div style="background-color: #252525; padding: 0.75rem; border-radius: 0.25rem; margin-bottom: 1rem;">
              <div style="font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">Reason for request:</div>
              <p style="font-size: 0.875rem;">${request.reason}</p>
            </div>
            
            ${request.reviewNote ? `
              <div style="background-color: rgba(239, 68, 68, 0.1); padding: 0.75rem; border-radius: 0.25rem; margin-bottom: 1rem; border: 1px solid rgba(239, 68, 68, 0.2);">
                <div style="font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">
