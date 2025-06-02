import z from "zod";

const taskSchema = z.object({
  title: z.string().min(1),
  status: z.enum(["Pending", "In Progress", "Completed"]),
});

export const developerProfileSchema = z.object({
  name: z.string().min(1),
  rank: z.string().min(1),
  bio: z.string().min(1),
  skills: z.array(z.string()),
  profileImage: z.string().url().optional(),
  tasks: z.array(taskSchema).optional(),
});

export const updateDeveloperSchema = developerProfileSchema.partial();
