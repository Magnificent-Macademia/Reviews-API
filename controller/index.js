const model = require('../model');

module.exports = {
  getReviews: (req, res) => {
    const params = req.query;

    if (params.product_id === undefined) {
      res.status(400).send('Missing product_id. Product_id is necessary for looking up reviews');
    }

    if (params.page === undefined) {
      params.page = 1;
    }

    if (params.count === undefined) {
      params.count = 5;
    }

    if (params.sort !== undefined && !(params.sort in ['newest', 'helpful', 'relevant'])) {
      res.status(400).send('Invalid sort method, please choose between newest, helpful, or relevant');
    }

    model.getReviews(params, (err, data) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const responseObj = {
          product: params.product_id,
          page: 0,
          count: params.count,
          results: data.rows,
        };
        res.json(responseObj);
      }
    });
  },

  /*
request body sample
{
  product_id (int) [required]
  rating (int) [options 1-5]
  summary (str)
  body (str)
  recommend (bool)
  name (str)
  email (str)
  photos (str)
  characteristics (obj) { "14": 5, "15": 5 //...}
}

  res.json(req.body);
*/

  postReview: (req, res) => {
    model.postReview(req, (err) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(201).send('Created');
      }
    });
  },
};
