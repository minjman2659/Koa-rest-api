import { Sequelize } from 'sequelize';

const { POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PW, POSTGRES_HOST } =
  process.env;

export const sequelize = new Sequelize(
  POSTGRES_DATABASE,
  POSTGRES_USER,
  POSTGRES_PW,
  {
    host: POSTGRES_HOST,
    dialect: 'postgres',
    logging: false,
    port: 5432,
    // https://sequelize.org/master/manual/connection-pool.html 참고
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

import { User, Post } from './models';

function createDB() {
  const db = {
    Sequelize,
    sequelize,
    User: User(sequelize, Sequelize),
    Post: Post(sequelize, Sequelize),
  };

  Object.values(db).forEach((model: any) => {
    if (model.associate) {
      model.associate(db);
    }
  });

  return db;
}

const models = createDB();

export default models;
