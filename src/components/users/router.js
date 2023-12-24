const express = require("express");

const usersController = require("./controller");

const router = express.Router();

router.get("/", usersController.renderUserList);

module.exports = router;
