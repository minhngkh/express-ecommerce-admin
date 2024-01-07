const bcrypt = require("bcrypt");
const { eq } = require("drizzle-orm");

const db = require("#db/client");
const { admin } = require("#db/schema");

const SaltRounds = 10;

/**
 * Change password of admin account
 * @param {String} adminId
 * @param {String} newPassword
 * @returns
 */
exports.changeAdminPassword = (adminId, newPassword) => {
  return bcrypt.hash(newPassword, SaltRounds).then((hash) => {
    return db
      .update(admin)
      .set({
        password: hash,
      })
      .where(eq(admin.id, adminId));
  });
};

exports.compareAdminPassword = (adminId, password) => {
  const query = db
    .select({ password: admin.password })
    .from(admin)
    .where(eq(admin.id, adminId))
    .limit(1);

  return query.then((val) => {
    if (!val.length) throw new Error("Admin not found");
    return bcrypt.compare(password, val[0].password);
  });
};
