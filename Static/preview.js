document.addEventListener('DOMContentLoaded', function() {
    initProfileDropdown();

});

function initProfileDropdown() {
    const profileBtn = document.querySelector('.profile-btn');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (profileBtn && dropdownContent) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', function() {
            dropdownContent.style.display = 'none';
        });

        dropdownContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}
