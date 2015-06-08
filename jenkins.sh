#!/bin/bash
eval "$(rbenv init -)"
rbenv shell 1.9.3-p551
git clean -fd

RBENV_GEMSETS=./gems gem install compass --no-ri --no-rdoc
rbenv rehash

npm run $1
