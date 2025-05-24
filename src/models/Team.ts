import mongoose from "mongoose";

export const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bio: { type: String, required: true },
    rank: { type: Number, required: true },
    skills: { type: [String], required: true },
    image: { type: String, required: true },
    projectUrl: { type: [String] },
    projectImages: { type: [String] },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
