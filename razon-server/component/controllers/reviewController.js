const { HttpStatus } = require('../config/constants');

const Review = require("../models/reviewModel");

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "firstName lastName")
      .populate("productId", "productName");

    res.status(HttpStatus.OK).json({ reviews });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {

    // A user can only ever post a review as themselves.
    if (req.body.userId !== req.user.id) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "You can only post a review under your own account.",
      });
    }

    const review = await Review.create(req.body);
    res.status(HttpStatus.CREATED).json(review);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Review not found",
      });
    }

    res.status(HttpStatus.OK).json(review);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Review not found",
      });
    }

    res.status(HttpStatus.OK).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};
