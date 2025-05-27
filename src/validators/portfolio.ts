import z from "zod";

export const portfoliotSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string()),
  projectUrl: z.string().url(),
  images: z.array(z.string().url()),
});

export const updatePortfolioSchema=portfoliotSchema.partial()