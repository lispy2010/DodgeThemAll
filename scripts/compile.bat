@echo off
dir /b /s *.ts > ts-files.txt
tsc -t es6 --removeComments @ts-files.txt
python minify.py