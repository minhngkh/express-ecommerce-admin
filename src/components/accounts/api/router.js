const express = require("express");

const usersApiRouter = require("../users/api/router");

const router = express.Router();

// TODO: Add admins api router
router.use("/users", usersApiRouter);

module.exports = router;
