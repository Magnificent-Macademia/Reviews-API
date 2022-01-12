CREATE TABLE products (
  product_id BIGSERIAL NOT NULL PRIMARY KEY,
  rating_1 INTEGER,
	rating_2 INTEGER,
	rating_3 INTEGER,
	rating_4 INTEGER,
	rating_5 INTEGER,
	reccomend_true INTEGER,
	recommend_false INTEGER,
);


CREATE TABLE charcteristics (
	characteristic_id BIGSERIAL NOT NULL PRIMARY KEY,
	count INTEGER,
	total INTEGER,
	description VARCHAR(50),
  FOREIGN KEY (product_id) REFERENCES products (product_id)
);

CREATE TABLE reviews (
  reviews_id BIGSERIAL NOT NULL PRIMARY KEY,
	summary VARCHAR(50),
	recommend BOOLEAN,
	body TEXT,
  date DATE,
  name VARCHAR(50),
  helpfulness BOOLEAN,
  photos TEXT[],
  email VARCHAR(50),
  rating SMALLINT,
  FOREIGN KEY (product_id) REFERENCES products (product_id)
);
