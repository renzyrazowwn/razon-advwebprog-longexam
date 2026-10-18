const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
    },

    // holds the Cloudinary secure_url of the uploaded product image
    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
    },

    imagePublicId: {
      type: String,
      default: "",
      trim: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ productName: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model("Product", productSchema);