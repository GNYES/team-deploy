#!/bin/bash

echo "=========================================="
echo "TeamDeploy App APK 构建脚本"
echo "=========================================="
echo ""

APP_DIR="team-deploy-app"

if [ ! -d "$APP_DIR" ]; then
    echo "错误: 未找到 $APP_DIR 目录"
    exit 1
fi

echo "步骤 1: 安装依赖..."
cd $APP_DIR
npm install

echo ""
echo "步骤 2: 添加 Android 平台..."
npx cap add android

echo ""
echo "步骤 3: 同步到 Android..."
npx cap sync android

echo ""
echo "步骤 4: 构建 APK..."
cd android
chmod +x ./gradlew
./gradlew assembleDebug

echo ""
echo "=========================================="
echo "APK 文件位置: android/app/build/outputs/apk/debug/app-debug.apk"
echo "=========================================="
