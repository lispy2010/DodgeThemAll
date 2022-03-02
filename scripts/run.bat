@echo off
rem This file should be called from scripts directory!
call compile
python minify.py
npx electron ../main.js