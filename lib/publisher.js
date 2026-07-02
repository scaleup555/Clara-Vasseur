import axios from "axios";

export class SocialPublisher {
  constructor() {
    this.bufferToken = process.env.BUFFER_ACCESS_TOKEN;
    this.bufferProfileIds = (
      process.env.BUFFER_PROFILE_IDS || ""
    ).split(",");
    this.baseUrl = "https://api.bufferapp.com/1";
  }

  mapPlatformToBufferProfile(platform) {
    const profileMapping = {
      tiktok: this.bufferProfileIds[1],
      instagram_reels: this.bufferProfileIds[0],
      instagram_feed: this.bufferProfileIds[0],
      pinterest: this.bufferProfileIds[2],
      linkedin: this.bufferProfileIds[3],
    };
    return profileMapping[platform];
  }

  async publishToBuffer(content, platform, scheduleFor = null) {
    try {
      if (!this.bufferToken) {
        return {
          success: false,
          error: "Buffer API token not configured",
        };
      }

      const profileId = this.mapPlatformToBufferProfile(platform);
      if (!profileId) {
        return {
          success: false,
          error: `No Buffer profile mapped for platform: ${platform}`,
        };
      }

      const payload = {
        profile_ids: [profileId],
        text: content,
        now: !scheduleFor,
      };

      if (scheduleFor) {
        payload.scheduled_at = Math.floor(
          new Date(scheduleFor).getTime() / 1000
        );
      }

      const response = await axios.post(
        `${this.baseUrl}/updates/create.json`,
        payload,
        {
          params: {
            access_token: this.bufferToken,
          },
        }
      );

      return {
        success: true,
        platform,
        postId: response.data.id,
        bufferUrl: response.data.client_urls?.short || null,
        publishedAt: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        platform,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async publishToAllPlatforms(
    content,
    platforms = ["tiktok", "instagram_reels", "pinterest"],
    scheduleFor = null
  ) {
    const results = [];
    for (const platform of platforms) {
      const result = await this.publishToBuffer(content, platform, scheduleFor);
      results.push(result);
      // Avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return results;
  }

  async schedulePost(content, platforms, time) {
    return await this.publishToAllPlatforms(content, platforms, time);
  }

  formatContentByPlatform(rawContent, platform) {
    const platformFormatters = {
      tiktok: (content) => content.substring(0, 2200),
      instagram_reels: (content) => content.substring(0, 2200),
      instagram_feed: (content) => content.substring(0, 2200),
      pinterest: (content) => content.substring(0, 500),
      linkedin: (content) => content.substring(0, 3000),
    };

    const formatter = platformFormatters[platform] || (c) => c;
    return formatter(rawContent);
  }
}

export default SocialPublisher;
