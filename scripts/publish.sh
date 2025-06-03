#!/bin/bash
set -e

if [ "$#" -lt 2 ]
then
  echo "Error: must explicitly run script in one of two ways: option 1: {patch|minor|major} {version update message} {origin branch name}"
  echo "Option 2: {OTP} {auto} which patches origin/main and publishes with a generated message"
  exit 1
fi

if [ $2 -eq "auto" ]
then
  OTP=$1
  VERSIONCHANGE="patch"
  MSG="Automated patch bringing statue up to date with latest dev changes"
  LABEL="latest"
  VISIBILITY="public"
else
    VERSIONCHANGE=$1
    if [ -z "$2" ]
    then
        echo "Error: Must provide statue release message for manual pushes"
        exit 1
    fi
    MSG=$2
    if [ -z "$3" ]
    then
        echo "Error: Must provide git origin source branch for manual pushes"
        exit 1
    fi
    LABEL=$3
    VISIBILITY="restricted"
fi

git checkout $LABEL
git pull
npm version $VERSIONCHANGE -m $MSG
git push origin $LABEL --follow-tags --force
if [ $2 -eq "auto" ]
then
    npm publish --tag=$LABEL --access=$VISIBILITY --otp=$OTP
else
    npm publish --tag=$LABEL --access=$VISIBILITY
fi
