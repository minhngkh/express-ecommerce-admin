require("dotenv").config();
const { createProduct } = require("#components/products/service");

const main = async () => {
  const product = {
    name: "Test Product",
    price: 1000,
    category: "laptop",
    brand: "Test Brand",
    image: "test.jpg",
    subcategory: "Test Subcategory",
    cpu: "Test CPU",
    resolution: "Test Resolution",
    ram: "Test RAM",
    storage: "Test Storage",
  };

  const result = await createProduct(product, product.category);

  console.log(result);
};

main();
