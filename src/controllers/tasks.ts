import Task from "../models/Tasks";
import { Request, Response } from "express";

const computeIsOverdue = (dueDate: Date, status: string): boolean => {
  return new Date() > new Date(dueDate) && status !== "done";
};

const addIsOverdueToTask = (task: {
  dueDate: Date;
  status: string;
  toObject: () => Record<string, any>;
}) => {
  return {
    ...task.toObject(),
    isOverdue: computeIsOverdue(task.dueDate, task.status),
  };
};

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await Task.find().sort({ createdAt: -1, priority: 1 });
  const tasksWithOverdue = tasks.map((task) => addIsOverdueToTask(task));
  res
    .status(200)
    .json({ message: "Tasks fetched successfully", tasks: tasksWithOverdue });
};

export const getMyTasks = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const tasks = await Task.find({ assignedTo: req.user }).sort({
    createdAt: -1,
    priority: 1,
  });
  const tasksWithOverdue = tasks.map((task) => addIsOverdueToTask(task));
  res.status(200).json({
    message: "Your tasks fetched successfully",
    tasks: tasksWithOverdue,
  });
};

export const getTaskById = async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id).sort({ priority: 1 });
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  const taskWithOverdue = addIsOverdueToTask(task);
  res
    .status(200)
    .json({ message: "Task fetched successfully", task: taskWithOverdue });
};

export const deleteTask = async (req: Request, res: Response) => {
  const deletedTask = await Task.findByIdAndDelete(req.params.id);
  if (!deletedTask) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  const taskWithOverdue = addIsOverdueToTask(deletedTask);
  res
    .status(200)
    .json({ message: "Task deleted successfully", task: taskWithOverdue });
};
export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      subtasks = [],
    } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      subtasks,
    });
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(400).json({ message: "Error creating task", error });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      status,
      dueDate,
      subtasks,
      assignedTo,
      priority,
    } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        status,
        dueDate,
        subtasks,
        assignedTo,
        priority,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating task", error });
  }
};
