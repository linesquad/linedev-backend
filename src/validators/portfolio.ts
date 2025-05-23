import z from "zod";

export const createClientSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string()).min(1),
  projectUrl: z.string().url(),
  images: z.array(z.string().url()),
  createdBy: z.string().min(1),
});
