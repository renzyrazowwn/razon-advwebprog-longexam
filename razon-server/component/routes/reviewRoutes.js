const express = require("express");

const authentication = require("../middleware/authentication");
const authorize = require("../middleware/authorization");

const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

// Reading reviews is public (shown on the product page to everyone).
// Posting a review requires being logged in, as yourself (checked in
// the controller). Editing/deleting any review is Admin-only.
// PART 8: Reviews documentation
/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     description: Public. User (first/last name) and product (name) are populated.
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *   post:
 *     summary: Post a review
 *     description: Any logged-in user, but userId must be your own.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewRequest'
 *     responses:
 *       201:
 *         description: Review created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Validation error (e.g. rating outside 1-5)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Review validation failed: rating: Rating cannot exceed 5"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: userId is not your own
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: You can only post a review under your own account.
 */
router.route("/")
  .get(getReviews)
  .post(authentication, createReview);

// PART 8: Reviews by id
/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Edit a review (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewUpdateRequest'
 *     responses:
 *       200:
 *         description: Review updated (returns the updated review)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid id or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Review not found
 *   delete:
 *     summary: Delete a review (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Review deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: Review deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/:id")
  .put(authentication, authorize("Admin"), updateReview)
  .delete(authentication, authorize("Admin"), deleteReview);

module.exports = router;