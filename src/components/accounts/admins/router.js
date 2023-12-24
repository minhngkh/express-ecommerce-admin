const express = require("express");

const adminsController = require("./controller");

const router = express.Router();

router.get("/", adminsController.renderAdminsList);

router.get("/:username", adminsController.renderAminDetails);

module.exports = router;
