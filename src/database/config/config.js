require('../../env');

const path = require('path');
const fs = require('fs');

const { POSTGRES_HOST, POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PW } =
  process.env;

const dbInfo = {
  username: POSTGRES_USER,
  password: POSTGRES_PW,
  database: POSTGRES_DATABASE,
  host: POSTGRES_HOST,
  dialect: 'postgres',
};

const cliConfig = {
  development: dbInfo,
  production: dbInfo,
  test: dbInfo,
};

const configPath = path.join(__dirname, './sequelize-cli.json');
fs.writeFileSync(configPath, JSON.stringify(cliConfig, null, 2));
