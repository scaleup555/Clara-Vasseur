# 🚀 Trendib Vercel Deployment Guide

Deploy your fully automated system to production with cron jobs.

## Pre-Deployment Checklist

- [ ] Local testing complete (`npm run dev` works)
- [ ] `.env.example` has all required variables
- [ ] All changes committed to git
- [ ] GitHub repository is up to date

## Step 1: Prepare for Vercel

### Install Vercel CLI

```bash
npm i -g vercel
```

### Verify You're in the Right Directory

```bash
pwd
# Should end with: /clara-vasseur or /trendib-automation
```

## Step 2: Link Project to Vercel

```bash
vercel link
```

Choose or create:
- **Project name:** `trendib-automation`
- **Framework:** Node.js
- **Root directory:** ./

The system will ask:
```
? Link to existing project? (y/N) n
? What's your project's name? trendib-automation
? In which directory is your code? ./
? Want to modify these settings? (y/N) n
```

This creates a `.vercel/` folder locally.

## Step 3: Set Environment Variables

Each variable must be added individually:

```bash
vercel env add ANTHROPIC_API_KEY
# Paste your key when prompted

vercel env add BUFFER_ACCESS_TOKEN
# Paste your token when prompted

vercel env add BUFFER_PROFILE_IDS
# Paste: profile_id_1,profile_id_2,profile_id_3,profile_id_4

vercel env add CRON_SECRET
# Create a random secret: openssl rand -hex 32
```

Verify they're set:

```bash
vercel env list
```

Output should show:
```
ANTHROPIC_API_KEY         Production
BUFFER_ACCESS_TOKEN       Production
BUFFER_PROFILE_IDS        Production
CRON_SECRET               Production
```

## Step 4: Deploy to Vercel

### First Deployment (Staging)

```bash
vercel
```

This deploys to a preview URL (staging).

Output shows:
```
🔗  Preview:       https://trendib-automation-abc123.vercel.app
✓ Production:      ready (to deploy, run `vercel --prod`)
```

**Test the preview URL:**
1. Open the preview URL in browser
2. Should see dashboard with 0 metrics
3. Click "Generate & Publish Now"
4. Should see content generate and publish

If it works, proceed to step 5. If not, debug:

```bash
# Check logs
vercel logs

# Look for errors in cron routes
# Verify .env variables are in Vercel (vercel env list)
# Check API keys are valid
```

### Production Deployment

Once staging works:

```bash
vercel --prod
```

This deploys to your production URL and activates cron jobs.

Output shows:
```
✓ Production:      https://trendib-automation.vercel.app
✓ Crons configured and active
```

**Your production URL is now live!**

## Step 5: Verify Cron Jobs Are Running

### Check Vercel Dashboard

1. Go to https://vercel.com
2. Select your project
3. Click "Settings" → "Crons"
4. Should see 3 cron jobs:
   - Daily: 0 9 * * * (9am UTC)
   - Afternoon: 0 14 * * * (2pm UTC)
   - Evening: 0 18 * * * (6pm UTC)

Status should show: ✅ Active

### Wait for First Scheduled Run

Crons execute at:
- **9:00 AM UTC** (1st run)
- **2:00 PM UTC** (2nd run)
- **6:00 PM UTC** (3rd run)

To see if they ran:

```bash
vercel logs --tail
```

Watch for entries like:
```
🌅 Morning publish cycle starting...
Generated 5 content pieces
Published 5/5 successfully
```

Or trigger manually:

```bash
# Replace URL with your production URL
curl https://your-production-url.vercel.app/api/cron/daily-publish \
  -H "x-vercel-cron-secret: $(cat .env | grep CRON_SECRET | cut -d= -f2)"
```

Should return:
```json
{
  "success": true,
  "message": "Morning publish completed",
  "generated": 5,
  "published": 5,
  "timestamp": "2024-07-02T09:00:00.000Z"
}
```

## Step 6: Monitor & Optimize

### Daily

Check your dashboard: `https://your-trendib.vercel.app`

Verify:
- Posts published at expected times
- No 500 errors in logs
- Affiliate clicks are registering

### Weekly

Review performance metrics from dashboard:
- Which platform got most clicks?
- Which theme resonates?
- Adjust content strategy based on data

### If Something Breaks

**Posts stopped publishing:**

```bash
vercel logs --tail | grep -i error
```

Common issues:
- Buffer token expired → regenerate and update env
- Claude API quota exceeded → check https://console.anthropic.com
- BUFFER_PROFILE_IDS outdated → refresh from Buffer API

