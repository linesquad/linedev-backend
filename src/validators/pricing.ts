import { z } from "zod";

export const pricingSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  features: z.array(z.string()).min(1),
});