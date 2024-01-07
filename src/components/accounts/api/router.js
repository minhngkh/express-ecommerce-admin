const express = require("express");

const adminsApiRouter = require("../admins/api/router");
const usersApiRouter = require("../users/api/router");

const router = express.Router();

// TODO: Add admins api router
router.use("/users", usersApiRouter);
router.use("/admins", adminsApiRouter);

module.exports = router;
