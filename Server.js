import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import enquiryRoutes from "./routes/enquiryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config(); // Load environment variables

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/enquiries", enquiryRoutes);
app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
