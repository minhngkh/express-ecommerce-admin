const express = require("express");

const usersApiController = require("./controller");

const router = express.Router();

router.get("/:userId/profile/avatar/uploadSignature");

router.get("/", usersApiController.getUsersList);

module.exports = router;
