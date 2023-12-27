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
router.get("/ ", async (req, res) => {
  const categoryData = {
    name: "test",
    description: "A powerful move forward.",
  };
  const category = await productsService.addCategory(categoryData);
  res.send("Category added");
});

// View a category
router.get("/category/:categoryId", async (req, res) => {
  const category = await productsService.getCategory(req.params.categoryId);

  res.json(category);
});

// Update a category
router.get("/update-category/:categoryId", async (req, res) => {
  const categoryData = {
    name: "Phones",
    description: "Experience the power of the future.",
  };
  const category = await productsService.updateCategory(
    req.params.categoryId,
    categoryData,
  );

  res.send("Category updated");
});

// Delete a category
router.get("/delete-category/:categoryId", async (req, res) => {
  const category = await productsService.removeCategory(req.params.categoryId);
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

module.exports = router;
