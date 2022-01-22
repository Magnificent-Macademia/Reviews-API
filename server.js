require('dotenv').config();
const express = require('express');
const controller = require('./controller');

const app = express();

app.use(express.json());

app.get('loaderio-0bdb4f2adc2a60f4f39e88523bf63ea2.txt', (req, res) => {
  res.send('loaderio-0bdb4f2adc2a60f4f39e88523bf63ea2');
});

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

module.exports = app;
