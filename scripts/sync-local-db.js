require("#utils/envLoader");

const { createClient } = require("@libsql/client");

const client = createClient({
  url: process.env.DATABASE_LOCAL_PATH,
  syncUrl: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const main = async () => {
  await client.sync();
};

main();
