const bcrypt = require("bcrypt");
const { and, asc, count, desc, eq, like, sql } = require("drizzle-orm");

const db = require("#db/client");
const { admin } = require("#db/schema");
const { inclusivePick } = require("#utils/objectHelpers");

const SALT_ROUNDS = 10;

const DEFAULT_LIST_LIMIT = 12;

const UtcTimeField = sql`strftime('%Y-%m-%dT%H:%M:%fZ', ${admin.createdAt})`;

const AdminFields = {
  id: admin.id,
  username: admin.username,
  password: admin.password,
  name: admin.name,
  createdAt: admin.createdAt,
};

/** Get all admin info from username
 *
 * @param {string} username
 * @returns
 */
exports.getAllAdminInfoFromUsername = (username) => {
  const query = db
    .select(AdminFields)
    .from(admin)
    .where(eq(admin.username, username))
    .limit(1);

  return query.then((val) => {
    return val.length ? val[0] : null;
  });
};

/** Get parts of admin info from username
 *
 * @param {string} username
 * @param {Array.<keyof typeof AdminFields>} fields
 * @returns
 */
exports.getAdminInfoFromUsername = (username, fields) => {
  const query = db
    .select(inclusivePick(AdminFields, fields))
    .from(admin)
    .where(eq(admin.username, username))
    .limit(1);

  return query.then((val) => {
    return val.length ? val[0] : null;
  });
};

/** Check if admin exists
 *
 * @param {string} username
 * @returns
 */
exports.existsAdmin = (username) => {
  const query = db
    .select({ 1: sql`1` })
    .from(admin)
    .where(eq(admin.username, username))
    .limit(1);

  return query.then((val) => {
    return val.length ? true : false;
  });
};

exports.getAdminDetails = (username) => {
  const query = db
    .select({
      id: admin.id,
      username: admin.username,
      name: admin.name,
      createdAt: UtcTimeField,
    })
    .from(admin)
    .where(eq(admin.username, username))
    .limit(1);

  return query.then((val) => {
    return val.length ? val[0] : null;
  });
};

/** Create admin
 *
 * @param {Object} adminData
 * @param {string} adminData.name
 * @param {string} adminData.username
 * @param {string} adminData.password
 * @returns
 */
exports.createAdmin = (adminData) => {
  return bcrypt.hash(adminData.password, SALT_ROUNDS).then((hash) => {
    const query = db
      .insert(admin)
      .values({
        name: adminData.name,
        username: adminData.username,
        password: hash,
      })
      .returning({ insertedId: admin.id });

    return query.then((val) => {
      return val[0].insertedId;
    });
  });
};

exports.getTotalAdmins = (query) => {
  const conditions = createConditionsList(query);
  const dbQuery = db
    .select({
      count: count(),
    })
    .from(admin)
    .where(and(...conditions));

  return dbQuery.then((val) => val[0].count);
};

exports.getAdminsList = (query) => {
  if (typeof query === "undefined") return [];

  const conditions = createConditionsList(query);

  let order;
  switch (query.sort) {
    case "name-asc":
      order = asc(admin.name);
      break;
    case "name-desc":
      order = desc(admin.name);
      break;
    case "username-asc":
      order = asc(admin.username);
      break;
    case "username-desc":
      order = desc(admin.username);
      break;
    case "regTime-asc":
      order = asc(admin.createdAt);
      break;
    case "regTime-desc":
      order = desc(admin.createdAt);
      break;
    default:
      return [];
  }

  return db
    .select({
      id: admin.id,
      username: admin.username,
      name: admin.name,
      createdAt: UtcTimeField,
    })
    .from(admin)
    .where(and(...conditions))
    .orderBy(order)
    .limit(query.limit)
    .offset((query.page - 1) * query.limit);
};

exports.addDefaultValues = (query) => {
  if (typeof query === "undefined") return [];

  const newQuery = structuredClone(query);

  if (Object.hasOwn(newQuery, "limit")) {
    const temp = parseInt(newQuery.limit);
    if (isNaN(temp) || temp < 1) {
      return [];
    }
    newQuery.limit = temp;
  } else {
    newQuery.limit = DEFAULT_LIST_LIMIT;
  }

  if (Object.hasOwn(newQuery, "page")) {
    const temp = parseInt(newQuery.page);
    if (isNaN(temp) || temp < 1) {
      return [];
    }
    newQuery.page = temp;
  } else {
    newQuery.page = 1;
  }

  if (!Object.hasOwn(newQuery, "sort")) {
    newQuery.sort = "regTime-desc";
  }

  return newQuery;
};

// Helpers

const createConditionsList = (query) => {
  if (typeof query === "undefined") return [];

  const conditions = [];

  if (Object.hasOwn(query, "name")) {
    conditions.push(like(admin.name, `%${query.name}%`));
  }

  if (Object.hasOwn(query, "username")) {
    conditions.push(like(admin.username, `%${query.username}%`));
  }

  return conditions;
};
