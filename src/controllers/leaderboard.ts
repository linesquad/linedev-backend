import { Request, Response } from "express";
import Auth from "../models/Auth";
import Task from "../models/Tasks";

// დაითვლა
const getLeaderboardData = async () => {
  const developers = await Auth.find({
    role: { $in: ["junior", "middle", "senior"] },
  });

  const leaderboard = await Promise.all(
    developers.map(async (dev) => {
      const completedCount = await Task.countDocuments({
        userId: dev._id,
        status: "done",
      });

      return {
        name: dev.name,
        rank: dev.role,
        totalCompletedTasks: completedCount,
        imageUrl: dev.imageUrl || "",
      };
    })
  );

  leaderboard.sort((a, b) => b.totalCompletedTasks - a.totalCompletedTasks);

  return leaderboard;
};

// მხოლოდ 10
export const getPublicLeaderboard = async (_req: Request, res: Response) => {
  const leaderboard = await getLeaderboardData();
  const top10 = leaderboard.slice(0, 10);
  res.status(200).json({ message: "Top 10 developers fetched", data: top10 });
};

// სენიორისთვის ყველა
export const getFullLeaderboard = async (req: Request, res: Response) => {
  const leaderboard = await getLeaderboardData();
  res
    .status(200)
    .json({ message: "Full leaderboard fetched", data: leaderboard });
};
