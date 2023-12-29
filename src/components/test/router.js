const express = require("express");

const productsService = require("#components/products/service");
const { processSearchQuery } = require("#components/products/helpers");

const router = express.Router();

// View product list
router.get("/product-list", async (req, res) => {
  const query = processSearchQuery(req.query);
  query.sort = "creationTime-desc";
  query.categoryId = 1;
  console.log(query);
  const list = await productsService.getProducts(query);
  res.json(list);
});

// View categories list
router.get("/categories", async (req, res) => {
  const categories = await productsService.getCategories();

  res.json(categories);
});

// Add a new category
router.get("/category", async (req, res) => {
  const categoryData = {
    name: "Gaming",
    description: "Playing an electronic video game.",
  };
  const category = await productsService.addSubcategory(1, categoryData);
  res.send("Category added");
});

// View a category
router.get("/category/:categoryId", async (req, res) => {
  const category = await productsService.getSubcategory(req.params.categoryId);

  res.json(category);
});

// Update a category
router.get("/update-category/:categoryId", async (req, res) => {
  const categoryData = {
    name: "Phones",
    description: "Experience the power of the future.",
  };
  const category = await productsService.updateSubcategory(
    req.params.categoryId,
    categoryData,
  );

  res.send("Category updated");
});

// Delete a category
router.get("/delete-category/:categoryId", async (req, res) => {
  const category = await productsService.removeSubcategory(req.params.categoryId);
  res.send("Category deleted");
});

// Create a brand
router.get("/add-brand", async (req, res) => {
  const brandData = {
    name: "Applee",
    description: "Think differentrrrrrrr.",
  };
  const brand = await productsService.addBrand(brandData);
  res.send("Brand added");
});

// View a brand
router.get("/brand/:brandId", async (req, res) => {
  const brand = await productsService.getBrand(req.params.brandId);

  res.json(brand);
});

// Update a brand
router.get("/update-brand/:brandId", async (req, res) => {
  const brandData = {
    name: "Apple",
    description: "Tdfsafshink different.",
  };
  const brand = await productsService.updateBrand(
    req.params.brandId,
    brandData,
  );

  res.send("Brand updated");
});

// Delete a brand
router.get("/delete-brand/:brandId", async (req, res) => {
  const brand = await productsService.removeBrand(req.params.brandId);
  res.send("Brand deleted");
});

// View orders list
router.get("/watch-others", async (req, res) => {
  const orders = await productsService.getOrder(1);
  res.json(orders);
});

const adminService = require("#components/accounts/admins/service");
// Change admin profile
router.get("/change-admin-profile", async (req, res) => {
  const adminData = {
    name: "admin1",
    username: "admin",
    password: "1",
  };
  const admin = await adminService.updateAdmin(0, adminData);
  res.send("Admin profile updated");
});

// Change user profile
const userService = require("#components/accounts/users/service");
router.get("/change-user-profile", async (req, res) => {
  const userData = {
    email: "thinh@edu.com",
    fullName: "Con meo",
    avatar: "http://res.cloudinary.com/mavericks/image/upload/v1703416730/profile-pic/High.png",
    address: 0,
  };
  const user = await userService.updateUserProfile(1, userData);
  res.send("User profile updated");
});

module.exports = router;
