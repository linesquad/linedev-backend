import z from "zod";

export const syllabusSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  week: z.string().min(1),
});

export const updateSyllabusSchema = syllabusSchema.partial();
