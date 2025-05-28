import mongoose from "mongoose";

export const ReviewSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ course: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
