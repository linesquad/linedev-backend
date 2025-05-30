import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  skills: z.array(z.string()).optional(),
  badges: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    iconUrl: z.string().url(),
  })).optional(),
});

export type CreateUserSchema = z.infer<typeof userSchema>;