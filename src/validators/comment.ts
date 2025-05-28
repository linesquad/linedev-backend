import { z } from "zod";

export const createCommentSchema = z.object({
  blogId: z.string().min(1),
  name: z.string().min(1),
  content: z.string().min(1),
  approved: z.boolean(),
});
