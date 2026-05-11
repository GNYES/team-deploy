# APK 构建指南

由于本地环境缺少Android SDK，需要使用GitHub Actions进行云端构建。

## 快速构建步骤（2分钟）

### 1. 访问GitHub Actions
打开浏览器访问：
**https://github.com/GNYES/team-deploy/actions**

### 2. 触发构建
1. 点击左侧菜单中的 **"Build Android APK"**
2. 点击右侧绿色按钮 **"Run workflow"**
3. Branch选择：`main`
4. 点击 **"Run workflow"** 确认

### 3. 等待构建完成
- 构建时间：约5-10分钟
- 可以实时查看构建日志

### 4. 下载APK
构建完成后：
1. 点击workflow运行记录
2. 滚动到页面底部 **Artifacts** 部分
3. 点击 **"team-deploy-apk"** 下载

## 本地准备已完成

✅ Web应用已构建：`/workspace/app/dist/`
✅ Android项目已同步：`/workspace/app/android/`

## 构建状态

当前代码已推送到GitHub仓库，可以直接在Actions页面触发构建。

仓库地址：https://github.com/GNYES/team-deploy
