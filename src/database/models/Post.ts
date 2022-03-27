import * as Sequelize from 'sequelize';
import { IPost } from 'types/post';

export default (sequelize: any, DataTypes: any) => {
  class Post extends Sequelize.Model<IPost> implements IPost {
    id: number;
    userId: number;
    title: string;
    content: string;
    thumbnail: string;
    static associate(models: any) {
      Post.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'writer',
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
      });
    }
  }

  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: { type: DataTypes.INTEGER },
      title: { type: DataTypes.STRING(100) },
      content: { type: DataTypes.TEXT },
      thumbnail: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: 'Post',
      timestamps: true,
      indexes: [{ fields: ['id', 'userId'] }],
    },
  );

  return Post;
};
