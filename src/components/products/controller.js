const { currencyFormatter } = require("#utils/formatter");
const { processSearchQuery } = require("./helpers");
const productsService = require("./service");

const CategoryFmtName = {
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
      categoryPath: CategoryFmtName,
    });
  } catch (err) {
    return next(err);
  }
};
