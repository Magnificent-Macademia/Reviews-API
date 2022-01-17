process.env.PGDATABASE = 'test_reviews_api';
const db = require('../db');
const request = require('supertest');
const app = require('../server');

beforeAll(async () => {
  await db.query(`CREATE TABLE reviews (
    review_id BIGSERIAL UNIQUE NOT NULL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    summary VARCHAR(200) NOT NULL,
    body VARCHAR(2000) NOT NULL,
    date BIGINT NOT NULL,
    helpfulness SMALLINT NOT NULL,
    recommend BOOLEAN NOT NULL,
    reported BOOLEAN NOT NULL,
    rating SMALLINT NOT NULL,
    response VARCHAR(2000),
    product_id INTEGER NOT NULL
  );

  CREATE TABLE photos (
    photo_id BIGSERIAL UNIQUE NOT NULL PRIMARY KEY,
    url VARCHAR(500),
    review_id INTEGER REFERENCES reviews (review_id)
  );

  CREATE TABLE characteristics (
    characteristic_id BIGSERIAL UNIQUE NOT NULL PRIMARY KEY,
    name VARCHAR(50),
    product_id INTEGER NOT NULL
  );

  CREATE TABLE characteristics_reviews (
    join_id BIGSERIAL UNIQUE NOT NULL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews (review_id),
    characteristic_id INTEGER REFERENCES characteristics (characteristic_id),
    value SMALLINT NOT NULL
  );

  INSERT INTO reviews (email, name, summary, body, date, helpfulness, recommend, reported, rating, response, product_id) VALUES ('vh@gmail.com', 'van', 'Loved IT', 'I lovvvvve this product. Great!', 1642389705000, 0, 'f', 'f', 5, 'thanks for the feedback', 2), ('vh@gmai2.com', 'van2', 'Loved IT', 'I lovvvvve this product. Great!', 1742389705001, 0, 'f', 'f', 5, 'thanks for the feedback', 2);

  INSERT INTO photos (url, review_id) VALUES ('van1.com', 1), ('van2.com', 1), ('van3.com', 2);

  INSERT INTO characteristics (name, product_id) VALUES ('Fit', 1), ('Color', 1), ('Size', 2), ('Materia', 2);

  INSERT INTO characteristics_reviews (review_id, characteristic_id, value) VALUES (1, 1, 1), (1, 2, 2), (2, 3, 3), (2, 4, 5);
  `);
});

afterAll(async () => {
  await db.query(`
  DROP TABLE photos;
  DROP TABLE characteristics_reviews;
  DROP TABLE characteristics;
  DROP TABLE reviews;
  `);
  db.end();
});

describe('database test_reviews_api successfully initialized with some data', () => {
  test('It should have 2 reviews', async () => {
    const data = await db.query('select * from reviews;');
    expect(data.rows.length).toBe(2);
  });
  test('It should have 4 characteristics', async () => {
    const data = await db.query('select * from characteristics;');
    expect(data.rows.length).toBe(4);
  });
  test('It should have 4 characteristics_reviews', async () => {
    const data = await db.query('select * from characteristics_reviews;');
    expect(data.rows.length).toBe(4);
  });
  test('It should have 3 photos', async () => {
    const data = await db.query('select * from photos;');
    expect(data.rows.length).toBe(3);
  });
});

describe('GET /reviews', () => {
  test('It should respond with 200 status code for valid request', async () => {
    const response = await request(app).get('/reviews?product_id=2');
    expect(response.body).toBeInstanceOf(Object);
    expect(response.statusCode).toBe(200);
  });

  test('It should get a 400 status code when request does not have product_id', async () => {
    const response = await request(app).get('/reviews');
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Missing product_id. Product_id is necessary for looking up reviews');
  });

  test('It should respond with an object in the response body for valid request', async () => {
    const response = await request(app).get('/reviews?product_id=2');
    expect(response.body).toBeInstanceOf(Object);
  });

  test('Response body should have productId', async () => {
    const response = await request(app).get('/reviews?product_id=2');
    expect(response.body.product).toBe('2');
    expect(typeof parseInt(response.body.product, 10)).toBe('number');
  });

  test('Response body should have count', async () => {
    const response = await request(app).get('/reviews?product_id=2');
    expect(response.body.count).not.toBeUndefined();
  });

  test('Response body should have default count of 5 when not specified in request', async () => {
    const response = await request(app).get('/reviews?product_id=63610');
    expect(response.body.results.length).toBeLessThanOrEqual(5);
  });

  test('Response body should have up to the specified count in request body', async () => {
    const response = await request(app).get('/reviews?product_id=2&count=1');
    expect(parseInt(response.body.count, 10)).toBeLessThanOrEqual(1);
  });

  test('Response body results should have up to the specified count in request body', async () => {
    const response = await request(app).get('/reviews?product_id=2&count=1');
    expect(response.body.results.length).toBeLessThanOrEqual(1);
  });

  test('Response body results should be sorted by date when specified newest', async () => {
    const response = await request(app).get('/reviews?product_id=2&count=2&sort=newest');
    const res1Date = response.body.results[0].date;
    const res2Date = response.body.results[1].date;
    const res1DateInt = res1Date.slice(0, 4) + res1Date.slice(5, 7) + res1Date.slice(8, 10) + res1Date.slice(11, 13) + res1Date.slice(14, 17) + res1Date.slice(18, 21) + res1Date.slice(22, 25);
    const res2DateInt = res2Date.slice(0, 4) + res2Date.slice(5, 7) + res2Date.slice(8, 10) + res2Date.slice(11, 13) + res2Date.slice(14, 17) + res2Date.slice(18, 21) + res2Date.slice(22, 25);
    const date1 = parseInt(res1DateInt, 10);
    const date2 = parseInt(res2DateInt, 10);
    expect(date1).toBeGreaterThanOrEqual(date2);
  });

  test('Result should have rating, summary, recommend, response, bodym date, review_name', async () => {
    const response = await request(app).get('/reviews?product_id=2&count=2');
    expect(response.body.results).toBeInstanceOf(Array);
    expect(response.body.results[0]).toBeInstanceOf(Object);
    expect(response.body.results[0].name).toBe('van');
    expect(response.body.results[0].email).toBe('vh@gmail.com');
    expect(response.body.results[0].date).toBe('2022-00-16T19:21:45:00Z');
    expect(response.body.results[0].photos).toBeInstanceOf(Array);
    expect(response.body.results[1].name).toBe('van2');
  });
});

