const express = require("express");

const usersController = require("./controller");

const router = express.Router();

router.get("/", usersController.renderUsersList);

router.get("/:id", usersController.renderUserDetails);

module.exports = router;
