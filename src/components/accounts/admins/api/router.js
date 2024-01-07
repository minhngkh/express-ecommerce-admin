const express = require("express");

const adminsApiController = require("./controller");

const router = express.Router();

router.get("/", adminsApiController.getAdminsList);

router.post("/password", adminsApiController.updatePassword);

router.put("/info", adminsApiController.updateInfo);

module.exports = router;
