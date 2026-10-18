// PART 3: Swagger (OpenAPI) configuration
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { PORT } = require("./config");
// PART 5 / PART 8: reusable schemas (request bodies, responses, models)
const swaggerComponents = require("./swaggerSchemas");

const options = {
    definition: {
        openapi: "3.0.0",
        // PART 3: API Title, Version and Description
        info: {
            title: "Bulldogs Exchange API",
            version: "1.0.0",
            description:
                "REST API of **Bulldogs Exchange (BulldogEx Shop)**, the National University campus " +
                "marketplace. It manages users and authentication, product categories, products " +
                "(with Cloudinary image uploads), carts, orders, reviews and suppliers.\n\n" +
                "**How to authorize:** call `POST /users/login`, copy the `token` from the response, " +
                "click the **Authorize** button and paste the token. Endpoints with a lock icon need it.\n\n" +
                "**Roles:** `Customer` (default for self-registration) and `Admin`.",
        },
        // PART 3: Server URL (all paths below are relative to this)
        servers: [
            {
                url: `http://localhost:${PORT}/api/v1`,
                description: "Local development server (v1)",
            },
        ],
        // PART 8: groups shown in Swagger UI
        tags: [
            { name: "Authentication", description: "Register and log in (public)" },
            { name: "Users", description: "User accounts (protected)" },
            { name: "Categories", description: "Product categories" },
            { name: "Products", description: "Products and product images (Cloudinary)" },
            { name: "Suppliers", description: "Merchandise suppliers (Admin only)" },
            { name: "Carts", description: "Shopping carts (owner or Admin)" },
            { name: "Orders", description: "Customer orders" },
            { name: "Reviews", description: "Product reviews" },
        ],
        components: swaggerComponents,
    },
    // PART 3: path to the route files that contain the @swagger comments
    // (path.join keeps it working no matter which folder the server is started from)
    apis: [path.join(__dirname, "../routes/*.js").replace(/\\/g, "/")],
};

const swaggerSpec = swaggerJsdoc(options);

// PART 3 / PART 4: mounts Swagger UI on /api-docs and the raw JSON on /api-docs.json
function swaggerDocs(app, port) {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            customSiteTitle: "Bulldogs Exchange API Docs",
            swaggerOptions: {
                persistAuthorization: true, // keep the pasted token after a page refresh
            },
        })
    );

    app.get("/api-docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
}

module.exports = { swaggerDocs, swaggerSpec };