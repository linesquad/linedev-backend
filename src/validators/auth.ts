import z from "zod";

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  role: z.enum(["client", "junior", "middle", "senior"]).default("client"),
  password: z.string().min(6),
  skills: z.array(z.string()).optional(),
  badges: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    iconUrl: z.string().url(),
  })).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
