import { Context } from 'koa';
import db from 'database';
import { decodeToken, setTokenCookie } from 'lib/token';

const { User } = db;

const refresh = async (ctx: Context, refreshToken: string) => {
  try {
    const decoded = await decodeToken(refreshToken);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new Error('INVALID_USER');
    }

    const tokens = (await user).refreshUserToken(decoded.exp, refreshToken);
    setTokenCookie(ctx, tokens);

    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const consumeToken = async (ctx: Context, next: () => Promise<any>) => {
  const accessToken = ctx.cookies.get('access_token');
  const refreshToken = ctx.cookies.get('refresh_token');

  try {
    // accessToken이 없을 경우, 44번째 catch로 이동
    if (!accessToken) {
      throw new Error('NO_ACCESS_TOKEN');
    }
    const accessTokenData = await decodeToken(accessToken);
    const { id: userId } = accessTokenData;
    const user = await User.findByPk(userId);

    ctx.state.user = user;

    // refresh token when exp < 30mins
    const diff = accessTokenData.exp * 1000 - new Date().getTime();
    if (diff < 1000 * 60 * 30 && refreshToken) {
      await refresh(ctx, refreshToken);
    }
  } catch (err) {
    // refreshToken도 없을 경우, 다음 미들웨어로 진행
    if (!refreshToken) {
      return next();
    }
    try {
      // refreshToken은 있을 경우, refreshToken으로 진행
      const user = await refresh(ctx, refreshToken);
      ctx.state.user = user;
    } catch (err) {
      ctx.state.user = null;
      ctx.throw(500, err);
    }
  }
  return next();
};

export default consumeToken;
