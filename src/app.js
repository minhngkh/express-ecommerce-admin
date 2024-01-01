const express = require("express");
const hbs = require("hbs");
const hbsLayouts = require("handlebars-layouts");
const createError = require("http-errors");
const logger = require("morgan");
const path = require("path");

const authenticated = require("#middlewares/authenticated");
const passport = require("#middlewares/passport");
const session = require("#middlewares/session");
const hbsHelpers = require("#utils/hbsHelpers");

const accountsApiRouter = require("#components/accounts/api/router");

const accountsRouter = require("#components/accounts/router");
const authRouter = require("#components/auth/router");
const homeRouter = require("#components/home/router");
const productsRouter = require("#components/products/router");
const testRouter = require("#components/test/router");

// Init Express app
const app = express();

// Trust proxy in order to make session work when deploying on fly.io
app.set("trust proxy", 1);

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "views/partials"));
hbs.registerHelper(hbsHelpers);
hbs.registerHelper(hbsLayouts(hbs.handlebars));
app.set("view options", { layout: "layouts/default" });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

app.use(logger("dev"));

// TODO: Implement CSRF protection
// Setup Passport
app.use(session);
app.use(passport.authenticate("session"));

// Add user authentication status to locals
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Setup routes
app.use("/auth", authRouter);

app.use(authenticated.require);

app.use("/api/accounts", accountsApiRouter);

app.use("/", homeRouter);
app.use("/accounts", accountsRouter);
app.use("/products", productsRouter);

app.use("/test", testRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, _) => {
  if (err.status === 401) {
    return res.redirect("/auth/signin");
  }

  // Set locals, only providing error in development
  res.locals.status = err.status || 500;
  res.locals.message = err.status ? err.message : "Internal Server Error";
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(res.locals.status);
  res.render("error", { layout: "layouts/blank" });
});

module.exports = app;
