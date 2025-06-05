import mongoose from "mongoose";

const YourLogoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
});

const YourLogo = mongoose.model("YourLogo", YourLogoSchema);

export default YourLogo;