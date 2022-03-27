import models, { sequelize } from 'database';

const sync = () => {
  models;
  sequelize.sync({ force: true });
};

export default sync;
