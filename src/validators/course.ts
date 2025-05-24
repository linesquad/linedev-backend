import z from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  duration: z.string().min(1),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.number(),
  tags: z.array(z.string()),
});

export const updateCourseSchema = createCourseSchema.partial();
