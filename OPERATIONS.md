# 📋 Trendib Operations & Management Guide

This guide details how to manage, monitor, and optimize the Trendib automation system day-by-day.

## 🎯 Weekly Operations Checklist

### Every Morning

- [ ] Check dashboard at `https://your-vercel-domain.vercel.app`
- [ ] Verify last night's automated posts went out
- [ ] Check Buffer queue for any failed publishes
- [ ] Review top-performing platform from yesterday

### Every Day

- [ ] Monitor analytics dashboard for new clicks
- [ ] Check affiliate registration rate
- [ ] Review affiliate messages for support needs
- [ ] Spot-check published content for quality

### Every Week

- [ ] Generate weekly performance report
- [ ] Identify top 3 performing posts
- [ ] Review bottom 3 performing posts and adjust themes
- [ ] Check API usage and token limits
- [ ] Update content themes based on what's working

### Every 2 Weeks

- [ ] Review affiliate payout calculations
- [ ] Identify top 10 performers
- [ ] Reach out to inactive affiliates
- [ ] Analyze platform-by-platform ROI
- [ ] Adjust cron times if needed

## 📊 Key Metrics to Track

### Daily Tracking

```
Metric                  Target          What It Means
─────────────────────────────────────────────────────
Posts Published         3/day          Automated posting working
Platform Success Rate   >95%           Publications succeeding
Affiliate Clicks        20+/day        Links getting clicks
Affiliate Signups       5-10/day       Program gaining traction
```

### Weekly Tracking

```
Metric                  Target          Action if Below
─────────────────────────────────────────────────────
Total Clicks            100+            Review hook effectiveness
Affiliate Conversions   10%             Improve onboarding
Content Quality         8/10 (manual)   Adjust prompts
Avg Engagement          Trending        Change posting times
```

## 🔧 Daily Management Tasks

### 1. Morning Check (5 min)

```bash
# SSH into Vercel (or check logs)
vercel logs --tail

# Watch for:
# - Any 500 errors in cron jobs
# - Failed API calls
# - Rate limit warnings
```

### 2. Review Yesterday's Content (10 min)

Go to dashboard → "Last Publications" section:
- Were all platforms posted to?
- Any failures? Why?
- Did content look good?

### 3. Spot-Check Affiliate Signups (5 min)

Dashboard → "Top Affiliates" section:
- Any new registrations?
- Do their names/emails look legit?
- Send personalized welcome message

### 4. Review Top Performing Post (10 min)

Dashboard → "Performance by Platform":
- Which platform got most clicks yesterday?
- Which theme performed best?
- Note it for future content focus

## 🚀 How to Respond to Problems

### Problem: Posts Not Publishing

**Check List:**
1. Is Buffer API token valid? (Expires after 1 year)
   ```bash
   curl -s "https://api.bufferapp.com/1/user.json?access_token=YOUR_TOKEN" | jq '.id'
   ```
2. Are social media accounts connected to Buffer?
3. Are `BUFFER_PROFILE_IDS` correct in `.env`?

**Fix:**
```bash
# Regenerate Buffer token:
1. Go to https://buffer.com/app/account/integrations/api
2. Create new token
3. Update Vercel env: vercel env add BUFFER_ACCESS_TOKEN
4. Redeploy: vercel deploy --prod
```

### Problem: Claude API Errors

**Check List:**
1. Is `ANTHROPIC_API_KEY` still valid?
2. Have you hit API quota?
3. Check error logs

**Fix:**
```bash
# Check API status and quota:
1. Go to https://console.anthropic.com
2. Check remaining tokens
3. Top up credit if needed
4. Regenerate API key if issues persist
```

### Problem: Low Click-Through Rate

**Analysis:**
1. Check which platforms are performing
2. Check which themes are converting
3. Review actual post content

**Optimization:**
```
Step 1: Identify pattern
  - Is TikTok clicking but not converting? → Adjust CTA
  - Is one theme repeatedly failing? → Remove from rotation
  - Is timing off? → Adjust cron schedule

Step 2: Test one change
  - Modify ONE theme's prompt
  - OR adjust posting time by 1 hour
  - Monitor for 1 week

Step 3: Measure impact
  - Compare week-to-week
  - Track by platform
  - Document what worked
```

## 📈 Growth Levers to Pull

### Lever 1: Increase Frequency

**Current:** 3 posts/day (9am, 2pm, 6pm UTC)
**Increase to:** 5 posts/day (7am, 10am, 1pm, 4pm, 8pm)

```bash
# Edit vercel.json:
# Add two more cron times
# Redeploy: vercel deploy --prod
```

**Expected impact:** +30-50% more clicks

### Lever 2: Optimize Posting Times

**By Platform Optimal Times:**
- TikTok: 6-9am, 12pm, 7-11pm
- Instagram: 11am-1pm, 7-9pm
- Pinterest: 9-10am, 3-4pm, 8-11pm
- LinkedIn: 8-10am, 12pm, 5-6pm

Current schedule hits most of these. To optimize:

1. Check analytics for platform-specific peak times
2. Adjust cron times to match
3. Monitor CTR for 1 week
4. Keep winning times

### Lever 3: A/B Test Hooks

**Current hooks:**
- "If you do X, you miss Y"
- "3 things you didn't know"
- "How [person] earns [amount] in [time]"

**Test new hooks:**
Edit `config/prompts.json` → Add to `hooks` array:
- Controversial statement hooks
- Personal story hooks
- Challenge/dare hooks
- Utility-focused hooks

Monitor performance by hook type.

### Lever 4: Target Niche Audiences

