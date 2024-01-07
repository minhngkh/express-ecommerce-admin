const usersService = require("./service");

exports.renderUsersList = async (req, res, next) => {
  try {
    const newQuery = usersService.addDefaultValues(req.query);

    const [totalUsers, usersList] = await Promise.all([
      usersService.getTotalUsers(newQuery),
      usersService.getUserList(newQuery),
    ]);

    const totalPages = Math.ceil(totalUsers / newQuery.limit);

    res.render("accounts/user-list", {
      title: "Accounts | User list",
      usersList: usersList,
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

exports.renderUserDetails = async (req, res, next) => {
  const userDetails = await usersService.getUserDetails(req.params.id);

  if (!userDetails) {
    return next();
  }

  res.render("accounts/user-details", {
    title: "Accounts | User details",
    user: userDetails,
  });
};
