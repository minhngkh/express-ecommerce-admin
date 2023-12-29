const express = require("express");

const usersApiController = require("./controller");

const router = express.Router();

router.get("/:userId/profile/avatar/uploadSignature");

router.get("/", usersApiController.getUsersList);

router.put("/:userId/ban", usersApiController.banUser);

router.put("/:userId/unban", usersApiController.unbanUser);

module.exports = router;
