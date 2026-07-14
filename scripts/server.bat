@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul 2>&1

:: ============================================================
:: Panorama Portfolio - Windows 一键部署脚本
:: 功能：自动检测/下载 Node.js、自动安装/更新依赖、服务管理
:: ============================================================

set "APP_NAME=panorama-portfolio"
set "SCRIPT_DIR=%~dp0"
set "APP_DIR=%SCRIPT_DIR%.."
pushd "%APP_DIR%"
set "APP_DIR=%CD%"
popd
set "PID_FILE=%APP_DIR%\.server.pid"
set "LOG_FILE=%APP_DIR%\.server.log"
if "%PORT%"=="" set "PORT=3000"

:: Node.js 最低版本要求
set "NODE_MIN_VER=18"
:: Node.js 下载版本（当需要自动安装时）
set "NODE_INSTALL_VER=22.17.0"
:: 本地 Node.js 安装路径（免安装方式）
set "NODE_LOCAL_DIR=%APP_DIR%\.node"

if "%~1"=="" goto :usage
if /i "%~1"=="install" goto :do_install
if /i "%~1"=="start" goto :do_start
if /i "%~1"=="stop" goto :do_stop
if /i "%~1"=="restart" goto :do_restart
if /i "%~1"=="status" goto :do_status
if /i "%~1"=="dev" goto :do_dev
if /i "%~1"=="update" goto :do_update
goto :usage

:usage
echo.
echo  用法: scripts\server.bat {install^|start^|stop^|restart^|status^|dev^|update}
echo.
echo    install   - 一键安装（自动下载 Node.js + 安装依赖 + 构建）
echo    start     - 启动生产服务（后台运行）
echo    stop      - 停止服务
echo    restart   - 重新构建并启动服务
echo    status    - 查看服务运行状态
echo    dev       - 启动开发服务（前台运行，支持热更新）
echo    update    - 更新依赖并重新构建
echo.
exit /b 1

:: ============================================================
:: ensure_node - 检测 Node.js，缺失或版本低则自动下载安装
:: ============================================================
:ensure_node
:: 先检查本地安装的 Node.js
if exist "%NODE_LOCAL_DIR%\node.exe" (
    set "PATH=%NODE_LOCAL_DIR%;%NODE_LOCAL_DIR%\node_modules\npm\bin;%PATH%"
)

:: 检查 node 是否可用
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [!] 未检测到 Node.js，正在自动下载安装...
    goto :auto_install_node
)

:: 检查版本
for /f "tokens=1 delims=." %%a in ('node -v') do set "NODE_VER_RAW=%%a"
set "NODE_MAJOR=!NODE_VER_RAW:v=!"
if !NODE_MAJOR! lss %NODE_MIN_VER% (
    echo [!] Node.js 版本过低 (当前: !NODE_VER_RAW!，需要 ^>= v%NODE_MIN_VER%)
    echo     正在自动下载新版本...
    goto :auto_install_node
)

:: Node.js 可用且版本满足
exit /b 0

:: ============================================================
:: auto_install_node - 自动下载并安装 Node.js（免管理员权限）
:: ============================================================
:auto_install_node
set "NODE_ZIP=node-v%NODE_INSTALL_VER%-win-x64.zip"
set "NODE_URL=https://nodejs.org/dist/v%NODE_INSTALL_VER%/%NODE_ZIP%"
set "NODE_DOWNLOAD_PATH=%TEMP%\%NODE_ZIP%"
set "NODE_EXTRACT_DIR=%TEMP%\node-v%NODE_INSTALL_VER%-win-x64"

echo.
echo [%APP_NAME%] 自动安装 Node.js v%NODE_INSTALL_VER%
echo   下载地址: %NODE_URL%
echo   安装位置: %NODE_LOCAL_DIR%
echo.

:: 检查是否已下载过
if exist "%NODE_DOWNLOAD_PATH%" (
    echo   [跳过] 安装包已存在，使用缓存
    goto :extract_node
)

:: 使用 PowerShell 下载
echo   [1/3] 下载中...（约 30MB，请稍候）
powershell -NoProfile -Command ^
    "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%NODE_DOWNLOAD_PATH%' -UseBasicParsing"

if !ERRORLEVEL! neq 0 (
    echo   [X] 下载失败！请检查网络连接。
    echo       你也可以手动下载: %NODE_URL%
    echo       解压到: %NODE_LOCAL_DIR%
    del /f "%NODE_DOWNLOAD_PATH%" >nul 2>&1
    exit /b 1
)

