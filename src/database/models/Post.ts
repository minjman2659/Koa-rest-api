import * as Sequelize from 'sequelize';

interface IPost {
  id?: string;
  fkUserId: string;
  title: string;
  content: string;
  thumbnail: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Post extends Sequelize.Model<IPost> implements IPost {
    id: string;
    fkUserId: string;
    title: string;
    content: string;
    thumbnail: string;
    static associate(models: any) {
      Post.belongsTo(models.User, {
        foreignKey: 'fkUserId',
        as: 'writer',
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
      });
    }
  }

  Post.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      fkUserId: {
        type: DataTypes.UUID,
        field: 'userId',
      },
      title: { type: DataTypes.STRING(100) },
      content: { type: DataTypes.TEXT },
      thumbnail: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: 'Post',
      timestamps: true,
      indexes: [{ fields: ['userId'] }],
    },
  );

  return Post;
};
