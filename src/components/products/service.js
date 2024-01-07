const { asc, and, count, desc, eq, like, or, sql } = require("drizzle-orm");

const db = require("#db/client");
const {
  brandInCategory,
  laptopProduct,
  phoneProduct,
  product,
  productBrand,
  productCategory,
  productImage,
  productSubcategory,
} = require("#db/schema");
const { omit } = require("#utils/objectHelpers");

/**
 * @enum {string}
 */
const ListOrder = {
  CreationTimeAsc: "creation-asc",
  CreationTimeDesc: "creation-desc",
  PriceAsc: "price-asc",
  PriceDesc: "price-desc",
  PurchasesAsc: "purchases-asc",
  PurchasesDesc: "purchases-desc",
};

exports.ProductStatus = {
  OnStock: "on stock",
  OutOfStock: "out of stock",
  Suspend: "suspend",
};

const ProductExtendedTable = {
  laptops: laptopProduct,
  phones: phoneProduct,
};

const CategoryAlias = {
  0: "laptops",
  1: "phones",
};

/**
 * @typedef {Object} Query
 * @property {?number} categoryId
 * @property {?number[]} subcategoryIds
 * @property {?number[]} brandIds
 * @property {?string} status
 * @property {?string} name
 * @property {number} limit
 * @property {number} page
 * @property {?string} sort
 */

const ProductUtcCreatedAt = sql`strftime('%Y-%m-%dT%H:%M:%fZ', ${product.createdAt})`;

exports.getTotalProducts = (query) => {
  const conditions = createConditionsList(query);

  const dbQuery = db
    .select({
      count: count(),
    })
    .from(product)
    .where(and(...conditions));

  return dbQuery.then((val) => {
    return val[0].count;
  });
};

// TODO: Total purchases sort
/**
 * Get list of products matching query
 * @param {Query} query
 * @returns
 */
exports.getProducts = (query) => {
  const { order } = processQuery(query);
  if (order === null) return [];

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
    .orderBy(order)
    .limit(query.limit)
    .offset((query.page - 1) * query.limit);
};

/**
 * Get details of a product
 * @param {keyof ProductExtendedTable} category
 * @param {number} id
 * @returns
 */
exports.getProductDetails = (category, id) => {
  console.log(laptopProduct.$inferSelect());
  const query = db
    .select()
    .from(product)
    .innerJoin(
      ProductExtendedTable[category],
      eq(product.id, ProductExtendedTable[category].productId),
    )
    .innerJoin(productBrand, eq(product.brandId, productBrand.id))
    .where(eq(product.id, id))
    .limit(1);

  return query.then((val) => {
    if (!val.length) return null;

    return {
      id: val[0].product.id,
      name: val[0].product.name,
      price: val[0].product.price,
      brand: val[0].product_brand.name,
      status: val[0].product.status,
      category: category,
      details: Object.values(omit(val[0], ["product", "product_brand"]))[0],
    };
  });
};

/**
 * Get list of product categories
 * @returns
 */
exports.getCategories = () => {
  return db.select().from(productCategory);
};

/**
 * Create a product category
 * @param {Object} categoryData
 * @param {string} categoryData.name
 * @param {string} [categoryData.description]
 */
exports.addCategory = async (categoryData) => {
  await db.insert(productCategory).values({
    name: categoryData.name,
    description: categoryData.description ? categoryData.description : null,
  });
};

/**
 * Read a product category
 * @param {Number} categoryId
 * @returns
 */
exports.getCategory = (categoryId) => {
  return db
    .select()
    .from(productCategory)
    .where(eq(productCategory.id, categoryId));
};

/**
 * Update a product category
 * @param {Number} categoryId
 * @param {Object} categoryData
 * @param {string} categoryData.name
 * @param {string} [categoryData.description]
 */
exports.updateCategory = async (categoryId, categoryData) => {
  await db
    .update(productCategory)
    .set({
      name: categoryData.name,
      description: categoryData.description ? categoryData.description : null,
    })
    .where(eq(productCategory.id, categoryId));
};

