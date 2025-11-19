/**
 * Main Application Controller
 * Initializes the app and handles main event listeners
 */

// Application state
const App = {
    initialized: false,
    currentPage: 'dashboard',

    /**
     * Initialize the application
     */
    async init() {
        if (this.initialized) return;

        console.log('Initializing Clash of Clans Dashboard...');

        // Initialize theme toggle
        initThemeToggle();

        // Setup navigation
        this.setupNavigation();

        // Setup dashboard handlers
        this.setupDashboardHandlers();

        // Setup settings handlers
        this.setupSettingsHandlers();

        // Setup member search
        this.setupMemberSearch();

        // Setup inactivity finder
        this.setupInactivityFinder();

        // Load saved clan if exists
        await this.loadSavedClan();

        // Start auto-snapshot
        startAutoSnapshot();

        this.initialized = true;
        console.log('Dashboard initialized successfully!');
    },

    /**
     * Setup navigation handlers
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });
    },

    /**
     * Navigate to a page
     */
    navigateToPage(pageName) {
        this.currentPage = pageName;
        UI.navigateTo(pageName);

        // Refresh page-specific content
        this.refreshCurrentPage();
    },

    /**
     * Refresh current page content
     */
    refreshCurrentPage() {
        const clanData = Storage.getClanData();

        switch (this.currentPage) {
            case 'members':
                if (clanData && clanData.memberList) {
                    Clan.renderMemberRanking(clanData.memberList);
                }
                break;

            case 'inactivity':
                const days = parseInt(document.getElementById('inactivity-days')?.value || 5);
                Clan.renderInactivityFinder(days);
                break;

            case 'war':
                const warData = Storage.getLatestSnapshot('war');
                if (warData) {
                    Clan.renderWarDashboard(warData.data);
                }
                break;

            case 'capital':
                const capitalData = Storage.getLatestSnapshot('capital');
                if (capitalData) {
                    Clan.renderCapitalDashboard(capitalData.data);
                }
                break;

            case 'clan':
                if (clanData) {
                    Clan.renderClanOverview(clanData);
                }
                break;

            case 'settings':
                this.loadSettings();
                break;
        }
    },

    /**
     * Setup dashboard handlers
     */
    setupDashboardHandlers() {
        const loadClanBtn = document.getElementById('load-clan-btn');
        const clanTagInput = document.getElementById('clan-tag-input');

        if (loadClanBtn && clanTagInput) {
            loadClanBtn.addEventListener('click', async () => {
                const clanTag = clanTagInput.value.trim();

                if (!clanTag) {
                    UI.showToast('Please enter a clan tag', 'error');
                    return;
                }

                loadClanBtn.disabled = true;
                loadClanBtn.textContent = 'Loading...';

                const success = await Clan.loadClan(clanTag);

                loadClanBtn.disabled = false;
                loadClanBtn.textContent = 'Load Clan';

                if (success) {
                    // Save as default clan
                    const settings = Storage.getSettings();
                    settings.defaultClanTag = clanTag;
                    Storage.saveSettings(settings);
                }
            });

            // Allow Enter key
            clanTagInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    loadClanBtn.click();
                }
            });
        }
    },

    /**
     * Setup settings handlers
     */
    setupSettingsHandlers() {
        const saveSettingsBtn = document.getElementById('save-settings-btn');
        const exportDataBtn = document.getElementById('export-data-btn');
        const importDataBtn = document.getElementById('import-data-btn');
        const clearDataBtn = document.getElementById('clear-data-btn');
        const importFileInput = document.getElementById('import-file-input');

        // Save settings
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                const settings = Storage.getSettings();

                const defaultClanTag = document.getElementById('default-clan-tag')?.value.trim();
                const snapshotInterval = parseInt(document.getElementById('snapshot-interval')?.value || 60);
                const inactivityThreshold = parseInt(document.getElementById('inactivity-threshold')?.value || 5);

                settings.defaultClanTag = defaultClanTag;
                settings.snapshotInterval = snapshotInterval;
                settings.inactivityThreshold = inactivityThreshold;

                if (Storage.saveSettings(settings)) {
                    UI.showToast('Settings saved successfully!', 'success');

                    // Restart auto-snapshot with new interval
                    stopAutoSnapshot();
                    startAutoSnapshot();
                } else {
                    UI.showToast('Failed to save settings', 'error');
                }
            });
        }

        // Export data
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                if (Storage.exportData()) {
                    UI.showToast('Data exported successfully!', 'success');
                } else {
                    UI.showToast('Failed to export data', 'error');
                }
            });
        }

        // Import data
        if (importDataBtn && importFileInput) {
            importDataBtn.addEventListener('click', () => {
                importFileInput.click();
            });

            importFileInput.addEventListener('change', (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const jsonString = event.target.result;
                        if (Storage.importData(jsonString)) {
                            UI.showToast('Data imported successfully!', 'success');

                            // Reload the app
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        } else {
                            UI.showToast('Failed to import data', 'error');
                        }
                    } catch (error) {
                        UI.showToast('Invalid data file', 'error');
                    }
                };
                reader.readAsText(file);
            });
        }

        // Clear data
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => {
                if (UI.confirm('Are you sure you want to clear all data? This cannot be undone!')) {
                    if (Storage.clearAllData()) {
                        UI.showToast('All data cleared!', 'success');

                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        UI.showToast('Failed to clear data', 'error');
                    }
                }
            });
        }
    },

    /**
     * Setup member search
     */
    setupMemberSearch() {
        const searchInput = document.getElementById('member-search');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                UI.filterTable('members-table', e.target.value);
            });
        }
    },

    /**
     * Setup inactivity finder
     */
    setupInactivityFinder() {
        const daysSelect = document.getElementById('inactivity-days');
        const refreshBtn = document.getElementById('refresh-inactivity-btn');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                const days = parseInt(daysSelect?.value || 5);
                Clan.renderInactivityFinder(days);
                UI.showToast('Inactivity data refreshed', 'success');
            });
        }

        if (daysSelect) {
            daysSelect.addEventListener('change', () => {
                const days = parseInt(daysSelect.value);
                Clan.renderInactivityFinder(days);
            });
        }
    },

    /**
     * Load saved clan on startup
     */
    async loadSavedClan() {
        const settings = Storage.getSettings();
        const savedClan = Storage.getClanData();

        // Try to load from settings or saved data
        if (savedClan) {
            console.log('Loading saved clan:', savedClan.name);

            // Render saved data immediately
            Clan.renderClanOverview(savedClan);
            Clan.renderMemberRanking(savedClan.memberList || []);
            UI.updateDashboardStats(savedClan);
            Clan.updateRecentActivity();

            // Set input value
            const clanTagInput = document.getElementById('clan-tag-input');
            if (clanTagInput) {
                clanTagInput.value = savedClan.tag;
            }

            // Optionally refresh in background
            if (settings.defaultClanTag) {
                console.log('Refreshing clan data in background...');
                Clan.loadClan(settings.defaultClanTag).catch(err => {
                    console.error('Background refresh failed:', err);
                });
            }
        } else if (settings.defaultClanTag) {
            console.log('Loading default clan:', settings.defaultClanTag);

            const clanTagInput = document.getElementById('clan-tag-input');
            if (clanTagInput) {
                clanTagInput.value = settings.defaultClanTag;
            }

            await Clan.loadClan(settings.defaultClanTag);
        } else {
            console.log('No saved clan found');
        }
    },

    /**
     * Load settings into form
     */
    loadSettings() {
        const settings = Storage.getSettings();

        const defaultClanTagInput = document.getElementById('default-clan-tag');
        const snapshotIntervalInput = document.getElementById('snapshot-interval');
        const inactivityThresholdInput = document.getElementById('inactivity-threshold');

        if (defaultClanTagInput) {
            defaultClanTagInput.value = settings.defaultClanTag || '';
        }

        if (snapshotIntervalInput) {
            snapshotIntervalInput.value = settings.snapshotInterval || 60;
        }

        if (inactivityThresholdInput) {
            inactivityThresholdInput.value = settings.inactivityThreshold || 5;
        }
    },

    /**
     * Get app info
     */
    getAppInfo() {
        const storageInfo = Storage.getStorageInfo();

        return {
            version: '1.0.0',
            initialized: this.initialized,
            currentPage: this.currentPage,
            storage: storageInfo
        };
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init().catch(error => {
        console.error('Failed to initialize app:', error);
        UI.showToast('Failed to initialize application', 'error');
    });
});

// Make App and modules available globally for debugging
window.App = App;
window.Storage = Storage;
window.API = API;
window.UI = UI;
window.Clan = Clan;
window.Player = Player;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
