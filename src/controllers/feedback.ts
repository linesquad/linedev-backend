import Task from "../models/Tasks";
import { Request, Response } from "express";

export const addFeedback = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      res.status(400).json({ message: "Task ID is required" });
      return;
    }
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    const { comment, author } = req.body;
    if (!comment || !author) {
      res.status(400).json({
        message: "Comment and author are required",
      });
      return;
    }

    const taskFeedback = await Task.findByIdAndUpdate(
      taskId,
      {
        $push: {
          feedback: {
            author,
            comment,
          },
        },
      },
      { new: true }
    );

    if (!taskFeedback) {
      res.status(500).json({
        message: "Failed to add feedback",
      });
      return;
    }

    res.status(200).json({
      message: "Feedback added successfully",
      taskFeedback,
    });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({
      message: "An error occurred while adding feedback",
    });
  }
};

export const getFeedback = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      res.status(400).json({ message: "Task ID is required" });
      return;
    }
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.status(200).json({
      message: "Feedback fetched successfully",
      feedback: task.feedback,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({
      message: "An error occurred while fetching feedback",
    });
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const { taskId, feedbackId } = req.params;
    if (!taskId || !feedbackId) {
      res.status(400).json({
        message: "Task ID and feedback ID are required",
      });
      return;
    }
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    if (!feedbackId) {
      res.status(400).json({ message: "Feedback ID is required" });
      return;
    }

    const feedback = task.feedback.find(
      (f) => f._id?.toString() === feedbackId
    );

    if (!feedback) {
      res.status(404).json({ message: "Feedback not found" });
      return;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        $pull: {
          feedback: {
            _id: feedbackId,
          },
        },
      },
      { new: true }
    );

    if (!updatedTask) {
      res.status(404).json({ message: "Failed to delete feedback" });
      return;
    }

    res.status(200).json({
      message: "Feedback deleted successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({
      message: "An error occurred while deleting feedback",
    });
  }
};
