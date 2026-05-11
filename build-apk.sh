#!/bin/bash

# APK构建脚本 - 使用GitHub Actions
# 由于本地缺少Android SDK，使用GitHub Actions云端构建

set -e

echo "=========================================="
echo "TeamDeploy APK 构建脚本"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否在Git仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}错误: 当前目录不是Git仓库${NC}"
    exit 1
fi

# 获取远程仓库信息
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
if [ -z "$REMOTE_URL" ]; then
    echo -e "${RED}错误: 未配置Git远程仓库${NC}"
    exit 1
fi

# 提取仓库信息
if [[ $REMOTE_URL =~ github.com[/:]([^/]+)/([^/]+)(\.git)?$ ]]; then
    REPO_OWNER="${BASH_REMATCH[1]}"
    REPO_NAME="${BASH_REMATCH[2]}"
    REPO_NAME="${REPO_NAME%.git}"
else
    echo -e "${RED}错误: 无法解析GitHub仓库地址${NC}"
    exit 1
fi

echo -e "${GREEN}仓库: $REPO_OWNER/$REPO_NAME${NC}"
echo ""

# 检查GitHub CLI
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}正在安装 GitHub CLI...${NC}"
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
    sudo apt update && sudo apt install gh -y
fi

# 检查认证状态
echo "检查GitHub认证状态..."
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}需要登录GitHub...${NC}"
    gh auth login
fi

echo -e "${GREEN}✓ GitHub认证正常${NC}"
echo ""

# 推送代码到main分支
echo "推送代码到main分支..."
git add -A
git commit -m "Build APK - $(date '+%Y-%m-%d %H:%M:%S')" || echo "没有变更需要提交"
git push origin main || echo "代码已是最新"
echo -e "${GREEN}✓ 代码已推送${NC}"
echo ""

# 触发GitHub Actions workflow
echo "触发GitHub Actions构建..."
gh workflow run "Build Android APK" --ref main

echo -e "${GREEN}✓ Workflow已触发${NC}"
echo ""

# 获取最新的workflow运行ID
echo "等待workflow启动..."
sleep 5

RUN_ID=$(gh run list --workflow="Build Android APK" --limit=1 --json=databaseId --jq='.[0].databaseId')

if [ -n "$RUN_ID" ]; then
    echo -e "${GREEN}✓ Workflow运行ID: $RUN_ID${NC}"
    echo ""
    echo "=========================================="
    echo "构建已启动！"
    echo "=========================================="
    echo ""
    echo "查看构建进度:"
    echo "  网页: https://github.com/$REPO_OWNER/$REPO_NAME/actions/runs/$RUN_ID"
    echo ""
    echo "或运行以下命令查看实时日志:"
    echo "  gh run watch $RUN_ID"
    echo ""
    echo "下载APK（构建完成后）:"
    echo "  gh run download $RUN_ID"
    echo ""
    echo -e "${YELLOW}预计构建时间: 5-10分钟${NC}"
    echo ""
    
    # 询问是否查看实时日志
    read -p "是否查看实时构建日志? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        gh run watch $RUN_ID
        
        # 构建完成后下载
        echo ""
        echo "构建完成！下载APK..."
        gh run download $RUN_ID --dir ./apk-download
        echo -e "${GREEN}✓ APK已下载到 ./apk-download/${NC}"
    fi
else
    echo -e "${YELLOW}无法获取workflow运行ID，请手动查看:${NC}"
    echo "  https://github.com/$REPO_OWNER/$REPO_NAME/actions"
fi

echo ""
echo "=========================================="
echo "完成！"
echo "=========================================="
