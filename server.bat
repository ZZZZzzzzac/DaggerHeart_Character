@echo off
echo 启动本地服务器...
echo 访问地址：http://localhost:8080
echo 按 Ctrl+C 可停止服务器
echo.
cd /d "%~dp0"
python -m http.server 8080
pause
