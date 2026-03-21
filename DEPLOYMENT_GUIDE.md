# 🚀 Deployment Guide - Render.com

## Quick Deploy to Render

### Prerequisites
- GitHub account
- Render.com account (free tier available)
- PostgreSQL database (Render provides free tier)

---

## Step 1: Prepare Repository

### 1.1 Push to GitHub
```bash
git add .
git commit -m "Production ready deployment"
git push origin main
```

### 1.2 Verify Files
Ensure these files exist:
- ✅ `package.json` with build scripts
- ✅ `.env.example` (template)
- ✅ `vite.config.ts`
- ✅ `tsconfig.json`

---

## Step 2: Create PostgreSQL Database on Render

### 2.1 Create Database
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `litera-club-db`
   - **Database**: `litera_club`
   - **User**: (auto-generated)
   - **Region**: Choose closest to your users
   - **Plan**: Free (or paid for production)
4. Click "Create Database"

### 2.2 Get Connection String
1. Wait for database to provision (~2 minutes)
2. Copy "Internal Database URL" (starts with `postgresql://`)
3. Save this for Step 3

---

## Step 3: Create Web Service on Render

### 3.1 Create Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select your repository: `your-username/Code-Refactor-Complete`

### 3.2 Configure Service
```
Name: litera-club
Region: Same as database
Branch: main
Root Directory: Code-Refactor-Complete
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

### 3.3 Environment Variables
Add these in the "Environment" section:

```env
DATABASE_URL=<paste-internal-database-url-from-step-2>
SESSION_SECRET=<generate-random-string-32-chars>
ADMIN_CODE=<your-secret-admin-code>
NODE_ENV=production
```

**Generate SESSION_SECRET**:
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 3.4 Advanced Settings
- **Auto-Deploy**: Yes (deploys on git push)
- **Health Check Path**: `/` (optional)
- **Instance Type**: Free (or paid for production)

### 3.5 Create Service
Click "Create Web Service"

---

## Step 4: Initialize Database

### 4.1 Wait for Deployment
- First deployment takes ~5-10 minutes
- Watch build logs for errors

### 4.2 Push Database Schema
Once deployed, run from your local machine:

```bash
# Set DATABASE_URL to Render's External Database URL
export DATABASE_URL="<external-database-url>"

# Push schema
npm run db:push
```

**Alternative**: Use Render Shell
1. Go to your web service
2. Click "Shell" tab
3. Run: `npm run db:push`

### 4.3 Clean Old Data (Optional)
If migrating from existing database:
```bash
psql $DATABASE_URL < db/cleanup_crossword.sql
```

---

## Step 5: Verify Deployment

### 5.1 Check Service
1. Go to your service dashboard
2. Click the URL (e.g., `https://litera-club.onrender.com`)
3. Verify app loads

### 5.2 Test Functionality
- ✅ Homepage loads
- ✅ Navigation works
- ✅ Games page loads
- ✅ Login/Register works
- ✅ Admin panel accessible (with admin code)

### 5.3 Check Logs
1. Go to "Logs" tab
2. Look for errors
3. Verify database connection

---

## Step 6: Create Admin User

### 6.1 Register Admin
1. Go to `/login`
2. Click "Register"
3. Fill form with:
   - Name: Your name
   - Email: Your email
   - Password: Strong password
   - Admin Code: The ADMIN_CODE from env vars
4. Submit

### 6.2 Verify Admin Access
1. Login with admin credentials
2. Click admin FAB (bottom right)
3. Verify admin dashboard loads

---

## Step 7: Upload Initial Content

### 7.1 Upload Puzzles
1. Go to Admin Dashboard
2. Click "Upload Puzzle" tab
3. Upload strands puzzle:
   ```json
   {
     "grid": [["A","B","C"],["D","E","F"],["G","H","I"]],
     "words": ["WORD1", "WORD2"],
     "theme": "Theme Name"
   }
   ```
