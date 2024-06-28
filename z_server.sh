#!/bin/bash
set -e

# cd
cd /var/www/project/JPAGE
status=$?
if [ $status -eq 0 ]; then
  echo "cd : success"
else
  echo "cd : fail"
  exit $status
fi

# git fetch
git fetch --all && git reset --hard origin/master
status=$?
if [ $status -eq 0 ]; then
  echo "fetch : success"
else
  echo "fetch : fail"
  exit $status
fi

# pm2에서 index.js가 실행 중인지 확인
if pm2 list | grep -q "index.js"; then
  pm2 delete index.js
  pm2 save
  status=$?
  if [ $status -eq 0 ]; then
    echo "pm delete : success"
  else
    echo "pm delete : fail"
    exit $status
  fi
fi

# pm2 start
pm2 start index.js
pm2 save
status=$?
if [ $status -eq 0 ]; then
  echo "pm start : success"
else
  echo "pm start : fail"
  exit $status
fi

# pm2 restart
pm2 restart all
pm2 save
status=$?
if [ $status -eq 0 ]; then
  echo "pm restart : success"
else
  echo "pm restart : fail"
  exit $status
fi