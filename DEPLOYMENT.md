# Deployment Guide

This guide will help you deploy the Clash of Clans Clan Manager to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your computer (optional, can use GitHub web interface)

## Deployment Steps

### Option 1: Using GitHub Web Interface (Easiest)

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Repository name: `coc-clan-manager` (or any name you prefer)
   - Description: "Clash of Clans Clan Manager Dashboard"
   - Make it Public
   - Click "Create repository"

2. **Upload files**
   - Click "uploading an existing file"
   - Drag and drop all files from this project
   - Commit the files

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Click "Pages" in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Select branch: `main` (or `master`)
   - Select folder: `/ (root)`
   - Click "Save"

4. **Access your site**
   - Wait 1-2 minutes for deployment
   - Visit: `https://yourusername.github.io/coc-clan-manager/`
   - Your dashboard is now live!

### Option 2: Using Git Command Line

1. **Initialize and push to GitHub**

```bash
# Navigate to project directory
cd coc-neverdie

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Clash of Clans Clan Manager"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/coc-clan-manager.git

# Push to GitHub
git branch -M main
git push -u origin main
```

2. **Enable GitHub Pages** (same as Option 1, step 3)

3. **Access your site** (same as Option 1, step 4)

## Custom Domain (Optional)

If you want to use a custom domain:

1. **Add CNAME file**
   - Create a file named `CNAME` in the root directory
   - Add your domain: `clans.yourdomain.com`
   - Commit and push

2. **Configure DNS**
   - Add a CNAME record pointing to `yourusername.github.io`
   - Or A records to GitHub's IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

3. **Update GitHub Pages settings**
   - Go to Settings → Pages
   - Enter your custom domain
   - Enable "Enforce HTTPS"

## Updating Your Dashboard

### Using GitHub Web Interface

1. Navigate to the file you want to edit
2. Click the pencil icon to edit
3. Make your changes
4. Commit changes
5. GitHub Pages will auto-deploy (1-2 minutes)

### Using Git Command Line

```bash
# Make your changes

# Add changed files
git add .

# Commit
git commit -m "Description of changes"

# Push
git push origin main
```

## Troubleshooting

### Site Not Loading
- Check that GitHub Pages is enabled
- Verify the source branch is correct
- Wait a few minutes for deployment
- Clear browser cache

### 404 Error
- Ensure `index.html` is in the root directory
- Check GitHub Pages settings
- Verify repository is public

### Changes Not Showing
- GitHub Pages can take 1-2 minutes to update
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check the Actions tab for deployment status

## Monitoring

### Check Deployment Status
1. Go to your repository
2. Click "Actions" tab
3. View "pages build and deployment" workflow
4. Green checkmark = successful deployment

### View Build Logs
- Click on a deployment in Actions
- View detailed logs if something fails

## Performance Tips

1. **Enable HTTPS**: Always enforce HTTPS for security
2. **Use CDN**: All libraries are loaded from CDN (fast)
3. **Cache**: Browser will cache CSS/JS automatically
4. **Optimize Images**: If you add images, optimize them first

## Backup Your Data

Since all data is stored in browser localStorage:

1. **Regular exports**: Use Settings → Export Data
2. **Save JSON files**: Keep backups of your exports
3. **Multi-device**: Export from one device, import to another

## Advanced: Custom Actions

You can add GitHub Actions for:
- Automated testing
- Lighthouse performance checks
- Scheduled data backups

Example `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## Security Notes

- This app uses only client-side code
- No secrets or API keys needed
- All data stays in your browser
- Safe to use on public GitHub Pages

## Need Help?

- Check the main README.md
- Open an issue on GitHub
- Review GitHub Pages documentation: https://pages.github.com/

---

**Happy Clashing! 🏰**
