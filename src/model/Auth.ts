import mongoose from "mongoose";

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
});

const Auth = mongoose.model("Auth", authSchema);

export default Auth;
