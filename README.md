# bly-user-nodejs

### 실행 방법
1. yarn 설치 (OSX 기준)
```bash
brew install yarn --without-node # node가 설치되어 있다면
brew install yarn # node가 없다면
```
2. .env 파일 커스텀
- DB 관련 변수를 로컬 MySQL 서버에 맞게 변경
3. yarn 명령어를 통한 서버 실행
```bash
yarn add package.json # 필요한 패키지 설치
yarn start # 서버 실행
```
### 사용 언어 및 기술
* NodeJS
  + Koa
  + Sequelize
  + Redis
  + Joi
* MySQL

### 구현 스펙
* 회원가입
  + 전화번호 인증 여부 확인
* 로그인 및 로그아웃
  + 전화번호 인증 여부 확인
  + 이메일 또는 전화번호 + 비밀번호
  + 중복 로그인 불가 (재로그인 시 로그아웃 필수)
* 사용자 정보 조회
* 비밀번호 재설정
  + 전화번호 인증 여부 확인

### etc
* 캐시를 이용한 기능 구현
  + 전화번호 인증
    - 전화번호 인증을 위한 코드 발급 시 캐시에 `전화번호:코드` 저장
    - 코드 입력 시 일치할 경우, 해당 캐시 값을 `전화번호:verified` 로 변경
    - 회원가입 및 비밀번호 재설정 시 `전화번호:verified` 값 확인
  + 로그인 시 캐시에 `idx:login` 저장
    - 로그아웃 시 제거
    - 토큰의 개념과는 다르므로 중복 로그인 불가
  + SMS 전송 API
    - 구현하였으나, 해당 외부 API 콘솔에 등록된 전화번호만 전송되어 사용하지 않음 (sms.js 파일)
* Request Body Validation
  + Joi 프레임워크를 활용하여 클라이언트에서 들어오는 요청의 포맷 체크를 통한 예외 처리