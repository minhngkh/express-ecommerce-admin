const { body } = require("express-validator");

const passport = require("#middlewares/passport");

exports.renderSignInForm = (req, res, _) => {
  res.render("auth/signin", { title: "Sign in", layout: "layouts/blank" });
};

exports.signOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.validateSignInCredentials = [
  body("username").notEmpty().isAlphanumeric(),
  body("password").isLength({ min: 7, max: 100 }),
];

exports.authenticateSignInCredentials = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/signin",
});
