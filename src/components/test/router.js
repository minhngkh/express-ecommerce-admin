const express = require("express");

const productsService = require("#components/products/service");
const { processSearchQuery } = require("#components/products/helpers");

const router = express.Router();

router.get("/product-list", async (req, res) => {
  const query = processSearchQuery(req.query);
  const list = await productsService.getProducts(query);

  console.log(query);

  res.json(list);
});

module.exports = router;
