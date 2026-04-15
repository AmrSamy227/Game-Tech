# Vercel Deployment Setup Checklist

## Quick Start

Your GameTech project is ready for deployment on Vercel! Follow these steps:

### Step 1: Connect to GitHub
1. Push your project to a GitHub repository
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" → Import your GitHub repo
4. Click "Import"

### Step 2: Set Environment Variables in Vercel

Go to: **Project Settings → Environment Variables**

Add these variables with your actual values:

```
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Configuration (Required for forms)
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your@email.com
GAME_REQUEST_EMAIL=your@email.com

# Application URL (Set after first deployment)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Step 3: Deploy
Click "Deploy" button in Vercel. The project will automatically build and deploy.

### Step 4: Update NEXT_PUBLIC_APP_URL
After the first deployment:
1. Copy your Vercel deployment URL from the dashboard
2. Add it to Environment Variables as `NEXT_PUBLIC_APP_URL`
3. Trigger a redeploy for changes to take effect

## What's Configured for Deployment

✅ **Next.js Optimization**
- Build command configured
- Output directory set
- ESLint warnings ignored for cleaner builds

✅ **Caching Strategy**
- API routes: No caching (cache-control: no-store)
- Static assets: Aggressively cached (1 year)

✅ **Error Handling**
- Proper error messages for missing configurations
- Graceful fallbacks for optional features

✅ **Security**
- Service role key only used on server
- Anonymous key used for client-side Supabase calls
- Sensitive data removed from hardcoded values

## Key Files Added

- `.vercelignore` - Optimizes deployment by excluding unnecessary files
- `vercel.json` - Vercel-specific configuration
- `DEPLOYMENT.md` - Detailed deployment guide
- `VERCEL_SETUP.md` - This file

## Common Issues & Solutions

### Build Fails: "Missing environment variable"
**Solution:** Ensure all required variables are set in Vercel project settings

### "Profile not found" after sign up
**Solution:** Verify `SUPABASE_SERVICE_ROLE_KEY` is correct in environment variables

### Images not loading
**Solution:** Update image domains in `next.config.js` or use the `NEXT_PUBLIC_APP_URL`

### Emails not sending
**Solution:** 
1. Check `RESEND_API_KEY` is valid
2. Verify email addresses in `CONTACT_EMAIL` and `GAME_REQUEST_EMAIL`
3. Check Resend dashboard for delivery logs

## Monitoring & Maintenance

- **Vercel Analytics** - Monitor performance in Vercel dashboard
- **Error Tracking** - Check deployment logs for errors
- **Database** - Supabase handles automatic backups
- **Uptime** - Vercel provides 99.9% uptime SLA

## Next Steps

1. Get your Supabase credentials from [supabase.com](https://supabase.com)
2. Get your Resend API key from [resend.com](https://resend.com)
3. Deploy to Vercel using the steps above
4. Test all features in production
5. Share your live link!

---

For more detailed information, see `DEPLOYMENT.md`