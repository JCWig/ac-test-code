#!/bin/bash
eval "$(rbenv init -)"
rbenv shell 1.9.3-p551
set -x
git clean -fd

RBENV_GEMSETS=./gems gem install compass --no-ri --no-rdoc
rbenv rehash

npm run $1 -- --jenkins

if [ -e ./dist/akamai-core.min.js ]
  then
    echo "akamai core minified bundle exists";
    exit 0;
  else
    echo "akamai core minified bundle does not exist!!! Exiting with error";
    exit 1;
fi