describe('POST /reviews', () => {
  test('Successful post request should return 201 status code and a Success message', async () => {
    const response = await request(app)
      .post('/reviews')
      .send({
        product_id: 2,
        rating: 5,
        summary: 'Great Product',
        body: 'frad gthtwhr fahyaterf gtagf',
        recommend: true,
        name: 'tester',
        email: 'van.hsieh115@gmail.com',
        characteristics: { 3: 3, 4: 4 },
        photos: ['1.com', '2.com'],
      });
    expect(response.statusCode).toBe(201);
    expect(response.text).toBe('Created');
  });

  test('Unsuccessful post request should return 400 status code and a Error message', async () => {
    const response = await request(app)
      .post('/reviews')
      .send({
        rating: 5,
        summary: 'Great Product',
        body: 'frad gthtwhr fahyaterf gtagf',
        recommend: true,
        name: 'tester',
        email: 'van.hsieh115@gmail.com',
        characteristics: { 3: 3, 4: 4 },
        photos: ['1.com', '2.com'],
      });
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Invalid product_id input');
  });


  test('New record should be added to reviews, characteristics_reviews, and photos tables', async () => {
    const reviewsData = await db.query('select * from reviews;');
    const chrRevData = await db.query('select * from characteristics_reviews;');
    const photosData = await db.query('select * from photos;');

    expect(reviewsData.rows.length).toBe(3);
    expect(chrRevData.rows.length).toBe(6);
    expect(photosData.rows.length).toBe(5);
  });

  test('GET /reviews should have the new data', async () => {
    const response = await request(app).get('/reviews?product_id=2');
    expect(response.body.results.length).toBe(3);
    expect(response.body.results[2].reviewer_name).toBe('tester');
    expect(response.body.results[2].photos).toBeInstanceOf(Array);
    expect(response.body.results[2].photos.length).toBe(2);
    expect(response.body.results[2].recommend).toBe(true);
  });
});

describe('GET /reviews/meta?product_id=2', () => {
  test('It should respond with 200 status code for valid request', async () => {
    const response = await request(app).get('/reviews/meta?product_id=2');
    expect(response.body).toBeInstanceOf(Object);
    expect(response.statusCode).toBe(200);
  });

  test('Result should have product_id, ratings, recommend, characteristics', async () => {
    const response = await request(app).get('/reviews/meta?product_id=2');
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.product_id).toBe('2');
    expect(response.body.ratings).toBeInstanceOf(Object);
    expect(Object.keys(response.body.ratings)).toBeInstanceOf(Array);
    expect(response.body.recommended.true).toBe('1');
    expect(response.body.characteristics.Size.value).toBe(3);
  });
});

describe('PUT /reviews/:review_id/helpful', () => {
  test('It should respond with 204 status code for valid request', async () => {
    const response = await request(app).put('/reviews/2/helpful');
    const data = await db.query('select helpfulness from reviews where review_id=2;');
    expect(response.statusCode).toBe(204);
    expect(data.rows[0].helpfulness).toBe(1);
  });
});

describe('PUT /reviews/:review_id/report', () => {
  test('It should respond with 204 status code for valid request', async () => {
    const response = await request(app).put('/reviews/2/report');
    const data = await db.query('select reported from reviews where review_id=2;');
    expect(response.statusCode).toBe(204);
    expect(data.rows[0].reported).toBe(true);
  });
});
