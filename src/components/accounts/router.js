const express = require("express");

const adminsRouter = require("./admins/router");
const usersRouter = require("./users/router");

const router = express.Router();

router.use("/users", usersRouter);
router.use("/admins", adminsRouter);

module.exports = router;
