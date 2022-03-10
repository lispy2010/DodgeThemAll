#!/usr/bin/bash
# Get all .ts files in current directory
FILES=`find . -name "*.ts"`

# Compile all .ts files
for f in $FILES
do
  tsc $f
done