import 'env';
import '../src/database/models';
import { sequelize } from '../src/database';
import sync from '../src/database/sync';

const isDev = process.env.NODE_ENV !== 'production';

if (!isDev) {
  throw new Error('Sync script only works in the development environment.');
}

async function excute() {
  try {
    await sequelize.authenticate();
    sync();
    console.log('Sync successfully...');
  } catch (err) {
    console.error('Unable to sync:', err);
  }
}

excute();
