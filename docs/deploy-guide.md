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
# 方式一：从 Git 仓库克隆
git clone <你的仓库地址> panorama-portfolio
cd panorama-portfolio

# 方式二：直接复制项目目录
cp -r /path/to/panorama-portfolio ./panorama-portfolio
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

## 部署到云服务器（可选）

如果需要让外网可以访问：

### Vercel（推荐，免费）

1. 将项目推送到 GitHub
2. 访问 https://vercel.com/new，导入仓库
3. 点击 Deploy，等待完成
4. 获得一个 `xxx.vercel.app` 域名

### 自有服务器

```bash
# 在服务器上
git clone <仓库地址> /opt/panorama-portfolio
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
