import { Request, Response } from "express";
import Pricing from "../models/Pricing";

export const createPricing = async (req: Request, res: Response) => {
  const pricing = await Pricing.create(req.body);
  res.status(201).json({ message: "Pricing created successfully", pricing });
};

export const getPricing = async (_req: Request, res: Response) => {
  const pricing = await Pricing.find().sort({ createdAt: -1 });
  res.status(200).json(pricing);
};

export const updatePricing = async (req: Request, res: Response) => {
  const updatedPricing = await Pricing.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!updatedPricing) {
    res.status(404).json({ message: "Pricing not found" });
    return;
  }
  res
    .status(200)
    .json({ message: "Pricing updated successfully", updatedPricing });
};

export const deletePricing = async (req: Request, res: Response) => {
  const deletedPricing = await Pricing.findByIdAndDelete(req.params.id);
  if (!deletedPricing) {
    res.status(404).json({ message: "Pricing not found" });
    return;
  }
  res.status(200).json({ message: "Pricing deleted successfully" });
};