4. Upload spellbee puzzle:
   ```json
   {
     "centerLetter": "A",
     "outerLetters": ["B","C","D","E","F","G"],
     "validWords": ["WORD1", "WORD2", "WORD3"]
   }
   ```

### 7.2 Add Content
1. Click "Manage Content" tab
2. Add articles, announcements, etc.

### 7.3 Create Events
1. Click "Manage Events" tab
2. Add upcoming events

---

## Environment Variables Reference

### Required
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
SESSION_SECRET=random-32-char-string
ADMIN_CODE=your-secret-code
NODE_ENV=production
```

### Optional
```env
PORT=5000                    # Render sets this automatically
CORS_ORIGIN=*               # Or specific domain
MAX_FILE_SIZE=10485760      # 10MB
```

---

## Troubleshooting

### Build Fails
**Error**: `npm run build` fails
**Solution**: 
1. Check build logs
2. Verify `package.json` scripts
3. Ensure all dependencies in `package.json`

### Database Connection Error
**Error**: `Failed to connect to database`
**Solution**:
1. Verify DATABASE_URL is correct
2. Use "Internal Database URL" not "External"
3. Check database is running

### White Screen
**Error**: App loads but shows white screen
**Solution**:
1. Check browser console for errors
2. Verify build completed successfully
3. Check `dist/public` folder exists

### 404 on Routes
**Error**: Direct URLs return 404
**Solution**:
Add to `render.yaml`:
```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

### Session Not Persisting
**Error**: Login doesn't persist
**Solution**:
1. Verify SESSION_SECRET is set
2. Check database connection
3. Verify cookies are enabled

---

## Monitoring & Maintenance

### Check Logs
```bash
# View recent logs
render logs -s litera-club

# Follow logs
render logs -s litera-club -f
```

### Database Backups
Render automatically backs up PostgreSQL databases.

**Manual Backup**:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Update Deployment
```bash
# Push changes
git add .
git commit -m "Update"
git push origin main

# Render auto-deploys
```

### Scale Up
1. Go to service settings
2. Change instance type
3. Upgrade database plan if needed

---

## Custom Domain (Optional)

### 1. Add Domain
1. Go to service settings
2. Click "Custom Domains"
3. Add your domain

### 2. Configure DNS
Add CNAME record:
```
Type: CNAME
Name: www (or @)
Value: litera-club.onrender.com
```

### 3. Enable HTTPS
Render automatically provisions SSL certificate.

---

## Cost Estimate

### Free Tier
- Web Service: Free (spins down after 15min inactivity)
- PostgreSQL: Free (90 days, then $7/month)
- Bandwidth: 100GB/month free

### Paid Tier (Recommended for Production)
- Web Service: $7/month (always on)
- PostgreSQL: $7/month (persistent)
- Total: ~$14/month

---

## Security Checklist

Before going live:
- ✅ Change SESSION_SECRET to strong random value
- ✅ Change ADMIN_CODE to secret value
- ✅ Use strong database password
- ✅ Enable HTTPS (automatic on Render)
- ✅ Set CORS_ORIGIN to your domain
- ✅ Review environment variables
- ✅ Test authentication flow
- ✅ Verify admin access control

---

## Support

### Render Documentation
- [Render Docs](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [PostgreSQL on Render](https://render.com/docs/databases)

### Application Issues
- Check `PRODUCTION_READY_REPORT.md`
- Review build logs
- Check browser console
- Verify environment variables

---

## Quick Reference Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Push database schema
npm run db:push

# TypeScript check
npm run check

# View Render logs
render logs -s litera-club -f
```

---

**Deployment Guide Complete!** 🎉

Your application is now live and accessible to users worldwide.

**Next Steps**:
1. Test all functionality
2. Upload initial content
3. Share URL with users
4. Monitor logs for issues
5. Set up custom domain (optional)

**Live URL**: `https://your-service-name.onrender.com`
