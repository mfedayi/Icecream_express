const pg = require("pg");
require("dotenv").config();

const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://mustafa:password@localhost/acme_icecream_db"
);

const init = async () => {
  try {
    await client.connect();
    const SQL = `DROP TABLE IF EXISTS flavors;
CREATE TABLE flavors(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at time DEFAULT CURRENT_TIMESTAMP,
    updated_at time DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO flavors(name, is_favorite) VALUES('chocolate', true);
    INSERT INTO flavors(name) VALUES('vanilla');
   INSERT INTO flavors(name, is_favorite) VALUES('coffee lovers', true);
`;
    await client.query(SQL);
    await client.end();
    console.log("******data seeded");
  } catch (error) {
    console.error(error);
  }
};
// init function invocation
init();
