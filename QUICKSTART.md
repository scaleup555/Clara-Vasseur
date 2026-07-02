# ⚡ Trendib Quick Start Guide

Get your automation system running in 10 minutes.

## Step 1: Clone & Install (2 min)

```bash
cd /path/to/project
npm install
```

## Step 2: Configure Credentials (3 min)

### Get Your Anthropic API Key

1. Go to https://console.anthropic.com
2. Click "API Keys" in the sidebar
3. Click "Create Key"
4. Copy the key starting with `sk-ant-`

### Get Your Buffer Access Token & Profile IDs

1. Go to https://buffer.com/app/account/integrations/api
2. Create an API token
3. Copy the entire token
4. Fetch profile IDs:

```bash
BUFFER_TOKEN="your_token_here"
curl -s "https://api.bufferapp.com/1/profiles.json?access_token=$BUFFER_TOKEN" | jq '.[] | {id, service_username, service}'
```

You'll see output like:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "service_username": "@yourinstagram",
  "service": "instagram"
}
```

Copy all the `id` values.

### Create .env File

```bash
cp .env.example .env
```

Edit `.env`:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
BUFFER_ACCESS_TOKEN=xxxxxxxxxxxxxxxx
BUFFER_PROFILE_IDS=id1,id2,id3,id4
CRON_SECRET=your-secret-key-here
NODE_ENV=development
PORT=3000
```

## Step 3: Start Server (1 min)

```bash
npm run dev
```

You should see:
```
🚀 Trendib Automation Server running on port 3000
📊 Dashboard: http://localhost:3000
📡 API: http://localhost:3000/api
```

## Step 4: Open Dashboard (1 min)

Open http://localhost:3000 in your browser.

You should see:
- Empty metrics (0 content, 0 published, etc.)
- "Generate & Publish Now" button
- Empty recent publications table

**✅ Server is running!**

## Step 5: Test Content Generation (2 min)

Click the **"Generate & Publish Now"** button.

You should see:
1. Button changes to "Publishing..."
2. After ~10 seconds, shows "✅ Published!"
3. Page refreshes automatically
4. Metrics update (total content increases)
5. Recent publications table populates

**✅ Content generation works!**

## Step 6: Check Actual Social Media Posts (1 min)

Go to your Buffer dashboard: https://buffer.com/app

You should see:
- Posts in your queue (not posted yet if no Buffer premium)
- Or already posted if you have posting enabled

Go to your actual social media:
- Instagram (if BUFFER_PROFILE_IDS includes Instagram)
- TikTok (if BUFFER_PROFILE_IDS includes TikTok)
- Pinterest (if BUFFER_PROFILE_IDS includes Pinterest)

Look for new posts! They'll show up within minutes.

**✅ Posts are live on social media!**

## Step 7: Check Vercel Dashboard (Optional)

If you want to see what will happen after deployment:

```bash
# Generate content via API
curl http://localhost:3000/api/content/generate \
  -H "Content-Type: application/json" \
  -d '{"platform": "tiktok"}'

# Publish to specific platform
curl http://localhost:3000/api/publish \
  -H "Content-Type: application/json" \
  -d '{"content": "Test post", "platform": "instagram_reels"}'

# Get analytics
curl http://localhost:3000/api/analytics | jq
```

## 🎉 You're Done!

Your automation system is now:

✅ Generating content automatically  
✅ Publishing to social media  
✅ Tracking metrics on dashboard  
✅ Ready to deploy to Vercel  

## Next Steps

### Option A: Keep Testing Locally

Keep running `npm run dev` and manually click "Generate & Publish Now" multiple times to see the system in action.

### Option B: Deploy to Vercel (Production)

```bash
# 1. Commit to git
git add .
git commit -m "Test: Initial Trendib automation setup"
git push origin claude/trendib-6-week-roadmap-1llueq

# 2. Install Vercel CLI
npm i -g vercel

# 3. Link to Vercel
vercel link

# 4. Add environment variables
vercel env add ANTHROPIC_API_KEY
vercel env add BUFFER_ACCESS_TOKEN
vercel env add BUFFER_PROFILE_IDS
vercel env add CRON_SECRET

# 5. Deploy
vercel deploy --prod
```

After deployment:
- Your dashboard will be live at `https://[project-name].vercel.app`
- Cron jobs will run automatically at 9am, 2pm, 6pm UTC
- No manual intervention needed!

### Option C: Customize Content

Edit `config/prompts.json` to change:
- Content themes
- Hooks and angles
- Target audiences
- Tone by platform

Then regenerate content to see changes.

## 📊 Common Dashboard Actions

**Generate new content:**
- Click "Generate & Publish Now" button
- Or refresh page (auto-generates every 30 seconds in the background)

**Check recent posts:**
- Scroll down to "Last Publications" table
- See which platforms succeeded
- Click timestamps to see exact times

**View metrics:**
- Top cards show total content, publishes, clicks, affiliates
- Charts show performance by platform
- Updated every 30 seconds

**View recent content:**
- Scroll to "Recently Generated Content" section
- See exact text that was published
- Copy-paste to edit if needed

## ⚠️ Common Issues

**"ANTHROPIC_API_KEY not found"**
- Make sure `.env` file exists
- Restart server: `npm run dev`

**"Buffer API error"**
- Check token is copied exactly
- No extra spaces or newlines
- Try regenerating token on Buffer

**"No content generating"**
- Check Claude API has available quota
- Check internet connection
- Check logs for specific error

**"Posts not showing on social media"**
- Give it 2-5 minutes
- Check Buffer queue (might be scheduled, not posted)
- Verify profile IDs are correct

## 🚀 Ready to Go Live?

When you're confident:

1. **Push to main:**
   ```bash
   git checkout main
   git merge claude/trendib-6-week-roadmap-1llueq
   git push origin main
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel deploy --prod
   ```

3. **Monitor first week:**
   - Check dashboard daily
   - Verify posts are publishing
   - Track affiliate clicks
   - Adjust themes if needed

**That's it! You're now running a fully automated content system for Trendib.**

---

Questions? Check:
- `README.md` - Full documentation
- `OPERATIONS.md` - Daily management guide
- Logs: `npm run dev` shows real-time errors
- API: `curl http://localhost:3000/health` to verify server is running
