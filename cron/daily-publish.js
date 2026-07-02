import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

async function runDailyPublish() {
  console.log(`\n[${new Date().toISOString()}] 📱 Starting daily publish cycle...`);

  try {
    // Step 1: Generate content for all platforms
    console.log("1️⃣ Generating content for TikTok, Instagram Reels, and Pinterest...");

    const generateResponse = await fetch(`${API_BASE_URL}/api/content/daily`, {
      method: "GET",
    });

    const generateData = await generateResponse.json();

    if (!generateData.success) {
      console.error("❌ Content generation failed:", generateData.error);
      return;
    }

    console.log(`✅ Generated ${generateData.count} content pieces`);
    generateData.results.forEach((r) => {
      if (r.success) {
        console.log(`   • ${r.platform}: ${r.content.substring(0, 50)}...`);
      }
    });

    // Step 2: Publish immediately to all platforms
    console.log("\n2️⃣ Publishing content to social media...");

    const publishPromises = generateData.results
      .filter((r) => r.success)
      .map((contentResult) =>
        fetch(`${API_BASE_URL}/api/publish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: contentResult.content,
            platform: contentResult.platform,
          }),
        }).then((r) => r.json())
      );

    const publishResults = await Promise.all(publishPromises);
    const successCount = publishResults.filter((p) => p.success).length;

    console.log(`✅ Published ${successCount}/${publishResults.length} posts`);
    publishResults.forEach((r) => {
      if (r.success) {
        console.log(`   • ${r.platform}: Posted successfully`);
      } else {
        console.error(`   ❌ ${r.platform}: ${r.error}`);
      }
    });

    // Step 3: Log analytics
    console.log("\n3️⃣ Fetching current analytics...");

    const analyticsResponse = await fetch(`${API_BASE_URL}/api/analytics`);
    const analyticsData = await analyticsResponse.json();

    if (analyticsData.success) {
      const analytics = analyticsData.data;
      console.log(`📊 Total content generated: ${analytics.totalContentGenerated}`);
      console.log(`📊 Total published: ${analytics.totalPublished}`);
      console.log(
        `📊 Total clicks: ${analytics.totalClicks} (this week: ${analytics.last7Days.clicks})`
      );
      console.log(`👥 Active affiliates: ${analytics.affiliateCount}`);
    }

    console.log(
      `\n✨ Daily publish cycle completed at ${new Date().toISOString()}\n`
    );
  } catch (error) {
    console.error("❌ Error during daily publish:", error.message);
  }
}

// Run immediately
await runDailyPublish();

// Optional: Schedule for next run (would be handled by Vercel cron or similar)
export { runDailyPublish };
