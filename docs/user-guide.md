# 使用说明书

本文档说明如何编辑网站上的各项内容和管理素材。

---

## 目录

1. [修改个人信息](#1-修改个人信息)
2. [管理全景作品](#2-管理全景作品)
3. [管理设计作品](#3-管理设计作品)
4. [管理素材文件](#4-管理素材文件)
5. [修改网站标题和描述](#5-修改网站标题和描述)
6. [修改首页文案](#6-修改首页文案)

---

## 1. 修改个人信息

**文件位置**: `src/lib/config.ts`

```ts
export const profile: Profile = {
  name: "你的名字",              // 显示在个人卡片上的名称
  avatar: "/avatar.jpg",         // 头像图片路径（文件放 assets/avatar/）
  bio: "你的个人简介",            // 一句话简介
  socials: [                     // 社交链接（可增删）
    {
      platform: "微信",          // 平台名称
      url: "#",                  // 链接地址（微信可填 "#" 表示无链接）
      icon: "wechat",           // 图标标识: wechat / weibo / mail
    },
    {
      platform: "微博",
      url: "https://weibo.com/你的微博",
      icon: "weibo",
    },
    {
      platform: "邮箱",
      url: "mailto:你的邮箱@example.com",
      icon: "mail",
    },
  ],
};
```

### 更换头像

1. 将头像图片放入 `assets/avatar/avatar.jpg`
2. 执行 `npm run sync-assets`
3. 重启服务 `./scripts/server.sh restart`

---

## 2. 管理全景作品

**文件位置**: `src/lib/works-data.ts`

### 添加新全景作品

在 `works` 数组中新增一项：

```ts
export const works: PanoramaWork[] = [
  // ... 现有作品

  {
    id: "2",                    // 唯一编号，不可重复
    title: "作品标题",           // 显示在卡片和详情页
    description: "作品描述文字",  // 详情页展示
    cover: "/works/pano-cover-2.png",  // 封面图路径
    panoramaUrl: "https://vr.shinewonder.com/pano/page/publik/pklimit?inf=你的作品代码",
    tags: ["室内", "别墅"],     // 标签（用于筛选）
    date: "2025-06-01",         // 拍摄日期（格式: YYYY-MM-DD）
    location: "项目名称或地点",   // 拍摄地点
    views: 0,                   // 浏览量（手动填写）
    featured: false,            // true=精选置顶, false=普通
  },
];
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| id | ✅ | 唯一标识，建议用递增数字 "1", "2", "3" |
| title | ✅ | 作品标题 |
| description | 可选 | 详细描述，留空填 "" |
| cover | ✅ | 封面图路径，图片放 `assets/panorama/` |
| panoramaUrl | ✅ | 全景链接（炫云/720云链接，或全景图 URL） |
| tags | 可选 | 标签数组，如 ["室内", "住宅"]，留空填 [] |
| date | 可选 | 日期，留空填 "" |
| location | 可选 | 地点，留空填 "" |
| views | 可选 | 浏览数，填 0 即可 |
| featured | 可选 | 是否精选（首页优先展示） |

### panoramaUrl 支持的格式

| 来源 | 格式示例 |
|------|---------|
| 炫云 | `https://vr.shinewonder.com/pano/page/publik/pklimit?inf=XXXXX` |
| 720云 | `https://www.720yun.com/vr/XXXXX` |
| 自托管全景图 | `https://your-cdn.com/panorama.jpg`（需要 equirectangular 格式） |

### 删除作品

直接删除 `works` 数组中对应的 `{ ... }` 条目即可。

### 修改作品顺序

调整数组中条目的先后顺序。首页只展示前 3 个。

---

## 3. 管理设计作品

**文件位置**: `src/lib/design-data.ts`

### 添加新设计作品

```ts
export const designWorks: DesignWork[] = [
  // ... 现有作品

  {
    id: "d10",                  // 唯一编号（建议 d + 数字）
    src: "/works/design-10.jpg", // 图片路径
    title: "作品名称",           // 鼠标悬浮和灯箱显示
    tags: ["客厅", "现代简约"],   // 分类标签
  },
];
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| id | ✅ | 唯一标识，建议 "d1", "d2", ... |
| src | ✅ | 图片路径，图片文件放 `assets/design/` |
| title | ✅ | 作品名称 |
| tags | 可选 | 标签数组，留空填 [] |

### 操作步骤（添加新效果图）

1. 将图片放入 `assets/design/` 目录，命名如 `design-10.jpg`
2. 编辑 `src/lib/design-data.ts`，在数组末尾添加条目
3. 执行 `npm run sync-assets`
4. 重启：`./scripts/server.sh restart`

### 首页展示数量

首页默认展示前 3 张。如需修改，编辑 `src/app/page.tsx` 中的：
```ts
<DesignGallery works={designWorks.slice(0, 3)} />
//                                         ^ 改这个数字
```

---

## 4. 管理素材文件

### 素材目录结构

```
assets/
├── design/         ← 设计效果图（会发布到网站）
├── panorama/       ← 全景封面图（会发布到网站）
├── avatar/         ← 头像文件（会发布到网站）
└── raw/            ← 原始素材存档（不发布，仅备份）
```

### 添加素材流程

1. 将文件放入对应目录
2. 执行同步：`npm run sync-assets`
3. 在数据文件中引用（路径格式：`/works/文件名`）

### 命名规范建议

| 类型 | 命名示例 |
|------|---------|
| 设计图 | `design-1.jpg`, `design-2.jpg` ... |
| 全景封面 | `pano-cover-1.png`, `pano-cover-2.png` ... |
| 头像 | `avatar.jpg` |

### 支持的图片格式

- JPG / JPEG（推荐，体积小）
- PNG（需要透明背景时使用）
- WebP（体积最小，推荐）

### 图片尺寸建议

| 用途 | 建议尺寸 | 说明 |
|------|---------|------|
| 设计效果图 | 1920×1080 或以上 | 灯箱查看需要清晰 |
| 全景封面 | 1280×720 或以上 | 卡片展示用 |
| 头像 | 400×400 | 正方形 |

---

## 5. 修改网站标题和描述

**文件位置**: `src/lib/config.ts`

```ts
export const siteConfig = {
  title: "我的全景作品集",       // 浏览器标签页标题
  description: "VR 全景摄影作品展示",  // SEO 描述
  url: "https://your-domain.com",     // 网站正式域名
};
```

---

## 6. 修改首页文案

**文件位置**: `src/app/page.tsx`

首页 Hero 区域的文案在这个文件的前 35 行：

```tsx
// 标签文字
空间设计 · VR 全景

// 主标题
用设计探索
理想空间

// 副标题
从效果图到全景漫游，沉浸式感受每一个精心设计的空间。
```

直接修改对应的中文文字即可。

---

## 完整更新流程示例

**场景：添加一个新的全景作品**

```bash
# 1. 准备封面图，放入素材库
cp ~/my-new-cover.jpg assets/panorama/pano-cover-2.png

# 2. 编辑数据文件，添加作品信息
#    打开 src/lib/works-data.ts，在数组中新增条目

# 3. 同步素材
npm run sync-assets

# 4. 重启服务查看效果
./scripts/server.sh restart

# 5. 访问 http://localhost:3000 确认
```

---

## 注意事项

1. **文件路径区分大小写** — `Design-1.jpg` 和 `design-1.jpg` 是不同的文件
2. **id 不可重复** — 每个作品的 id 必须唯一
3. **修改代码文件后需重启** — 生产模式下修改不会自动生效
4. **开发模式免重启** — 使用 `./scripts/server.sh dev` 可实时预览改动
5. **素材放 assets/ 而非 public/** — public/works/ 由脚本自动管理，手动放入会被覆盖
