  import Task from "../models/Tasks";
  import { Request, Response } from "express";

  export const createTask = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        title,
        description,
        status,
        // priority,
        dueDate,
        assignedTo,
        subtasks = [],
      } = req.body;
      const task = await Task.create({
        title,
        description,
        status,
        // priority,
        dueDate,
        assignedTo,
        subtasks,
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
      const { title, description, status, dueDate, subtasks, assignedTo } =
        req.body;

      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          status,
          dueDate,
          subtasks, // expects full updated array with toggled `done` values
          assignedTo,
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
      console.error("Error updating task:", error);
      res.status(400).json({ message: "Error updating task", error });
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
