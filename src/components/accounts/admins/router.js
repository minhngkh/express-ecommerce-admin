const express = require("express");

const adminsController = require("./controller");

const router = express.Router();

router.get("/", adminsController.renderAdminsList);

router.get("/:id", adminsController.renderAminDetails);

router.get("/:id/edit", adminsController.renderEditPage);

module.exports = router;
