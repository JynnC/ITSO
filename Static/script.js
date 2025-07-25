let documentsChartInstance = null;

document.addEventListener('DOMContentLoaded', function () {
    console.log("Script loaded!");


    fetch('/chart-data')
        .then(response => response.json())
        .then(data => {
            createDocumentsChart(data);
        })
        .catch(error => console.error('Error fetching chart data:', error));
    

    fetch('/department-data')
        .then(response => response.json())
        .then(data => {
            populateDepartmentTable(data);
        })
        .catch(error => console.error('Error fetching department data:', error));
    
    initProfileDropdown();
});

function initProfileDropdown() {
    const profileBtn = document.querySelector('.profile-btn');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (profileBtn && dropdownContent) {

        dropdownContent.style.display = 'none';
        
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isVisible = dropdownContent.style.display === 'block';
            dropdownContent.style.display = isVisible ? 'none' : 'block';
        });


        document.addEventListener('click', function() {
            dropdownContent.style.display = 'none';
        });


        dropdownContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    } else {
        console.error("Profile dropdown elements not found!");
    }
}


function createDocumentsChart(data) {
    const ctx = document.getElementById('documentsChart').getContext('2d');

    if (documentsChartInstance) {
        documentsChartInstance.destroy(); // 🔥 Destroy old chart
    }

    documentsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels.map(label => {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return monthNames[parseInt(label) - 1];
            }),
            datasets: [{
                label: 'Documents Encoded',
                data: data.values,
                backgroundColor: '#7AB3EF',
                borderColor: '#7AB3EF',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}


function populateDepartmentTable(data) {
    const tableBody = document.querySelector('.department-table tbody');
    tableBody.innerHTML = '';
    
    if (data && data.departments && data.departments.length > 0) {
        data.departments.forEach(dept => {
            const row = document.createElement('tr');
            

            const nameCell = document.createElement('td');
            nameCell.textContent = dept.name;
            row.appendChild(nameCell);
            
            const categories = ['Copyright', 'Patent', 'Trademark', 'Utility Model', 'Industrial Design'];
            
            categories.forEach(category => {
                const cell = document.createElement('td');

                cell.textContent = dept.counts[category] || 0;
                row.appendChild(cell);
            });
            

            const totalCell = document.createElement('td');
            totalCell.textContent = dept.total;
            row.appendChild(totalCell);
            
            tableBody.appendChild(row);
        });
    } else {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.setAttribute('colspan', '7');
        emptyCell.classList.add('no-data');
        emptyCell.textContent = 'No department data available';
        emptyRow.appendChild(emptyCell);
        tableBody.appendChild(emptyRow);
    }
}

