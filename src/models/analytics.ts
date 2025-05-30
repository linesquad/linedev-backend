import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rank: {
    type: String,
    required: true,
  },
  totalAssigned: {
    type: Number,
    required: true,
  },
  totalCompleted: {
    type: Number,
    required: true,
  },
  completionRate: {
    type: Number,
    required: true,
  },
  avgCompletionTime: {
    type: Number,
    required: true,
  },
  pendingTasks: {
    type: Number,
    required: true,
  },
});

const Analytics = mongoose.model("Analytics", AnalyticsSchema);

export default Analytics;