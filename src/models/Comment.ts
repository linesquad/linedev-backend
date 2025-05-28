import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  name: { type: String, required: true },
  content: { type: String, required: true },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;