import * as Router from 'koa-router';

import auth from './auth';
import users from './users';

export class ApiRouter {
  public api: Router;

  constructor() {
    this.api = new Router();
    this.routes();
  }

  public routes = () => {
    const { api } = this;
    api.use('/auth', auth.routes());
    api.use('/users', users.routes());
  };
}

const apiRouter = new ApiRouter();
const api = apiRouter.api;

export default api;
