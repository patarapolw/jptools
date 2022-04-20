#!/usr/bin/env bash

set -e

rm -rf dist

GH=1 yarn build
GIT_URL=$(git remote get-url origin)

cd dist

touch .nojekyll

git init
git checkout -b gh-pages
git add -A
git commit -m 'deployed by gh-deploy.sh'
git push -f $GIT_URL gh-pages

cd -
