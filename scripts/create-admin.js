require("dotenv").config();

const { createAdmin } = require("#components/admins/service");

const admin = {
  fullName: "Test Account",
  username: "test",
  password: "test123",
};

const main = async () => {
  const result = await createAdmin(admin);

  console.log(result);
};

main();
