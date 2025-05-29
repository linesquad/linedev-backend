import Task from "../models/Tasks";
import { Request, Response } from "express";

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.create({
      ...req.body,
      subtasks: req.body.subtasks || [],
    });
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(400).json({ message: "Error creating task", error });
  }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.status(200).json({ message: "Tasks fetched successfully", tasks });
};

export const getTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.status(200).json({ message: "Task fetched successfully", task });
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        subtasks: req.body.subtasks || task.subtasks,
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(400).json({ message: "Error updating task", error });
  }
};

export const toggleSubtask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      res.status(404).json({ message: "Subtask not found" });
      return;
    }

    // Toggle the done status
    subtask.done = !subtask.done;
    await task.save();

    res.status(200).json({
      message: "Subtask status toggled successfully",
      task,
    });
  } catch (error) {
    res.status(400).json({ message: "Error toggling subtask", error });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: { subtasks: [] } },
      { new: true }
    );

    if (!updatedTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Task deleted successfully",
      deletedTask: { ...deletedTask?.toObject(), subtasks: [] },
    });
  } catch (error) {
    res.status(400).json({ message: "Error deleting task", error });
  }
};
