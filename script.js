// Simulated user profiles with explicit spend limits and per-game weekly spend
const userProfiles = {
    user1: {
        name: "Alice",
        leimRating: "green", // Low Risk
        weeklyLimit: 250,
        weeklyGameSpend: [
            [10, 15, 5, 20, 0, 0, 0, 0, 0], // Week 1
            [10, 20, 10, 15, 5, 0, 0, 0, 0], // Week 2
            [5, 10, 5, 10, 10, 0, 0, 0, 0],  // Week 3
            [10, 15, 20, 25, 0, 0, 0, 0, 0], // Week 4
        ],
    },
    user2: {
        name: "Bob",
        leimRating: "amber", // Medium Risk
        weeklyLimit: 500,
        weeklyGameSpend: [
            [20, 30, 40, 50, 10, 0, 0, 0, 0], // Week 1
            [30, 40, 50, 60, 20, 0, 0, 0, 0], // Week 2
            [40, 50, 60, 30, 0, 0, 0, 0, 0],  // Week 3
            [50, 60, 70, 40, 0, 0, 0, 0, 0],  // Week 4
        ],
    },
    user3: {
        name: "Charlie",
        leimRating: "red", // High Risk
        weeklyLimit: 1000,
        weeklyGameSpend: [
            [50, 60, 70, 80, 90, 0, 0, 0, 0], // Week 1
            [60, 70, 80, 90, 100, 0, 0, 0, 0], // Week 2
            [70, 80, 90, 100, 110, 0, 0, 0, 0], // Week 3
            [80, 90, 100, 110, 120, 0, 0, 0, 0], // Week 4
        ],
    },
    user4: {
        name: "Dave",
        leimRating: "black", // Very High Risk
        weeklyLimit: 2000,
        weeklyGameSpend: [
            [100, 120, 150, 200, 0, 0, 0, 0, 0], // Week 1
            [110, 130, 160, 210, 0, 0, 0, 0, 0], // Week 2
            [120, 140, 170, 220, 0, 0, 0, 0, 0], // Week 3
            [130, 150, 180, 230, 0, 0, 0, 0, 0], // Week 4
        ],
    },
};

// Current user profile (default to user1)
let currentUser = userProfiles.user1;

// Chart instance
let spendChart = null;

// Generate chart configuration
function generateChartConfig() {
    const totalWeeklySpend = currentUser.weeklyGameSpend.map((weekSpend) =>
        weekSpend.reduce((a, b) => a + b, 0)
    );

    return {
        type: "bar",
        data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [
                {
                    data: totalWeeklySpend,
                    backgroundColor: "rgba(0, 123, 255, 0.6)",
                    borderColor: "rgba(0, 123, 255, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: "#555",
                    },
                    grid: {
                        display: false,
                    },
                },
                y: {
                    ticks: {
                        display: false,
                    },
                    grid: {
                        display: false,
                    },
                    suggestedMax: Math.max(...totalWeeklySpend) + 20,
                    beginAtZero: true,
                },
            },
        },
    };
}

// Update Profile Card Information
function updateProfileCard() {
    const profileCard = document.querySelector(".profile-card");
    const greeting = document.getElementById("greeting");
    const leimRating = document.getElementById("leimRating");
    const weeklyLimit = document.getElementById("weeklyLimit");

    // Update profile card text and class
    greeting.textContent = `Hello, ${currentUser.name}!`;
    leimRating.textContent = currentUser.leimRating.charAt(0).toUpperCase() + currentUser.leimRating.slice(1);
    weeklyLimit.textContent = `$${currentUser.weeklyLimit}`;
    profileCard.className = `profile-card ${currentUser.leimRating}`; // Change class based on LEIM rating
}

// Populate game breakdown table
function populateGameBreakdownTable() {
    const tableBody = document.getElementById("gameBreakdownTable");
    tableBody.innerHTML = ""; // Clear existing rows

    currentUser.weeklyGameSpend[0].forEach((_, gameIndex) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>Game ${gameIndex + 1}</td>` + currentUser.weeklyGameSpend
            .map((weekSpend) => `<td>${weekSpend[gameIndex] || 0}</td>`)
            .join("");
        tableBody.appendChild(row);
    });
}

// Switch user profile
function switchUserProfile(userId) {
    currentUser = userProfiles[userId];
    updateProfileCard();
    populateGameBreakdownTable();
    updateChart();
}

// Update the chart
function updateChart() {
    const totalWeeklySpend = currentUser.weeklyGameSpend.map((weekSpend) =>
        weekSpend.reduce((a, b) => a + b, 0)
    );
    spendChart.data.datasets[0].data = totalWeeklySpend;
    spendChart.update();
}

// Initialize data display
window.addEventListener("DOMContentLoaded", () => {
    updateProfileCard();
    populateGameBreakdownTable();

    const ctx = document.getElementById("spendChart").getContext("2d");
    spendChart = new Chart(ctx, generateChartConfig());

    document.getElementById("userSelector").addEventListener("change", (event) => {
        switchUserProfile(event.target.value);
    });

    // Count-up animations for statistics
    countUp("totalWinners", 100000, 200000, 3000);
    countUp("moneyDonated", 2000000, 5000000, 3000);
});

// Count-up function for animations
function countUp(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    let startTime = null;

    function update(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = `$${value.toLocaleString()}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

const messages = {
    green: "You're doing great! Keep up your responsible gambling habits.",
    amber: "Consider setting limits to stay on track and maintain healthy habits.",
    red: "You're at high risk. Please take a moment to reflect on your spending and consider setting stricter limits.",
    black: "You’re at very high risk. Please seek immediate support and consider pausing gambling activities."
};

// Function to update the message based on the user's LEIM rating
function updateUserMessage(leimRating) {
    const messageElement = document.getElementById("message-text");
    messageElement.textContent = messages[leimRating];
}

// Example usage: Call this function when the user profile changes
function switchUserProfile(userId) {
    currentUser = userProfiles[userId];
    updateProfileCard(); // Updates the profile card
    populateGameBreakdownTable(); // Updates the table
    updateChart(); // Updates the chart
    updateUserMessage(currentUser.leimRating); // Updates the message
}

// Initialize with the default user's message
window.addEventListener("DOMContentLoaded", () => {
    updateUserMessage(currentUser.leimRating);
});
