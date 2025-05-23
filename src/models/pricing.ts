import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
}, { timestamps: true });

const Pricing = mongoose.model("Pricing", pricingSchema);

export default Pricing;