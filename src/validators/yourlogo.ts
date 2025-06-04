import { z } from "zod";

export const yourLogoSchema = z.object({
  name: z.string().min(1),
  image: z.string().url().min(1),
});

export type YourLogo = z.infer<typeof yourLogoSchema>;