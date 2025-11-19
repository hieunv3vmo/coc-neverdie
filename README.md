# Clash of Clans Clan Manager 🏰

A modern, feature-rich dashboard for managing and tracking Clash of Clans clan members. Built with TailwindCSS, Flowbite, and vanilla JavaScript - perfect for GitHub Pages deployment.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 📊 Dashboard
- Real-time clan statistics
- Quick clan search by tag
- Recent activity feed
- Trophy count, member count, war stats
- Auto-refresh with configurable intervals

### 👥 Clan Overview
- Complete clan profile with badge
- Detailed statistics (level, trophies, members)
- War record (wins, losses, win rate)
- War league and capital hall information
- Clan type and requirements

### 🏆 Member Ranking
- Sortable member table
- Sort by: Name, Role, Trophies, TH Level, Donations
- Search/filter functionality
- Quick player detail view
- Role badges (Leader, Co-Leader, Elder, Member)
- Town Hall level indicators

### 🔍 Inactivity Finder
- Automatic tracking of member activity
- Configurable inactivity threshold (3-14 days)
- Trophy change tracking
- Donation activity monitoring
- Last seen timestamps
- Highlights inactive members with detailed stats

### ⚔️ War Dashboard
- Current war status
- Team comparison (stars, destruction %)
- Member attack tracking
- Missed attacks highlighting
- War performance metrics
- Attack history and statistics

### 🏛️ Capital Raids
- Raid season overview
- Capital gold contributions
- Attack participation tracking
- Top contributor rankings
- Visual charts (Chart.js)
- Weekly raid performance

### ⚙️ Settings & Configuration
- Default clan tag configuration
- Snapshot interval customization
- Inactivity threshold settings
- Data export/import (JSON)
- Clear all data option
- LocalStorage usage statistics

### 💾 Data Management
- **Auto-snapshots**: Automatic periodic data snapshots
- **Activity tracking**: Historical data for trend analysis
- **LocalStorage**: All data stored locally (no server needed)
- **Export/Import**: Backup and restore your data
- **Snapshots retained**: Last 100 snapshots per type

## 🚀 Quick Start

### Deployment to GitHub Pages

1. **Fork or clone this repository**
   ```bash
   git clone https://github.com/yourusername/coc-clan-manager.git
   cd coc-clan-manager
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main` or `master`
   - Folder: `/ (root)`
   - Save

3. **Access your dashboard**
   - Visit: `https://yourusername.github.io/coc-clan-manager/`

### Local Development

Simply open `index.html` in your browser:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Or just open the file
open index.html
```

## 📖 Usage Guide

### 1. First Time Setup

1. Open the dashboard
2. Navigate to **Settings** page
3. (Optional) Set your default clan tag
4. Configure snapshot interval (default: 60 minutes)
5. Set inactivity threshold (default: 5 days)
6. Click **Save Settings**

### 2. Loading a Clan

#### Method 1: From Dashboard
1. Enter your clan tag in the search box (e.g., `#2G9YRCRV2`)
2. Click **Load Clan**

#### Method 2: Auto-load
1. Set default clan tag in Settings
2. Clan will load automatically on next visit

### 3. Viewing Member Details

1. Go to **Member Ranking** page
2. Click **View** on any member
3. Modal shows:
   - Player profile
   - Heroes and troop levels
   - Achievements
   - Activity history (7-day)
   - Donation stats

### 4. Finding Inactive Members

1. Go to **Inactivity Finder** page
2. Select threshold (3, 5, 7, or 14 days)
3. Click **Refresh**
4. View list of inactive members with:
   - Trophy changes
   - Donation activity
   - Last seen time

### 5. Monitoring Wars

1. Go to **War Dashboard**
2. View current war status
3. Check member participation
4. Identify missed attacks
5. See performance rankings

### 6. Tracking Capital Raids

1. Go to **Capital Raids** page
2. View latest raid season stats
3. See contribution rankings
4. Check attack participation
5. Visualize data with charts

## 🔧 Configuration

### Snapshot Settings

Snapshots are automatically saved to track member activity over time.

**Default interval**: 60 minutes
**Configurable range**: 10 - 1440 minutes (24 hours)

