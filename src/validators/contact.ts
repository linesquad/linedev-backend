import z from "zod";

export const contactSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10).max(300),
});

export const updateContactSchema = contactSchema.partial().extend({
  status: z.enum(["new", "in review", "responded", "closed"]),
});
