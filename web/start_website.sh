#!/bin/sh
# Double-click this file (or run "sh start_website.sh" in a terminal) to
# launch the website on your computer.
cd "$(dirname "$0")"
echo "Starting Sri Lanka Drought Watch website..."

( sleep 1 && (open http://localhost:8080 2>/dev/null || xdg-open http://localhost:8080 2>/dev/null) ) &

python3 -m http.server 8080 || python -m http.server 8080
