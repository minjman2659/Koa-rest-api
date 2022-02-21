import * as Sequelize from 'sequelize';

interface IUser {
  id?: string;
  email: string;
  username: string;
  password: string;
}

export default (sequelize: any, DataTypes: any) => {
  class User extends Sequelize.Model<IUser> implements IUser {
    id: string;
    email: string;
    username: string;
    password: string;
    static associate(models: any) {
      User.hasMany(models.Post, {
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
      },
      email: { type: DataTypes.STRING, unique: true },
      username: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
      indexes: [{ fields: ['email'] }],
    },
  );

  return User;
};
