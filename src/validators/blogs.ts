import z from "zod";

export const createBlogValidator = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  author: z.string().min(1),
  tags: z.array(z.string()).min(1),
  image: z.string().url().optional(),
  category: z.string().min(1),
  isFeatured: z.boolean().optional(),
  views: z.number().optional(),
});

export const updateBlogValidator = createBlogValidator.partial();