To change:
1. Settings → Snapshot Interval
2. Enter new value (in minutes)
3. Save Settings

### Inactivity Detection

Members are flagged as inactive when:
- No trophy change in X days
- No donations in X days

**Default threshold**: 5 days
**Configurable range**: 1 - 30 days

## 🗂️ Project Structure

```
coc-neverdie/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Custom CSS styles
├── js/
│   ├── api.js              # API integration
│   ├── app.js              # Main app controller
│   ├── clan.js             # Clan features
│   ├── player.js           # Player features
│   ├── storage.js          # LocalStorage management
│   └── ui.js               # UI utilities
├── assets/
│   └── demo-data.json      # Demo data for testing
└── README.md               # This file
```

## 🌐 API Reference

This dashboard uses the **Behitek CoC API Wrapper**.

**Base URL**: `https://coc-apis.behitek.com/`

### Key Endpoints Used

- `GET /clans/{clanTag}` - Clan profile
- `GET /clans/{clanTag}/members` - Clan members
- `GET /clans/{clanTag}/currentwar` - Current war
- `GET /clans/{clanTag}/capitalraidseasons` - Capital raids
- `GET /players/{playerTag}` - Player profile

### Note on Tags

Clan and player tags must be URL-encoded:
- `#2G9YRCRV2` → `%232G9YRCRV2`

The dashboard handles this automatically.

## 💡 Features in Detail

### Activity Tracking System

The dashboard tracks member activity using snapshots:

1. **Snapshot Creation**: Clan data is saved periodically
2. **Comparison**: Current vs. historical data
3. **Metrics Calculated**:
   - Trophy changes
   - Donation increases
   - Activity score (weighted sum)
   - Last seen timestamp

### Smart Sorting

All tables support intelligent sorting:
- Click column headers to sort
- Toggle between ascending/descending
- Preserves data during sort
- Visual indicators (▲ ▼)

### Data Persistence

All data is stored in browser LocalStorage:
- **Settings**: User preferences
- **Clan Data**: Current clan snapshot
- **Snapshots**: Historical data (max 100)
- **Activity History**: Per-member tracking (30 days)

**Total Storage**: ~5-10MB (typical)

## 🎨 Customization

### Changing Colors

Edit `css/styles.css` to customize:
- Gradient backgrounds
- Badge colors
- Theme colors
- Dark mode variants

### Adding Features

The modular structure makes it easy to extend:

1. **New API Endpoint**: Add to `js/api.js`
2. **New Page**: Update `index.html` and routing
3. **New Feature**: Create in appropriate module
4. **UI Components**: Add to `js/ui.js`

## 📱 Mobile Support

Fully responsive design:
- Mobile-friendly sidebar
- Touch-optimized tables
- Responsive grid layouts
- Swipe gestures supported

## 🔒 Privacy & Security

- **No server-side storage**: All data stays in your browser
- **No authentication required**: Uses public API wrapper
- **No data collection**: Completely private
- **Export your data**: Full control over your information

## 🐛 Troubleshooting

### Clan Won't Load
- Check clan tag format (must include #)
- Verify clan exists and is not private
- Check browser console for errors
- Try refreshing the page

### Snapshots Not Working
- Ensure localStorage is enabled
- Check available storage space
- Clear old data if needed
- Verify snapshot interval in settings

### Dark Mode Issues
- Toggle theme manually
- Clear browser cache
- Check settings persistence

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Credits

- **TailwindCSS**: https://tailwindcss.com/
- **Flowbite**: https://flowbite.com/
- **Chart.js**: https://www.chartjs.org/
- **Behitek CoC API**: https://coc-apis.behitek.com/

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review demo data for examples

## 🗺️ Roadmap

Future enhancements:
- [ ] Clan war league tracking
- [ ] Player comparison tool
- [ ] Advanced analytics dashboard
- [ ] Custom notifications
- [ ] Multi-clan support
- [ ] Export to PDF/CSV
- [ ] PWA support (offline mode)
- [ ] Donation leaderboard

## 📸 Screenshots

*Add screenshots of your dashboard here*

---

**Built with ❤️ for Clash of Clans players**

**Last Updated**: December 2024
**Version**: 1.0.0
