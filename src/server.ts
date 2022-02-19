import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import { format } from 'date-fns';

import db from './database/models';
import api from 'router';

export default class Server {
  public app: Koa;
  public router: Router;

  constructor() {
    this.app = new Koa();
    this.router = new Router();
    this.initializeDB();
    this.routes();
    this.middleware();
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
    router.use('/api', api.routes());
    router.get('/ping', ctx => {
      const now = new Date();
      const time = format(now, 'yyyy-MM-dd HH:mm:ss');
      const text = `Current Time: ${time}`;
      ctx.body = text;
    });
  };

  public middleware = (): void => {
    const { app, router } = this;
    app.use(koaBody());
    app.use(router.routes()).use(router.allowedMethods());
  };

  public listen = (port: number): void => {
    const { app } = this;
    app.listen(port, () => {
      console.log(`server is running, port number is ${port}`);
    });
  };
}
