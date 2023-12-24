const usersService = require("./service");

exports.renderUserList = async (req, res, next) => {
  try {
    const newQuery = usersService.addDefaultValues(req.query);

    const [totalUsers, usersList] = await Promise.all([
      usersService.getTotalUsers(newQuery),
      usersService.getUserList(newQuery),
    ]);

    const totalPages = Math.ceil(totalUsers / newQuery.limit);

    res.render("users/users-list", {
      title: "Admin | Users list",
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
