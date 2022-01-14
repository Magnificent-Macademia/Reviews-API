const model = require('../model');

module.exports = {
  getReviews: (req, res) => {
    model.getReviews((err, results) => {
      if (err) {
        console.log(err);
        res.send('failed');
      } else {
        res.json(results);
      }
    });
  },
};
