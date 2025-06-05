import mongoose from "mongoose";
import { badgeSchema } from "./Badge";

export const authSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["client", "junior", "middle", "senior"],
    default: "client",
  },
  refreshToken: { type: String, default: null },
  skills: { type: [String], default: [] },
  badges: { type: [badgeSchema], default: [] },
  imageUrl: { type: String, default: "" },
});

const Auth = mongoose.model("Auth", authSchema);

export default Auth;
