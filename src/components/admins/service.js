const bcrypt = require("bcrypt");
const { eq, sql } = require("drizzle-orm");

const db = require("#db/client");
const { admins } = require("#db/schema");
const { pick } = require("#utils/objectHelpers");

const SALT_ROUNDS = 10;

const AdminFieldsSelection = {
  id: admins.id,
  username: admins.username,
  password: admins.password,
  fullName: admins.full_name,
  createdAt: admins.created_at,
};

/** Get all admin info
 *
 * @param {string} username
 * @returns
 */
exports.getAllAdminInfo = (username) => {
  const query = db
    .select(AdminFieldsSelection)
    .from(admins)
    .where(eq(admins.username, username))
    .limit(1);

  return query.then((val) => {
    return val.length ? val[0] : null;
  });
};

/** Get parts of admin info
 *
 * @param {string} username
 * @param {Array.<keyof typeof AdminFieldsSelection>} fields
 * @returns
 */
exports.getAdminInfo = (username, fields) => {
  const query = db
    .select(pick(AdminFieldsSelection, fields))
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
 * @param {Object} admin
 * @param {string} admin.fullName
 * @param {string} admin.username
 * @param {string} admin.password
 * @returns
 */
exports.createAdmin = (admin) => {
  return bcrypt.hash(admin.password, SALT_ROUNDS).then((hash) => {
    const query = db
      .insert(admins)
      .values({
        full_name: admin.fullName,
        username: admin.username,
        password: hash,
      })
      .returning({ insertedId: admins.id });

    return query.then((val) => {
      return val[0].insertedId;
    });
  });
};
