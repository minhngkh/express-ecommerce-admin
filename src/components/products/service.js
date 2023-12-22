const db = require("#db/client");
const { laptopProducts, products } = require("#db/schema");
const { pick } = require("#utils/objectHelpers");

const ProductFields = {
  id: products.id,
  name: products.name,
  price: products.price,
  category: products.category,
  brand: products.brand,
  image: products.image,
};

const LaptopProductFields = {
  subcategory: laptopProducts.subcategory,
  cpu: laptopProducts.cpu,
  resolution: laptopProducts.resolution,
  ram: laptopProducts.ram,
  storage: laptopProducts.storage,
};

const ProductCategories = {
  laptop: {
    table: laptopProducts,
    fields: LaptopProductFields,
  },
};

/**
 *
 * @param {Object} productData
 * @returns
 */
exports.createProduct = (productData, category) => {
  return db.transaction(async (tx) => {
    const [{ insertedId }] = await tx
      .insert(products)
      .values(pick(productData, Object.keys(ProductFields)))
      .returning({
        insertedId: products.id,
      });

    await tx.insert(ProductCategories[category].table).values({
      id: insertedId,
      ...pick(productData, Object.keys(ProductCategories[category].fields)),
    });

    return insertedId;
  });
};
