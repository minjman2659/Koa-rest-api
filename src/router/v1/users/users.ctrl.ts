import { Context } from 'koa';
import { User } from 'database/models';

export default class UserCtrl {
  static getUser = async (ctx: Context) => {
    ctx.body = JSON.stringify(User);
  };
}
