import express from "express";
import dotenv from "dotenv";
import ContentGenerator from "../lib/content-generator.js";
import SocialPublisher from "../lib/publisher.js";
import Database from "../lib/database.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const contentGenerator = new ContentGenerator();
const publisher = new SocialPublisher();

// === CONTENT GENERATION ROUTES ===

app.post("/api/content/generate", async (req, res) => {
  try {
    const { platform, theme, affiliateLink } = req.body;

    const result = await contentGenerator.generateContent(
      platform || "tiktok",
      theme,
      affiliateLink
    );

    if (result.success) {
      Database.logContent(result);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post("/api/content/generate-batch", async (req, res) => {
  try {
    const { platforms, theme } = req.body;
    const results = await contentGenerator.generateBatch(
      platforms || ["tiktok", "instagram_reels", "pinterest"],
      theme
    );

    results.forEach((r) => {
      if (r.success) Database.logContent(r);
    });

    res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/content/daily", async (req, res) => {
  try {
    const results = await contentGenerator.generateDailyContent();

    results.forEach((r) => {
      if (r.success) Database.logContent(r);
    });

    res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// === PUBLISHING ROUTES ===

app.post("/api/publish", async (req, res) => {
  try {
    const { content, platform, scheduleFor } = req.body;

    const result = await publisher.publishToBuffer(
      content,
      platform || "tiktok",
      scheduleFor
    );

    Database.logPublication(result);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post("/api/publish-batch", async (req, res) => {
  try {
    const { content, platforms, scheduleFor } = req.body;

    const results = await publisher.publishToAllPlatforms(
      content,
      platforms || ["tiktok", "instagram_reels", "pinterest"],
      scheduleFor
    );

    results.forEach((r) => Database.logPublication(r));

    res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post("/api/publish-and-schedule", async (req, res) => {
  try {
    const { platforms, scheduleFor } = req.body;

    // Generate content
    const contentResults = await contentGenerator.generateBatch(platforms);
    const publishResults = [];

    for (const contentResult of contentResults) {
      if (contentResult.success) {
        Database.logContent(contentResult);
        const pubResult = await publisher.publishToBuffer(
          contentResult.content,
          contentResult.platform,
          scheduleFor
        );
        Database.logPublication(pubResult);
        publishResults.push(pubResult);
      }
    }

    res.json({
      success: true,
      generated: contentResults.length,
      published: publishResults.filter((p) => p.success).length,
      results: {
        content: contentResults,
        publications: publishResults,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// === ANALYTICS ROUTES ===

app.get("/api/analytics", (req, res) => {
  try {
    const analytics = Database.getAnalytics();
    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/content/history", (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const content = Database.getAllContent().slice(-limit);
    res.json({
      success: true,
      count: content.length,
      data: content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/publications/history", (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const publications = Database.getAllPublications().slice(-limit);
    res.json({
      success: true,
      count: publications.length,
      data: publications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// === AFFILIATE ROUTES ===

app.post("/api/affiliates/register", (req, res) => {
  try {
    const { email, name, platform } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        error: "Email and name are required",
      });
    }

    const affiliate = Database.registerAffiliate({
      email,
      name,
      platform: platform || "direct",
      status: "active",
    });

    res.json({
      success: true,
      affiliate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/affiliates", (req, res) => {
  try {
    const affiliates = Database.getAllAffiliates();
    res.json({
      success: true,
      count: affiliates.length,
      data: affiliates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// === HEALTH CHECK ===

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// === START SERVER ===

app.listen(port, () => {
  console.log(`🚀 Trendib Automation Server running on port ${port}`);
  console.log(`📊 Dashboard: http://localhost:${port}`);
  console.log(`📡 API: http://localhost:${port}/api`);
});
