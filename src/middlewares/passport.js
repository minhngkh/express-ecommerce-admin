const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const adminsService = require("#components/admins/service");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, cb) => {
      let user;
      try {
        user = await adminsService.getAdminInfoFromUsername(username, [
          "username",
          "password",
        ]);
      } catch (err) {
        return cb(null, false, { message: "Incorrect username." });
      }

      console.log(user);

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return cb(err);
        }

        if (!result) {
          return cb(null, false, {
            message: "Incorrect password.",
          });
        }

        return cb(null, user);
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
