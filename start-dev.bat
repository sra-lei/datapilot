@echo off
chcp 65001 >nul
echo ========================================
echo    Trae 开发环境启动脚本
echo ========================================
echo.

:: 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未安装 Node.js
    pause
    exit /b 1
)
echo [OK] Node.js 已安装

:: 检查 Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未安装 Python
    pause
    exit /b 1
)
echo [OK] Python 已安装

echo.
echo ========================================
echo 选择启动模式：
echo ========================================
echo   [1] 启动所有服务
echo   [2] 仅启动 Client
echo   [3] 仅启动 Server
echo   [4] 仅启动 Server_Chartermate
echo   [5] 停止所有服务
echo ========================================
echo.

set /p choice=请输入选项 (1-5): 

if "%choice%"=="1" goto ALL
if "%choice%"=="2" goto CLIENT
if "%choice%"=="3" goto SERVER
if "%choice%"=="4" goto CHARTERMATE
if "%choice%"=="5" goto STOP
goto END

:ALL
echo.
echo ========================================
echo 启动所有服务...
echo ========================================
echo.
echo 提示：请分别打开三个终端窗口查看日志
echo.

:: 启动 Client
echo [1/3] 启动 Client...
start "Client - Vite" cmd /k "cd /d e:\workspace\Trae\client && npm run dev"

:: 启动 Server
timeout /t 3 /nobreak >nul
echo [2/3] 启动 Server...
start "Server - Express" cmd /k "cd /d e:\workspace\Trae\server && npm run dev"

:: 启动 Server_Chartermate
timeout /t 3 /nobreak >nul
echo [3/3] 启动 Server_Chartermate...
start "Server_Chartermate - FastAPI" cmd /k "cd /d e:\workspace\Trae\server_chartermate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo ========================================
echo 所有服务已启动！
echo ========================================
echo 服务地址：
echo   - Client:          http://localhost:3001
echo   - Server:          http://localhost:3002
echo   - Server_Chartermate: http://localhost:8000
echo.
echo API 文档：
echo   - Server:          http://localhost:3002/api-docs
echo   - Server_Chartermate: http://localhost:8000/docs
echo.
echo 日志查看：查看对应的终端窗口
echo 停止服务：关闭对应的终端窗口
echo ========================================
goto END

:CLIENT
echo.
echo 启动 Client...
start "Client - Vite" cmd /k "cd /d e:\workspace\Trae\client && npm run dev"
echo.
echo Client 已启动
echo 访问地址：http://localhost:3001
echo 日志查看：查看 Client 终端窗口
goto END

:SERVER
echo.
echo 启动 Server...
start "Server - Express" cmd /k "cd /d e:\workspace\Trae\server && npm run dev"
echo.
echo Server 已启动
echo 访问地址：http://localhost:3002
echo API 文档：http://localhost:3002/api-docs
echo 日志查看：查看 Server 终端窗口
goto END

:CHARTERMATE
echo.
echo 启动 Server_Chartermate...
start "Server_Chartermate - FastAPI" cmd /k "cd /d e:\workspace\Trae\server_chartermate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo.
echo Server_Chartermate 已启动
echo 访问地址：http://localhost:8000
echo API 文档：http://localhost:8000/docs
echo 日志查看：查看 Server_Chartermate 终端窗口
goto END

:STOP
echo.
echo 停止所有服务...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
echo 所有服务已停止
echo 按任意键退出...
pause >nul

:END