if not exist "%NODE_DOWNLOAD_PATH%" (
    echo   [X] 下载失败，文件不存在
    exit /b 1
)

:extract_node
:: 解压
echo   [2/3] 解压中...
if exist "%NODE_EXTRACT_DIR%" rd /s /q "%NODE_EXTRACT_DIR%"
if exist "%NODE_LOCAL_DIR%" rd /s /q "%NODE_LOCAL_DIR%"

powershell -NoProfile -Command ^
    "$ProgressPreference = 'SilentlyContinue'; Expand-Archive -Path '%NODE_DOWNLOAD_PATH%' -DestinationPath '%TEMP%' -Force"

if !ERRORLEVEL! neq 0 (
    echo   [X] 解压失败
    exit /b 1
)

:: 移动到项目本地目录
echo   [3/3] 安装到项目目录...
move "%NODE_EXTRACT_DIR%" "%NODE_LOCAL_DIR%" >nul 2>&1
if !ERRORLEVEL! neq 0 (
    :: move 失败时用 xcopy
    mkdir "%NODE_LOCAL_DIR%" >nul 2>&1
    xcopy /E /I /Q /Y "%NODE_EXTRACT_DIR%\*" "%NODE_LOCAL_DIR%\" >nul
    rd /s /q "%NODE_EXTRACT_DIR%" >nul 2>&1
)

:: 加入 PATH
set "PATH=%NODE_LOCAL_DIR%;%PATH%"

:: 验证安装
where node >nul 2>&1
if !ERRORLEVEL! neq 0 (
    echo   [X] 安装后仍无法找到 node，请手动安装
    echo       下载: https://nodejs.org/
    exit /b 1
)

for /f "delims=" %%v in ('node -v') do set "INSTALLED_VER=%%v"
echo.
echo   [OK] Node.js !INSTALLED_VER! 安装成功
echo        位置: %NODE_LOCAL_DIR%\node.exe
echo.
exit /b 0

:: ============================================================
:: ensure_deps - 检查并自动安装/更新依赖
:: ============================================================
:ensure_deps
cd /d "%APP_DIR%"

:: 如果 node_modules 不存在，直接安装
if not exist "%APP_DIR%\node_modules" (
    echo [%APP_NAME%] node_modules 不存在，安装依赖...
    call npm install
    if !ERRORLEVEL! neq 0 (
        echo [X] npm install 失败
        exit /b 1
    )
    exit /b 0
)

:: 检查 package.json 是否比 node_modules 更新（依赖可能有变更）
:: 使用 PowerShell 比较文件时间戳
powershell -NoProfile -Command ^
    "$pkg = (Get-Item '%APP_DIR%\package.json').LastWriteTime; $nm = (Get-Item '%APP_DIR%\node_modules\.package-lock.json' -ErrorAction SilentlyContinue); if (!$nm -or $pkg -gt $nm.LastWriteTime) { exit 1 } else { exit 0 }"

if !ERRORLEVEL! equ 1 (
    echo [%APP_NAME%] package.json 有更新，同步依赖...
    call npm install
    if !ERRORLEVEL! neq 0 (
        echo [X] npm install 失败
        exit /b 1
    )
) else (
    echo [%APP_NAME%] 依赖已是最新
)
exit /b 0

:: ============================================================
:: do_update - 更新依赖并重新构建
:: ============================================================
:do_update
echo [%APP_NAME%] 更新项目...
echo.

call :ensure_node
if !ERRORLEVEL! neq 0 exit /b 1

cd /d "%APP_DIR%"

echo [1/4] 更新 npm 依赖（含升级小版本）...
call npm update
if !ERRORLEVEL! neq 0 (
    echo [X] npm update 失败
    exit /b 1
)

echo.
echo [2/4] 检查安全漏洞修复...
call npm audit fix >nul 2>&1

echo [3/4] 同步素材...
call node "%APP_DIR%\scripts\sync-assets.mjs" 2>nul

echo.
echo [4/4] 重新构建...
call npm run build
if !ERRORLEVEL! neq 0 (
    echo [X] 构建失败
    exit /b 1
)

echo.
echo [OK] 更新完成！使用 scripts\server.bat restart 重启服务。
exit /b 0

