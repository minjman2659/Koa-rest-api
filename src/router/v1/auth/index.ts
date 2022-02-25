import * as Router from 'koa-router';
import checkAuth from 'middleware/check-auth';

import AuthCtrl from './auth.ctrl';

class AuthRouter {
  public auth: Router;

  constructor() {
    this.auth = new Router();
    this.routes();
  }

  public routes = () => {
    const { auth } = this;
    auth.post('/register', AuthCtrl.register);
    auth.get('/checkEmail/:email', AuthCtrl.checkEmail);
    auth.post('/login', AuthCtrl.login);
    auth.post('/logout', checkAuth, AuthCtrl.logout);
  };
}

const authRouter = new AuthRouter();
const auth = authRouter.auth;

export default auth;
