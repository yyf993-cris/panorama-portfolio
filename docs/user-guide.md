# 使用说明书

本文档说明如何通过管理后台编辑网站内容。

---

## 目录

1. [访问管理后台](#1-访问管理后台)
2. [管理作品](#2-管理作品)
3. [修改个人信息和站点设置](#3-修改个人信息和站点设置)
4. [管理素材文件](#4-管理素材文件)
5. [微信分享卡片配置](#5-微信分享卡片配置)
6. [日常维护](#6-日常维护)

---

## 1. 访问管理后台

浏览器打开 **http://你的服务器地址:3000/admin**

首次访问会跳转到登录页面。

### 登录

- 默认账号：`admin`
- 默认密码：`admin123`
- 输入用户名和密码后点击「登录」

### 登录限制

- 同一天内密码输入错误 **5 次**后，账号将被锁定至次日
- 锁定期间即使密码正确也无法登录
- 次日自动解锁，无需手动操作

### 退出登录

点击管理后台右上角的「退出登录」按钮。

### 忘记密码

登录页面没有重置密码入口。如忘记密码，需要联系管理员在服务器上通过命令行重置（参见部署指南中的「强制重置管理员密码」章节）。

---

## 2. 管理作品

### 作品类型

| 类型 | 说明 |
|------|------|
| 全景 (panorama) | 360° VR 全景漫游，通过炫云/720 云链接嵌入 |
| 套图 (album) | 多张图片组成一套作品，支持图文模式和多图模式查看 |

### 新增作品

1. 进入管理后台 → 作品管理
2. 点击「新增作品」
3. 选择作品类型（全景 / 套图）
4. 填写基本信息：标题、描述、标签（逗号分隔）、日期、地点
5. 全景作品：填写全景 URL（炫云/720 云链接）
6. 套图作品：点击「上传图片」上传多张图片，可编辑每张图的文案
7. 勾选「置顶」可让作品显示在首页
8. 点击「保存」

### 编辑作品

1. 在作品列表中点击「编辑」
2. 修改任意字段
3. 套图作品可：拖拽调整图片顺序、修改文案、删除图片、追加新图
4. 点击「保存」

### 删除作品

1. 在作品列表中点击「删除」
2. 确认删除

### 首页展示规则

- 首页仅展示设置了「置顶」的作品
- 首页底部有「查看更多作品」按钮，链接到全部作品页

---

## 3. 修改个人信息和站点设置

进入管理后台 → 站点设置

### 可编辑项

| 项目 | 说明 |
|------|------|
| 昵称 | 显示在个人卡片和页脚 |
| 简介 | 个人卡片上的一句话介绍 |
| 头像 | 填写图片路径（如 `/works/avatar.jpg`） |
| 社交链接 | 微信/微博/邮箱，可增删 |
| 网站标题 | 浏览器标签页标题 & 微信分享标题 |
| 网站描述 | SEO 描述 & 微信分享描述 |

### 更换头像

1. 将头像图片放入 `public/works/` 目录（如 `avatar.jpg`）
2. 在站点设置中将头像路径填写为 `/works/avatar.jpg`
3. 保存即生效

---

## 4. 管理素材文件

### 通过 admin 上传（推荐）

在作品编辑页面直接上传图片，文件会自动保存到 `public/works/` 目录。

### 手动放置素材

也可以直接将图片文件放入以下目录：

```
assets/
├── design/         ← 设计效果图
├── panorama/       ← 全景封面图
├── avatar/         ← 头像文件
└── raw/            ← 原始素材存档（不发布）
```

放入后同步到 `public/works/`：

```bash
# macOS / Linux
npm run sync-assets

# Windows（以下两种方式均可）
npm run sync-assets
```

> `npm run sync-assets` 使用跨平台 Node.js 脚本，macOS / Linux / Windows 通用。

### 图片尺寸建议

| 用途 | 建议尺寸 | 说明 |
|------|---------|------|
| 设计效果图 | 1920×1080 或以上 | 放大查看需要清晰 |
| 全景封面 | 1280×720 或以上 | 卡片展示用 |
| 头像 | 400×400 | 正方形 |

### 支持的图片格式

JPG / JPEG / PNG / WebP / GIF / SVG

---

## 5. 微信分享卡片配置

### 卡片内容来源

| 卡片元素 | 对应设置 |
|---------|---------|
| 标题 | 站点设置 → 网站标题 |
| 描述 | 站点设置 → 网站描述 |
| 封面图 | `public/og-image.jpg`（1200×630 像素） |

### 更换分享封面图

1. 准备一张 **1200×630** 像素的 JPG 图片
2. 替换 `public/og-image.jpg`
3. 重启服务：
   - macOS/Linux: `./scripts/server.sh restart`
   - Windows: `scripts\server.bat restart`

### 注意事项

- 微信有缓存，修改后可能需要等几小时才能看到新卡片
- 标题和描述通过 admin 站点设置修改即可，无需重启

---

## 6. 日常维护

### 服务管理

| 操作 | macOS / Linux | Windows |
|------|---------------|---------|
| 启动服务 | `./scripts/server.sh start` | `scripts\server.bat start` |
| 停止服务 | `./scripts/server.sh stop` | `scripts\server.bat stop` |
| 重启服务 | `./scripts/server.sh restart` | `scripts\server.bat restart` |
| 查看状态 | `./scripts/server.sh status` | `scripts\server.bat status` |
| 开发模式 | `./scripts/server.sh dev` | `scripts\server.bat dev` |
| 更新依赖 | 手动 `npm update && npm run build` | `scripts\server.bat update` |

### 更新项目代码

当有代码更新时（如从 Git 拉取了新版本）：

**macOS / Linux:**
```bash
git pull
npm install
./scripts/server.sh restart
```

**Windows:**
```bat
git pull
scripts\server.bat update
scripts\server.bat restart
```

> Windows 的 `update` 命令会自动完成：更新依赖 → 安全漏洞修复 → 同步素材 → 重新构建。

### 备份数据

建议定期备份 `data/` 目录（含管理员凭据）和 `public/works/` 目录：

```bash
# macOS / Linux
cp -r data/ data-backup-$(date +%Y%m%d)/
cp -r public/works/ works-backup-$(date +%Y%m%d)/
```

```bat
:: Windows
xcopy /E /I data data-backup-%date:~0,4%%date:~5,2%%date:~8,2%
xcopy /E /I public\works works-backup-%date:~0,4%%date:~5,2%%date:~8,2%
```

---

## 注意事项

1. **admin 后台修改即时生效** — 无需重启服务或重新构建
2. **图片路径统一为 `/works/文件名`** — 所有图片都存放在 `public/works/` 下
3. **文件名区分大小写** — `Design-1.jpg` 和 `design-1.jpg` 是不同文件
4. **管理后台需要登录** — 使用管理员账号密码登录后才能操作
5. **同一天密码错误 5 次会锁定** — 次日自动解锁
6. **浏览量自动统计** — 每次访问作品详情页自动 +1，数据存储在 `data/views.json`
