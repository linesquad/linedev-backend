import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  iconUrl: String,
  awardedAt: { type: Date, default: Date.now },
})
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: { type: [String], default: [] },
  badges: { type: [badgeSchema], default: [] },
});

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

export default User;