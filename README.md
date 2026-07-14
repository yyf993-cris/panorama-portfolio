# Panorama Portfolio - VR 全景作品集

个人全景摄影作品集网站，基于 Next.js + Notion CMS + Pannellum 全景查看器。

## 技术栈

- **框架**: Next.js 16 (App Router, TypeScript)
- **样式**: Tailwind CSS v4 + Framer Motion
- **全景**: Pannellum (360° viewer)
- **数据源**: Notion Database (作为 CMS)
- **部署**: Vercel (推荐)

## 快速开始

### 1. 配置 Notion

1. 前往 [Notion Integrations](https://www.notion.so/my-integrations) 创建一个 Integration
2. 在 Notion 中创建一个数据库，包含以下属性：

| 属性名 | 类型 | 说明 |
|--------|------|------|
| Title | Title | 作品标题 |
| Description | Rich Text | 作品描述 |
| Cover | Files | 封面缩略图 |
| PanoramaUrl | URL | 全景图片地址 (equirectangular) |
| Tags | Multi-select | 分类标签 |
| Date | Date | 拍摄日期 |
| Location | Rich Text | 拍摄地点 |
| Views | Number | 浏览量 |
| Featured | Checkbox | 是否精选 |

3. 将 Integration 连接到你的数据库（数据库页面右上角 ... → Connections → 选择你的 Integration）

### 2. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的 Notion API Key 和 Database ID。

### 3. 个性化配置

编辑 `src/lib/config.ts`，更新你的个人信息（头像、昵称、简介、社交链接）。

将头像图片放入 `public/avatar.jpg`。

### 4. 本地开发

```bash
npm install
npm run dev
```

打开 http://localhost:3000 查看效果。

## 更新作品

只需在 Notion 数据库中新增一行、填写属性、上传全景图 URL 即可。网站会在下次访问时自动拉取最新数据。

如需即时更新，可在 Vercel 中配置 [ISR (Incremental Static Regeneration)](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)。

## 部署到 Vercel

1. 将项目推送到 GitHub
2. 前往 [Vercel](https://vercel.com/new) 导入仓库
3. 在 Environment Variables 中添加 `NOTION_API_KEY` 和 `NOTION_DATABASE_ID`
4. 点击 Deploy

## 项目结构

```
src/
├── app/
│   ├── layout.tsx          # 全局布局（Header + Footer）
│   ├── page.tsx            # 首页（个人信息 + 作品画廊）
│   ├── globals.css         # 全局样式
│   └── works/[id]/
│       └── page.tsx        # 作品详情页（全景查看器）
├── components/
│   ├── Header.tsx          # 导航栏
│   ├── MobileMenu.tsx      # 移动端菜单
│   ├── ProfileCard.tsx     # 个人信息卡片
│   ├── WorkGrid.tsx        # 作品网格（带标签筛选）
│   ├── WorkCard.tsx        # 单个作品卡片
│   ├── PanoViewer.tsx      # 全景查看器
│   └── Footer.tsx          # 页脚
├── lib/
│   ├── notion.ts           # Notion API 数据层
│   ├── config.ts           # 站点配置 & 个人资料
│   └── types.ts            # TypeScript 类型定义
└── types/
    └── pannellum.d.ts      # Pannellum 类型声明
```

## 全景图要求

Pannellum 支持 equirectangular 格式的全景图（2:1 比例，如 4096x2048 或 8192x4096）。

推荐存储方案：
- 阿里云 OSS + CDN
- Cloudflare R2
- AWS S3

将全景图上传到云存储后，把 URL 填入 Notion 数据库的 `PanoramaUrl` 字段即可。
