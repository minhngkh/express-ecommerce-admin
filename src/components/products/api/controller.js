const MAX_PRODUCT_EXTRA_IMG = 4;

exports.genProductImgNames = (req, res, next) => {
  const { productId } = req.params;
  res.locals.imgNames = [];

  res.locals.imgNames.push(`product-${productId}-main`);
  for (let i = 0; i < MAX_PRODUCT_EXTRA_IMG; i++) {
    res.locals.imgNames.push(`product-${productId}-extra-${i}`);
  }

  next();
};
