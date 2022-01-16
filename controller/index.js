const model = require('../model');

module.exports = {
  getReviews: (req, res) => {
    const params = req.query;

    if (params.product_id === undefined) {
      res.status(400).send('Missing product_id. Product_id is necessary for looking up reviews');
    } else if (params.sort !== undefined && !(params.sort in ['newest', 'helpful', 'relevant'])) {
      res.status(400).send('Invalid sort method, please choose between newest, helpful, or relevant');
    } else {
      if (params.page === undefined) {
        params.page = 1;
      }
      if (params.count === undefined) {
        params.count = 5;
      }
      model.getReviews(params, (err, data) => {
        if (err) {
          res.status(400).send(err);
        } else {
          data.rows.forEach((record) => {
            const unix = parseInt(record.date, 10);
            const date = new Date(unix);
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const hour = date.getHours();
            const min = date.getMinutes();
            const sec = date.getSeconds();
            const ms = date.getMilliseconds();
            record.date = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}T${hour < 10 ? '0' : ''}${hour}:${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}:${ms < 10 ? '0' : ''}${ms}Z`;
          });

          data.rows.forEach((record) => {
            const unix = parseInt(record.date, 10);
            const date = new Date(unix);
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const hour = date.getHours();
            const min = date.getMinutes();
            const sec = date.getSeconds();
            const ms = date.getMilliseconds();
            record.date = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}T${hour < 10 ? '0' : ''}${hour}:${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}:${ms < 10 ? '0' : ''}${ms}Z`;
          });
          const responseObj = {
            product: params.product_id,
            page: 0,
            count: params.count,
            results: data.rows,
          };
          res.json(responseObj);
        }
      });
    }
  },

  postReview: (req, res) => {
    if (req.body.product_id === undefined || typeof (req.body.product_id) !== 'number') {
      res.status(400).send('Invalid product_id input');
    } else if (req.body.rating === undefined || typeof (req.body.rating) !== 'number') {
      res.status(400).send('Invalid rating input');
    } else if (req.body.summary === undefined || typeof (req.body.summary) !== 'string') {
      res.status(400).send('Invalid summary input');
    } else if (req.body.body === undefined || typeof (req.body.body) !== 'string') {
      res.status(400).send('Invalid body input');
    } else if (req.body.recommend === undefined || typeof (req.body.recommend) !== 'boolean') {
      res.status(400).send('Invalid boolean input');
    } else if (req.body.name === undefined || typeof (req.body.name) !== 'string') {
      res.status(400).send('Invalid name input');
    } else if (req.body.email === undefined || typeof (req.body.email) !== 'string') {
      res.status(400).send('Invalid email input');
    } else {
      model.postReview(req, (err) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(201).send('Created');
        }
      });
    }
  },

  getMeta: (req, res) => {
    const productId = parseInt(req.query.product_id, 10);

    if (req.query.product_id === undefined || typeof productId !== 'number') {
      res.status(400).send('Invalid product_id input');
    } else {
      const ratingsPromise = new Promise((resolve, reject) => {
        model.getRatings(productId, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

      const recommendPromise = new Promise((resolve, reject) => {
        model.getRecommend(productId, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

      const characteristicsPromise = new Promise((resolve, reject) => {
        model.getCharacteristics(productId, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

      Promise.all([ratingsPromise, recommendPromise, characteristicsPromise])
        .then((values) => {
          const ratingsObj = {};
          values[0].rows.forEach((ratingCount) => {
            ratingsObj[ratingCount.rating.toString()] = ratingCount.count.toString();
          });
          const recObj = {};
          values[1].rows.forEach((recommendedCount) => {
            recObj[recommendedCount.recommend.toString()] = recommendedCount.count.toString();
          });
          const charTempObj = {};
          // console.log(values[2].rows);
          values[2].rows.forEach((char) => {
            const { name } = char;
            const joinId = char.join_id;
            const { value } = char;
            if (charTempObj[name]) {
              charTempObj[name].count += 1;
              charTempObj[name].total += value;
            } else {
              charTempObj[name] = { id: joinId, count: 1, total: value };
            }
          });
          const charObj = {};
          Object.keys(charTempObj).forEach((key) => {
            const eachChar = charTempObj[key];
            charObj[key] = { id: charTempObj.joinId, value: eachChar.total / eachChar.count };
          });

          const responseObj = {
            product_id: req.query.product_id,
            ratings: ratingsObj,
            recommended: recObj,
            characteristics: charObj,
          };
          res.json(responseObj);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    }
  },

  putHelpful: (req, res) => {
    const reviewId = parseInt(req.params.review_id, 10);

    if (req.params.review_id === undefined || typeof reviewId !== 'number') {
      res.status(400).send('Invalid review_id input');
    } else {
      model.putHelpful(reviewId, (err) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(204).send('updated');
        }
      });
    }
  },

  putReport: (req, res) => {
    const reviewId = parseInt(req.params.review_id, 10);

    if (req.params.review_id === undefined || typeof reviewId !== 'number') {
      res.status(400).send('Invalid review_id input');
    } else {
      model.putReport(reviewId, (err) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(204).send('updated');
        }
      });
    }
  },
};
