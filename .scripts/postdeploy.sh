#!/bin/bash
echo '[postdeploy] Installing Packages...'
npm ci

echo '[postdeploy] Running Build...'
npm run build

echo '[postdeploy] Restarting Server...'
pm2 reload all

echo '[postdeploy] Complete!'
