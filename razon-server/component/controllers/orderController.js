const { HttpStatus } = require('../config/constants');

const Order = require("../models/orderModel");

const getOrders = async (req, res) => {
  try {
    // Customers only ever need to see their own orders; Admins see all
    // (needed for the Admin Orders dashboard).
    const filter = req.user.role === "Admin" ? {} : { userId: req.user.id };

    const orders = await Order.find(filter)
      .populate("userId", "firstName lastName email");

    res.status(HttpStatus.OK).json({ orders });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {

    // A user can only ever place an order for themselves.
    if (req.user.role !== "Admin" && req.body.userId !== req.user.id) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "You can only place an order for your own account.",
      });
    }

    const order = await Order.create(req.body);
    res.status(HttpStatus.CREATED).json(order);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    // Order status (confirm / ready for claiming / delivered / cancelled)
    // is managed by staff, not the customer who placed it.
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Order not found",
      });
    }

    res.status(HttpStatus.OK).json(order);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Order not found",
      });
    }

    res.status(HttpStatus.OK).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
};
