const { asc, and, desc, eq, like, sql } = require("drizzle-orm");

const db = require("#db/client");
const {
  product,
  productBrand,
  productCategory,
  productImage,
  productSubcategory,
} = require("#db/schema");

/**
 * @enum {string}
 */
const ListOrder = {
  CreationTimeAsc: "creationTime-asc",
  CreationTimeDesc: "creationTime-desc",
  PriceAsc: "price-asc",
  PriceDesc: "price-desc",
  TotalAsc: "total-asc",
  TotalDesc: "total-desc",
};

/**
 * @typedef {Object} Query
 * @property {number} categoryId
 * @property {number} subcategoryId
 * @property {number} brandId
 * @property {string} name
 * @property {number} limit
 * @property {number} page
 * @property {ListOrder} sort
 */

const DefaultListLimit = 24;

const ProductUtcCreatedAt = sql`strftime('%Y-%m-%dT%H:%M:%fZ', ${product.createdAt})`;

// TODO: Total purchases sort
/**
 * Get list of products matching query
 * @param {Query} query
 * @returns
 */
exports.getProducts = (query) => {
  const isValid = processQuery(query);
  if (!isValid) return [];

  const conditions = createConditionsList(query);

  return db
    .select({
      id: product.id,
      category: productCategory.name,
      name: product.name,
      price: product.price,
      brand: productBrand.name,
      subcategory: productSubcategory.name,
      status: product.status,
      createdAt: ProductUtcCreatedAt,
      image: productImage.source,
    })
    .from(product)
    .innerJoin(productCategory, eq(product.categoryId, productCategory.id))
    .innerJoin(productBrand, eq(product.brandId, productBrand.id))
    .leftJoin(
      productSubcategory,
      eq(product.subcategoryId, productSubcategory.id),
    )
    .leftJoin(
      productImage,
      and(
        eq(product.id, productImage.productId),
        eq(productImage.isPrimary, true),
      ),
    )
    .where(and(...conditions))
    .orderBy(query.sort)
    .limit(query.limit)
    .offset((query.page - 1) * query.limit);
};

/**
 * Get list of product categories
 * @returns
 */
exports.getCategories = () => {
  return db.select().from(productCategory);
};

/**
 * Get list of subcategories of a category
 * @param {Number} categoryId
 * @returns
 */
exports.getSubcategories = (categoryId) => {
  return db
    .select()
    .from(productSubcategory)
    .where(eq(productSubcategory.categoryId, categoryId));
};

/**
 * Add a new subcategory to a category
 * @param {Number} categoryId
 * @param {Object} categoryData
 * @param {string} categoryData.name
 * @param {string} [categoryData.description]
 * @returns
 */
exports.addSubcategory = (categoryId, categoryData) => {
  db.insert(productSubcategory).values({
    categoryId: categoryId,
    name: categoryData.name,
    description: categoryData.description ? categoryData.description : null,
  });
};

/**
 * Remove a subcategory
 * @param {Number} subcategoryId
 * @param {boolean} toRemoveProducts
 * @returns {void}
 */
exports.removeSubcategory = async (subcategoryId, toRemoveProducts) => {
  if (toRemoveProducts) {
    await db.delete(product).where(eq(product.subcategoryId, subcategoryId));
  }

  await db
    .delete(productSubcategory)
    .where(eq(productSubcategory.id, subcategoryId));
};

/**
 * Get list of product brands
 * @returns
 */
exports.getBrands = () => {
  return db.select().from(productBrand);
};

/**
 * Remove a brand
 * @param {Number} brandId
 * @param {boolean} toRemoveProducts
 * @returns {void}
 */
exports.removeBrand = async (brandId, toRemoveProducts) => {
  if (toRemoveProducts) {
    await db.delete(product).where(eq(product.brandId, brandId));
  }

  await db.delete(productBrand).where(eq(productBrand.id, brandId));
};

// Helper functions

/**
 * Validate and add default values to query
 * @param {Query} query
 * @returns {boolean} query validity
 */
const processQuery = (query) => {
  if (query.limit !== null) {
    if (!Number.isInteger(query.limit) || query.limit < 1) return false;
  } else {
    query.limit = DefaultListLimit;
  }

  if (query.page !== null) {
    if (!Number.isInteger(query.page) || query.page < 1) return false;
  } else {
    query.page = 1;
  }

  if (query.sort === null) {
    query.sort = ListOrder.CreationTimeDesc;
  } else {
    switch (query.sort) {
      case ListOrder.CreationTimeAsc:
        query.sort = asc(product.createdAt);
        break;
      case ListOrder.CreationTimeDesc:
        query.sort = desc(product.createdAt);
        break;
      case ListOrder.PriceAsc:
        query.sort = asc(product.price);
        break;
      case ListOrder.PriceDesc:
        query.sort = desc(product.price);
        break;
      default:
        return false;
    }
  }

  return true;
};

/**
 * Create conditions list from query
 * @param {Query} query
 * @returns
 */
const createConditionsList = (query) => {
  const conditions = [];

  if (query.categoryId !== null) {
    conditions.push(eq(product.categoryId, query.categoryId));
  }
  if (query.subcategoryId !== null) {
    conditions.push(eq(product.subcategoryId, query.subcategoryId));
  }
  if (query.brandId !== null) {
    conditions.push(eq(product.brandId, query.brandId));
  }
  if (query.name !== null) {
    conditions.push(like(product.name, `%${query.name}%`));
  }

  return conditions;
};
