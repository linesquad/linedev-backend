import { Request, Response } from "express";
import { getMyProfile } from "./profile";

export const juniorDashboard = async (req: Request, res: Response) => {
  const user = await getMyProfile(req, res);

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  res.status(200).json({ message: `Hello ${user.role}` });
};

export const middleDashboard = async (req: Request, res: Response) => {
  const user = await getMyProfile(req, res);

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  res.status(200).json({ message: `Hello ${user.role}` });
};

export const seniorDashboard = async (req: Request, res: Response) => {
  const user = await getMyProfile(req, res);

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  res.status(200).json({ message: `Hello ${user.role}` });
};
