import { Request, Response } from "express";
import Auth from "../models/Auth";

export const me = async (req: Request, res: Response) => {
  const userId = req.user;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await Auth.findById(userId);

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  res.status(200).json({
    message: "Your profile",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  });
};
export const getMyProfile = async (req: Request, res: Response) => {
  const userId = req.user;

  if (!userId) {
    return null;
  }

  const user = await Auth.findById(userId);

  if (!user) {
    return null;
  }

  return user;
};
