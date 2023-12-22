const RedisStore = require("connect-redis").default;
const session = require("express-session");

const RedisClient = require("./redis");

module.exports = session({
  store: new RedisStore({ client: RedisClient }),
  secret: process.env.SESSION_SECRET,
  name: "admin",
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
});
