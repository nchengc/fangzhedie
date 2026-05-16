@echo off
chcp 65001 >nul
cd /d "g:\【0】209 Python\小程序\FangZheDie"

echo [1/6] 配置Git用户信息...
git config user.email "user@example.com"
git config user.name "FangZheDie"

echo [2/6] 初始化Git仓库...
git init

echo [3/6] 添加所有文件...
git add .

echo [4/6] 提交...
git commit -m "Initial commit: 防折叠助手小程序 v1.0"

echo [5/6] 配置远程仓库...
git remote remove origin 2>nul
git remote add origin https://github.com/nchengc/fangzhedie.git

echo [6/6] 推送代码...
git branch -M master
git push -u origin master --force

echo.
echo ================================
echo 完成！请检查上方是否有错误
echo ================================
pause