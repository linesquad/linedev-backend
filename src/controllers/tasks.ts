import Task from "../models/Tasks";
import { Request, Response } from "express";

export const createTask = async (req: Request, res: Response) => {
  const task = await Task.create(req.body);
  res.status(201).json({ message: "Task created successfully", task });
};

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.status(200).json({ message: "Tasks fetched successfully", tasks });
};

export const getTaskById = async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.status(200).json({ message: "Task fetched successfully", task });
};

export const updateTask = async (req: Request, res: Response) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updatedTask) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.status(200).json({ message: "Task updated successfully", updatedTask });
};

export const deleteTask = async (req: Request, res: Response) => {
  const deletedTask = await Task.findByIdAndDelete(req.params.id);
  if (!deletedTask) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.status(200).json({ message: "Task deleted successfully", deletedTask });
};
