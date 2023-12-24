const adminsService = require("../service");

exports.getUsersList = async (req, res, _) => {
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
