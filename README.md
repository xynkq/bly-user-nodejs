# bly-user-nodejs

### 실행 방법
1. yarn 설치 (OSX 기준)
```bash
brew install yarn --without-node # node가 설치되어 있다면
brew install yarn # node가 없다면
```
2. .env 파일 생성
- 해당 레퍼지토리의 루트 경로에 .env 파일 커스텀 필요
- DB 관련 변수를 로컬 MySQL 서버에 맞게 설정
- 기존 서버에 존재하는 계정, 데이터베이스를 이용해야 함
```
PORT = 8000

DB_HOST = 127.0.0.1
DB_USERNAME =
DB_PASSWORD =
DB_PORT = 3306
DB_DIALECT = mysql
DB_DATABASE =

CACHE_USER = login
CACHE_AUTH = verified

SMS_SERVICE_ID =
SMS_ACCESS_KEY =
SMS_SECRET_KEY =
```
3. yarn 명령어를 통한 서버 실행
```bash
yarn add package.json # 필요한 패키지 설치
yarn start # 서버 실행
```
### 사용 언어 및 기술
* NodeJS
  + Koa
  + Joi
  + Sequelize
  + Memory Cache
* MySQL

### 구현 스펙
* 회원가입
  + 전화번호 인증 여부 확인
  + 중복 이메일, 전화번호 가입 불가
* 로그인 및 로그아웃
  + 전화번호 인증 여부 확인
  + 이메일 또는 전화번호 + 비밀번호
  + 중복 로그인 불가 (재로그인 시 로그아웃 필수)
* 사용자 정보 조회
* 비밀번호 재설정
  + 전화번호 인증 여부 확인

### etc
* Request Body Validation
  + Joi 프레임워크를 활용하여 클라이언트에서 들어오는 요청의 포맷 체크를 통한 예외 처리
    - 이메일 : 형식 확인
    - 비밀번호 : 8-20자 이내
    - 이름, 닉네임 : 2-20자 이내
    - 전화번호 : '-' 없이 11자 (ex. 01012345678)
  + 검증 오류 시 400 코드 반환
* Auto Create DB Table
  + Sequelize 프레임워크를 활용하여 서버 실행 시 DB 환경 변수에 맞춰 테이블 생성 (.env 참조)
* Cache 활용을 통한 기능 구현
  + 전화번호 인증
    - SMS 외부 API를 활용하여 구현하였으나, 해당 API의 콘솔에 등록된 전화번호만 전송되어 사용하지 않음 (sms.js)
    - 대신 서버 자체에서 임의의 코드 생성 후 Response Body 에 포함해 전송
    - 전화번호 인증을 위한 코드 발급 시 캐시에 `전화번호:코드` 저장
    - 코드 입력 시 일치할 경우, 해당 캐시 값을 `전화번호:verified` 로 변경
    - 회원가입 및 비밀번호 재설정 시 `전화번호:verified` 값 확인
  + 로그인 시 캐시에 `idx:login` 저장
    - 로그아웃 시 제거
    - 토큰의 개념과는 다르므로 중복 로그인 불가