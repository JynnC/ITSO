document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("documentsChart").getContext("2d");

    fetch("/chart-data")
        .then(response => response.json())
        .then(data => {
            new Chart(ctx, {
                type: "bar", 
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: "Documents Encoded",
                        data: data.values,
                        backgroundColor: "rgba(54, 162, 235, 0.5)", 
                        borderColor: "rgba(54, 162, 235, 1)", 
                        borderwidth: 1
                    }]
                }, 
                options: {
                    responsive: true,
                    scales: {y: {beginAtZero: true}}
                }
            });
        })
        .catch(error => console.error("Error fetching chart data: ", error));
});