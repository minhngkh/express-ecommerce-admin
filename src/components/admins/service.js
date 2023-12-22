const bcrypt = require("bcrypt");
const { eq, sql } = require("drizzle-orm");

const db = require("#db/client");
const { admins } = require("#db/schema");
const { inclusivePick } = require("#utils/objectHelpers");

const SALT_ROUNDS = 10;

const AdminFields = {
  id: admins.id,
  username: admins.username,
  password: admins.password,
  fullName: admins.fullName,
  createdAt: admins.createdAt,
};

/** Get all admin info from username
 *
 * @param {string} username
 * @returns
 */
exports.getAllAdminInfoFromUsername = (username) => {
  const query = db
    .select(AdminFields)
    .from(admins)
    .where(eq(admins.username, username))
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
    .from(admins)
    .where(eq(admins.username, username))
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
    .from(admins)
    .where(eq(admins.username, username))
    .limit(1);

  return query.then((val) => {
    return val.length ? true : false;
  });
};

/** Create admin
 *
 * @param {Object} adminData
 * @param {string} adminData.fullName
 * @param {string} adminData.username
 * @param {string} adminData.password
 * @returns
 */
exports.createAdmin = (adminData) => {
  return bcrypt.hash(adminData.password, SALT_ROUNDS).then((hash) => {
    const query = db
      .insert(admins)
      .values({
        fullName: adminData.fullName,
        username: adminData.username,
        password: hash,
      })
      .returning({ insertedId: admins.id });

    return query.then((val) => {
      return val[0].insertedId;
    });
  });
};
