import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const promptsConfig = JSON.parse(
  fs.readFileSync(join(__dirname, "../config/prompts.json"), "utf-8")
);

export class ContentGenerator {
  constructor() {
    this.platformTemplates = {
      tiktok: promptsConfig.tiktok,
      instagram_reels: promptsConfig.instagram_reels,
      instagram_feed: promptsConfig.instagram_feed,
      pinterest: promptsConfig.pinterest,
      linkedin: promptsConfig.linkedin,
    };
  }

  selectTheme() {
    const themes = promptsConfig.themes;
    return themes[Math.floor(Math.random() * themes.length)];
  }

  selectHook(platform) {
    const hooks = this.platformTemplates[platform]?.hooks || [];
    return hooks[Math.floor(Math.random() * hooks.length)];
  }

  buildPrompt(platform, theme, affiliateLink) {
    const template = this.platformTemplates[platform]?.template;
    if (!template) {
      throw new Error(`Unknown platform: ${platform}`);
    }

    const hook = this.selectHook(platform);
    const targetAudience = theme.target_audiences.join(", ");

    return template
      .replace("{theme}", theme.name)
      .replace("{cta_link}", affiliateLink)
      .replace("{cta}", theme.cta)
      .replace("{target_audience}", targetAudience)
      .replace("{keywords}", theme.keywords.join(", "))
      .replace("{tone}", "conversational, authentic, engaging")
      .replace("{professional_theme}", theme.name);
  }

  async generateContent(platform, theme = null, affiliateLink = null) {
    try {
      if (!theme) {
        theme = this.selectTheme();
      }

      if (!affiliateLink) {
        affiliateLink =
          process.env.AFFILIATE_BASE_URL || "https://trendib.com/register";
      }

      const prompt = this.buildPrompt(platform, theme, affiliateLink);

      const message = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = message.content[0].text;

      return {
        success: true,
        platform,
        theme: theme.name,
        content,
        hook: this.selectHook(platform),
        affiliateLink,
        generatedAt: new Date().toISOString(),
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
      };
    } catch (error) {
      return {
        success: false,
        platform,
        error: error.message,
      };
    }
  }

  async generateBatch(platforms, theme = null) {
    const results = [];
    for (const platform of platforms) {
      const result = await this.generateContent(platform, theme);
      results.push(result);
      // Small delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return results;
  }

  async generateDailyContent(allPlatforms = true) {
    const platforms = allPlatforms
      ? ["tiktok", "instagram_reels", "instagram_feed", "pinterest", "linkedin"]
      : ["tiktok", "instagram_reels", "instagram_feed"];

    return await this.generateBatch(platforms);
  }
}

export default ContentGenerator;
