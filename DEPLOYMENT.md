# Deployment Instructions for Netlify

This project is now ready for deployment on Netlify. Follow these steps:

## Prerequisites
- Supabase project set up with the database schema
- GitHub repository with the project code

## Environment Variables Required

Set these environment variables in the Netlify UI (Site Settings > Environment variables):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Deployment Steps

1. **Connect Repository to Netlify**
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Choose your GitHub repository
   - Netlify will automatically detect Next.js settings

2. **Build Settings** (Auto-detected)
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node.js version: 20 (set in netlify.toml)

3. **Environment Variables**
   - Go to Site Settings > Environment variables
   - Add the three Supabase environment variables listed above

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your application

## Database Setup

Ensure your Supabase database has the `content_dashboard` table created with the schema from `docs/sql/`.

## Features Supported

✅ **Next.js 15 with App Router** - Full support
✅ **React Server Components** - Full support  
✅ **API Routes** - Deployed as Netlify Functions
✅ **Static Site Generation** - Optimized builds
✅ **Image Optimization** - Netlify Image CDN
✅ **Environment Variables** - Secure server-side variables
✅ **Tailwind CSS** - Stable v3 configuration
✅ **TypeScript** - All type errors resolved

## Build Optimizations Applied

- Removed experimental Turbopack flag for production
- Downgraded Tailwind CSS from v4 to stable v3
- Fixed all TypeScript type errors
- Resolved ESLint issues
- Added proper Tailwind configuration
- **Updated to Node.js 20 for Next.js 15 compatibility**
- **Removed @netlify/plugin-nextjs in favor of native Netlify support**
- **Added redirect rules for _next/static assets to fix 404 errors**

## Post-Deployment Testing

After deployment, test these features:
1. Content calendar views (Grid, Calendar, Kanban)
2. Post creation and editing
3. Drag and drop functionality
4. Settings page
5. Database connectivity
6. Image loading from Supabase Storage

## Troubleshooting

### **Static Asset 404 Errors (_next/static/*)**

If you encounter 404 errors or MIME type issues with static assets:

1. **Verify Redirect Rules**: Ensure the redirect rules in `netlify.toml` are present:
   ```toml
   [[redirects]]
     from = "/_next/static/*"
     to = "/.next/static/:splat"
     status = 200
   ```

2. **Check Build Output**: Verify the `.next` directory is being published correctly
3. **Clear Cache**: Try a fresh deploy with cache cleared in Netlify UI
4. **Alternative Plugin Approach**: If issues persist, temporarily re-add `@netlify/plugin-nextjs`

### **Next.js 15 Compatibility Issues**

1. **Turbopack Build Issues**: If using Turbopack causes problems, use standard webpack builds:
   ```json
   "scripts": {
     "dev": "next dev",
     "build": "next build"
   }
   ```

2. **Caching Problems**: Next.js 15 changed default caching behavior. Add explicit caching if needed:
   ```javascript
   // In route handlers or data fetching
   export const revalidate = 3600; // 1 hour
   ```

### **General Issues**

1. **Build Failures**: Check the build logs in Netlify for specific errors
2. **Database Connection**: Verify environment variables are set correctly
3. **Images Not Loading**: Check Supabase Storage bucket permissions
4. **API Errors**: Ensure RLS policies are configured in Supabase

### **Alternative Deployment Methods**

If native Netlify support doesn't work:

1. **Static Export Method**:
   ```javascript
   // next.config.ts
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: { unoptimized: true }
   };
   ```
   Set `publish = "out"` in netlify.toml and add `NETLIFY_NEXT_PLUGIN_SKIP=true` environment variable.

2. **Plugin Fallback**: Re-add `@netlify/plugin-nextjs` if needed:
   ```bash
   npm install --save-dev @netlify/plugin-nextjs@latest
   ```

## Environment Variables Reference

| Variable | Purpose | Where to Find |
|----------|---------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public Supabase project URL | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for client-side | Supabase Dashboard > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for server-side | Supabase Dashboard > Settings > API |

The project is now fully prepared for Netlify deployment with zero configuration needed beyond environment variables!