import fs from "node:fs";
import path from "node:path";
import type { Work } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const WORKS_FILE = path.join(DATA_DIR, "works.json");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");
const VIEWS_FILE = path.join(DATA_DIR, "views.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(filePath: string, fallback: T): T {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJSON(filePath: string, data: unknown) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export interface SiteConfig {
  site: { title: string; description: string; url: string };
  profile: {
    name: string;
    avatar: string;
    bio: string;
    socials: { platform: string; url: string; icon: string }[];
  };
  heroLogo?: string;
  wechatQr?: string;
}

export function getWorks(): Work[] {
  return readJSON<Work[]>(WORKS_FILE, []);
}

export function getWorkById(id: string): Work | undefined {
  return getWorks().find((w) => w.id === id);
}

export function saveWorks(works: Work[]) {
  writeJSON(WORKS_FILE, works);
}

export function getConfig(): SiteConfig {
  return readJSON<SiteConfig>(CONFIG_FILE, {
    site: { title: "", description: "", url: "" },
    profile: { name: "", avatar: "/avatar.jpg", bio: "", socials: [] },
    heroLogo: "",
    wechatQr: "",
  });
}

export function saveConfig(config: SiteConfig) {
  writeJSON(CONFIG_FILE, config);
}

export function getViews(): Record<string, number> {
  return readJSON<Record<string, number>>(VIEWS_FILE, {});
}

export function incrementView(id: string): number {
  const views = getViews();
  views[id] = (views[id] || 0) + 1;
  writeJSON(VIEWS_FILE, views);
  return views[id];
}