**Current:** Broad affiliate/entrepreneurship audience

**Narrow down to:**
1. Parents (Palier 1 ebook focus)
2. Thriller readers (Palier 3 focus)
3. Freelancers (side income focus)
4. Micro-influencers (influencer discount focus)

Create separate affiliate tracks with theme-specific content.

### Lever 5: Seasonal Content

**Examples:**
- Summer: "Make $ before school starts"
- October: "Spooky reads" (thriller focus)
- December: "Passive income as gift"
- January: "New Year, new income stream"

Add seasonal themes to rotation.

## 👥 Affiliate Management

### New Affiliate (First 24h)

1. **Auto-email on registration:**
   ```
   Subject: Welcome to Trendib! Here's how to start earning
   
   Hi [NAME],
   
   You're officially an affiliate! Here's your affiliate link:
   https://trendib.com/register?aff=[ID]
   
   Quick start:
   1. Share your link in 1 group today
   2. Copy the ready-made posts from your dashboard
   3. Watch for first clicks tonight
   
   Need help? Message me.
   ```

2. **Manual outreach (for first 50 affiliates):**
   - Send personalized intro
   - Include 3 ready-made posts they can use
   - Ask about their audience size

### Inactive Affiliate (1+ week no clicks)

1. **Check dashboard:** Why aren't they sharing?
2. **Diagnose via message:**
   - "No time to share?" → Offer pre-made content
   - "Don't know how?" → Show examples
   - "Audience too small?" → Suggest other angles
3. **Re-engagement offer:**
   - "Share 3x this week, I'll bonus you 1 referral"

### High-Performer Affiliate (10+ clicks)

1. **Public shout-out** (with permission)
   - "Feature" on dashboard
   - Monthly bonus (+5%)
   - Early access to new ebooks

2. **Strategic partnership**
   - Ask to record testimonial
   - Offer higher commission (35-40%)
   - Priority support

## 💰 Affiliate Payouts

### Weekly Payout Calculation

```
Steps:
1. Log all clicks by affiliate
2. Log all sales (from affiliate_id in registration)
3. Calculate: Sales × Ebook Price × Commission Rate
4. Add referral bonuses: (Referrals - 1) / 3 × 2 Ebooks
5. Send payment via Wise/PayPal
```

### Example:

```
Affiliate: Alice
- Clicks: 42
- Sales: 5
- Ebook sold: Palier 1 ($7)
- Commission rate: 30%

Revenue = 5 × $7 × 0.30 = $10.50

Referrals: 3 other affiliates signed up via her
Bonus = (3-1) / 3 × 2 × $7 = 1.33 × $7 = $9.33

Total payout: $10.50 + $9.33 = $19.83
```

## 🔍 Weekly Analytics Report Template

**Report for Week of [DATE]**

```
📊 Overall
─────────────────
Total Clicks: XXX (vs XXX last week: +/- X%)
New Affiliates: XX
Total Revenue: $XXX
Avg Clicks per Affiliate: XX

🏆 Top Performer
─────────────────
[Name]: XX clicks, $XX earned
[Name]: XX clicks, $XX earned
[Name]: XX clicks, $XX earned

📱 Platform Breakdown
─────────────────
TikTok:      XX clicks (XX%)
Instagram:   XX clicks (XX%)
Pinterest:   XX clicks (XX%)
LinkedIn:    XX clicks (XX%)

🎯 Theme Breakdown
─────────────────
Affiliation 101:    XX clicks
Success Stories:    XX clicks
Palier 1 Focus:     XX clicks
Earning Potential:  XX clicks
[etc.]

⚡ What Worked This Week
─────────────────
- [Hook type] got XXX clicks
- [Time] is optimal posting time
- [Theme] resonates with audience

💡 Action Items for Next Week
─────────────────
1. [ ] Increase [theme] by X posts
2. [ ] Test new hook: [hook idea]
3. [ ] Reach out to [X] inactive affiliates
4. [ ] Adjust cron times to [times]
```

## 🎓 Training Your Team

If scaling beyond yourself:

1. **Content Team:** 
   - Show them how prompts work
   - Let them customize themes
   - Monitor for brand consistency

2. **Affiliate Manager:**
   - Teach outreach templates
   - Show dashboard analytics
   - Set weekly conversion targets

3. **Data/Analytics:**
   - Export weekly reports
   - Identify trends
   - Recommend optimizations

## 🔐 Security Reminders

- Never commit `.env` file (it has your API keys!)
- Rotate Buffer token every 6 months
- Monitor API token usage
- Only share dashboard with trusted team
- Don't post API keys anywhere

## 📞 Troubleshooting

**Q: How do I change posting times?**
A: Edit `vercel.json` → crons → schedule. Use cron syntax (0 9 * * * = 9am daily)

**Q: How do I add a new platform?**
A: 
1. Add platform to `config/prompts.json` with its template
2. Add to `ContentGenerator.platformTemplates`
3. Add Buffer profile ID to `.env` BUFFER_PROFILE_IDS
4. Redeploy

**Q: Content quality is declining. How do I fix?**
A: 
1. Review recent generated posts
2. Update prompts in `config/prompts.json`
3. Adjust tone/audience/hooks
4. Test on one platform before rolling out

**Q: An affiliate complained about payout. How do I verify?**
A: 
1. Go to `/data/trendib.json` 
2. Search for their email in `clicks` array
3. Count their entries and cross-check with payment record
4. Look for calculation errors

---

**Keep this dashboard bookmarked:** `https://your-vercel-domain.vercel.app`

**Check it daily. Optimize weekly. Scale monthly.**
