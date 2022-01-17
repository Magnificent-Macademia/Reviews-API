process.env.PGDATABASE='test_reviews_api';
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
  );`);

  await db.query(`CREATE TABLE characteristics_reviews (
    join_id BIGSERIAL UNIQUE NOT NULL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews (review_id),
    characteristic_id INTEGER REFERENCES characteristics (characteristic_id),
    value SMALLINT NOT NULL
  );`);

  await db.query(`CREATE TABLE photos (
    photo_id SERIAL UNIQUE NOT NULL PRIMARY KEY,
    url VARCHAR(500),
    review_id INTEGER REFERENCES reviews (review_id)
  );`);

  await db.query(`CREATE TABLE characteristics (
    characteristic_id BIGSERIAL UNIQUE NOT NULL PRIMARY KEY,
    name VARCHAR(50),
    product_id INTEGER NOT NULL
  );`);
});

beforeEach(async () => {
  // seed with some data
  await db.query(`INSERT INTO reviews (email, name, summary, body, date, helpfulness, recommend, reported, rating, response, product_id)
  VALUES ('vh@gmail.com', 'van', 'Loved IT', 'I lovvvvve this product. Great!', 1642389705000, 0, 'f', 'f', 5, 'thanks for the feedback', 2), ('vh@gmai2.com', 'van2', 'Loved IT', 'I lovvvvve this product. Great!', 1642389705000, 0, 'f', 'f', 5, 'thanks for the feedback', 2);`);

  await db.query(`INSERT INTO characteristics_reviews (
    join_id,
    review_id INTEGER REFERENCES reviews (review_id),
    characteristic_id INTEGER REFERENCES characteristics (characteristic_id),
    value SMALLINT NOT NULL
  )`);

  await db.query(`INSERT INTO reviews (email, name, summary, body, date, helpfulness, recommend, reported, rating, response, product_id)
  VALUES ('vh@gmail.com', 'van', 'Loved IT', 'I lovvvvve this product. Great!', 1642389705000, 0, 'f', 'f', 5, 'thanks for the feedback', 2), ('vh@gmai2.com', 'van2', 'Loved IT', 'I lovvvvve this product. Great!', 1642389705000, 0, 'f', 'f', 5, 'thanks for the feedback', 2);`);

  await db.query(`INSERT INTO reviews (email, name, summary, body, date, helpfulness, recommend, reported, rating, response, product_id)
  VALUES ('vh@gmail.com', 'van', 'Loved IT', 'I lovvvvve this product. Great!', 1642389705000, 0, 'f', 'f', 5, 'thanks for the feedback', 2), ('vh@gmai2.com', 'van2', 'Loved IT', 'I lovvvvve this product. Great!', 1642389705000, 0, 'f', 'f', 5, 'thanks for the feedback', 2);`);
});

afterEach(async () => {
  await db.query("DELETE FROM reviews");
});

afterAll(async () => {
  await db.query("DROP TABLE reviews");
  db.end();
});

test('It should be 2', async () => {
  const data = await db.query('select * from reviews;');
  expect(data.rows).toBe(200);
});
