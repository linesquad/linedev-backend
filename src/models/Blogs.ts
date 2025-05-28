import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
