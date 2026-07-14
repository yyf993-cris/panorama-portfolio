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
# 从 GitHub 仓库克隆
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
- ✓ 同步素材库到 public 目录
- ✓ 构建生产版本

### 3. 启动服务

```bash
./scripts/server.sh start
```

启动后访问 **http://localhost:3000** 即可查看网站。

---

## 服务管理命令

所有命令通过 `./scripts/server.sh` 执行：

```bash
./scripts/server.sh install   # 安装依赖 + 构建
./scripts/server.sh start     # 启动生产服务（后台运行）
./scripts/server.sh stop      # 停止服务
./scripts/server.sh restart   # 重启服务（自动重新构建）
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

## 开发模式 vs 生产模式

| 模式 | 命令 | 特点 |
|------|------|------|
| 开发模式 | `./scripts/server.sh dev` | 修改文件后自动刷新，适合调试和编辑内容 |
| 生产模式 | `./scripts/server.sh start` | 性能最优，适合长期运行 |

**日常编辑内容时**推荐使用开发模式，改完后用 `restart` 切到生产模式。

---

## 修改内容后更新网站

每次修改了数据文件或素材后，需要重新构建才能在生产模式看到变化：

```bash
# 方式一：重启（自动重新构建）
./scripts/server.sh restart

# 方式二：开发模式下直接自动刷新，无需手动操作
./scripts/server.sh dev
```

---

## 外网访问

### 方式一：Vercel 部署（推荐，永久公网地址）

项目已配置 Vercel 自动部署。每次推送代码到 GitHub，Vercel 自动更新网站。

- **GitHub 仓库**: https://github.com/yyf993-cris/panorama-portfolio
- **公网地址**: https://panorama-portfolio.vercel.app

更新流程：
```bash
# 修改内容后，推送到 GitHub 即可自动部署
git add -A && git commit -m "更新作品" && git push
```

Vercel 会在 1-2 分钟内完成自动部署。

### 方式二：Cloudflare Tunnel（临时分享，无需注册）

适合临时让他人预览本地开发的效果：

```bash
# 安装（仅首次）
brew install cloudflared

# 启动隧道（生成临时公网地址）
cloudflared tunnel --url http://localhost:3000
```

会输出一个 `https://xxx.trycloudflare.com` 地址，发给对方即可访问。

注意事项：
- 需要保持电脑不休眠、网络不断开
- 公司内网可能拦截，需切换到手机热点
- 每次启动地址会变化

### 方式三：自有服务器

```bash
# 在服务器上
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
# 换一个端口
PORT=3001 ./scripts/server.sh start
# 或者杀掉占用端口的进程
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill
```

**Q: 图片不显示**

```bash
# 重新同步素材
npm run sync-assets
# 然后重启
./scripts/server.sh restart
```

**Q: 修改了文件但网站没变化**

生产模式需要重新构建：
```bash
./scripts/server.sh restart
```
或使用开发模式实时预览：
```bash
./scripts/server.sh dev
```

**Q: Vercel 部署后无法访问（DNS 污染）**

部分企业网络会拦截 `vercel.app` 域名，解决方法：

macOS/Linux:
```bash
sudo sh -c 'echo "76.76.21.21 panorama-portfolio.vercel.app" >> /etc/hosts'
```

Windows（管理员权限运行）：
```powershell
echo 76.76.21.21 panorama-portfolio.vercel.app >> C:\Windows\System32\drivers\etc\hosts
ipconfig /flushdns
```

或切换到手机热点 / 家庭网络访问。

**Q: 构建时报 Google Fonts 错误**

网络无法访问 Google 服务时会出现此问题。项目已移除 Google Fonts 依赖，使用系统字体，正常情况不会再出现。如遇到类似问题，确认网络连通性。
