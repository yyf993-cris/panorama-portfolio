/** 全景作品数据结构 */
export interface PanoramaWork {
  id: string;
  title: string;
  description: string;
  /** 封面缩略图 URL */
  cover: string;
  /** 全景图片 URL（equirectangular 格式） */
  panoramaUrl: string;
  /** 分类标签 */
  tags: string[];
  /** 拍摄日期 */
  date: string;
  /** 拍摄地点 */
  location: string;
  /** 浏览量 */
  views: number;
  /** 是否为精选 */
  featured: boolean;
}

/** 个人资料 */
export interface Profile {
  name: string;
  avatar: string;
  bio: string;
  /** 社交链接 */
  socials: {
    platform: string;
    url: string;
    icon: string;
  }[];
  /** 统计数据 */
  stats: {
    works: number;
    views: number;
    likes: number;
  };
}

/** Notion 数据库页面属性映射 */
export interface NotionWorkProperties {
  Title: { title: { plain_text: string }[] };
  Description: { rich_text: { plain_text: string }[] };
  Cover: { files: { file?: { url: string }; external?: { url: string } }[] };
  PanoramaUrl: { url: string | null };
  Tags: { multi_select: { name: string }[] };
  Date: { date: { start: string } | null };
  Location: { rich_text: { plain_text: string }[] };
  Views: { number: number | null };
  Featured: { checkbox: boolean };
}
