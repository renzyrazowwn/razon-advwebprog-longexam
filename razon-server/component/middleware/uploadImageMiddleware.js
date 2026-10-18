const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// accepted image types = JPEG, PNG, WEBP; limit = 5MB, 1 file
const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
        files: 1 // PART 7: only one image per request
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ALLOWED_MIME_TYPES;

        // PART 7: check the file extension too, not just the mimetype
        const extension = path.extname(file.originalname || "").toLowerCase();

        if (allowedTypes.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(extension)) {
            cb(null, true);
        } else {
            // PART 7: tagged error so the error handler can return a 400
            const error = new Error("Only image files are allowed.");
            error.code = "INVALID_FILE_TYPE";
            cb(error);
        }
    }
});

const detectImageType = (buffer) => {
    if (!buffer || buffer.length < 12) return null;

    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return "image/jpeg";
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    if (pngSignature.every((byte, i) => buffer[i] === byte)) {
        return "image/png";
    }

    if (
        buffer.toString("ascii", 0, 4) === "RIFF" &&
        buffer.toString("ascii", 8, 12) === "WEBP"
    ) {
        return "image/webp";
    }

    return null;
};

const validateImageFile = (req, res, next) => {
    if (!req.file) return next();

    const detectedType = detectImageType(req.file.buffer);

    if (!detectedType) {
        return res.status(400).json({
            success: false,
            message: "Invalid image file. The file content is not a real JPEG, PNG, or WEBP image."
        });
    }

    if (detectedType !== req.file.mimetype) {
        return res.status(400).json({
            success: false,
            message: `Invalid image file. The file claims to be ${req.file.mimetype} but its content is ${detectedType}.`
        });
    }

    next();
};

const imageUploadErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        let message = err.message;

        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                message = `Image is too large. Maximum file size is ${MAX_FILE_SIZE_MB}MB.`;
                break;
            case "LIMIT_FILE_COUNT":
                message = "Only one image can be uploaded at a time.";
                break;
            case "LIMIT_UNEXPECTED_FILE":
                message = `Unexpected file field "${err.field}". Use "image" as the file field name.`;
                break;
            default:
                break;
        }

        return res.status(400).json({ success: false, message });
    }

    if (err && err.code === "INVALID_FILE_TYPE") {
        return res.status(400).json({
            success: false,
            message: "Invalid image type. Only JPEG, PNG, and WEBP images are allowed."
        });
    }

    // Not an upload error, pass it to the global error handler
    return next(err);
};

module.exports = upload;

module.exports.validateImageFile = validateImageFile;
module.exports.imageUploadErrorHandler = imageUploadErrorHandler;
module.exports.MAX_FILE_SIZE_MB = MAX_FILE_SIZE_MB;