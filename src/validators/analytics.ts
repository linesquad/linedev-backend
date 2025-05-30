import { z } from "zod";

const analyticsSchema = z.object({
  name: z.string().min(1),
  rank: z.string(),
  totalAssigned: z.number(),
  totalCompleted: z.number(),
  completionRate: z.number(),
  avgCompletionTime: z.number(),
  pendingTasks: z.number(),
});