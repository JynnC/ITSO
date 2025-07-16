// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the password toggle functionality
    initPasswordToggle();
    
    // You can add other login-related JavaScript functions here in the future
});

/**
 * Initializes the password visibility toggle functionality
 */
function initPasswordToggle() {
    // Get the password input and toggle button elements
    const passwordInput = document.getElementById('password');
    const toggleButton = document.querySelector('.toggle-password');
    
    // Only proceed if both elements exist
    if (passwordInput && toggleButton) {
        // Add click event listener to the toggle button
        toggleButton.addEventListener('click', function() {
            togglePasswordVisibility(passwordInput, toggleButton);
        });
    }
}

/**
 * Toggles the password field between visible and hidden states
 * @param {HTMLInputElement} passwordInput - The password input element
 * @param {HTMLElement} toggleButton - The toggle button element
 */
function togglePasswordVisibility(passwordInput, toggleButton) {
    const eyeIcon = toggleButton.querySelector('.eye-icon');
    
    if (passwordInput.type === 'password') {
        // Show password
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
        eyeIcon.setAttribute('title', 'Hide password');
    } else {
        // Hide password
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
        eyeIcon.setAttribute('title', 'Show password');
    }
}

