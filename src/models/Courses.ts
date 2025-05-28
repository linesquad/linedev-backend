import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    level: { enum: ["beginner", "intermediate", "advanced"] },
    price: { type: Number, required: true },
    tags: { type: [String], required: true },
    syllabus: {
      type: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
          week: { type: String, required: true },
        },
      ],
      required: true,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