:: ============================================================
:: do_install - 一键安装部署（自动下载 Node.js + 依赖 + 构建）
:: ============================================================
:do_install
echo.
echo  ========================================
echo   %APP_NAME% - 一键安装部署
echo  ========================================
echo.

:: Step 1: 确保 Node.js 可用（自动下载）
echo [1/6] 检查 Node.js 环境...
call :ensure_node
if !ERRORLEVEL! neq 0 (
    echo.
    echo [X] 无法获取 Node.js，安装中止。
    echo     请手动下载安装: https://nodejs.org/
    exit /b 1
)
for /f "delims=" %%v in ('node -v') do echo        Node.js: %%v
for /f "delims=" %%v in ('npm -v') do echo        npm: %%v
echo.

:: Step 2: 安装依赖
echo [2/6] 安装项目依赖...
cd /d "%APP_DIR%"
call npm install
if !ERRORLEVEL! neq 0 (
    echo [X] npm install 失败
    exit /b 1
)
echo        [OK]
echo.

:: Step 3: 初始化数据目录
echo [3/6] 初始化数据目录...
if not exist "%APP_DIR%\data" mkdir "%APP_DIR%\data"

if not exist "%APP_DIR%\data\works.json" (
    echo []> "%APP_DIR%\data\works.json"
    echo        创建 data/works.json
)
if not exist "%APP_DIR%\data\config.json" (
    (echo {"site":{"title":"全景作品集","description":"空间设计师 · VR全景摄影","url":""},"profile":{"name":"Your Name","avatar":"/works/avatar.jpg","bio":"","socials":[]}})> "%APP_DIR%\data\config.json"
    echo        创建 data/config.json
)
if not exist "%APP_DIR%\data\views.json" (
    echo {}> "%APP_DIR%\data\views.json"
    echo        创建 data/views.json
)
echo        [OK]
echo.

:: Step 4: 同步素材
echo [4/6] 同步素材...
call node "%APP_DIR%\scripts\sync-assets.mjs"
if !ERRORLEVEL! neq 0 (
    echo        [!] 素材同步失败，跳过（不影响运行）
)
echo.

:: Step 5: 环境变量检查（仅提示）
echo [5/6] 检查环境配置...
if exist "%APP_DIR%\.env.local" (
    echo        .env.local 已配置
) else (
    echo        [提示] 未发现 .env.local（不影响本地模式）
    echo        如需连接 Notion CMS，请执行:
    echo          copy .env.local.example .env.local
    echo          然后编辑填入 NOTION_API_KEY 和 NOTION_DATABASE_ID
)
echo.

:: Step 6: 构建项目
echo [6/6] 构建生产版本...
cd /d "%APP_DIR%"
call npm run build
if !ERRORLEVEL! neq 0 (
    echo [X] 构建失败
    exit /b 1
)

echo.
echo  ============================================
echo   [OK] 安装完成！
echo.
echo    启动服务:   scripts\server.bat start
echo    开发模式:   scripts\server.bat dev
echo    更新项目:   scripts\server.bat update
echo.
echo    前台地址:   http://localhost:%PORT%
echo    管理后台:   http://localhost:%PORT%/admin
echo  ============================================
echo.
exit /b 0

:: ============================================================
:: do_start - 后台启动生产服务
:: ============================================================
:do_start
call :ensure_node
if !ERRORLEVEL! neq 0 exit /b 1
call :ensure_deps
if !ERRORLEVEL! neq 0 exit /b 1

:: 检查是否需要构建
if not exist "%APP_DIR%\.next" (
    echo [%APP_NAME%] 未找到构建产物，先执行构建...
    cd /d "%APP_DIR%"
    call npm run build
    if !ERRORLEVEL! neq 0 (
        echo [X] 构建失败
        exit /b 1
    )
)

:: 检查是否已在运行
if exist "%PID_FILE%" (
    set /p EXISTING_PID=<"%PID_FILE%"
    tasklist /FI "PID eq !EXISTING_PID!" 2>nul | find "!EXISTING_PID!" >nul 2>&1
    if !ERRORLEVEL! equ 0 (
        echo [%APP_NAME%] 服务已在运行 (PID: !EXISTING_PID!)
        echo   访问: http://localhost:%PORT%
        exit /b 0
    )
)

echo [%APP_NAME%] 启动生产服务 (端口: %PORT%)...
cd /d "%APP_DIR%"

