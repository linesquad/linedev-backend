import { Request, Response } from "express";
import User from "../models/User";

export const updateSkills = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { skills } = req.body;

  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const updatedSkills = Array.from(new Set([...user.skills, ...skills]));
  user.skills = updatedSkills;
  await user.save();

  res.status(200).json({
    message: "Skills updated successfully",
    user,
  });
};

export const addBadge = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, iconUrl } = req.body;
  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return
  }
  const badgeExists = user.badges.some((b) => b.title == title);
  if (badgeExists) {
    res.status(400).json({ message: "Badge already exists" });
    return;
  }
  const newBadge = { title, description, iconUrl, awardedAt: new Date() };
  user.badges.push(newBadge);
  await user.save();
  res.status(200).json({ message: "Badge added successfully", user });
};
