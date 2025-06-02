import mongoose from "mongoose";

const developerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rank: {
      type: String,
      required: true,
      enum: ["junior", "middle", "senior"],
    },
    bio: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    profileImage: {
      type: String,
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true }
);

const Developer = mongoose.model("Developer", developerSchema);

export default Developer;
