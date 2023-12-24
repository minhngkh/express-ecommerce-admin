const { asc, and, count, desc, eq, like, sql } = require("drizzle-orm");

const db = require("#db/client");
const { users } = require("#db/schema");

const DEFAULT_LIST_LIMIT = 12;

const UtcTimeField = sql`strftime('%Y-%m-%dT%H:%M:%fZ', ${users.createdAt})`;

/**
 *
 * @param {Number} id
 * @param {Object} userData
 * @param {string} [userData.email]
 * @param {string} [userData.password]
 * @param {string} [userData.fullName]
 * @returns
 */
exports.updateUser = (id, userData) => {
  db.update(users).set(userData).where(eq(users.id, id));
};

exports.genUserAvatarName = (req, res, next) => {
  res.locals.imgNames = [`user-${req.params.userId}`];
  next();
};

exports.getUserDetails = (id) => {
  const query = db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      avatar: users.avatar,
      createdAt: UtcTimeField,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return query.then((val) => {
    return val.length ? val[0] : null;
  });
};

exports.getTotalUsers = (query) => {
  const conditions = createConditionsList(query);
  const dbQuery = db
    .select({
      count: count(),
    })
    .from(users)
    .where(and(...conditions));

  return dbQuery.then((val) => val[0].count);
};

exports.getUserList = (query) => {
  if (typeof query === "undefined") return [];

  const conditions = createConditionsList(query);

  let order;
  switch (query.sort) {
    case "name-asc":
      order = asc(users.fullName);
      break;
    case "name-desc":
      order = desc(users.fullName);
      break;
    case "email-asc":
      order = asc(users.email);
      break;
    case "email-desc":
      order = desc(users.email);
      break;
    case "regTime-asc":
      order = asc(users.createdAt);
      break;
    case "regTime-desc":
      order = desc(users.createdAt);
      break;
    default:
      return [];
  }

  return db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      avatar: users.avatar,
      createdAt: UtcTimeField,
    })
    .from(users)
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
    conditions.push(like(users.fullName, `%${query.name}%`));
  }

  if (Object.hasOwn(query, "email")) {
    conditions.push(like(users.email, `%${query.email}%`));
  }

  return conditions;
};
