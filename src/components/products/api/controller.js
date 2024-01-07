const {
  validationResult,
  param,
  body,
  matchedData,
} = require("express-validator");

const assetStorage = require("#lib/assetStorage");
const { currencyFormatter } = require("#utils/formatter");
const productsService = require("../service");
const { processSearchQuery } = require("../helpers");

const MAX_PRODUCT_EXTRA_IMG = 4;

exports.getProductList = async (req, res, _) => {
  const query = processSearchQuery(req.query);

  try {
    const [products, totalProducts] = await Promise.all([
      productsService.getProducts(query),
      productsService.getTotalProducts(query),
    ]);

    // Format raw number to currency
    products.forEach((e) => {
      e.price = currencyFormatter.format(e.price);
    });

    const totalPages = Math.ceil(totalProducts / query.limit);

    return res.status(200).json({
      productList: products,
      total: totalPages,
      current: query.page,
    });
  } catch (err) {
    res.status(400).end();
  }
};

exports.getImgUploadSignature = [
  param("productId").isInt({ min: 1 }),

  (req, res, _) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const { productId } = req.params;
    const sig = assetStorage.genUploadSignatures("productImg", productId);

    return res.status(200).json(sig);
  },
];

exports.createProduct = [
  [
    body("name").notEmpty(),
    body("categoryId").isInt({ min: 0 }).toInt(),
    body("subcategoryId").isInt({ min: 0 }).toInt(),
    body("brandId").isInt({ min: 0 }).toInt(),
    body("price").isInt({ min: 0 }).toInt(),
    body("status").custom((val) => {
      return Object.values(productsService.ProductStatus).includes(val);
    }),
    body("specs").isObject(),
  ],

  async (req, res, _) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).end();
    }

    const data = matchedData(req);

    try {
      const result = await productsService.createProduct(data);

      return res.status(200).json({ id: result });
    } catch (err) {
      console.log(err);
      return res.status(403).json({
        error: {
          message: "Unable to create product",
          type: "danger",
        },
      });
    }
  },
];

exports.setProductImages = [
  [
    param("productId").isInt({ min: 0 }),
    body("primary").notEmpty(),
    body("extras").isArray(),
  ],

  async (req, res, _) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const { productId } = req.params;
    const { primary, extras } = req.body;

    try {
      await productsService.setProductImages(productId, primary, extras);
      return res.status(200).end();
    } catch (err) {
      console.log(err);
      return res.status(403).json({
        error: {
          message: "Unable to set product images",
          type: "danger",
        },
      });
    }
  },
];
