/**
 * Player Module
 * Handles player data rendering and modal display
 */

const Player = {
    currentPlayerData: null,

    /**
     * Show player detail modal
     */
    async showPlayerModal(playerTag) {
        try {
            const modal = document.getElementById('player-modal');
            const title = document.getElementById('player-modal-title');
            const content = document.getElementById('player-modal-content');

            if (!modal || !title || !content) return;

            // Show modal
            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false');

            // Show loading
            title.textContent = 'Loading...';
            content.innerHTML = '<p class="text-gray-500 dark:text-gray-400">Loading player data...</p>';

            // Fetch player data
            const result = await API.getPlayer(playerTag);

            if (!result.success) {
                content.innerHTML = `<p class="text-red-600 dark:text-red-400">Error: ${result.error}</p>`;
                return;
            }

            this.currentPlayerData = result.data;

            // Save to snapshots
            Storage.saveSnapshot('player', this.currentPlayerData);

            // Render player data
            this.renderPlayerModal(this.currentPlayerData);

        } catch (error) {
            console.error('Error showing player modal:', error);
            const content = document.getElementById('player-modal-content');
            if (content) {
                content.innerHTML = `<p class="text-red-600 dark:text-red-400">Error: ${error.message}</p>`;
            }
        }
    },

    /**
     * Render player data in modal
     */
    renderPlayerModal(playerData) {
        const title = document.getElementById('player-modal-title');
        const content = document.getElementById('player-modal-content');

        if (!title || !content) return;

        title.textContent = playerData.name;

        // Get activity data
        const activity = Storage.computeActivity(playerData.tag, 7);

        content.innerHTML = `
            <div class="space-y-6">
                <!-- Player Header -->
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">${playerData.name}</h3>
                        <p class="text-gray-500 dark:text-gray-400">${playerData.tag}</p>
                        ${playerData.clan ? `
                            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                <span class="font-semibold">${playerData.clan.name}</span>
                                ${UI.getRoleBadge(playerData.role || 'member')}
                            </p>
                        ` : ''}
                    </div>
                    <div class="text-6xl">${UI.getTownHallIcon(playerData.townHallLevel)}</div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <p class="text-xs text-gray-500 dark:text-gray-400">Town Hall</p>
                        <p class="text-xl font-bold text-gray-900 dark:text-white">${playerData.townHallLevel}</p>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <p class="text-xs text-gray-500 dark:text-gray-400">Trophies</p>
                        <p class="text-xl font-bold text-gray-900 dark:text-white">🏆 ${UI.formatNumber(playerData.trophies)}</p>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <p class="text-xs text-gray-500 dark:text-gray-400">Best Trophies</p>
                        <p class="text-xl font-bold text-gray-900 dark:text-white">${UI.formatNumber(playerData.bestTrophies)}</p>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <p class="text-xs text-gray-500 dark:text-gray-400">War Stars</p>
                        <p class="text-xl font-bold text-gray-900 dark:text-white">⭐ ${UI.formatNumber(playerData.warStars || 0)}</p>
                    </div>
                </div>

                <!-- Donations -->
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Donations</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Donated</p>
                            <p class="text-2xl font-bold text-green-600 dark:text-green-400">${UI.formatNumber(playerData.donations || 0)}</p>
                            ${activity.donationsChange !== 0 ? `
                                <p class="text-xs ${activity.donationsChange > 0 ? 'text-green-600' : 'text-red-600'}">
                                    ${activity.donationsChange > 0 ? '+' : ''}${activity.donationsChange} (7d)
                                </p>
                            ` : ''}
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Received</p>
                            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">${UI.formatNumber(playerData.donationsReceived || 0)}</p>
                        </div>
                    </div>
                </div>

                <!-- Heroes -->
                ${playerData.heroes && playerData.heroes.length > 0 ? `
                    <div>
                        <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Heroes</h4>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                            ${playerData.heroes.map(hero => `
                                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                    <p class="text-sm font-medium text-gray-900 dark:text-white">${hero.name}</p>
                                    <p class="text-lg font-bold text-blue-600 dark:text-blue-400">Lv ${hero.level}</p>
                                    ${hero.maxLevel ? `<p class="text-xs text-gray-500">Max: ${hero.maxLevel}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Troops (Top 10) -->
                ${playerData.troops && playerData.troops.length > 0 ? `
                    <div>
                        <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Top Troops</h4>
                        <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
                            ${playerData.troops.slice(0, 10).map(troop => `
                                <div class="bg-gray-50 dark:bg-gray-700 rounded p-2 text-center">
                                    <p class="text-xs text-gray-900 dark:text-white truncate">${troop.name}</p>
                                    <p class="text-sm font-bold text-blue-600">Lv ${troop.level}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Achievements (Top 6) -->
                ${playerData.achievements && playerData.achievements.length > 0 ? `
                    <div>
                        <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Achievements (Selected)</h4>
                        <div class="space-y-2">
                            ${this.getTopAchievements(playerData.achievements).map(achievement => `
                                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <p class="text-sm font-medium text-gray-900 dark:text-white">${achievement.name}</p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">${achievement.info}</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-sm font-bold text-blue-600 dark:text-blue-400">${achievement.value}/${achievement.target}</p>
                                            ${achievement.completionInfo ? `<p class="text-xs text-green-600 dark:text-green-400">${achievement.completionInfo}</p>` : ''}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Activity Status -->
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Activity (Last 7 Days)</h4>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-300">Status:</span>
                            <span>${UI.getActivityBadge(activity.isActive)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-300">Trophy Change:</span>
                            <span class="${activity.trophyChange > 0 ? 'text-green-600 dark:text-green-400' : activity.trophyChange < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}">
                                ${activity.trophyChange > 0 ? '+' : ''}${activity.trophyChange}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-300">Donations (7d):</span>
                            <span class="text-green-600 dark:text-green-400">${activity.donationsChange}</span>
                        </div>
                        ${activity.lastSeen ? `
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-300">Last Seen:</span>
                                <span class="text-gray-600 dark:text-gray-300">${UI.formatRelativeTime(activity.lastSeen)}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Experience & Builder Hall -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <p class="text-sm text-gray-500 dark:text-gray-400">Experience Level</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">${playerData.expLevel}</p>
                    </div>
                    ${playerData.builderHallLevel ? `
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <p class="text-sm text-gray-500 dark:text-gray-400">Builder Hall</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">${playerData.builderHallLevel}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    /**
     * Get top/interesting achievements
     */
    getTopAchievements(achievements) {
        // Priority achievements to show
        const priorityNames = [
            'War Hero',
            'War League Legend',
            'Gold Grab',
            'Elixir Escapade',
            'Heroic Heist',
            'Games Champion'
        ];

        const priority = achievements.filter(a => priorityNames.includes(a.name));
        const others = achievements.filter(a => !priorityNames.includes(a.name));

        // Combine and take top 6
        return [...priority, ...others].slice(0, 6);
    },

    /**
     * Close player modal
     */
    closePlayerModal() {
        const modal = document.getElementById('player-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
        }
    },

    /**
     * Get player comparison data
     */
    comparePlayer(playerTag, referenceTag) {
        // This could be expanded to compare two players
        // For now, just a placeholder
        return {
            player: playerTag,
            reference: referenceTag,
            // Comparison logic here
        };
    }
};

// Setup modal close handlers
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('player-modal');
    if (modal) {
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                Player.closePlayerModal();
            }
        });

        // Close on button click
        const closeBtn = modal.querySelector('[data-modal-hide="player-modal"]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                Player.closePlayerModal();
            });
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Player;
}
