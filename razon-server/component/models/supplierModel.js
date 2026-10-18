// PART 8: Supplier model
// Suppliers are the vendors/partners that provide Bulldogs Exchange merchandise
// (e.g. the shirt printer, the tumbler manufacturer). Managed by Admins only.
const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    supplierName: {
      type: String,
      required: [true, "Supplier name is required"],
      unique: true,
      trim: true,
    },

    contactPerson: {
      type: String,
      required: [true, "Contact person is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\d{11}$/, "Phone number must be exactly 11 digits"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    // Categories of products this supplier provides (optional)
    categoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Supplier", supplierSchema);