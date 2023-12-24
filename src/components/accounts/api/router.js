const express = require("express");

const usersApiRouter = require("../users/api/router");

const router = express.Router();

router.use("/users", usersApiRouter);

module.exports = router;
