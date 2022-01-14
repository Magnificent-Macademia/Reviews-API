/*
many to one
mamy to one
do not null and required
do optimization test on array vs separate table
breaking out is more standard way
array deviate from normal form
*/

CREATE TABLE reviews (
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
  product_id INTEGER
);


CREATE TABLE characteristics_reviews (
  join_id BIGSERIAL UNIQUE NOT NULL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews (review_id),
  characteristic_id INTEGER REFERENCES characteristics (characteristic_id),
  value SMALLINT NOT NULL
);

CREATE TABLE photos (
  photo_id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  url VARCHAR(500),
  review_id INTEGER REFERENCES reviews (review_id)
);

CREATE TABLE characteristics (
  characteristic_id BIGSERIAL UNIQUE NOT NULL PRIMARY KEY,
  name VARCHAR(50),
  product_id INTEGER
);