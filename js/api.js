/**
 * API Module for Clash of Clans Dashboard
 * Handles all API requests to the Behitek CoC Wrapper
 */

const API = {
    BASE_URL: 'https://coc-apis.behitek.com',

    /**
     * Encode clan/player tag for URL (#TAG -> %23TAG)
     */
    encodeTag(tag) {
        if (!tag) return '';
        // Remove any existing # and add it back
        tag = tag.trim().replace(/^#/, '');
        return '%23' + tag;
    },

    /**
     * Generic fetch wrapper with error handling
     */
    async fetch(endpoint) {
        try {
            const url = `${this.BASE_URL}${endpoint}`;
            console.log('Fetching:', url);

            const response = await fetch(url);

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: error.message };
        }
    },

    // ==================== PLAYERS ====================

    /**
     * Get player profile
     * @param {string} playerTag - Player tag (with or without #)
     */
    async getPlayer(playerTag) {
        const encodedTag = this.encodeTag(playerTag);
        return await this.fetch(`/players/${encodedTag}`);
    },

    /**
     * Verify player token
     * @param {string} playerTag - Player tag
     * @param {string} token - Verification token
     */
    async verifyPlayerToken(playerTag, token) {
        try {
            const encodedTag = this.encodeTag(playerTag);
            const url = `${this.BASE_URL}/players/${encodedTag}/verifytoken`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Verify token error:', error);
            return { success: false, error: error.message };
        }
    },

    // ==================== CLANS ====================

    /**
     * Search clans by name
     * @param {string} name - Clan name to search
     */
    async searchClans(name) {
        return await this.fetch(`/clans?name=${encodeURIComponent(name)}`);
    },

    /**
     * Get clan profile
     * @param {string} clanTag - Clan tag (with or without #)
     */
    async getClan(clanTag) {
        const encodedTag = this.encodeTag(clanTag);
        return await this.fetch(`/clans/${encodedTag}`);
    },

    /**
     * Get clan members
     * @param {string} clanTag - Clan tag
     */
    async getClanMembers(clanTag) {
        const encodedTag = this.encodeTag(clanTag);
        return await this.fetch(`/clans/${encodedTag}/members`);
    },

    /**
     * Get clan war log
     * @param {string} clanTag - Clan tag
     */
    async getClanWarLog(clanTag) {
        const encodedTag = this.encodeTag(clanTag);
        return await this.fetch(`/clans/${encodedTag}/warlog`);
    },

    /**
     * Get current clan war
     * @param {string} clanTag - Clan tag
     */
    async getCurrentWar(clanTag) {
        const encodedTag = this.encodeTag(clanTag);
        return await this.fetch(`/clans/${encodedTag}/currentwar`);
    },

    /**
     * Get current war league group
     * @param {string} clanTag - Clan tag
     */
    async getWarLeagueGroup(clanTag) {
        const encodedTag = this.encodeTag(clanTag);
        return await this.fetch(`/clans/${encodedTag}/currentwar/leaguegroup`);
    },

    /**
     * Get clan capital raid seasons
     * @param {string} clanTag - Clan tag
     */
    async getCapitalRaidSeasons(clanTag) {
        const encodedTag = this.encodeTag(clanTag);
        return await this.fetch(`/clans/${encodedTag}/capitalraidseasons`);
    },

    // ==================== LEAGUES ====================

    /**
     * Get all leagues
     */
    async getLeagues() {
        return await this.fetch('/leagues');
    },

    /**
     * Get league by ID
     * @param {string} leagueId - League ID
     */
    async getLeague(leagueId) {
        return await this.fetch(`/leagues/${leagueId}`);
    },

    // ==================== LOCATIONS ====================

    /**
     * Get all locations
     */
    async getLocations() {
        return await this.fetch('/locations');
    },

    /**
     * Get location by ID
     * @param {string} locationId - Location ID
     */
    async getLocation(locationId) {
        return await this.fetch(`/locations/${locationId}`);
    },

    /**
     * Get player rankings for a location
     * @param {string} locationId - Location ID
     */
    async getPlayerRankings(locationId) {
        return await this.fetch(`/locations/${locationId}/rankings/players`);
    },

    /**
     * Get clan rankings for a location
     * @param {string} locationId - Location ID
     */
    async getClanRankings(locationId) {
        return await this.fetch(`/locations/${locationId}/rankings/clans`);
    },

    // ==================== LABELS ====================

    /**
     * Get clan labels
     */
    async getClanLabels() {
        return await this.fetch('/labels/clans');
    },

    /**
     * Get player labels
     */
    async getPlayerLabels() {
        return await this.fetch('/labels/players');
    },

    // ==================== GOLD PASS ====================

    /**
     * Get current gold pass season
     */
    async getGoldPass() {
        return await this.fetch('/goldpass');
    },

    // ==================== WAR LEAGUES ====================

    /**
     * Get all war leagues
     */
    async getWarLeagues() {
        return await this.fetch('/warleagues');
    },

    /**
     * Get war league by ID
     * @param {string} leagueId - War league ID
     */
    async getWarLeague(leagueId) {
        return await this.fetch(`/warleagues/${leagueId}`);
    },

    // ==================== BUILDER BASE ====================

    /**
     * Get builder base leagues
     */
    async getBuilderBaseLeagues() {
        return await this.fetch('/builderbase/leagues');
    },

    // ==================== HELPER FUNCTIONS ====================

    /**
     * Get comprehensive clan data (clan + members + war + capital)
     * @param {string} clanTag - Clan tag
     */
    async getComprehensiveClanData(clanTag) {
        try {
            // Fetch all data in parallel
            const [clanResult, warResult, capitalResult] = await Promise.allSettled([
                this.getClan(clanTag),
                this.getCurrentWar(clanTag),
                this.getCapitalRaidSeasons(clanTag)
            ]);

            const data = {
                clan: null,
                war: null,
                capital: null,
                errors: []
            };

            // Process clan data
            if (clanResult.status === 'fulfilled' && clanResult.value.success) {
                data.clan = clanResult.value.data;
            } else {
                data.errors.push('Failed to fetch clan data');
            }

            // Process war data
            if (warResult.status === 'fulfilled' && warResult.value.success) {
                data.war = warResult.value.data;
            } else {
                // War data might not be available (not in war)
                data.war = null;
            }

            // Process capital data
            if (capitalResult.status === 'fulfilled' && capitalResult.value.success) {
                data.capital = capitalResult.value.data;
            } else {
                data.errors.push('Failed to fetch capital data');
            }

            return {
                success: data.clan !== null,
                data,
                errors: data.errors
            };
        } catch (error) {
            console.error('Error fetching comprehensive clan data:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    /**
     * Batch fetch player details
     * @param {Array<string>} playerTags - Array of player tags
     */
    async batchGetPlayers(playerTags) {
        try {
            const promises = playerTags.map(tag => this.getPlayer(tag));
            const results = await Promise.allSettled(promises);

            const players = [];
            const errors = [];

            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value.success) {
                    players.push(result.value.data);
                } else {
                    errors.push({
                        tag: playerTags[index],
                        error: result.reason || 'Unknown error'
                    });
                }
            });

            return {
                success: true,
                players,
                errors
            };
        } catch (error) {
            console.error('Error in batch fetch:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    /**
     * Calculate war performance metrics
     * @param {Object} warData - War data from API
     */
    calculateWarMetrics(warData) {
        if (!warData || warData.state === 'notInWar') {
            return null;
        }

        const metrics = {
            state: warData.state,
            teamSize: warData.teamSize,
            attacksPerMember: warData.attacksPerMember || 2,
            clan: {
                name: warData.clan?.name,
                stars: warData.clan?.stars || 0,
                destruction: warData.clan?.destructionPercentage || 0,
                attacks: warData.clan?.attacks || 0
            },
            opponent: {
                name: warData.opponent?.name,
                stars: warData.opponent?.stars || 0,
                destruction: warData.opponent?.destructionPercentage || 0,
                attacks: warData.opponent?.attacks || 0
            },
            members: []
        };

        // Process member performance
        if (warData.clan?.members) {
            metrics.members = warData.clan.members.map(member => {
                const attacksUsed = member.attacks?.length || 0;
                const totalStars = member.attacks?.reduce((sum, atk) => sum + (atk.stars || 0), 0) || 0;
                const totalDestruction = member.attacks?.reduce((sum, atk) => sum + (atk.destructionPercentage || 0), 0) || 0;

                return {
                    tag: member.tag,
                    name: member.name,
                    townhallLevel: member.townhallLevel,
                    mapPosition: member.mapPosition,
                    attacksUsed,
                    attacksMissed: metrics.attacksPerMember - attacksUsed,
                    totalStars,
                    totalDestruction,
                    avgDestruction: attacksUsed > 0 ? totalDestruction / attacksUsed : 0
                };
            });

            // Sort by stars (desc), then destruction (desc)
            metrics.members.sort((a, b) => {
                if (b.totalStars !== a.totalStars) {
                    return b.totalStars - a.totalStars;
                }
                return b.totalDestruction - a.totalDestruction;
            });
        }

        return metrics;
    },

    /**
     * Calculate capital raid metrics
     * @param {Object} capitalData - Capital raid seasons data
     */
    calculateCapitalMetrics(capitalData) {
        if (!capitalData || !capitalData.items || capitalData.items.length === 0) {
            return null;
        }

        const latestSeason = capitalData.items[0];

        const metrics = {
            state: latestSeason.state,
            startTime: latestSeason.startTime,
            endTime: latestSeason.endTime,
            capitalTotalLoot: latestSeason.capitalTotalLoot || 0,
            raidsCompleted: latestSeason.raidsCompleted || 0,
            totalAttacks: latestSeason.totalAttacks || 0,
            enemyDistrictsDestroyed: latestSeason.enemyDistrictsDestroyed || 0,
            offensiveReward: latestSeason.offensiveReward || 0,
            defensiveReward: latestSeason.defensiveReward || 0,
            members: []
        };

        // Process member contributions
        if (latestSeason.members) {
            metrics.members = latestSeason.members.map(member => ({
                tag: member.tag,
                name: member.name,
                attacks: member.attacks || 0,
                attackLimit: member.attackLimit || 0,
                bonusAttackLimit: member.bonusAttackLimit || 0,
                capitalResourcesLooted: member.capitalResourcesLooted || 0
            }));

            // Sort by capital resources looted (desc)
            metrics.members.sort((a, b) => b.capitalResourcesLooted - a.capitalResourcesLooted);
        }

        return metrics;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
