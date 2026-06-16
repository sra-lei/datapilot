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

:: ========================================
:: 检测 Python（优先使用项目 .venv，其次系统 Python）
:: ========================================
set "PYTHON_CMD="

:: 1. 检查 CharterMate 项目自带的 .venv
if exist "%~dp0services\chartermate\.venv\Scripts\python.exe" (
    set "PYTHON_CMD=%~dp0services\chartermate\.venv\Scripts\python.exe"
    for /f "tokens=*" %%a in ('"!PYTHON_CMD!" --version') do set "PYTHON_VER=%%a"
    echo [OK] %PYTHON_VER% ^(CharterMate .venv^)
    goto PYTHON_OK
)

:: 2. 检查系统 python 命令
python --version >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_CMD=python"
    for /f "tokens=*" %%a in ('python --version') do set "PYTHON_VER=%%a"
    echo [OK] %PYTHON_VER% ^(系统 Python^)
    goto PYTHON_OK
)

:: 3. 检查 py 启动器
py --version >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_CMD=py"
    for /f "tokens=*" %%a in ('py --version') do set "PYTHON_VER=%%a"
    echo [OK] %PYTHON_VER% ^(py 启动器^)
    goto PYTHON_OK
)

:: 都未找到
echo [错误] 未检测到 Python，请先安装
echo 下载地址：https://www.python.org/downloads/
echo.
echo 或者为 CharterMate 创建虚拟环境：
echo   cd services\chartermate
echo   python -m venv .venv
echo   .venv\Scripts\activate.bat
echo   pip install -r requirements.txt
pause
exit /b 1

:PYTHON_OK

echo.
echo ========================================
echo 选择启动模式：
echo ========================================
echo   [1] 启动所有服务
echo   [2] 仅启动 Client
echo   [3] 仅启动 Core Service
echo   [4] 仅启动 CharterMate Service
echo   [5] 停止所有服务
echo ========================================
echo.

set /p choice=请输入选项 (1-5): 

if "%choice%"=="1" goto ALL
if "%choice%"=="2" goto CLIENT
if "%choice%"=="3" goto CORE
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
start "Client - Vite" cmd /k "cd /d "%~dp0client" && npm run dev"

:: 启动 Core Service
timeout /t 3 /nobreak >nul
echo [2/3] 启动 Core Service...
start "Core - Express" cmd /k "cd /d "%~dp0services\core" && npm run dev"

:: 启动 CharterMate Service（使用 .venv 中的 Python）
timeout /t 3 /nobreak >nul
echo [3/3] 启动 CharterMate Service...
set "CHARTERMATE_VENV=%~dp0services\chartermate\.venv\Scripts\python.exe"
if exist "%CHARTERMATE_VENV%" (
    start "CharterMate - FastAPI" cmd /k "cd /d "%~dp0services\chartermate" && ""%CHARTERMATE_VENV%"" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
) else (
    echo [警告] CharterMate .venv 未找到，尝试使用系统 Python...
    start "CharterMate - FastAPI" cmd /k "cd /d "%~dp0services\chartermate" && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
)

echo.
echo ========================================
echo 所有服务已启动！
echo ========================================
echo 服务地址：
echo   - Client:          http://localhost:3001
echo   - Core Service:    http://localhost:3002
echo   - CharterMate:     http://localhost:8000
echo.
echo API 文档：
echo   - Core Service:    http://localhost:3002/api-docs
echo   - CharterMate:     http://localhost:8000/docs
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
echo API 文档：http://localhost:3002/api-docs
echo 日志查看：查看 Core Service 终端窗口
goto END

:CHARTERMATE
echo.
echo 启动 CharterMate Service...
set "CHARTERMATE_VENV=%~dp0services\chartermate\.venv\Scripts\python.exe"
if exist "%CHARTERMATE_VENV%" (
    start "CharterMate - FastAPI" cmd /k "cd /d "%~dp0services\chartermate" && ""%CHARTERMATE_VENV%"" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
    echo [OK] 使用 .venv 虚拟环境
) else (
    echo [警告] .venv 未找到，使用系统 Python
echo   建议创建虚拟环境：
echo     cd services\chartermate
echo     python -m venv .venv
echo     .venv\Scripts\activate.bat
echo     pip install -r requirements.txt
    start "CharterMate - FastAPI" cmd /k "cd /d "%~dp0services\chartermate" && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
)
echo.
echo CharterMate Service 已启动
echo 访问地址：http://localhost:8000
echo API 文档：http://localhost:8000/docs
echo 日志查看：查看 CharterMate Service 终端窗口
goto END

:STOP
echo.
echo 停止所有服务...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM uvicorn.exe >nul 2>&1
echo 所有服务已停止
echo 按任意键退出...
pause >nul

:END