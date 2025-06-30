#!/bin/bash

# 커밋 메시지를 여기에 작성하세요.
COMMIT_MESSAGE="자동 커밋 및 푸시"

# 푸시할 브랜치 이름을 여기에 작성하세요.
BRANCH_NAME="server_app_master"

git add .
if [ $? -eq 0 ]; then
  git commit -m "$COMMIT_MESSAGE"
  if [ $? -eq 0 ]; then
    git push origin $BRANCH_NAME
    if [ $? -eq 0 ]; then
      echo "Git 작업 성공: 커밋 및 푸시 완료"
    else
      echo "Git 작업 실패: 푸시 실패"
    fi
  else
    echo "Git 작업 실패: 커밋 실패"
  fi
else
  echo "Git 작업 실패: add 실패"
fi

# git push
# git push -u origin server_app_master
