import * as Router from 'koa-router';

import UserCtrl from './users.ctrl';

class UserRouter {
  public users: Router;

  constructor() {
    this.users = new Router();
    this.routes();
  }

  public routes = () => {
    const { users } = this;
    users.get('/:userId', UserCtrl.getUser);
  };
}

const userRouter = new UserRouter();
const users = userRouter.users;

export default users;
