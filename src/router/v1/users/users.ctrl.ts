import { Context } from 'koa';
import db from 'database';

const { User } = db;

export default class UserCtrl {
  static getUser = async (ctx: Context) => {
    const { userId } = ctx.params;
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        ctx.status = 404;
        ctx.body = 'NOT_FOUND_USER';
        return;
      }
      ctx.body = user.toRes();
    } catch (err) {
      ctx.throw(err);
    }
  };
}
