const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const adminsService = require("#components/accounts/admins/service");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, cb) => {
      const account = {
        username: username,
      };
      try {
        const result = await adminsService.getAdminInfoFromUsername(username, [
          "id",
          "password",
        ]);

        Object.assign(account, result);
      } catch (err) {
        return cb(null, false, { message: "Incorrect username." });
      }

      bcrypt.compare(password, account.password, (err, result) => {
        if (err) {
          return cb(err);
        }

        if (!result) {
          return cb(null, false, {
            message: "Incorrect password.",
          });
        }

        return cb(null, account);
      });
    },
  ),
);

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, user);
  });
});

module.exports = passport;
