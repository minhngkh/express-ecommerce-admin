const express = require("express");

const apiProductsController = require("./controller");

const router = express.Router();

router.get("/", apiProductsController.getProductList);

router.post("/", apiProductsController.createProduct);

router.put("/:productId", apiProductsController.updateProduct);

router.delete("/:productId", apiProductsController.deleteProduct);

router.get(
  "/:productId/images/upload_signature",
  apiProductsController.getImgUploadSignature,
);

router.post("/:productId/images", apiProductsController.setProductImages);

module.exports = router;
