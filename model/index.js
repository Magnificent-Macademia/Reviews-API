const db = require('../db');

module.exports = {
  getReviews: (params, cb) => {
    const sortMethod = {
      newest: 'ORDER BY reviews.date DESC',
      helpful: 'ORDER BY reviews.helpfulness DESC',
      relevant: 'ORDER BY reviews.helpfulness, reviews.date DESC',
    };
    const queryStr = `select * from reviews inner join photos on reviews.review_id=photos.review_id where reviews.product_id=${params.product_id} ${params.sort ? sortMethod[params.sort] : ''} limit ${params.count ? params.count : 5};`;

    db.query(queryStr, (err, results) => {
      cb(err, results);
    });
  },
};
