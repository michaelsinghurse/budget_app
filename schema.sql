CREATE TABLE users (
  id serial PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL
);

CREATE TABLE payment_sources (
  id serial PRIMARY KEY,
  user_id int
    NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,
  name text NOT NULL,
  description text
);

CREATE TABLE transactions (
  id serial PRIMARY KEY,
  user_id int
    NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,
  date date NOT NULL,
  payment_source_id int
    NOT NULL
    REFERENCES payment_sources(id),
  payee text,
  notes text
);

CREATE TABLE categories (
  id serial PRIMARY KEY,
  user_id int
    NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,
  name text NOT NULL,
  description text
);

CREATE TABLE transactions_categories (
  id serial PRIMARY KEY,
  transaction_id int
    NOT NULL
    REFERENCES transactions(id)
    ON DELETE CASCADE,
  category_id int
    NOT NULL
    REFERENCES categories(id),
  amount numeric(12, 2) NOT NULL
);


