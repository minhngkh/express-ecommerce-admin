const CreateError = require("http-errors");
const adminsService = require("./service");

exports.renderAdminsList = async (req, res, next) => {
  try {
    const newQuery = adminsService.addDefaultValues(req.query);

    const [totalAdmins, adminsList] = await Promise.all([
      adminsService.getTotalAdmins(newQuery),
      adminsService.getAdminsList(newQuery),
    ]);

    const totalPages = Math.ceil(totalAdmins / newQuery.limit);

    res.render("accounts/admin-list", {
      title: "Accounts | Admin list",
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
  const adminDetails = await adminsService.getAdminDetails(req.params.id);

  if (!adminDetails) {
    return next();
  }

  res.render("accounts/admin-details", {
    title: "Accounts | Admin details",
    admin: adminDetails,
  });
};

exports.renderEditPage = async (req, res, next) => {
  const data = await adminsService.getAdminDetails(req.params.id);
  if (!data) {
    return next();
  }
  if (data.username !== req.user.username) {
    return next(CreateError(403));
  }

  res.render("accounts/admin-edit", {
    title: "Accounts | Admin edit",
    data: data,
  });
};
