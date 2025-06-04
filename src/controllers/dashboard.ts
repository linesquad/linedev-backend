import { Request, Response } from "express";

export const clientDashboard = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Client Dashboard" });
};

export const juniorDashboard = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Junior Dashboard" });
};

export const middleDashboard = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Middle Dashboard" });
};

export const seniorDashboard = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Senior Dashboard" });
};
