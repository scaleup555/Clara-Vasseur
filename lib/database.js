import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DATA_DIR = process.env.DATA_DIR || "./data";
const DB_FILE = path.join(DATA_DIR, "trendib.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDb() {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    return {
      content: [],
      publications: [],
      affiliates: [],
      clicks: [],
      analytics: {
        totalContentGenerated: 0,
        totalPublished: 0,
        totalClicks: 0,
        lastUpdated: new Date().toISOString(),
      },
    };
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function saveDb(db) {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export class Database {
  static logContent(contentData) {
    const db = loadDb();
    const record = {
      id: uuidv4(),
      ...contentData,
      createdAt: new Date().toISOString(),
    };
    db.content.push(record);
    db.analytics.totalContentGenerated++;
    db.analytics.lastUpdated = new Date().toISOString();
    saveDb(db);
    return record;
  }

  static logPublication(publicationData) {
    const db = loadDb();
    const record = {
      id: uuidv4(),
      ...publicationData,
      createdAt: new Date().toISOString(),
    };
    db.publications.push(record);
    if (publicationData.success) {
      db.analytics.totalPublished++;
    }
    db.analytics.lastUpdated = new Date().toISOString();
    saveDb(db);
    return record;
  }

  static logClick(affiliateId, platform, theme) {
    const db = loadDb();
    const record = {
      id: uuidv4(),
      affiliateId,
      platform,
      theme,
      timestamp: new Date().toISOString(),
    };
    db.clicks.push(record);
    db.analytics.totalClicks++;
    db.analytics.lastUpdated = new Date().toISOString();
    saveDb(db);
    return record;
  }

  static registerAffiliate(affiliateData) {
    const db = loadDb();
    const record = {
      id: uuidv4(),
      ...affiliateData,
      createdAt: new Date().toISOString(),
      clicks: 0,
      conversions: 0,
    };
    db.affiliates.push(record);
    saveDb(db);
    return record;
  }

  static getAnalytics() {
    const db = loadDb();
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const recentPublications = db.publications.filter(
      (p) => new Date(p.createdAt) > last7Days
    );

    const recentClicks = db.clicks.filter(
      (c) => new Date(c.timestamp) > last7Days
    );

    const platformBreakdown = {};
    const themeBreakdown = {};

    recentPublications.forEach((p) => {
      platformBreakdown[p.platform] =
        (platformBreakdown[p.platform] || 0) + (p.success ? 1 : 0);
    });

    recentClicks.forEach((c) => {
      themeBreakdown[c.theme] = (themeBreakdown[c.theme] || 0) + 1;
    });

    return {
      ...db.analytics,
      last7Days: {
        publicationsAttempted: recentPublications.length,
        publicationsSuccessful: recentPublications.filter(
          (p) => p.success
        ).length,
        clicks: recentClicks.length,
        platformBreakdown,
        themeBreakdown,
      },
      affiliateCount: db.affiliates.length,
      topAffiliates: db.affiliates
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10),
    };
  }

  static getAllContent() {
    const db = loadDb();
    return db.content;
  }

  static getAllPublications() {
    const db = loadDb();
    return db.publications;
  }

  static getAllAffiliates() {
    const db = loadDb();
    return db.affiliates;
  }
}

export default Database;
