const express = require("express");

const authentication = require("../middleware/authentication");
const authorize = require("../middleware/authorization");

const upload = require("../middleware/uploadImageMiddleware.js");
const { validateImageFile } = require("../middleware/uploadImageMiddleware.js");

const {
  getProductsV1,
  getProductByIdV1,
  createProductV1,
  updateProductV1,
  deleteProductV1,
  uploadProductImage,
} = require("../controllers/productController");

const router = express.Router();

// PART 8: Products documentation (v1)
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get products (search, filter, sort, paginate)
 *     description: Public. Category is populated with its name.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Matches the product name or description (case-insensitive)
 *         example: hoodie
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category name (exact, case-insensitive)
 *         example: Apparel & Wearables
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         example: 100
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         example: 1000
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Comma-separated fields, prefix with - for descending (default -createdAt)
 *         example: -price,productName
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Products retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessErrorResponse'
 *   post:
 *     summary: Create a product (Admin only)
 *     description: >
 *       Send **multipart/form-data** with an `image` file (uploaded to Cloudinary folder
 *       bulldogs-exchange/products), or **JSON** with an existing image URL.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductFormRequest'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductJsonRequest'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *             example:
 *               success: true
 *               message: Product created successfully.
 *               data:
 *                 _id: 6a99122eda0066e3595c10dd
 *                 productName: NU Tumbler
 *                 price: 450
 *                 stock: 25
 *                 image: https://res.cloudinary.com/v0v1hpbv/image/upload/bulldogs-exchange/products/abc123.webp
 *                 imagePublicId: bulldogs-exchange/products/abc123
 *       400:
 *         description: Missing image, invalid image file, file too large, or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessErrorResponse'
 *             examples:
 *               noImage:
 *                 value:
 *                   success: false
 *                   message: Product image is required. Please upload a JPEG, PNG, or WEBP image.
 *               tooLarge:
 *                 value:
 *                   success: false
 *                   message: Image is too large. Maximum file size is 5MB.
 *               fakeImage:
 *                 value:
 *                   success: false
 *                   message: Invalid image file. The file content is not a real JPEG, PNG, or WEBP image.
 *               invalidType:
 *                 value:
 *                   success: false
 *                   message: Invalid image type. Only JPEG, PNG, and WEBP images are allowed.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.route("/")
  .get(getProductsV1)
  .post(authentication, authorize("Admin"), upload.single("image"), validateImageFile, createProductV1);

// PART 8: Products by id (v1)
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by id
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Invalid id format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessErrorResponse'
 *             example:
 *               success: false
 *               message: Product not found.
 *               data: null
 *   put:
 *     summary: Update a product (Admin only)
 *     description: >
 *       Send only the fields to change. Attach a new `image` file (multipart/form-data) to replace
 *       the current image; the old image is deleted from Cloudinary.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductFormRequest'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductJsonRequest'
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Invalid image or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessErrorResponse'
 *   delete:
 *     summary: Delete a product (Admin only)
 *     description: Also deletes the product's image from Cloudinary.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Product deleted (returns the deleted product)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *             example:
 *               success: true
 *               message: Product deleted successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessErrorResponse'
 */
router.route("/:id")
  .get(getProductByIdV1)
  .put(authentication, authorize("Admin"), upload.single("image"), validateImageFile, updateProductV1)
  .delete(authentication, authorize("Admin"), deleteProductV1);

// PART 8: Product image upload (from Activity 6)
/**
 * @swagger
 * /products/{id}/upload-image:
 *   post:
 *     summary: Upload or replace a product image (Admin only)
 *     description: >
 *       Uploads the image to Cloudinary (folder bulldogs-exchange/products), saves the URL on the
 *       product and deletes the previous Cloudinary image. Accepts JPEG, PNG or WEBP up to 5MB;
 *       files whose content is not a real image are rejected.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ImageUploadRequest'
 *     responses:
 *       200:
 *         description: Image uploaded and linked to the product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageUploadResponse'
 *       400:
 *         description: No file, wrong field name, invalid type, fake image, or file larger than 5MB
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessErrorResponse'
 *             examples:
 *               noFile:
 *                 value:
 *                   success: false
 *                   message: No image uploaded. Send a JPEG, PNG, or WEBP file in the "image" field.
 *               wrongField:
 *                 value:
 *                   success: false
 *                   message: Unexpected file field "photo". Use "image" as the file field name.
 *               tooLarge:
 *                 value:
 *                   success: false
 *                   message: Image is too large. Maximum file size is 5MB.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessErrorResponse'
 *             example:
 *               success: false
 *               message: Product not found.
 */
router.post(
  "/:id/upload-image",
  authentication,
  authorize("Admin"),
  upload.single("image"),
  validateImageFile,
  uploadProductImage
);

module.exports = router;