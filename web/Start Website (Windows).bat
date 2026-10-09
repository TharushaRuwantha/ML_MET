@echo off
cd /d "%~dp0"
echo Starting Sri Lanka Drought Watch website...
start "" http://localhost:8080
py -m http.server 8080 || python -m http.server 8080
pause
