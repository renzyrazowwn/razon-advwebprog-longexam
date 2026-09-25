const express = require("express");

const authentication = require("../middleware/authentication");
const authorize = require("../middleware/authorization");

const {
  getProductsV1,
  getProductByIdV1,
  createProductV1,
  updateProductV1,
  deleteProductV1,
} = require("../controllers/productController");

const router = express.Router();

// Browsing the catalog is public.
router.route("/")
  .get(getProductsV1)
  .post(authentication, authorize("Admin"), createProductV1);

router.route("/:id")
  .get(getProductByIdV1)
  .put(authentication, authorize("Admin"), updateProductV1)
  .delete(authentication, authorize("Admin"), deleteProductV1);

module.exports = router;
