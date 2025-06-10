import { Request, Response } from "express";
import YourLogo from "../models/Yourlogo";

export const createYourLogo = async (req: Request, res: Response) => {
  const data = await YourLogo.create(req.body);

  res.status(201).json({
    message: "Your logo created successfully",
    data,
  });
};

export const getYourLogo = async (req: Request, res: Response) => {
  const yourLogo = await YourLogo.find();
  res.status(200).json({
    message: "Your logo fetched successfully",
    data: yourLogo,
  });
};

export const updateYourLogo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await YourLogo.findByIdAndUpdate(id, req.body, { new: true });
  if (!data) {
    res.status(404).json({
      message: "Your logo not found",
    });
    return;
  }
  res.status(200).json({
    message: "Your logo updated successfully",
    data,
  });
};

export const deleteYourLogo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await YourLogo.findByIdAndDelete(id);
  if (!data) {
    res.status(404).json({
      message: "Your logo not found",
    });
    return;
  }
  res.status(200).json({
    message: "Your logo deleted successfully",
  });
};
