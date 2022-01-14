const express = require('express');
const controller = require('./controller');

const app = express();
const port = 3000;

app.use(express.json());

// returns list of reviews for a particular product with query paremeters:
// page (integer, default 1)
// count (integer, default 5)
// sort (text, "newest", "helpful", or "relevant")
// product_id (integer)
app.get('/reviews', (req, res) => {
  controller.getReviews(req, res);
});

// Returns review metadata for a given product with query paremeters:
// product_id (integer)
app.get('/reviews/meta', (req, res) => {
  const params = req.query;
  const queryStr = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');

  res.send(queryStr);
});

// adds a review for the given product
/*
request body sample
{
    "product_id": 63609,
    "rating": 5,
    "summary": "Great Product",
    "body": "frad gthtwhr fahyaterf gtagf",
    "recommend": true,
    "name": "tester",
    "email": "tester@gmail.com",
    "characteristics": {}
  }
*/
app.post('/', (req, res) => {
  console.log(req.body);

  res.json(req.body);
});

// Updates a review to show it was found helpful.
app.put('/:review_id/helpful', (req, res) => {
  const reviewId = req.params.review_id;

  res.send(`${reviewId} is helpful`);
});

// Updates a review to mark as reported
app.put('/:review_id/report', (req, res) => {
  const reviewId = req.params.review_id;

  res.send(`${reviewId} is reported`);
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