/**
 * Delete a product category
 * @param {Number} categoryId
 */
exports.removeCategory = async (categoryId) => {
  await db.delete(productCategory).where(eq(productCategory.id, categoryId));
};

/**
 * Get list of subcategories
 * @returns
 */
exports.getSubcategories = () => {
  return db.select().from(productSubcategory);
};

/**
 * Get list of subcategories of a category
 * @param {Number} categoryId
 * @returns
 */
exports.getSubcategoriesOfCategory = (categoryId) => {
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
 */
exports.addSubcategory = async (categoryId, categoryData) => {
  await db.insert(productSubcategory).values({
    categoryId: categoryId,
    name: categoryData.name,
    description: categoryData.description ? categoryData.description : null,
  });
};

/**
 * Read a subcategory
 * @param {Number} subcategoryId
 * @returns
 */
exports.getSubcategory = (subcategoryId) => {
  return db
    .select()
    .from(productSubcategory)
    .where(eq(productSubcategory.id, subcategoryId));
};

/**
 * Update a subcategory
 * @param {Number} subcategoryId
 * @param {Object} subcategoryData
 * @param {string} subcategoryData.name
 * @param {string} [subcategoryData.description]
 */
exports.updateSubcategory = async (subcategoryId, subcategoryData) => {
  await db
    .update(productSubcategory)
    .set({
      name: subcategoryData.name,
      description: subcategoryData.description
        ? subcategoryData.description
        : null,
    })
    .where(eq(productSubcategory.id, subcategoryId));
};

/**
 * Remove a subcategory
 * @param {Number} subcategoryId
 * @param {boolean} toRemoveProducts
 */
exports.removeSubcategory = (subcategoryId, toRemoveProducts) => {
  if (toRemoveProducts) {
    db.batch([
      db.delete(product).where(eq(product.subcategoryId, subcategoryId)),
      db
        .delete(productSubcategory)
        .where(eq(productSubcategory.id, subcategoryId)),
    ]);
  } else {
    db.batch([
      db
        .update(product)
        .set({ subcategoryId: null })
        .where(eq(product.subcategoryId, subcategoryId)),
      db
        .delete(productSubcategory)
        .where(eq(productSubcategory.id, subcategoryId)),
    ]);
  }
};

/**
 * Get list of product brands
 * @returns
 */
exports.getBrands = () => {
  return db.select().from(productBrand);
};

/** Get list of brands in a category
 *
 * @param {*} categoryId
 * @returns
 */
exports.getBrandsInCategory = (categoryId) => {
  const sq = db
    .selectDistinct({
      id: productBrand.id,
    })
    .from(product)
    .where(eq(product.categoryId, categoryId))
    .as("sq");

  const query = db
    .select()
    .from(productBrand)
    .innerJoin(sq, eq(productBrand.id, sq.id));

  return query;
};

/**
 * Create a product brand
 * @param {Object} brandData
 * @param {string} brandData.name
 * @param {string} [brandData.description]
 */
exports.addBrand = async (brandData) => {
  await db.insert(productBrand).values({
    name: brandData.name,
    description: brandData.description ? brandData.description : null,
  });
};

/**
 * Read a product brand
 * @param {Number} brandId
 * @returns
 */
exports.getBrand = (brandId) => {
  return db.select().from(productBrand).where(eq(productBrand.id, brandId));
};

/**
 * Update a product brand
 * @param {Number} brandId
 * @param {Object} brandData
 * @param {string} brandData.name
 * @param {string} [brandData.description]
 * @returns
 */
exports.updateBrand = async (brandId, brandData) => {
  await db
    .update(productBrand)
    .set({
      name: brandData.name,
      description: brandData.description ? brandData.description : null,
    })
    .where(eq(productBrand.id, brandId));
};

/**
 * Delete a product brand
 * @param {Number} brandId
 */
exports.removeBrand = async (brandId) => {
  await db.delete(productBrand).where(eq(productBrand.id, brandId));
};

/**
 * Remove a brand
 * @param {Number} brandId
 * @param {boolean} toRemoveProducts
 * @returns {void}
 */
exports.removeBrand = (brandId, toRemoveProducts) => {
  if (toRemoveProducts) {
    db.batch([
      db.delete(product).where(eq(product.brandId, brandId)),
      db.delete(productBrand).where(eq(productBrand.id, brandId)),
    ]);
  } else {
    db.delete(productBrand).where(eq(productBrand.id, brandId));
  }
};

// Helper functions

/**
 * Validate and add default values to query
 * @param {Query} query
 * @returns
 */
const processQuery = (query) => {
  const result = {
    order: null,
  };

  if (query.sort === null) {
    result.order = desc(product.createdAt);
  } else {
    switch (query.sort) {
      case ListOrder.CreationTimeAsc:
        result.order = asc(product.createdAt);
        break;
      case ListOrder.CreationTimeDesc:
        result.order = desc(product.createdAt);
        break;
      case ListOrder.PriceAsc:
        result.order = asc(product.price);
        break;
      case ListOrder.PriceDesc:
        result.order = desc(product.price);
        break;
      default:
        break;
    }
  }

  return result;
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

  if (query.subcategoryIds !== null) {
    if (query.subcategoryIds.length === 1) {
      conditions.push(eq(product.subcategoryId, query.subcategoryIds[0]));
    } else {
      conditions.push(
        or(...query.subcategoryIds.map((s) => eq(product.subcategoryId, s))),
      );
    }
  }

  if (query.brandIds !== null) {
    if (query.brandIds.length === 1) {
      conditions.push(eq(product.brandId, query.brandIds[0]));
    } else {
      conditions.push(or(...query.brandIds.map((s) => eq(product.brandId, s))));
    }
  }

  if (query.status !== null) {
    conditions.push(eq(product.status, query.status));
  }

  if (query.name !== null) {
    conditions.push(like(product.name, `%${query.name}%`));
  }

  return conditions;
};

const { order } = require("#db/schema");

/**
 * Create a order
 * @param {Object} orderData
 * @param {Number} orderData.userId
 * @param {Number} orderData.productId
 * @param {Number} orderData.quantity
 * @param {Number} orderData.total
 */
exports.createOrder = async (orderData) => {
  await db.insert(order).values({
    userId: orderData.userId,
    addressId: orderData.addressId,
    status: orderData.status,
    total: orderData.total,
  });
};

/**
 * Update a order status
 * @param {Number} orderId
 * @param {string} status
 */
exports.updateOrderStatus = async (orderId, status) => {
  await db
    .update(order)
    .set({
      status: status,
    })
    .where(eq(order.id, orderId));
};

/**
 * view order list
 * @param {Number} userId
 * @returns
 */
exports.getOrders = (userId) => {
  return db.select().from(order).where(eq(order.userId, userId));
};

/**
 * Get order detail
 * @param {Number} orderId
 * @returns
 */
exports.getOrder = (orderId) => {
  return db.select().from(order).where(eq(order.id, orderId));
};

exports.getBrandsCategoryInfo = () => {
  return db
    .select({
      id: productBrand.id,
      name: productBrand.name,
      categoryId: brandInCategory.categoryId,
    })
    .from(productBrand)
    .innerJoin(brandInCategory, eq(productBrand.id, brandInCategory.brandId));
};

/**
 *
 * @param {object} productData
 * @returns
 */
exports.createProduct = (productData) => {
  const extTable = ProductExtendedTable[CategoryAlias[productData.categoryId]];
  if (!extTable) return null;

  const { specs, ...info } = productData;

  const transaction = db.transaction(async (tx) => {
    const [{ id }] = await tx.insert(product).values(info).returning({
      id: product.id,
    });

    await tx.insert(extTable).values({
      ...specs,
      productId: id,
      categoryId: productData.categoryId,
    });

    return id;
  });

  return transaction;
};

exports.setProductImages = (id, primary, extras) => {
  return db.insert(productImage).values([
    {
      productId: id,
      source: primary,
      isPrimary: true,
    },
    ...extras.map((e) => ({
      productId: id,
      source: e,
      isPrimary: false,
    })),
  ]);
};
