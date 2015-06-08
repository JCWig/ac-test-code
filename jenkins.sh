#!/bin/bash
eval "$(rbenv init -)"
rbenv shell 1.9.3-p551
RBENV_GEMSETS=./gems gem install compass --no-ri --no-rdoc
rbenv rehash

git clean -fd

npm run $1
