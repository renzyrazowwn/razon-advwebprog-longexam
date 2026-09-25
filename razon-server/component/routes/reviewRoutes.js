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
router.route("/")
  .get(getReviews)
  .post(authentication, createReview);

router.route("/:id")
  .put(authentication, authorize("Admin"), updateReview)
  .delete(authentication, authorize("Admin"), deleteReview);

module.exports = router;
