import { Request, Response } from "express";
import Testimonial from "../models/Testimonial";

export const createTestimonial = async (req: Request, res: Response) => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({ message: "Testimonial created successfully", testimonial });
};

export const getTestimonials = async (req: Request, res: Response) => {
  const testimonials = await Testimonial.find();
  res.status(200).json({ testimonials });
};

export const updateTestimonial = async (req: Request, res: Response) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ message: "Testimonial updated successfully", testimonial });
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Testimonial deleted successfully" });
};