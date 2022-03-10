#!/usr/bin/bash
# check if script is run in scripts folder
if [ ! -d "scripts" ]; then
    echo "Please run this script in the scripts folder"
    exit 1
fi
bash compile.sh
python3 minify.py
npx electron ../main.js