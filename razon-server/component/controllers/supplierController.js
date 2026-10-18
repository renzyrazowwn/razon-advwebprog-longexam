// PART 8: Supplier controller (CRUD)
const { HttpStatus } = require('../config/constants');

const Supplier = require("../models/supplierModel");

// Duplicate supplierName gives MongoDB error code 11000; show a friendly message instead
const getErrorMessage = (error) => {
  if (error.code === 11000) return "A supplier with this name already exists.";
  return error.message;
};

const getSuppliers = async (req, res) => {
  try {
    // Optional filters: ?search=printing&isActive=true
    const filter = {};

    if (req.query.search) {
      filter.$or = [
        { supplierName: { $regex: req.query.search, $options: "i" } },
        { contactPerson: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true";
    }

    const suppliers = await Supplier.find(filter)
      .sort({ supplierName: 1 })
      .populate("categoryIds", "categoryName");

    res.status(HttpStatus.OK).json({ suppliers });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate("categoryIds", "categoryName");

    if (!supplier) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Supplier not found",
      });
    }

    res.status(HttpStatus.OK).json({ supplier });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(HttpStatus.CREATED).json(supplier);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: getErrorMessage(error) });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!supplier) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Supplier not found",
      });
    }

    res.status(HttpStatus.OK).json(supplier);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: getErrorMessage(error) });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Supplier not found",
      });
    }

    res.status(HttpStatus.OK).json({
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

module.exports = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};