import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "myPassword",
  port: 5432,
  database: "ping",
});

export default pool;
