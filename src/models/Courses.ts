import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    level: { enum: ["beginner", "intermediate", "advanced"] },
    price: { type: Number, required: true },
    tags: { type: [String], required: true },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
