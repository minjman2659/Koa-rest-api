import { Context } from 'koa';

const checkAuth = (ctx: Context, next: () => Promise<any>) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    ctx.body = 'NOT_LOGGED';
    return;
  }
  return next();
};

export default checkAuth;
