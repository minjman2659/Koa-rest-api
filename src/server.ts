import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import * as cors from '@koa/cors';
import * as Boom from 'boom';

import db from 'database';
import api from 'router';
import logger from 'lib/logger';
import consumeToken from 'middleware/consume-token';
import errorHandler from 'middleware/error-handler';

export default class Server {
  public app: Koa;
  public router: Router;

  constructor() {
    this.app = new Koa();
    this.router = new Router();
    this.initializeDB();
    this.middleware();
    this.routes();
  }

  public initializeDB = (): void => {
    db.sequelize.authenticate().then(
      () => {
        db.sequelize.sync();
        console.log('DB connection is established');
      },
      (err: any) => {
        console.log(`Unable to connect to be DB: ${err}`);
      },
    );
  };

  public routes = (): void => {
    const { router } = this;
    router.get('/', ctx => (ctx.body = 'Hello Koa!'));
    router.use('/api', api.routes());
  };

  public middleware = (): void => {
    const { app, router } = this;
    app.use(koaBody({ jsonLimit: '40mb' }));
    app.use(
      cors({
        origin: 'http://localhost:3000',
        credentials: true,
      }),
    );
    app.use(consumeToken);
    app.use(errorHandler);
    // router.routes(): 요청된 URL과 일치하는 라우터를 리턴하는 미들웨어
    // router.allowedMethods(): OPTIONS 요청에 응답하고, 405(Method Not Allowed)와 501(Not Implemented)를 응답하는 별도의 미들웨어
    app.use(router.routes()).use(
      router.allowedMethods({
        throw: true,
        // boom 모듈을 이용해 405, 501 에러 처리
        notImplemented: () => Boom.notImplemented('that method is not allowed'),
        methodNotAllowed: () =>
          Boom.methodNotAllowed('that method is not allowed'),
      }),
    );
  };

  public listen = (port: number): void => {
    const { app } = this;
    app.on('error', (err, ctx) => {
      logger.error(`server error : ${ctx.status} / ${err.message}`);
    });
    app.listen(port, () => {
      logger.info(`server is running, port number is ${port}`);
    });
  };
}
