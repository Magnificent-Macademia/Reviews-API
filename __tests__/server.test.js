const request = require('supertest');
const app = require('../server');

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
    const response = await request(app).get('/reviews?product_id=2&count=2');
    expect(parseInt(response.body.count, 10)).toBeLessThanOrEqual(2);
  });

  test('Response body results should have up to the specified count in request body', async () => {
    const response = await request(app).get('/reviews?product_id=2&count=2');
    expect(response.body.results.length).toBeLessThanOrEqual(2);
  });

  test('Result should have rating, summary, recommend, response, bodym date, review_name', async () => {
    const response = await request(app).get('/reviews?product_id=2&count=2');
    expect(response.body.results).toBeInstanceOf(Array);
    expect(response.body.results[0]).toBeInstanceOf(Object);
    expect(response.body.results[0].name).toBe('shortandsweeet');
    expect(response.body.results[0].email).toBe('first.last@gmail.com');
    expect(response.body.results[0].date).toBe('2021-02-T06:28:37:620Z');
    expect(response.body.results[0].photos).toBeInstanceOf(Array);
  });
});

// describe('POST /reviews', () => {
//   test('It should respond with 201 status code for valid request', async () => {
//     const response = await request(app).post('/reviews?product_id=2');
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.statusCode).toBe(201);
//   });

//   test('It should get a 400 status code when request does not have product_id', async () => {
//     const response = await request(app).post('/reviews');
//     expect(response.statusCode).toBe(400);
//     expect(response.text).toBe('Invalid product_id input');
//   });
// });
