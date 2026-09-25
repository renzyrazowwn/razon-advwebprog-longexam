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
router.route("/")
  .get(authentication, getOrders)
  .post(authentication, createOrder);

router.route("/:id")
  .put(authentication, authorize("Admin"), updateOrder)
  .delete(authentication, authorize("Admin"), deleteOrder);

module.exports = router;
