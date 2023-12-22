const { eq } = require("drizzle-orm");

const db = require("#db/client");
const { users } = require("#db/schema");

const UserFields = {
  email: users.email,
  password: users.password,
  fullName: users.fullName,
};

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
