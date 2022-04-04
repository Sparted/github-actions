import { z } from 'zod';

export const Task = z.object({
  id: z.string(),
  name: z.string(),
  status: z.object({
    id: z.string(),
    status: z.string(),
    type: z.string(),
  }),
  custom_fields: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
  })),
  list: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export type TaskType = z.infer<typeof Task>;
