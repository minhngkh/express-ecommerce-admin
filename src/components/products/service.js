const { asc, and, count, desc, eq, like, sql, gt, lt } = require("drizzle-orm");

const db = require("#db/client");
const { user } = require("#db/schema");
const { product, laptopProduct, phoneProduct,  } = require("#db/schema");

const DEFAULT_LIST_LIMIT = 24;

const UtcTimeField = sql`strftime('%Y-%m-%dT%H:%M:%fZ', ${user.createdAt})`;

/**
 *
 * @param {Number} id
 * @returns
 */
exports.banAccount = (id) => {
    db.update(user).set({ banned: true }).where(eq(user.id, id));
};

/**
 * @param {Number} id
 * @returns
 */
exports.unbanAccount = (id) => {
    db.update(user).set({ banned: false }).where(eq(user.id, id));
};

exports.viewProductList = (query) => {
    const conditions = createConditionsList(query);
    const dbQuery = db
        .select({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.categoryId,
            brand: product.brandId,
            image: product.image,
            createdAt: UtcTimeField,
        })
        .from(product)
        .where(and(...conditions))
        .orderBy(desc(product.createdAt))
        .limit(DEFAULT_LIST_LIMIT);

    return dbQuery;
};

exports.viewLaptopProductList = (query) => {
    const conditions = createConditionsList(query);
    const dbQuery = db
        .select({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.categoryId,
            brand: product.brandId,
            image: product.image,
            createdAt: UtcTimeField,
            subcategory: laptopProduct.subcategory,
            cpu: laptopProduct.cpu,
            resolution: laptopProduct.resolution,
            ram: laptopProduct.ram,
            storage: laptopProduct.storage,
        })
        .from(product)
        .innerJoin(laptopProduct)
        .on(eq(product.id, laptopProduct.id))
        .where(and(...conditions))
        .orderBy(desc(product.createdAt))
        .limit(DEFAULT_LIST_LIMIT);

    return dbQuery;
};

exports.viewPhoneProductList = (query) => {
    const conditions = createConditionsList(query);
    const dbQuery = db
        .select({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.categoryId,
            brand: product.brandId,
            image: product.image,
            createdAt: UtcTimeField,
            subcategory: phoneProduct.subcategory,
            screenSize: phoneProduct.screenSize,
            resolution: phoneProduct.resolution,
            ram: phoneProduct.ram,
            storage: phoneProduct.storage,
        })
        .from(product)
        .innerJoin(phoneProduct)
        .on(eq(product.id, phoneProduct.id))
        .where(and(...conditions))
        .orderBy(desc(product.createdAt))
        .limit(DEFAULT_LIST_LIMIT);

    return dbQuery;
};

exports.sortProductList = (query) => {
    if (typeof query === "undefined") return [];
    
    switch (query.sort) {
        case "price-asc":
            order = asc(product.price);
            break;
        case "price-desc":
            order = desc(product.price);
            break;
        case "name-asc":
            order = asc(product.name);
            break;
        case "name-desc":
            order = desc(product.name);
            break;
        case "regTime-asc":
            order = asc(product.createdAt);
            break;
        case "regTime-desc":
            order = desc(product.createdAt);
            break;
        default:
            return [];
    }
    
    return db
        .select({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.categoryId,
            brand: product.brandId,
            image: product.image,
            createdAt: UtcTimeField,
        })
        .from(product)
        .orderBy(order)
        .limit(DEFAULT_LIST_LIMIT);
};

exports.sortLaptopProductList = (query) => {
    if (typeof query === "undefined") return [];
    
    switch (query.sort) {
        case "price-asc":
            order = asc(product.price);
            break;
        case "price-desc":
            order = desc(product.price);
            break;
        case "name-asc":
            order = asc(product.name);
            break;
        case "name-desc":
            order = desc(product.name);
            break;
        case "regTime-asc":
            order = asc(product.createdAt);
            break;
        case "regTime-desc":
            order = desc(product.createdAt);
            break;
        default:
            return [];
    }
    
    return db
        .select({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.categoryId,
            brand: product.brandId,
            image: product.image,
            createdAt: UtcTimeField,
            subcategory: laptopProduct.subcategory,
            cpu: laptopProduct.cpu,
            resolution: laptopProduct.resolution,
            ram: laptopProduct.ram,
            storage: laptopProduct.storage,
        })
        .from(product)
        .innerJoin(laptopProduct)
        .on(eq(product.id, laptopProduct.id))
        .orderBy(order)
        .limit(DEFAULT_LIST_LIMIT);
}

