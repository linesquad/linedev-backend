import { Request, Response } from "express";
import Team from "../models/Team";

interface TeamFilters {
  rank?: string;
}

export const createTeam = async (req: Request, res: Response) => {
  const data = await Team.create(req.body);

  res.status(201).json({
    message: "Team created successfully",
    data,
  });
};

export const getTeam = async (req: Request, res: Response) => {
  const { rank } = req.query;
  const filters: TeamFilters = {};

  if (rank) filters.rank = rank as string;

  const data = await Team.find(filters).sort({ rank: 1 });

  res.status(200).json({
    message: "Team fetched successfully",
    data,
  });
};

export const updateTeam = async (req: Request, res: Response) => {
  const data = await Team.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!data) {
    res.status(404).json({
      message: "Team not found",
    });
    return;
  }
  res.status(200).json({
    message: "Team updated successfully",
    data,
  });
};

export const deleteTeam = async (req: Request, res: Response) => {
  const data = await Team.findByIdAndDelete(req.params.id);
  if (!data) {
    res.status(404).json({
      message: "Team not found",
    });
    return;
  }
  res.status(200).json({
    message: "Team deleted successfully",
    data,
  });
};
