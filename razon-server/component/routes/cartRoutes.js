const express = require("express");

const authentication = require("../middleware/authentication");

const {
  getCarts,
  createCart,
  updateCart,
  deleteCart,
} = require("../controllers/cartController");

const router = express.Router();

// Every cart action requires being logged in; ownership (your cart vs.
// someone else's) is enforced inside the controller.
// PART 8: Carts documentation
/**
 * @swagger
 * /carts:
 *   get:
 *     summary: Get carts
 *     description: Customers get only their own cart(s). Admins get all carts.
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of carts (user and products are populated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 carts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cart'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Create a cart
 *     description: A Customer can only create a cart for their own user id.
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartRequest'
 *     responses:
 *       201:
 *         description: Cart created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Validation error (e.g. quantity below 1)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: userId is not your own
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: You can only create a cart for your own account.
 */
router.route("/")
  .get(authentication, getCarts)
  .post(authentication, createCart);

// PART 8: Carts by id
/**
 * @swagger
 * /carts/{id}:
 *   put:
 *     summary: Update a cart (owner or Admin)
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartRequest'
 *     responses:
 *       200:
 *         description: Cart updated (returns the updated cart)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid id or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Not your cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: You are not allowed to modify another user's cart.
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Cart not found
 *   delete:
 *     summary: Delete a cart (owner or Admin)
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Cart deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: Cart deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Not your cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: You are not allowed to delete another user's cart.
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/:id")
  .put(authentication, updateCart)
  .delete(authentication, deleteCart);

module.exports = router;