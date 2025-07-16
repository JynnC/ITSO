document.addEventListener('DOMContentLoaded', function() {
    // Initialize password toggle functionality for both fields
    initPasswordToggle('password');
    initPasswordToggle('confirm-password');
    
    // You can add other register-specific JavaScript here
});

function initPasswordToggle(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleButton = passwordInput?.nextElementSibling;
    
    if (passwordInput && toggleButton) {
        toggleButton.addEventListener('click', function() {
            togglePasswordVisibility(fieldId);
        });
    }
}

function togglePasswordVisibility(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const eyeIcon = passwordInput.nextElementSibling.querySelector('.eye-icon');
    
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