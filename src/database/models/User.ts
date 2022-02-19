import * as Sequelize from 'sequelize';
import * as crypto from 'crypto';

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
  id: string;
  email: string;
  username: string;
  password: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Sequelize.Model<IUser> implements IUser {
    id: string;
    email: string;
    username: string;
    password: string;
    static associate(models: any) {
      User.hasMany(models.post, {
        foreignKey: 'fkUserId',
        as: 'posts',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      username: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'user',
      indexes: [{ fields: ['email'] }],
    },
  );

  return User;
};
