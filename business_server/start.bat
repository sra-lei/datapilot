@echo off
echo 启动 CharterMate 业务服务...
echo.

REM 检查 Python 是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo 错误：未找到 Python，请先安装 Python
    pause
    exit /b 1
)

REM 检查依赖是否安装
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo 正在安装依赖...
    pip install -r requirements.txt
)

echo.
echo 启动服务...
echo 访问地址：
echo   - 健康检查：http://localhost:8000/api/v1/health
echo   - API 文档：http://localhost:8000/docs
echo.

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause