const { HttpStatus } = require('../config/constants');

const Cart = require("../models/cartModel");

const getCarts = async (req, res) => {
  try {
    // Customers only ever need to see their own cart; Admins can see all.
    const filter = req.user.role === "Admin" ? {} : { userId: req.user.id };

    const carts = await Cart.find(filter)
      .populate("userId", "firstName lastName email")
      .populate("products.productId", "productName price");

    res.status(HttpStatus.OK).json({ carts });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const createCart = async (req, res) => {
  try {

    // A user can only ever create a cart for themselves.
    if (req.user.role !== "Admin" && req.body.userId !== req.user.id) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "You can only create a cart for your own account.",
      });
    }

    const cart = await Cart.create(req.body);
    res.status(HttpStatus.CREATED).json(cart);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const updateCart = async (req, res) => {
  try {

    const existingCart = await Cart.findById(req.params.id);

    if (!existingCart) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Cart not found",
      });
    }

    // Only the cart's owner (or an Admin) may modify it.
    if (
      req.user.role !== "Admin" &&
      existingCart.userId.toString() !== req.user.id
    ) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "You are not allowed to modify another user's cart.",
      });
    }

    const cart = await Cart.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(HttpStatus.OK).json(cart);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {

    const existingCart = await Cart.findById(req.params.id);

    if (!existingCart) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Cart not found",
      });
    }

    // Only the cart's owner (or an Admin) may delete it.
    if (
      req.user.role !== "Admin" &&
      existingCart.userId.toString() !== req.user.id
    ) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "You are not allowed to delete another user's cart.",
      });
    }

    await Cart.findByIdAndDelete(req.params.id);

    res.status(HttpStatus.OK).json({
      message: "Cart deleted successfully",
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

module.exports = {
  getCarts,
  createCart,
  updateCart,
  deleteCart,
};
