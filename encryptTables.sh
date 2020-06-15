#!/bin/sh
SOURCE="./app/Database"
echo "Source: $SOURCE"
echo python ./encryptTables.py $SOURCE
python ./encryptTables.py $SOURCE
echo "Table encryption succeeded!"
