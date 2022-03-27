import * as Sequelize from 'sequelize';
import * as crypto from 'crypto';
import * as _ from 'lodash';
import { generateToken } from 'lib/token';
import { IPayload, IOption } from 'types/token';
import { IUser } from 'types/user';

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

export default (sequelize: any, DataTypes: any) => {
  class User extends Sequelize.Model<IUser> implements IUser {
    id: string;
    email: string;
    username: string;
    password: string;
    generateUserToken: () => Promise<{ refreshToken: any; accessToken: any }>;
    refreshUserToken: (
      refreshTokenExp: number,
      originalRefreshToken: any,
    ) => Promise<{ refreshToken: any; accessToken: any }>;
    validatePassword: (password: string) => boolean;
    toRes: () => any[];
    static associate(models: any) {
      User.hasMany(models.Post, {
        foreignKey: 'userId',
        as: 'posts',
      });
    }
    // class methods
    static async register({
      email,
      password,
      username,
      transaction,
    }: IUser): Promise<any> {
      try {
        const user = await User.create(
          {
            email,
            password: hash(password),
            username,
          },
          { transaction },
        );
        return user;
      } catch (err) {
        throw new Error(err);
      }
    }

    static async checkEmail(email: string): Promise<boolean> {
      try {
        const user = await User.findOne({ where: { email } });
        return user ? true : false;
      } catch (err) {
        throw new Error(err);
      }
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: { type: DataTypes.STRING, unique: true },
      username: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
      indexes: [{ fields: ['id', 'email'] }],
    },
  );

  // instance methods
  User.prototype.generateUserToken = async function generateUserToken() {
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

    const refreshToken: any = await generateToken(payload, option1);
    const accessToken: any = await generateToken(payload, option2);

    return {
      refreshToken,
      accessToken,
    };
  };

  User.prototype.refreshUserToken = async function refreshUserToken(
    refreshTokenExp: number,
    originalRefreshToken: any,
  ) {
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
      refreshToken = await generateToken(payload, option1);
    }
    const accessToken = await generateToken(payload, option2);

    return { refreshToken, accessToken };
  };

  User.prototype.validatePassword = function validatePassword(
    password: string,
  ): boolean {
    const hashed = hash(password);
    if (!this.password) {
      throw new Error('PASSWORD REQUIRED');
    }
    return this.password === hashed;
  };

  User.prototype.toRes = function toRes(): any[] {
    const userInfo = _.chain(this.toJSON()).omit(['password']).value();
    return userInfo;
  };

  return User;
};
