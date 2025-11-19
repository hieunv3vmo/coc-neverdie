/**
 * LocalStorage Manager for Clash of Clans Dashboard
 * Handles all data persistence including snapshots, settings, and activity tracking
 */

const Storage = {
    // Keys for localStorage
    KEYS: {
        SETTINGS: 'coc_settings',
        CLAN_DATA: 'coc_clan_data',
        CLAN_SNAPSHOTS: 'coc_clan_snapshots',
        PLAYER_SNAPSHOTS: 'coc_player_snapshots',
        WAR_SNAPSHOTS: 'coc_war_snapshots',
        CAPITAL_SNAPSHOTS: 'coc_capital_snapshots',
        ACTIVITY_HISTORY: 'coc_activity_history'
    },

    /**
     * Get settings from localStorage
     */
    getSettings() {
        const defaults = {
            defaultClanTag: '',
            snapshotInterval: 60, // minutes
            inactivityThreshold: 5, // days
            darkMode: true,
            lastSnapshotTime: null
        };

        try {
            const stored = localStorage.getItem(this.KEYS.SETTINGS);
            return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
        } catch (error) {
            console.error('Error loading settings:', error);
            return defaults;
        }
    },

    /**
     * Save settings to localStorage
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    },

    /**
     * Get current clan data
     */
    getClanData() {
        try {
            const stored = localStorage.getItem(this.KEYS.CLAN_DATA);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error loading clan data:', error);
            return null;
        }
    },

    /**
     * Save current clan data
     */
    saveClanData(clanData) {
        try {
            localStorage.setItem(this.KEYS.CLAN_DATA, JSON.stringify(clanData));
            return true;
        } catch (error) {
            console.error('Error saving clan data:', error);
            return false;
        }
    },

    /**
     * Save a snapshot of clan data with timestamp
     */
    saveSnapshot(type, data) {
        try {
            const key = this.KEYS[`${type.toUpperCase()}_SNAPSHOTS`];
            const snapshots = this.loadSnapshots(type);

            const snapshot = {
                timestamp: Date.now(),
                data: data
            };

            snapshots.push(snapshot);

            // Keep only last 100 snapshots to prevent storage overflow
            const trimmed = snapshots.slice(-100);

            localStorage.setItem(key, JSON.stringify(trimmed));

            // Update last snapshot time in settings
            const settings = this.getSettings();
            settings.lastSnapshotTime = Date.now();
            this.saveSettings(settings);

            return true;
        } catch (error) {
            console.error(`Error saving ${type} snapshot:`, error);
            return false;
        }
    },

    /**
     * Load all snapshots of a specific type
     */
    loadSnapshots(type) {
        try {
            const key = this.KEYS[`${type.toUpperCase()}_SNAPSHOTS`];
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error(`Error loading ${type} snapshots:`, error);
            return [];
        }
    },

    /**
     * Get the most recent snapshot of a specific type
     */
    getLatestSnapshot(type) {
        const snapshots = this.loadSnapshots(type);
        return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
    },

    /**
     * Get snapshots within a specific time range
     */
    getSnapshotsByTimeRange(type, startTime, endTime) {
        const snapshots = this.loadSnapshots(type);
        return snapshots.filter(s => s.timestamp >= startTime && s.timestamp <= endTime);
    },

    /**
     * Compute activity score for a member based on snapshots
     */
    computeActivity(memberTag, days = 7) {
        try {
            const clanSnapshots = this.loadSnapshots('clan');

            if (clanSnapshots.length < 2) {
                return {
                    score: 0,
                    trophyChange: 0,
                    donationsChange: 0,
                    lastSeen: null,
                    isActive: false
                };
            }

            const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
            const recentSnapshots = clanSnapshots.filter(s => s.timestamp >= cutoffTime);

            if (recentSnapshots.length === 0) {
                return {
                    score: 0,
                    trophyChange: 0,
                    donationsChange: 0,
                    lastSeen: null,
                    isActive: false
                };
            }

            // Find member in first and last snapshot
            const firstSnapshot = recentSnapshots[0];
            const lastSnapshot = recentSnapshots[recentSnapshots.length - 1];

            const firstMember = firstSnapshot.data.memberList?.find(m => m.tag === memberTag);
            const lastMember = lastSnapshot.data.memberList?.find(m => m.tag === memberTag);

            if (!firstMember || !lastMember) {
                return {
                    score: 0,
                    trophyChange: 0,
                    donationsChange: 0,
                    lastSeen: null,
                    isActive: false
                };
            }

            const trophyChange = lastMember.trophies - firstMember.trophies;
            const donationsChange = lastMember.donations - firstMember.donations;

            // Activity score: weighted sum of changes
            const score = Math.abs(trophyChange) + (donationsChange * 2);

            // Check if member is active (any change in last N days)
            const isActive = trophyChange !== 0 || donationsChange !== 0;

            return {
                score,
                trophyChange,
                donationsChange,
                lastSeen: lastSnapshot.timestamp,
                isActive,
                days
            };
        } catch (error) {
            console.error('Error computing activity:', error);
            return {
                score: 0,
                trophyChange: 0,
                donationsChange: 0,
                lastSeen: null,
                isActive: false
            };
        }
    },

    /**
     * Find inactive members
     */
    findInactiveMembers(days = 5) {
        try {
            const clanData = this.getClanData();
            if (!clanData || !clanData.memberList) {
                return [];
            }

            const inactiveMembers = [];

            for (const member of clanData.memberList) {
                const activity = this.computeActivity(member.tag, days);

                if (!activity.isActive) {
                    inactiveMembers.push({
                        ...member,
                        activity
                    });
                }
            }

            return inactiveMembers;
        } catch (error) {
            console.error('Error finding inactive members:', error);
            return [];
        }
    },

    /**
     * Save activity history for a specific member
     */
    saveActivityHistory(memberTag, activity) {
        try {
            const history = this.getActivityHistory(memberTag);
            history.push({
                timestamp: Date.now(),
                ...activity
            });

            // Keep only last 30 days
            const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);
            const trimmed = history.filter(h => h.timestamp >= cutoff);

            const allHistory = this.getAllActivityHistory();
            allHistory[memberTag] = trimmed;

            localStorage.setItem(this.KEYS.ACTIVITY_HISTORY, JSON.stringify(allHistory));
            return true;
        } catch (error) {
            console.error('Error saving activity history:', error);
            return false;
        }
    },

    /**
     * Get activity history for a specific member
     */
    getActivityHistory(memberTag) {
        try {
            const allHistory = this.getAllActivityHistory();
            return allHistory[memberTag] || [];
        } catch (error) {
            console.error('Error loading activity history:', error);
            return [];
        }
    },

    /**
     * Get all activity history
     */
    getAllActivityHistory() {
        try {
            const stored = localStorage.getItem(this.KEYS.ACTIVITY_HISTORY);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error loading all activity history:', error);
            return {};
        }
    },

    /**
     * Export all data as JSON
     */
    exportData() {
        try {
            const data = {
                settings: this.getSettings(),
                clanData: this.getClanData(),
                clanSnapshots: this.loadSnapshots('clan'),
                playerSnapshots: this.loadSnapshots('player'),
                warSnapshots: this.loadSnapshots('war'),
                capitalSnapshots: this.loadSnapshots('capital'),
                activityHistory: this.getAllActivityHistory(),
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `coc-dashboard-export-${Date.now()}.json`;
            a.click();

            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error('Error exporting data:', error);
            return false;
        }
    },

    /**
     * Import data from JSON
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            if (data.settings) {
                this.saveSettings(data.settings);
            }
            if (data.clanData) {
                this.saveClanData(data.clanData);
            }
            if (data.clanSnapshots) {
                localStorage.setItem(this.KEYS.CLAN_SNAPSHOTS, JSON.stringify(data.clanSnapshots));
            }
            if (data.playerSnapshots) {
                localStorage.setItem(this.KEYS.PLAYER_SNAPSHOTS, JSON.stringify(data.playerSnapshots));
            }
            if (data.warSnapshots) {
                localStorage.setItem(this.KEYS.WAR_SNAPSHOTS, JSON.stringify(data.warSnapshots));
            }
            if (data.capitalSnapshots) {
                localStorage.setItem(this.KEYS.CAPITAL_SNAPSHOTS, JSON.stringify(data.capitalSnapshots));
            }
            if (data.activityHistory) {
                localStorage.setItem(this.KEYS.ACTIVITY_HISTORY, JSON.stringify(data.activityHistory));
            }

            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },

    /**
     * Clear all data
     */
    clearAllData() {
        try {
            Object.values(this.KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    },

    /**
     * Get storage usage information
     */
    getStorageInfo() {
        try {
            let totalSize = 0;
            const sizes = {};

            Object.entries(this.KEYS).forEach(([name, key]) => {
                const item = localStorage.getItem(key);
                const size = item ? new Blob([item]).size : 0;
                sizes[name] = size;
                totalSize += size;
            });

            // Approximate localStorage limit (usually 5-10MB)
            const limit = 5 * 1024 * 1024;

            return {
                totalSize,
                sizes,
                limit,
                percentUsed: (totalSize / limit) * 100
            };
        } catch (error) {
            console.error('Error getting storage info:', error);
            return null;
        }
    }
};

// Auto-snapshot functionality
let snapshotInterval = null;

/**
 * Start automatic snapshot collection
 */
function startAutoSnapshot() {
    const settings = Storage.getSettings();
    const intervalMinutes = settings.snapshotInterval || 60;

    // Clear existing interval
    if (snapshotInterval) {
        clearInterval(snapshotInterval);
    }

    // Set new interval
    snapshotInterval = setInterval(async () => {
        const clanData = Storage.getClanData();
        if (clanData && clanData.tag) {
            console.log('Auto-saving clan snapshot...');
            Storage.saveSnapshot('clan', clanData);
        }
    }, intervalMinutes * 60 * 1000);

    console.log(`Auto-snapshot started (every ${intervalMinutes} minutes)`);
}

/**
 * Stop automatic snapshot collection
 */
function stopAutoSnapshot() {
    if (snapshotInterval) {
        clearInterval(snapshotInterval);
        snapshotInterval = null;
        console.log('Auto-snapshot stopped');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Storage, startAutoSnapshot, stopAutoSnapshot };
}