exports.sortPhoneProductList = (query) => {
    if (typeof query === "undefined") return [];
    
    switch (query.sort) {
        case "price-asc":
            order = asc(product.price);
            break;
        case "price-desc":
            order = desc(product.price);
            break;
        case "name-asc":
            order = asc(product.name);
            break;
        case "name-desc":
            order = desc(product.name);
            break;
        case "regTime-asc":
            order = asc(product.createdAt);
            break;
        case "regTime-desc":
            order = desc(product.createdAt);
            break;
        default:
            return [];
    }
    
    return db
        .select({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.categoryId,
            brand: product.brandId,
            image: product.image,
            createdAt: UtcTimeField,
            subcategory: phoneProduct.subcategory,
            screenSize: phoneProduct.screenSize,
            resolution: phoneProduct.resolution,
            ram: phoneProduct.ram,
            storage: phoneProduct.storage,
        })
        .from(product)
        .innerJoin(phoneProduct)
        .on(eq(product.id, phoneProduct.id))
        .orderBy(order)
        .limit(DEFAULT_LIST_LIMIT);
}

exports.filterProductList = (query) => {
    if (typeof query === "undefined") return [];
    
    let conditions = [];
    switch (query.filter) {
        case "price":
            conditions.push(lt(product.price, query.price_max))
            conditions.push(gt(product.price, query.price_min))
            break;
        case "name":
            conditions.push(like(product.name, `%${query.name}%`));
            break;
        case "category":
            conditions.push(eq(product.categoryId, query.category));
            break;
        case "brand":
            conditions.push(eq(product.brandId, query.brand));
            break;
    }

    if (Object.hasOwn(query, "prce")) {
        conditions.push(eq(product.price, query.prce));
    }

    return db 
        .select({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.categoryId,
            brand: product.brandId,
            image: product.image,
            createdAt: UtcTimeField,
        })
        .from(product)
        .where(and(...conditions))
        .orderBy(desc(product.createdAt))
        .limit(DEFAULT_LIST_LIMIT);
}

exports.filterLaptopProductList = (query) => {
    if (typeof query === "undefined") return [];
    
    let conditions = [];
    switch (query.filter) {
        case "price":
            conditions.push(lt(product.price, query.price_max))
            conditions.push(gt(product.price, query.price_min))
            break;
        case "name":
            conditions.push(like(product.name, `%${query.name}%`));
            break;
        case "category":
            conditions.push(eq(product.categoryId, query.category));
            break;
        case "brand":
            conditions.push(eq(product.brandId, query.brand));
            break;
    }

    return db 
        .select({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.categoryId,
            brand: product.brandId,
            image: product.image,
            createdAt: UtcTimeField,
            subcategory: laptopProduct.subcategory,
            cpu: laptopProduct.cpu,
            resolution: laptopProduct.resolution,
            ram: laptopProduct.ram,
            storage: laptopProduct.storage,
        })
        .from(product)
        .innerJoin(laptopProduct)
        .on(eq(product.id, laptopProduct.id))
        .where(and(...conditions))
        .orderBy(desc(product.createdAt))
        .limit(DEFAULT_LIST_LIMIT);
}

exports.filterPhoneProductList = (query) => {
    if (typeof query === "undefined") return [];
    
    let conditions = [];
    switch (query.filter) {
        case "price":
            conditions.push(lt(product.price, query.price_max))
            conditions.push(gt(product.price, query.price_min))
            break;
        case "name":
            conditions.push(like(product.name, `%${query.name}%`));
            break;
        case "category":
            conditions.push(eq(product.categoryId, query.category));
            break;
        case "brand":
            conditions.push(eq(product.brandId, query.brand));
            break;
    }

    return db 
        .select({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.categoryId,
            brand: product.brandId,
            image: product.image,
            createdAt: UtcTimeField,
            subcategory: phoneProduct.subcategory,
            screenSize: phoneProduct.screenSize,
            resolution: phoneProduct.resolution,
            ram: phoneProduct.ram,
            storage: phoneProduct.storage,
        })
        .from(product)
        .innerJoin(phoneProduct)
        .on(eq(product.id, phoneProduct.id))
        .where(and(...conditions))
        .orderBy(desc(product.createdAt))
        .limit(DEFAULT_LIST_LIMIT);
}

// Helper functions
const createConditionsList = (query) => {
    const conditions = [];
    if (Object.hasOwn(query, "category")) {
        conditions.push(eq(product.categoryId, query.category));
    }
    if (Object.hasOwn(query, "brand")) {
        conditions.push(eq(product.brandId, query.brand));
    }
    if (Object.hasOwn(query, "search")) {
        conditions.push(like(product.name, `%${query.search}%`));
    }
    if (Object.hasOwn(query, "image")) {
        conditions.push(eq(product.imageId, query.image));
    }
    return conditions;
};