const express = require("express");

const ordersController = require("./controller");

const router = express.Router();

router.get("/user/:userId", ordersController.renderOrderList);
router.get("/:orderId", ordersController.renderOrderDetails);

module.exports = router;
