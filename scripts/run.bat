@echo off
call compile
python3 minify.py
npx electron ../main.js