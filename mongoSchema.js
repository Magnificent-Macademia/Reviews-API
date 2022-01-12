const mongoose = require('mongoose');

const productsDoc = new mongoose.Schema({
  product: {
    productId: Number,
    rating1: Number,
    rating2: Number,
    rating3: Number,
    rating4: Number,
    rating5: Number,
    recommendTrue: Number,
    recommendFalse: Number,
    characteristic: [
      {
        id: Number,
        count: Number,
        total: Number,
        description: String,
      },
    ],
    reviews: [Schema.Types.ObjectId],
  },
});

const reviewsDoc = new mongoose.Schema({
  _reviewId: Schema.Types.ObjectId,
  summary: String,
  recommend: Boolean,
  body: String,
  date: Date,
  name: String,
  helpfulness: Boolean,
  photos: [String],
  rating: Number,
});