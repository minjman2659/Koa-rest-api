import * as crypto from 'crypto';
import db from 'database';
import { generateToken, IPayload, IOption } from 'lib/token';

const { PASSWORD_SALT } = process.env;

if (!PASSWORD_SALT) {
  throw new Error('MISSING_ENVAR');
}

function hash(password: string): string {
  return crypto
    .createHmac('sha512', PASSWORD_SALT)
    .update(password)
    .digest('hex');
}

interface IUser {
  id?: string;
  email: string;
  username: string;
  password: string;
  transaction?: any;
}

interface IUserMethod {
  // register({ email, password, username, transaction }: IUser): void;
  generateUserToken(): any;
  refreshUserToken(refreshTokenExp: number, originalRefreshToken: any): any;
  validatePassword(password: string): boolean;
  // checkEmail(email: string): boolean;
}

export default class UserMethods implements IUserMethod {
  User = db.User;
  id: string;
  username: string;
  email: string;
  password: string;

  // Class Method
  static async register({
    email,
    password,
    username,
    transaction,
  }: IUser): Promise<any> {
    try {
      const User = db.User;
      await User.create(
        {
          email,
          password: hash(password),
          username,
        },
        { transaction },
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  static async checkEmail(email: string): Promise<boolean> {
    try {
      const User = db.User;
      const user = await User.findOne({ where: { email } });
      return !user ? true : false;
    } catch (err) {
      throw new Error(err);
    }
  }

  // Instance Methods
  generateUserToken() {
    const payload: IPayload = {
      id: this.id,
      username: this.username,
      email: this.email,
    };
    const option1: IOption = {
      subject: 'refresh_token',
      expiresIn: '30d',
    };
    const option2: IOption = {
      subject: 'access_token',
      expiresIn: '1h',
    };

    const refreshToken = generateToken(payload, option1);
    const accessToken = generateToken(payload, option2);

    return {
      refreshToken,
      accessToken,
    };
  }

  refreshUserToken(refreshTokenExp: number, originalRefreshToken: any) {
    const now = new Date().getTime();
    const diff = refreshTokenExp * 1000 - now;
    let refreshToken = originalRefreshToken;

    const payload: IPayload = {
      id: this.id,
      username: this.username,
      email: this.email,
    };
    const option1: IOption = {
      subject: 'refresh_token',
      expiresIn: '30d',
    };
    const option2: IOption = {
      subject: 'access_token',
      expiresIn: '1h',
    };

    // 15일 이하인 경우
    if (diff < 1000 * 60 * 60 * 24 * 15) {
      refreshToken = generateToken(payload, option1);
    }
    const accessToken = generateToken(payload, option2);

    return { refreshToken, accessToken };
  }

  validatePassword(password: string): boolean {
    const hashed = hash(password);
    if (!this.password) {
      throw new Error('PASSWORD REQUIRED');
    }
    return this.password === hashed;
  }
}
