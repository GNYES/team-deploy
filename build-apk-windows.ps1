# TeamDeploy APK 构建脚本 (Windows PowerShell)
# 使用方法: 右键点击 -> 使用 PowerShell 运行

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "TeamDeploy APK 构建脚本 (Windows)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查必要的工具
Write-Host "检查环境..." -ForegroundColor Yellow

# 检查 Node.js
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "错误: 未安装 Node.js" -ForegroundColor Red
    Write-Host "请从 https://nodejs.org/ 下载并安装 Node.js 20+" -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green

# 检查 Java
$javaVersion = java -version 2>&1 | Select-String -Pattern '"([0-9]+)"' | ForEach-Object { $_.Matches.Groups[1].Value }
if (-not $javaVersion) {
    Write-Host "错误: 未安装 Java JDK" -ForegroundColor Red
    Write-Host "请从 https://adoptium.net/ 下载并安装 JDK 17+" -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host "✓ Java JDK: $javaVersion" -ForegroundColor Green

# 检查 Android SDK
$androidHome = $env:ANDROID_HOME
if (-not $androidHome) {
    $androidHome = "$env:LOCALAPPDATA\Android\Sdk"
}
if (-not (Test-Path $androidHome)) {
    Write-Host "错误: 未找到 Android SDK" -ForegroundColor Red
    Write-Host "请从 Android Studio 安装 Android SDK" -ForegroundColor Yellow
    Write-Host "或设置 ANDROID_HOME 环境变量" -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host "✓ Android SDK: $androidHome" -ForegroundColor Green

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "开始构建..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 进入项目目录
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir

# 安装依赖
Write-Host "步骤 1/6: 安装依赖..." -ForegroundColor Yellow
Set-Location "$projectDir\app"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: 依赖安装失败" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✓ 依赖安装完成" -ForegroundColor Green

# 构建 Web 应用
Write-Host ""
Write-Host "步骤 2/6: 构建 Web 应用..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: Web 应用构建失败" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✓ Web 应用构建完成" -ForegroundColor Green

# 添加 Android 平台
Write-Host ""
Write-Host "步骤 3/6: 添加 Android 平台..." -ForegroundColor Yellow
npx cap add android 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Android 平台已存在，跳过" -ForegroundColor Yellow
} else {
    Write-Host "✓ Android 平台添加完成" -ForegroundColor Green
}

# 同步到 Android
Write-Host ""
Write-Host "步骤 4/6: 同步到 Android..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: 同步失败" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✓ 同步完成" -ForegroundColor Green

# 构建 APK
Write-Host ""
Write-Host "步骤 5/6: 构建 APK..." -ForegroundColor Yellow
Set-Location "$projectDir\app\android"

# 确保 gradlew 可执行
if (-not (Test-Path "gradlew.bat")) {
    Write-Host "错误: 未找到 gradlew.bat" -ForegroundColor Red
    pause
    exit 1
}

# 构建 Debug APK
.\gradlew.bat assembleDebug --stacktrace
if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: APK 构建失败" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✓ APK 构建完成" -ForegroundColor Green

# 复制 APK 到输出目录
Write-Host ""
Write-Host "步骤 6/6: 复制 APK..." -ForegroundColor Yellow
$apkSource = "$projectDir\app\android\app\build\outputs\apk\debug\app-debug.apk"
$apkDest = "$projectDir\team-deploy.apk"

if (Test-Path $apkSource) {
    Copy-Item $apkSource $apkDest -Force
    Write-Host "✓ APK 已复制到: $apkDest" -ForegroundColor Green
} else {
    Write-Host "错误: 未找到 APK 文件" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "构建成功！" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "APK 文件位置:" -ForegroundColor Cyan
Write-Host "  $apkDest" -ForegroundColor White
Write-Host ""
Write-Host "安装方法:" -ForegroundColor Cyan
Write-Host "  1. 将 APK 复制到手机" -ForegroundColor White
Write-Host "  2. 在手机上点击安装" -ForegroundColor White
Write-Host "  3. 允许安装未知来源应用" -ForegroundColor White
Write-Host ""

pause
