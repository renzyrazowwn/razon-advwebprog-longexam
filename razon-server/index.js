const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const { PORT } = require("./component/config/config");
const connectDB = require("./component/config/db");
const userRoutes = require("./component/routes/userRoutes");
const categoryRoutes = require("./component/routes/categoryRoutes");
const productRoutes = require("./component/routes/productRoutes");
const productRoutesV1 = require("./component/routes/productRoutesV1");
const cartRoutes = require("./component/routes/cartRoutes");
const orderRoutes = require("./component/routes/orderRoutes");
const reviewRoutes = require("./component/routes/reviewRoutes");
const { auditLoggerMiddleware } = require("./component/middleware/auditLoggerMiddleware");
const app = express();

connectDB();

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (
            origin.startsWith("http://localhost:") || 
            origin.endsWith(".vercel.app")
        ) {
            callback(null, true);
        } else {
            callback(new Error("Blocked by CORS policy"));
        }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Origin", "Accept"],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 204, 
};
app.options(/.*/, cors(corsOptions));
app.use(cors(corsOptions));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  frameguard: { action: "sameorigin" },
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin"
  },
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(auditLoggerMiddleware);
// Base routes (Parts 1-6)
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutesV1);
app.use("/api/v1/carts", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use((err, req, res, next) => {
    console.error("SERVER ERROR LOG:", err.stack);

    res.header("Access-Control-Allow-Credentials", "true");
    if (req.headers.origin && (req.headers.origin.startsWith("http://localhost:") || req.headers.origin.endsWith(".vercel.app"))) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
    }
    
    res.status(500).json({ 
        error: "Internal Server Error",
        message: err.message || "Something went wrong on the server." 
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));