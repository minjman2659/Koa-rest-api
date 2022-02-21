import * as Router from 'koa-router';

import users from './users';

export class ApiRouter {
  public api: Router;

  constructor() {
    this.api = new Router();
    this.routes();
  }

  public routes = () => {
    const { api } = this;
    api.use('/users', users.routes());
  };
}

const apiRouter = new ApiRouter();
const api = apiRouter.api;

export default api;
