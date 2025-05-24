import { Request, Response } from "express";
import Course from "../models/Courses";

export const createCourse = async (req: Request, res: Response) => {
  const data = await Course.create(req.body);
  res.status(201).json({ message: "Course created successfully", data });
};

export const getCourses = async (_req: Request, res: Response) => {
  const data = await Course.find().sort({ createdAt: -1 });
  res.status(200).json({ message: "Courses fetched successfully", data });
};

export const getCourseById = async (req: Request, res: Response) => {
  const data = await Course.findById(req.params.id);
  if (!data) {
    res.status(404).json({ message: "Course not found" });
    return;
  }
  res.status(200).json({ message: "Course fetched successfully", data });
};

export const updateCourse = async (req: Request, res: Response) => {
  const data = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!data) {
    res.status(404).json({ message: "Course not found" });
    return;
  }
  res.status(200).json({ message: "Course updated successfully", data });
};

export const deleteCourse = async (req: Request, res: Response) => {
  const data = await Course.findByIdAndDelete(req.params.id);
  if (!data) {
    res.status(404).json({ message: "Course not found" });
    return;
  }
  res.status(200).json({ message: "Course deleted successfully", data });
};
