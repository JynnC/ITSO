
document.addEventListener('DOMContentLoaded', function() {

    initPasswordToggle();
    

});

/**
 * Initializes the password visibility toggle functionality
 */
function initPasswordToggle() {

    const passwordInput = document.getElementById('password');
    const toggleButton = document.querySelector('.toggle-password');
    

    if (passwordInput && toggleButton) {

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

        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
        eyeIcon.setAttribute('title', 'Hide password');
    } else {

        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
        eyeIcon.setAttribute('title', 'Show password');
    }
}

