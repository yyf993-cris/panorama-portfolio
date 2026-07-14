# 部署指南

## 环境要求

| 依赖 | 最低版本 | 检查命令 |
|------|---------|---------|
| Node.js | >= 18 | `node -v` |
| npm | >= 9 | `npm -v` |
| Git | 任意 | `git --version` |

如未安装 Node.js：
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

```bash
./scripts/server.sh install
```

该命令会自动完成：
- ✓ 检查 Node.js 版本
- ✓ 安装所有 npm 依赖
- ✓ 初始化数据目录（`data/`）
- ✓ 同步素材库到 public 目录
- ✓ 构建生产版本

### 3. 启动服务

```bash
./scripts/server.sh start
```

启动后：
- **前台网站**: http://localhost:3000
- **管理后台**: http://localhost:3000/admin（仅本机可访问）

---

## 服务管理命令

```bash
./scripts/server.sh install   # 安装依赖 + 初始化 + 构建
./scripts/server.sh start     # 启动生产服务（后台运行）
./scripts/server.sh stop      # 停止服务
./scripts/server.sh restart   # 重新构建 + 重启服务
./scripts/server.sh status    # 查看运行状态
./scripts/server.sh dev       # 开发模式（前台运行，支持热更新）
```

### 自定义端口

```bash
PORT=8080 ./scripts/server.sh start
```

### 查看日志

```bash
cat .server.log
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
| 修改代码文件（.tsx/.ts/.css） | ✅ 需要 `./scripts/server.sh restart` |
| 替换 `public/og-image.jpg` | ✅ 需要 `./scripts/server.sh restart` |
| 手动放入 assets/ 素材 | 执行 `npm run sync-assets` 即可，无需重启 |

---

## 管理后台

- 地址：http://localhost:3000/admin
- 访问限制：仅本机 IP（127.0.0.1 / ::1）可访问，外网请求返回 403
- 功能：作品增删改查、图片上传/排序/删除、站点信息编辑

---

## 外网访问

### 方式一：Cloudflare Tunnel（临时分享）

```bash
# 安装（仅首次）
brew install cloudflared

# 启动隧道
cloudflared tunnel --url http://localhost:3000
```

会输出一个 `https://xxx.trycloudflare.com` 地址，发给对方即可访问。

注意：
- 外网用户无法访问 `/admin`（middleware 会拦截）
- 需要保持电脑不休眠、网络不断开
- 每次启动地址会变化

### 方式二：自有服务器

```bash
git clone https://github.com/yyf993-cris/panorama-portfolio.git /opt/panorama-portfolio
cd /opt/panorama-portfolio
./scripts/server.sh install
PORT=80 ./scripts/server.sh start
```

建议配合 nginx 反向代理 + Let's Encrypt 证书使用 HTTPS。

---

## 常见问题

**Q: 启动报错 "port 3000 already in use"**

```bash
PORT=3001 ./scripts/server.sh start
# 或杀掉占用进程
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill
```

**Q: 上传的图片不显示**

项目通过 `beforeFiles` rewrite 动态服务 build 后上传的图片。如果图片仍不显示：
1. 确认文件存在：`ls public/works/文件名`
2. 确认服务已用最新代码启动：`./scripts/server.sh restart`

**Q: CSS/JS 文件报 500**

`next start` 生产模式下，`npm run build` 后必须重启服务：
```bash
./scripts/server.sh restart
```
原因：build 生成新的 chunk 文件（带新 hash），旧进程的路由映射指向旧文件名。

**Q: admin 后台改了内容但前台没变化**

正常情况下保存即生效。如果仍无变化：
1. 浏览器强制刷新（Ctrl+Shift+R / Cmd+Shift+R）
2. 确认 API 返回了新数据：`curl http://localhost:3000/api/admin/config`

**Q: 外网无法访问 admin**

这是预期行为。管理后台仅允许本机访问，外网请求返回 403 Forbidden。
