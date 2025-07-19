
document.addEventListener('DOMContentLoaded', function() {

    const viewButtons = document.querySelectorAll('.view-document-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const documentId = row.cells[0].textContent.trim();
            window.location.href = `/view-document/${documentId}`;
        });
    });
    

    let currentDocumentId = null;
    

    document.querySelectorAll('.edit-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const row = this.closest('tr');
            const documentId = row.querySelector('td:first-child').textContent.trim();
            const title = row.querySelector('td:nth-child(2)').textContent.trim();
            const category = row.querySelector('td:nth-child(3)').textContent.trim();
            const department = row.querySelector('td:nth-child(4)').textContent.trim();
            const authors = row.querySelector('td:nth-child(5)').textContent.trim();
            const status = row.querySelector('td:nth-child(6) select').value;
            const submissionDate = row.querySelector('td:nth-child(7)').textContent.trim();
            const expirationDate = row.querySelector('td:nth-child(8)').textContent.trim();
            

            currentDocumentId = documentId;
            

            document.getElementById('edit-title').value = title;
            document.getElementById('edit-category').value = category;
            

            const departmentSelect = document.getElementById('edit-department');
            if (departmentSelect) {

                let optionExists = false;
                for (let i = 0; i < departmentSelect.options.length; i++) {
                    if (departmentSelect.options[i].value === department) {
                        optionExists = true;
                        break;
                    }
                }
                
                if (!optionExists && department) {
                    const newOption = new Option(department, department);
                    departmentSelect.add(newOption);
                }
                
                departmentSelect.value = department;
            }
            
            document.getElementById('edit-authors').value = authors;
            document.getElementById('edit-status').value = status;
            

            const formatDateForInput = (dateStr) => {
                if (!dateStr) return '';
                try {
                    const [day, month, year] = dateStr.split('/');
                    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                } catch (e) {

                    return dateStr;
                }
            };
            
            document.getElementById('edit-submission-date').value = formatDateForInput(submissionDate);
            document.getElementById('edit-expiration-date').value = formatDateForInput(expirationDate);
            

            document.getElementById('edit-document-modal').style.display = 'block';
        });
    });
    

    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('edit-document-modal').style.display = 'none';
    });
    

    window.addEventListener('click', function(event) {
        const modal = document.getElementById('edit-document-modal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
    

    document.getElementById('edit-document-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = {
            title: document.getElementById('edit-title').value,
            category: document.getElementById('edit-category').value,
            department: document.getElementById('edit-department').value,
            authors: document.getElementById('edit-authors').value,
            status: document.getElementById('edit-status').value,
            submission_date: document.getElementById('edit-submission-date').value,
            expiration_date: document.getElementById('edit-expiration-date').value
        };
        

        fetch(`/update-document/${currentDocumentId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {

                document.getElementById('edit-document-modal').style.display = 'none';
                

                const rows = document.querySelectorAll('.document-table tbody tr');
                for (const row of rows) {
                    const id = row.querySelector('td:first-child').textContent.trim();
                    if (id === currentDocumentId) {
                        row.querySelector('td:nth-child(2)').textContent = formData.title;
                        row.querySelector('td:nth-child(3)').textContent = formData.category;
                        row.querySelector('td:nth-child(4)').textContent = formData.department;
                        row.querySelector('td:nth-child(5)').textContent = formData.authors;
                        row.querySelector('td:nth-child(6) select').value = formData.status;
                        

                        const formatDateForDisplay = (dateStr) => {
                            if (!dateStr) return '';
                            try {
                                const date = new Date(dateStr);
                                return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                            } catch (e) {
                                return dateStr;
                            }
                        };
                        
                        row.querySelector('td:nth-child(6)').textContent = formatDateForDisplay(formData.submission_date);
                        row.querySelector('td:nth-child(7)').textContent = formatDateForDisplay(formData.expiration_date);
                        break;
                    }
                }
                

                alert('Document updated successfully!');
            } else {
                alert('Failed to update document: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the document');
        });
    });



    document.querySelectorAll('.status-dropdown').forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            const row = this.closest('tr');
            const documentId = row.querySelector('td:first-child').textContent.trim();
            const newStatus = this.value;

            console.log(`Sending status update to: /update_status for document ${documentId}`);
            
            fetch('/document-status-update', {  
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    document_id: documentId,
                    status: newStatus 
                })
            })

            .then(response => response.json())
            .then(data => {
                if (data.success) {

                    alert(`Status updated to ${newStatus}`);
                } else {

                    alert('Failed to update status: ' + (data.message || 'Unknown error'));

                    this.value = this.getAttribute('data-previous-value');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while updating status');

                this.value = this.getAttribute('data-previous-value');
            });
            

            this.setAttribute('data-previous-value', newStatus);
        });
        

        dropdown.setAttribute('data-previous-value', dropdown.value);
    });



    document.querySelector('.register-btn').addEventListener('click', function() {
        window.location.href = '/encode';
    });


    const searchBox = document.querySelector('.search-box');
    searchBox.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const tableRows = document.querySelectorAll('.document-table tbody tr');
        
        tableRows.forEach(row => {
            const title = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const authors = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            const category = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || authors.includes(searchTerm) || category.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });


    const filterSelects = document.querySelectorAll('.filters select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            applyFilters();
        });
    });

    function applyFilters() {

        const status = document.getElementById('status')?.value || 'all';
        const category = document.getElementById('category')?.value || 'all';
        const department = document.getElementById('department')?.value || 'all';
        
        console.log("Applying filters:", {status, category, department}); // Debugging
        

        let queryParams = new URLSearchParams();
        
        if (status !== 'all') queryParams.append('status', status);
        if (category !== 'all') queryParams.append('category', category);
        if (department !== 'all') queryParams.append('department', department);
        

        window.location.href = '/tables?' + queryParams.toString();
    }


document.querySelectorAll('.delete-icon').forEach(icon => {
    icon.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering other click events
        
        const documentId = this.getAttribute('data-document-id');
        

        if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {

            this.classList.add('loading');
            
            fetch(`/delete-document/${documentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then(data => {
                if (data.success) {

                    const row = this.closest('tr');
                    row.style.transition = 'all 0.3s';
                    row.style.opacity = '0';
                    

                    setTimeout(() => {
                        row.remove();

                        showToast('Document deleted successfully');
                    }, 300);
                } else {
                    throw new Error(data.message || 'Failed to delete document');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Error deleting document: ' + error.message, 'error');
                this.classList.remove('loading');
            });
        }
    });
});


function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

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
