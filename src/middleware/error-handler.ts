import { Context } from 'koa';

const errorHandler = async (ctx: Context, next: () => Promise<any>) => {
  try {
    await next();
    if (ctx.status === 404) {
      const { url } = ctx.request;
      const removeLog = ['/favicon.ico'].includes(url);
      if (removeLog) {
        ctx.response.status = 200;
        return;
      }
      const isContent = url.includes('/images');
      const message = isContent ? 'NOT_FOUND' : 'MISSING_PATH';
      const body = ctx.body ? ctx.body : message;
      ctx.throw(404, body);
    }
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message || err;
    ctx.app.emit('error', err, ctx);
  }
};

export default errorHandler;
