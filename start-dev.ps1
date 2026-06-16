# Trae 项目开发环境启动脚本
# 功能：同时启动 Client、Server、Server_Chartermate 三个服务
# 特点：在独立终端窗口中运行，可实时查看日志

param(
    [switch]$Client = $false,        # 仅启动 Client
    [switch]$Server = $false,        # 仅启动 Server
    [switch]$Chartermate = $false,  # 仅启动 Server_Chartermate
    [switch]$All = $true             # 启动所有服务（默认）
)

# 颜色定义
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# 清理函数
function Stop-AllServices {
    Write-ColorOutput "`n正在停止所有服务..." "Yellow"
    
    # 停止 Node.js 进程（Vite、Server）
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    
    # 停止 Python 进程（FastAPI/Uvicorn）
    Get-Process -Name "python" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    
    Write-ColorOutput "所有服务已停止" "Green"
}

# 检查依赖
function Check-Dependencies {
    Write-ColorOutput "`n检查依赖..." "Cyan"
    
    # 检查 Node.js
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-ColorOutput "✓ Node.js: $nodeVersion" "Green"
    } else {
        Write-ColorOutput "✗ Node.js 未安装" "Red"
        return $false
    }
    
    # 检查 Python
    $pythonVersion = python --version 2>$null
    if ($pythonVersion) {
        Write-ColorOutput "✓ Python: $pythonVersion" "Green"
    } else {
        Write-ColorOutput "✗ Python 未安装" "Red"
        return $false
    }
    
    return $true
}

# 启动 Client
function Start-Client {
    Write-ColorOutput "`n========================================" "Cyan"
    Write-ColorOutput "启动 Client (Vite + React)" "Cyan"
    Write-ColorOutput "========================================" "Cyan"
    Write-ColorOutput "访问地址: http://localhost:3001" "Yellow"
    Write-ColorOutput "按 Ctrl+C 停止" "Gray"
    
    Set-Location "e:\workspace\Trae\client"
    npm run dev
}

# 启动 Server
function Start-Server {
    Write-ColorOutput "`n========================================" "Cyan"
    Write-ColorOutput "启动 Server (Express + TypeScript)" "Cyan"
    Write-ColorOutput "========================================" "Cyan"
    Write-ColorOutput "访问地址: http://localhost:3002" "Yellow"
    Write-ColorOutput "API 文档: http://localhost:3002/api-docs" "Yellow"
    Write-ColorOutput "按 Ctrl+C 停止" "Gray"
    
    Set-Location "e:\workspace\Trae\server"
    npm run dev
}

# 启动 Server_Chartermate
function Start-Chartermate {
    Write-ColorOutput "`n========================================" "Cyan"
    Write-ColorOutput "启动 Server_Chartermate (FastAPI)" "Cyan"
    Write-ColorOutput "========================================" "Cyan"
    Write-ColorOutput "访问地址: http://localhost:8000" "Yellow"
    Write-ColorOutput "API 文档: http://localhost:8000/docs" "Yellow"
    Write-ColorOutput "按 Ctrl+C 停止" "Gray"
    
    Set-Location "e:\workspace\Trae\server_chartermate"
    
    # 检查依赖
    if (-not (Test-Path "venv")) {
        Write-ColorOutput "创建虚拟环境..." "Yellow"
        python -m venv venv
    }
    
    # 激活虚拟环境并安装依赖
    & "e:\workspace\Trae\server_chartermate\venv\Scripts\Activate.ps1"
    pip install -q -r requirements.txt
    
    # 启动服务
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
}

# 主函数
function Main {
    # 清除屏幕
    Clear-Host
    
    Write-ColorOutput "========================================" "Magenta"
    Write-ColorOutput "   Trae 开发环境启动脚本" "Magenta"
    Write-ColorOutput "========================================" "Magenta"
    
    # 检查依赖
    if (-not (Check-Dependencies)) {
        Write-ColorOutput "`n请先安装缺失的依赖" "Red"
        exit 1
    }
    
    # 根据参数决定启动哪些服务
    $servicesToStart = @()
    
    if ($All -or (-not $Client -and -not $Server -and -not $Chartermate)) {
        $servicesToStart = @("Client", "Server", "Chartermate")
    } else {
        if ($Client) { $servicesToStart += "Client" }
        if ($Server) { $servicesToStart += "Server" }
        if ($Chartermate) { $servicesToStart += "Chartermate" }
    }
    
    Write-ColorOutput "`n将启动以下服务:" "Yellow"
    foreach ($service in $servicesToStart) {
        Write-ColorOutput "  - $service" "Green"
    }
    
    # 启动服务
    foreach ($service in $servicesToStart) {
        switch ($service) {
            "Client" { Start-Client }
            "Server" { Start-Server }
            "Chartermate" { Start-Chartermate }
        }
    }
}

# 注册 Ctrl+C 处理
Register-EngineEvent -SourceIdentifier "PowerShell.Exiting" -Action {
    Stop-AllServices
} -MaxTriggerCount 1 -ErrorAction SilentlyContinue

# 运行主函数
Main
