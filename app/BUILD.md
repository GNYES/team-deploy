# TeamDeploy App 构建说明

## 项目状态

✅ Web应用已构建完成
⚠️ APK构建因网络限制无法在当前环境完成

## 快速开始

### Web版本（推荐）

**App端**: http://localhost:5178/
**管理后台**: http://localhost:5179/

### 移动端H5版本

直接在手机浏览器中打开上述地址，可以"添加到主屏幕"创建类似App的快捷方式。

## 构建APK（需要本地环境）

由于服务器网络限制，无法直接下载Android构建工具。请在本地环境执行以下步骤：

### 前置要求
- Node.js 18+
- Android Studio 或 Java 11+
- Gradle

### 构建步骤

```bash
# 1. 下载项目
cd /workspace/team-deploy-app

# 2. 安装依赖
npm install

# 3. 添加Android平台
npx cap add android

# 4. 同步到Android
npx cap sync android

# 5. 构建APK
cd android
./gradlew assembleDebug

# 6. APK位置
# android/app/build/outputs/apk/debug/app-debug.apk
```

### 一键构建脚本

项目已包含 `build-apk.sh` 脚本：

```bash
chmod +x build-apk.sh
./build-apk.sh
```

## 文件结构

```
team-deploy-app/
├── dist/                    # Web构建产物
├── android/                  # Android原生项目
├── src/                      # React源码
├── capacitor.config.ts       # Capacitor配置
├── build-apk.sh             # APK构建脚本
└── package.json
```

## 功能模块

| 模块 | 说明 |
|------|------|
| 首页 | 数据概览、排行榜预览、成就展示 |
| 铺设 | 提交铺设记录（设备+蓝环） |
| 排行 | 团队/个人排名 |
| 工资 | 收入计算、佣金明细 |
| 社区 | 动态发布、互动 |
| 成就 | 徽章系统、每日任务 |
| 个人中心 | 账户信息、设置 |

## 管理后台

访问 http://localhost:5179/

| 功能 | 说明 |
|------|------|
| 用户管理 | 添加/编辑/删除成员 |
| 团队管理 | 团队信息维护 |
| 铺设记录 | 查看所有记录 |
| 工资配置 | 设置提成比例、奖金 |
| 导入导出 | Excel批量导入导出 |

## 部署选项

### 方案1: Vercel/Netlify（推荐）
```bash
# 安装Vercel CLI
npm i -g vercel
cd dist && vercel
```

### 方案2: Nginx
```bash
# 将dist目录内容复制到nginx/html
cp -r dist/* /usr/share/nginx/html/
```

### 方案3: 任意Web服务器
dist目录包含完整的静态文件，可部署到任意HTTP服务器。

## 技术栈

- React 18 + TypeScript
- Vite 构建工具
- Tailwind CSS
- Zustand 状态管理
- Capacitor 跨平台打包
- Recharts 图表
