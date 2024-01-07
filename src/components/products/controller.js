const { param, validationResult } = require("express-validator");

const { currencyFormatter } = require("#utils/formatter");
const { groupBy } = require("#utils/objectHelpers");
const { processSearchQuery } = require("./helpers");
const productsService = require("./service");

const CategoryPath = {
  Laptops: "laptops",
  Phones: "phones",
};

exports.renderProductList = async (req, res, next) => {
  const query = processSearchQuery(req.query);

  try {
    const [products, categories, subcategories, brands, totalProducts] =
      await Promise.all([
        productsService.getProducts(query),
        productsService.getCategories(),
        productsService.getSubcategories(),
        productsService.getBrands(),
        productsService.getTotalProducts(query),
      ]);

    // Format raw number to currency
    products.forEach((e) => {
      e.price = currencyFormatter.format(e.price);
    });

    const totalPages = Math.ceil(totalProducts / query.limit);

    res.render(`products/product-list`, {
      title: `Products | Product list}`,

      filter: {
        categories: categories,
        subcategories: subcategories,
        brands: brands,
      },
      products: products,
      query: query,
      page: {
        total: totalPages,
        current: query.page,
      },
      categoryPath: CategoryPath,
    });
  } catch (err) {
    return next(err);
  }
};

exports.renderProductCreatePage = async (req, res, next) => {
  const statuses = Object.values(productsService.ProductStatus);
  try {
    const [categories, _subcategories, _brands] = await Promise.all([
      productsService.getCategories(),
      productsService.getSubcategories(),
      productsService.getBrandsCategoryInfo(),
    ]);

    const subcategories = groupBy(_subcategories, "categoryId");
    const brands = groupBy(_brands, "categoryId");

    res.render(`products/product-create`, {
      title: `Products | Create`,

      options: {
        categories: categories,
        subcategories: subcategories,
        brands: brands,
        statuses: statuses,
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.renderProductDetails = [
  [
    param("category").isIn(Object.values(CategoryPath)),
    param("productId").isInt({ min: 0 }),
  ],

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next();
    }

    const { category, productId } = req.params;

    const statuses = Object.values(productsService.ProductStatus);
    try {
      const [product, categories, _subcategories, _brands] = await Promise.all([
        productsService.getProductDetails(category, productId),
        productsService.getCategories(),
        productsService.getSubcategories(),
        productsService.getBrandsCategoryInfo(),
      ]);

      const subcategories = _subcategories.filter(
        (val) => val.categoryId === product.categoryId,
      );
      const brands = _brands.filter(
        (val) => val.categoryId === product.categoryId,
      );

      if (!product) {
        return next();
      }

      res.render(`products/product-details`, {
        title: `Products | ${product.name}`,

        category: category,
        product: product,
        options: {
          categories: categories,
          subcategories: subcategories,
          brands: brands,
          statuses: statuses,
        },
      });
    } catch (err) {
      return next(err);
    }
  },
];
