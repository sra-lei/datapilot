@echo off
chcp 65001 >nul
echo ========================================
echo    Trae 开发环境启动脚本
echo ========================================
echo.

:: 设置项目根目录为脚本所在目录
set "PROJECT_ROOT=%~dp0"

:: ========================================
:: 检测 Node.js
:: ========================================
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Node.js，请先安装
    echo 下载地址：https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%a in ('node --version') do set "NODE_VER=%%a"
echo [OK] Node.js %NODE_VER%

echo.
echo ========================================
echo 选择启动模式：
echo ========================================
echo   [1] 启动所有服务
echo   [2] 仅启动 Client
echo   [3] 仅启动 Core Service
echo   [4] 停止所有服务
echo ========================================
echo.

set /p choice=请输入选项 (1-4): 

if "%choice%"=="1" goto ALL
if "%choice%"=="2" goto CLIENT
if "%choice%"=="3" goto CORE
if "%choice%"=="4" goto STOP
goto END

:ALL
echo.
echo ========================================
echo 启动所有服务...
echo ========================================
echo.
echo 提示：请分别打开两个终端窗口查看日志
echo.

:: 启动 Client
echo [1/2] 启动 Client...
start "Client - Vite" cmd /k "cd /d "%~dp0client" && npm run dev"

:: 启动 Core Service
timeout /t 3 /nobreak >nul
echo [2/2] 启动 Core Service...
start "Core - Express" cmd /k "cd /d "%~dp0services\core" && npm run dev"

echo.
echo ========================================
echo 所有服务已启动！
echo ========================================
echo 服务地址：
echo   - Client:          http://localhost:3001
echo   - Core Service:    http://localhost:3002
echo.
echo API 文档：
echo   - Core Service:    http://localhost:3002/core/api-docs
echo.
echo 日志查看：查看对应的终端窗口
echo 停止服务：关闭对应的终端窗口
echo ========================================
goto END

:CLIENT
echo.
echo 启动 Client...
start "Client - Vite" cmd /k "cd /d "%~dp0client" && npm run dev"
echo.
echo Client 已启动
echo 访问地址：http://localhost:3001
echo 日志查看：查看 Client 终端窗口
goto END

:CORE
echo.
echo 启动 Core Service...
start "Core - Express" cmd /k "cd /d "%~dp0services\core" && npm run dev"
echo.
echo Core Service 已启动
echo 访问地址：http://localhost:3002
echo API 文档：http://localhost:3002/core/api-docs
echo 日志查看：查看 Core Service 终端窗口
goto END

:STOP
echo.
echo 停止所有服务...
taskkill /F /IM node.exe >nul 2>&1
echo 所有服务已停止
echo 按任意键退出...
pause >nul

:END