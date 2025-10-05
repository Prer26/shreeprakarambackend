import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventType: { type: String, required: true },
  eventDate: { type: String },
  message: { type: String }
}, { timestamps: true });

export default mongoose.model("Enquiry", enquirySchema);
