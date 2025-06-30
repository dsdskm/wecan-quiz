# API 테스트 스크립트 가이드

이 가이드는 계정 등록 API 엔드포인트를 테스트하기 위해 `test_register_account.js` 스크립트를 실행하는 방법을 설명합니다.

## 사전 준비사항

스크립트를 실행하기 전에 다음 사항을 확인하십시오.

1.  시스템에 Node.js가 설치되어 있어야 합니다.
2.  API 서버가 로컬에서 실행 중이며 접근 가능해야 합니다.

## 스크립트 실행

테스트 스크립트를 실행하려면 터미널 또는 명령 프롬프트를 열고 프로젝트 디렉터리로 이동한 다음 다음 명령을 실행하십시오.
```
bash
node test_register_account.js
```
This command will execute the `test_register_account.js` script, which will make a POST request to the `/accounts/register` endpoint with example email and password data, including the necessary API key in the headers. The script will then print the API's response to the console.

Ensure that your local API server is running before executing the script for a successful test.