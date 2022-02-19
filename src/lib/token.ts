import * as jwt from 'jsonwebtoken';

const { SECRET_KEY, CLIENT_HOST, API_HOST } = process.env;

const IS_DEV: boolean = process.env.NODE_ENV !== 'production';

export interface IPayload {
  payload: {
    _id: string;
    username: string;
    email: string;
  };
  options: {
    subject: string;
    expiresIn: string;
  };
}

export const generateToken = ({
  payload,
  options,
}: IPayload): Promise<string> => {
  const jwtOptions = {
    issuer: API_HOST,
    expiresIn: '30d',
    ...options,
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
