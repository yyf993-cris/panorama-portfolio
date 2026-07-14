# Panorama Portfolio - 项目维护指南 (SKILL)

## 项目概述

VR 全景作品集 & 室内设计 Portfolio 网站。基于 Next.js 16 + Tailwind CSS + Pannellum + Framer Motion 构建。

- **GitHub**: https://github.com/yyf993-cris/panorama-portfolio
- **线上地址**: https://panorama-portfolio.vercel.app
- **部署方式**: GitHub push → Vercel 自动部署

---

## 目录结构与功能

```
panorama-portfolio/
│
├── src/                         # 源代码（核心）
│   ├── app/                     # Next.js App Router 页面
│   │   ├── layout.tsx           #   全局布局（Header/Footer/OG meta）
│   │   ├── page.tsx             #   首页（Hero + 个人信息 + 作品预览）
│   │   ├── globals.css          #   全局样式（暗色主题 + Tailwind v4）
│   │   ├── design/page.tsx      #   设计作品详情页（全部效果图）
│   │   ├── panorama/page.tsx    #   全景作品详情页（全部全景）
│   │   └── works/[id]/page.tsx  #   单个全景作品页（iframe/Pannellum 查看器）
│   │
│   ├── components/              # UI 组件
│   │   ├── Header.tsx           #   顶部导航栏（Server Component）
│   │   ├── MobileMenu.tsx       #   移动端汉堡菜单（Client Component）
│   │   ├── Footer.tsx           #   页脚（Server Component）
│   │   ├── ProfileCard.tsx      #   个人信息卡片
│   │   ├── WorkGrid.tsx         #   全景作品网格 + 标签筛选
│   │   ├── WorkCard.tsx         #   单个全景作品卡片
│   │   ├── DesignGallery.tsx    #   设计作品图片网格 + Lightbox
│   │   └── PanoViewer.tsx       #   全景查看器（iframe 嵌入 / Pannellum）
│   │
│   ├── lib/                     # 数据与配置
│   │   ├── config.ts            #   站点配置 + 个人信息（名字/简介/社交链接）
│   │   ├── works-data.ts        #   全景作品数据（数组，用户直接编辑）
│   │   ├── design-data.ts       #   设计作品数据（数组，用户直接编辑）
│   │   ├── types.ts             #   TypeScript 类型定义
│   │   └── notion.ts            #   Notion API 封装（备用，当前未启用）
│   │
│   └── types/                   # 全局类型声明
│       └── pannellum.d.ts       #   Pannellum 库的 TS 类型
│
├── assets/                      # 素材库（统一管理所有媒体文件）
│   ├── design/                  #   设计效果图（同步到 public/works/）
│   ├── panorama/                #   全景封面图（同步到 public/works/）
│   ├── avatar/                  #   头像（同步到 public/）
│   └── raw/                     #   原始素材存档（不发布到网站）
│
├── public/                      # 静态文件（Next.js 直接服务）
│   ├── works/                   #   ⚠️ 自动生成，勿手动修改（由 sync-assets 管理）
│   ├── og-image.jpg             #   微信分享卡片封面图（1200×630）
│   └── favicon.ico              #   网站图标
│
├── scripts/                     # 运维脚本
│   ├── server.sh                #   服务管理（install/start/stop/restart/status/dev）
│   └── sync-assets.sh           #   素材同步（assets/ → public/works/）
│
├── docs/                        # 文档（面向用户）
│   ├── deploy-guide.md          #   部署指南（环境要求/安装/启动/外网访问/FAQ）
│   └── user-guide.md            #   使用说明书（编辑内容/管理素材/微信分享/发布更新）
│
├── package.json                 # 项目依赖与脚本
├── next.config.ts               # Next.js 配置（图片域名白名单）
├── tsconfig.json                # TypeScript 配置
├── .env.local.example           # 环境变量模板（Notion 备用）
├── .gitignore                   # Git 忽略规则
└── README.md                    # 项目总览
```

---

## 关键依赖

| 包 | 用途 |
|---|------|
| next 16 | 框架（App Router, SSG） |
| tailwindcss 4 | 样式（CSS-first 配置） |
| framer-motion | 动画（入场/过渡/Lightbox） |
| pannellum | 全景查看器（equirectangular 图片渲染） |
| @notionhq/client | Notion API（备用 CMS，当前未启用） |

---

## 更新代码时的强制检查清单

**任何代码变更都必须确认以下内容是否需要同步更新：**

### ✅ 必须同步更新的文件

| 触发条件 | 必须更新 |
|---------|---------|
| 新增/删除页面路由 | `docs/user-guide.md`（目录结构说明） |
| 修改 config.ts 字段 | `docs/user-guide.md`（第1/5/7节） |
| 修改 works-data.ts 字段结构 | `docs/user-guide.md`（第2节字段说明表） |
| 修改 design-data.ts 字段结构 | `docs/user-guide.md`（第3节字段说明表） |
| 修改 scripts/ 脚本逻辑 | `docs/deploy-guide.md`（服务管理命令） |
| 新增 npm 依赖 | `docs/deploy-guide.md`（环境要求） |
| 修改素材目录结构 | `docs/user-guide.md`（第4节）+ `scripts/sync-assets.sh` |
| 修改 OG meta 标签 | `docs/user-guide.md`（第7节微信分享配置） |
| 修改部署方式 | `docs/deploy-guide.md`（外网访问章节） |
| 修改 package.json scripts | `docs/deploy-guide.md` + `README.md` |

### ⚠️ 不可遗漏的文件

以下文件是项目可维护性的核心，任何重构/大改后必须确认其准确性：

1. **`docs/deploy-guide.md`** — 部署指南（新用户能否按文档跑起来？）
2. **`docs/user-guide.md`** — 使用说明书（非技术用户能否按文档更新内容？）
3. **`scripts/server.sh`** — 部署脚本（install/start/stop/restart 是否正常工作？）
4. **`scripts/sync-assets.sh`** — 素材同步脚本（新增素材目录是否覆盖？）
5. **`README.md`** — 项目入口文档
6. **`SKILL.md`** — 本文件（目录结构是否与实际一致？）

---

## 数据流

```
用户编辑 src/lib/works-data.ts 或 design-data.ts
    ↓
用户将图片放入 assets/ 对应目录
    ↓
npm run sync-assets（自动在 prebuild 触发）
    ↓
assets/ → public/works/（复制）
    ↓
npm run build 或 ./scripts/server.sh restart
    ↓
git push → Vercel 自动部署到公网
```

---

## 开发规范

1. **样式**: Tailwind CSS v4（`@import "tailwindcss"` + `@theme inline {}`），不使用 v3 的 tailwind.config.js
2. **组件**: Server Component 为默认，需要 hooks/动画/浏览器 API 时加 `"use client"`
3. **图片**: 使用 `next/image`，本地图片通过 assets/ 管理，不直接放 public/works/
4. **动态参数**: Next.js 16 中 `params` 是 Promise，必须 `await params`
5. **类型安全**: 禁止 `as any`、`@ts-ignore`、`@ts-expect-error`
6. **构建验证**: 每次修改后运行 `npm run build` 确认无报错

---

## 常用操作速查

```bash
# 本地开发
./scripts/server.sh dev

# 生产模式
./scripts/server.sh start

# 添加素材后同步
npm run sync-assets

# 发布到线上
git add -A && git commit -m "描述" && git push

# 临时外网分享
cloudflared tunnel --url http://localhost:3000
```
