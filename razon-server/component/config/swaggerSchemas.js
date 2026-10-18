// PART 5 / PART 8: Reusable OpenAPI components for swagger.js
// - securitySchemes: how to send the JWT (Bearer token)
// - schemas: request bodies, response bodies and database models
// - responses: common error responses (401, 403, 404, 429)
// Route files reference these with $ref, e.g. '#/components/schemas/LoginRequest'

const objectId = (example = "6a8d82f607c4638c2db680ee") => ({
    type: "string",
    description: "MongoDB ObjectId",
    example,
});

const timestamps = {
    createdAt: { type: "string", format: "date-time", example: "2026-10-08T14:30:00.000Z" },
    updatedAt: { type: "string", format: "date-time", example: "2026-10-08T14:30:00.000Z" },
};

module.exports = {
    // PART 5: JWT authentication (used by every protected endpoint)
    securitySchemes: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Paste the token returned by POST /users/login (without the word Bearer).",
        },
    },

    schemas: {
        // ===================== PART 5: Authentication =====================
        RegisterRequest: {
            type: "object",
            required: ["firstName", "lastName", "phoneNumber", "address", "email", "password"],
            properties: {
                firstName: { type: "string", description: "Letters only", example: "Juan" },
                lastName: { type: "string", description: "Letters only", example: "Santos" },
                phoneNumber: { type: "string", description: "Exactly 11 digits", example: "09171234567" },
                address: { type: "string", example: "Sampaloc, Manila" },
                email: { type: "string", format: "email", example: "juan.santos@students.nu-manila.edu.ph" },
                password: { type: "string", format: "password", minLength: 6, example: "secret123" },
            },
        },
        RegisterResponse: {
            type: "object",
            properties: {
                message: { type: "string", example: "User registered successfully" },
                user: {
                    type: "object",
                    properties: {
                        id: objectId("6a9a0c1f2b3c4d5e6f708192"),
                        firstName: { type: "string", example: "Juan" },
                        lastName: { type: "string", example: "Santos" },
                        email: { type: "string", example: "juan.santos@students.nu-manila.edu.ph" },
                        role: { type: "string", example: "Customer" },
                    },
                },
            },
        },
        LoginRequest: {
            type: "object",
            required: ["email", "password"],
            properties: {
                email: { type: "string", format: "email", example: "juan.santos@students.nu-manila.edu.ph" },
                password: { type: "string", format: "password", example: "secret123" },
            },
        },
        LoginResponse: {
            type: "object",
            properties: {
                message: { type: "string", example: "Login successful" },
                token: {
                    type: "string",
                    description: "JWT valid for 7 days. Contains the user's id, email and role.",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhOWEwYzFmIn0.abc123",
                },
                firstName: { type: "string", example: "Juan" },
                role: { type: "string", enum: ["Customer", "Admin"], example: "Customer" },
            },
        },
        ValidationErrorResponse: {
            type: "object",
            description: "Returned by express-validator when the register body is invalid",
            properties: {
                errors: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            type: { type: "string", example: "field" },
                            value: { type: "string", example: "0917" },
                            msg: { type: "string", example: "Phone number must be 11 digits long" },
                            path: { type: "string", example: "phoneNumber" },
                            location: { type: "string", example: "body" },
                        },
                    },
                },
            },
        },
        ErrorResponse: {
            type: "object",
            properties: {
                message: { type: "string", example: "Invalid credentials." },
            },
        },

        // ===================== PART 8: Common =====================
        MessageResponse: {
            type: "object",
            properties: {
                message: { type: "string", example: "Deleted successfully" },
            },
        },
        SuccessErrorResponse: {
            type: "object",
            description: "Error format used by the v1 product endpoints",
            properties: {
                success: { type: "boolean", example: false },
                message: { type: "string", example: "Product not found." },
            },
        },

        // ===================== PART 8: Users =====================
        User: {
            type: "object",
            properties: {
                _id: objectId("6a9a0c1f2b3c4d5e6f708192"),
                firstName: { type: "string", example: "Juan" },
                lastName: { type: "string", example: "Santos" },
                email: { type: "string", example: "juan.santos@students.nu-manila.edu.ph" },
                phoneNumber: { type: "string", example: "09171234567" },
                role: { type: "string", enum: ["Customer", "Admin"], example: "Customer" },
                address: { type: "string", example: "Sampaloc, Manila" },
                isActive: { type: "boolean", example: true },
                ...timestamps,
            },
        },
        UserCreateRequest: {
            type: "object",
            required: ["firstName", "lastName", "email", "password", "phoneNumber", "address"],
            properties: {
                firstName: { type: "string", example: "Maria" },
                lastName: { type: "string", example: "Santos" },
                email: { type: "string", format: "email", example: "maria.santos@nu-manila.edu.ph" },
                password: { type: "string", format: "password", minLength: 6, example: "admin123" },
                phoneNumber: { type: "string", example: "09181234567" },
                address: { type: "string", example: "Quezon City" },
                role: { type: "string", enum: ["Customer", "Admin"], default: "Customer", example: "Admin" },
                isActive: { type: "boolean", default: true, example: true },
            },
        },
        UserUpdateRequest: {
            type: "object",
            description: "Send only the fields you want to change. A new password is hashed automatically.",
            properties: {
                firstName: { type: "string", example: "Juan" },
                lastName: { type: "string", example: "Santos" },
                phoneNumber: { type: "string", example: "09179876543" },
                address: { type: "string", example: "Manila" },
                password: { type: "string", format: "password", example: "newsecret123" },
            },
        },

        // ===================== PART 8: Categories =====================
        Category: {
            type: "object",
            properties: {
                _id: objectId("6a8d82f607c4638c2db680ee"),
                categoryName: { type: "string", example: "Apparel & Wearables" },
                description: { type: "string", example: "Official NU shirts, hoodies, jackets and caps" },
                ...timestamps,
            },
        },
        CategoryRequest: {
            type: "object",
            required: ["categoryName", "description"],
            properties: {
                categoryName: { type: "string", description: "Must be unique", example: "School Supplies" },
                description: { type: "string", example: "Notebooks, pens and other NU-branded supplies" },
            },
        },

        // ===================== PART 8: Products =====================
        Product: {
            type: "object",
            properties: {
                _id: objectId("6a99122eda0066e3595c10dd"),
                productName: { type: "string", example: "NU Hoodie" },
                description: { type: "string", example: "Warm navy hoodie with the NU Bulldogs logo." },
                price: { type: "number", example: 850 },
                stock: { type: "integer", example: 40 },
                image: {
                    type: "string",
                    description: "Cloudinary secure_url of the product image",
                    example: "https://res.cloudinary.com/v0v1hpbv/image/upload/v1760000000/bulldogs-exchange/products/abc123.webp",
                },
                imagePublicId: {
                    type: "string",
                    description: "Cloudinary public_id (used to replace/delete the image)",
                    example: "bulldogs-exchange/products/abc123",
                },
                categoryId: {
                    oneOf: [
                        objectId(),
                        {
                            type: "object",
                            description: "Populated category (GET requests)",
                            properties: {
                                _id: objectId(),
                                categoryName: { type: "string", example: "Apparel & Wearables" },
                            },
                        },
                    ],
                },
                ...timestamps,
            },
        },
        ProductJsonRequest: {
            type: "object",
            description: "Create/update with JSON (no file). On create, image must be an existing image URL.",
            required: ["productName", "description", "price", "stock", "categoryId", "image"],
            properties: {
                productName: { type: "string", example: "NU Tumbler" },
                description: { type: "string", example: "Insulated stainless tumbler with NU print." },
                price: { type: "number", minimum: 0, example: 450 },
                stock: { type: "integer", minimum: 0, example: 25 },
                categoryId: objectId(),
                image: { type: "string", example: "https://res.cloudinary.com/demo/image/upload/sample.jpg" },
            },
        },
        ProductFormRequest: {
            type: "object",
            description:
                "Create/update with an image file (multipart/form-data). On create the image file is required; " +
                "on update it is optional and replaces the old Cloudinary image.",
            required: ["productName", "description", "price", "stock", "categoryId", "image"],
            properties: {
                productName: { type: "string", example: "NU Tumbler" },
                description: { type: "string", example: "Insulated stainless tumbler with NU print." },
                price: { type: "number", minimum: 0, example: 450 },
                stock: { type: "integer", minimum: 0, example: 25 },
                categoryId: objectId(),
                image: {
                    type: "string",
                    format: "binary",
                    description: "JPEG, PNG or WEBP, maximum 5MB. The real file content is checked.",
                },
            },
        },
        ImageUploadRequest: {
            type: "object",
            required: ["image"],
            properties: {
                image: {
                    type: "string",
                    format: "binary",
                    description: "JPEG, PNG or WEBP, maximum 5MB. Field name must be exactly `image`.",
                },
            },
        },
        ProductListResponse: {
            type: "object",
            properties: {
                success: { type: "boolean", example: true },
                message: { type: "string", example: "Products retrieved successfully." },
                count: { type: "integer", description: "Total products matching the filters", example: 15 },
                page: { type: "integer", example: 1 },
                totalPages: { type: "integer", example: 2 },
                data: { type: "array", items: { $ref: "#/components/schemas/Product" } },
            },
        },
        ProductResponse: {
            type: "object",
            properties: {
                success: { type: "boolean", example: true },
                message: { type: "string", example: "Product retrieved successfully." },
                data: { $ref: "#/components/schemas/Product" },
            },
        },
        ImageUploadResponse: {
            type: "object",
            properties: {
                success: { type: "boolean", example: true },
                message: { type: "string", example: "Product image uploaded successfully." },
                imageUrl: {
                    type: "string",
                    example: "https://res.cloudinary.com/v0v1hpbv/image/upload/v1760000000/bulldogs-exchange/products/abc123.webp",
                },
                publicId: { type: "string", example: "bulldogs-exchange/products/abc123" },
                data: { $ref: "#/components/schemas/Product" },
            },
        },

        // ===================== PART 8: Carts =====================
        CartItem: {
            type: "object",
            required: ["productId", "quantity"],
            properties: {
                productId: objectId("6a99122eda0066e3595c10dd"),
                quantity: { type: "integer", minimum: 1, example: 2 },
            },
        },
        Cart: {
            type: "object",
            properties: {
                _id: objectId("6a9b11aa22bb33cc44dd55ee"),
                userId: objectId("6a9a0c1f2b3c4d5e6f708192"),
                products: { type: "array", items: { $ref: "#/components/schemas/CartItem" } },
                totalPrice: { type: "number", example: 1700 },
                ...timestamps,
            },
        },
        CartRequest: {
            type: "object",
            required: ["userId", "products", "totalPrice"],
            properties: {
                userId: { ...objectId("6a9a0c1f2b3c4d5e6f708192"), description: "Must be your own user id (unless Admin)" },
                products: { type: "array", items: { $ref: "#/components/schemas/CartItem" } },
                totalPrice: { type: "number", minimum: 0, example: 1700 },
            },
        },

        // ===================== PART 8: Orders =====================
        OrderItem: {
            type: "object",
            required: ["productName", "price", "quantity"],
            properties: {
                productName: { type: "string", example: "NU Hoodie" },
                price: { type: "number", minimum: 0, example: 850 },
                quantity: { type: "integer", minimum: 1, example: 2 },
            },
        },
        Order: {
            type: "object",
            properties: {
                _id: objectId("6a9c22bb33cc44dd55ee66ff"),
                userId: objectId("6a9a0c1f2b3c4d5e6f708192"),
                products: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
                totalAmount: { type: "number", example: 1700 },
                shippingAddress: { type: "string", example: "NU Manila, Sampaloc" },
                paymentMethod: { type: "string", enum: ["Cash on Delivery", "GCash", "Credit Card"], example: "GCash" },
                orderStatus: {
                    type: "string",
                    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
                    example: "Pending",
                },
                orderDate: { type: "string", format: "date-time", example: "2026-10-08T14:30:00.000Z" },
                ...timestamps,
            },
        },
        OrderRequest: {
            type: "object",
            required: ["userId", "products", "totalAmount", "shippingAddress", "paymentMethod"],
            properties: {
                userId: { ...objectId("6a9a0c1f2b3c4d5e6f708192"), description: "Must be your own user id (unless Admin)" },
                products: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
                totalAmount: { type: "number", minimum: 0, example: 1700 },
                shippingAddress: { type: "string", example: "NU Manila, Sampaloc" },
                paymentMethod: { type: "string", enum: ["Cash on Delivery", "GCash", "Credit Card"], example: "GCash" },
            },
        },
        OrderStatusRequest: {
            type: "object",
            properties: {
                orderStatus: {
                    type: "string",
                    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
                    example: "Processing",
                },
            },
        },

        // ===================== PART 8: Reviews =====================
        Review: {
            type: "object",
            properties: {
                _id: objectId("6a9d33cc44dd55ee66ff7700"),
                userId: objectId("6a9a0c1f2b3c4d5e6f708192"),
                productId: objectId("6a99122eda0066e3595c10dd"),
                rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
                comment: { type: "string", example: "Great quality, fits perfectly!" },
                reviewDate: { type: "string", format: "date-time", example: "2026-10-08T14:30:00.000Z" },
                ...timestamps,
            },
        },
        ReviewRequest: {
            type: "object",
            required: ["userId", "productId", "rating", "comment"],
            properties: {
                userId: { ...objectId("6a9a0c1f2b3c4d5e6f708192"), description: "Must be your own user id" },
                productId: objectId("6a99122eda0066e3595c10dd"),
                rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
                comment: { type: "string", example: "Great quality, fits perfectly!" },
            },
        },
        ReviewUpdateRequest: {
            type: "object",
            properties: {
                rating: { type: "integer", minimum: 1, maximum: 5, example: 4 },
                comment: { type: "string", example: "Edited by admin: removed inappropriate words." },
            },
        },

        // ===================== PART 8: Suppliers =====================
        Supplier: {
            type: "object",
            properties: {
                _id: objectId("6a9e44dd55ee66ff77001122"),
                supplierName: { type: "string", example: "Manila Shirt Printing Co." },
                contactPerson: { type: "string", example: "Ana Lopez" },
                email: { type: "string", example: "orders@manilashirtprint.ph" },
                phoneNumber: { type: "string", example: "09201234567" },
                address: { type: "string", example: "Divisoria, Manila" },
                categoryIds: {
                    type: "array",
                    description: "Categories this supplier provides (populated on GET)",
                    items: {
                        type: "object",
                        properties: {
                            _id: objectId(),
                            categoryName: { type: "string", example: "Apparel & Wearables" },
                        },
                    },
                },
                isActive: { type: "boolean", example: true },
                ...timestamps,
            },
        },
        SupplierRequest: {
            type: "object",
            required: ["supplierName", "contactPerson", "email", "phoneNumber", "address"],
            properties: {
                supplierName: { type: "string", description: "Must be unique", example: "Manila Shirt Printing Co." },
                contactPerson: { type: "string", example: "Ana Lopez" },
                email: { type: "string", format: "email", example: "orders@manilashirtprint.ph" },
                phoneNumber: { type: "string", description: "Exactly 11 digits", example: "09201234567" },
                address: { type: "string", example: "Divisoria, Manila" },
                categoryIds: { type: "array", items: objectId() },
                isActive: { type: "boolean", default: true, example: true },
            },
        },
        SupplierUpdateRequest: {
            type: "object",
            description: "Send only the fields you want to change.",
            properties: {
                contactPerson: { type: "string", example: "Ben Cruz" },
                phoneNumber: { type: "string", example: "09209876543" },
                isActive: { type: "boolean", example: false },
            },
        },
    },

    // PART 8: common error responses
    responses: {
        Unauthorized: {
            description: "Missing, invalid or expired token",
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                    example: { message: "Invalid or expired token" },
                },
            },
        },
        Forbidden: {
            description: "Logged in, but your role is not allowed to do this",
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                    example: { message: "Access denied" },
                },
            },
        },
        TooManyRequests: {
            description: "Too many login attempts",
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                    example: { message: "Too many failed login attempts. Please try again after 3 minute(s)." },
                },
            },
        },
    },

    // PART 8: reusable path parameter
    parameters: {
        IdParam: {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId of the record",
            schema: { type: "string", example: "6a99122eda0066e3595c10dd" },
        },
    },
};