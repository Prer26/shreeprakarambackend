import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import enquiryRoutes from "./routes/enquiryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/enquiries", enquiryRoutes);
app.use("/api/reviews", reviewRoutes);

mongoose.connect(
  "mongodb://127.0.0.1:27017/divinedb", // your DB name here
).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));
