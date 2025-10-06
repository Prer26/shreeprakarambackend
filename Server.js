import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file (for local use)
dotenv.config();

const app = express();

// --- CORS Configuration (UPDATED) ---
// Allowing only your Vercel frontend domain to access the API.
const allowedOrigins = [
    'https://shreeprakarm.vercel.app', // Your live frontend URL
    'http://localhost:3000',           // Common local frontend dev port
    'http://localhost:5173'            // Common local frontend dev port (e.g., Vite)
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or postman)
    if (!origin) return callback(null, true); 
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Block requests from unauthorized origins
      callback(new Error('Not allowed by CORS'));
    }
  },
  // Include credentials (cookies, auth headers) in CORS requests
  credentials: true 
};

app.use(cors(corsOptions)); 
app.use(express.json()); 
// --- END CORS Configuration ---


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


// --- API Routes ---
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/reviews", reviewRoutes);

// --- ROOT ROUTE / HEALTH CHECK (Crucial for deployment health checks) ---
app.get("/", (req, res) => {
    const connectionString = process.env.MONGO_URL || process.env.MONGODB_URI || "Not configured";
    const maskedString = connectionString.replace(/:\/\/[^@:]+:[^@]+@/, '://<user>:<password>@');

    res.status(200).json({
        status: "success",
        message: "Shreeprakaram Backend API is running successfully!",
        version: "1.0",
        serving_on: process.env.PORT || 5000,
        database_uri_check: maskedString
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

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URL || process.env.MONGODB_URI;

if (!DB_URI) {
    console.error("FATAL ERROR: Database connection string (MONGO_URL or MONGODB_URI) is not defined.");
}

mongoose.connect(DB_URI)
  .then(() => {
    console.log("MongoDB connected");
    
    // Server Start (only start server after successful DB connection)
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.log("MongoDB connection failed! Error:", err.message);
  });
