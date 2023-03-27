CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL CHECK (position('@' IN email) > 1),
  first_name VARCHAR(15) NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE infants (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(15) NOT NULL,
  dob DATE NOT NULL,
  gender VARCHAR(6) NOT NULL,
  public_id TEXT
);

CREATE TABLE feeds (
  id SERIAL PRIMARY KEY,
  method VARCHAR(7) NOT NULL,
  fed_at BIGINT NOT NULL,
  amount DOUBLE PRECISION,
  duration INTEGER,
  infant_id INTEGER 
    REFERENCES infants ON DELETE CASCADE
);

CREATE TABLE diapers (
  id SERIAL PRIMARY KEY,
  type VARCHAR(6) NOT NULL,
  size VARCHAR(6) NOT NULL,
  changed_at BIGINT NOT NULL,
  infant_id INTEGER 
    REFERENCES infants ON DELETE CASCADE
);

CREATE TABLE users_infants (
  user_id INTEGER
    REFERENCES users ON DELETE CASCADE,
  infant_id INTEGER
    REFERENCES infants ON DELETE CASCADE,
  PRIMARY KEY (user_id, infant_id)
);

CREATE TABLE reminders (
  id SERIAL PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  hours INTEGER DEFAULT 0,
  minutes INTEGER DEFAULT 0,
  cutoff_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  cutoff TEXT DEFAULT '20:00:00',
  start TEXT DEFAULT '08:00:00',
  user_id INTEGER
    REFERENCES users ON DELETE CASCADE
);