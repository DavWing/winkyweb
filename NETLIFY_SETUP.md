# Netlify Deployment Setup Guide

Your Netlify project is created and ready, but needs to be connected to GitHub for automatic deployment.

## 🚀 Quick Setup (5 minutes)

### Step 1: Go to Netlify Dashboard
1. Visit https://app.netlify.com
2. Sign in with your account
3. Find the project named **"winkyweb-loan-calendar"**

### Step 2: Connect Your GitHub Repository
1. Click on the site
2. Go to **Site settings** → **Build & deploy**
3. Click **Connect to Git** or **Link site to Git**
4. Select **GitHub** as your Git provider
5. Authorize Netlify to access your GitHub account
6. Select repository: **DavWing/winkyweb**
7. Select branch: **claude/webpage-supabase-netlify-deploy-vkgk9l**

### Step 3: Configure Build Settings
The following settings should auto-detect, but verify:

**Build settings:**
- **Build command**: `npm run build`
- **Publish directory**: `dist`

These match your `netlify.toml` file, so they should auto-populate.

### Step 4: Deploy
1. Click **Deploy site**
2. Netlify will automatically build and deploy
3. Your site will be live at: **https://winkyweb-loan-calendar.netlify.app**

## ✅ Verification Checklist

After deployment:
- [ ] Site is live and accessible
- [ ] Calendar displays correctly
- [ ] Month navigation works
- [ ] Modal opens when clicking dates
- [ ] "Today" button works

## 🔐 Optional: Add Supabase Integration

To connect to Supabase for storing loan data:

1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Add the following environment variables:
   ```
   VITE_SUPABASE_URL = https://nrltzseaaqoxzzsydxbl.supabase.co
   VITE_SUPABASE_KEY = [your-anon-key]
   ```
3. Get your anon key from Supabase dashboard:
   - Go to https://supabase.com/dashboard
   - Select your project: **winkyweb-loan-calendar**
   - Go to Settings → API
   - Copy the "anon" (public) key

4. After adding env vars, Netlify will automatically rebuild and deploy

## 📊 Project Information

**GitHub Repository:**
- URL: https://github.com/DavWing/winkyweb
- Branch: `claude/webpage-supabase-netlify-deploy-vkgk9l`

**Netlify Site:**
- Site ID: `1dcf385e-2fea-409a-b4e9-46b63059e5d3`
- Team: Your Netlify team
- URL: https://winkyweb-loan-calendar.netlify.app

**Supabase Project:**
- Project ID: `nrltzseaaqoxzzsydxbl`
- URL: https://supabase.com/dashboard/project/nrltzseaaqoxzzsydxbl
- Region: Asia Pacific (Singapore)

## 🔄 Continuous Deployment

After connecting GitHub:
- Every push to `claude/webpage-supabase-netlify-deploy-vkgk9l` triggers an automatic build
- Builds take 1-3 minutes
- View deployment logs in Netlify dashboard under **Deploys**

## 🆘 Troubleshooting

### Build fails with "npm not found"
- Netlify runs `npm` automatically
- Check that `package.json` exists in repo root

### Build times out
- Increase timeout in netlify.toml: `timeout = 600`
- Check node_modules size (should be < 500MB)

### Site says "Page not found"
- Wait for deployment to complete (check Deploys tab)
- Ensure branch is correctly selected
- Check netlify.toml redirect rule for SPA routing

### Need manual deployment?
Install Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📞 Support
- Netlify Docs: https://docs.netlify.com
- Supabase Docs: https://supabase.com/docs
- GitHub Pages: https://docs.github.com
