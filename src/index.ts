import { Context } from 'koa';

const Koa = require('koa');
const app = new Koa();

app.use((ctx: Context) => {
  ctx.body = 'Hello World!';
});

app.listen(4000, () => {
  console.log('Listening to port 4000');
});
