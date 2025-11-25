# 🚀 Deployment Guide

## Quick Deploy to Netlify

### Step 1: Prepare Your Repository

1. Initialize Git (if not already done)
```bash
cd fashion-designer-studio
git init
git add .
git commit -m "Initial commit: Fashion Designer Studio"
```

2. Create a GitHub repository
   - Go to https://github.com/new
   - Name it `fashion-designer-studio`
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. Push your code
```bash
git remote add origin https://github.com/YOUR_USERNAME/fashion-designer-studio.git
git branch -M main
git push -u origin main
```

### Step 2: Get Your API Keys

#### Anthropic API Key (Claude)
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Go to "API Keys" in the dashboard
4. Click "Create Key"
5. Copy your key (starts with `sk-ant-`)

#### OpenAI API Key (DALL-E)
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to "API Keys" section
4. Click "Create new secret key"
5. Copy your key (starts with `sk-`)

### Step 3: Deploy to Netlify

#### Option A: Using Netlify UI (Easiest)

1. Go to https://app.netlify.com/
2. Sign up or log in (can use GitHub account)
3. Click "Add new site" → "Import an existing project"
4. Choose "Deploy with GitHub"
5. Authorize Netlify to access your GitHub
6. Select your `fashion-designer-studio` repository
7. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
8. Click "Show advanced" → "Add environment variable":
   - Add `ANTHROPIC_API_KEY` with your Claude key
   - Add `OPENAI_API_KEY` with your OpenAI key
9. Click "Deploy site"

Wait 2-3 minutes for deployment to complete!

#### Option B: Using Netlify CLI

1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

2. Login to Netlify
```bash
netlify login
```

3. Initialize your site
```bash
netlify init
```

Follow the prompts:
- Create & configure a new site
- Choose your team
- Enter site name (or leave blank for random)
- Build command: `npm run build`
- Directory to deploy: `dist`
- Functions directory: `netlify/functions`

4. Set environment variables
```bash
netlify env:set ANTHROPIC_API_KEY "your_anthropic_key_here"
netlify env:set OPENAI_API_KEY "your_openai_key_here"
```

5. Deploy!
```bash
netlify deploy --prod
```

### Step 4: Access Your Site

After deployment completes, you'll get a URL like:
```
https://your-site-name.netlify.app
```

Visit it and start using your Fashion Designer Studio! 🎨

---

## Testing Locally Before Deploy

1. Create `.env` file
```bash
cp .env.example .env
```

2. Add your keys to `.env`
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-key-here
```

3. Install Netlify CLI for local testing
```bash
npm install -g netlify-cli
```

4. Run in dev mode with functions
```bash
netlify dev
```

This starts both Vite dev server AND Netlify Functions locally!

---

## Troubleshooting

### Build Fails

**Issue**: "Cannot find module..."
**Fix**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Issue**: CSS/Tailwind errors
**Fix**: Ensure you have `@tailwindcss/postcss` installed
```bash
npm install @tailwindcss/postcss
```

### Functions Not Working

**Issue**: "Function returned status code 500"
**Fix**: Check environment variables are set correctly in Netlify UI:
- Site settings → Environment variables
- Make sure keys are correct and saved

**Issue**: CORS errors
**Fix**: Netlify Functions automatically handle CORS, but if you see errors:
- Clear browser cache
- Check Network tab in DevTools for actual error
- Verify function is deployed (check Functions tab in Netlify UI)

### API Errors

**Issue**: "Invalid API key"
**Fix**:
- Verify keys are correct in Netlify environment variables
- Check keys haven't expired
- Ensure billing is set up for OpenAI

**Issue**: "Rate limit exceeded"
**Fix**:
- You're making too many requests
- Wait a few minutes
- Upgrade your API plan if needed

### Images Not Uploading

**Issue**: Upload fails
**Fix**:
- Check file size (max 10MB)
- Ensure format is JPG, PNG, or WEBP
- Check browser console for errors

---

## Custom Domain (Optional)

1. In Netlify Dashboard:
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Enter your domain (e.g., `fashionstudio.com`)

2. Configure DNS:
   - Point your domain's A record to Netlify's load balancer
   - Or use Netlify DNS for easier setup

3. Enable HTTPS (automatic with Netlify!)

---

## Updating Your Deployed Site

After making changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Netlify automatically rebuilds and redeploys! ✨

To manually trigger a deploy:
- Netlify Dashboard → Deploys → "Trigger deploy"

---

## Environment Variables Reference

Required for production:

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `ANTHROPIC_API_KEY` | Claude AI for sketch analysis | https://console.anthropic.com/ |
| `OPENAI_API_KEY` | DALL-E 3 for image generation | https://platform.openai.com/ |

---

## Cost Estimates

### Hosting (Netlify)
- **Free tier**: 100GB bandwidth, 300 build minutes/month
- Likely **$0/month** for personal use
- Pro plan: $19/month if you need more

### APIs

**Claude (Anthropic)**
- Sonnet 4: ~$3 per million input tokens, ~$15 per million output tokens
- Estimated cost: **$0.05-0.20 per sketch analysis**
- Monthly estimate: **$5-20** for moderate use

**DALL-E 3 (OpenAI)**
- Standard quality: $0.040 per image (1024x1024)
- HD quality: $0.080 per image
- Estimated: **$0.04-0.08 per generation**
- Monthly estimate: **$5-15** for moderate use

**Total estimated monthly cost: $10-35** depending on usage

---

## Security Notes

🔒 **Keep your API keys secret!**
- Never commit `.env` to Git (it's in `.gitignore`)
- Only add keys via Netlify UI or CLI
- Regenerate keys if accidentally exposed
- Consider using API key restrictions if available

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Netlify deploy logs
3. Check browser console for errors
4. Verify all environment variables are set correctly

---

**You're ready to deploy!** 🚀

Your friend is going to love this personalized fashion design tool! ✨
