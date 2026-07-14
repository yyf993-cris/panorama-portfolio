import { getConfig } from "./data";
import type { Profile } from "./types";

export function getSiteConfig() {
  return getConfig().site;
}

export function getProfile(): Profile {
  const config = getConfig();
  return {
    ...config.profile,
    stats: { works: 0, views: 0 },
  };
}
