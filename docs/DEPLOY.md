# Cloud Build를 이용한 Cloud Run 배포 요약 (핵심 단계)

이 문서는 Cloud Build를 사용하여 소스 코드를 빌드하고 Google Cloud Run에 배포하는 일련의 과정을 요약합니다.

이 문서는 Cloud Build를 사용하여 소스 코드를 빌드하고 Google Cloud Run에 배포하는 과정 중 핵심 단계를 요약합니다.

## 배포 과정

### 1. 변경 사항 커밋 및 푸시

로컬 코드의 변경 사항을 Git에 커밋하고 Cloud Build와 연동된 소스 코드 저장소에 푸시합니다.

### 2. Run Cloud Build (Manual or Trigger)

gcloud builds submit --config cloudbuild.yaml .

### 3. Deploy to Cloud Run

gcloud run deploy wecan-show-be --image asia-northeast3-docker.pkg.dev/wecan-quiz/wecan-show-be-docker/wecan-show-be:latest --platform managed --region asia-northeast3 --allow-unauthenticated

### 4. Verify Deployment

curl -H "x-api-key: aabbccdd" https://wecan-show-be-800866657706.asia-northeast3.run.app/
