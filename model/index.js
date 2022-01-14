const db = require('../db');

module.exports = {
  getReviews: (cb) => {
    const queryStr = 'select * from reviews where product_id=1';

    db.query(queryStr, (err, results) => {
      cb(err, results);
    });
  },
};
