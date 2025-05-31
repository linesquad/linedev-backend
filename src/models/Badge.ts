import mongoose from "mongoose";

export const badgeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  iconUrl: String,
  awardedAt: { type: Date, default: Date.now },
})

const Badge = mongoose.model("Badge", badgeSchema);

export default Badge;