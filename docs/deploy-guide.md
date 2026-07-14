# 部署指南

## 环境要求

| 依赖 | 最低版本 | 检查命令 |
|------|---------|---------|
| Node.js | >= 18 | `node -v` |
| npm | >= 9 | `npm -v` |
| Git | 任意（可选） | `git --version` |

> **Windows 用户**：无需手动安装 Node.js，部署脚本会自动检测并下载。

手动安装 Node.js（如需要）：
- macOS: `brew install node` 或访问 https://nodejs.org/
- Linux: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install -y nodejs`
- Windows: 下载安装包 https://nodejs.org/

---

## 快速部署（3 步完成）

### 1. 获取项目

```bash
git clone https://github.com/yyf993-cris/panorama-portfolio.git
cd panorama-portfolio
```

### 2. 一键安装

**macOS / Linux:**
```bash
./scripts/server.sh install
```

**Windows (CMD 或 PowerShell):**
```bat
scripts\server.bat install
```

该命令会自动完成：
- ✓ 检查 Node.js 版本（Windows 下缺失则自动下载安装）
- ✓ 安装所有 npm 依赖
- ✓ 初始化数据目录（`data/`）
- ✓ 同步素材库到 public 目录
- ✓ 构建生产版本

### 3. 启动服务

**macOS / Linux:**
```bash
./scripts/server.sh start
```

**Windows:**
```bat
scripts\server.bat start
```

启动后：
- **前台网站**: http://localhost:3000
- **管理后台**: http://localhost:3000/admin（仅本机可访问）

---

## 服务管理命令

### macOS / Linux

```bash
./scripts/server.sh install   # 安装依赖 + 初始化 + 构建
./scripts/server.sh start     # 启动生产服务（后台运行）
./scripts/server.sh stop      # 停止服务
./scripts/server.sh restart   # 重新构建 + 重启服务
./scripts/server.sh status    # 查看运行状态
./scripts/server.sh dev       # 开发模式（前台运行，支持热更新）
```

### Windows

```bat
scripts\server.bat install    :: 一键安装（自动下载 Node.js + 装依赖 + 构建）
scripts\server.bat start      :: 启动生产服务（后台运行）
scripts\server.bat stop       :: 停止服务
scripts\server.bat restart    :: 重新构建 + 重启服务
scripts\server.bat status     :: 查看完整运行状态
scripts\server.bat dev        :: 开发模式（前台运行，支持热更新）
scripts\server.bat update     :: 更新依赖 + 安全修复 + 重新构建
```

### 自定义端口

**macOS / Linux:**
```bash
PORT=8080 ./scripts/server.sh start
```

**Windows:**
```bat
set PORT=8080 && scripts\server.bat start
```

### 查看日志

```bash
# macOS / Linux
cat .server.log

# Windows
type .server.log
```

---

## Windows 部署详解

### 自动化能力

Windows 部署脚本（`scripts/server.bat`）具备以下智能检测功能：

| 功能 | 说明 |
|------|------|
| 自动安装 Node.js | 检测到未安装或版本低时，自动从 nodejs.org 下载免安装版到项目 `.node/` 目录，无需管理员权限 |
| 自动安装依赖 | 每次 `start`/`dev`/`restart` 前检查 `node_modules` 是否存在及是否过时 |
| 自动检测变更 | 比较 `package.json` 与 `node_modules` 时间戳，有变更则自动 `npm install` |
| 自动构建 | `start` 时检测 `.next/` 不存在则自动触发构建 |

### 一键部署流程（零基础）

在一台全新的 Windows 电脑上，只需：

```bat
:: 1. 将项目文件夹复制到电脑（或 git clone）
:: 2. 打开 CMD，进入项目目录
cd C:\Projects\panorama-portfolio

:: 3. 一键部署（自动下载 Node.js、安装依赖、构建）
scripts\server.bat install

:: 4. 启动服务
scripts\server.bat start
```

无需预装 Node.js，无需手动配置环境变量。

### 更新项目

当项目代码有变更时：

```bat
:: 拉取最新代码（如使用 Git）
git pull

:: 一键更新（升级依赖 + 安全修复 + 重新构建）
scripts\server.bat update

