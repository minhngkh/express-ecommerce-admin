const { param, validationResult } = require("express-validator");

const ordersService = require("./service");

exports.renderOrderList = [
  param("userId").isInt(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next();
    }

    const { userId } = req.params;

    const orders = await ordersService.getOrders(userId);

    res.render("orders/order-list", {
      title: "Orders",

      orders: orders,
    });
  },
];

exports.renderOrderDetails = [
  param("orderId").isInt(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next();
    }

    const { orderId } = req.params;

    const order = await ordersService.getOrderDetails(orderId);
    const orderItems = await ordersService.getOrderItems(orderId);

    res.render("orders/order-details", {
      title: "Order Detail",

      order: order,
      items: orderItems,
    });
  },
];
