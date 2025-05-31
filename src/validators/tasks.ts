import z from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(["pending", "in progress", "done"]),
  dueDate: z.string().transform((str) => new Date(str)),
  assignedTo: z.string().min(1),
  priority: z.enum(["low", "medium", "high"]),
  subtasks: z.array(
    z.object({
      title: z.string().min(1),
      done: z.boolean().default(false),
    })
  ),
});

export const updateTaskSchema = createTaskSchema.partial();
