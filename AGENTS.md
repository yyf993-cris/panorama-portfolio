<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 代码地图 (CODEMAP)

## 项目概述

全景摄影作品集网站。Next.js 16 + React 19 + Tailwind CSS 4 + framer-motion。
数据存储：本地 JSON 文件（`data/`）。备选数据源：Notion API（`src/lib/notion.ts`，当前未在页面中直接使用）。
部署：Node.js 服务端渲染，`force-dynamic` 页面。

## 核心类型 (`src/lib/types.ts`)

```ts
WorkType = "panorama" | "album"

Work { id, title, description, cover, type: WorkType, tags[], date, location, views, featured, panoramaUrl?, images?: AlbumImage[] }
AlbumImage { src, caption }
Profile { name, avatar, bio, socials[], stats: { works, views } }
SiteConfig { site: { title, description, url }, profile: { name, avatar, bio, socials[] }, heroLogo?, wechatQr? }
```

## 数据层 (`src/lib/`)

| 文件 | 职责 | 导出 | 被谁引用 |
|------|------|------|----------|
| `types.ts` | 类型定义 | Work, AlbumImage, WorkType, Profile, NotionWorkProperties | 几乎所有文件 |
| `data.ts` | JSON 文件读写（`data/` 目录） | getWorks, getWorkById, saveWorks, getConfig, saveConfig, getViews, incrementView, SiteConfig | 页面、API routes、config.ts |
| `config.ts` | 站点配置/个人资料的便捷读取 | getSiteConfig, getProfile | Header, ProfileCard, Footer |
| `auth.ts` | 管理员认证（pbkdf2 + session token） | authenticate, createSession, validateSession, destroySession, forceResetPassword, isLockedOut | API auth routes, api-auth.ts |
| `api-auth.ts` | API 路由鉴权中间件 | requireAuth(request) → 401 或 null | 所有 /api/admin/* routes（除 auth） |
| `works-data.ts` | 废弃/简易封装，直接调 getWorks() | works（常量） | 未被引用（可删除） |
| `notion.ts` | Notion API 客户端 | getWorks, getWorkById（async） | 当前未被页面引用，仅备用 |

## 组件依赖图 (`src/components/`)

```
layout.tsx
├── ThemeProvider        ← next-themes 封装，"use client"
├── PortfolioShell       ← 判断 /admin 路径隐藏 header/footer，"use client"
│   ├── Header           ← 服务端组件，读 getSiteConfig()
│   │   ├── MobileMenu   ← "use client"，framer-motion 汉堡菜单
│   │   └── ThemeToggle  ← "use client"，亮/暗切换
│   └── Footer           ← 服务端组件，读 getProfile() + getConfig()
│       └── FooterSocialLinks ← "use client"，微信二维码弹窗

page.tsx (首页)
├── ProfileCard          ← 服务端组件，读 getProfile() + getConfig()
│   ├── TotalViewsCounter ← "use client"，fetch /api/views
│   └── SocialLinks       ← "use client"，微信二维码弹窗（Portal）
└── WorkGrid             ← "use client"，标签筛选 + fetch /api/views
    └── WorkCard          ← "use client"，framer-motion 卡片动画

works/[id]/page.tsx (作品详情)
├── PanoViewer           ← "use client"，三种渲染模式：embed/pannellum/external
├── ImageAlbumViewer     ← "use client"，gallery/story 两种模式 + lightbox
└── ViewCounter          ← "use client"，POST /api/views/:id 递增浏览量

HeroLogo                 ← "use client"，GIF 用 img、其他用 next/image（当前未被引用）
```

## 页面路由

| 路径 | 文件 | 渲染 | 功能 |
|------|------|------|------|
| `/` | `app/page.tsx` | 服务端 dynamic | 首页：ProfileCard + 置顶作品 WorkGrid |
| `/works` | `app/works/page.tsx` | 服务端 dynamic | 全部作品列表 |
| `/works/[id]` | `app/works/[id]/page.tsx` | 服务端 dynamic | 作品详情：全景/套图查看器 + 元信息 |
| `/admin` | `app/admin/page.tsx` | — | 管理后台首页 |
| `/admin/login` | `app/admin/login/page.tsx` | — | 登录页 |
| `/admin/works/[id]` | `app/admin/works/[id]/page.tsx` | — | 作品编辑 |
| `/admin/config` | `app/admin/config/page.tsx` | — | 站点配置编辑 |

## API 路由

| 路径 | 方法 | 鉴权 | 功能 |
|------|------|------|------|
| `/api/views` | GET | 无 | 返回 `{ total, details }` 全部浏览量 |
| `/api/views/[id]` | GET | 无 | 返回单个作品浏览量 |
| `/api/views/[id]` | POST | 无 | 递增浏览量并返回新值 |
| `/api/admin/auth/login` | POST | 无 | 登录 `{ username, password }` → set cookie |
| `/api/admin/auth/logout` | POST | cookie | 登出，清除 session |
| `/api/admin/auth/check` | GET | cookie | 检查 session 有效性 |
| `/api/admin/auth/reset-password` | POST | env secret | 强制重置密码 `{ secret, newPassword }` |
| `/api/admin/works` | GET | cookie | 获取所有作品 |
| `/api/admin/works` | POST | cookie | 创建作品 |
| `/api/admin/works` | PUT | cookie | 重排作品顺序 `{ ids: string[] }` |
| `/api/admin/works/[id]` | GET | cookie | 获取单个作品 |
| `/api/admin/works/[id]` | PUT | cookie | 更新作品 |
| `/api/admin/works/[id]` | DELETE | cookie | 删除作品 |
| `/api/admin/config` | GET | cookie | 获取站点配置 |
| `/api/admin/config` | PUT | cookie | 更新站点配置 |
| `/api/admin/upload` | POST | cookie | 上传文件到 `public/works/` |
| `/api/admin/upload` | DELETE | cookie | 删除已上传文件 |
| `/api/serve-file/[...path]` | GET | 无 | 静态文件服务（`public/works/`） |

## 鉴权流程

```
middleware.ts → 拦截 /admin/* 和 /api/admin/*
  ├── 白名单放行: /admin/login, /api/admin/auth/login, /api/admin/auth/reset-password
  ├── 无 cookie → 页面重定向 /admin/login，API 返回 401
  └── 有 cookie → 放行（middleware 不验证 token 有效性，由 requireAuth 二次验证）

requireAuth (api-auth.ts) → 在每个 admin API handler 内调用
  └── validateSession(token) → 检查 token 存在且未过期（24h）
```

## 数据流

```
写入: 管理后台 → POST/PUT /api/admin/works → saveWorks() → data/works.json
读取: 前台页面 → getWorks() → fs.readFileSync data/works.json → 服务端渲染
浏览量: ViewCounter POST /api/views/:id → incrementView() → data/views.json
配置: 管理后台 → PUT /api/admin/config → saveConfig() → data/config.json
上传: 管理后台 → POST /api/admin/upload → 写入 public/works/ → 返回 URL
```

## 关键约定

- **样式**: Tailwind CSS 4，自定义 CSS 变量（`--background`, `--foreground`, `--border`, `--surface`, `--muted` 等）
- **动画**: framer-motion（WorkCard, WorkGrid, MobileMenu, ImageAlbumViewer, SocialLinks）
- **图片**: next/image（`<Image>`），GIF 例外用原生 `<img>`
- **服务端/客户端分界**: 页面组件 = 服务端（读 data），交互组件 = "use client"
- **数据存储**: 全部 JSON 文件，无数据库
- **Route handler 参数**: `params` 是 `Promise`（Next.js 16 breaking change），需 `await params`

## 行为准则

### 1. 先想后写

- 动手前先说明你的理解和假设，不确定就问，不要猜
- 存在多种解读时列出选项，不要默默选一个跑
- 有更简单的方案时必须指出，该 push back 就 push back
- 遇到困惑立刻停下来，说清楚哪里不明白

### 2. 极简优先

- 不加没被要求的功能
- 单次使用的逻辑不做抽象
- 不加没被要求的"灵活性"或"可配置性"
- 不为不可能的场景写错误处理
- 200 行能用 50 行解决的，重写成 50 行
- 检验标准：一个高级工程师会说这过度设计了吗？是就简化

### 3. 精确修改

- 不"顺手改进"相邻的代码、注释或格式
- 不重构没坏的东西
- 匹配现有代码风格，即使你会用不同方式写
- 发现无关的死代码，提一嘴但不要删
- 你的改动导致的孤儿代码（多余的 import/变量/函数）必须清理
- 原本就存在的死代码不要碰，除非被要求
- 检验标准：每一行改动都应能直接追溯到用户的请求

### 4. 目标驱动

- 把任务转化为可验证的目标：
  - "加验证" → 先写无效输入的测试，再让测试通过
  - "修 bug" → 先写复现测试，再让测试通过
  - "重构 X" → 确保重构前后测试都通过
- 多步任务先列计划：`[步骤] → 验证: [检查方式]`
- 注意：本项目当前无测试框架，验证方式以 `lsp_diagnostics` + `npm run build` 为主

## 改动检查清单

1. **改动前** — 查代码地图定位影响范围
2. **改动中** — 只改必须改的，保持现有模式（JSON 存储、组件粒度、Tailwind、framer-motion），bugfix 不夹带 refactor
3. **改动后** — 如果新增/删除/重命名了文件、修改了类型定义、增减了 API 路由、改变了组件依赖关系，必须在同一次提交中更新本 AGENTS.md 的代码地图
4. **改动后** — 检查 `docs/deploy-guide.md` 和 `docs/user-guide.md`，如果代码改动影响了部署流程、命令、环境变量、数据目录结构、管理后台操作方式等，必须同步更新对应文档
