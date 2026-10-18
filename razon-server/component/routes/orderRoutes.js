const express = require("express");

const authentication = require("../middleware/authentication");
const authorize = require("../middleware/authorization");

const {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const router = express.Router();

// Viewing/placing an order just requires being logged in; ownership
// (your orders vs. everyone's) is enforced inside the controller.
// Changing status or deleting an order is staff-only (Admin).
// PART 8: Orders documentation
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get orders
 *     description: Customers get only their own orders. Admins get all orders.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders (user is populated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Place an order
 *     description: A Customer can only place an order for their own user id. Status starts as Pending.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderRequest'
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error (e.g. invalid payment method)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Order validation failed: paymentMethod: `PayPal` is not a valid enum value for path `paymentMethod`."
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: userId is not your own
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: You can only place an order for your own account.
 */
router.route("/")
  .get(authentication, getOrders)
  .post(authentication, createOrder);

// PART 8: Orders by id
/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an order / change its status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderStatusRequest'
 *     responses:
 *       200:
 *         description: Order updated (returns the updated order)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid id or invalid status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Order not found
 *   delete:
 *     summary: Delete an order (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Order deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: Order deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/:id")
  .put(authentication, authorize("Admin"), updateOrder)
  .delete(authentication, authorize("Admin"), deleteOrder);

module.exports = router;