CREATE DATABASE ping;

CREATE TABLE users(
  user_id uuid DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  PRIMARY KEY(user_id)
);

CREATE TABLE userSites(
  usersite_id uuid DEFAULT uuid_generate_v4(),
  user_id uuid,
  url VARCHAR(255) NOT NULL,
  url_timeOut VARCHAR(255) NOT NULL,
  cron_id VARCHAR(255),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(usersite_id),
  CONSTRAINT fk_users
    FOREIGN KEY(user_id)
      REFERENCES users(user_id)
);

CREATE TABLE pingData(
  pingdata_id uuid DEFAULT uuid_generate_v4(),
  usersite_id uuid,
  ping VARCHAR(255) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(pingdata_id),
  CONSTRAINT fk_usersites
    FOREIGN KEY(usersite_id)
      REFERENCES userSites(usersite_id)
);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON userSites
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON pingData
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();