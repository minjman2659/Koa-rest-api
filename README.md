# koa-rest-api

NodeJS의 프레임워크 Koa를 활용한 REST API <br />

### [Why Koa?](https://koajs.com/)

```plain
 1. Express보다 빠르고 경량화된 프레임워크
 2. async/await 비동기 지원
```

<br />

## 💻 기술 스택

Koa, Typescript, Sequelize, PostgreSQL, JWT

<br />

## 🔖 환경 설정

.env.example을 참고하여 실행할 환경에 따라 .env.development 또는 .env.production으로 파일명 변경

```javascript
# server
PORT=something // 서버 실행 포트 넘버
API_HOST=something // API 실행 URL
CLIENT_HOST=something // 클라이언트 실행 URL

# auth
SECRET_KEY=something // JWT를 이용하여 토큰을 생성할때 사용할 Key값
PASSWORD_SALT=something // 패스워드 암호화시 필요한 Salt값

# environment
NODE_ENV=something // 실행 환경

# database
POSTGRES_DATABASE=something // 데이터베이스 이름
POSTGRES_HOST=something // 데이터베이스 주소
POSTGRES_USER=something // 데이터베이스 관리자 이름
POSTGRES_PW=somethings // 데이터베이스 관리자 비밀번호
```

<br />

## 📌 실행 방법

Node 16 혹은 그 이상의 버전을 필요로 합니다.

```javascript
 $ yarn // install dependencies
 $ yarn start 또는 $ yarn start:dev // run server
```

### Database

Sequelize 마이그레이션

```javascript
 $ npx sequelize-cli migration:generate --name <name> // create migration file using sequelize cli
 $ yarn db:migrate // running migrations
```

Sync Database

```javascript
 $ yarn db:sync // sync database
```

### Build

타입스크립트 컴파일링

```javascript
 $ yarn build // compile ts files
 $ yarn dev 또는 $ yarn server // run compiled js files
```

### Test

```javascript
 $ yarn test // run jest
```

<br />

## 📋 API 명세서

yarn 으로 필요한 패키지 설치 진행 후 <br />
http://localhost:4000/swagger 주소 입력

![image](https://user-images.githubusercontent.com/81504356/157035380-dd245673-7fd9-4ae1-9afc-8319a9035c71.png)
