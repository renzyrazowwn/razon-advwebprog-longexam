const express = require("express");

const authentication = require("../middleware/authentication");
const authorize = require("../middleware/authorization");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

// Browsing categories is public (needed for the product filter dropdown).
router.route("/")
  .get(getCategories)
  .post(authentication, authorize("Admin"), createCategory);

router.route("/:id")
  .put(authentication, authorize("Admin"), updateCategory)
  .delete(authentication, authorize("Admin"), deleteCategory);

module.exports = router;
