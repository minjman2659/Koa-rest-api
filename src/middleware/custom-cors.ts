import { Context } from 'koa';

const customCors = (ctx: Context, next: any) => {
  const allowedOrigin = ['http://localhost:3000'];

  // whiteList
  if (allowedOrigin.includes(ctx.get('origin'))) {
    ctx.set('Access-Control-Allow-Origin', ctx.get('origin')); // origin: true
  }

  ctx.set('Access-Control-Allow-Credentials', 'true');
  ctx.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  );
  ctx.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );

  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    return;
  }

  next();
};

export default customCors;
