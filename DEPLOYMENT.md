# GameTech - Deployment Guide

## Prerequisites

Before deploying to Vercel, ensure you have:

1. **Vercel Account** - [Create one at vercel.com](https://vercel.com)
2. **GitHub Repository** - Push your code to GitHub
3. **Supabase Project** - Database and authentication setup
4. **Resend Account** (Optional) - For email notifications

## Environment Variables Required

Set these in Vercel Project Settings → Environment Variables:

### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for server-side operations)

### Email Configuration
- `RESEND_API_KEY` - Your Resend API key
- `CONTACT_EMAIL` - Email address to receive contact form submissions
- `GAME_REQUEST_EMAIL` - Email address to receive game requests

### Application Configuration
- `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., `https://your-domain.com`)

## Deployment Steps

### 1. Connect GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Click "Import"

### 2. Configure Environment Variables
1. In the Vercel project settings, go to "Environment Variables"
2. Add all required environment variables (listed above)
3. Make sure they're set for Production environment

### 3. Database Setup
The database migrations are automatically handled by Supabase. Ensure your Supabase project has the following tables:

- `profiles` - User profile information
  - `id` (uuid) - Primary key
  - `username` (text) - Unique username
  - `display_name` (text) - Display name
  - `bio` (text, nullable) - User biography
  - `avatar_url` (text, nullable) - Avatar image URL
  - `background_url` (text, nullable) - Profile background URL

### 4. Deploy
1. All pushes to your main branch will automatically deploy
2. Monitor deployment in the Vercel dashboard
3. Check build logs if there are any issues

## Post-Deployment

1. **Test Authentication**
   - Test sign up at `/tracker`
   - Test sign in with created account
   - Verify profile page loads

2. **Test Email Services**
   - Test contact form submission
   - Test game request submission
   - Verify emails arrive at configured addresses

3. **Verify Configuration**
   - Check that all pages load correctly
   - Verify search functionality works
   - Test game detail pages
   - Check tracker features

## Troubleshooting

### "Profile not found" Error
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Verify the `profiles` table exists in Supabase
- Check that the user was created successfully

### Email Not Sending
- Verify `RESEND_API_KEY` is valid
- Check that `CONTACT_EMAIL` and `GAME_REQUEST_EMAIL` are set
- Review Resend dashboard for delivery status

### Build Failures
- Check the build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify Node.js version compatibility (14.0+)

## Performance Optimization

The project is configured with:
- Image optimization disabled for compatibility
- ESLint warnings ignored during build
- Fast refresh enabled for development

For production optimization:
- Enable image optimization in `next.config.js` once you configure image domains
- Use Vercel Analytics to monitor performance
- Set up proper caching headers

## Database Backups

Supabase automatically backs up your data. To export:
1. Go to Supabase dashboard
2. Navigate to your project
3. Use the database backup features in Settings
