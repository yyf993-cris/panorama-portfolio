#!/bin/bash
set -e

APP_NAME="panorama-portfolio"
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$APP_DIR/.server.pid"
LOG_FILE="$APP_DIR/.server.log"
PORT=${PORT:-3000}

usage() {
  echo "用法: ./scripts/server.sh {install|start|stop|restart|status}"
  echo ""
  echo "  install   - 安装项目依赖并同步素材"
  echo "  start     - 启动生产服务（后台运行）"
  echo "  stop      - 停止服务"
  echo "  restart   - 重启服务"
  echo "  status    - 查看服务运行状态"
  echo "  dev       - 启动开发服务（前台运行，支持热更新）"
  exit 1
}

check_node() {
  if ! command -v node &>/dev/null; then
    echo "✗ 未检测到 Node.js，请先安装 Node.js >= 18"
    echo "  推荐: https://nodejs.org/ 或使用 nvm install 18"
    exit 1
  fi
  NODE_VER=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_VER" -lt 18 ]; then
    echo "✗ Node.js 版本过低 (当前: $(node -v))，需要 >= 18"
    exit 1
  fi
}

do_install() {
  echo "[$APP_NAME] 检查环境..."
  check_node
  echo "  Node.js: $(node -v)"
  echo "  npm: $(npm -v)"
  echo ""

  echo "[$APP_NAME] 安装依赖..."
  cd "$APP_DIR"
  npm install

  echo ""
  echo "[$APP_NAME] 同步素材..."
  bash "$APP_DIR/scripts/sync-assets.sh"

  echo ""
  echo "[$APP_NAME] 构建项目..."
  npm run build

  echo ""
  echo "============================================"
  echo "✓ 安装完成！"
  echo ""
  echo "  启动服务:  ./scripts/server.sh start"
  echo "  开发模式:  ./scripts/server.sh dev"
  echo "  访问地址:  http://localhost:$PORT"
  echo "============================================"
}

do_start() {
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "[$APP_NAME] 服务已在运行 (PID: $(cat "$PID_FILE"))"
    echo "  访问: http://localhost:$PORT"
    return 0
  fi

  echo "[$APP_NAME] 启动生产服务 (端口: $PORT)..."
  cd "$APP_DIR"
  PORT=$PORT nohup npm run start > "$LOG_FILE" 2>&1 &
  echo $! > "$PID_FILE"
  sleep 2

  if kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "✓ 服务已启动"
    echo "  PID: $(cat "$PID_FILE")"
    echo "  日志: $LOG_FILE"
    echo "  访问: http://localhost:$PORT"
  else
    echo "✗ 启动失败，查看日志: cat $LOG_FILE"
    rm -f "$PID_FILE"
    exit 1
  fi
}

do_stop() {
  if [ ! -f "$PID_FILE" ]; then
    echo "[$APP_NAME] 服务未在运行"
    return 0
  fi

  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "[$APP_NAME] 停止服务 (PID: $PID)..."
    kill "$PID"
    sleep 1
    if kill -0 "$PID" 2>/dev/null; then
      kill -9 "$PID"
    fi
    echo "✓ 服务已停止"
  else
    echo "[$APP_NAME] 进程已不存在"
  fi
  rm -f "$PID_FILE"
}

do_restart() {
  do_stop
  echo ""
  npm run build
  do_start
}

do_status() {
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "[$APP_NAME] 运行中"
    echo "  PID:  $(cat "$PID_FILE")"
    echo "  端口: $PORT"
    echo "  日志: $LOG_FILE"
  else
    echo "[$APP_NAME] 未运行"
    rm -f "$PID_FILE" 2>/dev/null
  fi
}

do_dev() {
  echo "[$APP_NAME] 启动开发服务 (端口: $PORT, Ctrl+C 退出)..."
  cd "$APP_DIR"
  npm run dev
}

case "${1:-}" in
  install)  do_install ;;
  start)    do_start ;;
  stop)     do_stop ;;
  restart)  do_restart ;;
  status)   do_status ;;
  dev)      do_dev ;;
  *)        usage ;;
esac
