require('newrelic');
const app = require('./server');

const port = 3000;

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
