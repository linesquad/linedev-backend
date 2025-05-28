import { z } from "zod";

export const createReviewSchema = z.object({
  course: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(300).optional(),
  user: z.string(),
});

export const updateReviewSchema = createReviewSchema.partial();
