const express = require("express");

const ordersApiController = require("./controller");

const router = express.Router();

router.put("/:orderId/status", ordersApiController.updateOrderStatus);

module.exports = router;
