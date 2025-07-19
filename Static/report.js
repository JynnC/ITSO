document.addEventListener("DOMContentLoaded", function () {

    const chartDataElement = document.getElementById('chart-data');
    let chartData = chartDataElement ? JSON.parse(chartDataElement.textContent) : {};

    if (!chartData || typeof chartData !== 'object') {
        console.log("No initial chart data, will fetch from API");

        fetchReportData();
    } else {
        console.log('Using initial chart data from server');
        updateCharts(chartData);

        if (chartData.tableData) {
            updateReportTable(chartData.tableData);
        }
    }

    //Fetch Report Data
    function fetchReportData() {
        const filterData = {
            startDate: document.getElementById('startDate') ? document.getElementById('startDate').value : '',
            endDate: document.getElementById('endDate') ? document.getElementById('endDate').value : '',
            status: document.getElementById('status') ? document.getElementById('status').value : 'All',
            category: document.getElementById('category') ? document.getElementById('category').value : 'All',
            type: document.getElementById('type') ? document.getElementById('type').value : 'All',
            author: document.getElementById('author') ? document.getElementById('author').value : '',
            department: document.getElementById('department') ? document.getElementById('department').value : 'All'
        };

        fetch('/api/filter-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filterData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.tableData) {
                updateReportTable(data.tableData);
            }
            if (data.chartData) {
                updateCharts(data.chartData);
            }
        })
        .catch(error => {
            console.error('Error fetching report data:', error);
            alert('Failed to fetch report data. Please try again.');
        });
    }


    function updateReportTable(tableData) {
        const tableBody = document.querySelector('#reportTable tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        tableData.forEach(row => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${row.name}</td>
                <td>${row.total_documents} Documents</td>
                <td>${row.expired_documents} Documents</td>
                <td>${row.approved}</td>
                <td>${row.pending}</td>
                <td>${row.rejected}</td>
                <td>${row.approval_rate}%</td>
                <td>${row.rejection_rate}%</td>
                <td>${row.avg_processing_time} days</td>
                <td>${row.avg_processing_time} days</td>
            `;
            
            tableBody.appendChild(tr);
        });
    }


    function updateCharts(chartData) {
        console.log("Raw API chart data:", chartData);

        const finalChartData = {
            lineChart: {
                labels: chartData.categories || [],
                approved: chartData.approvalRate || [],
                rejected: chartData.rejectionRate || []
            },
            pieChart: {
                labels: ['Approved', 'Pending', 'Rejected'],
                data: [
                    chartData.approved || 0, 
                    chartData.pending || 0, 
                    chartData.rejected || 0
                ]
            }
        };
    

        updateLineChart(finalChartData.lineChart);
        

        updatePieChart(finalChartData.pieChart);
    }


    function updateLineChart(data) {
        const lineChartContext = document.getElementById('lineChart').getContext('2d');
        if (window.lineChart && window.lineChart.destroy) {
            window.lineChart.destroy();
        }
        window.lineChart = new Chart(lineChartContext, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Average Approval Rate',
                        data: data.approved,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        tension: 0.1,
                        fill: true
                    },
                    {
                        label: 'Average Rejection Rate',
                        data: data.rejected,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        tension: 0.1,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        stacked: false
                    }
                }
            }
        });
    }


    function updatePieChart(data) {
        const pieChartContext = document.getElementById('pieChart').getContext('2d');
        if (window.pieChart && window.pieChart.destroy) {
            window.pieChart.destroy();
        }
        window.pieChart = new Chart(pieChartContext, {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Document Status',
                    data: data.data,
                    backgroundColor: ['#4B86B4', '#6FA9D5', '#A9CBEF'],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            }
        });
    }


    function resetFilters() {
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        document.getElementById('status').value = 'All';
        document.getElementById('type').value = 'All';
        document.getElementById('category').value = 'All';
        document.getElementById('author').value = '';
        document.getElementById('department').value = 'All';
    }

    document.getElementById('exportWordBtn').addEventListener('click', function(e) {
        e.preventDefault();
        exportToWord();
    });

    function exportToWord() {
        console.log("Preparing Word document with charts");
        

        const lineChartBase64 = document.getElementById('lineChart').toDataURL('image/png').split(',')[1];
        const pieChartBase64 = document.getElementById('pieChart').toDataURL('image/png').split(',')[1];
        

        const tableData = [];
        const tableRows = document.querySelectorAll('#reportTable tbody tr');
        tableRows.forEach(row => {
            const rowData = {};
            rowData.category = row.cells[0].textContent;
            rowData.total_documents = parseInt(row.cells[1].textContent);
            rowData.expired_documents = parseInt(row.cells[2].textContent);
            rowData.approved = parseInt(row.cells[3].textContent);
            rowData.pending = parseInt(row.cells[4].textContent);
            rowData.rejected = parseInt(row.cells[5].textContent);
            rowData.approval_rate = parseFloat(row.cells[6].textContent);
            rowData.rejection_rate = parseFloat(row.cells[7].textContent);
            rowData.avg_processing_time_a = row.cells[8].textContent;
            rowData.avg_processing_time_r = row.cells[9].textContent;
            tableData.push(rowData);
        });
        

        const reportData = {
            lineChartImage: lineChartBase64,
            pieChartImage: pieChartBase64,
            tableData: tableData
        };
        

        fetch('/generate_word_report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reportData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            const date = new Date().toISOString().slice(0, 10);
            a.href = url;
            a.download = `ip_report_${date}.docx`;
            document.body.appendChild(a);
            a.click();
            

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Error generating Word document:', error);
            alert('Failed to generate Word document. Please try again.');
        });
    }
    
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