#!/bin/bash

echo "Cloud Run 배포 시작..."

gcloud run deploy wecan-show-be \
    --image asia-northeast3-docker.pkg.dev/wecan-quiz/wecan-show-be-docker/wecan-show-be:latest \
    --platform managed \
    --region asia-northeast3 \
    --allow-unauthenticated

if [ $? -eq 0 ]; then
  echo "Cloud Run 배포 성공!"
  # 배포된 서비스 URL을 출력할 수도 있습니다.
  # gcloud run services describe wecan-show-be --region asia-northeast3 --format='value(status.url)'
else
  echo "Cloud Run 배포 실패."
  echo "오류 메시지를 확인하고 문제를 해결해주세요."
fi