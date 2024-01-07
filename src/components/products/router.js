const express = require("express");

const productsController = require("./controller");

const router = express.Router();

router.get("/", productsController.renderProductList);

router.get("/create", productsController.renderProductCreatePage);

// router.get("/:category/:id", productsController.renderProductDetail);

module.exports = router;
