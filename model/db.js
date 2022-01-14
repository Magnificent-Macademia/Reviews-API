const { Pool, Client } = require('pg');
require('dotenv').config();

const pool = new Pool();

pool.query('select * from reviews where product_id=1', (err, res) => {
  console.log(err, res);
  pool.end();
});
