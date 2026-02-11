# Deployment Checklist

## ✅ Pre-Deployment Checks (Completed)

### Build & Tests

- [x] Production build compiles successfully (`npm run build`)
- [x] All unit tests pass (`npm run test`)
- [x] TypeScript errors resolved
- [x] No console errors in production build

### Configuration

- [x] `.gitignore` properly configured
- [x] `.env.example` created (template for environment variables)
- [x] `metadataBase` set in `src/app/layout.tsx` (update after deployment)
- [x] All dependencies listed in `package.json`
- [x] PWA manifest configured

### Code Quality

- [x] No hardcoded localhost URLs in production code
- [x] All images properly referenced in `/public/results/`
- [x] sessionStorage persistence working
- [x] Share card export functionality tested

### Security

- [x] No environment variables exposed in client code
- [x] Dependencies audited (dev-only vulnerabilities present, safe for production)
- [x] `.env*` files in `.gitignore`

## 📋 Deployment Steps

### 1. Push to GitHub

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Bengali voter personality quiz"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/voter_type.git

# Push
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel

1. Visit [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js configuration
4. Click "Deploy"
5. Wait for deployment to complete

### 3. Post-Deployment Configuration

1. **Update metadata URL**:
   - Open `src/app/layout.tsx`
   - Replace `metadataBase` URL with your production URL:
     ```tsx
     metadataBase: new URL("https://your-app-name.vercel.app"),
     ```
   - Commit and push the change

2. **Test Production App**:
   - [ ] Visit your deployed URL
   - [ ] Complete the quiz end-to-end
   - [ ] Test result page sharing
   - [ ] Download PNG export
   - [ ] Verify OG images work (share on social media)
   - [ ] Test on mobile devices
   - [ ] Check PWA installation

3. **Optional: Custom Domain**:
   - Go to Vercel dashboard → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed
   - Update `metadataBase` URL again if using custom domain

## 🔧 Environment Variables (If Needed)

Currently, the app doesn't require environment variables. If you add any in the future:

1. Add them to Vercel: Dashboard → Settings → Environment Variables
2. Update `.env.example` with the variable names
3. Never commit `.env.local` or `.env.production`

## 📊 Monitoring

- [ ] Check Vercel Analytics for traffic
- [ ] Monitor error logs in Vercel dashboard
- [ ] Set up Vercel Web Vitals for performance tracking

## 🎉 Launch Checklist

- [ ] Production URL is live and accessible
- [ ] All pages load correctly
- [ ] OG images render properly when shared
- [ ] PNG downloads work on desktop and mobile
- [ ] Quiz completion flow works end-to-end
- [ ] Result sharing generates correct URLs

## 📝 Notes

- Dev dependencies have known vulnerabilities (vite/vitest) but these don't affect production builds
- The app uses sessionStorage for persistence (fresh quiz on new browser sessions)
- All 8 result type images must be present in `/public/results/`
- No backend or database required - fully static Next.js app
