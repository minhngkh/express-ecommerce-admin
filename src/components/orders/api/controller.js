const { body, validationResult } = require("express-validator");

const ordersService = require("../service");

exports.updateOrderStatus = [
  body("status").isIn(["pending", "paid", "cancelled"]),

  async (req, res, _) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).end();
    }

    const { orderId } = req.params;
    const { status } = req.body;

    await ordersService.updateOrderStatus(orderId, status);

    res.status(200).end();
  },
];
