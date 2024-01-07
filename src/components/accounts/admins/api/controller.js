const { body, validationResult } = require("express-validator");

const adminsService = require("../service");
const authService = require("#components/auth/service");

exports.getAdminsList = async (req, res, _) => {
  try {
    const newQuery = adminsService.addDefaultValues(req.query);

    const [totalAdmins, adminsList] = await Promise.all([
      adminsService.getTotalAdmins(newQuery),
      adminsService.getAdminsList(newQuery),
    ]);

    const totalPages = Math.ceil(totalAdmins / newQuery.limit);

    res.status(200).json({
      adminsList: adminsList,
      total: totalPages,
      current: newQuery.page,
    });
  } catch (err) {
    res.status(400).end();
  }
};

exports.updatePassword = [
  [
    body("currentPassword").notEmpty(),
    body("newPassword").notEmpty().isLength({ min: 6 }),
  ],

  async (req, res, _) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: "Invalid password input",
          type: "danger",
        },
      });
    }

    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;

    try {
      if (await authService.compareAdminPassword(id, currentPassword)) {
        await authService.changeAdminPassword(id, newPassword);
        return res.status(200).end();
      }

      return res.status(409).json({
        error: {
          message: "Incorrect current password",
          type: "danger",
        },
      });
    } catch (err) {
      res.status(409).json({
        error: {
          message: "Unable to update password. Please try again later!",
          type: "danger",
        },
      });
    }
  },
];

exports.updateInfo = [
  body("name").notEmpty(),

  async (req, res, _) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: "Invalid profile data",
          type: "danger",
        },
      });
    }

    const { name } = req.body;
    try {
      await adminsService.updateAdmin(req.user.id, { name });
    } catch (err) {
      res.status(403).json({
        error: {
          message: "Unable to update profile. Please try again later!",
          type: "danger",
        },
      });
    }

    res.status(200).end();
  },
];
