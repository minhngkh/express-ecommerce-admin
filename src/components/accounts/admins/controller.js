const adminsService = require("./service");

exports.renderAdminsList = async (req, res, next) => {
  try {
    const newQuery = adminsService.addDefaultValues(req.query);

    const [totalAdmins, adminsList] = await Promise.all([
      adminsService.getTotalAdmins(newQuery),
      adminsService.getAdminsList(newQuery),
    ]);

    const totalPages = Math.ceil(totalAdmins / newQuery.limit);

    res.render("accounts/admins-list", {
      title: "Accounts | Admins list",
      adminsList: adminsList,
      query: newQuery,
      page: {
        total: totalPages,
        current: newQuery.page,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.renderAminDetails = async (req, res, next) => {
  const adminDetails = await adminsService.getAdminDetails(req.params.username);

  if (!adminDetails) {
    return next();
  }

  res.render("accounts/admin-details", {
    title: "Accounts | Admin details",
    admin: adminDetails,
  });
};
