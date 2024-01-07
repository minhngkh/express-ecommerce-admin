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
