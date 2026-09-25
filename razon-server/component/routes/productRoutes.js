const express = require("express");

const authentication = require("../middleware/authentication");
const authorize = require("../middleware/authorization");

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// Browsing the catalog is public.
router.route("/")
  .get(getProducts)
  .post(authentication, authorize("Admin"), createProduct);

router.route("/:id")
  .put(authentication, authorize("Admin"), updateProduct)
  .delete(authentication, authorize("Admin"), deleteProduct);

module.exports = router;
