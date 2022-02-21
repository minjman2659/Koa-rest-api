import { Sequelize, Op } from 'sequelize';

const { POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PW } = process.env;

// const operatorsAliases = {
//   $eq: Op.eq,
//   $ne: Op.ne,
//   $gte: Op.gte,
//   $gt: Op.gt,
//   $lte: Op.lte,
//   $lt: Op.lt,
//   $not: Op.not,
//   $in: Op.in,
//   $notIn: Op.notIn,
//   $is: Op.is,
//   $like: Op.like,
//   $notLike: Op.notLike,
//   $iLike: Op.iLike,
//   $notILike: Op.notILike,
//   $regexp: Op.regexp,
//   $notRegexp: Op.notRegexp,
//   $iRegexp: Op.iRegexp,
//   $notIRegexp: Op.notIRegexp,
//   $between: Op.between,
//   $notBetween: Op.notBetween,
//   $overlap: Op.overlap,
//   $contains: Op.contains,
//   $contained: Op.contained,
//   $adjacent: Op.adjacent,
//   $strictLeft: Op.strictLeft,
//   $strictRight: Op.strictRight,
//   $noExtendRight: Op.noExtendRight,
//   $noExtendLeft: Op.noExtendLeft,
//   $and: Op.and,
//   $or: Op.or,
//   $any: Op.any,
//   $all: Op.all,
//   $values: Op.values,
//   $col: Op.col,
// };

export const sequelize = new Sequelize(
  POSTGRES_DATABASE,
  POSTGRES_USER,
  POSTGRES_PW,
  {
    dialect: 'postgres',
    logging: false,
    port: 5432,
    // operatorsAliases,
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
