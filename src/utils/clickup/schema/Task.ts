import { z } from 'zod';

export const Task = z.object({
  id: z.string(),
});

export type TaskType = z.infer<typeof Task>;
