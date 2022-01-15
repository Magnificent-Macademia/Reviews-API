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
  postReview: (req, cb) => {
    const date = Date.now();
    const {
      email,
      name,
      summary,
      body,
      recommend,
      rating,
      characteristics,
      photos,
    } = req.body;
    const productId = req.body.product_id;
    const reviewInsertStr = `insert into reviews(email, name, summary, body, date, recommend, rating, product_id, helpfulness, reported) values ('${email}', '${name}', '${summary}', '${body}', ${date}, '${recommend}', ${rating}, ${productId}, 0, 'f')`;
    const photosStr = photos.map((url) => `(SELECT '${url}', review_id FROM ins1)`).join(' UNION ');
    const photosInsertStr = `INSERT INTO photos(url, review_id) ${photosStr}`;
    const chrRevStr = Object.keys(characteristics).map((charId) => `(SELECT review_id, ${charId}, ${characteristics[charId]} FROM ins1)`).join(' UNION ');
    const chrRevInsertStr = `INSERT INTO characteristics_reviews(review_id, characteristic_id, value) ${chrRevStr}`;
    let queryStr = '';

    if (Object.keys(req.body.characteristics).length !== 0) {
      if (req.body.photos.length !== 0) {
        queryStr = `
          WITH ins1 AS (${reviewInsertStr} Returning review_id AS review_id),
          ins2 AS (${chrRevInsertStr})
          ${photosInsertStr}
          ;`;
      } else {
        queryStr = `
        WITH ins1 AS (${reviewInsertStr} Returning review_id AS review_id)
        ${chrRevInsertStr}
        ;`;
      }
    } else if (Object.keys(req.body.characteristics).length === 0) {
      if (req.body.photos.length !== 0) {
        queryStr = `
          WITH ins1 AS (${reviewInsertStr} Returning review_id AS review_id)
          ${photosInsertStr}
          ;`;
      } else {
        queryStr = `${reviewInsertStr};`;
      }
    }

    db.query(queryStr, (err) => {
      cb(err);
    });
  },
  getRatings: (productId, cb) => {
    const queryStr = `select rating, count(*) from reviews where product_id=${productId} group by rating order by rating ASC;`;
    db.query(queryStr, (err, data) => {
      cb(err, data);
    });
  },
  getRecommend: (productId, cb) => {
    const queryStr = `select recommend, count(*) from reviews where product_id=${productId} group by recommend;`;
    db.query(queryStr, (err, data) => {
      cb(err, data);
    });
  },
  getCharacteristics: (productId, cb) => {
    const queryStr = `select characteristics.characteristic_id, characteristics.name, characteristics_reviews.join_id, characteristics_reviews.characteristic_id, characteristics_reviews.value from characteristics, characteristics_reviews where characteristics.product_id=${productId} AND characteristics.characteristic_id=characteristics_reviews.characteristic_id group by characteristics.characteristic_id, characteristics_reviews.join_id;`;
    db.query(queryStr, (err, data) => {
      cb(err, data);
    });
  },
  putHelpful: (reviewId, cb) => {
    const queryStr = `update reviews set helpfulness=helpfulness+1 where review_id=${reviewId};`;

    db.query(queryStr, (err) => {
      cb(err);
    });
  },

  putReport: (reviewId, cb) => {
    const queryStr = `update reviews set reported='t' where review_id=${reviewId};`;

    db.query(queryStr, (err) => {
      cb(err);
    });
  },
};
