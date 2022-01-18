// k6 run /Users/vanhsieh/Desktop/Hack\ Reactor/SDC/performance/script.js
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 100,
  duration: '15s',
};

export default () => {
  const randomId = Math.floor(Math.random() * 1000000) + 63610;

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const getReviews = http.get(`http://localhost:3000/reviews?product_id=${randomId}`);

  check(
    getReviews,
    { 'GET reviews response status code is 200': (r) => r.status === 200 },
  );

  const payload = JSON.stringify({
    product_id: randomId,
    rating: 5,
    summary: 'Great Product',
    body: 'frad gthtwhr fahyaterf gtagf',
    recommend: true,
    name: 'tester',
    email: 'van.hsieh115@gmail.com',
    characteristics: { 3: 3, 4: 4 },
    photos: ['1.com', '2.com'],
  });

  const postReview = http.post('http://localhost:3000/reviews', payload, params);

  check(postReview,
    { 'POST reviews response status code is 201': (r) => r.status === 201 },
  );

  const getMeta = http.get(`http://localhost:3000/reviews/meta?product_id=${randomId}`);

  check(getMeta,
    { 'Get reviews  meta response status code is 200': (r) => r.status === 200 },
  );

  const putHelpful = http.put(`http://localhost:3000/reviews/${randomId}/helpful`);

  check(putHelpful,
    { 'Put reviews helpful response status code is 204': (r) => r.status === 204 },
  );

  const putReport = http.put(`http://localhost:3000/reviews/${randomId}/report`);

  check(putReport,
    { 'Put reviews report response status code is 204': (r) => r.status === 204 },
  );

  sleep(1);
};
