const { Pool } = require("pg");

const config = {
  user: "postgres",
  host: "localhost",
  password: "basesback",
  database: "postgres",
  port: 5432,
};

const pool = new Pool(config);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
