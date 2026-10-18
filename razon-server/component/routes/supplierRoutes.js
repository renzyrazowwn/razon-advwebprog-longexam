// PART 8: Supplier routes (Admin only - supplier details are internal business data)
const express = require("express");

const authentication = require("../middleware/authentication");
const authorize = require("../middleware/authorization");

const {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

const router = express.Router();

// PART 8: Suppliers documentation
/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Get all suppliers (Admin only)
 *     description: Sorted by supplier name. Categories are populated with their names.
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Matches supplier name or contact person (case-insensitive)
 *         example: print
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Only active (true) or inactive (false) suppliers
 *     responses:
 *       200:
 *         description: List of suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suppliers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Supplier'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *   post:
 *     summary: Create a supplier (Admin only)
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SupplierRequest'
 *     responses:
 *       201:
 *         description: Supplier created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Missing/invalid fields or duplicate supplier name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               duplicate:
 *                 summary: Name already used
 *                 value:
 *                   message: A supplier with this name already exists.
 *               invalidPhone:
 *                 summary: Invalid phone number
 *                 value:
 *                   message: "Supplier validation failed: phoneNumber: Phone number must be exactly 11 digits"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.route("/")
  .get(authentication, authorize("Admin"), getSuppliers)
  .post(authentication, authorize("Admin"), createSupplier);

// PART 8: Suppliers by id
/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: Get a supplier by id (Admin only)
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Supplier found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 supplier:
 *                   $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Invalid id format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Supplier not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Supplier not found
 *   put:
 *     summary: Update a supplier (Admin only)
 *     description: Send only the fields you want to change.
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SupplierUpdateRequest'
 *     responses:
 *       200:
 *         description: Supplier updated (returns the updated supplier)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Invalid id, validation error or duplicate name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Supplier not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Supplier not found
 *   delete:
 *     summary: Delete a supplier (Admin only)
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Supplier deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: Supplier deleted successfully
 *       400:
 *         description: Invalid id format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Supplier not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/:id")
  .get(authentication, authorize("Admin"), getSupplierById)
  .put(authentication, authorize("Admin"), updateSupplier)
  .delete(authentication, authorize("Admin"), deleteSupplier);

module.exports = router;