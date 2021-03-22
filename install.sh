#!/bin/bash

# [WIP] Install Homepage "locally" using file:// protocol
# Features:
#   Trello:             KINDA WORKING (see below)
#   Google Calendar:    NOT WORKING
#   Weather:            WORKING 
#   Bookmarks:          WORKING
#   Local Background:   WORKING (see how below)


## HOW TO MAKE TRELLO WORK?
#    1 - Login to Trello in the live or in a localhost instance
#    2 - Open your browser dev tools
#    3 - Go to "Application" and find the Local Storage
#    4 - Copy the value of "trello_token"
#    5 - Open the file:// hosted one and go to the Local Storage too
#    6 - Paste the "trello_token" value there
#    7 - Do the same with the "trello-config" value

## HOW TO USE A LOCAL BACKGROUND?
#   1 - Put the image file in the backgrounds/ folder
#   2 - Rename the file to a simple name (without special chars and spaces)
#   3 - In the homepage background config, use ./backgrounds/NAME.png
#   4 - Don't forget to change NAME.png to the name of your file

# 0. Assign variables and check for the build/ folder
TARGET_FOLDER=$1

if [ -z "$TARGET_FOLDER" ]
then
  echo "you need to provide a target folder"
  exit -1
fi
if [ ! -d "$TARGET_FOLDER" ]
then
  echo "target folder not found"
  exit -1
fi
echo "installing to $TARGET_FOLDER"

if [ ! -d "build/" ]
then
  echo "build/ folder not found... maybe you need to run yarn build?"
  exit -1
fi
echo "build/ folder found..."
# 1. Copy the build/ file to the target folder
cp -r ./build/* $TARGET_FOLDER
# 2. Reformat code (using prettier-cli https://prettier.io/docs/en/cli.html)
prettier --write $TARGET_FOLDER/index.html
# 3. Change absolute paths to relative ones
sed -i "s/\/homepage\//.\//g" $TARGET_FOLDER/index.html
# 4. Create a folder to store backgrounds
mkdir $TARGET_FOLDER/backgrounds
