document.addEventListener('DOMContentLoaded', function () {
    initProfileDropdown();
    initTabFunctionality();
    initVerifyButtons();
    initActionDropdowns();
    initUserActions();
});

function initProfileDropdown() {
    const profileBtn = document.querySelector('.profile-btn');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (profileBtn && dropdownContent) {
        profileBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', function () {
            dropdownContent.style.display = 'none';
        });

        dropdownContent.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }
}

function initTabFunctionality() {
    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', function () {
            openTab(this.getAttribute('onclick').replace("openTab('", "").replace("')", ""));
        });
    }
}

function openTab(tabId) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }

    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }

    document.getElementById(tabId).classList.add('active');

    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].getAttribute('onclick').includes(tabId)) {
            tabs[i].classList.add('active');
        }
    }
}

// Initialize dropdown menus for action buttons
function initActionDropdowns() {
    const dropdownButtons = document.querySelectorAll('.dropdown .edit-btn');
    
    dropdownButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Close all other dropdowns first
            document.querySelectorAll('.dropdown.active').forEach(activeDropdown => {
                if (activeDropdown !== this.parentElement) {
                    activeDropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            this.parentElement.classList.toggle('active');
        });
    });
    
    // Close all dropdowns when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
}

function initVerifyButtons() {
    document.querySelectorAll('.verify-btn').forEach(button => {
        button.addEventListener('click', async function() {
            const userId = this.dataset.userId;
            console.log(`Attempting to verify user ${userId}`);  // Debug
            
            try {
                const response = await fetch('/verify_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: userId })
                });

                // First check if response is JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error("Non-JSON response:", text);
                    throw new Error("Server returned unexpected format");
                }

                const data = await response.json();
                console.log("Response data:", data);  // Debug
                
                if (data.success) {
                    // Update UI with proper status badge
                    const row = this.closest('tr');
                    const statusCell = row.querySelector('td:nth-child(5)');
                    
                    // Clear the cell and add the badge with proper styling
                    statusCell.innerHTML = '<span class="status-badge verified">Verified</span>';
                    
                    // Replace the verify button with a verified button
                    const actionCell = row.querySelector('td.action-buttons');
                    const verifyBtn = actionCell.querySelector('.verify-btn');
                    
                    // Create new verified button (disabled)
                    const verifiedBtn = document.createElement('button');
                    verifiedBtn.className = 'action-icon verified-btn';
                    verifiedBtn.disabled = true;
                    verifiedBtn.title = 'User Verified';
                    
                    // Create SVG fallback for when image is not found
                    const fallbackSVG = 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' width=\'24\' height=\'24\'><path fill=\'%234CAF50\' d=\'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z\'/></svg>';
                    
                    // Create image element with fallback
                    const img = document.createElement('img');
                    img.src = '/static/verified_icon.png';
                    img.alt = 'Verified';
                    img.onerror = function() { this.src = fallbackSVG; };
                    
                    verifiedBtn.appendChild(img);
                    
                    // Replace the verify button with the verified button
                    actionCell.replaceChild(verifiedBtn, verifyBtn);
                    
                    alert('User verified successfully!');
                } else {
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Full error:', error);
                alert(`Failed to verify user: ${error.message}`);
            }
        });
    });
}

function initUserActions() {
    // Pause user action
    document.querySelectorAll('.pause-user-action').forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault();
            const userId = this.dataset.userId;
            
            if (confirm(`Are you sure you want to pause this user?`)) {
                try {
                    const response = await fetch('/pause_user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user_id: userId
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        // Update the UI
                        const row = this.closest('tr');
                        const statusCell = row.querySelector('td:nth-child(5)');
                        
                        // Remove any existing status badges
                        const existingBadges = statusCell.querySelectorAll('.status-badge');
                        existingBadges.forEach(badge => badge.remove());
                        
                        // Add the new paused badge
                        statusCell.innerHTML = '<span class="status-badge paused">Paused</span>';
                        
                        // Update the dropdown menu to show Reactivate instead of Pause
                        const dropdownMenu = this.closest('.dropdown-menu');
                        dropdownMenu.innerHTML = dropdownMenu.innerHTML.replace(
                            '<a href="#" class="pause-user-action" data-user-id="' + userId + '">Pause</a>',
                            '<a href="#" class="reactivate-user-action" data-user-id="' + userId + '">Reactivate</a>'
                        );
                        
                        // Re-initialize the action listeners for the new reactivate button
                        initUserActions();
                        
                        alert('User paused successfully!');
                    } else {
                        alert(`Error: ${data.message}`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Failed to pause user');
                }
            }
        });
    });
    
    // Reactivate user action
    document.querySelectorAll('.reactivate-user-action').forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault();
            const userId = this.dataset.userId;
            
            if (confirm(`Are you sure you want to reactivate this user?`)) {
                try {
                    const response = await fetch('/reactivate_user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user_id: userId
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        // Update the UI
                        const row = this.closest('tr');
                        const statusCell = row.querySelector('td:nth-child(5)');
                        
                        // Remove any existing status badges
                        const existingBadges = statusCell.querySelectorAll('.status-badge');
                        existingBadges.forEach(badge => badge.remove());
                        
                        // Add the new verified badge
                        statusCell.innerHTML = '<span class="status-badge verified">Verified</span>';
                        
                        // Update the dropdown menu to show Pause instead of Reactivate
                        const dropdownMenu = this.closest('.dropdown-menu');
                        dropdownMenu.innerHTML = dropdownMenu.innerHTML.replace(
                            '<a href="#" class="reactivate-user-action" data-user-id="' + userId + '">Reactivate</a>',
                            '<a href="#" class="pause-user-action" data-user-id="' + userId + '">Pause</a>'
                        );
                        
                        // Re-initialize the action listeners for the new pause button
                        initUserActions();
                        
                        alert('User reactivated successfully!');
                    } else {
                        alert(`Error: ${data.message}`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Failed to reactivate user');
                }
            }
        });
    });
    
    // Delete user action
    document.querySelectorAll('.delete-user-action').forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault();
            const userId = this.dataset.userId;
            
            if (confirm(`WARNING: This will permanently delete the user. Are you sure?`)) {
                try {
                    const response = await fetch('/delete_user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user_id: userId
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        // Remove the row from the table
                        this.closest('tr').remove();
                        alert('User deleted successfully!');
                    } else {
                        alert(`Error: ${data.message}`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Failed to delete user');
                }
            }
        });
    });
}