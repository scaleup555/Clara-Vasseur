import ContentGenerator from "../../lib/content-generator.js";
import SocialPublisher from "../../lib/publisher.js";
import Database from "../../lib/database.js";

const contentGenerator = new ContentGenerator();
const publisher = new SocialPublisher();

export default async function handler(req, res) {
  if (req.headers["x-vercel-cron-secret"] !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    console.log(
      `[${new Date().toISOString()}] 🌤️ Afternoon publish cycle starting...`
    );

    const contentResults = await contentGenerator.generateDailyContent();

    const publishResults = [];
    for (const result of contentResults.filter((r) => r.success)) {
      Database.logContent(result);
      const pubResult = await publisher.publishToBuffer(
        result.content,
        result.platform
      );
      Database.logPublication(pubResult);
      publishResults.push(pubResult);
    }

    const successCount = publishResults.filter((p) => p.success).length;

    res.json({
      success: true,
      message: "Afternoon publish completed",
      generated: contentResults.length,
      published: successCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
