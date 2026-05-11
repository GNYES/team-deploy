# TeamDeploy - 团队铺设管理系统

## 项目简介

一款专为团队铺设管理设计的移动应用，包含用户端App和管理后台。

## 目录结构

```
team-deploy-full/
├── .github/
│   └── workflows/
│       └── build.yml          # GitHub Actions 自动构建配置
├── app/                        # 用户端App源码
│   ├── src/                    # React组件
│   ├── android/                # Android原生项目
│   ├── capacitor.config.ts     # Capacitor配置
│   └── package.json
├── admin/                      # 管理后台源码
│   ├── src/                    # React组件
│   └── package.json
├── docs/                       # 项目文档
│   ├── prd.md                  # 产品需求文档
│   └── api.md                  # API文档
└── README.md                   # 项目说明
```

## 快速开始

### 本地开发

```bash
# 克隆项目
git clone <your-repo-url>
cd team-deploy-full

# 安装App依赖
cd app && npm install && cd ..

# 安装Admin依赖
cd admin && npm install && cd ..

# 启动App开发服务器 (端口5176)
cd app && npm run dev

# 启动Admin开发服务器 (端口5177)
cd admin && npm run dev
```

### GitHub Actions 自动构建

推送代码到 `main` 分支后：

1. **APK自动构建** - 自动生成APK文件到Artifact
2. **管理后台部署** - 自动部署到GitHub Pages

## GitHub设置步骤

### 1. 创建仓库

在GitHub上创建新仓库，上传代码：

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<username>/team-deploy.git
git push -u origin main
```

### 2. 查看构建结果

1. 进入仓库 → Actions
2. 查看 "Build Android APK" workflow
3. 构建完成后，点击 Artifacts 下载APK

### 3. 访问管理后台

启用GitHub Pages后访问：
`https://<username>.github.io/team-deploy/`

## 功能模块

### App端 (app/)

| 页面 | 功能 |
|------|------|
| 首页 | 数据概览、排行榜、成就预览 |
| 铺设 | 提交铺设记录（设备+蓝环） |
| 排行 | 团队/个人排名 |
| 工资 | 收入计算、佣金明细 |
| 社区 | 动态发布、点赞互动 |
| 成就 | 徽章收集、每日任务 |
| 个人 | 账户信息、设置 |

### 管理后台 (admin/)

| 页面 | 功能 |
|------|------|
| 控制台 | 数据总览、图表统计 |
| 用户管理 | 添加/编辑/删除成员 |
| 团队管理 | 团队信息维护 |
| 铺设记录 | 查看所有记录 |
| 工资配置 | 设置单价、提成、奖金 |
| 导入导出 | Excel批量导入导出 |
| 系统设置 | 数据管理 |

## 技术栈

- **前端**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS
- **状态**: Zustand + localStorage
- **图表**: Recharts
- **图标**: Heroicons
- **移动端**: Capacitor
- **CI/CD**: GitHub Actions

## 分支说明

| 分支 | 用途 |
|------|------|
| main | 主分支，稳定版本 |
| dev | 开发分支 |

## License

MIT License
# Trigger build Mon May 11 10:36:07 UTC 2026