**Update environment variable:**

```bash
vercel env rm BUFFER_ACCESS_TOKEN
vercel env add BUFFER_ACCESS_TOKEN
# Paste new token
vercel deploy --prod
```

**Restart failed cron:**

Crons auto-retry. To manually trigger:

```bash
curl https://your-domain.vercel.app/api/cron/daily-publish \
  -H "x-vercel-cron-secret: your-secret"
```

## Step 7: Scaling Configuration

### Increase Posting Frequency

Edit `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-publish",
      "schedule": "0 7 * * *"     // 7am
    },
    {
      "path": "/api/cron/afternoon-publish",
      "schedule": "0 10 * * *"    // 10am
    },
    {
      "path": "/api/cron/daily-publish",
      "schedule": "0 13 * * *"    // 1pm
    },
    {
      "path": "/api/cron/afternoon-publish",
      "schedule": "0 16 * * *"    // 4pm
    },
    {
      "path": "/api/cron/evening-publish",
      "schedule": "0 19 * * *"    // 7pm
    }
  ]
}
```

Then deploy:

```bash
git add vercel.json
git commit -m "Increase posting frequency to 5x daily"
git push
vercel deploy --prod
```

### Change Posting Times

Cron syntax: `minute hour day month day-of-week`

Examples:
- `0 9 * * *` = 9:00 AM daily
- `30 14 * * *` = 2:30 PM daily
- `0 */4 * * *` = Every 4 hours

Optimal times by platform (UTC):
- **TikTok**: 7-9am, 12pm, 7-11pm
- **Instagram**: 11am-1pm, 7-9pm
- **Pinterest**: 9-10am, 3-4pm, 8-11pm
- **LinkedIn**: 8-10am, 12pm, 5-6pm

## Step 8: Add Custom Domain (Optional)

```bash
vercel domains add your-domain.com
```

Then update DNS records as instructed.

Your dashboard will be at:
`https://your-domain.com`

## Step 9: CI/CD & Automatic Deployments

Every push to main/master automatically deploys.

To change behavior:

1. Go to Vercel dashboard → Project Settings
2. Git Integration
3. Configure which branch auto-deploys

## Monitoring & Troubleshooting

### View Logs in Real-Time

```bash
vercel logs --tail
```

### Filter for Errors

```bash
vercel logs | grep -i error
```

### Check Cron Execution History

```bash
vercel logs --since 1h --filter cron
```

### Restart Function/Cron

Vercel automatically retries failures. To manually trigger:

```bash
curl https://your-domain.vercel.app/api/cron/daily-publish \
  -H "x-vercel-cron-secret: your-secret" \
  -H "x-vercel-cron-trigger: true"
```

### Monitor Costs

Vercel free tier includes:
- Up to 100GB bandwidth/month
- 10 concurrent serverless functions
- 50 cron job invocations/day

Your system uses:
- ~2 API requests per cron = 6/day (under 50)
- ~1MB per function = 3MB/day (under 100GB)

You should stay well within free tier. Monitor at: https://vercel.com/account/billing

## Rollback to Previous Deployment

If something breaks after deploy:

```bash
vercel list
# Shows recent deployments

vercel rollback
# Prompts which deployment to rollback to

vercel logs
# Verify previous version is running
```

## Final Checklist

- [ ] Vercel project created and linked
- [ ] All 4 environment variables set
- [ ] Staging deployment works (can click "Generate & Publish")
- [ ] Production deployed with `--prod`
- [ ] 3 cron jobs active in Vercel dashboard
- [ ] Manual cron trigger works (curl test)
- [ ] Posts actually publish to social media
- [ ] Dashboard accessible at production URL
- [ ] Logs show no errors
- [ ] Affiliate registration link works

## You're Live! 🎉

Your Trendib automation system is now:

✅ Live at `https://your-trendib.vercel.app`  
✅ Publishing 3x daily automatically  
✅ Generating content via Claude AI  
✅ Tracking affiliate clicks  
✅ Running zero-cost cron jobs  

**Next:** 
1. Visit dashboard daily to monitor
2. Check logs weekly for errors
3. Adjust content strategy based on what's working
4. Increase posting frequency after 1 week if performing well

---

**Need help?**
- Logs: `vercel logs --tail`
- API docs: See `README.md`
- Operations guide: See `OPERATIONS.md`
- Quick start: See `QUICKSTART.md`
