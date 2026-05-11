# TeamDeploy APK Windows 本地构建指南

## 📁 文件说明

- `build-apk-windows.ps1` - PowerShell 构建脚本
- `team-deploy-source.zip` - 完整的项目源代码
- `APK_BUILD_INSTRUCTIONS.md` - 详细的构建说明（英文）

## 🚀 快速开始

### 第一步：解压源代码

1. 右键点击 `team-deploy-source.zip`
2. 选择 "解压到 team-deploy-source\" 
3. 等待解压完成

### 第二步：安装必要的环境

#### 1. Node.js
- 下载地址：https://nodejs.org/
- 下载 LTS 版本（推荐 v18 或 v20）
- 安装时勾选 "Add to PATH"
- 验证安装：打开 PowerShell，输入 `node --version`

#### 2. Java JDK 17
- 下载地址：https://adoptium.net/
- 选择 "Eclipse Temurin JDK 17"
- 下载 Windows x64 版本并安装
- 设置环境变量 `JAVA_HOME`（安装程序通常会自动设置）

#### 3. Android Studio
- 下载地址：https://developer.android.com/studio
- 下载并安装 Android Studio
- 启动 Android Studio，完成初始设置（会自动下载 Android SDK）

### 第三步：运行构建脚本

#### 方法 1：右键运行（推荐）
1. 将 `build-apk-windows.ps1` 复制到解压后的 `team-deploy-source` 文件夹中
2. 右键点击 `build-apk-windows.ps1`
3. 选择 "使用 PowerShell 运行"
4. 如果提示执行策略问题，看下面的 "常见问题"

#### 方法 2：命令行运行
1. 打开 PowerShell（以管理员身份）
2. 进入项目目录：
   ```powershell
   cd D:\Users\Administrator\Desktop\TeamDeploy-APK-Build\team-deploy-source
   ```
3. 执行脚本：
   ```powershell
   .\build-apk-windows.ps1
   ```

### 第四步：获取 APK

构建成功后，APK 文件位于：
```
team-deploy-source\app\android\app\build\outputs\apk\debug\app-debug.apk
```

## ⚠️ 常见问题

### 1. 执行策略错误
如果提示 "无法加载脚本，因为在此系统上禁止运行脚本"，请执行：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

然后输入 `Y` 确认。

### 2. 找不到 Android SDK
脚本会自动查找常见的 Android SDK 安装位置。如果找不到：

1. 找到你的 Android SDK 路径（通常在 `C:\Users\你的用户名\AppData\Local\Android\Sdk`）
2. 设置环境变量：
   ```powershell
   [Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\Administrator\AppData\Local\Android\Sdk", "User")
   ```
3. 重启 PowerShell

### 3. Gradle 下载慢
首次构建时需要下载 Gradle，可能需要 10-20 分钟。如果下载很慢：

1. 可以配置 Gradle 使用国内镜像
2. 或者耐心等待下载完成

### 4. 构建失败
如果构建失败，脚本会显示错误信息。常见问题：

- **Node.js 未安装**：安装 Node.js 后重试
- **Java 未安装**：安装 JDK 17 后重试
- **内存不足**：关闭其他程序后重试

## 📱 安装 APK 到手机

构建成功后，你可以：

### 方法 1：使用 ADB 安装
```powershell
cd team-deploy-source\app\android\app\build\outputs\apk\debug
adb install app-debug.apk
```

### 方法 2：手动安装
1. 将 `app-debug.apk` 复制到手机
2. 在手机上点击安装
3. 如果提示"未知来源"，请在设置中允许安装未知应用

## 🛠️ 手动构建（不使用脚本）

如果脚本无法运行，你可以手动执行构建步骤：

```powershell
# 1. 进入项目目录
cd team-deploy-source

# 2. 安装依赖
npm install

# 3. 构建前端
npm run build

# 4. 进入 app 目录
cd app

# 5. 安装 app 依赖
npm install

# 6. 添加 Android 平台
npx cap add android

# 7. 同步到 Android
npx cap sync android

# 8. 进入 Android 目录
cd android

# 9. 构建 APK
.\gradlew.bat assembleDebug
```

构建完成后，APK 在 `app\android\app\build\outputs\apk\debug\app-debug.apk`

## 📞 需要帮助？

如果在构建过程中遇到问题：

1. 查看脚本输出的错误信息
2. 检查环境变量是否正确设置
3. 确保所有依赖都已正确安装
4. 尝试重启电脑后重新构建

## 📝 构建流程说明

构建脚本会按以下顺序执行：

1. ✅ 检查 Node.js 是否安装
2. ✅ 检查 Java JDK 是否安装
3. ✅ 检查 Android SDK 是否安装
4. ✅ 安装项目依赖 (npm install)
5. ✅ 构建前端项目 (npm run build)
6. ✅ 添加 Android 平台 (cap add android)
7. ✅ 同步到 Android (cap sync android)
8. ✅ 构建 APK (gradlew assembleDebug)

整个过程大约需要 10-30 分钟，取决于你的网络速度和电脑性能。

---

**祝你构建成功！** 🎉
