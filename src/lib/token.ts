import { Context } from 'koa';
import * as jwt from 'jsonwebtoken';

const { SECRET_KEY, CLIENT_HOST, API_HOST } = process.env;

const IS_DEV: boolean = process.env.NODE_ENV !== 'production';

export interface IPayload {
  id: string;
  username: string;
  email: string;
}

export interface IOption {
  subject: string;
  expiresIn: string;
}

export const generateToken = (
  payload: IPayload,
  option: IOption,
): Promise<string> => {
  const jwtOptions = {
    issuer: API_HOST,
    expiresIn: '30d',
    ...option,
  };
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET_KEY, jwtOptions, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

export const decodeToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};

export const setTokenCookie = (ctx: Context, tokens: any): void => {
  const { accessToken, refreshToken } = tokens;

  ctx.cookies.set('access_token', accessToken, {
    httpOnly: true,
    domain: !IS_DEV ? CLIENT_HOST : undefined,
    maxAge: 60 * 60 * 1, // 1 hour
    secure: !IS_DEV,
  });

  ctx.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    domain: !IS_DEV ? CLIENT_HOST : undefined,
    maxAge: 60 * 60 * 24 * 30, // 30 Days
    secure: !IS_DEV,
  });
};
