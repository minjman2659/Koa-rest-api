import { sequelize } from 'database';

export default function sync() {
  sequelize.sync();
}
