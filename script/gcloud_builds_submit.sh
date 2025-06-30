#!/bin/bash

echo "Cloud Build 실행 시작..."

gcloud builds submit --config ../cloudbuild.yaml ..

if [ $? -eq 0 ]; then
  echo "Cloud Build 실행 성공!"
  echo "자세한 빌드 로그는 GCP Cloud Build 콘솔에서 확인하세요."
else
  echo "Cloud Build 실행 실패."
  echo "오류 메시지를 확인하고 문제를 해결해주세요."
fi