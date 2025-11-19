/**
 * UI Utilities Module
 * Common UI functions, formatters, and helpers
 */

const UI = {
    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast-notification');
        const messageEl = document.getElementById('toast-message');

        if (toast && messageEl) {
            messageEl.textContent = message;

            // Update icon color based on type
            const iconDiv = toast.querySelector('.flex-shrink-0');
            iconDiv.className = 'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg';

            if (type === 'success') {
                iconDiv.classList.add('text-green-500', 'bg-green-100', 'dark:bg-green-800', 'dark:text-green-200');
            } else if (type === 'error') {
                iconDiv.classList.add('text-red-500', 'bg-red-100', 'dark:bg-red-800', 'dark:text-red-200');
            } else if (type === 'warning') {
                iconDiv.classList.add('text-orange-500', 'bg-orange-100', 'dark:bg-orange-800', 'dark:text-orange-200');
            } else {
                iconDiv.classList.add('text-blue-500', 'bg-blue-100', 'dark:bg-blue-800', 'dark:text-blue-200');
            }

            toast.classList.remove('hidden');

            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }
    },

    /**
     * Show loading indicator
     */
    showLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="flex justify-center items-center py-8">
                    <div role="status">
                        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Format number with commas
     */
    formatNumber(num) {
        if (num == null) return '0';
        return num.toLocaleString();
    },

    /**
     * Format percentage
     */
    formatPercent(num, decimals = 1) {
        if (num == null) return '0%';
        return num.toFixed(decimals) + '%';
    },

    /**
     * Format date/time
     */
    formatDate(timestamp) {
        if (!timestamp) return 'Never';
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    },

    /**
     * Format relative time (e.g., "2 days ago")
     */
    formatRelativeTime(timestamp) {
        if (!timestamp) return 'Never';

        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    },

    /**
     * Get Town Hall icon/emoji
     */
    getTownHallIcon(level) {
        const icons = {
            1: '🏚️', 2: '🏚️', 3: '🏠', 4: '🏠', 5: '🏠',
            6: '🏡', 7: '🏡', 8: '🏰', 9: '🏰', 10: '🏰',
            11: '🏯', 12: '🏯', 13: '🏯', 14: '🏛️', 15: '🏛️', 16: '⚡'
        };
        return icons[level] || '🏠';
    },

    /**
     * Get role badge HTML
     */
    getRoleBadge(role) {
        const badges = {
            'leader': '<span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">👑 Leader</span>',
            'coLeader': '<span class="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-orange-900 dark:text-orange-300">⭐ Co-Leader</span>',
            'admin': '<span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">🛡️ Elder</span>',
            'member': '<span class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Member</span>'
        };
        return badges[role] || badges['member'];
    },

    /**
     * Get league badge HTML
     */
    getLeagueBadge(leagueName) {
        const badges = {
            'Legend League': '🏆',
            'Titan League I': '💎',
            'Titan League II': '💎',
            'Titan League III': '💎',
            'Champion League I': '🔷',
            'Champion League II': '🔷',
            'Champion League III': '🔷',
            'Master League I': '🔶',
            'Master League II': '🔶',
            'Master League III': '🔶',
            'Crystal League I': '💠',
            'Crystal League II': '💠',
            'Crystal League III': '💠',
            'Gold League I': '🥇',
            'Gold League II': '🥇',
            'Gold League III': '🥇',
            'Silver League I': '🥈',
            'Silver League II': '🥈',
            'Silver League III': '🥈',
            'Bronze League I': '🥉',
            'Bronze League II': '🥉',
            'Bronze League III': '🥉'
        };
        return badges[leagueName] || '🏅';
    },

    /**
     * Get activity status badge
     */
    getActivityBadge(isActive) {
        if (isActive) {
            return '<span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">✓ Active</span>';
        } else {
            return '<span class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">✗ Inactive</span>';
        }
    },

    /**
     * Navigate to a page
     */
    navigateTo(pageName) {
        // Hide all pages
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.add('hidden');
        });

        // Show target page
        const targetPage = document.getElementById(`page-${pageName}`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
        }

        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'clan': 'Clan Overview',
            'members': 'Member Ranking',
            'inactivity': 'Inactivity Finder',
            'war': 'War Dashboard',
            'capital': 'Capital Raids',
            'settings': 'Settings'
        };

        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = titles[pageName] || 'Dashboard';
        }

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('bg-gray-100', 'dark:bg-gray-700');
        });

        const activeLink = document.querySelector(`[data-page="${pageName}"]`);
        if (activeLink) {
            activeLink.classList.add('bg-gray-100', 'dark:bg-gray-700');
        }
    },

    /**
     * Create a sortable table
     */
    makeSortable(tableId, data, columns, renderRow) {
        const table = document.getElementById(tableId);
        if (!table) return;

        let sortColumn = null;
        let sortDirection = 'desc';

        const render = () => {
            // Sort data if column is selected
            let sortedData = [...data];
            if (sortColumn) {
                sortedData.sort((a, b) => {
                    let aVal = a[sortColumn];
                    let bVal = b[sortColumn];

                    // Handle nested properties
                    if (sortColumn.includes('.')) {
                        const parts = sortColumn.split('.');
                        aVal = parts.reduce((obj, key) => obj?.[key], a);
                        bVal = parts.reduce((obj, key) => obj?.[key], b);
                    }

                    if (typeof aVal === 'string') {
                        aVal = aVal.toLowerCase();
                        bVal = bVal.toLowerCase();
                    }

                    if (sortDirection === 'asc') {
                        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
                    } else {
                        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
                    }
                });
            }

            // Render rows
            const tbody = table.querySelector('tbody');
            if (tbody) {
                tbody.innerHTML = sortedData.map(renderRow).join('');
            }
        };

        // Add click handlers to headers
        const headers = table.querySelectorAll('th[data-sort]');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.getAttribute('data-sort');

                if (sortColumn === column) {
                    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    sortColumn = column;
                    sortDirection = 'desc';
                }

                // Update header indicators
                headers.forEach(h => {
                    h.innerHTML = h.textContent.replace(' ▲', '').replace(' ▼', '');
                });

                header.innerHTML = header.textContent + (sortDirection === 'asc' ? ' ▲' : ' ▼');

                render();
            });
        });

        // Initial render
        render();
    },

    /**
     * Filter table rows by search query
     */
    filterTable(tableId, searchQuery) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const rows = tbody.querySelectorAll('tr');
        const query = searchQuery.toLowerCase();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(query)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    },

    /**
     * Create a Chart.js chart
     */
    createChart(canvasId, type, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        // Destroy existing chart if any
        const existingChart = Chart.getChart(canvasId);
        if (existingChart) {
            existingChart.destroy();
        }

        return new Chart(canvas, {
            type,
            data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                ...options
            }
        });
    },

    /**
     * Update dashboard stats
     */
    updateDashboardStats(clanData) {
        if (!clanData) return;

        // Total trophies
        const totalTrophies = clanData.clanPoints || 0;
        const statTrophies = document.getElementById('stat-trophies');
        if (statTrophies) {
            statTrophies.textContent = this.formatNumber(totalTrophies);
        }

        // Members count
        const members = clanData.members || 0;
        const statMembers = document.getElementById('stat-members');
        if (statMembers) {
            statMembers.textContent = `${members}/50`;
        }

        // War win rate
        const warWins = clanData.warWins || 0;
        const warLosses = clanData.warLosses || 0;
        const warTies = clanData.warTies || 0;
        const totalWars = warWins + warLosses + warTies;
        const winRate = totalWars > 0 ? (warWins / totalWars) * 100 : 0;

        const statWarRate = document.getElementById('stat-war-rate');
        if (statWarRate) {
            statWarRate.textContent = this.formatPercent(winRate);
        }

        // Clan level
        const clanLevel = clanData.clanLevel || 0;
        const statClanLevel = document.getElementById('stat-clan-level');
        if (statClanLevel) {
            statClanLevel.textContent = clanLevel;
        }
    },

    /**
     * Confirm dialog
     */
    confirm(message) {
        return window.confirm(message);
    },

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!');
            return true;
        } catch (error) {
            console.error('Copy failed:', error);
            this.showToast('Failed to copy', 'error');
            return false;
        }
    },

    /**
     * Download JSON file
     */
    downloadJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }
};

// Dark mode toggle handler
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    // Load saved theme or default to dark
    const settings = Storage.getSettings();
    const isDark = settings.darkMode !== false; // Default to true

    if (isDark) {
        document.documentElement.classList.add('dark');
        themeToggleLightIcon?.classList.remove('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        themeToggleDarkIcon?.classList.remove('hidden');
    }

    themeToggleBtn?.addEventListener('click', function() {
        // Toggle icons
        themeToggleDarkIcon?.classList.toggle('hidden');
        themeToggleLightIcon?.classList.toggle('hidden');

        // Toggle dark mode
        const nowDark = document.documentElement.classList.toggle('dark');

        // Save preference
        const settings = Storage.getSettings();
        settings.darkMode = nowDark;
        Storage.saveSettings(settings);
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UI, initThemeToggle };
}
