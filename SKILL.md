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
│   │   ├── page.tsx             #   首页（Hero + 个人信息 + 置顶作品 + 查看更多）
│   │   ├── globals.css          #   全局样式（暗色主题 + Tailwind v4）
│   │   └── works/
│   │       ├── page.tsx         #   全部作品列表页（全景+套图统一展示）
│   │       └── [id]/page.tsx    #   作品详情页（全景→PanoViewer / 套图→ImageAlbumViewer）
│   │
│   ├── components/              # UI 组件
│   │   ├── Header.tsx           #   顶部导航栏（Server Component）
│   │   ├── MobileMenu.tsx       #   移动端汉堡菜单（Client Component）
│   │   ├── Footer.tsx           #   页脚（Server Component）
│   │   ├── ProfileCard.tsx      #   个人信息卡片
│   │   ├── WorkGrid.tsx         #   作品网格 + 标签筛选
│   │   ├── WorkCard.tsx         #   单个作品卡片（全景/套图共用，显示类型 badge）
│   │   ├── ImageAlbumViewer.tsx  #   图片套图查看器（多图模式 + 图文模式 + Lightbox）
│   │   └── PanoViewer.tsx       #   全景查看器（iframe 嵌入 / Pannellum）
│   │
│   ├── lib/                     # 数据与配置
│   │   ├── config.ts            #   站点配置 + 个人信息（名字/简介/社交链接）
│   │   ├── works-data.ts        #   作品数据（全景+套图统一数组，用户直接编辑）
│   │   ├── types.ts             #   TypeScript 类型定义（Work/AlbumImage/Profile）
│   │   ├── data.ts              #   文件系统 JSON 读写层
│   │   ├── auth.ts              #   管理员认证（PBKDF2 密码哈希/会话/登录限制）
│   │   ├── api-auth.ts          #   API 路由鉴权辅助（requireAuth guard）
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
| next 16 | 框架（App Router, 动态渲染） |
| tailwindcss 4 | 样式（CSS-first 配置） |
| framer-motion | 动画（入场/过渡/Lightbox） |
| pannellum | 全景查看器（equirectangular 图片渲染） |
| @dnd-kit/core + sortable | 拖拽排序（admin 图片管理） |
| @notionhq/client | Notion API（备用 CMS，当前未启用） |

---

## 更新代码时的强制检查清单

**任何代码变更都必须确认以下内容是否需要同步更新：**

### ✅ 必须同步更新的文件

| 触发条件 | 必须更新 |
|---------|---------|
| 新增/删除页面路由 | `docs/user-guide.md` |
| 修改 API 路由 | `docs/deploy-guide.md`（FAQ） |
| 修改 data/*.json 结构 | `docs/user-guide.md` + admin 页面 |
| 修改 scripts/ 脚本逻辑 | `docs/deploy-guide.md`（服务管理命令） |
| 新增 npm 依赖 | `docs/deploy-guide.md`（环境要求） |
| 修改 admin 功能 | `docs/user-guide.md` |
| 修改 middleware 访问控制 | `docs/deploy-guide.md`（管理后台章节） |
| 修改认证/会话逻辑 | `docs/deploy-guide.md` + `docs/user-guide.md`（登录章节） |
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
用户访问 /admin → middleware 检查 admin_session cookie
    ↓ 无 cookie → 重定向到 /admin/login
    ↓ 有 cookie → 放行（API 层二次验证 session 有效性）

用户登录 /admin/login → POST /api/admin/auth/login
    ↓ 验证用户名+密码（PBKDF2）+ 每日5次错误限制
    ↓ 成功 → 创建 session、设置 httpOnly cookie

用户通过 admin 后台编辑作品/配置
    ↓
API Route（requireAuth 守卫）写入 data/*.json
    ↓
前台页面动态读取 JSON（force-dynamic，保存即生效）
    ↓
图片通过 beforeFiles rewrite → API serve-file 动态服务

用户通过 admin 上传图片
    ↓
API Route 写入 public/works/
    ↓
通过 rewrite 规则即时可访问（无需 rebuild）

强制重置密码 → POST /api/admin/auth/reset-password（需 ADMIN_RESET_SECRET）
    ↓ 更新密码哈希、清除登录锁定、注销所有会话
```

---

## 开发规范

1. **样式**: Tailwind CSS v4（`@import "tailwindcss"` + `@theme inline {}`），不使用 v3 的 tailwind.config.js
2. **组件**: Server Component 为默认，需要 hooks/动画/浏览器 API 时加 `"use client"`
3. **图片**: 使用 `next/image`，本地图片通过 assets/ 管理，不直接放 public/works/
4. **动态参数**: Next.js 16 中 `params` 是 Promise，必须 `await params`
5. **类型安全**: 禁止 `as any`、`@ts-ignore`、`@ts-expect-error`
6. **构建验证**: 每次修改后运行 `npm run build` 确认无报错
7. **生产模式重启**: `next build` 后必须重启 `next start` 进程，否则旧进程提供的静态 HTML 引用新 chunk hash，但进程内部路由映射仍为旧 hash，导致 CSS/JS 文件 404/500

---

## 常用操作速查

```bash
# 本地开发（热更新，无需手动重启）
./scripts/server.sh dev

# 生产模式（build 后必须 restart）
./scripts/server.sh restart

# 添加素材后同步
npm run sync-assets

# 发布到线上
git add -A && git commit -m "描述" && git push

# 临时外网分享
cloudflared tunnel --url http://localhost:3000
```

---

## 踩坑记录

### 1. `next build` 后必须重启 `next start` 进程

**现象**: 页面能打开但样式/交互全部失效，浏览器控制台显示大量 CSS/JS 文件 404 或 500。

**根因**: Next.js Turbopack 每次 build 生成的 chunk 文件名带唯一 hash（如 `0sx3vv3acgycy.css`）。`next start` 进程启动时加载当时的 build manifest 并缓存路由映射。如果在进程运行期间执行了 `next build`，新 build 的静态 HTML 页面引用了新 hash 的 chunk，但旧进程的路由映射仍指向旧 hash → 资源 404。

**修复**: build 之后立即重启服务：
```bash
./scripts/server.sh restart   # 等同于 build + kill old + start new
```

**预防**: 使用 `npm run dev`（开发模式）时不存在此问题，因为 dev server 实时编译不依赖 build 产物。

### 2. 作品数据模型（统一 Work 类型）

全景作品和图片套图使用统一的 `Work` 接口，通过 `type` 字段区分：
- `type: "panorama"` → 详情页渲染 PanoViewer（iframe / Pannellum）
- `type: "album"` → 详情页渲染 ImageAlbumViewer（多图模式 / 图文模式）

新增作品只需编辑 `src/lib/works-data.ts`，设置 `featured: true` 则首页置顶展示。
