const dotenv = require('dotenv');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';

// 개발 환경에 따른  환경변수 불러오기
dotenv.config({
  path: path.join(
    process.cwd(),
    isDev ? '.env.development' : '.env.production',
  ),
});

const { POSTGRES_HOST, POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PW } =
  process.env;

module.exports = {
  development: {
    username: POSTGRES_USER,
    password: POSTGRES_PW,
    database: POSTGRES_DATABASE,
    host: POSTGRES_HOST,
    dialect: 'postgres',
  },
  test: {
    username: POSTGRES_USER,
    password: POSTGRES_PW,
    database: POSTGRES_DATABASE,
    host: POSTGRES_HOST,
    dialect: 'postgres',
  },
  production: {
    username: POSTGRES_USER,
    password: POSTGRES_PW,
    database: POSTGRES_DATABASE,
    host: POSTGRES_HOST,
    dialect: 'postgres',
  },
};
