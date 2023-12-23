const {
  ne,
  eq,
  and,
  like,
  or,
  lte,
  gte,
  asc,
  desc,
  sql,
  count,
} = require("drizzle-orm");

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
  laptops: {
    table: laptopProducts,
    fields: LaptopProductFields,
  },
};

/**
 *
 * @param {*} query Get products list of a category with filtering and sorting applied
 * @param {*} category Category of the products list (laptops/phones/watches)
 * @returns List of products with minimal info
 */
exports.getProductsMinimalInfoList = (query, category, limit) => {
  if (typeof query == "undefined") return [];

  const conditions = createConditionsList(query, category);

  let order = asc(products.name);
  if (Object.hasOwn(query, "sort")) {
    switch (query.sort) {
      case "name-asc":
        order = asc(products.name);
        break;
      case "name-desc":
        order = desc(products.name);
        break;
      case "price-asc":
        order = asc(products.price);
        break;
      case "price-desc":
        order = desc(products.price);
        break;
      default:
        throw new Error("Invalid sort query");
    }
  }

  let page = 1;
  if (Object.hasOwn(query, "page")) {
    page = Number(query.page);
  }

  return db
    .select(ProductFields)
    .from(products)
    .innerJoin(
      ProductCategories[category].table,
      eq(products.id, ProductCategories[category].table.id),
    )
    .where(and(...conditions))
    .orderBy(order)
    .limit(limit)
    .offset((page - 1) * limit);
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

// Helpers

function createConditionsList(query, category) {
  if (typeof query == "undefined") return [];

  const conditions = [];

  if (Object.hasOwn(query, "categories")) {
    if (query.categories.length === 1) {
      conditions.push(
        eq(ProductCategories[category].table.subcategory, query.categories[0]),
      );
    } else {
      const orConditions = query.categories.map((e) =>
        eq(ProductCategories[category].table.subcategory, e),
      );
      conditions.push(or(...orConditions));
    }
  }

  if (Object.hasOwn(query, "brands")) {
    if (query.brands.length === 1) {
      conditions.push(eq(products.brand, query.brands[0]));
    } else {
      const orConditions = query.brands.map((e) => eq(products.brand, e));
      conditions.push(or(...orConditions));
    }
  }

  if (Object.hasOwn(query, "search")) {
    conditions.push(like(products.name, `%${query.search}%`));
  }

  if (Object.hasOwn(query, "minPrice")) {
    conditions.push(gte(products.price, Number(query.minPrice)));
  }

  if (Object.hasOwn(query, "maxPrice")) {
    conditions.push(lte(products.price, Number(query.maxPrice)));
  }

  return conditions;
}
