import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "in progress", "done"],
      default: "pending",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    subtasks: [
      {
        title: {
          type: String,
          required: true,
        },
        done: {
          type: Boolean,
          default: false,
        },
      },
    ],
    feedback: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Auth",
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;


  // title: "Test Task",
  //       description: "This is a test task",
  //       status: "todo",
  //       priority: 1,
  //       dueDate: new Date(Date.now() + 86400000),
  //       assignedTo: userId,