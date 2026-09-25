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
router.route("/")
  .get(authentication, getCarts)
  .post(authentication, createCart);

router.route("/:id")
  .put(authentication, updateCart)
  .delete(authentication, deleteCart);

module.exports = router;
