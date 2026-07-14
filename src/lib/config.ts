import type { Profile } from "./types";

/**
 * 站点配置 - 修改此文件更新个人信息
 * 如果不想硬编码，也可以从 Notion 单独一个页面读取
 */
export const siteConfig = {
  title: "我的全景作品集",
  description: "VR 全景摄影作品展示",
  url: "https://your-domain.com",
};

export const profile: Profile = {
  name: "Your Name",
  avatar: "/avatar.jpg",
  bio: "VR 全景摄影师 | 用镜头记录世界每一个角落",
  socials: [
    {
      platform: "微信",
      url: "#",
      icon: "wechat",
    },
    {
      platform: "微博",
      url: "https://weibo.com/yourname",
      icon: "weibo",
    },
    {
      platform: "邮箱",
      url: "mailto:your@email.com",
      icon: "mail",
    },
  ],
  stats: {
    works: 0, // 将从 Notion 动态获取
    views: 0,
    likes: 0,
  },
};
