document.getElementById('add-more-file').addEventListener('click', function() {
    let container = document.querySelector(".file-container");

    let newFileSet = document.createElement("div");
    newFileSet.classList.add('file-upload-set');
    newFileSet.innerHTML = `
        <label for="filename">File Name</label>
        <input type="text" name="filename[]" placeholder="Enter File Name">

        <label for="destination">Select Destination</label>
        <select name="destination[]" required>
            <option value="" disabled selected>Select Destination</option>
            <option value="Copyright">Copyright</option>
            <option value="Trademark">Trademark</option>
            <option value="Patent">Patent</option>
            <option value="Model">Utility Model</option>
            <option value="Design">Industrial Design</option>
        </select>

        <label for="file">Upload File</label>
        <div class="drag-drop">
            <p>Drag and Drop file here or <span class="browse-text">Browse Files</span></p>
            <input type="file" name="file[]" class="file-input" required>
            <div class="file-display"></div> <!-- Added file display div -->
        </div>

        <button type="button" class="remove-file-set">X</button>
        <hr>
    `;

    container.appendChild(newFileSet);

    // Add file display functionality to the new file input
    const fileInput = newFileSet.querySelector('.file-input');
    fileInput.addEventListener('change', handleFileSelection);

    const removeButton = newFileSet.querySelector('.remove-file-set');
    removeButton.addEventListener('click', function() {
        newFileSet.remove();
    });

    initProfileDropdown();
});

// Function to handle file selection and display
function handleFileSelection(e) {
    const fileDisplay = this.closest('.drag-drop').querySelector('.file-display');
    fileDisplay.innerHTML = ''; // Clear previous files
    
    if (this.files.length > 0) {
        const fileList = document.createElement('ul');
        fileList.style.marginTop = '10px';
        fileList.style.paddingLeft = '20px';
        
        Array.from(this.files).forEach(file => {
            const listItem = document.createElement('li');
            listItem.textContent = `${file.name} (${(file.size/1024).toFixed(2)} KB)`;
            listItem.style.fontSize = '0.9em';
            listItem.style.color = '#1666BA';
            fileList.appendChild(listItem);
        });
        
        fileDisplay.appendChild(fileList);
    }
}

// Initialize file display for existing file inputs on page load
document.addEventListener('DOMContentLoaded', function() {
    const fileInputs = document.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', handleFileSelection);
    });

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