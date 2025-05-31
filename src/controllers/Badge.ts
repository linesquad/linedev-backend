import { Request, Response } from "express";
import Auth from "../models/Auth";

export const updateSkills = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { skills } = req.body;

    const auth = await Auth.findById(id);
    if (!auth) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updatedSkills = Array.from(new Set([...auth.skills, ...skills]));
    auth.skills = updatedSkills;
    await auth.save();

    res.status(200).json({
      message: "Skills updated successfully",
      auth,
    });
  } catch (error) {
    console.error("Error updating skills:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addBadge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, iconUrl } = req.body;

    const auth = await Auth.findById(id);
    if (!auth) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const badgeExists = auth.badges.some((b) => b.title === title);
    if (badgeExists) {
      res.status(400).json({ message: "Badge already exists" });
      return;
    }

    const newBadge = { title, description, iconUrl, awardedAt: new Date() };
    auth.badges.push(newBadge);
    await auth.save();

    res.status(200).json({ message: "Badge added successfully", auth });
  } catch (error) {
    console.error("Error adding badge:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
