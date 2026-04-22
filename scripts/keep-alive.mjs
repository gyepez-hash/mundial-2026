import pg from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  const result = await client.query("SELECT NOW() AS now");
  console.log(`Supabase keep-alive OK — server time: ${result.rows[0].now}`);
  await client.end();
  process.exit(0);
} catch (err) {
  console.error("Supabase keep-alive FAILED:", err);
  try {
    await client.end();
  } catch {}
  process.exit(1);
}
