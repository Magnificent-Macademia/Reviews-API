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

app.put('/reviews/:review_id/helpful', (req, res) => {
  controller.putHelpful(req, res);
});

// Updates a review to mark as reported
app.put('/reviews/:review_id/report', (req, res) => {
  controller.putReport(req, res);
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
