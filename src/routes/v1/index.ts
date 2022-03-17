import * as Router from 'koa-router';

import auth from './auth';
import posts from './posts';
import users from './users';
import files from './files';

export class ApiRouter {
  public v1: Router;

  constructor() {
    this.v1 = new Router();
    this.routes();
  }

  public routes = () => {
    const { v1 } = this;
    v1.use('/auth', auth.routes());
    v1.use('/posts', posts.routes());
    v1.use('/users', users.routes());
    v1.use('/files', files.routes());
  };
}

const apiRouter = new ApiRouter();
const v1 = apiRouter.v1;

export default v1;
