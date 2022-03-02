import { Context } from 'koa';
import * as Joi from 'joi';
import db from 'database';

import { loginSchema, registerSchema, emailSchema } from './schema';
import { setTokenCookie } from 'lib/token';
const { User } = db;

interface ILoginBody {
  email: string;
  password: string;
}

interface IRegisterBody extends ILoginBody {
  username: string;
}

export default class AuthCtrl {
  static register = async (ctx: Context) => {
    const result: Joi.ValidationResult<string> = registerSchema.validate(
      ctx.request.body,
    );
    if (result.error) {
      ctx.status = 400;
      ctx.body = result.error.details[0].message;
      return;
    }

    const { email, username, password }: IRegisterBody = ctx.request.body;

    let existedUser = null;
    try {
      existedUser = await User.findOne({
        where: { email },
      });
    } catch (err) {
      ctx.throw(500, err);
    }

    if (existedUser) {
      ctx.status = 409;
      ctx.body = 'EXISTED_USER';
      return;
    }

    const t = await db.sequelize.transaction();

    try {
      const user = await User.register({
        email,
        password,
        username,
        transaction: t,
      });

      const tokens = await user.generateUserToken();
      setTokenCookie(ctx, tokens);
      await t.commit();

      ctx.status = 201;
    } catch (err) {
      await t.rollback();
      ctx.throw(500, err);
    }
  };

  static checkEmail = async (ctx: Context) => {
    const result: Joi.ValidationResult<string> = emailSchema.validate(
      ctx.params,
    );
    if (result.error) {
      ctx.status = 400;
      ctx.body = result.error.details[0].message;
      return;
    }
    const { email } = ctx.params;
    try {
      const isExisted = await User.checkEmail(email);
      if (isExisted) {
        ctx.status = 409;
        ctx.body = 'EXISTED_EMAIL';
        return;
      }

      ctx.status = 200;
    } catch (err) {
      ctx.throw(500, err);
    }
  };

  static login = async (ctx: Context) => {
    const result: Joi.ValidationResult<string> = loginSchema.validate(
      ctx.request.body,
    );
    if (result.error) {
      ctx.status = 400;
      ctx.body = result.error.details[0].message;
    }

    const { email, password }: ILoginBody = ctx.request.body;

    let user = null;
    try {
      user = await User.findOne({
        where: { email },
      });
    } catch (err) {
      ctx.throw(500, err);
    }

    if (!user) {
      ctx.status = 404;
      ctx.body = 'NOT_FOUND_USER';
      return;
    }

    try {
      const validate = user.validatePassword(password);
      if (!validate) {
        ctx.status = 403;
        ctx.body = 'WRONG_PASSWORD';
        return;
      }

      const tokens = await user.generateUserToken();
      setTokenCookie(ctx, tokens);

      ctx.status = 200;
      ctx.body = user.toRes();
    } catch (err) {
      ctx.throw(500, err);
    }
  };

  static logout = async (ctx: Context) => {
    ctx.cookies.set('access_token', null, {
      maxAge: 0,
      httpOnly: true,
    });
    ctx.cookies.set('refresh_token', null, {
      maxAge: 0,
      httpOnly: true,
    });
    ctx.status = 200;
  };
}
