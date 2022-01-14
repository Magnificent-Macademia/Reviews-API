const mongoose = require('mongoose');

const productsDoc = new mongoose.Schema({
  product: {
    productId: Number,
    characteristics: [
      {
        id: Number,
        count: Number,
        total: Number,
        description: String,
      },
    ],
    reviews: [Number],
  },
});

const reviewsDoc = new mongoose.Schema({
  _reviewId: Number,
  summary: String,
  recommend: Boolean,
  body: String,
  date: Date,
  name: String,
  helpfulness: Boolean,
  photos: [String],
  rating: Number,
});
