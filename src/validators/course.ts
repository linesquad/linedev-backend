import z from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  duration: z.string().min(1),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.number(),
  tags: z.array(z.string()),
  syllabus: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      week: z.string().min(1),
    })
  ).min(1),
});

export const updateCourseSchema = createCourseSchema.partial();
