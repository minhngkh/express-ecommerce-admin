const express = require("express");

const apiProductsController = require("./controller");
const cloudinary = require("#middlewares/cloudinary");
const service = require("../service");

const router = express.Router();

router.get(
  "/:productId/images/uploadSignature",
  apiProductsController.genProductImgNames,
  cloudinary.getUploadAuthenticationInfo("product-img"),
);

module.exports = router;
