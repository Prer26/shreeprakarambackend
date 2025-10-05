import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  event: { type: String, required: true },
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  date: { type: String, default: new Date().toLocaleString("default", { month: "long", year: "numeric" }) },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
