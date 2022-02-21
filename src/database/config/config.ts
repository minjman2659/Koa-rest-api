const { POSTGRES_HOST, POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PW } =
  process.env;

module.exports = {
  development: {
    username: POSTGRES_USER,
    password: POSTGRES_PW,
    database: POSTGRES_DATABASE,
    host: POSTGRES_HOST,
    dialect: 'postgres',
  },
  test: {
    username: POSTGRES_USER,
    password: POSTGRES_PW,
    database: POSTGRES_DATABASE,
    host: POSTGRES_HOST,
    dialect: 'postgres',
  },
  production: {
    username: POSTGRES_USER,
    password: POSTGRES_PW,
    database: POSTGRES_DATABASE,
    host: POSTGRES_HOST,
    dialect: 'postgres',
  },
};
