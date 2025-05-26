import { Request, Response } from "express";
import Syllabus from "../models/Syllabus";

export const createSyllabus = async (req: Request, res: Response) => {
  const data = await Syllabus.create(req.body);
  res.status(201).json({ message: "Syllabus created successfully", data });
};

export const getSyllabus = async (_req: Request, res: Response) => {
  const data = await Syllabus.find().sort({ createdAt: -1 });

  res.status(200).json({ message: "Syllabus fetched successfully", data });
};

export const updateSyllabus = async (req: Request, res: Response) => {
  const data = await Syllabus.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!data) {
    res.status(404).json({ message: "Syllabus not found" });
    return;
  }
  res.status(200).json({ message: "Syllabus updated successfully", data });
};

export const deleteSyllabus = async (req: Request, res: Response) => {
  const data = await Syllabus.findByIdAndDelete(req.params.id);
  if (!data) {
    res.status(404).json({ message: "Syllabus not found" });
    return;
  }
  res.status(200).json({ message: "Syllabus deleted successfully", data });
};
