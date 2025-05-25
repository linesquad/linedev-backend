import z from "zod";

export const teamSchema = z.object({
  name: z.string().min(1),
  bio: z.string().min(1),
  rank: z.string(),
  skills: z.array(z.string()).min(1),
  image: z.string().url(),
  projectUrl: z.array(z.string().url()).optional(),
  projectImages: z.array(z.string().url()).optional(),
});

export const updateTeamSchema = teamSchema.partial();
