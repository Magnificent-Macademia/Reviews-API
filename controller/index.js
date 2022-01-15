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
};
