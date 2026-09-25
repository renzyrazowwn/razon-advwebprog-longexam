const { HttpStatus } = require('../config/constants');

const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

const buildProductFilter = async (query) => {
  const filter = {};

  if (query.category) {
    const category = await Category.findOne({
      categoryName: { $regex: `^${query.category}$`, $options: "i" },
    });

    filter.categoryId = category ? category._id : null;
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.search) {
    filter.$or = [
      { productName: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  return filter;
};

const buildProductSort = (sortQuery) => {
  if (!sortQuery) return { createdAt: -1 };

  const sortObj = {};
  sortQuery.split(",").forEach((field) => {
    const trimmed = field.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("-")) {
      sortObj[trimmed.substring(1)] = -1;
    } else {
      sortObj[trimmed] = 1;
    }
  });

  return Object.keys(sortObj).length ? sortObj : { createdAt: -1 };
};

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = await buildProductFilter(req.query);
    const sort = buildProductSort(req.query.sort);

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("categoryId", "categoryName");

    res.status(HttpStatus.OK).json({ products });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(HttpStatus.CREATED).json(product);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Product not found",
      });
    }

    res.status(HttpStatus.OK).json(product);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Product not found",
      });
    }

    res.status(HttpStatus.OK).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const getProductsV1 = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = await buildProductFilter(req.query);
    const sort = buildProductSort(req.query.sort);

    const [products, count] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("categoryId", "categoryName"),
      Product.countDocuments(filter),
    ]);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Products retrieved successfully.",
      count,
      page,
      totalPages: Math.max(Math.ceil(count / limit), 1),
      data: products,
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
      data: [],
    });
  }
};

const getProductByIdV1 = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryId",
      "categoryName"
    );

    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Product not found.",
        data: null,
      });
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Product retrieved successfully.",
      data: product,
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const createProductV1 = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const updateProductV1 = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Product not found.",
        data: null,
      });
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const deleteProductV1 = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Product not found.",
        data: null,
      });
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Product deleted successfully.",
      data: product,
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsV1,
  getProductByIdV1,
  createProductV1,
  updateProductV1,
  deleteProductV1,
};
