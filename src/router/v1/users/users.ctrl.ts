import { Context } from 'koa';
import db from 'database';

const User = db.User;

export default class UserCtrl {
  static getUser = async (ctx: Context) => {
    const { userId } = ctx.params;
    console.log(User);
    // const user = await User.findByPk(userId);
    // if (!user) {
    //   ctx.status = 404;
    //   return;
    // }
    ctx.body = 'Hello Koa!';
  };
}
