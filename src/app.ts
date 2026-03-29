import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

import morgan from "morgan";
import getHelmetConfig from "./api/v1/middleware/helmet";
import cors from "cors";
import healthRoutes from "./api/v1/routes/healthRoutes"
import eventRoutes from "./api/v1/routes/eventRoutes"
import getCorsOptions from "./api/v1/middleware/cors";
import setupSwagger from "../config/swagger";

// import setupSwagger from "../config/swagger";
// import itemRoutes from "./api/v1/routes/itemRoutes";
// import userRoutes from "./api/v1/routes/userRoutes";
// import adminRoutes from "./api/v1/routes/adminRoutes";
// import errorHandler from "./api/v1/middleware/errorHandler";


// Initialize Express application
const app: Express = express();

// Enable CORS for all routes
app.use(cors(getCorsOptions()));

// helmet for security
app.use(getHelmetConfig());

app.use(express.json());

// Use Morgan for HTTP request logging
app.use(morgan("combined"));

// Define a route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});


// router handler
// router defined in health routes, prefixed with /api/v1
app.use("/api/v1", healthRoutes);
app.use("/api/v1", eventRoutes);
// Initialize Swagger
setupSwagger(app);

export default app;