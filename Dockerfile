FROM node:16-alpine

## 프로젝트의 모든 파일을 /app 으로 복사
WORKDIR /usr/src/app
COPY . .

## 필요한 라이브러리들 설치 후 빌드 진행
RUN yarn global add sequelize-cli nodemon
RUN yarn add ts-node typescript koa @types/koa jest @types/jest ts-jest
RUN yarn

EXPOSE 8082
