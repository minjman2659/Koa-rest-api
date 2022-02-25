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
        return;
      }
      ctx.body = user.toRes();
    } catch (err) {
      ctx.throw(err);
    }
  };
}
