const express = require("express");

const authentication = require("../middleware/authentication");
const authorize = require("../middleware/authorization");

const upload = require("../middleware/uploadImageMiddleware.js");
const { validateImageFile } = require("../middleware/uploadImageMiddleware.js");

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} = require("../controllers/productController");

const router = express.Router();

router.route("/")
  .get(getProducts)
  .post(authentication, authorize("Admin"), upload.single("image"), validateImageFile, createProduct);

router.route("/:id")
  .put(authentication, authorize("Admin"), upload.single("image"), validateImageFile, updateProduct)
  .delete(authentication, authorize("Admin"), deleteProduct);

router.post(
  "/:id/upload-image",
  authentication,
  authorize("Admin"),
  upload.single("image"),
  validateImageFile,
  uploadProductImage
);

module.exports = router;