:: 重启服务
scripts\server.bat restart
```

### Node.js 安装位置

自动下载的 Node.js 存放在项目目录下的 `.node/` 文件夹中：
- 不影响系统环境变量
- 不需要管理员权限
- 随项目一起移动或删除即可清理

### Windows 防火墙

如需局域网访问（如让同事通过 IP 访问你的网站）：

```powershell
# 以管理员身份运行 PowerShell
New-NetFirewallRule -DisplayName "Panorama Portfolio" -Direction Inbound -Port 3000 -Protocol TCP -Action Allow
```

### 后台持久化运行

#### 方式一：PM2（推荐）

```bat
npm install -g pm2
pm2 start npm --name "panorama-portfolio" -- run start
pm2 save
```

#### 方式二：注册为 Windows 服务（NSSM）

```powershell
# 下载 NSSM: https://nssm.cc/download
nssm install PanoramaPortfolio "C:\Projects\panorama-portfolio\.node\node.exe" "node_modules\.bin\next" "start"
nssm set PanoramaPortfolio AppDirectory "C:\Projects\panorama-portfolio"
nssm start PanoramaPortfolio
```

---

## 数据管理

### 数据存储位置

```
data/
├── works.json      ← 作品数据（通过 admin 后台管理）
├── config.json     ← 站点配置（通过 admin 后台管理）
└── views.json      ← 浏览量统计（自动累加）
```

### 修改内容后是否需要重启？

| 操作 | 是否需要重启 |
|------|-------------|
| 通过 admin 后台编辑作品/配置 | ❌ 不需要，保存即生效 |
| 通过 admin 上传图片 | ❌ 不需要，即时可用 |
| 修改代码文件（.tsx/.ts/.css） | ✅ 需要重启 |
| 替换 `public/og-image.jpg` | ✅ 需要重启 |
| 手动放入 assets/ 素材 | 执行 `npm run sync-assets` 即可，无需重启 |

重启命令：
- macOS/Linux: `./scripts/server.sh restart`
- Windows: `scripts\server.bat restart`

---

## 管理后台

- 地址：http://localhost:3000/admin
- 访问限制：仅本机 IP（127.0.0.1 / ::1）可访问，外网请求返回 403
- 功能：作品增删改查、图片上传/排序/删除、站点信息编辑

---

## 外网访问

### 方式一：Cloudflare Tunnel（临时分享）

**macOS / Linux:**
```bash
# 安装（仅首次）
brew install cloudflared

# 启动隧道
cloudflared tunnel --url http://localhost:3000
```

**Windows:**
```bat
:: 下载 cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
cloudflared tunnel --url http://localhost:3000
```

会输出一个 `https://xxx.trycloudflare.com` 地址，发给对方即可访问。

注意：
- 外网用户无法访问 `/admin`（middleware 会拦截）
- 需要保持电脑不休眠、网络不断开
- 每次启动地址会变化

### 方式二：自有服务器

**Linux 服务器:**
```bash
git clone https://github.com/yyf993-cris/panorama-portfolio.git /opt/panorama-portfolio
cd /opt/panorama-portfolio
./scripts/server.sh install
PORT=80 ./scripts/server.sh start
```

**Windows Server:**
```bat
git clone https://github.com/yyf993-cris/panorama-portfolio.git C:\panorama-portfolio
cd C:\panorama-portfolio
scripts\server.bat install
set PORT=80 && scripts\server.bat start
```

建议配合 nginx / Caddy 反向代理 + HTTPS 证书使用。

---

## 常见问题

**Q: 启动报错 "port 3000 already in use"**

```bash
# macOS / Linux
PORT=3001 ./scripts/server.sh start
# 或杀掉占用进程
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill
```

```bat
:: Windows
set PORT=3001 && scripts\server.bat start
:: 或查看并结束占用进程
netstat -ano | findstr :3000
taskkill /PID <进程号> /F
```

**Q: 上传的图片不显示**

项目通过 `beforeFiles` rewrite 动态服务 build 后上传的图片。如果图片仍不显示：
1. 确认文件存在：`ls public/works/文件名`（Windows: `dir public\works\文件名`）
2. 确认服务已用最新代码启动：重启服务

**Q: CSS/JS 文件报 500**

`next start` 生产模式下，`npm run build` 后必须重启服务：
- macOS/Linux: `./scripts/server.sh restart`
- Windows: `scripts\server.bat restart`

原因：build 生成新的 chunk 文件（带新 hash），旧进程的路由映射指向旧文件名。

**Q: admin 后台改了内容但前台没变化**

正常情况下保存即生效。如果仍无变化：
1. 浏览器强制刷新（Ctrl+Shift+R / Cmd+Shift+R）
2. 确认 API 返回了新数据：`curl http://localhost:3000/api/admin/config`

**Q: 外网无法访问 admin**

这是预期行为。管理后台仅允许本机访问，外网请求返回 403 Forbidden。

**Q: Windows 下 `prebuild` 脚本报错**

旧版使用 `bash scripts/sync-assets.sh`，已更新为跨平台的 `node scripts/sync-assets.mjs`。如仍报错，确认是否使用了最新的 `package.json`。

**Q: Windows 自动下载 Node.js 失败**

可能原因：
1. 网络连接问题 — 确认能访问 https://nodejs.org/
2. 公司网络需要代理 — 手动下载安装 Node.js 后重新执行 `scripts\server.bat install`
3. PowerShell 执行策略限制 — 以管理员身份运行 `Set-ExecutionPolicy RemoteSigned`
