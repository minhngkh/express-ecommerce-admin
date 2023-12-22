const express = require("express");

const authenticated = require("#middlewares/authenticated");
const authController = require("./controller");

const router = express.Router();
// TODO: Signup page

router.get(
  "/signin",
  authenticated.redirect("/"),
  authController.renderSignInForm,
);

router.get("/signout", authController.signOut);

router.post(
  "/signin",
  authController.validateSignInCredentials,
  authController.authenticateSignInCredentials,
);

module.exports = router;
