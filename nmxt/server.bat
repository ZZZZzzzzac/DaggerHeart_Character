@echo off
cd /d "%~dp0"
echo Serving nmxt at http://localhost:8080
echo Press Ctrl+C to stop the server.
where py >nul 2>nul
if %errorlevel%==0 (
    py -m http.server 8080
    goto :eof
)
python -m http.server 8080