:: 使用 PowerShell 后台启动进程并获取 PID
powershell -NoProfile -Command ^
    "$env:PORT='%PORT%'; $p = Start-Process -FilePath 'node' -ArgumentList 'node_modules\.bin\next', 'start', '-p', '%PORT%' -WorkingDirectory '%APP_DIR%' -WindowStyle Hidden -RedirectStandardOutput '%LOG_FILE%' -RedirectStandardError '%LOG_FILE%.err' -PassThru; $p.Id" > "%PID_FILE%"

:: 等待启动
timeout /t 3 /nobreak >nul

set /p NEW_PID=<"%PID_FILE%"
tasklist /FI "PID eq !NEW_PID!" 2>nul | find "!NEW_PID!" >nul 2>&1
if !ERRORLEVEL! equ 0 (
    echo [OK] 服务已启动
    echo   PID:  !NEW_PID!
    echo   日志: %LOG_FILE%
    echo   访问: http://localhost:%PORT%
) else (
    echo [X] 启动失败，查看日志: type "%LOG_FILE%"
    del /f "%PID_FILE%" >nul 2>&1
    exit /b 1
)
exit /b 0

:: ============================================================
:: do_stop - 停止服务
:: ============================================================
:do_stop
if not exist "%PID_FILE%" (
    echo [%APP_NAME%] 服务未在运行
    exit /b 0
)

set /p PID=<"%PID_FILE%"
tasklist /FI "PID eq !PID!" 2>nul | find "!PID!" >nul 2>&1
if !ERRORLEVEL! equ 0 (
    echo [%APP_NAME%] 停止服务 (PID: !PID!)...
    taskkill /PID !PID! /T /F >nul 2>&1
    echo [OK] 服务已停止
) else (
    echo [%APP_NAME%] 进程已不存在
)
del /f "%PID_FILE%" >nul 2>&1
exit /b 0

:: ============================================================
:: do_restart - 重新构建并启动
:: ============================================================
:do_restart
call :do_stop
echo.
call :ensure_node
if !ERRORLEVEL! neq 0 exit /b 1
call :ensure_deps
if !ERRORLEVEL! neq 0 exit /b 1

cd /d "%APP_DIR%"
echo [%APP_NAME%] 重新构建...
call npm run build
if !ERRORLEVEL! neq 0 (
    echo [X] 构建失败
    exit /b 1
)
echo.
call :do_start
exit /b 0

:: ============================================================
:: do_status - 查看状态
:: ============================================================
:do_status
echo.
echo  --- %APP_NAME% 状态 ---
echo.

:: Node.js 信息
where node >nul 2>&1
if !ERRORLEVEL! equ 0 (
    for /f "delims=" %%v in ('node -v') do echo   Node.js:  %%v
) else (
    echo   Node.js:  未安装
)

:: 本地 Node 检查
if exist "%NODE_LOCAL_DIR%\node.exe" (
    echo   Node位置: %NODE_LOCAL_DIR% (项目内置)
) else (
    where node 2>nul | findstr /v "^$" >nul && (
        for /f "delims=" %%p in ('where node') do echo   Node位置: %%p
    )
)

:: 依赖状态
if exist "%APP_DIR%\node_modules" (
    echo   依赖:     已安装
) else (
    echo   依赖:     未安装
)

:: 构建状态
if exist "%APP_DIR%\.next" (
    echo   构建:     已构建
) else (
    echo   构建:     未构建
)

:: 服务状态
if not exist "%PID_FILE%" (
    echo   服务:     未运行
    echo.
    exit /b 0
)

set /p PID=<"%PID_FILE%"
tasklist /FI "PID eq !PID!" 2>nul | find "!PID!" >nul 2>&1
if !ERRORLEVEL! equ 0 (
    echo   服务:     运行中
    echo   PID:      !PID!
    echo   端口:     %PORT%
    echo   日志:     %LOG_FILE%
    echo   访问:     http://localhost:%PORT%
) else (
    echo   服务:     未运行 (残留PID文件已清理)
    del /f "%PID_FILE%" >nul 2>&1
)
echo.
exit /b 0

:: ============================================================
:: do_dev - 前台开发模式
:: ============================================================
:do_dev
call :ensure_node
if !ERRORLEVEL! neq 0 exit /b 1
call :ensure_deps
if !ERRORLEVEL! neq 0 exit /b 1

echo [%APP_NAME%] 启动开发服务 (端口: %PORT%, Ctrl+C 退出)...
cd /d "%APP_DIR%"
call npm run dev
exit /b 0
