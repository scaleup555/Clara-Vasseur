# 🚀 Trendib - Fully Automated Content Generation & Publishing System

A complete end-to-end automation system for generating high-converting social media content and publishing it across multiple platforms.

## 🎯 What This Does

✅ **Generate** contextually optimized content for TikTok, Instagram, Pinterest, LinkedIn using Claude AI  
✅ **Publish** automatically to all platforms via Buffer API  
✅ **Schedule** content for optimal posting times  
✅ **Track** performance metrics across platforms and affiliates  
✅ **Monitor** everything via a beautiful real-time dashboard  

## 🏗️ Architecture

```
Frontend: Express.js + Static HTML Dashboard
    ↓
API Layer: /api/content, /api/publish, /api/analytics
    ↓
Core Services:
  - ContentGenerator (Claude 3.5 Sonnet)
  - SocialPublisher (Buffer API)
  - Database (JSON-based)
    ↓
Automation: Vercel Cron (3x daily: 9am, 2pm, 6pm)
    ↓
Outputs: TikTok, Instagram, Pinterest, LinkedIn
```

## 📋 Prerequisites

- **Anthropic API Key** (Claude API access)
- **Buffer Account** with connected social profiles (Instagram, TikTok, Pinterest, LinkedIn)
- **Node.js 18+**
- **Vercel Account** (for deployment & cron jobs)

## 🔧 Setup

### 1. Clone and Install

```bash
git clone https://github.com/scaleup555/clara-vasseur
cd clara-vasseur
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your credentials:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
BUFFER_ACCESS_TOKEN=xxxxx
BUFFER_PROFILE_IDS=instagram_id,tiktok_id,pinterest_id,linkedin_id
CRON_SECRET=your-secret-key
```

#### Getting Your Credentials

**Anthropic API Key:**
1. Go to https://console.anthropic.com
2. Create an API key
3. Copy it to `ANTHROPIC_API_KEY`

**Buffer Access Token & Profile IDs:**
1. Go to https://buffer.com/app/account/integrations/api
2. Create an API token
3. Use the Buffer API to get your profile IDs:
   ```bash
   curl -s "https://api.bufferapp.com/1/profiles.json?access_token=YOUR_TOKEN" | jq '.[] | {id, service_username}'
   ```

### 3. Connect Social Media to Buffer

1. Log into Buffer (https://buffer.com/app)
2. Connect Instagram, TikTok, Pinterest, LinkedIn accounts
3. Add your profile IDs to the `.env` file

## 🚀 Running Locally

### Start the Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Dashboard

Open http://localhost:3000 in your browser. You'll see:
- Real-time metrics
- Recent publications
- Generated content
- Affiliate performance
- Quick action buttons

### Manual Content Generation & Publishing

**Generate content for one platform:**
```bash
curl -X POST http://localhost:3000/api/content/generate \
  -H "Content-Type: application/json" \
  -d '{"platform": "tiktok"}'
```

**Generate & publish for all platforms:**
```bash
curl http://localhost:3000/api/content/daily
```

**Publish specific content:**
```bash
curl -X POST http://localhost:3000/api/publish \
  -H "Content-Type: application/json" \
  -d '{"content": "Your post text", "platform": "instagram_reels"}'
```

## 📊 API Endpoints

### Content Generation

- `POST /api/content/generate` - Generate content for one platform
- `POST /api/content/generate-batch` - Generate for multiple platforms
- `GET /api/content/daily` - Generate daily batch for all platforms
- `GET /api/content/history` - View generated content history

### Publishing

- `POST /api/publish` - Publish to one platform
- `POST /api/publish-batch` - Publish to multiple platforms
- `POST /api/publish-and-schedule` - Generate AND publish in one request
- `GET /api/publications/history` - View publication history

### Analytics

- `GET /api/analytics` - Real-time performance metrics
- `GET /api/affiliates` - Registered affiliates
- `POST /api/affiliates/register` - Register new affiliate

## ⏰ Automation (Vercel)

Cron jobs run automatically:

- **9:00 AM UTC** - Morning content push
- **2:00 PM UTC** - Afternoon engagement boost
- **6:00 PM UTC** - Evening activity peak

Each cron:
1. Generates fresh content for all platforms
2. Publishes immediately
3. Logs metrics to dashboard

## 📈 How to Boost Affiliate Signups

### Content Strategy

The system generates content around 6 core themes:

1. **Affiliation 101** - Explain what affiliate marketing is
2. **Success Stories** - Share affiliate earnings/testimonials
3. **Palier 1 Focus** - Promote "100 réponses pour enfants curieux"
4. **Palier 3 Focus** - Promote "Les dernières heures avant la tempête"
5. **Earning Potential** - Show commission structure ($, %)
6. **Referral Mechanic** - Explain the 3-friend bonus

### Hook Patterns

Each platform uses platform-specific hooks:

- **TikTok**: Question hooks, shock numbers, authority
- **Instagram Reels**: Transformation/revelation, fast pacing
- **Pinterest**: Promise-driven, SEO-optimized, actionable
- **LinkedIn**: Professional insights, lessons learned

## 🎨 Customizing Content

Edit `config/prompts.json` to:

- Add new themes/topics
- Change hooks and angles
- Adjust tone by platform
- Target different audiences

Example theme addition:

```json
{
  "name": "Success Stories",
  "description": "Real affiliate earnings",
  "keywords": ["affiliate", "income", "passive"],
  "cta": "Become an affiliate",
  "target_audiences": ["entrepreneurs", "freelancers"]
}
```

## 📊 Dashboard Features

- **Metrics cards**: Total content, publications, clicks, affiliates
- **Performance charts**: Breakdown by platform, theme
- **Publication log**: Success rate, timing, status
- **Content gallery**: Recent generated posts
- **Affiliate leaderboard**: Top performers by clicks
- **Quick actions**: Generate & publish on demand

## 🔐 Security

- Environment variables for all secrets
- CORS configured for safe API access
- Optional cron secret validation
- No sensitive data in logs

## 🐛 Troubleshooting

### "Buffer API token not configured"

Make sure `BUFFER_ACCESS_TOKEN` is in your `.env` file.

### "Claude API rate limited"

The system adds automatic delays between requests. If still hitting limits, check your API quota at https://console.anthropic.com

### Content not generating

1. Check `ANTHROPIC_API_KEY` is valid
2. Verify API key has sufficient quota
3. Check logs: `npm run dev` shows real-time errors

### Publications failing

1. Verify Buffer profile IDs are correct
2. Check Buffer token isn't expired
3. Ensure social media accounts are connected to Buffer

## 📈 Scaling Tips

1. **Increase cadence**: Add more cron times (5x daily = more visibility)
2. **Vary hooks**: The system randomizes hooks per post
3. **Target niches**: Adjust themes for different affiliate audiences
4. **A/B test**: Track clicks by platform to find winners
5. **Team collaboration**: Share dashboard with team for real-time monitoring

## 🚀 Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Add Trendib automation system"
git push origin claude/trendib-6-week-roadmap-1llueq
```

### 2. Connect to Vercel

```bash
npm i -g vercel
vercel link
vercel env add ANTHROPIC_API_KEY
vercel env add BUFFER_ACCESS_TOKEN
vercel env add BUFFER_PROFILE_IDS
vercel env add CRON_SECRET
```

### 3. Deploy

```bash
vercel deploy --prod
```

Your automation system is now live and running crons automatically!

## 📞 Support

Check logs via:

```bash
# Local
npm run dev

# Vercel (after deployment)
vercel logs
```

## 📄 License

MIT
