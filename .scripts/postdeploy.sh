#!/bin/bash

# prefix child processes' stdout and stderr with '[postdeploy] '
exec > >(sed 's/^/[postdeploy] /')
exec 2> >(sed 's/^/[postdeploy] /' >&2)

echo '-- Installing Packages... --'
npm ci

echo '-- Running Build... --'
npm run build

echo '-- Restarting Server... --'
pm2 reload $1 --update-env

echo '-- Complete! --'
