const express = require("express");

const adminsApiController = require("./controller");

const router = express.Router();

router.get("/", adminsApiController.getAdminsList);

module.exports = router;
