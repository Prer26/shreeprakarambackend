import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file (for local use)
dotenv.config();

const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
    'https://shreeprakarm.vercel.app', 
    'http://localhost:3000',           
    'http://localhost:5173'            
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
};

app.use(cors(corsOptions)); 
app.use(express.json()); 
// --- END CORS Configuration ---


// --- 1. Mongoose Schema Definition (NEW) ---

// Define the schema for an Enquiry
const EnquirySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, 
             match: [/.+@.+\..+/, 'Please fill a valid email address'] },
    message: { type: String, required: true, trim: true },
    // Automatically adds createdAt and updatedAt fields
    receivedAt: { type: Date, default: Date.now }
}, { 
    timestamps: false // We use the custom 'receivedAt' above, so we keep timestamps false
});

// Create the Mongoose Model
const Enquiry = mongoose.model('Enquiry', EnquirySchema);

// --- 2. Route Controller for Enquiries (UPDATED) ---

const enquiryRoutes = express.Router();
// POST route to submit a new enquiry
enquiryRoutes.post("/", async (req, res) => {
    try {
        // Create a new enquiry document using the model
        const newEnquiry = new Enquiry(req.body);
        
        // Save the document to the MongoDB 'enquiries' collection
        await newEnquiry.save();
        
        // Respond with success
        res.status(201).json({ 
            status: "success",
            message: "Enquiry received and saved successfully.",
            data: newEnquiry 
        });
    } catch (error) {
        // Handle validation errors (e.g., missing required fields) or database errors
        res.status(400).json({ 
            status: "error",
            message: "Failed to submit enquiry.",
            error: error.message 
        });
    }
});

// --- MOCK ROUTERS (Now just reviews, will update next) ---
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

// --- ROOT ROUTE / HEALTH CHECK ---
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
