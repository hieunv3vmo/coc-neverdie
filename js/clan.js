/**
 * Clan Module
 * Handles clan data rendering and management
 */

const Clan = {
    currentClanData: null,

    /**
     * Load and display clan data
     */
    async loadClan(clanTag) {
        try {
            UI.showLoading('clan-overview');
            UI.showToast('Loading clan data...', 'info');

            // Fetch comprehensive clan data
            const result = await API.getComprehensiveClanData(clanTag);

            if (!result.success || !result.data.clan) {
                UI.showToast('Failed to load clan data', 'error');
                return false;
            }

            // Store clan data
            this.currentClanData = result.data.clan;
            Storage.saveClanData(this.currentClanData);

            // Save snapshot
            Storage.saveSnapshot('clan', this.currentClanData);

            // Save war data if available
            if (result.data.war && result.data.war.state !== 'notInWar') {
                Storage.saveSnapshot('war', result.data.war);
            }

            // Save capital data if available
            if (result.data.capital) {
                Storage.saveSnapshot('capital', result.data.capital);
            }

            // Update all displays
            this.renderClanOverview(this.currentClanData);
            this.renderMemberRanking(this.currentClanData.memberList || []);
            UI.updateDashboardStats(this.currentClanData);
            this.updateRecentActivity();

            // Load war and capital data
            if (result.data.war) {
                this.renderWarDashboard(result.data.war);
            }

            if (result.data.capital) {
                this.renderCapitalDashboard(result.data.capital);
            }

            UI.showToast('Clan loaded successfully!', 'success');
            return true;
        } catch (error) {
            console.error('Error loading clan:', error);
            UI.showToast('Error loading clan: ' + error.message, 'error');
            return false;
        }
    },

    /**
     * Render clan overview page
     */
    renderClanOverview(clanData) {
        const container = document.getElementById('clan-overview');
        if (!container) return;

        const warWins = clanData.warWins || 0;
        const warLosses = clanData.warLosses || 0;
        const warTies = clanData.warTies || 0;
        const totalWars = warWins + warLosses + warTies;
        const winRate = totalWars > 0 ? (warWins / totalWars) * 100 : 0;

        container.innerHTML = `
            <div class="flex flex-col items-center mb-6">
                <div class="text-6xl mb-4">${clanData.badgeUrls?.large ? `<img src="${clanData.badgeUrls.large}" alt="Clan Badge" class="w-24 h-24 mx-auto">` : '🛡️'}</div>
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white">${clanData.name}</h2>
                <p class="text-gray-500 dark:text-gray-400">${clanData.tag}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-2xl text-center">${clanData.description || 'No description'}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Clan Level</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">${clanData.clanLevel || 0}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Members</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">${clanData.members || 0}/50</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Clan Points</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">${UI.formatNumber(clanData.clanPoints || 0)}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Required Trophies</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">${UI.formatNumber(clanData.requiredTrophies || 0)}</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400">War Wins</p>
                    <p class="text-xl font-bold text-green-600 dark:text-green-400">${warWins}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400">War Losses</p>
                    <p class="text-xl font-bold text-red-600 dark:text-red-400">${warLosses}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Win Rate</p>
                    <p class="text-xl font-bold text-blue-600 dark:text-blue-400">${UI.formatPercent(winRate)}</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">War League</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">${clanData.warLeague?.name || 'Unranked'}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Capital Hall Level</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">${clanData.clanCapital?.capitalHallLevel || 'N/A'}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Type</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">${clanData.type || 'N/A'}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">War Frequency</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">${clanData.warFrequency || 'N/A'}</p>
                </div>
            </div>
        `;
    },

    /**
     * Render member ranking table
     */
    renderMemberRanking(members) {
        const tbody = document.getElementById('members-tbody');
        if (!tbody) return;

        if (!members || members.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center">No members found</td></tr>';
            return;
        }

        // Sort members by trophies by default
        const sortedMembers = [...members].sort((a, b) => b.trophies - a.trophies);

        tbody.innerHTML = sortedMembers.map((member, index) => {
            const activity = Storage.computeActivity(member.tag, 7);

            return `
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div class="flex items-center">
                            <span class="mr-2">${UI.getTownHallIcon(member.townHallLevel || 1)}</span>
                            <div>
                                <div>${member.name}</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400">${member.tag}</div>
                            </div>
                        </div>
                    </th>
                    <td class="px-6 py-4">${UI.getRoleBadge(member.role)}</td>
                    <td class="px-6 py-4 font-semibold">${UI.formatNumber(member.trophies || 0)}</td>
                    <td class="px-6 py-4">${member.townHallLevel || 'N/A'}</td>
                    <td class="px-6 py-4 text-green-600 dark:text-green-400">${UI.formatNumber(member.donations || 0)}</td>
                    <td class="px-6 py-4 text-blue-600 dark:text-blue-400">${UI.formatNumber(member.donationsReceived || 0)}</td>
                    <td class="px-6 py-4">
                        <button onclick="Player.showPlayerModal('${member.tag}')" class="text-blue-600 dark:text-blue-400 hover:underline">
                            View
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // Setup table sorting
        this.setupTableSorting('members-table', sortedMembers);
    },

    /**
     * Setup table sorting
     */
    setupTableSorting(tableId, data) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const headers = table.querySelectorAll('th[data-sort]');
        let currentSort = { column: 'trophies', direction: 'desc' };

        headers.forEach(header => {
            header.style.cursor = 'pointer';

            header.addEventListener('click', () => {
                const column = header.getAttribute('data-sort');

                // Toggle direction if same column
                if (currentSort.column === column) {
                    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSort.column = column;
                    currentSort.direction = 'desc';
                }

                // Sort data
                const sorted = [...data].sort((a, b) => {
                    let aVal = a[column];
                    let bVal = b[column];

                    if (typeof aVal === 'string') {
                        aVal = aVal.toLowerCase();
                        bVal = bVal.toLowerCase();
                    }

                    if (currentSort.direction === 'asc') {
                        return aVal > bVal ? 1 : -1;
                    } else {
                        return aVal < bVal ? 1 : -1;
                    }
                });

                // Re-render
                this.renderMemberRanking(sorted);
            });
        });
    },

    /**
     * Render inactivity finder
     */
    renderInactivityFinder(days = 5) {
        const container = document.getElementById('inactivity-list');
        if (!container) return;

        const inactiveMembers = Storage.findInactiveMembers(days);

        if (inactiveMembers.length === 0) {
            container.innerHTML = '<p class="text-green-600 dark:text-green-400">✓ All members are active!</p>';
            return;
        }

        container.innerHTML = `
            <div class="space-y-2">
                ${inactiveMembers.map(member => `
                    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="font-semibold text-gray-900 dark:text-white">${member.name}</h4>
                                <p class="text-sm text-gray-500 dark:text-gray-400">${member.tag}</p>
                                <div class="mt-2 text-sm">
                                    <p class="text-gray-600 dark:text-gray-300">
                                        Trophy change: <span class="${member.activity.trophyChange === 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}">${member.activity.trophyChange > 0 ? '+' : ''}${member.activity.trophyChange}</span>
                                    </p>
                                    <p class="text-gray-600 dark:text-gray-300">
                                        Donations: <span class="${member.activity.donationsChange === 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}">${member.activity.donationsChange}</span>
                                    </p>
                                    ${member.activity.lastSeen ? `<p class="text-gray-500 dark:text-gray-400 text-xs mt-1">Last seen: ${UI.formatRelativeTime(member.activity.lastSeen)}</p>` : ''}
                                </div>
                            </div>
                            <div>
                                ${UI.getRoleBadge(member.role)}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Render war dashboard
     */
    renderWarDashboard(warData) {
        const statusContainer = document.getElementById('war-status');
        const tbody = document.getElementById('war-tbody');

        if (!statusContainer || !tbody) return;

        if (!warData || warData.state === 'notInWar') {
            statusContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400">Not currently in war</p>';
            tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center">No active war</td></tr>';
            return;
        }

        const metrics = API.calculateWarMetrics(warData);

        // Render war status
        statusContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">${metrics.clan.name}</h4>
                    <div class="space-y-1">
                        <p class="text-sm">Stars: <span class="font-bold text-yellow-600">${metrics.clan.stars}⭐</span></p>
                        <p class="text-sm">Destruction: <span class="font-bold">${UI.formatPercent(metrics.clan.destruction)}</span></p>
                        <p class="text-sm">Attacks: <span class="font-bold">${metrics.clan.attacks}</span></p>
                    </div>
                </div>
                <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">${metrics.opponent.name}</h4>
                    <div class="space-y-1">
                        <p class="text-sm">Stars: <span class="font-bold text-yellow-600">${metrics.opponent.stars}⭐</span></p>
                        <p class="text-sm">Destruction: <span class="font-bold">${UI.formatPercent(metrics.opponent.destruction)}</span></p>
                        <p class="text-sm">Attacks: <span class="font-bold">${metrics.opponent.attacks}</span></p>
                    </div>
                </div>
            </div>
            <div class="mt-4 text-center">
                <span class="px-4 py-2 rounded-lg ${
                    metrics.state === 'inWar' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    metrics.state === 'preparation' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }">
                    ${metrics.state}
                </span>
            </div>
        `;

        // Render participants
        tbody.innerHTML = metrics.members.map(member => `
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    <div>${member.name}</div>
                    <div class="text-xs text-gray-500">#${member.mapPosition}</div>
                </td>
                <td class="px-6 py-4">
                    <span class="${member.attacksMissed > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}">
                        ${member.attacksUsed}/${metrics.attacksPerMember}
                        ${member.attacksMissed > 0 ? `(${member.attacksMissed} missed)` : ''}
                    </span>
                </td>
                <td class="px-6 py-4 font-semibold text-yellow-600">${member.totalStars}⭐</td>
                <td class="px-6 py-4">${UI.formatPercent(member.avgDestruction)}</td>
            </tr>
        `).join('');
    },

    /**
     * Render capital raids dashboard
     */
    renderCapitalDashboard(capitalData) {
        const overviewContainer = document.getElementById('capital-overview');
        const tbody = document.getElementById('capital-tbody');

        if (!overviewContainer || !tbody) return;

        const metrics = API.calculateCapitalMetrics(capitalData);

        if (!metrics) {
            overviewContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No capital raid data available</p>';
            tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center">No raid data</td></tr>';
            return;
        }

        // Render overview
        overviewContainer.innerHTML = `
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Total Loot</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">${UI.formatNumber(metrics.capitalTotalLoot)}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Raids Completed</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">${metrics.raidsCompleted}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Total Attacks</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">${metrics.totalAttacks}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Districts Destroyed</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">${metrics.enemyDistrictsDestroyed}</p>
                </div>
            </div>
        `;

        // Render contributors table
        tbody.innerHTML = metrics.members.map((member, index) => `
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    <div class="flex items-center">
                        ${index < 3 ? `<span class="mr-2">${['🥇', '🥈', '🥉'][index]}</span>` : ''}
                        ${member.name}
                    </div>
                </td>
                <td class="px-6 py-4 font-semibold text-yellow-600">${UI.formatNumber(member.capitalResourcesLooted)}</td>
                <td class="px-6 py-4">${member.attacks}/${member.attackLimit + member.bonusAttackLimit}</td>
                <td class="px-6 py-4">${UI.formatNumber(member.capitalResourcesLooted)}</td>
            </tr>
        `).join('');

        // Create chart
        this.createCapitalChart(metrics.members);
    },

    /**
     * Create capital contributions chart
     */
    createCapitalChart(members) {
        const topContributors = members.slice(0, 10);

        const data = {
            labels: topContributors.map(m => m.name),
            datasets: [{
                label: 'Capital Gold Looted',
                data: topContributors.map(m => m.capitalResourcesLooted),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
            }]
        };

        UI.createChart('capital-chart', 'bar', data, {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        });
    },

    /**
     * Update recent activity feed
     */
    updateRecentActivity() {
        const container = document.getElementById('recent-activity');
        if (!container) return;

        const clanData = Storage.getClanData();
        if (!clanData) {
            container.innerHTML = '<p class="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>';
            return;
        }

        const activities = [];

        // Add snapshot info
        const latestSnapshot = Storage.getLatestSnapshot('clan');
        if (latestSnapshot) {
            activities.push({
                type: 'snapshot',
                message: `Clan data snapshot saved`,
                time: latestSnapshot.timestamp
            });
        }

        // Add war info
        const latestWar = Storage.getLatestSnapshot('war');
        if (latestWar && latestWar.data.state !== 'notInWar') {
            activities.push({
                type: 'war',
                message: `War ${latestWar.data.state} - ${latestWar.data.clan?.name} vs ${latestWar.data.opponent?.name}`,
                time: latestWar.timestamp
            });
        }

        // Render activities
        container.innerHTML = activities.length > 0 ? activities.map(activity => `
            <div class="text-sm py-2 border-b border-gray-200 dark:border-gray-700">
                <p class="text-gray-900 dark:text-white">${activity.message}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">${UI.formatRelativeTime(activity.time)}</p>
            </div>
        `).join('') : '<p class="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>';
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Clan;
}
