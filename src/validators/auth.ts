import z from "zod";

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  role: z.enum(["client", "junior", "middle", "senior"]).default("client"),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
