import z from "zod";

export const createClientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().min(9).max(12).optional(),
  phone: z.string().min(1),
  services: z.array(z.string()).min(1),
  message: z.string().min(5).max(255),
});
