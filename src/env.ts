import * as path from 'path';

const isDev = process.env.NODE_ENV !== 'production';

// 개발 환경에 따른  환경변수 불러오기
require('dotenv').config({
  path: path.join(
    process.cwd(),
    isDev ? '.env.development' : '.env.production',
  ),
});
