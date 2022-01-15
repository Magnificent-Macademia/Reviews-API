const express = require('express');
const controller = require('./controller');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/reviews', (req, res) => {
  controller.getReviews(req, res);
});

app.get('/reviews/meta', (req, res) => {
  controller.getMeta(req, res);
});

app.post('/reviews', (req, res) => {
  controller.postReview(req, res);
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
