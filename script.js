fetch('mock-data.json')
    .then((response) => response.json())
    .then((data) => {
        // Populate Spend Limits
        document.getElementById('dailyLimit').textContent = `$${data.user.spendLimits.daily}`;
        document.getElementById('weeklyLimit').textContent = `$${data.user.spendLimits.weekly}`;
        document.getElementById('monthlyLimit').textContent = `$${data.user.spendLimits.monthly}`;

        // Populate LEIM Ratings
        const leimTable = document.getElementById('leimTable');
        data.user.leimRatings.forEach((rating) => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${rating.week}</td>
        <td>${rating.rating}</td>
      `;
            leimTable.appendChild(row);
        });

        // Populate Chart
        const trendingSpend = data.user.trendingSpend.map((spend) => spend.amount);
        const config = {
            type: 'line',
            data: {
                labels: data.user.trendingSpend.map((spend) => spend.week),
                datasets: [
                    {
                        label: 'Spend ($)',
                        data: trendingSpend,
                        backgroundColor: 'rgba(0, 123, 255, 0.2)',
                        borderColor: 'rgba(0, 123, 255, 1)',
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Weekly Spend Analysis',
                    },
                },
            },
        };
        const ctx = document.getElementById('spendChart').getContext('2d');
        new Chart(ctx, config);

        // Populate Responsible Gambling Links
        const resourceList = document.querySelector('#resources ul');
        data.user.responsibleGamblingLinks.forEach((link) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${link.url}" target="_blank">${link.title}</a>`;
            resourceList.appendChild(listItem);
        });
    })
    .catch((error) => console.error('Error fetching mock data:', error));
