import * as Router from 'koa-router';
import { format } from 'date-fns';

import v1 from './v1';

export class ApiRouter {
  public api: Router;

  constructor() {
    this.api = new Router();
    this.routes();
  }

  public routes = () => {
    const { api } = this;
    api.use('/v1', v1.routes());
    api.get('/ping', ctx => {
      const now = new Date();
      const time = format(now, 'yyyy-MM-dd HH:mm:ss');
      const text = `Current Time: ${time}`;
      ctx.body = text;
    });
  };
}

const apiRouter = new ApiRouter();
const api = apiRouter.api;

export default api;
