import { Request, Response } from "express";
import Task from "../models/Tasks";

export const getDeveloperAnalytics = async (req: Request, res: Response) => {
  try {
    const analytics = await Task.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          totalAssigned: { $sum: 1 },
          totalCompleted: {
            $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] },
          },
          pendingTasks: {
            $sum: { $cond: [{ $ne: ["$status", "done"] }, 1, 0] },
          },
          avgCompletionTime: {
            $avg: {
              $cond: [
                { $eq: ["$status", "done"] },
                { $subtract: ["$updatedAt", "$createdAt"] },
                null,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "Auth",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: {
          "user.role": { $in: ["senior"] },
        },
      },
      {
        $project: {
          userId: "$_id",
          name: "$user.name",
          rank: "$user.role",
          totalAssigned: 1,
          totalCompleted: 1,
          completionRate: {
            $cond: [
              { $eq: ["$totalAssigned", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$totalCompleted", "$totalAssigned"] },
                      100,
                    ],
                  },
                  2,
                ],
              },
            ],
          },
          avgCompletionTime: {
            $cond: [
              { $gt: ["$avgCompletionTime", 0] },
              {
                $round: [
                  {
                    $divide: ["$avgCompletionTime", 1000 * 60 * 60 * 24],
                  },
                  2,
                ],
              },
              null,
            ],
          },
          pendingTasks: 1,
        },
      },
    ]);

    res.status(200).json({ message: "Analytics fetched successfully", analytics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};

