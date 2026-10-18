const { HttpStatus } = require('../config/constants');

const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

const cloudinary = require("../config/cloudinary");

const PRODUCT_IMAGE_FOLDER = "bulldogs-exchange/products";

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: PRODUCT_IMAGE_FOLDER,
        resource_type: "image", // PART 7: Cloudinary also rejects non-images
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );

    stream.end(buffer);
  });

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (error) {
    console.error(`Cloudinary cleanup failed for ${publicId}:`, error.message);
  }
};

class ProductRequestError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const getProductData = (body = {}) => {
  const data = { ...body };
  delete data.imagePublicId;
  return data;
};

const createProductWithImage = async (req) => {
  const data = getProductData(req.body);

  if (!req.file && !data.image) {
    throw new ProductRequestError(400, "Product image is required. Please upload a JPEG, PNG, or WEBP image.");
  }

  let uploaded = null;
  if (req.file) {
    uploaded = await uploadToCloudinary(req.file.buffer);
    data.image = uploaded.secure_url;
    data.imagePublicId = uploaded.public_id;
  }

  try {
    return await Product.create(data);
  } catch (error) {
    // Product failed validation, so remove the image we just uploaded
    if (uploaded) await deleteFromCloudinary(uploaded.public_id);
    throw new ProductRequestError(400, error.message);
  }
};

const updateProductWithImage = async (req) => {
  const existing = await Product.findById(req.params.id);

  if (!existing) {
    throw new ProductRequestError(404, "Product not found.");
  }

  const oldPublicId = existing.imagePublicId; // remember the current Cloudinary image
  const data = getProductData(req.body);
  let uploaded = null;

  if (req.file) {
    uploaded = await uploadToCloudinary(req.file.buffer);
    data.image = uploaded.secure_url;
    data.imagePublicId = uploaded.public_id;
  } else if (data.image && data.image !== existing.image) {
    // Image was changed to a plain URL, so it no longer points to our Cloudinary file
    data.imagePublicId = "";
  } else {
    // No new image, keep the current one
    delete data.image;
  }

  let product;
  try {
    product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    if (uploaded) await deleteFromCloudinary(uploaded.public_id);
    throw new ProductRequestError(400, error.message);
  }

  // Remove the replaced image from Cloudinary
  if (oldPublicId && oldPublicId !== product.imagePublicId) {
    await deleteFromCloudinary(oldPublicId);
  }

  return product;
};

const getErrorStatus = (error) => {
  if (error.statusCode) return error.statusCode;
  if (error.name === "CastError") return HttpStatus.BAD_REQUEST; // invalid product id
  return HttpStatus.INTERNAL_SERVER_ERROR; // e.g. Cloudinary upload failed
};

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
    // PART 7: create with the uploaded image (if any)
    const product = await createProductWithImage(req);
    res.status(HttpStatus.CREATED).json(product);
  } catch (error) {
    res.status(getErrorStatus(error)).json({ message: error.message }); // PART 7
  }
};

const updateProduct = async (req, res) => {
  try {
    // PART 7: update + replace the image (if a new one was uploaded)
    const product = await updateProductWithImage(req);
    res.status(HttpStatus.OK).json(product);
  } catch (error) {
    res.status(getErrorStatus(error)).json({ message: error.message }); // PART 7
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

    // PART 7: also delete the product's image from Cloudinary
    await deleteFromCloudinary(product.imagePublicId);

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
    // PART 7: create with the uploaded image (if any)
    const product = await createProductWithImage(req);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    res.status(getErrorStatus(error)).json({ // PART 7
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const updateProductV1 = async (req, res) => {
  try {
    // PART 7: update + replace the image (if a new one was uploaded)
    const product = await updateProductWithImage(req);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    res.status(getErrorStatus(error)).json({ // PART 7
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

    // PART 7: also delete the product's image from Cloudinary
    await deleteFromCloudinary(product.imagePublicId);

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

const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'No image uploaded. Send a JPEG, PNG, or WEBP file in the "image" field.',
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Product not found.",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const oldPublicId = product.imagePublicId;
    product.image = result.secure_url;
    product.imagePublicId = result.public_id;
    await product.save();

    if (oldPublicId && oldPublicId !== result.public_id) {
      await deleteFromCloudinary(oldPublicId);
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Product image uploaded successfully.",
      imageUrl: result.secure_url,
      publicId: result.public_id,
      data: product,
    });
  } catch (error) {
    res.status(getErrorStatus(error)).json({
      success: false,
      message: error.message,
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
  uploadProductImage,
};