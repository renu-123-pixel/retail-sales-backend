// app.use('/api/sales', salesRoutes);

// backend/src/server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import salesRoutes from "./routes/salesRoutes.js"; // your router file
import validateSalesQuery from "./middlewares/validateQuery.js"; // optional but recommended

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
 const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173"
];; 

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

// Basic middlewares
app.use(helmet());                 // security headers
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json({ limit: "10mb" })); // parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Health check
app.get("/", (req, res) => {
  res.send("Server is running!");
});


// Mount routes - apply validation middleware here
// Only one route registration; middleware applied before controller
app.use("/api/sales", validateSalesQuery, salesRoutes);


// Static files (if you serve frontend from same server)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("public")); // adapt to your build folder
}

// Centralized error handler (must be after routes)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 5000).json({ message: err.message || "Internal Server Error" });
});

// Connect to MongoDB and start server
async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();

// graceful shutdown (optional but recommended)
process.on("SIGINT", async () => {
  console.info("SIGINT received: closing mongoose connection");
  await mongoose.connection.close();
  process.exit(0);
});
