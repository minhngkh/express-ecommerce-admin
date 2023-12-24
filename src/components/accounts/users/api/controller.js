const usersService = require("../service");

exports.getUsersList = async (req, res, _) => {
  try {
    const newQuery = usersService.addDefaultValues(req.query);

    const [totalUsers, usersList] = await Promise.all([
      usersService.getTotalUsers(newQuery),
      usersService.getUserList(newQuery),
    ]);

    const totalPages = Math.ceil(totalUsers / newQuery.limit);

    res.status(200).json({
      usersList: usersList,
      total: totalPages,
      current: newQuery.page,
    });
  } catch (err) {
    res.status(400).end();
  }
};
