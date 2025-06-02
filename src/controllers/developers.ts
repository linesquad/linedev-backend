
import { Request, Response } from "express";
import Developer from "../models/developer";


export const createDeveloper = async (req: Request, res: Response) => {
  const data = await Developer.create(req.body);
  res.status(201).json({ message: "Developer created successfully", data });
};


export const getDevelopers = async (_req: Request, res: Response) => {
  const data = await Developer.find().sort({ createdAt: -1 }).populate("tasks");
  res.status(200).json({ message: "Developers fetched successfully", data });
};


export const getDeveloperById = async (req: Request, res: Response) => {
  const data = await Developer.findById(req.params.id).populate("tasks");
  if (!data) {
    res.status(404).json({ message: "Developer not found" });
    return;
  }
  res.status(200).json({ message: "Developer fetched successfully", data });
};


export const updateDeveloper = async (req: Request, res: Response) => {
  const data = await Developer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate("tasks");
  if (!data) {
    res.status(404).json({ message: "Developer not found" });
    return;
  }
  res.status(200).json({ message: "Developer updated successfully", data });
};


export const deleteDeveloper = async (req: Request, res: Response) => {
  const data = await Developer.findByIdAndDelete(req.params.id);
  if (!data) {
    res.status(404).json({ message: "Developer not found" });
    return;
  }
  res.status(200).json({ message: "Developer deleted successfully", data });
};
