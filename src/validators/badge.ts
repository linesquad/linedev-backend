import { z } from "zod";

export const updateSkillsSchema = z.object({
  skills: z.array(z.string()),
});

export const addBadgeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  iconUrl: z.string().url(),
});

export type UpdateSkillsSchema = z.infer<typeof updateSkillsSchema>;
export type AddBadgeSchema = z.infer<typeof addBadgeSchema>;