import { z } from "zod";

export const createTestimonialSchema = z.object({
  name: z.string().min(1),
  jobTitle: z.string().optional(),
  quote: z.string().min(1),
  imageUrl: z.string().url(),
});
