import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file (for local use)
dotenv.config();

const app = express();

// --- MOCK ROUTERS (Placeholder for imported routes) ---
// In a real application, these would be imported from separate files.
const enquiryRoutes = express.Router();
enquiryRoutes.post("/", (req, res) => {
    // Mock handler for creating an enquiry
    console.log("Mock Enquiry Data:", req.body);
    res.status(201).json({ message: "Enquiry received successfully." });
});

const reviewRoutes = express.Router();
reviewRoutes.get("/", (req, res) => {
    // Mock handler for fetching reviews
    res.status(200).json({ 
        count: 2, 
        data: [
            { id: 1, text: "Amazing experience!" }, 
            { id: 2, text: "Highly recommend." }
        ] 
    });
});
// --- END MOCK ROUTERS ---


// --- Middleware Configuration ---
app.use(cors()); // Enables all CORS requests (adjust origin for production security)
app.use(express.json()); // Allows the server to parse JSON payloads

// --- API Routes ---
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/reviews", reviewRoutes);

// --- ROOT ROUTE / HEALTH CHECK (Crucial for deployment health checks) ---
// This prevents the common "Cannot GET /" error on platforms like Render.
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Shreeprakaram Backend API is running successfully!",
        version: "1.0",
        // This shows the port Render is using (e.g., 10000) or 5000 locally
        serving_on: process.env.PORT || 5000 
    });
});

// --- 404 Route (Must be placed last) ---
app.use((req, res, next) => {
    res.status(404).json({
        status: "error",
        message: `Resource not found at ${req.originalUrl}`
    });
});


// --- Configuration & Initialization ---

// CRITICAL FOR DEPLOYMENT: Use the port provided by the hosting environment (process.env.PORT)
// and fall back to 5000 for local development.
const PORT = process.env.PORT || 5000;

// Database Connection
// Ensure process.env.MONGO_URL is set correctly on Render's Environment Variables page
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    
    // Server Start (only start server after successful DB connection)
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.log("MongoDB connection failed! Error:", err.message);
    // Optionally exit the process if the database is critical
    // process.exit(1); 
  });
