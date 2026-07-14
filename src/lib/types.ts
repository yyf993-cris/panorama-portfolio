/** 套图中的单张图片 */
export interface AlbumImage {
  src: string;
  caption: string;
}

/** 作品类型 */
export type WorkType = "panorama" | "album";

/** 统一作品数据结构 */
export interface Work {
  id: string;
  title: string;
  description: string;
  /** 封面缩略图 URL */
  cover: string;
  /** 作品类型：panorama=全景漫游，album=图片套图 */
  type: WorkType;
  /** 分类标签 */
  tags: string[];
  /** 拍摄/创作日期 */
  date: string;
  /** 地点 */
  location: string;
  /** 浏览量 */
  views: number;
  /** 是否为置顶作品（首页展示） */
  featured: boolean;
  /** 全景图 URL（type=panorama 时使用） */
  panoramaUrl?: string;
  /** 套图图片列表（type=album 时使用） */
  images?: AlbumImage[];
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
